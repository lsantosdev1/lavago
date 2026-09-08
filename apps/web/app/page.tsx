"use client";

import { useState, useEffect, useMemo } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import {
  Search,
  MapPin,
  Star,
  Sparkles,
  Clock,
  ListFilter,
  Map as MapIcon,
  X,
  Loader2,
} from "lucide-react";
import { getCarWashes } from "@/lib/api";

// Carregamento dinâmico do Mapa para evitar SSR (Window is not defined no Leaflet)
const Map = dynamic(() => import("../components/Map"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-surface-card border border-surface-border rounded-2xl animate-pulse flex items-center justify-center text-text-muted text-xs">
      Carregando mapa interativo...
    </div>
  ),
});

interface ApiCarWash {
  id: string;
  name: string;
  tag: string;
  description?: string;
  address: string;
  latitude: number;
  longitude: number;
  whatsapp: string;
  isOpen: boolean;
  reviews?: { rating: number }[];
}

const categoryFilters = [
  "Todos",
  "Estética Premium",
  "Lavagem & Cera",
  "Higienização",
  "Vitrificação Técnica",
  "Aberto Agora",
];

export default function HomePage() {
  const [carWashes, setCarWashes] = useState<ApiCarWash[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedWashId, setSelectedWashId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const [activeTab, setActiveTab] = useState<"list" | "map">("list");

  // Fetch inicial e reativo da API quando os filtros mudam
  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const data = await getCarWashes(searchQuery, selectedCategory);
        setCarWashes(data);
      } catch (error) {
        console.error("Erro ao carregar lava-jatos da API:", error);
      } finally {
        setLoading(false);
      }
    }

    // Debounce de 300ms na pesquisa por texto para evitar excesso de requisições
    const timer = setTimeout(() => {
      loadData();
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery, selectedCategory]);

  // Mapeia os itens vindos da API para o formato esperado pelo layout e pelo Mapa
  const formattedWashes = useMemo(() => {
    return carWashes.map((wash) => {
      const totalReviews = wash.reviews?.length || 0;
      const avgRating =
        totalReviews > 0
          ? (
              wash.reviews!.reduce((acc, r) => acc + r.rating, 0) / totalReviews
            ).toFixed(1)
          : "5.0";

      return {
        id: wash.id,
        name: wash.name,
        tag: wash.tag || "Estética",
        rating: Number(avgRating),
        reviewsCount: totalReviews,
        distance: "2.0 km",
        address: wash.address,
        status: wash.isOpen ? "Aberto agora" : "Fechado",
        price: "$$",
        lat: wash.latitude,
        lng: wash.longitude,
      };
    });
  }, [carWashes]);

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategory("Todos");
  };

  return (
    <div className="min-h-screen bg-surface-background text-text-primary flex flex-col">
      {/* Header */}
      <header className="border-b border-surface-border bg-surface-card/60 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-xl bg-brand-primary flex items-center justify-center shadow-lg shadow-brand-primary/30">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <span className="font-heading font-bold text-xl tracking-tight text-text-primary">
              Lava<span className="text-brand-primary">Go</span>
            </span>
          </Link>

          <div className="flex items-center gap-3">
            <Link
              href="/register"
              className="text-sm font-medium text-text-secondary hover:text-text-primary px-3 py-2 transition-colors"
            >
              Sou Parceiro
            </Link>
            <Link
              href="/login"
              className="text-sm font-semibold bg-brand-primary hover:bg-brand-hover text-white px-4 py-2 rounded-xl transition-all shadow-md shadow-brand-primary/20"
            >
              Entrar
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col">
        {/* Search & Filters */}
        <div className="mb-6 space-y-4">
          <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
            {/* Input de Pesquisa por Nome/Bairro/Serviço */}
            <div className="relative w-full md:max-w-xl">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar por bairro, nome do lava-jato ou serviço..."
                className="w-full bg-surface-card border border-surface-border rounded-xl pl-10 pr-10 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-brand-primary transition-colors shadow-sm"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-text-muted hover:text-text-primary transition-colors"
                  title="Limpar busca"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            {/* Mobile View Switcher */}
            <div className="flex md:hidden w-full bg-surface-card border border-surface-border p-1 rounded-xl text-xs font-semibold">
              <button
                type="button"
                onClick={() => setActiveTab("list")}
                className={`flex-1 py-1.5 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                  activeTab === "list"
                    ? "bg-brand-primary text-white shadow-sm"
                    : "text-text-secondary"
                }`}
              >
                <ListFilter className="h-3.5 w-3.5" /> Lista (
                {formattedWashes.length})
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("map")}
                className={`flex-1 py-1.5 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                  activeTab === "map"
                    ? "bg-brand-primary text-white shadow-sm"
                    : "text-text-secondary"
                }`}
              >
                <MapIcon className="h-3.5 w-3.5" /> Mapa
              </button>
            </div>
          </div>

          {/* Categorias & Badges Clicáveis */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs scrollbar-none">
            {categoryFilters.map((filter) => {
              const isSelected = selectedCategory === filter;
              return (
                <button
                  key={filter}
                  type="button"
                  onClick={() => setSelectedCategory(filter)}
                  className={`px-3.5 py-1.5 rounded-xl whitespace-nowrap border transition-all ${
                    isSelected
                      ? "bg-brand-primary text-white border-brand-primary shadow-sm shadow-brand-primary/20 font-semibold"
                      : "bg-surface-card text-text-secondary border-surface-border hover:text-text-primary hover:border-text-muted/40"
                  }`}
                >
                  {filter}
                </button>
              );
            })}
          </div>
        </div>

        {/* Split Grid: Cards + Map */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 flex-1 items-start min-h-[560px]">
          {/* List Column */}
          <div
            className={`md:col-span-6 space-y-3.5 overflow-y-auto max-h-[calc(100vh-250px)] pr-1 ${
              activeTab === "map" ? "hidden md:block" : "block"
            }`}
          >
            <div className="flex items-center justify-between text-xs text-text-muted font-medium mb-1">
              <span className="flex items-center gap-2">
                Exibindo{" "}
                <strong className="text-text-primary font-semibold">
                  {formattedWashes.length}
                </strong>{" "}
                locais encontrados
                {loading && (
                  <Loader2 className="h-3 w-3 animate-spin text-brand-primary" />
                )}
              </span>
              {(searchQuery || selectedCategory !== "Todos") && (
                <button
                  onClick={clearFilters}
                  className="text-brand-primary hover:underline font-semibold"
                >
                  Limpar filtros
                </button>
              )}
            </div>

            {/* Skeleton Loading State */}
            {loading && formattedWashes.length === 0 ? (
              <div className="space-y-3">
                {[1, 2, 3].map((n) => (
                  <div
                    key={n}
                    className="bg-surface-card border border-surface-border rounded-2xl p-4 animate-pulse h-36"
                  />
                ))}
              </div>
            ) : formattedWashes.length === 0 ? (
              /* Empty State */
              <div className="bg-surface-card border border-surface-border rounded-2xl p-8 text-center space-y-3">
                <Search className="h-8 w-8 text-text-muted mx-auto" />
                <h3 className="font-heading font-semibold text-text-primary text-base">
                  Nenhum lava-jato encontrado
                </h3>
                <p className="text-xs text-text-secondary">
                  Tente buscar por outro termo ou selecione uma categoria
                  diferente.
                </p>
                <button
                  onClick={clearFilters}
                  className="text-xs font-semibold bg-brand-primary text-white px-4 py-2 rounded-xl shadow-md shadow-brand-primary/20"
                >
                  Ver todos os locais
                </button>
              </div>
            ) : (
              formattedWashes.map((item) => {
                const isSelected = selectedWashId === item.id;
                return (
                  <div
                    key={item.id}
                    onClick={() => setSelectedWashId(item.id)}
                    className={`bg-surface-card hover:bg-surface-cardHover border rounded-2xl p-4 transition-all cursor-pointer shadow-lg ${
                      isSelected
                        ? "border-brand-primary ring-1 ring-brand-primary bg-surface-cardHover"
                        : "border-surface-border hover:border-surface-borderActive/40"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <span className="inline-block px-2 py-0.5 rounded-md bg-brand-primary/10 text-brand-primary text-[11px] font-semibold mb-1.5">
                          {item.tag}
                        </span>
                        <h3 className="font-heading font-semibold text-base text-text-primary">
                          {item.name}
                        </h3>
                        <p className="text-text-secondary text-xs flex items-center gap-1 mt-1">
                          <MapPin className="h-3.5 w-3.5 text-text-muted shrink-0" />
                          {item.address}
                        </p>
                      </div>

                      <div className="flex flex-col items-end shrink-0">
                        <div className="flex items-center gap-1 bg-brand-warning/10 text-brand-warning px-2 py-0.5 rounded-lg text-xs font-bold">
                          <Star className="h-3 w-3 fill-brand-warning" />
                          {item.rating}
                        </div>
                        <span className="text-[10px] text-text-muted mt-1">
                          ({item.reviewsCount})
                        </span>
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-surface-border flex items-center justify-between text-xs">
                      <div className="flex items-center gap-3 text-text-secondary">
                        <span className="flex items-center gap-1 text-brand-accent font-medium text-[11px]">
                          <Clock className="h-3 w-3" />
                          {item.status}
                        </span>
                        <span>•</span>
                        <span className="font-semibold text-text-primary">
                          {item.distance}
                        </span>
                        <span>•</span>
                        <span className="text-text-muted">{item.price}</span>
                      </div>

                      <Link
                        href={`/car-wash/${item.id}`}
                        className="text-brand-primary font-semibold text-xs hover:underline"
                        onClick={(e) => e.stopPropagation()}
                      >
                        Ver detalhes &rarr;
                      </Link>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Map Column */}
          <div
            className={`md:col-span-6 h-[500px] md:h-[calc(100vh-250px)] sticky top-24 rounded-2xl overflow-hidden border border-surface-border ${
              activeTab === "list" ? "hidden md:block" : "block"
            }`}
          >
            <Map
              items={formattedWashes.map((item) => ({
                ...item,
                latitude: item.lat,
                longitude: item.lng,
              }))}
              selectedId={selectedWashId}
              onSelect={(id: string) => setSelectedWashId(id)}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
