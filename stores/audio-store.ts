import { create } from "zustand";

// Singleton audio instance — bir anda sadece bir ses çalınır
let globalAudio: HTMLAudioElement | null = null;

interface AudioState {
  currentUrl: string | null;
  isPlaying: boolean;
  play: (url: string) => Promise<void>;
  pause: () => void;
  toggle: (url: string) => Promise<void>;
  stop: () => void;
}

export const useAudioStore = create<AudioState>()((set, get) => ({
  currentUrl: null,
  isPlaying: false,

  play: async (url: string) => {
    // Önceki sesi durdur
    if (globalAudio) {
      globalAudio.pause();
      globalAudio.src = "";
    }

    globalAudio = new Audio(url);
    globalAudio.onended = () => set({ isPlaying: false });
    globalAudio.onerror = () => set({ isPlaying: false });

    try {
      await globalAudio.play();
      set({ currentUrl: url, isPlaying: true });
    } catch {
      set({ isPlaying: false });
    }
  },

  pause: () => {
    if (globalAudio) {
      globalAudio.pause();
    }
    set({ isPlaying: false });
  },

  stop: () => {
    if (globalAudio) {
      globalAudio.pause();
      globalAudio.src = "";
      globalAudio = null;
    }
    set({ isPlaying: false, currentUrl: null });
  },

  toggle: async (url: string) => {
    const { currentUrl, isPlaying, play, pause } = get();
    if (currentUrl === url && isPlaying) {
      pause();
    } else {
      await play(url);
    }
  },
}));

export const RECITERS = [
  { id: "Alafasy_128kbps", name: "Mişarî el-Afasî" },
  { id: "Abdul_Basit_Murattal_192kbps", name: "Abdülbasit Abdüssamed" },
  { id: "Husary_128kbps", name: "Mahmud Halil el-Husarî" },
  { id: "Minshawi_Murattal_128kbps", name: "M. Sıddık el-Minşavî" },
] as const;

export type ReciterId = (typeof RECITERS)[number]["id"];

export function buildVerseAudioUrl(
  surahId: number,
  verseNumber: number,
  reciterId: string
): string {
  const surah = surahId.toString().padStart(3, "0");
  const verse = verseNumber.toString().padStart(3, "0");
  return `https://everyayah.com/data/${reciterId}/${surah}${verse}.mp3`;
}
