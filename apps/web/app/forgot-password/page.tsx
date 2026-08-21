"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Sparkles,
  Mail,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  KeyRound,
} from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setIsSubmitted(true);
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
        {!isSubmitted ? (
          <>
            <div className="text-center space-y-2">
              <div className="h-12 w-12 rounded-2xl bg-brand-primary/10 border border-brand-primary/20 text-brand-primary flex items-center justify-center mx-auto mb-3">
                <KeyRound className="h-6 w-6" />
              </div>
              <h1 className="font-heading text-2xl font-bold text-text-primary">
                Recuperar senha
              </h1>
              <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
                Digite o e-mail cadastrado na sua conta para receber o link de
                redefinição.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
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

              <button
                type="submit"
                className="w-full bg-brand-primary hover:bg-brand-hover text-white font-semibold py-2.5 rounded-xl text-sm transition-all flex items-center justify-center gap-2 shadow-lg shadow-brand-primary/20 mt-2"
              >
                Enviar instruções
                <ArrowRight className="h-4 w-4" />
              </button>
            </form>
          </>
        ) : (
          <div className="text-center space-y-4 py-2">
            <div className="h-12 w-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 flex items-center justify-center mx-auto">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <h2 className="font-heading text-xl font-bold text-text-primary">
              E-mail enviado!
            </h2>
            <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
              Enviamos as instruções de recuperação para{" "}
              <strong className="text-text-primary">{email}</strong>. Verifique
              sua caixa de entrada e spam.
            </p>
            <button
              onClick={() => setIsSubmitted(false)}
              className="text-xs text-brand-primary font-semibold hover:underline block mx-auto pt-2"
            >
              Tentar outro e-mail
            </button>
          </div>
        )}

        {/* Rodapé do Card */}
        <div className="pt-4 border-t border-surface-border text-center">
          <Link
            href="/login"
            className="inline-flex items-center gap-2 text-xs font-semibold text-text-secondary hover:text-text-primary transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Voltar para o login
          </Link>
        </div>
      </div>
    </div>
  );
}
