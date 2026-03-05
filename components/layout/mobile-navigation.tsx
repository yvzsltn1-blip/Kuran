"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { BookOpen, Home, Menu, GraduationCap, Layers, Gamepad2, LayoutDashboard, LogOut, LogIn, UserPlus } from "lucide-react";
import { useState } from "react";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { useAuth } from "@/context/auth-context";

export function MobileNavigation() {
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    setOpen(false);
    router.push("/");
  };

  const close = () => setOpen(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="h-9 w-9">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Menüyü aç</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[300px] sm:w-[360px]">
        <SheetTitle className="sr-only">Navigasyon Menüsü</SheetTitle>

        {user && (
          <div className="mt-2 mb-6 p-4 bg-card rounded-2xl border border-border">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center text-base font-bold text-accent">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0">
                <div className="font-semibold text-foreground truncate">{user.name}</div>
                <div className="text-xs text-muted-foreground truncate">{user.email}</div>
              </div>
            </div>
          </div>
        )}

        <nav className="flex flex-col space-y-1 mt-2">
          <Link href="/" onClick={close} className="flex items-center gap-3 px-3 py-3 rounded-xl text-foreground hover:bg-muted/50 transition-colors">
            <Home className="h-5 w-5 text-muted-foreground" />
            <span className="font-medium">Ana Sayfa</span>
          </Link>
          <Link href="/quran/surahs" onClick={close} className="flex items-center gap-3 px-3 py-3 rounded-xl text-foreground hover:bg-muted/50 transition-colors">
            <BookOpen className="h-5 w-5 text-muted-foreground" />
            <span className="font-medium">Kur'an Oku</span>
          </Link>
          <Link href="/ogren" onClick={close} className="flex items-center gap-3 px-3 py-3 rounded-xl text-foreground hover:bg-muted/50 transition-colors">
            <GraduationCap className="h-5 w-5 text-muted-foreground" />
            <span className="font-medium">Öğrenme Merkezi</span>
          </Link>
          <Link href="/kelime" onClick={close} className="flex items-center gap-3 px-3 py-3 rounded-xl text-foreground hover:bg-muted/50 transition-colors">
            <Layers className="h-5 w-5 text-muted-foreground" />
            <span className="font-medium">Kelime Kartları</span>
          </Link>
          <Link href="/oyun" onClick={close} className="flex items-center gap-3 px-3 py-3 rounded-xl text-foreground hover:bg-muted/50 transition-colors">
            <Gamepad2 className="h-5 w-5 text-muted-foreground" />
            <span className="font-medium">Oyun Alanı</span>
          </Link>

          {user && (
            <Link href="/dashboard" onClick={close} className="flex items-center gap-3 px-3 py-3 rounded-xl text-foreground hover:bg-muted/50 transition-colors">
              <LayoutDashboard className="h-5 w-5 text-muted-foreground" />
              <span className="font-medium">Dashboard</span>
            </Link>
          )}

          <div className="border-t border-border pt-3 mt-2">
            {user ? (
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-950 transition-colors"
              >
                <LogOut className="h-5 w-5" />
                <span className="font-medium">Çıkış Yap</span>
              </button>
            ) : (
              <div className="flex flex-col gap-2">
                <Link href="/giris" onClick={close}>
                  <Button variant="outline" className="w-full gap-2 rounded-xl">
                    <LogIn className="h-4 w-4" />
                    Giriş Yap
                  </Button>
                </Link>
                <Link href="/kayit" onClick={close}>
                  <Button className="w-full gap-2 bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl">
                    <UserPlus className="h-4 w-4" />
                    Ücretsiz Kayıt Ol
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </nav>
      </SheetContent>
    </Sheet>
  );
}
