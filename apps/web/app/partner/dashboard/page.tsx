"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Sparkles,
  Calendar,
  Clock,
  Settings,
  Power,
  LogOut,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Car,
  DollarSign,
  Building2,
} from "lucide-react";

interface Schedule {
  id: string;
  dayOfWeek: number;
  openTime: string;
  closeTime: string;
  isOpen: boolean;
}

const dayNames = [
  "Domingo",
  "Segunda-feira",
  "Terça-feira",
  "Quarta-feira",
  "Quinta-feira",
  "Sexta-feira",
  "Sábado",
];

export default function PartnerDashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [partnerData, setPartnerData] = useState<any>(null);
  const [carWash, setCarWash] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<"bookings" | "schedules">(
    "bookings",
  );
  const [isOpenNow, setIsOpenNow] = useState(true);

  // Busca perfil do parceiro logado na API
  useEffect(() => {
    async function loadPartnerProfile() {
      const token = localStorage.getItem("@lavago:token");
      if (!token) {
        router.push("/login");
        return;
      }

      try {
        const res = await fetch("http://localhost:3001/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) throw new Error("Sessão expirada");

        const data = await res.json();
        setPartnerData(data);

        // Se o parceiro não possui um lava-jato cadastrado, direciona para a tela de setup
        if (!data.carWash) {
          router.push("/partner/setup");
          return;
        }

        setCarWash(data.carWash);
        setIsOpenNow(data.carWash.isOpen);
      } catch (err) {
        localStorage.removeItem("@lavago:token");
        router.push("/login");
      }
      fontFinally: {
        setLoading(false);
      }
    }

    loadPartnerProfile();
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("@lavago:token");
    localStorage.removeItem("@lavago:user");
    router.push("/login");
  };

  const toggleStoreStatus = () => {
    setIsOpenNow((prev) => !prev);
    // Aqui enviaremos a requisição PATCH para a API futuramente
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-surface-background flex flex-col items-center justify-center text-text-primary gap-3">
        <Loader2 className="h-8 w-8 animate-spin text-brand-primary" />
        <p className="text-sm text-text-secondary">
          Carregando painel do parceiro...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface-background text-text-primary flex flex-col">
      {/* Topbar */}
      <header className="border-b border-surface-border bg-surface-card/60 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2">
              <div className="h-9 w-9 rounded-xl bg-brand-primary flex items-center justify-center shadow-lg shadow-brand-primary/30">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <span className="font-heading font-bold text-xl tracking-tight text-text-primary">
                Lava<span className="text-brand-primary">Go</span>
              </span>
            </Link>
            <span className="px-2.5 py-0.5 rounded-md bg-brand-primary/10 text-brand-primary text-xs font-semibold">
              Painel do Parceiro
            </span>
          </div>

          <div className="flex items-center gap-4">
            {/* Toggle Status Aberto/Fechado */}
            <button
              onClick={toggleStoreStatus}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-2 border transition-all ${
                isOpenNow
                  ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/30"
                  : "bg-rose-500/10 text-rose-500 border-rose-500/30"
              }`}
            >
              <Power className="h-3.5 w-3.5" />
              {isOpenNow ? "Aberto para Atendimento" : "Fechado"}
            </button>

            <button
              onClick={handleLogout}
              className="p-2 text-text-muted hover:text-rose-500 transition-colors"
              title="Sair da conta"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Banner do Estabelecimento */}
        <div className="bg-surface-card border border-surface-border rounded-2xl p-6 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Building2 className="h-5 w-5 text-brand-primary" />
              <h1 className="font-heading text-xl font-bold text-text-primary">
                {carWash?.name}
              </h1>
            </div>
            <p className="text-xs text-text-secondary">{carWash?.address}</p>
          </div>

          <div className="flex items-center gap-3 text-xs">
            <div className="bg-surface-input border border-surface-border px-4 py-2 rounded-xl text-center">
              <span className="block text-text-muted text-[10px] uppercase font-bold">
                WhatsApp
              </span>
              <span className="font-semibold text-text-primary">
                {carWash?.whatsapp}
              </span>
            </div>
          </div>
        </div>

        {/* Abas de Navegação */}
        <div className="flex items-center gap-2 border-b border-surface-border pb-1 text-xs">
          <button
            onClick={() => setActiveTab("bookings")}
            className={`px-4 py-2 rounded-xl font-semibold flex items-center gap-2 transition-all ${
              activeTab === "bookings"
                ? "bg-brand-primary text-white shadow-md shadow-brand-primary/20"
                : "text-text-secondary hover:text-text-primary"
            }`}
          >
            <Calendar className="h-4 w-4" /> Agendamentos
          </button>
          <button
            onClick={() => setActiveTab("schedules")}
            className={`px-4 py-2 rounded-xl font-semibold flex items-center gap-2 transition-all ${
              activeTab === "schedules"
                ? "bg-brand-primary text-white shadow-md shadow-brand-primary/20"
                : "text-text-secondary hover:text-text-primary"
            }`}
          >
            <Clock className="h-4 w-4" /> Horários de Atendimento
          </button>
        </div>

        {/* Conteúdo da Aba: Agendamentos */}
        {activeTab === "bookings" && (
          <div className="space-y-4">
            <div className="bg-surface-card border border-surface-border rounded-2xl p-8 text-center space-y-3">
              <Calendar className="h-8 w-8 text-text-muted mx-auto" />
              <h3 className="font-heading font-semibold text-text-primary text-base">
                Nenhum agendamento pendente
              </h3>
              <p className="text-xs text-text-secondary max-w-sm mx-auto">
                Quando os clientes solicitarem agendamentos pelo aplicativo, os
                registros aparecerão organizados nesta lista.
              </p>
            </div>
          </div>
        )}

        {/* Conteúdo da Aba: Horários */}
        {activeTab === "schedules" && (
          <div className="bg-surface-card border border-surface-border rounded-2xl p-6 shadow-xl space-y-4 max-w-2xl">
            <h3 className="font-heading font-bold text-base text-text-primary">
              Horários de Funcionamento Semanal
            </h3>
            <div className="space-y-2 text-xs">
              {carWash?.schedules?.map((sc: Schedule) => (
                <div
                  key={sc.id}
                  className="flex items-center justify-between p-3 bg-surface-input rounded-xl border border-surface-border"
                >
                  <span className="font-semibold text-text-primary">
                    {dayNames[sc.dayOfWeek]}
                  </span>
                  <span className="text-text-secondary">
                    {sc.isOpen
                      ? `${sc.openTime} às ${sc.closeTime}`
                      : "Fechado"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
