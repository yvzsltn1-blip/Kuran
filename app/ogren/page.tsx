"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/auth-context";
import { Header } from "@/components/layout/header";
import { GRAMMAR_LESSONS, GrammarLesson } from "@/data/grammar";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Clock, BarChart2, ChevronDown, ChevronUp, BookOpen } from "lucide-react";

function LessonCard({ lesson, onComplete }: { lesson: GrammarLesson; onComplete: (id: number) => void }) {
  const [open, setOpen] = useState(false);
  const [currentSection, setCurrentSection] = useState(0);
  const [done, setDone] = useState(false);

  const levelColors: Record<string, string> = {
    "Başlangıç": "bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300",
    "Orta": "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
    "İleri": "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300",
  };

  const handleComplete = () => {
    setDone(true);
    onComplete(lesson.id);
  };

  return (
    <div className={`border-2 rounded-2xl overflow-hidden transition-all duration-200 ${done ? "border-emerald-400/50 bg-emerald-50/30 dark:bg-emerald-950/20" : "border-border bg-card"}`}>
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-4 p-5 text-left hover:bg-muted/30 transition-colors"
      >
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-accent/20 to-primary/20 flex items-center justify-center shrink-0">
          <span className="font-arabic text-2xl text-foreground">{lesson.icon}</span>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-semibold text-foreground">{lesson.title}</h3>
            {done && <span className="text-xs bg-emerald-500 text-white px-2 py-0.5 rounded-full">Tamamlandı</span>}
          </div>
          <p className="text-sm text-muted-foreground">{lesson.subtitle}</p>
          <div className="flex items-center gap-3 mt-1">
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${levelColors[lesson.level]}`}>
              {lesson.level}
            </span>
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="h-3 w-3" />
              {lesson.duration}
            </span>
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <BarChart2 className="h-3 w-3" />
              {lesson.sections.length} bölüm
            </span>
          </div>
        </div>
        {open ? <ChevronUp className="h-5 w-5 text-muted-foreground shrink-0" /> : <ChevronDown className="h-5 w-5 text-muted-foreground shrink-0" />}
      </button>

      {open && (
        <div className="border-t border-border px-5 pb-5">
          {/* Bölüm sekmesi */}
          <div className="flex gap-2 mt-4 mb-4 overflow-x-auto pb-1">
            {lesson.sections.map((sec, i) => (
              <button
                key={i}
                onClick={() => setCurrentSection(i)}
                className={`shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${currentSection === i ? "bg-primary text-primary-foreground" : "bg-muted/50 text-muted-foreground hover:bg-muted"}`}
              >
                {i + 1}. {sec.heading.length > 20 ? sec.heading.slice(0, 20) + "…" : sec.heading}
              </button>
            ))}
          </div>

          {/* İçerik */}
          {(() => {
            const sec = lesson.sections[currentSection];
            return (
              <div>
                <h4 className="font-semibold text-foreground mb-2">{sec.heading}</h4>
                <p className="text-muted-foreground text-sm leading-relaxed mb-4">{sec.content}</p>

                {sec.examples && (
                  <div className="space-y-2">
                    {sec.examples.map((ex, i) => (
                      <div key={i} className="flex items-center gap-3 p-3 bg-background rounded-xl border border-border">
                        <div className="font-arabic text-2xl text-foreground w-16 text-right shrink-0">{ex.arabic}</div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm text-muted-foreground italic">{ex.transliteration}</div>
                          <div className="text-sm font-medium text-foreground">{ex.turkish}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Navigasyon */}
                <div className="flex gap-2 mt-4">
                  {currentSection > 0 && (
                    <Button variant="outline" size="sm" onClick={() => setCurrentSection((i) => i - 1)}>
                      Önceki Bölüm
                    </Button>
                  )}
                  {currentSection < lesson.sections.length - 1 ? (
                    <Button size="sm" onClick={() => setCurrentSection((i) => i + 1)} className="ml-auto bg-primary text-primary-foreground hover:bg-primary/90">
                      Sonraki Bölüm
                    </Button>
                  ) : !done ? (
                    <Button size="sm" onClick={handleComplete} className="ml-auto bg-emerald-500 hover:bg-emerald-600 text-white">
                      Dersi Tamamla ✓
                    </Button>
                  ) : (
                    <span className="ml-auto text-sm text-emerald-500 font-medium flex items-center gap-1">
                      ✓ Tamamlandı
                    </span>
                  )}
                </div>
              </div>
            );
          })()}
        </div>
      )}
    </div>
  );
}

export default function OgrenPage() {
  const { user, isLoading, updateProgress } = useAuth();
  const router = useRouter();
  const [completedLessons, setCompletedLessons] = useState<Set<number>>(new Set());

  useEffect(() => {
    if (!isLoading && !user) router.push("/giris");
  }, [user, isLoading, router]);

  const handleComplete = (id: number) => {
    setCompletedLessons((prev) => {
      const next = new Set(prev).add(id);
      updateProgress({ lessonsCompleted: next.size });
      return next;
    });
  };

  if (isLoading || !user) return null;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="flex items-center gap-3 mb-6">
          <Link href="/dashboard">
            <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground">
              <ArrowLeft className="h-4 w-4" />
              Dashboard
            </Button>
          </Link>
        </div>

        <div className="mb-8">
          <h1 className="text-2xl font-bold text-foreground mb-1">Öğrenme Merkezi</h1>
          <p className="text-muted-foreground">Kur'an Arapçasını adım adım öğrenin</p>
        </div>

        {/* Hızlı erişim */}
        <div className="grid grid-cols-2 gap-3 mb-8">
          <Link href="/kelime" className="flex items-center gap-3 p-4 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-2xl hover:shadow-md transition-all group">
            <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
              <span className="text-xl">🃏</span>
            </div>
            <div>
              <div className="font-semibold text-foreground text-sm">Kelime Kartları</div>
              <div className="text-xs text-muted-foreground">Ezberle ve pekiştir</div>
            </div>
          </Link>
          <Link href="/quiz" className="flex items-center gap-3 p-4 bg-purple-50 dark:bg-purple-950 border border-purple-200 dark:border-purple-800 rounded-2xl hover:shadow-md transition-all group">
            <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-900 flex items-center justify-center">
              <span className="text-xl">🧠</span>
            </div>
            <div>
              <div className="font-semibold text-foreground text-sm">Sınav</div>
              <div className="text-xs text-muted-foreground">Bilgini test et</div>
            </div>
          </Link>
        </div>

        {/* Gramer dersleri */}
        <div className="flex items-center gap-2 mb-4">
          <BookOpen className="h-4 w-4 text-accent" />
          <h2 className="font-semibold text-foreground">Gramer Dersleri</h2>
          <span className="text-xs text-muted-foreground ml-1">
            {completedLessons.size}/{GRAMMAR_LESSONS.length} tamamlandı
          </span>
        </div>

        {/* İlerleme */}
        <div className="w-full bg-muted rounded-full h-2 mb-6">
          <div
            className="bg-accent h-2 rounded-full transition-all duration-500"
            style={{ width: `${(completedLessons.size / GRAMMAR_LESSONS.length) * 100}%` }}
          />
        </div>

        <div className="space-y-3">
          {GRAMMAR_LESSONS.map((lesson) => (
            <LessonCard
              key={lesson.id}
              lesson={lesson}
              onComplete={handleComplete}
            />
          ))}
        </div>
      </main>
    </div>
  );
}
