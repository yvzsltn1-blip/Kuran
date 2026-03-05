import { doc, getDoc, setDoc, onSnapshot } from "firebase/firestore";
import { db } from "./firebase";
import type { BookmarkWithNote, FavoriteWord } from "@/stores/quran-store";

export interface UserFirestoreData {
  bookmarks: BookmarkWithNote[];
  favoriteWords: FavoriteWord[];
  readingProgress: Record<string, number>;
  lastReadPage: number;
  selectedReciter: string;
  currentTranslation: string;
  progress: {
    wordsLearned: number;
    lessonsCompleted: number;
    quizScore: number;
    streak: number;
    lastActivity: string;
  };
}

export async function loadUserData(uid: string): Promise<Partial<UserFirestoreData>> {
  try {
    const snap = await getDoc(doc(db, "users", uid));
    if (snap.exists()) return snap.data() as UserFirestoreData;
    return {};
  } catch {
    return {};
  }
}

export async function saveUserData(uid: string, data: Partial<UserFirestoreData>): Promise<void> {
  try {
    await setDoc(doc(db, "users", uid), data, { merge: true });
  } catch (e) {
    console.error("[Firestore] save error:", e);
  }
}

// ─── Global Settings ──────────────────────────────────────────────────────────

export async function loadGlobalSettings(): Promise<{ registrationEnabled: boolean }> {
  try {
    const snap = await getDoc(doc(db, "settings", "global"));
    if (snap.exists()) return snap.data() as { registrationEnabled: boolean };
    return { registrationEnabled: true };
  } catch {
    return { registrationEnabled: true };
  }
}

export async function saveGlobalSettings(data: { registrationEnabled: boolean }): Promise<void> {
  try {
    await setDoc(doc(db, "settings", "global"), data);
  } catch (e) {
    console.error("[Firestore] settings save error:", e);
  }
}

export function subscribeGlobalSettings(
  callback: (data: { registrationEnabled: boolean }) => void
): () => void {
  return onSnapshot(
    doc(db, "settings", "global"),
    (snap) => {
      if (snap.exists()) {
        callback(snap.data() as { registrationEnabled: boolean });
      } else {
        callback({ registrationEnabled: true });
      }
    },
    () => callback({ registrationEnabled: true })
  );
}
