"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  Star,
  MapPin,
  Clock,
  Phone,
  MessageCircle,
  Navigation,
  ShieldCheck,
  Heart,
  Share2,
  CheckCircle2,
  Sparkles,
  X,
  Calendar,
  Check,
  Loader2,
} from "lucide-react";
import { getCarWashById, createBooking } from "@/lib/api";

interface Service {
  id: string;
  name: string;
  description?: string;
  price: number;
  duration: string;
  active: boolean;
}

interface Schedule {
  id: string;
  dayOfWeek: number;
  openTime: string;
  closeTime: string;
  isOpen: boolean;
}

interface Review {
  id: string;
  rating: number;
  comment: string;
  createdAt: string;
  user?: {
    name: string;
  };
}

interface CarWashDetail {
  id: string;
  name: string;
  tag: string;
  description?: string;
  address: string;
  whatsapp: string;
  isOpen: boolean;
  photos: string[];
  services: Service[];
  schedules: Schedule[];
  reviews: Review[];
}

const vehicleTypes = [
  { id: "hatch", name: "Hatch / Compacto", icon: "🚗" },
  { id: "sedan", name: "Sedan / Médio", icon: "🚘" },
  { id: "suv", name: "SUV / Pick-up", icon: "🚙" },
  { id: "moto", name: "Motocicleta", icon: "🏍️" },
];

const dayNames = [
  "Domingo",
  "Segunda-feira",
  "Terça-feira",
  "Quarta-feira",
  "Quinta-feira",
  "Sexta-feira",
  "Sábado",
];

