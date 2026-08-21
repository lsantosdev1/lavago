"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Sparkles,
  Store,
  Eye,
  MessageCircle,
  Star,
  Plus,
  Clock,
  Settings,
  LogOut,
  CheckCircle2,
  Trash2,
  Edit2,
  ToggleLeft,
  ToggleRight,
  TrendingUp,
  Upload,
  Image as ImageIcon,
  X,
} from "lucide-react";

interface ServiceItem {
  id: string;
  name: string;
  description: string;
  price: string;
  duration: string;
  active: boolean;
}

const initialServices: ServiceItem[] = [
  {
    id: "1",
    name: "Lavagem Técnica Detalhada",
    description: "Chassis, caixas de roda, remoção de piche e cera protetora.",
    price: "R$ 90,00",
    duration: "1h 15min",
    active: true,
  },
  {
    id: "2",
    name: "Higienização Interna Completa",
    description: "Higienização a seco dos estofados e oxisanitização.",
    price: "R$ 220,00",
    duration: "2h 30min",
    active: true,
  },
  {
    id: "3",
    name: "Vitrificação de Pintura (Ceramic)",
    description: "Proteção contra micro-riscos e repelência com garantia.",
    price: "R$ 890,00",
    duration: "1 dia",
    active: false,
  },
];

