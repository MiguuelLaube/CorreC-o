import React from 'react';
import { Partner } from '../types';
import { PartnerCarousel } from './PartnerCarousel';

interface FooterProps {
  partners?: Partner[];
  onOpenApoioModal?: () => void;
  onOpenContactModal?: () => void;
  onSelectPartner?: (partner: Partner) => void;
}

export const Footer: React.FC<FooterProps> = ({
  partners,
  onOpenApoioModal,
  onOpenContactModal,
  onSelectPartner
}) => {
  return (
    <footer className="w-full bg-[#f1f5f9] dark:bg-[#080e14] border-t border-[#e2e8f0] dark:border-[#1e2c3c] mt-auto font-['Plus_Jakarta_Sans'] transition-colors">
      {/* Carrossel Infinito de Propagandas e Parceiros no Footer */}
      <PartnerCarousel
        partners={partners}
        onSelectPartner={onSelectPartner}
        compact={false}
      />

      {/* Seção Principal do Footer Institucional */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 lg:px-16 py-12 grid grid-cols-1 md:grid-cols-3 gap-8 items-start border-t border-[#e2e8f0] dark:border-[#1e2c3c] text-left">
        {/* Brand Column */}
        <div className="flex flex-col gap-2.5">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-[#074469] dark:bg-[#5BE29D]/20 text-[#a0efd6] dark:text-[#5BE29D] border border-transparent dark:border-[#5BE29D]/30 flex items-center justify-center shadow-2xs">
              <span className="material-symbols-outlined text-xl">pets</span>
            </div>
            <span className="font-['Plus_Jakarta_Sans'] text-2xl font-extrabold text-[#074469] dark:text-white tracking-tight">
              Match<span className="text-[#126b57] dark:text-[#5BE29D]">Pet</span>
            </span>
          </div>
          <p className="font-['Inter'] text-xs sm:text-sm text-[#475569] dark:text-[#cbd5e1] max-w-sm leading-relaxed">
            Conectando corações a quem precisa de um lar. Plataforma segura de adoção responsável e apoio direto a ONGs e protetores.
          </p>
          <p className="font-['Inter'] text-xs text-[#64748b] dark:text-[#94a3b8] mt-2">
            © 2026 MatchPet. Todos os direitos reservados.
          </p>
        </div>

        {/* Middle / Info Links */}
        <div className="flex flex-col gap-2 md:items-center">
          <div className="flex flex-col gap-2 text-left">
            <span className="font-['Plus_Jakarta_Sans'] font-bold text-[#074469] dark:text-[#5BE29D] text-xs uppercase tracking-wider mb-1">
              Institucional
            </span>
            <button
              onClick={onOpenContactModal}
              className="text-left font-['Inter'] text-[#475569] dark:text-[#cbd5e1] hover:text-[#074469] dark:hover:text-[#5BE29D] hover:underline decoration-[#074469] transition-all text-xs sm:text-sm cursor-pointer"
            >
              Contato & Suporte
            </button>
            <button
              onClick={onOpenContactModal}
              className="text-left font-['Inter'] text-[#475569] dark:text-[#cbd5e1] hover:text-[#074469] dark:hover:text-[#5BE29D] hover:underline decoration-[#074469] transition-all text-xs sm:text-sm cursor-pointer"
            >
              Programa de ONGs Parceiras
            </button>
            <button
              onClick={onOpenApoioModal}
              className="text-left font-['Inter'] text-[#475569] dark:text-[#cbd5e1] hover:text-[#074469] dark:hover:text-[#5BE29D] hover:underline decoration-[#074469] transition-all text-xs sm:text-sm cursor-pointer font-semibold"
            >
              Apoio / Chave PIX
            </button>
          </div>
        </div>

        {/* Right Column / Social & Security */}
        <div className="flex flex-col gap-3 md:items-end">
          <span className="font-['Plus_Jakarta_Sans'] font-bold text-[#074469] dark:text-[#5BE29D] text-xs uppercase tracking-wider">
            Apoie a Causa Animal
          </span>
          <div className="flex gap-2.5">
            <button
              onClick={onOpenContactModal}
              aria-label="Compartilhar"
              className="w-10 h-10 rounded-2xl bg-white dark:bg-[#121d28] flex items-center justify-center text-[#475569] dark:text-[#cbd5e1] hover:text-[#074469] dark:hover:text-[#5BE29D] hover:shadow-md transition-all shadow-xs cursor-pointer border border-[#e2e8f0] dark:border-[#1e2c3c]"
            >
              <span className="material-symbols-outlined text-lg">share</span>
            </button>
            <button
              onClick={onOpenContactModal}
              aria-label="E-mail"
              className="w-10 h-10 rounded-2xl bg-white dark:bg-[#121d28] flex items-center justify-center text-[#475569] dark:text-[#cbd5e1] hover:text-[#074469] dark:hover:text-[#5BE29D] hover:shadow-md transition-all shadow-xs cursor-pointer border border-[#e2e8f0] dark:border-[#1e2c3c]"
            >
              <span className="material-symbols-outlined text-lg">mail</span>
            </button>
            <button
              onClick={onOpenApoioModal}
              aria-label="Fazer Doação PIX"
              className="px-4 h-10 rounded-2xl bg-[#126b57] hover:bg-[#005141] text-white flex items-center justify-center gap-1.5 transition-all shadow-xs cursor-pointer text-xs font-bold"
            >
              <span className="material-symbols-outlined text-base">volunteer_activism</span>
              <span>Doar PIX</span>
            </button>
          </div>
          <p className="font-['Inter'] text-xs text-[#64748b] dark:text-[#94a3b8] md:text-right mt-1">
            Plataforma segura com isolamento de dados
          </p>
        </div>
      </div>
    </footer>
  );
};
