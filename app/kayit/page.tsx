"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BookOpen, Eye, EyeOff, Loader2, ArrowLeft, CheckCircle, Lock } from "lucide-react";
import { useSettings } from "@/context/settings-context";

export default function RegisterPage() {
  const { register } = useAuth();
  const { registrationEnabled, isLoaded } = useSettings();
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password.length < 6) {
      setError("Şifre en az 6 karakter olmalıdır.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Şifreler eşleşmiyor.");
      return;
    }

    setLoading(true);
    const result = await register(name, email, password);
    setLoading(false);
    if (result.success) {
      router.push("/dashboard");
    } else {
      setError(result.error || "Kayıt başarısız.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Sol Panel */}
      <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-primary to-primary/80 relative overflow-hidden items-center justify-center">
        <div className="absolute inset-0 opacity-10">
          <svg className="w-full h-full" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="geo2" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M20 5 L35 20 L20 35 L5 20 Z" fill="none" stroke="currentColor" strokeWidth="0.5" />
                <circle cx="20" cy="20" r="3" fill="currentColor" opacity="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#geo2)" />
          </svg>
        </div>
        <div className="relative z-10 text-center text-primary-foreground px-8">
          <div className="text-5xl font-arabic mb-6 leading-relaxed">اقْرَأْ بِاسْمِ رَبِّكَ</div>
          <h2 className="text-3xl font-bold mb-4">Öğrenmeye Başla</h2>
          <p className="text-primary-foreground/80 text-lg max-w-sm mx-auto">
            Bugün ücretsiz hesap açın ve Kur'an Arapçasını öğrenme yolculuğunuza başlayın.
          </p>
          <div className="mt-8 space-y-3">
            {[
              "Kişiselleştirilmiş öğrenme deneyimi",
              "İlerlemenizi takip edin",
              "Günlük hatırlatıcılar",
              "Kelime kartları ve quizler",
            ].map((item) => (
              <div key={item} className="flex items-center gap-3 text-sm text-primary-foreground/80">
                <CheckCircle className="h-4 w-4 text-accent shrink-0" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Sağ Panel */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 bg-background">
        <div className="w-full max-w-md">
          <Link href="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8 text-sm transition-colors">
            <ArrowLeft className="h-4 w-4" />
            Ana sayfaya dön
          </Link>

          {/* Firestore yüklenene kadar bekle */}
          {!isLoaded && (
            <div className="flex justify-center py-16">
              <div className="w-6 h-6 border-2 border-accent border-t-transparent rounded-full animate-spin" />
            </div>
          )}

          {/* Kayıt kapalıysa engelle */}
          {isLoaded && !registrationEnabled && (
            <div className="flex flex-col items-center justify-center py-16 text-center gap-4">
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
                <Lock className="h-8 w-8 text-muted-foreground" />
              </div>
              <h2 className="text-xl font-bold text-foreground">Kayıt Şu An Kapalı</h2>
              <p className="text-muted-foreground text-sm max-w-xs">
                Yeni üye kaydı geçici olarak devre dışı bırakılmıştır. Lütfen daha sonra tekrar deneyin.
              </p>
              <Link href="/giris" className="text-accent hover:underline text-sm font-medium">
                Giriş sayfasına git
              </Link>
            </div>
          )}

          {isLoaded && registrationEnabled && (<>
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
              <BookOpen className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Hesap Oluştur</h1>
              <p className="text-muted-foreground text-sm">Ücretsiz, hızlı kayıt</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-foreground font-medium">Ad Soyad</Label>
              <Input
                id="name"
                type="text"
                placeholder="Adınız Soyadınız"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="h-11 bg-card border-border focus:border-accent"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-foreground font-medium">E-posta</Label>
              <Input
                id="email"
                type="email"
                placeholder="ornek@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-11 bg-card border-border focus:border-accent"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-foreground font-medium">Şifre</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="En az 6 karakter"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="h-11 bg-card border-border focus:border-accent pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-foreground font-medium">Şifre Tekrar</Label>
              <Input
                id="confirmPassword"
                type={showPassword ? "text" : "password"}
                placeholder="Şifrenizi tekrar girin"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="h-11 bg-card border-border focus:border-accent"
              />
            </div>

            {error && (
              <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm">
                {error}
              </div>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-11 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-lg"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Kayıt oluşturuluyor...
                </>
              ) : (
                "Ücretsiz Kayıt Ol"
              )}
            </Button>
          </form>

          <p className="text-center text-muted-foreground text-sm mt-6">
            Zaten hesabınız var mı?{" "}
            <Link href="/giris" className="text-accent hover:underline font-medium">
              Giriş yapın
            </Link>
          </p>
          </>)}
        </div>
      </div>
    </div>
  );
}