export default function PartnerDashboardPage() {
  const [services, setServices] = useState<ServiceItem[]>(initialServices);
  const [isOpenNow, setIsOpenNow] = useState(true);
  const [activeTab, setActiveTab] = useState<
    "services" | "schedule" | "settings"
  >("services");

  // Estados e funções para gerenciamento de fotos
  const [photos, setPhotos] = useState<string[]>([
    "https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1601362840469-51e4d8d58785?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1607860108855-64acf2078ed9?auto=format&fit=crop&w=600&q=80",
  ]);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      const imageUrl = URL.createObjectURL(files[0]);
      setPhotos((prev) => [...prev, imageUrl]);
    }
  };

  const handleRemovePhoto = (indexToRemove: number) => {
    setPhotos((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  // Modal para novo serviço
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newPrice, setNewPrice] = useState("");
  const [newDuration, setNewDuration] = useState("");

  const handleToggleService = (id: string) => {
    setServices((prev) =>
      prev.map((s) => (s.id === id ? { ...s, active: !s.active } : s)),
    );
  };

  const handleDeleteService = (id: string) => {
    setServices((prev) => prev.filter((s) => s.id !== id));
  };

  const handleAddService = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newPrice) return;

    const newService: ServiceItem = {
      id: Date.now().toString(),
      name: newName,
      description: newDesc || "Serviço sob consulta",
      price: newPrice,
      duration: newDuration || "1 hora",
      active: true,
    };

    setServices((prev) => [...prev, newService]);
    setNewName("");
    setNewDesc("");
    setNewPrice("");
    setNewDuration("");
    setIsModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-surface-background text-text-primary flex flex-col">
      {/* Top Navbar */}
      <header className="border-b border-surface-border bg-surface-card/60 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2">
              <div className="h-9 w-9 rounded-xl bg-brand-primary flex items-center justify-center shadow-lg shadow-brand-primary/30">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <span className="font-heading font-bold text-xl tracking-tight hidden sm:inline">
                Lava<span className="text-brand-primary">Go</span>
              </span>
            </Link>
            <span className="text-xs bg-brand-primary/10 text-brand-primary font-semibold px-2 py-0.5 rounded-md border border-brand-primary/20">
              Painel do Parceiro
            </span>
          </div>

          {/* Status Aberto / Fechado Switch */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsOpenNow(!isOpenNow)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all ${
                isOpenNow
                  ? "bg-emerald-500/10 border-emerald-500/30 text-brand-accent"
                  : "bg-rose-500/10 border-rose-500/30 text-rose-400"
              }`}
            >
              <div
                className={`h-2 w-2 rounded-full ${isOpenNow ? "bg-emerald-400 animate-pulse" : "bg-rose-400"}`}
              />
              {isOpenNow ? "Aberto Agora" : "Fechado"}
            </button>

            <Link
              href="/login"
              className="p-2 rounded-xl border border-surface-border text-text-secondary hover:text-rose-400 hover:border-rose-400/30 transition-colors"
              title="Sair da Conta"
            >
              <LogOut className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 space-y-8">
        {/* Identificação do Estabelecimento & Métricas */}
        <div className="space-y-6">
          <div>
            <h1 className="font-heading text-2xl sm:text-3xl font-bold tracking-tight text-text-primary">
              Auto Spa Detailing Prime
            </h1>
            <p className="text-xs sm:text-sm text-text-secondary mt-1">
              Gerencie seus serviços, visibilidade e contatos em tempo real.
            </p>
          </div>

          {/* Grid de Métricas Rápidas */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-surface-card border border-surface-border rounded-2xl p-5 shadow-lg space-y-2">
              <div className="flex items-center justify-between text-text-secondary">
                <span className="text-xs font-medium">
                  Visualizações do Perfil
                </span>
                <Eye className="h-4 w-4 text-brand-primary" />
              </div>
              <div className="flex items-baseline gap-2">
                <span className="font-heading text-2xl font-bold text-text-primary">
                  1.480
                </span>
                <span className="text-[11px] text-brand-accent flex items-center gap-0.5">
                  <TrendingUp className="h-3 w-3" /> +14%
                </span>
              </div>
            </div>

            <div className="bg-surface-card border border-surface-border rounded-2xl p-5 shadow-lg space-y-2">
              <div className="flex items-center justify-between text-text-secondary">
                <span className="text-xs font-medium">Cliques no WhatsApp</span>
                <MessageCircle className="h-4 w-4 text-brand-accent" />
              </div>
              <div className="flex items-baseline gap-2">
                <span className="font-heading text-2xl font-bold text-text-primary">
                  234
                </span>
                <span className="text-[11px] text-brand-accent flex items-center gap-0.5">
                  <TrendingUp className="h-3 w-3" /> +8%
                </span>
              </div>
            </div>

            <div className="bg-surface-card border border-surface-border rounded-2xl p-5 shadow-lg space-y-2">
              <div className="flex items-center justify-between text-text-secondary">
                <span className="text-xs font-medium">Avaliação Média</span>
                <Star className="h-4 w-4 text-brand-warning fill-brand-warning" />
              </div>
              <div className="flex items-baseline gap-2">
                <span className="font-heading text-2xl font-bold text-text-primary">
                  4.9
                </span>
                <span className="text-[11px] text-text-muted">
                  (128 avaliações)
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Abas de Navegação */}
        <div className="border-b border-surface-border flex items-center gap-6 text-sm font-medium">
          <button
            onClick={() => setActiveTab("services")}
            className={`pb-3 transition-colors border-b-2 flex items-center gap-2 ${
              activeTab === "services"
                ? "border-brand-primary text-text-primary"
                : "border-transparent text-text-secondary hover:text-text-primary"
            }`}
          >
            <Store className="h-4 w-4" /> Serviços ({services.length})
          </button>
          <button
            onClick={() => setActiveTab("schedule")}
            className={`pb-3 transition-colors border-b-2 flex items-center gap-2 ${
              activeTab === "schedule"
                ? "border-brand-primary text-text-primary"
                : "border-transparent text-text-secondary hover:text-text-primary"
            }`}
          >
            <Clock className="h-4 w-4" /> Horários
          </button>
          <button
            onClick={() => setActiveTab("settings")}
            className={`pb-3 transition-colors border-b-2 flex items-center gap-2 ${
              activeTab === "settings"
                ? "border-brand-primary text-text-primary"
                : "border-transparent text-text-secondary hover:text-text-primary"
            }`}
          >
            <Settings className="h-4 w-4" /> Perfil & Fotos
          </button>
        </div>

        {/* Conteúdo da Aba: Serviços */}
        {activeTab === "services" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-heading text-lg font-semibold text-text-primary">
                Tabela de Serviços
              </h2>
              <button
                onClick={() => setIsModalOpen(true)}
                className="bg-brand-primary hover:bg-brand-hover text-white text-xs font-semibold px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 shadow-md shadow-brand-primary/20"
              >
                <Plus className="h-4 w-4" /> Adicionar Serviço
              </button>
            </div>

            <div className="grid grid-cols-1 gap-3">
              {services.map((item) => (
                <div
                  key={item.id}
                  className={`bg-surface-card border rounded-2xl p-4 sm:p-5 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
                    item.active
                      ? "border-surface-border"
                      : "border-surface-border/40 opacity-60"
                  }`}
                >
                  <div className="space-y-1 max-w-xl">
                    <div className="flex items-center gap-2">
                      <h3 className="font-heading font-semibold text-base text-text-primary">
                        {item.name}
                      </h3>
                      {!item.active && (
                        <span className="text-[10px] bg-surface-input border border-surface-border text-text-muted px-2 py-0.5 rounded-md">
                          Pausado
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-text-secondary">
                      {item.description}
                    </p>
                    <span className="inline-flex items-center gap-1 text-[11px] text-text-muted">
                      <Clock className="h-3 w-3" /> {item.duration}
                    </span>
                  </div>

                  <div className="flex items-center justify-between w-full sm:w-auto gap-4 pt-3 sm:pt-0 border-t sm:border-t-0 border-surface-border">
                    <span className="font-heading font-bold text-lg text-text-primary">
                      {item.price}
                    </span>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleToggleService(item.id)}
                        className="p-2 rounded-xl border border-surface-border text-text-secondary hover:text-text-primary"
                        title={
                          item.active ? "Pausar Serviço" : "Ativar Serviço"
                        }
                      >
                        {item.active ? (
                          <ToggleRight className="h-5 w-5 text-brand-accent" />
                        ) : (
                          <ToggleLeft className="h-5 w-5 text-text-muted" />
                        )}
                      </button>
                      <button
                        onClick={() => handleDeleteService(item.id)}
                        className="p-2 rounded-xl border border-surface-border text-text-secondary hover:text-rose-400 hover:border-rose-400/30 transition-colors"
                        title="Excluir Serviço"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Conteúdo da Aba: Horários */}
        {activeTab === "schedule" && (
          <div className="bg-surface-card border border-surface-border rounded-2xl p-6 shadow-xl max-w-2xl space-y-4">
            <h2 className="font-heading text-lg font-semibold text-text-primary">
              Horários de Atendimento Semanal
            </h2>
            <div className="space-y-3 text-xs">
              {[
                { day: "Segunda-feira", hours: "08:00 - 18:30" },
                { day: "Terça-feira", hours: "08:00 - 18:30" },
                { day: "Quarta-feira", hours: "08:00 - 18:30" },
                { day: "Quinta-feira", hours: "08:00 - 18:30" },
                { day: "Sexta-feira", hours: "08:00 - 18:30" },
                { day: "Sábado", hours: "08:00 - 16:00" },
                { day: "Domingo", hours: "Fechado" },
              ].map((s, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3 rounded-xl bg-surface-input border border-surface-border"
                >
                  <span className="font-medium text-text-primary">{s.day}</span>
                  <input
                    type="text"
                    defaultValue={s.hours}
                    className="bg-surface-card border border-surface-border rounded-lg px-2.5 py-1 text-text-secondary focus:outline-none focus:border-brand-primary text-right w-36"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Conteúdo da Aba: Configurações & Fotos */}
        {activeTab === "settings" && (
          <div className="space-y-6 max-w-3xl">
            {/* Galeria de Fotos do Lava-Jato */}
            <div className="bg-surface-card border border-surface-border rounded-2xl p-6 shadow-xl space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-heading text-lg font-semibold text-text-primary flex items-center gap-2">
                    <ImageIcon className="h-5 w-5 text-brand-primary" />
                    Fotos do Estabelecimento
                  </h2>
                  <p className="text-xs text-text-secondary mt-0.5">
                    A primeira foto será exibida como destaque principal nos
                    resultados de busca.
                  </p>
                </div>
                <span className="text-xs text-text-muted">
                  {photos.length}/6 fotos
                </span>
              </div>

              {/* Grid de Imagens */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                {photos.map((url, index) => (
                  <div
                    key={index}
                    className="relative group aspect-video sm:aspect-square rounded-xl overflow-hidden border border-surface-border bg-surface-input"
                  >
                    <img
                      src={url}
                      alt={`Foto ${index + 1}`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />

                    {/* Badge de Foto Principal */}
                    {index === 0 && (
                      <span className="absolute top-2 left-2 bg-brand-primary text-white text-[10px] font-bold px-2 py-0.5 rounded-md shadow-md">
                        Principal
                      </span>
                    )}

                    {/* Botão de Remover */}
                    <button
                      type="button"
                      onClick={() => handleRemovePhoto(index)}
                      className="absolute top-2 right-2 bg-surface-background/80 hover:bg-rose-500 text-text-primary hover:text-white p-1 rounded-lg backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all"
                      title="Excluir foto"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}

                {/* Card de Upload / Adicionar Nova Foto */}
                {photos.length < 6 && (
                  <label className="border-2 border-dashed border-surface-border hover:border-brand-primary rounded-xl flex flex-col items-center justify-center p-4 text-center cursor-pointer transition-colors aspect-video sm:aspect-square bg-surface-input/50 hover:bg-surface-input group">
                    <Upload className="h-6 w-6 text-text-muted group-hover:text-brand-primary transition-colors mb-1.5" />
                    <span className="text-xs font-semibold text-text-primary">
                      Adicionar
                    </span>
                    <span className="text-[10px] text-text-muted">
                      JPG ou PNG
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
            </div>

            {/* Dados do Estabelecimento */}
            <div className="bg-surface-card border border-surface-border rounded-2xl p-6 shadow-xl space-y-4">
              <h2 className="font-heading text-lg font-semibold text-text-primary">
                Dados Gerais
              </h2>
              <div className="space-y-3.5 text-xs">
                <div>
                  <label className="text-text-secondary font-medium block mb-1">
                    Nome Fantasia
                  </label>
                  <input
                    type="text"
                    defaultValue="Auto Spa Detailing Prime"
                    className="w-full bg-surface-input border border-surface-border rounded-xl px-3.5 py-2.5 text-text-primary focus:outline-none focus:border-brand-primary"
                  />
                </div>
                <div>
                  <label className="text-text-secondary font-medium block mb-1">
                    Endereço Completo
                  </label>
                  <input
                    type="text"
                    defaultValue="Av. das Américas, 4200 - Barra da Tijuca, Rio de Janeiro - RJ"
                    className="w-full bg-surface-input border border-surface-border rounded-xl px-3.5 py-2.5 text-text-primary focus:outline-none focus:border-brand-primary"
                  />
                </div>
                <div>
                  <label className="text-text-secondary font-medium block mb-1">
                    WhatsApp de Atendimento
                  </label>
                  <input
                    type="text"
                    defaultValue="(21) 98765-4321"
                    className="w-full bg-surface-input border border-surface-border rounded-xl px-3.5 py-2.5 text-text-primary focus:outline-none focus:border-brand-primary"
                  />
                </div>
                <div>
                  <label className="text-text-secondary font-medium block mb-1">
                    Descrição do Negócio
                  </label>
                  <textarea
                    rows={3}
                    defaultValue="Centro especializado em estética automotiva de alto padrão. Trabalhamos com produtos importados e técnicas que preservam a integridade da pintura e o acabamento do seu veículo."
                    className="w-full bg-surface-input border border-surface-border rounded-xl p-3 text-text-primary focus:outline-none focus:border-brand-primary resize-none"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-3 border-t border-surface-border">
                <button
                  type="button"
                  className="bg-brand-primary hover:bg-brand-hover text-white text-xs font-semibold px-5 py-2.5 rounded-xl transition-all shadow-md shadow-brand-primary/20"
                >
                  Salvar Alterações
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Modal: Adicionar Novo Serviço */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-surface-card border border-surface-border rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <h3 className="font-heading font-bold text-lg text-text-primary">
              Novo Serviço
            </h3>

            <form onSubmit={handleAddService} className="space-y-3 text-xs">
              <div>
                <label className="text-text-secondary block mb-1">
                  Nome do Serviço
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Polimento de Faróis"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full bg-surface-input border border-surface-border rounded-xl px-3 py-2 text-text-primary focus:outline-none focus:border-brand-primary"
                />
              </div>

              <div>
                <label className="text-text-secondary block mb-1">
                  Descrição Breve
                </label>
                <input
                  type="text"
                  placeholder="Ex: Restauração de transparência e aplicação de verniz UV"
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  className="w-full bg-surface-input border border-surface-border rounded-xl px-3 py-2 text-text-primary focus:outline-none focus:border-brand-primary"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-text-secondary block mb-1">
                    Preço (R$)
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: R$ 120,00"
                    value={newPrice}
                    onChange={(e) => setNewPrice(e.target.value)}
                    className="w-full bg-surface-input border border-surface-border rounded-xl px-3 py-2 text-text-primary focus:outline-none focus:border-brand-primary"
                  />
                </div>
                <div>
                  <label className="text-text-secondary block mb-1">
                    Duração Aprox.
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: 45 min"
                    value={newDuration}
                    onChange={(e) => setNewDuration(e.target.value)}
                    className="w-full bg-surface-input border border-surface-border rounded-xl px-3 py-2 text-text-primary focus:outline-none focus:border-brand-primary"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-surface-border">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-text-secondary hover:text-text-primary border border-surface-border"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="bg-brand-primary hover:bg-brand-hover text-white font-semibold px-4 py-2 rounded-xl shadow-md shadow-brand-primary/20"
                >
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
