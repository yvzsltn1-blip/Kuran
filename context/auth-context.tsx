"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  signOut as firebaseSignOut,
  type User as FirebaseUser,
} from "firebase/auth";
import { auth } from "@/lib/firebase";
import { loadUserData, saveUserData } from "@/lib/firestore-sync";
import { useQuranStore } from "@/stores/quran-store";

interface User {
  id: string;
  name: string;
  email: string;
  joinedAt: string;
  progress: {
    wordsLearned: number;
    lessonsCompleted: number;
    quizScore: number;
    streak: number;
    lastActivity: string;
  };
}

interface AuthContextType {
  user: User | null;
  isAdmin: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (name: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  updateProgress: (updates: Partial<User["progress"]>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const defaultProgress = (): User["progress"] => ({
  wordsLearned: 0,
  lessonsCompleted: 0,
  quizScore: 0,
  streak: 1,
  lastActivity: new Date().toISOString(),
});

function mergeBookmarks(
  localBookmarks: ReturnType<typeof useQuranStore.getState>["bookmarks"],
  remoteBookmarks: ReturnType<typeof useQuranStore.getState>["bookmarks"]
) {
  const merged = new Map<string, ReturnType<typeof useQuranStore.getState>["bookmarks"][number]>();

  for (const bookmark of localBookmarks) {
    merged.set(bookmark.id, bookmark);
  }

  for (const bookmark of remoteBookmarks) {
    const existing = merged.get(bookmark.id);
    if (!existing) {
      merged.set(bookmark.id, bookmark);
      continue;
    }

    const existingTime = new Date(existing.updatedAt).getTime();
    const incomingTime = new Date(bookmark.updatedAt).getTime();
    merged.set(bookmark.id, incomingTime >= existingTime ? bookmark : existing);
  }

  return [...merged.values()];
}

function mergeFavoriteWords(
  localWords: ReturnType<typeof useQuranStore.getState>["favoriteWords"],
  remoteWords: ReturnType<typeof useQuranStore.getState>["favoriteWords"]
) {
  const merged = new Map<string, ReturnType<typeof useQuranStore.getState>["favoriteWords"][number]>();

  for (const word of [...localWords, ...remoteWords]) {
    const existing = merged.get(word.id);
    if (!existing) {
      merged.set(word.id, word);
      continue;
    }

    const existingTime = new Date(existing.savedAt).getTime();
    const incomingTime = new Date(word.savedAt).getTime();
    merged.set(word.id, incomingTime >= existingTime ? word : existing);
  }

  return [...merged.values()];
}

function buildProfile(firebaseUser: FirebaseUser, progress?: User["progress"]): User {
  return {
    id: firebaseUser.uid,
    name: firebaseUser.displayName || firebaseUser.email?.split("@")[0] || "Kullanıcı",
    email: firebaseUser.email || "",
    joinedAt: firebaseUser.metadata.creationTime || new Date().toISOString(),
    progress: progress || defaultProgress(),
  };
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const tokenResult = await firebaseUser.getIdTokenResult(true);
        const adminClaim = !!tokenResult.claims.admin;
        setIsAdmin(adminClaim);

        // Load all user data from Firestore
        const firestoreData = await loadUserData(firebaseUser.uid);

        // Build profile (with progress from Firestore if available)
        const profile = buildProfile(firebaseUser, firestoreData.progress);
        setUser(profile);

        // Hydrate quran store from Firestore
        const currentStore = useQuranStore.getState();
        const storeUpdate: Record<string, unknown> = {};
        if (firestoreData.bookmarks !== undefined) {
          storeUpdate.bookmarks = mergeBookmarks(currentStore.bookmarks, firestoreData.bookmarks);
        }
        if (firestoreData.favoriteWords !== undefined) {
          storeUpdate.favoriteWords = mergeFavoriteWords(currentStore.favoriteWords, firestoreData.favoriteWords);
        }
        if (firestoreData.readingProgress !== undefined) {
          storeUpdate.readingProgress = { ...currentStore.readingProgress, ...firestoreData.readingProgress };
        }
        if (firestoreData.lastReadPage !== undefined) storeUpdate.lastReadPage = firestoreData.lastReadPage;
        if (firestoreData.selectedReciter !== undefined) storeUpdate.selectedReciter = firestoreData.selectedReciter;
        if (firestoreData.currentTranslation !== undefined) storeUpdate.currentTranslation = firestoreData.currentTranslation;
        if (Object.keys(storeUpdate).length > 0) {
          useQuranStore.setState(storeUpdate);
        }
      } else {
        setUser(null);
        setIsAdmin(false);
        useQuranStore.getState().reset();
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      return { success: true };
    } catch (err: unknown) {
      const code = (err as { code?: string }).code;
      if (code === "auth/user-not-found" || code === "auth/invalid-credential") {
        return { success: false, error: "Bu e-posta ile kayıtlı kullanıcı bulunamadı." };
      }
      if (code === "auth/wrong-password") {
        return { success: false, error: "Şifre hatalı." };
      }
      return { success: false, error: "Giriş yapılırken bir hata oluştu." };
    }
  };

  const register = async (name: string, email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const credential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(credential.user, { displayName: name });

      const initialProgress = defaultProgress();

      // Save initial profile to Firestore
      await saveUserData(credential.user.uid, { progress: initialProgress });

      // Also keep localStorage users list for admin panel compatibility
      const usersRaw = localStorage.getItem("quran_users");
      const users: Array<{ uid: string; id: string; name: string; email: string; joinedAt: string; progress: User["progress"] }> = usersRaw ? JSON.parse(usersRaw) : [];
      if (!users.find((u) => u.email.toLowerCase() === email.toLowerCase())) {
        users.push({
          uid: credential.user.uid,
          id: credential.user.uid,
          name,
          email,
          joinedAt: new Date().toISOString(),
          progress: initialProgress,
        });
        localStorage.setItem("quran_users", JSON.stringify(users));
      }

      return { success: true };
    } catch (err: unknown) {
      const code = (err as { code?: string }).code;
      if (code === "auth/email-already-in-use") {
        return { success: false, error: "Bu e-posta zaten kayıtlı." };
      }
      if (code === "auth/weak-password") {
        return { success: false, error: "Şifre en az 6 karakter olmalıdır." };
      }
      return { success: false, error: "Kayıt olurken bir hata oluştu." };
    }
  };

  const logout = () => {
    firebaseSignOut(auth);
  };

  const updateProgress = (updates: Partial<User["progress"]>) => {
    if (!user) return;
    const updatedProgress = { ...user.progress, ...updates, lastActivity: new Date().toISOString() };
    const updatedUser = { ...user, progress: updatedProgress };
    setUser(updatedUser);

    // Save to Firestore
    const fbUser = auth.currentUser;
    if (fbUser) {
      saveUserData(fbUser.uid, { progress: updatedProgress });
    }
  };

  return (
    <AuthContext.Provider value={{ user, isAdmin, isLoading, login, register, logout, updateProgress }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
