"use client";

import Link from "next/link";
import { useAuth } from "@/context/auth-context";
import { Header } from "@/components/layout/header";
import { Button } from "@/components/ui/button";
import {
  BookOpen, GraduationCap, Brain, Layers, ChevronRight,
  Star, Users, Flame, Shield, Sparkles
} from "lucide-react";

const FEATURES = [
  {
    icon: Layers,
    title: "Kelime Kartları",
    desc: "64 temel Kur'ani kelimeyi akıllı kart sistemiyle ezberleyin. Bildiğiniz ve bilmediğiniz kelimeler ayrı takip edilir.",
    color: "from-blue-500/10 to-indigo-500/10 border-blue-500/20",
    iconBg: "bg-blue-500/10",
    iconColor: "text-blue-500",
    href: "/kelime",
  },
  {
    icon: GraduationCap,
    title: "Gramer Dersleri",
    desc: "Arapça alfabesi, isimler, zamirler, fiil çekimi ve cümle yapısını adım adım öğrenin.",
    color: "from-emerald-500/10 to-teal-500/10 border-emerald-500/20",
    iconBg: "bg-emerald-500/10",
    iconColor: "text-emerald-500",
    href: "/ogren",
  },
  {
    icon: Brain,
    title: "Kelime Sınavı",
    desc: "Öğrendiğiniz kelimeleri çoktan seçmeli sorularla test edin. Her sınavda farklı sorular.",
    color: "from-purple-500/10 to-pink-500/10 border-purple-500/20",
    iconBg: "bg-purple-500/10",
    iconColor: "text-purple-500",
    href: "/quiz",
  },
  {
    icon: BookOpen,
    title: "Kur'an Okuyucu",
    desc: "Arapça metin, Türkçe meal ve transkripsiyon ile tüm 114 sureyi okuyun.",
    color: "from-amber-500/10 to-orange-500/10 border-amber-500/20",
    iconBg: "bg-amber-500/10",
    iconColor: "text-amber-500",
    href: "/quran/surahs",
  },
];

const STATS = [
  { value: "114", label: "Sure", icon: BookOpen },
  { value: "6,236", label: "Ayet", icon: Star },
  { value: "64+", label: "Kur'ani Kelime", icon: Layers },
  { value: "5", label: "Gramer Dersi", icon: GraduationCap },
];

