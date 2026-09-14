"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Sparkles,
  Calendar,
  Clock,
  Power,
  LogOut,
  Loader2,
  Building2,
  Plus,
  Sparkle,
  X,
  CheckCircle2,
} from "lucide-react";
import { getPartnerBookings, createService } from "@/lib/api";

interface Schedule {
  id: string;
  dayOfWeek: number;
  openTime: string;
  closeTime: string;
  isOpen: boolean;
}

interface Service {
  id: string;
  name: string;
  description?: string;
  price: number;
  duration: string;
}

interface Booking {
  id: string;
  vehicleType: string;
  services: string[];
  totalPrice: number;
  date: string;
  time: string;
  status: string;
  client?: {
    name: string;
    email: string;
    phone?: string;
  };
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
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [activeTab, setActiveTab] = useState<
    "bookings" | "services" | "schedules"
  >("bookings");
  const [isOpenNow, setIsOpenNow] = useState(true);

  // Estado do Modal de Criar Serviço
  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);
  const [serviceName, setServiceName] = useState("");
  const [serviceDescription, setServiceDescription] = useState("");
  const [servicePrice, setServicePrice] = useState("");
  const [serviceDuration, setServiceDuration] = useState("1h 00min");
  const [savingService, setSavingService] = useState(false);

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

        if (!data.carWash) {
          router.push("/partner/setup");
          return;
        }

        setCarWash(data.carWash);
        setIsOpenNow(data.carWash.isOpen);

        const bookingsData = await getPartnerBookings(token);
        setBookings(bookingsData);
      } catch (err) {
        console.error("Erro ao carregar dados do parceiro:", err);
        localStorage.removeItem("@lavago:token");
        router.push("/login");
      } finally {
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

  const handleAddService = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingService(true);

    const token = localStorage.getItem("@lavago:token");
    if (!token) return;

    try {
      const newService = await createService(
        {
          name: serviceName,
          description: serviceDescription,
          price: servicePrice,
          duration: serviceDuration,
        },
        token,
      );

      // Atualiza a lista local de serviços
      setCarWash((prev: any) => ({
        ...prev,
        services: [...(prev.services || []), newService],
      }));

      setServiceName("");
      setServiceDescription("");
      setServicePrice("");
      setIsServiceModalOpen(false);
    } catch (err: any) {
      alert(err.message || "Erro ao criar serviço.");
    } finally {
      setSavingService(false);
    }
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
            <button
              onClick={() => setIsOpenNow((prev) => !prev)}
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
            <Calendar className="h-4 w-4" /> Agendamentos ({bookings.length})
          </button>
          <button
            onClick={() => setActiveTab("services")}
            className={`px-4 py-2 rounded-xl font-semibold flex items-center gap-2 transition-all ${
              activeTab === "services"
                ? "bg-brand-primary text-white shadow-md shadow-brand-primary/20"
                : "text-text-secondary hover:text-text-primary"
            }`}
          >
            <Sparkle className="h-4 w-4" /> Meus Serviços (
            {carWash?.services?.length || 0})
          </button>
          <button
            onClick={() => setActiveTab("schedules")}
            className={`px-4 py-2 rounded-xl font-semibold flex items-center gap-2 transition-all ${
              activeTab === "schedules"
                ? "bg-brand-primary text-white shadow-md shadow-brand-primary/20"
                : "text-text-secondary hover:text-text-primary"
            }`}
          >
            <Clock className="h-4 w-4" /> Horários
          </button>
        </div>

        {/* Aba: Agendamentos */}
        {activeTab === "bookings" && (
          <div className="space-y-4">
            {bookings.length === 0 ? (
              <div className="bg-surface-card border border-surface-border rounded-2xl p-8 text-center space-y-3">
                <Calendar className="h-8 w-8 text-text-muted mx-auto" />
                <h3 className="font-heading font-semibold text-text-primary text-base">
                  Nenhum agendamento pendente
                </h3>
                <p className="text-xs text-text-secondary max-w-sm mx-auto">
                  Os agendamentos dos clientes aparecerão aqui.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {bookings.map((booking) => (
                  <div
                    key={booking.id}
                    className="bg-surface-card border border-surface-border rounded-2xl p-5 shadow-lg space-y-3"
                  >
                    <div className="flex items-center justify-between border-b border-surface-border pb-2">
                      <span className="text-xs font-bold text-brand-primary">
                        {booking.vehicleType}
                      </span>
                      <span className="px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-500 text-[11px] font-semibold">
                        {booking.status}
                      </span>
                    </div>

                    <div className="space-y-1">
                      <h4 className="font-heading font-semibold text-sm text-text-primary">
                        {booking.client?.name || "Cliente LavaGo"}
                      </h4>
                      <p className="text-xs text-text-secondary">
                        📱 {booking.client?.phone || "Não informado"}
                      </p>
                    </div>

                    <div className="text-xs text-text-muted space-y-1 pt-1">
                      <p>
                        📅 Data:{" "}
                        {new Date(booking.date).toLocaleDateString("pt-BR")} às{" "}
                        {booking.time}
                      </p>
                      <p>
                        🧼 Serviços:{" "}
                        {Array.isArray(booking.services)
                          ? booking.services.join(", ")
                          : booking.services}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-surface-border flex items-center justify-between">
                      <span className="text-xs text-text-secondary font-medium">
                        Total:
                      </span>
                      <span className="font-heading font-bold text-base text-brand-accent">
                        R$ {booking.totalPrice.toFixed(2).replace(".", ",")}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Aba: Gestão de Serviços */}
        {activeTab === "services" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-heading font-bold text-base text-text-primary">
                Serviços Oferecidos
              </h3>
              <button
                onClick={() => setIsServiceModalOpen(true)}
                className="bg-brand-primary hover:bg-brand-hover text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-md flex items-center gap-1.5 transition-all"
              >
                <Plus className="h-4 w-4" /> Novo Serviço
              </button>
            </div>

            {!carWash?.services || carWash.services.length === 0 ? (
              <div className="bg-surface-card border border-surface-border rounded-2xl p-8 text-center space-y-3">
                <Sparkle className="h-8 w-8 text-text-muted mx-auto" />
                <h3 className="font-heading font-semibold text-text-primary text-base">
                  Nenhum serviço cadastrado
                </h3>
                <p className="text-xs text-text-secondary max-w-sm mx-auto">
                  Cadastre serviços para que seus clientes possam selecioná-los
                  no agendamento!
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {carWash.services.map((s: Service) => (
                  <div
                    key={s.id}
                    className="bg-surface-card border border-surface-border rounded-2xl p-5 shadow-lg space-y-2"
                  >
                    <div className="flex items-start justify-between">
                      <h4 className="font-heading font-bold text-base text-text-primary">
                        {s.name}
                      </h4>
                      <span className="font-heading font-bold text-base text-brand-accent">
                        R$ {Number(s.price).toFixed(2).replace(".", ",")}
                      </span>
                    </div>
                    {s.description && (
                      <p className="text-xs text-text-secondary">
                        {s.description}
                      </p>
                    )}
                    <span className="inline-block text-[11px] text-text-muted pt-1">
                      ⏱ Duração: {s.duration}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Aba: Horários */}
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

      {/* MODAL DE CADASTRAR SERVIÇO */}
      {isServiceModalOpen && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-surface-card border border-surface-border rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 relative">
            <div className="flex items-center justify-between border-b border-surface-border pb-3">
              <h3 className="font-heading font-bold text-base text-text-primary">
                Novo Serviço
              </h3>
              <button
                onClick={() => setIsServiceModalOpen(false)}
                className="p-1 text-text-muted hover:text-text-primary rounded-lg"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleAddService} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-text-secondary mb-1">
                  Nome do Serviço *
                </label>
                <input
                  type="text"
                  required
                  value={serviceName}
                  onChange={(e) => setServiceName(e.target.value)}
                  placeholder="Ex: Lavagem Geral + Cera"
                  className="w-full bg-surface-input border border-surface-border rounded-xl px-3 py-2 text-text-primary focus:outline-none focus:border-brand-primary"
                />
              </div>

              <div>
                <label className="block font-semibold text-text-secondary mb-1">
                  Preço (R$) *
                </label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={servicePrice}
                  onChange={(e) => setServicePrice(e.target.value)}
                  placeholder="Ex: 80.00"
                  className="w-full bg-surface-input border border-surface-border rounded-xl px-3 py-2 text-text-primary focus:outline-none focus:border-brand-primary"
                />
              </div>

              <div>
                <label className="block font-semibold text-text-secondary mb-1">
                  Duração Estimada *
                </label>
                <select
                  value={serviceDuration}
                  onChange={(e) => setServiceDuration(e.target.value)}
                  className="w-full bg-surface-input border border-surface-border rounded-xl px-3 py-2 text-text-primary focus:outline-none focus:border-brand-primary"
                >
                  <option value="30 min">30 min</option>
                  <option value="45 min">45 min</option>
                  <option value="1h 00min">1h 00min</option>
                  <option value="1h 30min">1h 30min</option>
                  <option value="2h 00min">2h 00min</option>
                  <option value="3h 00min+">3h 00min+</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-text-secondary mb-1">
                  Descrição do Serviço
                </label>
                <textarea
                  rows={2}
                  value={serviceDescription}
                  onChange={(e) => setServiceDescription(e.target.value)}
                  placeholder="Ex: Inclui lavagem externa a seco, aspireção e pretinho nos pneus."
                  className="w-full bg-surface-input border border-surface-border rounded-xl px-3 py-2 text-text-primary focus:outline-none focus:border-brand-primary"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsServiceModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-text-secondary hover:bg-surface-input font-semibold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={savingService}
                  className="bg-brand-primary hover:bg-brand-hover text-white font-semibold px-4 py-2 rounded-xl shadow-md flex items-center gap-1.5"
                >
                  {savingService && (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  )}
                  Salvar Serviço
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
