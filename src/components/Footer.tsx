import React from 'react';

interface FooterProps {
  onOpenApoioModal?: () => void;
  onOpenContactModal?: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenApoioModal,
  onOpenContactModal
}) => {
  return (
    <footer className="w-full bg-[#e6e8ea] border-t border-[#e0e3e5] mt-auto">
      <div className="max-w-7xl mx-auto px-4 md:px-16 py-12 grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
        {/* Brand Column */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#074469] text-[#a0efd6] flex items-center justify-center">
              <span className="material-symbols-outlined text-xl">pets</span>
            </div>
            <span className="font-['Plus_Jakarta_Sans'] text-2xl font-extrabold text-[#074469] tracking-tight">
              Match<span className="text-[#126b57]">Pet</span>
            </span>
          </div>
          <p className="font-['Be_Vietnam_Pro'] text-sm text-[#41474e] max-w-sm leading-relaxed">
            Conectando corações a quem precisa de um lar. Plataforma segura de adoção responsável e apoio direto a ONGs e protetores.
          </p>
          <p className="font-['Be_Vietnam_Pro'] text-xs text-[#72787f] mt-2">
            © 2026 MatchPet. Todos os direitos reservados.
          </p>
        </div>

        {/* Middle / Info Links */}
        <div className="flex flex-col gap-2 md:items-center">
          <div className="flex flex-col gap-2 text-left">
            <span className="font-['Plus_Jakarta_Sans'] font-semibold text-[#074469] text-sm tracking-wide uppercase">
              Institucional
            </span>
            <button
              onClick={onOpenContactModal}
              className="text-left font-['Be_Vietnam_Pro'] text-[#41474e] hover:text-[#074469] hover:underline decoration-[#074469] transition-all text-sm cursor-pointer"
            >
              Contato & Suporte
            </button>
            <button
              onClick={onOpenContactModal}
              className="text-left font-['Be_Vietnam_Pro'] text-[#41474e] hover:text-[#074469] hover:underline decoration-[#074469] transition-all text-sm cursor-pointer"
            >
              Programa de ONGs Parceiras
            </button>
            <button
              onClick={onOpenApoioModal}
              className="text-left font-['Be_Vietnam_Pro'] text-[#41474e] hover:text-[#074469] hover:underline decoration-[#074469] transition-all text-sm cursor-pointer font-medium"
            >
              Apoio / Chave PIX
            </button>
          </div>
        </div>

        {/* Right Column / Social & Security */}
        <div className="flex flex-col gap-3 md:items-end">
          <span className="font-['Plus_Jakarta_Sans'] font-semibold text-[#074469] text-sm tracking-wide uppercase">
            Apoie a Causa Animal
          </span>
          <div className="flex gap-3">
            <button
              onClick={onOpenContactModal}
              aria-label="Compartilhar"
              className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-[#41474e] hover:text-[#074469] hover:shadow-md transition-all shadow-sm cursor-pointer border border-[#c1c7cf]/40"
            >
              <span className="material-symbols-outlined text-lg">share</span>
            </button>
            <button
              onClick={onOpenContactModal}
              aria-label="E-mail"
              className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-[#41474e] hover:text-[#074469] hover:shadow-md transition-all shadow-sm cursor-pointer border border-[#c1c7cf]/40"
            >
              <span className="material-symbols-outlined text-lg">mail</span>
            </button>
            <button
              onClick={onOpenApoioModal}
              aria-label="Fazer Doação PIX"
              className="px-4 h-10 rounded-xl bg-[#126b57] text-white flex items-center justify-center gap-1.5 hover:bg-[#005141] transition-all shadow-xs cursor-pointer text-xs font-bold"
            >
              <span className="material-symbols-outlined text-base">volunteer_activism</span>
              <span>Doar PIX</span>
            </button>
          </div>
          <p className="font-['Be_Vietnam_Pro'] text-xs text-[#72787f] text-right mt-1">
            Plataforma segura com isolamento de dados
          </p>
        </div>
      </div>
    </footer>
  );
};
