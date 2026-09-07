"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
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
  Car,
  Calendar,
  DollarSign,
  Check,
} from "lucide-react";

const mockCarWashDetails = {
  id: "1",
  name: "Auto Spa Detailing Prime",
  tag: "Estética Premium",
  rating: 4.9,
  reviewsCount: 128,
  priceRange: "$$$",
  status: "Aberto agora",
  address: "Av. das Américas, 4200 - Barra da Tijuca, Rio de Janeiro - RJ",
  phone: "(21) 98765-4321",
  whatsapp: "5521987654321",
  description:
    "Centro especializado em estética automotiva de alto padrão. Trabalhamos com produtos importados e técnicas que preservam a integridade da pintura e o acabamento do seu veículo.",
  images: [
    "https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1601362840469-51e4d8d58785?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1607860108855-64acf2078ed9?auto=format&fit=crop&w=600&q=80",
  ],
  services: [
    {
      id: "s1",
      name: "Lavagem Técnica Detalhada",
      description:
        "Limpeza de chassis, caixas de roda, remoção de piche e acabamento com cera líquida.",
      priceNumber: 90,
      priceFormatted: "R$ 90,00",
      duration: "1h 15min",
    },
    {
      id: "s2",
      name: "Higienização Interna Completa",
      description:
        "Lavagem a seco de bancos, teto, carpetes e esterilização com ozônio.",
      priceNumber: 220,
      priceFormatted: "R$ 220,00",
      duration: "2h 30min",
    },
    {
      id: "s3",
      name: "Polimento Técnico & Espelhamento",
      description:
        "Correção de verniz, remoção de micro-riscos e selagem de alto brilho.",
      priceNumber: 450,
      priceFormatted: "R$ 450,00",
      duration: "4h 00min",
    },
    {
      id: "s4",
      name: "Vitrificação de Pintura (Ceramic Coating)",
      description:
        "Proteção nanométrica contra raios UV e contaminantes com durabilidade de até 3 anos.",
      priceNumber: 890,
      priceFormatted: "R$ 890,00",
      duration: "1 dia",
    },
  ],
  schedules: [
    { day: "Segunda a Sexta", hours: "08:00 - 18:30" },
    { day: "Sábado", hours: "08:00 - 16:00" },
    { day: "Domingo", hours: "Fechado" },
  ],
  reviews: [
    {
      id: "r1",
      author: "Rodrigo M.",
      date: "Há 3 dias",
      rating: 5,
      comment:
        "Serviço impecável! Meu carro parecia zero saindo da vitrificação. Atendimento excelente.",
    },
    {
      id: "r2",
      author: "Camila P.",
      date: "Há 1 semana",
      rating: 5,
      comment:
        "A higienização interna eliminou completamente o cheiro de mofo. Super recomendo.",
    },
  ],
};

const vehicleTypes = [
  { id: "hatch", name: "Hatch / Compacto", icon: "🚗" },
  { id: "sedan", name: "Sedan / Manteve", icon: "🚘" },
  { id: "suv", name: "SUV / Pick-up", icon: "🚙" },
  { id: "moto", name: "Motocicleta", icon: "🏍️" },
];

