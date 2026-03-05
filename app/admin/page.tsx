"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth-context";
import { useSettings } from "@/context/settings-context";
import { Header } from "@/components/layout/header";
import {
  Shield, Users, UserCheck, UserX, ToggleLeft, ToggleRight,
  Calendar, Settings
} from "lucide-react";

interface StoredUser {
  id: string;
  name: string;
  email: string;
  joinedAt: string;
  progress: {
    wordsLearned: number;
    lessonsCompleted: number;
    quizScore: number;
    streak: number;
  };
}

export default function AdminPage() {
  const { user, isAdmin, isLoading } = useAuth();
  const { registrationEnabled, setRegistrationEnabled } = useSettings();
  const router = useRouter();
  const [users, setUsers] = useState<StoredUser[]>([]);

  useEffect(() => {
    if (!isLoading && (!user || !isAdmin)) {
      router.push("/");
    }
  }, [user, isAdmin, isLoading, router]);

  useEffect(() => {
    if (isAdmin) {
      try {
        const raw = localStorage.getItem("quran_users");
        if (raw) setUsers(JSON.parse(raw));
      } catch {}
    }
  }, [isAdmin]);

  if (isLoading || !user || !isAdmin) return null;

  const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL || "";

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Başlık */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <Shield className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Admin Paneli</h1>
            <p className="text-muted-foreground text-sm">{adminEmail}</p>
          </div>
        </div>

        {/* İstatistik kartları */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-card border border-border rounded-2xl p-4">
            <Users className="h-5 w-5 text-blue-500 mb-2" />
            <div className="text-2xl font-bold text-foreground">{users.length}</div>
            <div className="text-xs text-muted-foreground">Toplam Kullanıcı</div>
          </div>
          <div className="bg-card border border-border rounded-2xl p-4">
            <UserCheck className="h-5 w-5 text-emerald-500 mb-2" />
            <div className="text-2xl font-bold text-foreground">
              {users.filter(u => u.progress.streak > 0).length}
            </div>
            <div className="text-xs text-muted-foreground">Aktif Kullanıcı</div>
          </div>
          <div className="bg-card border border-border rounded-2xl p-4">
            <Settings className="h-5 w-5 text-amber-500 mb-2" />
            <div className={`text-2xl font-bold ${registrationEnabled ? "text-emerald-500" : "text-red-500"}`}>
              {registrationEnabled ? "Açık" : "Kapalı"}
            </div>
            <div className="text-xs text-muted-foreground">Kayıt Durumu</div>
          </div>
        </div>

        {/* Kayıt Açma/Kapama */}
        <div className="bg-card border border-border rounded-2xl p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-semibold text-foreground mb-1">Yeni Üye Kaydı</h2>
              <p className="text-sm text-muted-foreground">
                {registrationEnabled
                  ? "Yeni kullanıcılar kayıt olabilir."
                  : "Kayıt kapalı — yeni kullanıcılar kayıt olamaz."}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setRegistrationEnabled(!registrationEnabled)}
              className="flex items-center gap-2 transition-opacity hover:opacity-80"
            >
              {registrationEnabled ? (
                <ToggleRight className="h-10 w-10 text-emerald-500" />
              ) : (
                <ToggleLeft className="h-10 w-10 text-muted-foreground" />
              )}
            </button>
          </div>
        </div>

        {/* Kullanıcı Listesi */}
        <div className="bg-card border border-border rounded-2xl overflow-hidden">
          <div className="flex items-center gap-2 p-4 border-b border-border">
            <Users className="h-4 w-4 text-muted-foreground" />
            <h2 className="text-base font-semibold text-foreground">Kullanıcılar</h2>
            <span className="ml-auto text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
              {users.length}
            </span>
          </div>

          {users.length === 0 ? (
            <div className="py-12 text-center text-muted-foreground text-sm">
              <UserX className="h-8 w-8 mx-auto mb-2 opacity-30" />
              Henüz kayıtlı kullanıcı yok
            </div>
          ) : (
            <div className="divide-y divide-border">
              {users.map((u) => (
                <div key={u.id} className="flex items-center justify-between px-4 py-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center text-sm font-bold text-accent shrink-0">
                      {u.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <div className="text-sm font-medium text-foreground flex items-center gap-1.5 truncate">
                        {u.name}
                        {u.email.toLowerCase() === adminEmail.toLowerCase() && (
                          <span className="text-xs bg-primary/10 text-primary px-1.5 py-0.5 rounded font-mono shrink-0">
                            admin
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-muted-foreground truncate">{u.email}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground shrink-0 ml-4">
                    <div className="hidden sm:flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {new Date(u.joinedAt).toLocaleDateString("tr-TR")}
                    </div>
                    <div className="text-right">
                      <div>{u.progress.wordsLearned} kelime</div>
                      <div>{u.progress.streak} gün seri</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
