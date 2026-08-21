"use client";
import { useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import {
  Search,
  MapPin,
  Star,
  ShieldCheck,
  Sparkles,
  Clock,
  ListFilter,
  Map as MapIcon,
} from "lucide-react";

const Map = dynamic(() => import("@/components/Map"), { ssr: false });

const mockWashes = [
  {
    id: "1",
    name: "Auto Spa Detailing Prime",
    tag: "Estética Premium",
    rating: 4.9,
    reviewsCount: 128,
    distance: "1.2 km",
    address: "Av. das Américas, 4200 - Barra",
    status: "Aberto agora",
    price: "$$$",
    latitude: -23.0003,
    longitude: -43.3659,
  },
  {
    id: "2",
    name: "Studio Car Care Express",
    tag: "Lavagem & Cera",
    rating: 4.8,
    reviewsCount: 94,
    distance: "2.5 km",
    address: "Rua Voluntários da Pátria, 150 - Botafogo",
    status: "Aberto agora",
    price: "$$",
    latitude: -22.9519,
    longitude: -43.1843,
  },
  {
    id: "3",
    name: "Elite Wash & Ceramic Coating",
    tag: "Vitrificação Técnica",
    rating: 5.0,
    reviewsCount: 62,
    distance: "3.8 km",
    address: "Rua General Polidoro, 74 - Botafogo",
    status: "Aberto agora",
    price: "$$$$",
    latitude: -22.9554,
    longitude: -43.1895,
  },
];

export default function HomePage() {
  const [selectedWashId, setSelectedWashId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"both" | "list" | "map">("both");

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b border-surface-border bg-surface-card/60 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-xl bg-brand-primary flex items-center justify-center shadow-lg shadow-brand-primary/30">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <span className="font-heading font-bold text-xl tracking-tight">
              Lava<span className="text-brand-primary">Go</span>
            </span>
          </div>

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
            <div className="relative w-full md:max-w-xl">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
              <input
                type="text"
                placeholder="Buscar por bairro, nome ou serviço..."
                className="w-full bg-surface-card border border-surface-border rounded-xl pl-10 pr-4 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-brand-primary transition-colors shadow-sm"
              />
            </div>

            {/* Mobile View Switcher */}
            <div className="flex md:hidden w-full bg-surface-card border border-surface-border p-1 rounded-xl text-xs font-semibold">
              <button
                onClick={() => setActiveTab("list")}
                className={`flex-1 py-1.5 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                  activeTab === "list"
                    ? "bg-brand-primary text-white"
                    : "text-text-secondary"
                }`}
              >
                <ListFilter className="h-3.5 w-3.5" /> Lista
              </button>
              <button
                onClick={() => setActiveTab("map")}
                className={`flex-1 py-1.5 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                  activeTab === "map"
                    ? "bg-brand-primary text-white"
                    : "text-text-secondary"
                }`}
              >
                <MapIcon className="h-3.5 w-3.5" /> Mapa
              </button>
            </div>
          </div>

          {/* Badges */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
            {[
              "Todos",
              "Estética Premium",
              "Lavagem Simples",
              "Higienização",
              "Vitrificação",
              "Aberto Agora",
            ].map((filter, index) => (
              <button
                key={filter}
                className={`px-3.5 py-1.5 rounded-xl whitespace-nowrap border transition-all ${
                  index === 0
                    ? "bg-brand-primary text-white border-brand-primary shadow-sm shadow-brand-primary/20"
                    : "bg-surface-card text-text-secondary border-surface-border hover:text-text-primary hover:border-text-muted/40"
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        {/* Split Grid: Cards + Map */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 items-start min-h-[560px]">
          {/* List Column */}
          <div
            className={`lg:col-span-6 space-y-3.5 overflow-y-auto max-h-[calc(100vh-250px)] pr-1 ${
              activeTab === "map" ? "hidden md:block" : "block"
            }`}
          >
            <div className="text-xs text-text-muted font-medium mb-1">
              Exibindo{" "}
              <span className="text-text-primary font-semibold">
                {mockWashes.length}
              </span>{" "}
              locais encontrados
            </div>

            {mockWashes.map((item) => {
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
                    >
                      Ver detalhes &rarr;
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Map Column */}
          <div
            className={`lg:col-span-6 h-[500px] lg:h-[calc(100vh-250px)] sticky top-24 ${
              activeTab === "list" ? "hidden md:block" : "block"
            }`}
          >
            <Map
              items={mockWashes}
              selectedId={selectedWashId}
              onSelect={(id) => setSelectedWashId(id)}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
