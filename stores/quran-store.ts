import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export interface BookmarkWithNote {
  id: string;
  note?: string;
  createdAt: string;
  updatedAt: string;
}

export interface FavoriteWord {
  id: string; // "surahId:verseNum:wordId"
  arabic: string;
  transcription_tr: string;
  translation_tr: string;
  root: { latin: string; arabic: string } | null;
  savedAt: string;
}

interface QuranState {
  currentTranslation: string;
  selectedReciter: string;
  bookmarks: BookmarkWithNote[];
  favoriteWords: FavoriteWord[];
  readingProgress: Record<string, number>;
  lastReadPage: number;
  setTranslation: (translation: string) => void;
  setReciter: (reciterId: string) => void;
  toggleBookmark: (id: string) => void;
  addOrUpdateBookmarkNote: (id: string, note: string) => void;
  removeBookmarkNote: (id: string) => void;
  updateProgress: (pageId: string, progress: number) => void;
  setLastReadPage: (page: number) => void;
  isBookmarked: (id: string) => boolean;
  getBookmarkNote: (id: string) => string | undefined;
  toggleFavoriteWord: (word: FavoriteWord) => void;
  isFavoriteWord: (id: string) => boolean;
  reset: () => void;
}

const initialState = {
  currentTranslation: "tr",
  selectedReciter: "Alafasy_128kbps",
  bookmarks: [],
  favoriteWords: [],
  readingProgress: {},
  lastReadPage: 1,
};

export const useQuranStore = create<QuranState>()(
  persist(
    (set, get) => ({
      ...initialState,

      setTranslation: (translation) => set({ currentTranslation: translation }),
      setReciter: (reciterId) => set({ selectedReciter: reciterId }),

      toggleBookmark: (id) =>
        set((state) => {
          const existing = state.bookmarks.find((b) => b.id === id);
          const now = new Date().toISOString();
          if (existing) {
            return { bookmarks: state.bookmarks.filter((b) => b.id !== id) };
          }
          return { bookmarks: [...state.bookmarks, { id, createdAt: now, updatedAt: now }] };
        }),

      addOrUpdateBookmarkNote: (id, note) =>
        set((state) => {
          const idx = state.bookmarks.findIndex((b) => b.id === id);
          const now = new Date().toISOString();
          if (idx >= 0) {
            const updated = [...state.bookmarks];
            updated[idx] = { ...updated[idx], note: note.trim() || undefined, updatedAt: now };
            return { bookmarks: updated };
          }
          return {
            bookmarks: [...state.bookmarks, { id, note: note.trim() || undefined, createdAt: now, updatedAt: now }],
          };
        }),

      removeBookmarkNote: (id) =>
        set((state) => {
          const idx = state.bookmarks.findIndex((b) => b.id === id);
          if (idx >= 0) {
            const updated = [...state.bookmarks];
            updated[idx] = { ...updated[idx], note: undefined, updatedAt: new Date().toISOString() };
            return { bookmarks: updated };
          }
          return state;
        }),

      updateProgress: (pageId, progress) =>
        set((state) => ({
          readingProgress: { ...state.readingProgress, [pageId]: progress },
        })),

      setLastReadPage: (page) => set({ lastReadPage: page }),

      isBookmarked: (id) => get().bookmarks.some((b) => b.id === id),

      getBookmarkNote: (id) => get().bookmarks.find((b) => b.id === id)?.note,

      toggleFavoriteWord: (word) =>
        set((state) => {
          const exists = state.favoriteWords.some((w) => w.id === word.id);
          return {
            favoriteWords: exists
              ? state.favoriteWords.filter((w) => w.id !== word.id)
              : [...state.favoriteWords, word],
          };
        }),

      isFavoriteWord: (id) => get().favoriteWords.some((w) => w.id === id),

      reset: () => set(initialState),
    }),
    {
      name: "quran-store",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        currentTranslation: state.currentTranslation,
        selectedReciter: state.selectedReciter,
        bookmarks: state.bookmarks,
        favoriteWords: state.favoriteWords,
        readingProgress: state.readingProgress,
        lastReadPage: state.lastReadPage,
      }),
    }
  )
);
