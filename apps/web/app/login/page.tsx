"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Sparkles,
  Mail,
  Lock,
  ArrowRight,
  ShieldCheck,
  Eye,
  EyeOff,
} from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState<"CLIENT" | "OWNER">("CLIENT");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({ email, password, role });
  };

  return (
    <div className="min-h-screen bg-surface-background flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden">
      {/* Glow de fundo */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-brand-primary/15 rounded-full blur-3xl pointer-events-none" />

      {/* Logo */}
      <Link href="/" className="flex items-center gap-2 mb-8 z-10">
        <div className="h-10 w-10 rounded-xl bg-brand-primary flex items-center justify-center shadow-lg shadow-brand-primary/30">
          <Sparkles className="h-5 w-5 text-white" />
        </div>
        <span className="font-heading font-bold text-2xl tracking-tight text-text-primary">
          Lava<span className="text-brand-primary">Go</span>
        </span>
      </Link>

      {/* Card do Formulário */}
      <div className="w-full max-w-md bg-surface-card border border-surface-border rounded-2xl p-6 sm:p-8 shadow-2xl z-10 space-y-6">
        <div className="text-center space-y-1.5">
          <h1 className="font-heading text-2xl font-bold text-text-primary">
            Acessar conta
          </h1>
          <p className="text-xs sm:text-sm text-text-secondary">
            Entre para gerenciar seus agendamentos ou seu lava-jato
          </p>
        </div>

        {/* Toggle de Tipo de Conta */}
        <div className="grid grid-cols-2 bg-surface-input border border-surface-border p-1 rounded-xl text-xs font-semibold">
          <button
            type="button"
            onClick={() => setRole("CLIENT")}
            className={`py-2 rounded-lg transition-all ${
              role === "CLIENT"
                ? "bg-brand-primary text-white shadow-sm shadow-brand-primary/20"
                : "text-text-secondary hover:text-text-primary"
            }`}
          >
            Cliente
          </button>
          <button
            type="button"
            onClick={() => setRole("OWNER")}
            className={`py-2 rounded-lg transition-all ${
              role === "OWNER"
                ? "bg-brand-primary text-white shadow-sm shadow-brand-primary/20"
                : "text-text-secondary hover:text-text-primary"
            }`}
          >
            Dono de Lava-Jato
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Campo E-mail */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-text-secondary">
              E-mail
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seuemail@exemplo.com"
                className="w-full bg-surface-input border border-surface-border rounded-xl pl-10 pr-4 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-brand-primary transition-colors"
              />
            </div>
          </div>

          {/* Campo Senha */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-medium text-text-secondary">
                Senha
              </label>
              <Link
                href="/forgot-password"
                className="text-[11px] text-brand-primary hover:underline"
              >
                Esqueceu a senha?
              </Link>
            </div>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-surface-input border border-surface-border rounded-xl pl-10 pr-10 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-brand-primary transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          {/* Botão Entrar */}
          <button
            type="submit"
            className="w-full bg-brand-primary hover:bg-brand-hover text-white font-semibold py-2.5 rounded-xl text-sm transition-all flex items-center justify-center gap-2 shadow-lg shadow-brand-primary/20 mt-2"
          >
            Entrar no LavaGo
            <ArrowRight className="h-4 w-4" />
          </button>
        </form>

        {/* Rodapé do Card */}
        <div className="pt-4 border-t border-surface-border text-center text-xs text-text-secondary">
          Não tem uma conta?{" "}
          <Link
            href="/register"
            className="text-brand-primary font-semibold hover:underline"
          >
            Criar conta gratuita
          </Link>
        </div>
      </div>
    </div>
  );
}
