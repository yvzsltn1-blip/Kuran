"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth-context";
import { Header } from "@/components/layout/header";
import { VOCABULARY } from "@/data/vocabulary";
import { Button } from "@/components/ui/button";
import { Trophy, RotateCcw, CheckCircle, XCircle, ChevronRight } from "lucide-react";

interface Question {
  word: typeof VOCABULARY[0];
  options: string[];
  correctIndex: number;
}

function generateQuestions(count = 10): Question[] {
  const shuffled = [...VOCABULARY].sort(() => Math.random() - 0.5).slice(0, count);
  return shuffled.map((word) => {
    const others = VOCABULARY.filter((w) => w.id !== word.id)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3)
      .map((w) => w.turkish);
    const options = [...others, word.turkish].sort(() => Math.random() - 0.5);
    const correctIndex = options.indexOf(word.turkish);
    return { word, options, correctIndex };
  });
}

export default function QuizPage() {
  const { user, isLoading, updateProgress } = useAuth();
  const router = useRouter();

  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState<(boolean | null)[]>([]);
  const [quizDone, setQuizDone] = useState(false);

  useEffect(() => {
    if (!isLoading && !user) router.push("/giris");
  }, [user, isLoading, router]);

  useEffect(() => {
    const qs = generateQuestions(10);
    setQuestions(qs);
    setAnswers(new Array(qs.length).fill(null));
  }, []);

  const current = questions[currentIndex];

  const handleSelect = useCallback((index: number) => {
    if (selectedOption !== null) return;
    setSelectedOption(index);
    const isCorrect = index === current.correctIndex;
    if (isCorrect) setScore((s) => s + 1);
    setAnswers((prev) => {
      const next = [...prev];
      next[currentIndex] = isCorrect;
      return next;
    });
  }, [selectedOption, current, currentIndex]);

  const handleNext = () => {
    if (currentIndex + 1 >= questions.length) {
      setQuizDone(true);
      updateProgress({ quizScore: Math.max(user?.progress.quizScore || 0, Math.round((score / questions.length) * 100)) });
    } else {
      setCurrentIndex((i) => i + 1);
      setSelectedOption(null);
    }
  };

  const restart = () => {
    const qs = generateQuestions(10);
    setQuestions(qs);
    setAnswers(new Array(qs.length).fill(null));
    setCurrentIndex(0);
    setSelectedOption(null);
    setScore(0);
    setQuizDone(false);
  };

  if (isLoading || !user || !current) return null;

  const percentage = Math.round((score / questions.length) * 100);

  if (quizDone) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-12 max-w-lg text-center">
          <div className={`text-7xl mb-4 ${percentage >= 70 ? "text-amber-400" : "text-gray-400"}`}>
            {percentage >= 80 ? "🏆" : percentage >= 60 ? "🎯" : "📚"}
          </div>
          <h2 className="text-3xl font-bold text-foreground mb-2">Sınav Tamamlandı!</h2>
          <p className="text-muted-foreground mb-6">
            {questions.length} sorudan <span className="text-foreground font-semibold">{score}</span> doğru
          </p>

          <div className="relative w-32 h-32 mx-auto mb-6">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="8" fill="none" className="text-muted/30" />
              <circle
                cx="50" cy="50" r="40"
                stroke="currentColor" strokeWidth="8" fill="none"
                strokeDasharray={`${percentage * 2.51} 251`}
                className={percentage >= 70 ? "text-amber-400" : "text-blue-400"}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-2xl font-bold text-foreground">%{percentage}</span>
            </div>
          </div>

          {/* Soru özeti */}
          <div className="grid grid-cols-10 gap-1 mb-8">
            {answers.map((ans, i) => (
              <div
                key={i}
                className={`h-3 rounded-full ${ans === true ? "bg-emerald-500" : ans === false ? "bg-red-400" : "bg-muted"}`}
              />
            ))}
          </div>

          <div className="flex gap-3 justify-center">
            <Button onClick={restart} className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
              <RotateCcw className="h-4 w-4" />
              Tekrar
            </Button>
            <Button variant="outline" onClick={() => router.push("/dashboard")}>
              Dashboard
            </Button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8 max-w-lg">
        {/* Başlık */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Kelime Sınavı</h1>
            <p className="text-muted-foreground text-sm">Soru {currentIndex + 1}/{questions.length}</p>
          </div>
          <div className="flex items-center gap-2 bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 rounded-xl px-3 py-1.5">
            <Trophy className="h-4 w-4 text-amber-500" />
            <span className="font-bold text-amber-600 dark:text-amber-400">{score}</span>
          </div>
        </div>

        {/* İlerleme çubuğu */}
        <div className="w-full bg-muted rounded-full h-2 mb-8">
          <div
            className="bg-accent h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentIndex + (selectedOption !== null ? 1 : 0)) / questions.length) * 100}%` }}
          />
        </div>

        {/* Soru */}
        <div className="bg-card border-2 border-border rounded-3xl p-8 text-center mb-6">
          <p className="text-muted-foreground text-sm mb-4">Bu kelimenin Türkçe anlamı nedir?</p>
          <div className="font-arabic text-6xl text-foreground leading-relaxed mb-2">
            {current.word.arabic}
          </div>
          <div className="text-muted-foreground text-sm italic">{current.word.transliteration}</div>
        </div>

        {/* Seçenekler */}
        <div className="grid grid-cols-1 gap-3">
          {current.options.map((option, index) => {
            let variant: string = "outline";
            let className = "h-14 text-base justify-start px-5 rounded-2xl transition-all duration-200";

            if (selectedOption !== null) {
              if (index === current.correctIndex) {
                className += " bg-emerald-50 dark:bg-emerald-950 border-emerald-400 text-emerald-700 dark:text-emerald-300";
              } else if (index === selectedOption && index !== current.correctIndex) {
                className += " bg-red-50 dark:bg-red-950 border-red-400 text-red-700 dark:text-red-300";
              } else {
                className += " opacity-50";
              }
            } else {
              className += " hover:border-accent/60 hover:bg-accent/5 cursor-pointer";
            }

            return (
              <button
                key={index}
                onClick={() => handleSelect(index)}
                disabled={selectedOption !== null}
                className={`flex items-center gap-3 w-full border-2 border-border ${className}`}
              >
                <span className="w-7 h-7 rounded-full border border-current flex items-center justify-center text-xs font-bold shrink-0">
                  {String.fromCharCode(65 + index)}
                </span>
                <span className="font-medium">{option}</span>
                {selectedOption !== null && index === current.correctIndex && (
                  <CheckCircle className="h-5 w-5 text-emerald-500 ml-auto shrink-0" />
                )}
                {selectedOption === index && index !== current.correctIndex && (
                  <XCircle className="h-5 w-5 text-red-500 ml-auto shrink-0" />
                )}
              </button>
            );
          })}
        </div>

        {selectedOption !== null && (
          <Button
            onClick={handleNext}
            className="w-full mt-6 h-12 gap-2 bg-primary text-primary-foreground hover:bg-primary/90 rounded-2xl"
          >
            {currentIndex + 1 >= questions.length ? "Sonuçları Gör" : "Sonraki Soru"}
            <ChevronRight className="h-4 w-4" />
          </Button>
        )}
      </main>
    </div>
  );
}