export default function CarWashDetailPage() {
  const params = useParams();
  const id = params?.id as string;

  const [data, setData] = useState<CarWashDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);

  // Estado do Modal de Agendamento
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState("hatch");
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [bookingDate, setBookingDate] = useState("");
  const [bookingTime, setBookingTime] = useState("09:00");

  // Estado para nova avaliação
  const [userRating, setUserRating] = useState(5);
  const [userComment, setUserComment] = useState("");
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  // Busca dos dados reais da API
  useEffect(() => {
    async function loadDetail() {
      if (!id) return;
      setLoading(true);
      setError(null);
      try {
        const responseData = await getCarWashById(id);
        setData(responseData);

        // Seleciona o primeiro serviço disponível por padrão se houver
        if (responseData.services && responseData.services.length > 0) {
          setSelectedServices([responseData.services[0].id]);
        }
      } catch (err) {
        console.error("Erro ao buscar detalhes do lava-jato:", err);
        setError(
          "Não foi possível carregar as informações deste estabelecimento.",
        );
      } finally {
        setLoading(false);
      }
    }

    loadDetail();
  }, [id]);

  // Cálculo de avaliações e média
  const avgRating = useMemo(() => {
    if (!data?.reviews || data.reviews.length === 0) return "5.0";
    const total = data.reviews.reduce((acc, curr) => acc + curr.rating, 0);
    return (total / data.reviews.length).toFixed(1);
  }, [data?.reviews]);

  // Seleção e alternância de serviços
  const toggleServiceSelection = (serviceId: string) => {
    setSelectedServices((prev) =>
      prev.includes(serviceId)
        ? prev.filter((item) => item !== serviceId)
        : [...prev, serviceId],
    );
  };

  const selectedServicesList = useMemo(() => {
    if (!data?.services) return [];
    return data.services.filter((s) => selectedServices.includes(s.id));
  }, [data?.services, selectedServices]);

  const totalPrice = useMemo(() => {
    return selectedServicesList.reduce(
      (acc, curr) => acc + Number(curr.price),
      0,
    );
  }, [selectedServicesList]);

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userComment.trim()) return;
    setReviewSubmitted(true);
    setUserComment("");
  };

  // Salva o agendamento no banco e abre o WhatsApp
  const handleConfirmBookingWhatsApp = async () => {
    if (!data) return;

    const token = localStorage.getItem("@lavago:token");
    if (!token) {
      alert("Por favor, faça login para realizar um agendamento.");
      return;
    }

    if (selectedServicesList.length === 0) {
      alert("Selecione pelo menos um serviço para agendar.");
      return;
    }

    const vehicleObj = vehicleTypes.find((v) => v.id === selectedVehicle);
    const servicesText = selectedServicesList
      .map(
        (s) =>
          `• ${s.name} (R$ ${Number(s.price).toFixed(2).replace(".", ",")})`,
      )
      .join("\n");

    try {
      // 1. Persiste o agendamento no banco PostgreSQL
      await createBooking(
        {
          carWashId: data.id,
          vehicleType: vehicleObj?.name || selectedVehicle,
          services: selectedServicesList.map((s) => s.name),
          totalPrice,
          date: bookingDate || new Date().toISOString().split("T")[0],
          time: bookingTime,
        },
        token,
      );

      // 2. Abre o WhatsApp com a mensagem pronta
      const formattedDate = bookingDate
        ? new Date(bookingDate + "T00:00:00").toLocaleDateString("pt-BR")
        : "A definir";

      const message = `Olá! Realizei o agendamento pelo *LavaGo*:

🏢 *Estabelecimento:* ${data.name}
🚗 *Veículo:* ${vehicleObj?.icon} ${vehicleObj?.name}

🧼 *Serviços Selecionados:*
${servicesText}

📅 *Data Pretendida:* ${formattedDate}
⏰ *Horário:* ${bookingTime}

💰 *Valor Total Estimado:* R$ ${totalPrice.toFixed(2).replace(".", ",")}

Aguardando confirmação!`;

      const whatsappUrl = `https://wa.me/${data.whatsapp}?text=${encodeURIComponent(message)}`;
      window.open(whatsappUrl, "_blank");
      setIsBookingOpen(false);
    } catch (err: any) {
      alert(err.message || "Erro ao registrar o agendamento.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-surface-background flex flex-col items-center justify-center text-text-primary gap-3">
        <Loader2 className="h-8 w-8 animate-spin text-brand-primary" />
        <p className="text-sm text-text-secondary">
          Carregando detalhes do lava-jato...
        </p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-surface-background flex flex-col items-center justify-center p-4 text-center">
        <h2 className="font-heading text-xl font-bold text-rose-500 mb-2">
          Ops! Ocorreu um erro
        </h2>
        <p className="text-sm text-text-secondary mb-6">
          {error || "Lava-jato não encontrado."}
        </p>
        <Link
          href="/"
          className="bg-brand-primary text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-md"
        >
          Voltar para a página inicial
        </Link>
      </div>
    );
  }

  const photos =
    data.photos && data.photos.length > 0
      ? data.photos
      : [
          "https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?auto=format&fit=crop&w=1200&q=80",
        ];

  return (
    <div className="min-h-screen bg-surface-background text-text-primary pb-16">
      {/* Header Fixo */}
      <header className="border-b border-surface-border bg-surface-card/60 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-text-secondary hover:text-text-primary transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar para a busca
          </Link>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsFavorite(!isFavorite)}
              className={`p-2.5 rounded-xl border border-surface-border transition-all ${
                isFavorite
                  ? "bg-rose-500/10 border-rose-500/30 text-rose-500"
                  : "bg-surface-card text-text-secondary hover:text-text-primary"
              }`}
              title="Favoritar"
            >
              <Heart
                className={`h-4 w-4 ${isFavorite ? "fill-rose-500" : ""}`}
              />
            </button>
            <button
              className="p-2.5 rounded-xl border border-surface-border bg-surface-card text-text-secondary hover:text-text-primary transition-all"
              title="Compartilhar"
            >
              <Share2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {/* Galeria de Fotos */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 rounded-2xl overflow-hidden border border-surface-border mb-8 max-h-[420px]">
          <div className="md:col-span-2 h-72 md:h-full relative overflow-hidden group">
            <img
              src={photos[0]}
              alt={data.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          </div>
          <div className="hidden md:grid grid-rows-2 gap-3 h-full">
            <div className="overflow-hidden group">
              <img
                src={photos[1] || photos[0]}
                alt={data.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="overflow-hidden group">
              <img
                src={photos[2] || photos[0]}
                alt={data.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
          </div>
        </div>

        {/* Layout de Duas Colunas */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Coluna Principal */}
          <div className="lg:col-span-8 space-y-8">
            <div className="bg-surface-card border border-surface-border rounded-2xl p-6 shadow-xl space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-md bg-brand-primary/10 text-brand-primary text-xs font-semibold">
                    {data.tag}
                  </span>
                  <span className="flex items-center gap-1 text-brand-accent text-xs font-medium bg-brand-accent/10 px-2 py-0.5 rounded-md">
                    <ShieldCheck className="h-3.5 w-3.5" /> Verificado
                  </span>
                </div>
                <span className="text-sm font-semibold text-text-muted">
                  $$$
                </span>
              </div>

              <h1 className="font-heading text-2xl sm:text-3xl font-bold tracking-tight text-text-primary">
                {data.name}
              </h1>

              <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-text-secondary">
                <div className="flex items-center gap-1 text-brand-warning font-bold">
                  <Star className="h-4 w-4 fill-brand-warning" />
                  {avgRating}
                  <span className="text-text-muted font-normal">
                    ({data.reviews?.length || 0} avaliações)
                  </span>
                </div>
                <span>•</span>
                <span className="flex items-center gap-1 text-brand-accent font-medium">
                  <Clock className="h-4 w-4" />{" "}
                  {data.isOpen ? "Aberto agora" : "Fechado"}
                </span>
              </div>

              <p className="text-xs sm:text-sm text-text-secondary flex items-start gap-2 pt-2 border-t border-surface-border">
                <MapPin className="h-4 w-4 text-brand-primary shrink-0 mt-0.5" />
                {data.address}
              </p>

              {data.description && (
                <p className="text-sm text-text-secondary leading-relaxed pt-2">
                  {data.description}
                </p>
              )}
            </div>

            {/* Tabela de Serviços Reais */}
            <div className="space-y-4">
              <h2 className="font-heading text-xl font-bold text-text-primary flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-brand-primary" />
                Serviços & Preços
              </h2>

              <div className="space-y-3">
                {data.services && data.services.length > 0 ? (
                  data.services.map((service) => (
                    <div
                      key={service.id}
                      className="bg-surface-card hover:bg-surface-cardHover border border-surface-border rounded-2xl p-5 transition-all shadow-md"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="space-y-1">
                          <h3 className="font-heading font-semibold text-base text-text-primary">
                            {service.name}
                          </h3>
                          {service.description && (
                            <p className="text-xs text-text-secondary">
                              {service.description}
                            </p>
                          )}
                          <span className="inline-flex items-center gap-1 text-[11px] text-text-muted mt-2">
                            <Clock className="h-3 w-3" /> Duração aprox.:{" "}
                            {service.duration}
                          </span>
                        </div>

                        <div className="text-right shrink-0">
                          <span className="font-heading font-bold text-lg text-text-primary">
                            R${" "}
                            {Number(service.price).toFixed(2).replace(".", ",")}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-text-muted">
                    Nenhum serviço cadastrado ainda.
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Coluna Lateral */}
          <div className="lg:col-span-4 space-y-5 sticky top-24">
            <div className="bg-surface-card border border-surface-border rounded-2xl p-6 shadow-xl space-y-4">
              <h3 className="font-heading font-semibold text-base text-text-primary">
                Falar com o estabelecimento
              </h3>

              <div className="space-y-2.5">
                <button
                  onClick={() => setIsBookingOpen(true)}
                  className="w-full bg-brand-accent hover:bg-emerald-600 text-white font-medium py-3 rounded-xl text-sm transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20"
                >
                  <MessageCircle className="h-4 w-4" />
                  Agendar pelo WhatsApp
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* MODAL INTERATIVO DE AGENDAMENTO */}
      {isBookingOpen && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-surface-card border border-surface-border rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl space-y-5 p-6 relative">
            <div className="flex items-center justify-between border-b border-surface-border pb-3">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-brand-accent" />
                <h3 className="font-heading font-bold text-lg text-text-primary">
                  Montar Agendamento
                </h3>
              </div>
              <button
                onClick={() => setIsBookingOpen(false)}
                className="p-1 text-text-muted hover:text-text-primary rounded-lg transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* 1. Seleção de Veículo */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider block">
                1. Tipo de Veículo
              </label>
              <div className="grid grid-cols-2 gap-2">
                {vehicleTypes.map((v) => {
                  const isSelected = selectedVehicle === v.id;
                  return (
                    <button
                      key={v.id}
                      type="button"
                      onClick={() => setSelectedVehicle(v.id)}
                      className={`p-3 rounded-xl border text-xs font-medium flex items-center gap-2 transition-all ${
                        isSelected
                          ? "border-brand-primary bg-brand-primary/10 text-text-primary font-semibold"
                          : "border-surface-border bg-surface-input text-text-secondary hover:text-text-primary"
                      }`}
                    >
                      <span className="text-base">{v.icon}</span>
                      <span>{v.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 2. Seleção de Serviços Reais */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider block">
                2. Selecione os Serviços
              </label>
              <div className="space-y-2">
                {data.services && data.services.length > 0 ? (
                  data.services.map((s) => {
                    const isSelected = selectedServices.includes(s.id);
                    return (
                      <div
                        key={s.id}
                        onClick={() => toggleServiceSelection(s.id)}
                        className={`p-3 rounded-xl border text-xs cursor-pointer flex items-center justify-between transition-all ${
                          isSelected
                            ? "border-brand-accent bg-brand-accent/10 text-text-primary font-semibold"
                            : "border-surface-border bg-surface-input text-text-secondary hover:text-text-primary"
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <div
                            className={`h-4 w-4 rounded-md border flex items-center justify-center transition-colors ${
                              isSelected
                                ? "bg-brand-accent border-brand-accent text-white"
                                : "border-surface-border"
                            }`}
                          >
                            {isSelected && (
                              <Check className="h-3 w-3 stroke-[3]" />
                            )}
                          </div>
                          <span className="font-medium">{s.name}</span>
                        </div>
                        <span className="font-semibold text-text-primary">
                          R$ {Number(s.price).toFixed(2).replace(".", ",")}
                        </span>
                      </div>
                    );
                  })
                ) : (
                  <p className="text-xs text-text-muted py-2">
                    Este lava-jato ainda não cadastrou serviços no sistema.
                  </p>
                )}
              </div>
            </div>

            {/* 3. Data e Horário */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider block">
                3. Data e Horário Pretendidos
              </label>
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="date"
                  value={bookingDate}
                  onChange={(e) => setBookingDate(e.target.value)}
                  className="bg-surface-input border border-surface-border rounded-xl px-3 py-2 text-xs text-text-primary focus:outline-none focus:border-brand-primary"
                />
                <select
                  value={bookingTime}
                  onChange={(e) => setBookingTime(e.target.value)}
                  className="bg-surface-input border border-surface-border rounded-xl px-3 py-2 text-xs text-text-primary focus:outline-none focus:border-brand-primary"
                >
                  {[
                    "08:00",
                    "09:00",
                    "10:00",
                    "11:00",
                    "13:00",
                    "14:00",
                    "15:00",
                    "16:00",
                    "17:00",
                  ].map((time) => (
                    <option key={time} value={time}>
                      {time}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Resumo do Total & Botão de Confirmação */}
            <div className="pt-3 border-t border-surface-border space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-text-secondary font-medium">
                  Total Estimado:
                </span>
                <span className="font-heading font-bold text-xl text-brand-accent">
                  R$ {totalPrice.toFixed(2).replace(".", ",")}
                </span>
              </div>

              <button
                type="button"
                disabled={selectedServicesList.length === 0}
                onClick={handleConfirmBookingWhatsApp}
                className="w-full bg-brand-accent hover:bg-emerald-600 disabled:opacity-50 text-white font-semibold py-3 rounded-xl text-sm transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20"
              >
                <MessageCircle className="h-4 w-4" />
                Enviar Solicitação no WhatsApp
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
