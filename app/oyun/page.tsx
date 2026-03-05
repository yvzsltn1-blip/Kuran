"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth-context";
import { useQuranStore, FavoriteWord } from "@/stores/quran-store";
import { Header } from "@/components/layout/header";
import { VOCABULARY } from "@/data/vocabulary";
import { Button } from "@/components/ui/button";
import {
  Shuffle, Trophy, RotateCcw, CheckCircle, XCircle,
  ChevronRight, Gamepad2, Zap, Grid3x3, ArrowLeftRight,
} from "lucide-react";

// ─── Veri Yardımcıları ─────────────────────────────────────────────────────────

interface WordCard {
  id: string;
  arabic: string;
  transliteration: string;
  turkish: string;
}

function buildPool(favoriteWords: FavoriteWord[]): WordCard[] {
  const fromFav: WordCard[] = favoriteWords.map((w) => ({
    id: w.id,
    arabic: w.arabic,
    transliteration: w.transcription_tr,
    turkish: w.translation_tr,
  }));
  const fromVocab: WordCard[] = VOCABULARY.map((w) => ({
    id: String(w.id),
    arabic: w.arabic,
    transliteration: w.transliteration,
    turkish: w.turkish,
  }));
  // Favori kelimeler önce, sonra vocab'dan tamamla (unique arabic'e göre)
  const seen = new Set(fromFav.map((w) => w.arabic));
  const extra = fromVocab.filter((w) => !seen.has(w.arabic));
  return [...fromFav, ...extra];
}

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

// ─── Oyun Seçim Ekranı ─────────────────────────────────────────────────────────

const GAMES = [
  {
    id: "eslestir",
    icon: Grid3x3,
    title: "Eşleştir",
    desc: "Arapça kelimeleri Türkçe anlamlarıyla eşleştir",
    color: "from-blue-500/20 to-indigo-500/20 border-blue-400/30",
    iconColor: "text-blue-500",
    minWords: 4,
  },
  {
    id: "arapca-turkce",
    icon: Zap,
    title: "Arapça → Türkçe",
    desc: "Arapça kelimeyi gör, doğru Türkçe anlamı seç",
    color: "from-emerald-500/20 to-teal-500/20 border-emerald-400/30",
    iconColor: "text-emerald-500",
    minWords: 4,
  },
  {
    id: "turkce-arapca",
    icon: ArrowLeftRight,
    title: "Türkçe → Arapça",
    desc: "Türkçe anlamı gör, doğru Arapça kelimeyi seç",
    color: "from-amber-500/20 to-orange-500/20 border-amber-400/30",
    iconColor: "text-amber-500",
    minWords: 4,
  },
];

