"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Sparkles,
  Mail,
  Lock,
  User,
  Phone,
  Loader2,
  AlertCircle,
  Building2,
} from "lucide-react";
import { registerUser } from "@/lib/api";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"CLIENT" | "PARTNER">("CLIENT");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await registerUser({
        name,
        email,
        phone,
        password,
        role,
      });

      localStorage.setItem("@lavago:token", response.token);
      localStorage.setItem("@lavago:user", JSON.stringify(response.user));

      if (response.user.role === "PARTNER") {
        router.push("/partner/dashboard");
      } else {
        router.push("/");
      }
    } catch (err: any) {
      setError(err.message || "Erro ao criar conta. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface-background text-text-primary flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-3">
        <Link href="/" className="inline-flex items-center gap-2">
          <div className="h-10 w-10 rounded-xl bg-brand-primary flex items-center justify-center shadow-lg shadow-brand-primary/30">
            <Sparkles className="h-6 w-6 text-white" />
          </div>
          <span className="font-heading font-bold text-2xl tracking-tight text-text-primary">
            Lava<span className="text-brand-primary">Go</span>
          </span>
        </Link>
        <h2 className="font-heading text-xl font-bold tracking-tight text-text-primary">
          Crie sua conta no LavaGo
        </h2>
        <p className="text-xs text-text-secondary">
          Já tem uma conta?{" "}
          <Link
            href="/login"
            className="text-brand-primary hover:underline font-semibold"
          >
            Fazer login
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="bg-surface-card border border-surface-border rounded-2xl p-6 shadow-xl space-y-5">
          {error && (
            <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-500 text-xs flex items-center gap-2">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Seleção do Tipo de Perfil */}
          <div className="grid grid-cols-2 gap-2 p-1 bg-surface-input rounded-xl border border-surface-border">
            <button
              type="button"
              onClick={() => setRole("CLIENT")}
              className={`py-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
                role === "CLIENT"
                  ? "bg-brand-primary text-white shadow-sm"
                  : "text-text-secondary hover:text-text-primary"
              }`}
            >
              <User className="h-3.5 w-3.5" /> Cliente
            </button>
            <button
              type="button"
              onClick={() => setRole("PARTNER")}
              className={`py-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
                role === "PARTNER"
                  ? "bg-brand-primary text-white shadow-sm"
                  : "text-text-secondary hover:text-text-primary"
              }`}
            >
              <Building2 className="h-3.5 w-3.5" /> Sou Lava-Jato
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-text-secondary mb-1">
                Nome completo / Razão Social
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Seu nome completo"
                  className="w-full bg-surface-input border border-surface-border rounded-xl pl-10 pr-4 py-2.5 text-xs text-text-primary placeholder:text-text-muted focus:outline-none focus:border-brand-primary"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-text-secondary mb-1">
                E-mail
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu@email.com"
                  className="w-full bg-surface-input border border-surface-border rounded-xl pl-10 pr-4 py-2.5 text-xs text-text-primary placeholder:text-text-muted focus:outline-none focus:border-brand-primary"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-text-secondary mb-1">
                WhatsApp / Celular
              </label>
              <div className="relative">
                <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="(21) 98765-4321"
                  className="w-full bg-surface-input border border-surface-border rounded-xl pl-10 pr-4 py-2.5 text-xs text-text-primary placeholder:text-text-muted focus:outline-none focus:border-brand-primary"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-text-secondary mb-1">
                Senha
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
                <input
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Mínimo 6 caracteres"
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
                  Criando conta...
                </>
              ) : (
                "Criar minha conta"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