export function LandingPage() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen">
      <Header />

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-background via-background to-card/40 min-h-[85vh] flex items-center">
        {/* Arkaplan Deseni */}
        <div className="absolute inset-0 opacity-[0.04] dark:opacity-[0.08]">
          <svg className="w-full h-full" viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="hero-geo" x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse">
                <path d="M40 10 L70 40 L40 70 L10 40 Z M40 20 L60 40 L40 60 L20 40 Z" fill="none" stroke="currentColor" strokeWidth="0.5" />
                <circle cx="40" cy="40" r="4" fill="currentColor" opacity="0.3" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#hero-geo)" />
          </svg>
        </div>

        {/* Dekoratif şekiller */}
        <div className="absolute top-16 right-[10%] w-72 h-72 bg-accent/5 rounded-full blur-3xl" />
        <div className="absolute bottom-16 left-[5%] w-64 h-64 bg-primary/5 rounded-full blur-3xl" />

        <div className="relative container mx-auto px-6 py-20 z-10">
          <div className="max-w-4xl mx-auto text-center">
            {/* Rozet */}
            <div className="inline-flex items-center gap-2 bg-card/80 border border-accent/30 rounded-full px-4 py-2 mb-8 text-sm backdrop-blur-sm">
              <Sparkles className="h-4 w-4 text-accent" />
              <span className="text-muted-foreground">Ücretsiz Kur'an Arapçası Eğitimi</span>
              <div className="w-px h-4 bg-border" />
              <span className="text-accent font-medium">Hemen başla</span>
            </div>

            {/* Kur'ani metin */}
            <div className="font-arabic text-4xl sm:text-5xl md:text-6xl text-foreground leading-loose mb-6">
              اقْرَأْ بِاسْمِ رَبِّكَ الَّذِي خَلَقَ
            </div>

            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-4">
              Kur'an Arapçasını Öğrenin
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
              Kelime kartları, gramer dersleri ve interaktif sınavlarla Kur'an dilini adım adım öğrenin.
              Allah'ın kelamını kendi dilinden anlayın.
            </p>

            {/* CTA Butonları */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {user ? (
                <>
                  <Button asChild size="lg" className="h-12 px-8 bg-primary text-primary-foreground hover:bg-primary/90 rounded-2xl text-base font-semibold shadow-lg">
                    <Link href="/dashboard">
                      Dashboard'a Git
                      <ChevronRight className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                  <Button asChild variant="outline" size="lg" className="h-12 px-8 rounded-2xl text-base border-2">
                    <Link href="/ogren">Öğrenmeye Devam Et</Link>
                  </Button>
                </>
              ) : (
                <>
                  <Button asChild size="lg" className="h-12 px-8 bg-primary text-primary-foreground hover:bg-primary/90 rounded-2xl text-base font-semibold shadow-lg">
                    <Link href="/kayit">
                      Ücretsiz Başla
                      <ChevronRight className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                  <Button asChild variant="outline" size="lg" className="h-12 px-8 rounded-2xl text-base border-2">
                    <Link href="/giris">Giriş Yap</Link>
                  </Button>
                </>
              )}
              <Button asChild variant="ghost" size="lg" className="h-12 px-8 rounded-2xl text-base text-muted-foreground hover:text-foreground">
                <Link href="/quran/surahs">
                  <BookOpen className="mr-2 h-4 w-4" />
                  Kur'an Oku
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* İstatistikler */}
      <section className="border-y border-border bg-card/30">
        <div className="container mx-auto px-6 py-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {STATS.map((stat) => (
              <div key={stat.label} className="flex flex-col items-center text-center gap-2">
                <stat.icon className="h-5 w-5 text-accent" />
                <div className="text-3xl font-bold text-foreground">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Özellikler */}
      <section className="container mx-auto px-6 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-3">Neler Öğrenebilirsiniz?</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Kapsamlı öğrenme araçlarıyla Kur'an Arapçasında ilerleyin
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {FEATURES.map((feature) => (
            <Link
              key={feature.href}
              href={user ? feature.href : "/kayit"}
              className={`group flex flex-col gap-4 p-6 rounded-3xl border bg-gradient-to-br ${feature.color} hover:shadow-lg transition-all duration-200`}
            >
              <div className={`w-12 h-12 rounded-2xl ${feature.iconBg} flex items-center justify-center`}>
                <feature.icon className={`h-6 w-6 ${feature.iconColor}`} />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-accent transition-colors">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{feature.desc}</p>
              </div>
              <div className="flex items-center gap-1 text-sm text-accent font-medium mt-auto">
                {user ? "Başla" : "Üye ol, başla"}
                <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Örnek ayet bölümü */}
      <section className="bg-gradient-to-br from-primary/5 to-accent/5 border-y border-border">
        <div className="container mx-auto px-6 py-16 max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 text-accent text-sm font-medium mb-6">
            <Star className="h-4 w-4" />
            Kur'an Okuyucu
          </div>
          <div className="font-arabic text-3xl sm:text-4xl text-foreground leading-loose mb-4">
            بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
          </div>
          <div className="text-muted-foreground text-sm italic mb-2">
            Bismillâhirrahmânirrahîm
          </div>
          <div className="text-foreground font-medium mb-6">
            "Rahman ve Rahim olan Allah'ın adıyla"
          </div>
          <Button asChild variant="outline" className="rounded-2xl border-2">
            <Link href="/quran/surahs">Tüm Kuran'ı Oku</Link>
          </Button>
        </div>
      </section>

      {/* CTA bölümü */}
      {!user && (
        <section className="container mx-auto px-6 py-20 text-center">
          <div className="max-w-2xl mx-auto">
            <div className="flex items-center justify-center gap-2 mb-6">
              <Shield className="h-5 w-5 text-accent" />
              <span className="text-accent font-medium">Ücretsiz · Reklamsız · Gizli Ücret Yok</span>
            </div>
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Bugün Başlayın
            </h2>
            <p className="text-muted-foreground mb-8 leading-relaxed">
              Saniyeler içinde ücretsiz hesap oluşturun ve Kur'an Arapçasını öğrenme yolculuğunuza başlayın.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="h-12 px-10 bg-primary text-primary-foreground hover:bg-primary/90 rounded-2xl text-base font-semibold">
                <Link href="/kayit">Ücretsiz Hesap Oluştur</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="h-12 px-10 rounded-2xl text-base border-2">
                <Link href="/giris">Giriş Yap</Link>
              </Button>
            </div>
          </div>
        </section>
      )}

    </div>
  );
}
