"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

interface CarWashMapItem {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  rating: number;
  reviewsCount: number;
  address: string;
  price: string;
}

interface MapProps {
  items: CarWashMapItem[];
  selectedId?: string | null;
  onSelect?: (id: string) => void;
}

export default function Map({ items, selectedId, onSelect }: MapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<{ [key: string]: L.Marker }>({});

  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Se o mapa já foi instanciado, não recria
    if (!mapInstanceRef.current) {
      const defaultCenter: [number, number] =
        items.length > 0
          ? [items[0].latitude, items[0].longitude]
          : [-22.9068, -43.1729];

      const map = L.map(mapContainerRef.current, {
        center: defaultCenter,
        zoom: 13,
        zoomControl: true,
      });

      // Camada Dark Matter do CARTO
      L.tileLayer(
        "https://{s}.basemaps.cartocdn.com/rastertiles/dark_all/{z}/{x}/{y}{r}.png",
        {
          attribution: "&copy; CARTO",
          maxZoom: 19,
        },
      ).addTo(map);

      mapInstanceRef.current = map;
    }

    const map = mapInstanceRef.current;

    // Limpar marcadores anteriores
    Object.values(markersRef.current).forEach((m) => m.remove());
    markersRef.current = {};

    // Adicionar marcadores customizados
    items.forEach((item) => {
      const isSelected = selectedId === item.id;

      const pinElement = document.createElement("div");
      pinElement.className = `h-9 w-9 rounded-full border-2 flex items-center justify-center text-white shadow-xl transition-all cursor-pointer ${
        isSelected
          ? "bg-blue-500 border-white scale-125 z-50 ring-4 ring-blue-500/30"
          : "bg-blue-600 border-slate-900 hover:scale-110"
      }`;
      pinElement.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.5 2.8C2.1 11 2 11.5 2 12v4c0 .6.4 1 1 1h2"/>
          <circle cx="7" cy="17" r="2"/>
          <path d="M9 17h6"/>
          <circle cx="17" cy="17" r="2"/>
        </svg>
      `;

      const customIcon = L.divIcon({
        html: pinElement,
        className: "custom-leaflet-pin-wrapper",
        iconSize: [36, 36],
        iconAnchor: [18, 18],
      });

      const marker = L.marker([item.latitude, item.longitude], {
        icon: customIcon,
      }).addTo(map);

      // Popup customizado
      const popupHtml = `
        <div class="p-3 bg-[#131B2E] text-[#F8FAFC] rounded-xl border border-[#1E293B] shadow-2xl min-w-[200px]">
          <div class="flex items-center justify-between gap-2 mb-1">
            <h4 class="font-bold text-sm text-[#F8FAFC]">${item.name}</h4>
            <span class="text-xs text-[#94A3B8]">${item.price}</span>
          </div>
          <p class="text-xs text-[#94A3B8] mb-2">${item.address}</p>
          <div class="flex items-center justify-between pt-2 border-t border-[#1E293B] text-xs">
            <span class="text-[#F59E0B] font-bold">★ ${item.rating} (${item.reviewsCount})</span>
            <span class="text-[#2563EB] font-semibold">Selecionado</span>
          </div>
        </div>
      `;

      marker.bindPopup(popupHtml, { className: "custom-leaflet-popup" });

      marker.on("click", () => {
        onSelect?.(item.id);
      });

      markersRef.current[item.id] = marker;
    });

    // Se houver um item selecionado, centraliza suavemente nele
    if (selectedId && markersRef.current[selectedId]) {
      const selectedItem = items.find((i) => i.id === selectedId);
      if (selectedItem) {
        map.flyTo([selectedItem.latitude, selectedItem.longitude], 14, {
          duration: 0.8,
        });
        markersRef.current[selectedId].openPopup();
      }
    }
  }, [items, selectedId, onSelect]);

  return (
    <div className="w-full h-full min-h-[450px] rounded-2xl overflow-hidden border border-surface-border relative shadow-2xl bg-surface-card">
      <div ref={mapContainerRef} className="w-full h-full z-10" />
    </div>
  );
}
