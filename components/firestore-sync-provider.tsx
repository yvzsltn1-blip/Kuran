"use client";

import { useEffect, useRef } from "react";
import { useQuranStore } from "@/stores/quran-store";
import { useAuth } from "@/context/auth-context";
import { saveUserData } from "@/lib/firestore-sync";

export function FirestoreSyncProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isFirstRun = useRef(true);

  useEffect(() => {
    if (!user) {
      isFirstRun.current = true;
      return;
    }

    const flush = () => {
      const state = useQuranStore.getState();
      saveUserData(user.id, {
        bookmarks: state.bookmarks,
        favoriteWords: state.favoriteWords,
        readingProgress: state.readingProgress,
        lastReadPage: state.lastReadPage,
        selectedReciter: state.selectedReciter,
        currentTranslation: state.currentTranslation,
      });
    };

    const unsubscribe = useQuranStore.subscribe(() => {
      if (isFirstRun.current) {
        isFirstRun.current = false;
        return;
      }

      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }

      timerRef.current = setTimeout(() => {
        flush();
      }, 2000);
    });

    window.addEventListener("pagehide", flush);

    return () => {
      unsubscribe();
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      window.removeEventListener("pagehide", flush);
    };
  }, [user?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  return <>{children}</>;
}
