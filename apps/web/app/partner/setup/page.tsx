"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Sparkles,
  Building2,
  MapPin,
  Phone,
  Tag,
  AlignLeft,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { createCarWash } from "@/lib/api";

export default function PartnerSetupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [tag, setTag] = useState("Estética Premium");
  const [address, setAddress] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const token = localStorage.getItem("@lavago:token");
    if (!token) {
      setError("Sessão expirada. Faça login novamente.");
      setLoading(false);
      return;
    }

    try {
      await createCarWash(
        {
          name,
          tag,
          address,
          whatsapp,
          description,
          latitude: -22.7562, // Coordenadas padrão (podem ser ajustadas via geocoding no futuro)
          longitude: -43.4607,
        },
        token,
      );

      router.push("/partner/dashboard");
    } catch (err: any) {
      setError(err.message || "Erro ao cadastrar estabelecimento.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface-background text-text-primary flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-lg text-center space-y-3">
        <Link href="/" className="inline-flex items-center gap-2">
          <div className="h-10 w-10 rounded-xl bg-brand-primary flex items-center justify-center shadow-lg shadow-brand-primary/30">
            <Sparkles className="h-6 w-6 text-white" />
          </div>
          <span className="font-heading font-bold text-2xl tracking-tight text-text-primary">
            Lava<span className="text-brand-primary">Go</span>
          </span>
        </Link>
        <h2 className="font-heading text-xl font-bold tracking-tight text-text-primary">
          Cadastre seu Lava-Jato
        </h2>
        <p className="text-xs text-text-secondary">
          Preencha os dados do seu estabelecimento para começar a receber
          agendamentos.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-lg px-4">
        <div className="bg-surface-card border border-surface-border rounded-2xl p-6 shadow-xl space-y-5">
          {error && (
            <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-500 text-xs flex items-center gap-2">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-text-secondary mb-1">
                Nome do Estabelecimento *
              </label>
              <div className="relative">
                <Building2 className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ex: Auto Spa Detailing Prime"
                  className="w-full bg-surface-input border border-surface-border rounded-xl pl-10 pr-4 py-2.5 text-xs text-text-primary placeholder:text-text-muted focus:outline-none focus:border-brand-primary"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-text-secondary mb-1">
                Categoria / Tag Principal *
              </label>
              <div className="relative">
                <Tag className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
                <select
                  value={tag}
                  onChange={(e) => setTag(e.target.value)}
                  className="w-full bg-surface-input border border-surface-border rounded-xl pl-10 pr-4 py-2.5 text-xs text-text-primary focus:outline-none focus:border-brand-primary"
                >
                  <option value="Estética Premium">Estética Premium</option>
                  <option value="Lavagem & Cera">Lavagem & Cera</option>
                  <option value="Higienização">Higienização</option>
                  <option value="Vitrificação Técnica">
                    Vitrificação Técnica
                  </option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-text-secondary mb-1">
                Endereço Completo *
              </label>
              <div className="relative">
                <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
                <input
                  type="text"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Ex: Av. Governador Amaral Peixoto, 100 - Nova Iguaçu, RJ"
                  className="w-full bg-surface-input border border-surface-border rounded-xl pl-10 pr-4 py-2.5 text-xs text-text-primary placeholder:text-text-muted focus:outline-none focus:border-brand-primary"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-text-secondary mb-1">
                WhatsApp de Atendimento *
              </label>
              <div className="relative">
                <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
                <input
                  type="tel"
                  required
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  placeholder="Ex: 5521999999999"
                  className="w-full bg-surface-input border border-surface-border rounded-xl pl-10 pr-4 py-2.5 text-xs text-text-primary placeholder:text-text-muted focus:outline-none focus:border-brand-primary"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-text-secondary mb-1">
                Descrição do Estabelecimento
              </label>
              <div className="relative">
                <AlignLeft className="absolute left-3.5 top-3 h-4 w-4 text-text-muted" />
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Descreva os diferenciais da sua estética automotiva..."
                  className="w-full bg-surface-input border border-surface-border rounded-xl pl-10 pr-4 py-2.5 text-xs text-text-primary placeholder:text-text-muted focus:outline-none focus:border-brand-primary"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-brand-primary hover:bg-brand-hover text-white font-semibold py-3 rounded-xl text-xs transition-all shadow-md shadow-brand-primary/20 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Salvando lava-jato...
                </>
              ) : (
                "Finalizar Cadastro e Ir para o Painel"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
