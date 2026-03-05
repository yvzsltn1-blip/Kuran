"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/auth-context";
import { Header } from "@/components/layout/header";
import { BookOpen, GraduationCap, Gamepad2, Trophy, Flame, Star, ChevronRight, BookMarked, Layers, Heart, Bookmark } from "lucide-react";
import { SavedWords } from "@/components/dashboard/saved-words";
import { SavedVerses } from "@/components/dashboard/saved-verses";

const QUICK_LINKS = [
  {
    href: "/ogren",
    icon: GraduationCap,
    title: "Öğrenme Merkezi",
    desc: "Kelime kartları, gramer ve dersler",
    color: "from-amber-500/20 to-orange-500/20 border-amber-500/30",
    iconColor: "text-amber-600 dark:text-amber-400",
  },
  {
    href: "/quran/surahs",
    icon: BookOpen,
    title: "Kur'an Oku",
    desc: "Arapça metin ve Türkçe meal",
    color: "from-emerald-500/20 to-teal-500/20 border-emerald-500/30",
    iconColor: "text-emerald-600 dark:text-emerald-400",
  },
  {
    href: "/kelime",
    icon: Layers,
    title: "Kelime Kartları",
    desc: "Kur'ani kelimeleri ezberle",
    color: "from-blue-500/20 to-indigo-500/20 border-blue-500/30",
    iconColor: "text-blue-600 dark:text-blue-400",
  },
  {
    href: "/oyun",
    icon: Gamepad2,
    title: "Oyun Alanı",
    desc: "Eğlenerek kelime öğren",
    color: "from-purple-500/20 to-pink-500/20 border-purple-500/30",
    iconColor: "text-purple-600 dark:text-purple-400",
  },
];

export default function DashboardPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/giris");
    }
  }, [user, isLoading, router]);

  if (isLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-8 h-8 border-4 border-accent border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const joinDate = new Date(user.joinedAt).toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" });

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8 max-w-5xl">
        {/* Karşılama */}
        <div className="mb-8">
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-1">
                Merhaba, {user.name.split(" ")[0]} 👋
              </h1>
              <p className="text-muted-foreground">
                {joinDate} tarihinden beri öğreniyorsunuz
              </p>
            </div>
            <div className="flex items-center gap-2 bg-card border border-border rounded-xl px-4 py-2">
              <Flame className="h-5 w-5 text-orange-500" />
              <span className="font-bold text-foreground">{user.progress.streak}</span>
              <span className="text-muted-foreground text-sm">günlük seri</span>
            </div>
          </div>
        </div>

        {/* İstatistikler */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { icon: Layers, label: "Öğrenilen Kelime", value: user.progress.wordsLearned, color: "text-blue-500" },
            { icon: BookMarked, label: "Tamamlanan Ders", value: user.progress.lessonsCompleted, color: "text-emerald-500" },
            { icon: Trophy, label: "Quiz Puanı", value: user.progress.quizScore, color: "text-amber-500" },
            { icon: Star, label: "Günlük Seri", value: user.progress.streak, color: "text-purple-500" },
          ].map((stat) => (
            <div key={stat.label} className="bg-card border border-border rounded-2xl p-4 flex flex-col gap-2">
              <stat.icon className={`h-5 w-5 ${stat.color}`} />
              <div className="text-2xl font-bold text-foreground">{stat.value}</div>
              <div className="text-xs text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Hızlı erişim */}
        <h2 className="text-lg font-semibold text-foreground mb-4">Nereye gitmek istersiniz?</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          {QUICK_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`group flex items-center gap-4 p-5 rounded-2xl border bg-gradient-to-br ${link.color} hover:shadow-md transition-all duration-200`}
            >
              <div className="w-12 h-12 rounded-xl bg-background/50 flex items-center justify-center shrink-0">
                <link.icon className={`h-6 w-6 ${link.iconColor}`} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-foreground">{link.title}</div>
                <div className="text-sm text-muted-foreground">{link.desc}</div>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:translate-x-1 transition-transform shrink-0" />
            </Link>
          ))}
        </div>

        {/* Kelimelerim + Ayetlerim */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Kelimelerim */}
          <div className="bg-card border border-border rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <Heart className="h-4 w-4 text-red-400" fill="#f87171" />
              <h2 className="text-base font-semibold text-foreground">Kelimelerim</h2>
            </div>
            <SavedWords />
          </div>

          {/* Ayetlerim */}
          <div className="bg-card border border-border rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Bookmark className="h-4 w-4 text-primary" />
                <h2 className="text-base font-semibold text-foreground">Ayetlerim</h2>
              </div>
              <Link href="/quran/bookmarks" className="text-xs text-primary hover:underline">
                Tümünü gör
              </Link>
            </div>
            <SavedVerses />
          </div>
        </div>

        {/* Günün ayeti */}
        <div className="bg-gradient-to-br from-primary/10 to-accent/10 border border-accent/20 rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <BookOpen className="h-4 w-4 text-accent" />
            <span className="text-sm font-medium text-accent">Günün Ayeti</span>
          </div>
          <p className="font-arabic text-2xl text-right text-foreground leading-loose mb-3">
            اقْرَأْ بِاسْمِ رَبِّكَ الَّذِي خَلَقَ
          </p>
          <p className="text-muted-foreground text-sm">
            "Yaratan Rabbinin adıyla oku." — Alak Suresi, 1. Ayet
          </p>
        </div>
      </main>
    </div>
  );
}