export default function CarWashDetailPage() {
  const data = mockCarWashDetails;
  const [isFavorite, setIsFavorite] = useState(false);

  // Estado do Modal de Agendamento
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState("hatch");
  const [selectedServices, setSelectedServices] = useState<string[]>(["s1"]);
  const [bookingDate, setBookingDate] = useState("");
  const [bookingTime, setBookingTime] = useState("09:00");

  // Estado para nova avaliação
  const [userRating, setUserRating] = useState(5);
  const [userComment, setUserComment] = useState("");
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  // Cálculo do valor total e seleção de serviços
  const toggleServiceSelection = (serviceId: string) => {
    setSelectedServices((prev) =>
      prev.includes(serviceId)
        ? prev.filter((id) => id !== serviceId)
        : [...prev, serviceId],
    );
  };

  const selectedServicesList = useMemo(() => {
    return data.services.filter((s) => selectedServices.includes(s.id));
  }, [selectedServices]);

  const totalPrice = useMemo(() => {
    return selectedServicesList.reduce(
      (acc, curr) => acc + curr.priceNumber,
      0,
    );
  }, [selectedServicesList]);

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userComment.trim()) return;
    setReviewSubmitted(true);
    setUserComment("");
  };

  // Gerar mensagem do WhatsApp e redirecionar
  const handleConfirmBookingWhatsApp = () => {
    const vehicleObj = vehicleTypes.find((v) => v.id === selectedVehicle);
    const servicesText = selectedServicesList
      .map((s) => `• ${s.name} (${s.priceFormatted})`)
      .join("\n");

    const formattedDate = bookingDate
      ? new Date(bookingDate + "T00:00:00").toLocaleDateString("pt-BR")
      : "A definir";

    const message = `Olá! Gostaria de agendar um serviço pelo *LavaGo*:

🏢 *Estabelecimento:* ${data.name}
🚗 *Veículo:* ${vehicleObj?.icon} ${vehicleObj?.name}

🧼 *Serviços Selecionados:*
${servicesText}

📅 *Data Pretendida:* ${formattedDate}
⏰ *Horário:* ${bookingTime}

💰 *Valor Total Estimado:* R$ ${totalPrice.toFixed(2).replace(".", ",")}

Aguardando confirmação de disponibilidade!`;

    const whatsappUrl = `https://wa.me/${data.whatsapp}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");
    setIsBookingOpen(false);
  };

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
              src={data.images[0]}
              alt={data.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          </div>
          <div className="hidden md:grid grid-rows-2 gap-3 h-full">
            <div className="overflow-hidden group">
              <img
                src={data.images[1]}
                alt={data.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="overflow-hidden group">
              <img
                src={data.images[2]}
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
            {/* Título & Informações Principais */}
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
                  {data.priceRange}
                </span>
              </div>

              <h1 className="font-heading text-2xl sm:text-3xl font-bold tracking-tight text-text-primary">
                {data.name}
              </h1>

              <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-text-secondary">
                <div className="flex items-center gap-1 text-brand-warning font-bold">
                  <Star className="h-4 w-4 fill-brand-warning" />
                  {data.rating}
                  <span className="text-text-muted font-normal">
                    ({data.reviewsCount} avaliações)
                  </span>
                </div>
                <span>•</span>
                <span className="flex items-center gap-1 text-brand-accent font-medium">
                  <Clock className="h-4 w-4" /> {data.status}
                </span>
              </div>

              <p className="text-xs sm:text-sm text-text-secondary flex items-start gap-2 pt-2 border-t border-surface-border">
                <MapPin className="h-4 w-4 text-brand-primary shrink-0 mt-0.5" />
                {data.address}
              </p>

              <p className="text-sm text-text-secondary leading-relaxed pt-2">
                {data.description}
              </p>
            </div>

            {/* Tabela de Serviços */}
            <div className="space-y-4">
              <h2 className="font-heading text-xl font-bold text-text-primary flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-brand-primary" />
                Serviços & Preços
              </h2>

              <div className="space-y-3">
                {data.services.map((service) => (
                  <div
                    key={service.id}
                    className="bg-surface-card hover:bg-surface-cardHover border border-surface-border rounded-2xl p-5 transition-all shadow-md"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="space-y-1">
                        <h3 className="font-heading font-semibold text-base text-text-primary">
                          {service.name}
                        </h3>
                        <p className="text-xs text-text-secondary">
                          {service.description}
                        </p>
                        <span className="inline-flex items-center gap-1 text-[11px] text-text-muted mt-2">
                          <Clock className="h-3 w-3" /> Duração aprox.:{" "}
                          {service.duration}
                        </span>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="font-heading font-bold text-lg text-text-primary">
                          {service.priceFormatted}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Avaliações dos Clientes */}
            <div className="bg-surface-card border border-surface-border rounded-2xl p-6 shadow-xl space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="font-heading text-xl font-bold text-text-primary">
                  Avaliações ({data.reviewsCount})
                </h2>
                <div className="flex items-center gap-1.5 bg-brand-warning/10 text-brand-warning px-3 py-1 rounded-xl text-sm font-bold">
                  <Star className="h-4 w-4 fill-brand-warning" />
                  {data.rating} / 5.0
                </div>
              </div>

              {/* Form de Nova Avaliação */}
              <form
                onSubmit={handleReviewSubmit}
                className="border border-surface-border rounded-xl p-4 bg-surface-input space-y-3"
              >
                <h3 className="text-xs font-semibold text-text-primary uppercase tracking-wider">
                  Deixe sua avaliação
                </h3>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-text-secondary">Sua nota:</span>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setUserRating(star)}
                        className="p-1 text-text-muted hover:text-brand-warning transition-colors"
                      >
                        <Star
                          className={`h-4 w-4 ${
                            star <= userRating
                              ? "text-brand-warning fill-brand-warning"
                              : ""
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <textarea
                  rows={3}
                  value={userComment}
                  onChange={(e) => setUserComment(e.target.value)}
                  placeholder="Conte como foi sua experiência com este lava-jato..."
                  className="w-full bg-surface-card border border-surface-border rounded-xl p-3 text-xs text-text-primary placeholder:text-text-muted focus:outline-none focus:border-brand-primary"
                />

                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="bg-brand-primary hover:bg-brand-hover text-white text-xs font-semibold px-4 py-2 rounded-xl transition-all shadow-md shadow-brand-primary/20"
                  >
                    Publicar Avaliação
                  </button>
                </div>

                {reviewSubmitted && (
                  <p className="text-xs text-brand-accent flex items-center gap-1">
                    <CheckCircle2 className="h-3.5 w-3.5" /> Avaliação
                    registrada com sucesso!
                  </p>
                )}
              </form>

              {/* Lista de Reviews */}
              <div className="space-y-4 pt-2">
                {data.reviews.map((rev) => (
                  <div
                    key={rev.id}
                    className="border-b border-surface-border pb-4 last:border-0 last:pb-0 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-xs text-text-primary">
                        {rev.author}
                      </span>
                      <span className="text-[11px] text-text-muted">
                        {rev.date}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      {Array.from({ length: rev.rating }).map((_, i) => (
                        <Star
                          key={i}
                          className="h-3 w-3 text-brand-warning fill-brand-warning"
                        />
                      ))}
                    </div>
                    <p className="text-xs text-text-secondary leading-relaxed">
                      {rev.comment}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Coluna Lateral (CTA de Contato & Horários) */}
          <div className="lg:col-span-4 space-y-5 sticky top-24">
            {/* Box de Ação Rápida */}
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

                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
                    data.address,
                  )}`}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full bg-surface-input hover:bg-surface-border border border-surface-border text-text-primary font-medium py-3 rounded-xl text-sm transition-all flex items-center justify-center gap-2"
                >
                  <Navigation className="h-4 w-4 text-brand-primary" />
                  Como Chegar (GPS)
                </a>
              </div>

              <div className="pt-4 border-t border-surface-border text-xs text-text-secondary space-y-2">
                <div className="flex items-center gap-2">
                  <Phone className="h-3.5 w-3.5 text-text-muted" />
                  <span>{data.phone}</span>
                </div>
              </div>
            </div>

            {/* Horários de Funcionamento */}
            <div className="bg-surface-card border border-surface-border rounded-2xl p-6 shadow-xl space-y-3">
              <h3 className="font-heading font-semibold text-sm text-text-primary flex items-center gap-2">
                <Clock className="h-4 w-4 text-brand-primary" />
                Horários de Atendimento
              </h3>

              <div className="space-y-2 text-xs pt-1">
                {data.schedules.map((sc, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between text-text-secondary border-b border-surface-border/50 pb-1.5 last:border-0"
                  >
                    <span>{sc.day}</span>
                    <span className="font-medium text-text-primary">
                      {sc.hours}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* MODAL INTERATIVO DE AGENDAMENTO */}
      {isBookingOpen && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-surface-card border border-surface-border rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl space-y-5 p-6 relative">
            {/* Header Modal */}
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

            {/* 2. Seleção de Serviços */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider block">
                2. Selecione os Serviços
              </label>
              <div className="space-y-2">
                {data.services.map((s) => {
                  const isSelected = selectedServices.includes(s.id);
                  return (
                    <div
                      key={s.id}
                      onClick={() => toggleServiceSelection(s.id)}
                      className={`p-3 rounded-xl border text-xs cursor-pointer flex items-center justify-between transition-all ${
                        isSelected
                          ? "border-brand-accent bg-brand-accent/10 text-text-primary"
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
                        {s.priceFormatted}
                      </span>
                    </div>
                  );
                })}
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
                disabled={selectedServices.length === 0}
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
