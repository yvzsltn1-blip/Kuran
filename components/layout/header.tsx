"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { LanguageToggle } from "@/components/language-toggle";
import { MobileNavigation } from "@/components/layout/mobile-navigation";
import { BookOpen, Home, GraduationCap, Layers, Gamepad2, ChevronDown, LogOut, LayoutDashboard, Shield } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useAuth } from "@/context/auth-context";
import clsx from "clsx";

function navLinkClass(pathname: string, target: string | RegExp) {
  const isActive =
    typeof target === "string"
      ? pathname === target
      : target instanceof RegExp
      ? target.test(pathname)
      : false;
  return clsx(
    "flex items-center space-x-1 text-sm font-medium transition-colors hover:text-primary dark:hover:text-accent",
    isActive
      ? "text-primary dark:text-accent font-bold"
      : "text-muted-foreground"
  );
}

export function Header() {
  const pathname = usePathname();
  const isMobile = useIsMobile();
  const { user, isAdmin, logout } = useAuth();
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [prevPath, setPrevPath] = useState(pathname);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (pathname !== prevPath) {
      setLoading(true);
      setPrevPath(pathname);
      const timeout = setTimeout(() => setLoading(false), 500);
      return () => clearTimeout(timeout);
    }
  }, [pathname, prevPath]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    setUserMenuOpen(false);
    router.push("/");
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b-2 border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      {loading && (
        <div className="fixed top-0 left-0 w-full h-1 z-[100] bg-accent animate-pulse transition-all duration-300" />
      )}
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2 shrink-0">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <BookOpen className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="text-lg font-bold text-foreground hidden sm:block">
            Kur'an Arapçası
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden lg:flex flex-1 justify-between items-center ml-8">
          <nav className="flex flex-1 items-center justify-center space-x-6">
            <Link href="/" className={navLinkClass(pathname, "/")}>
              <Home className="h-4 w-4" />
              <span>Ana Sayfa</span>
            </Link>
            <Link href="/quran/surahs" className={navLinkClass(pathname, /^\/quran/)}>
              <BookOpen className="h-4 w-4" />
              <span>Kur'an Oku</span>
            </Link>
            <Link href="/ogren" className={navLinkClass(pathname, /^\/ogren/)}>
              <GraduationCap className="h-4 w-4" />
              <span>Öğren</span>
            </Link>
            <Link href="/kelime" className={navLinkClass(pathname, /^\/kelime/)}>
              <Layers className="h-4 w-4" />
              <span>Kelimeler</span>
            </Link>
            <Link href="/oyun" className={navLinkClass(pathname, /^\/oyun/)}>
              <Gamepad2 className="h-4 w-4" />
              <span>Oyun</span>
            </Link>
          </nav>

          <div className="flex items-center space-x-2">
            <LanguageToggle />
            <ThemeToggle />

            {user ? (
              <div className="relative" ref={menuRef}>
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 bg-card border border-border rounded-xl px-3 py-2 hover:border-accent/50 transition-colors"
                >
                  <div className="w-6 h-6 rounded-full bg-accent/20 flex items-center justify-center text-xs font-bold text-accent">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-sm font-medium text-foreground max-w-[100px] truncate">
                    {user.name.split(" ")[0]}
                  </span>
                  <ChevronDown className={`h-3.5 w-3.5 text-muted-foreground transition-transform ${userMenuOpen ? "rotate-180" : ""}`} />
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 top-full mt-2 w-48 bg-card border border-border rounded-2xl shadow-xl py-1 z-50">
                    <div className="px-3 py-2 border-b border-border mb-1">
                      <div className="text-xs text-muted-foreground">Giriş yapıldı</div>
                      <div className="text-sm font-medium text-foreground truncate">{user.email}</div>
                    </div>
                    <Link
                      href="/dashboard"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 text-sm text-foreground hover:bg-muted/50 transition-colors"
                    >
                      <LayoutDashboard className="h-4 w-4 text-muted-foreground" />
                      Dashboard
                    </Link>
                    {isAdmin && (
                      <Link
                        href="/admin"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2 px-3 py-2 text-sm text-primary hover:bg-primary/10 transition-colors"
                      >
                        <Shield className="h-4 w-4" />
                        Admin Paneli
                      </Link>
                    )}
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-950 transition-colors"
                    >
                      <LogOut className="h-4 w-4" />
                      Çıkış Yap
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Button asChild variant="ghost" size="sm" className="text-muted-foreground">
                  <Link href="/giris">Giriş</Link>
                </Button>
                <Button asChild size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90">
                  <Link href="/kayit">Kayıt Ol</Link>
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Mobile */}
        <div className="flex lg:hidden items-center space-x-2">
          <LanguageToggle />
          <ThemeToggle />
          {user && (
            <Link href="/dashboard" className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center text-sm font-bold text-accent">
              {user.name.charAt(0).toUpperCase()}
            </Link>
          )}
          <MobileNavigation />
        </div>
      </div>
    </header>
  );
}
