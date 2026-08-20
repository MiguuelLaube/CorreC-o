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
          <span className="font-['Plus_Jakarta_Sans'] text-2xl font-bold text-[#074469]">
            CorrenteCão
          </span>
          <p className="font-['Be_Vietnam_Pro'] text-sm md:text-base text-[#41474e] max-w-sm">
            Conectando corações, transformando vidas. Adote com responsabilidade e apoie instituições dedicadas ao cuidado animal.
          </p>
          <p className="font-['Be_Vietnam_Pro'] text-xs text-[#72787f] mt-2">
            © 2024 CorrenteCão. Todos os direitos reservados.
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
              Programa de Patrocínio
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
            Siga-nos & Apoie
          </span>
          <div className="flex gap-3">
            <button
              onClick={onOpenContactModal}
              aria-label="Compartilhar"
              className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-[#41474e] hover:text-[#074469] hover:shadow-md transition-all shadow-sm cursor-pointer border border-[#c1c7cf]/40"
            >
              <span className="material-symbols-outlined text-lg">share</span>
            </button>
            <button
              onClick={onOpenContactModal}
              aria-label="E-mail"
              className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-[#41474e] hover:text-[#074469] hover:shadow-md transition-all shadow-sm cursor-pointer border border-[#c1c7cf]/40"
            >
              <span className="material-symbols-outlined text-lg">mail</span>
            </button>
            <button
              onClick={onOpenApoioModal}
              aria-label="Fazer Doação PIX"
              className="px-3 h-10 rounded-full bg-[#126b57] text-white flex items-center justify-center gap-1 hover:bg-[#196f5b] transition-all shadow-sm cursor-pointer text-xs font-semibold"
            >
              <span className="material-symbols-outlined text-base">volunteer_activism</span>
              <span>Doar PIX</span>
            </button>
          </div>
          <p className="font-['Be_Vietnam_Pro'] text-xs text-[#72787f] text-right mt-1">
            Plataforma 100% segura para animais e tutores
          </p>
        </div>
      </div>
    </footer>
  );
};