function GameLobby({
  pool,
  onSelect,
}: {
  pool: WordCard[];
  onSelect: (id: string) => void;
}) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-2">
        <Gamepad2 className="h-6 w-6 text-primary" />
        <h1 className="text-2xl font-bold text-foreground">Oyun Alanı</h1>
      </div>
      <p className="text-muted-foreground text-sm mb-6">
        {pool.length} kelimelik havuzunla oyna.{" "}
        {pool.length < 10 && (
          <span className="text-primary">
            Daha fazla kelime için Kur&apos;an&apos;da ❤️ ile kelime ekle!
          </span>
        )}
      </p>
      <div className="grid gap-4">
        {GAMES.map((game) => {
          const Icon = game.icon;
          const disabled = pool.length < game.minWords;
          return (
            <button
              key={game.id}
              onClick={() => !disabled && onSelect(game.id)}
              disabled={disabled}
              className={`flex items-center gap-4 p-5 rounded-2xl border bg-gradient-to-br text-left transition-all duration-200 ${game.color} ${
                disabled
                  ? "opacity-40 cursor-not-allowed"
                  : "hover:shadow-md hover:scale-[1.01] cursor-pointer"
              }`}
            >
              <div className="w-12 h-12 rounded-xl bg-background/60 flex items-center justify-center shrink-0">
                <Icon className={`h-6 w-6 ${game.iconColor}`} />
              </div>
              <div className="flex-1">
                <div className="font-semibold text-foreground">{game.title}</div>
                <div className="text-sm text-muted-foreground">{game.desc}</div>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─── Oyun 1: Eşleştirme ────────────────────────────────────────────────────────

function EslestirGame({ pool, onBack }: { pool: WordCard[]; onBack: () => void }) {
  const COUNT = Math.min(6, pool.length);
  const [pairs, setPairs] = useState<WordCard[]>([]);
  const [leftItems, setLeftItems] = useState<WordCard[]>([]);
  const [rightItems, setRightItems] = useState<WordCard[]>([]);
  const [selectedLeft, setSelectedLeft] = useState<string | null>(null);
  const [selectedRight, setSelectedRight] = useState<string | null>(null);
  const [matched, setMatched] = useState<Set<string>>(new Set());
  const [wrong, setWrong] = useState<Set<string>>(new Set());
  const [attempts, setAttempts] = useState(0);
  const [done, setDone] = useState(false);

  const init = useCallback(() => {
    const chosen = shuffle(pool).slice(0, COUNT);
    setPairs(chosen);
    setLeftItems(shuffle(chosen));
    setRightItems(shuffle(chosen));
    setSelectedLeft(null);
    setSelectedRight(null);
    setMatched(new Set());
    setWrong(new Set());
    setAttempts(0);
    setDone(false);
  }, [pool, COUNT]);

  useEffect(() => { init(); }, [init]);

  useEffect(() => {
    if (selectedLeft && selectedRight) {
      setAttempts((a) => a + 1);
      if (selectedLeft === selectedRight) {
        const newMatched = new Set(matched).add(selectedLeft);
        setMatched(newMatched);
        setSelectedLeft(null);
        setSelectedRight(null);
        if (newMatched.size === COUNT) setDone(true);
      } else {
        setWrong(new Set([selectedLeft, selectedRight]));
        setTimeout(() => {
          setWrong(new Set());
          setSelectedLeft(null);
          setSelectedRight(null);
        }, 700);
      }
    }
  }, [selectedLeft, selectedRight, matched, COUNT]);

  const score = Math.max(0, Math.round((COUNT / Math.max(attempts, COUNT)) * 100));

  if (done) {
    return (
      <Result
        emoji={score >= 80 ? "🎯" : "👍"}
        title="Tebrikler!"
        subtitle={`${attempts} denemede ${COUNT} eşleşmeyi tamamladın`}
        score={score}
        onRestart={init}
        onBack={onBack}
      />
    );
  }

  return (
    <div>
      <GameHeader title="Eşleştir" matched={matched.size} total={COUNT} onBack={onBack} />
      <div className="grid grid-cols-2 gap-3 mt-6">
        {/* Sol: Arapça */}
        <div className="space-y-2">
          <div className="text-xs font-medium text-muted-foreground text-center mb-3">Arapça</div>
          {leftItems.map((w) => {
            const isMatched = matched.has(w.id);
            const isSelected = selectedLeft === w.id;
            const isWrong = wrong.has(w.id);
            return (
              <button
                key={w.id}
                onClick={() => !isMatched && setSelectedLeft(w.id)}
                disabled={isMatched}
                className={`w-full p-3 rounded-xl border-2 text-center transition-all duration-150 ${
                  isMatched
                    ? "border-emerald-400 bg-emerald-50 dark:bg-emerald-950 opacity-50"
                    : isWrong
                    ? "border-red-400 bg-red-50 dark:bg-red-950 scale-95"
                    : isSelected
                    ? "border-primary bg-primary/10 scale-95"
                    : "border-border bg-card hover:border-primary/50 hover:bg-primary/5 cursor-pointer"
                }`}
              >
                <div className="font-arabic text-xl leading-loose text-foreground">{w.arabic}</div>
                <div className="text-[10px] font-mono text-muted-foreground mt-0.5">{w.transliteration}</div>
              </button>
            );
          })}
        </div>

        {/* Sağ: Türkçe */}
        <div className="space-y-2">
          <div className="text-xs font-medium text-muted-foreground text-center mb-3">Türkçe</div>
          {rightItems.map((w) => {
            const isMatched = matched.has(w.id);
            const isSelected = selectedRight === w.id;
            const isWrong = wrong.has(w.id);
            return (
              <button
                key={w.id}
                onClick={() => !isMatched && setSelectedRight(w.id)}
                disabled={isMatched}
                className={`w-full p-3 rounded-xl border-2 text-center transition-all duration-150 min-h-[68px] flex items-center justify-center ${
                  isMatched
                    ? "border-emerald-400 bg-emerald-50 dark:bg-emerald-950 opacity-50"
                    : isWrong
                    ? "border-red-400 bg-red-50 dark:bg-red-950 scale-95"
                    : isSelected
                    ? "border-primary bg-primary/10 scale-95"
                    : "border-border bg-card hover:border-primary/50 hover:bg-primary/5 cursor-pointer"
                }`}
              >
                <span className="text-sm font-medium text-foreground">{w.turkish}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─── Oyun 2 & 3: Çoktan Seçmeli ───────────────────────────────────────────────

interface MCQuestion {
  word: WordCard;
  options: string[];
  correctIndex: number;
}

function buildMCQuestions(pool: WordCard[], mode: "ar-tr" | "tr-ar", count = 10): MCQuestion[] {
  const chosen = shuffle(pool).slice(0, count);
  return chosen.map((word) => {
    const others = pool.filter((w) => w.id !== word.id);
    const distractors = shuffle(others)
      .slice(0, 3)
      .map((w) => (mode === "ar-tr" ? w.turkish : w.arabic));
    const correct = mode === "ar-tr" ? word.turkish : word.arabic;
    const options = shuffle([...distractors, correct]);
    return { word, options, correctIndex: options.indexOf(correct) };
  });
}

function MultiChoiceGame({
  pool,
  mode,
  onBack,
}: {
  pool: WordCard[];
  mode: "ar-tr" | "tr-ar";
  onBack: () => void;
}) {
  const COUNT = Math.min(10, pool.length);
  const [questions, setQuestions] = useState<MCQuestion[]>([]);
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);

  const init = useCallback(() => {
    setQuestions(buildMCQuestions(pool, mode, COUNT));
    setIndex(0);
    setSelected(null);
    setScore(0);
    setDone(false);
  }, [pool, mode, COUNT]);

  useEffect(() => { init(); }, [init]);

  const current = questions[index];

  const handleSelect = (idx: number) => {
    if (selected !== null || !current) return;
    setSelected(idx);
    if (idx === current.correctIndex) setScore((s) => s + 1);
  };

  const handleNext = () => {
    if (index + 1 >= questions.length) {
      setDone(true);
    } else {
      setIndex((i) => i + 1);
      setSelected(null);
    }
  };

  const pct = Math.round((score / COUNT) * 100);
  const title = mode === "ar-tr" ? "Arapça → Türkçe" : "Türkçe → Arapça";

  if (done) {
    return (
      <Result
        emoji={pct >= 80 ? "🏆" : pct >= 60 ? "🎯" : "📚"}
        title="Oyun Bitti!"
        subtitle={`${COUNT} sorudan ${score} doğru`}
        score={pct}
        onRestart={init}
        onBack={onBack}
      />
    );
  }

  if (!current) return null;

  return (
    <div>
      <GameHeader title={title} matched={index} total={COUNT} onBack={onBack} score={score} />

      {/* Soru kartı */}
      <div className="bg-card border-2 border-border rounded-3xl p-8 text-center my-6">
        {mode === "ar-tr" ? (
          <>
            <p className="text-xs text-muted-foreground mb-3">Bu kelimenin Türkçe anlamı nedir?</p>
            <div className="font-arabic text-5xl text-foreground leading-loose mb-2">{current.word.arabic}</div>
            <div className="text-sm text-muted-foreground italic">{current.word.transliteration}</div>
          </>
        ) : (
          <>
            <p className="text-xs text-muted-foreground mb-3">Bu anlamın Arapça karşılığı hangisidir?</p>
            <div className="text-3xl font-bold text-foreground mb-2">{current.word.turkish}</div>
            <div className="text-sm text-muted-foreground italic">{current.word.transliteration}</div>
          </>
        )}
      </div>

      {/* Seçenekler */}
      <div className="grid grid-cols-1 gap-3">
        {current.options.map((opt, idx) => {
          const isCorrect = idx === current.correctIndex;
          const isSelected = idx === selected;
          const answered = selected !== null;
          return (
            <button
              key={idx}
              onClick={() => handleSelect(idx)}
              disabled={answered}
              className={`flex items-center gap-3 w-full border-2 h-14 px-5 rounded-2xl text-base font-medium transition-all duration-200 ${
                answered
                  ? isCorrect
                    ? "border-emerald-400 bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300"
                    : isSelected
                    ? "border-red-400 bg-red-50 dark:bg-red-950 text-red-700 dark:text-red-300"
                    : "border-border opacity-40"
                  : "border-border bg-card hover:border-primary/50 hover:bg-primary/5 cursor-pointer"
              }`}
            >
              <span className="w-7 h-7 rounded-full border border-current flex items-center justify-center text-xs font-bold shrink-0">
                {String.fromCharCode(65 + idx)}
              </span>
              {mode === "tr-ar" ? (
                <span className="font-arabic text-2xl leading-loose flex-1 text-right">{opt}</span>
              ) : (
                <span className="flex-1 text-left">{opt}</span>
              )}
              {answered && isCorrect && <CheckCircle className="h-5 w-5 text-emerald-500 shrink-0" />}
              {answered && isSelected && !isCorrect && <XCircle className="h-5 w-5 text-red-500 shrink-0" />}
            </button>
          );
        })}
      </div>

      {selected !== null && (
        <Button
          onClick={handleNext}
          className="w-full mt-5 h-12 gap-2 bg-primary text-primary-foreground hover:bg-primary/90 rounded-2xl"
        >
          {index + 1 >= questions.length ? "Sonuçları Gör" : "Sonraki Soru"}
          <ChevronRight className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}

// ─── Ortak Bileşenler ──────────────────────────────────────────────────────────

function GameHeader({
  title,
  matched,
  total,
  onBack,
  score,
}: {
  title: string;
  matched: number;
  total: number;
  onBack: () => void;
  score?: number;
}) {
  return (
    <div className="flex items-center justify-between mb-2">
      <div>
        <button
          type="button"
          onClick={onBack}
          className="text-xs text-muted-foreground hover:text-foreground mb-1 flex items-center gap-1"
        >
          ← Oyunlar
        </button>
        <h2 className="text-lg font-bold text-foreground">{title}</h2>
      </div>
      <div className="flex items-center gap-3">
        {score !== undefined && (
          <div className="flex items-center gap-1 bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 rounded-xl px-3 py-1.5">
            <Trophy className="h-4 w-4 text-amber-500" />
            <span className="font-bold text-amber-600 dark:text-amber-400 text-sm">{score}</span>
          </div>
        )}
        <span className="text-sm text-muted-foreground">{matched}/{total}</span>
      </div>
    </div>
  );
}

function Result({
  emoji, title, subtitle, score, onRestart, onBack,
}: {
  emoji: string; title: string; subtitle: string; score: number;
  onRestart: () => void; onBack: () => void;
}) {
  return (
    <div className="text-center py-12">
      <div className="text-6xl mb-4">{emoji}</div>
      <h2 className="text-2xl font-bold text-foreground mb-2">{title}</h2>
      <p className="text-muted-foreground mb-6">{subtitle}</p>
      <div className="relative w-28 h-28 mx-auto mb-8">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="8" fill="none" className="text-muted/30" />
          <circle
            cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="8" fill="none"
            strokeDasharray={`${score * 2.51} 251`}
            className={score >= 70 ? "text-amber-400" : "text-blue-400"}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-2xl font-bold text-foreground">%{score}</span>
        </div>
      </div>
      <div className="flex gap-3 justify-center">
        <Button onClick={onRestart} className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
          <RotateCcw className="h-4 w-4" />
          Tekrar
        </Button>
        <Button variant="outline" onClick={onBack}>
          <Shuffle className="h-4 w-4 mr-2" />
          Diğer Oyunlar
        </Button>
      </div>
    </div>
  );
}

// ─── Ana Sayfa ─────────────────────────────────────────────────────────────────

export default function OyunPage() {
  const { user, isLoading } = useAuth();
  const { favoriteWords } = useQuranStore();
  const router = useRouter();
  const [activeGame, setActiveGame] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoading && !user) router.push("/giris");
  }, [user, isLoading, router]);

  if (isLoading || !user) return null;

  const pool = buildPool(favoriteWords);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8 max-w-lg">
        {activeGame === null && (
          <GameLobby pool={pool} onSelect={setActiveGame} />
        )}
        {activeGame === "eslestir" && (
          <EslestirGame pool={pool} onBack={() => setActiveGame(null)} />
        )}
        {activeGame === "arapca-turkce" && (
          <MultiChoiceGame pool={pool} mode="ar-tr" onBack={() => setActiveGame(null)} />
        )}
        {activeGame === "turkce-arapca" && (
          <MultiChoiceGame pool={pool} mode="tr-ar" onBack={() => setActiveGame(null)} />
        )}
      </main>
    </div>
  );
}
