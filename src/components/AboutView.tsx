import React from 'react';

interface AboutViewProps {
  onGoToAdoption: () => void;
  onGoToFoster: () => void;
  onOpenPix: () => void;
}

export const AboutView: React.FC<AboutViewProps> = ({
  onGoToAdoption,
  onGoToFoster,
  onOpenPix
}) => {
  return (
    <main className="flex-grow pt-8 sm:pt-12 pb-20 px-4 sm:px-6 md:px-12 lg:px-16 max-w-7xl mx-auto w-full font-['Plus_Jakarta_Sans'] text-left">
      {/* Hero Section */}
      <section className="text-center max-w-3xl mx-auto mb-14 sm:mb-16 space-y-4">
        <span className="bg-[#a0efd6]/50 dark:bg-[#5BE29D]/20 text-[#126b57] dark:text-[#5BE29D] border border-[#126b57]/20 dark:border-[#5BE29D]/40 font-['Plus_Jakarta_Sans'] text-xs font-bold uppercase tracking-wider px-3.5 py-1 rounded-full shadow-2xs">
          Nossa Missão
        </span>
        <h1 className="font-['Plus_Jakarta_Sans'] text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#074469] dark:text-white tracking-tight leading-[1.2]">
          Conectando quem quer amar a quem precisa de um lar
        </h1>
        <p className="font-['Inter'] text-sm sm:text-base md:text-lg text-[#475569] dark:text-[#cbd5e1] leading-relaxed max-w-2xl mx-auto">
          O MatchPet nasceu para unir abrigos, ONGs dedicadas e futuros tutores responsáveis por meio de uma plataforma simples, transparente e acolhedora.
        </p>
      </section>

      {/* 3 Pillars Grid */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 mb-16">
        <div className="bg-white dark:bg-[#121d28] rounded-3xl p-6 sm:p-8 shadow-xs hover:shadow-md transition-all border border-[#e2e8f0] dark:border-[#1e2c3c] space-y-4 flex flex-col justify-between">
          <div>
            <div className="w-14 h-14 bg-[#cde5ff] dark:bg-[#074469]/30 text-[#074469] dark:text-[#a5d4ff] rounded-2xl flex items-center justify-center mb-5 shadow-2xs">
              <span className="material-symbols-outlined text-3xl">verified_user</span>
            </div>
            <h3 className="font-['Plus_Jakarta_Sans'] text-xl sm:text-2xl font-bold text-[#074469] dark:text-white mb-2.5">
              Confiança & Segurança
            </h3>
            <p className="font-['Inter'] text-sm text-[#475569] dark:text-[#cbd5e1] leading-relaxed">
              Todas as ONGs cadastradas passam por verificação rigorosa, garantindo que os animais recebam vacinas, cuidados veterinários e triagem adequada.
            </p>
          </div>
        </div>

        <div className="bg-white dark:bg-[#121d28] rounded-3xl p-6 sm:p-8 shadow-xs hover:shadow-md transition-all border border-[#e2e8f0] dark:border-[#1e2c3c] space-y-4 flex flex-col justify-between">
          <div>
            <div className="w-14 h-14 bg-[#a0efd6]/60 dark:bg-[#5BE29D]/20 text-[#126b57] dark:text-[#5BE29D] rounded-2xl flex items-center justify-center mb-5 shadow-2xs">
              <span className="material-symbols-outlined text-3xl">favorite</span>
            </div>
            <h3 className="font-['Plus_Jakarta_Sans'] text-xl sm:text-2xl font-bold text-[#074469] dark:text-white mb-2.5">
              Amor & Acolhimento
            </h3>
            <p className="font-['Inter'] text-sm text-[#475569] dark:text-[#cbd5e1] leading-relaxed">
              Auxiliamos tutores em momentos delicados com o nosso formulário de acolhimento e triagem humanizada, evitando o abandono de animais.
            </p>
          </div>
        </div>

        <div className="bg-white dark:bg-[#121d28] rounded-3xl p-6 sm:p-8 shadow-xs hover:shadow-md transition-all border border-[#e2e8f0] dark:border-[#1e2c3c] space-y-4 flex flex-col justify-between">
          <div>
            <div className="w-14 h-14 bg-[#ffdbc9] dark:bg-[#ffdbc9]/20 text-[#914100] dark:text-[#fdba74] rounded-2xl flex items-center justify-center mb-5 shadow-2xs">
              <span className="material-symbols-outlined text-3xl">diversity_1</span>
            </div>
            <h3 className="font-['Plus_Jakarta_Sans'] text-xl sm:text-2xl font-bold text-[#074469] dark:text-white mb-2.5">
              Comunidade Ativa
            </h3>
            <p className="font-['Inter'] text-sm text-[#475569] dark:text-[#cbd5e1] leading-relaxed">
              Rede integrada com clínicas parceiras, doadores via PIX e voluntários apaixonados que transformam a realidade de milhares de vidas.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Box */}
      <section className="bg-[#074469] dark:bg-[#0c1b29] text-white rounded-3xl p-8 sm:p-12 text-center max-w-4xl mx-auto space-y-6 shadow-md border border-[#2a5c82]/40 dark:border-[#1e2c3c]">
        <h2 className="font-['Plus_Jakarta_Sans'] text-2xl sm:text-3xl md:text-4xl font-extrabold">
          Faça parte desta corrente do bem
        </h2>
        <p className="font-['Inter'] text-sm sm:text-base text-[#cde5ff] dark:text-[#cbd5e1] max-w-2xl mx-auto leading-relaxed">
          Seja adotando, indicando um abrigo parceiro ou apoiando financeiramente com qualquer valor, você salva vidas.
        </p>
        <div className="flex flex-wrap justify-center gap-3.5 pt-2">
          <button
            onClick={onGoToAdoption}
            className="bg-white dark:bg-[#5BE29D] text-[#074469] dark:text-[#063e2e] font-bold text-sm px-6 py-3.5 rounded-2xl hover:bg-[#f8fafc] dark:hover:bg-[#48cf8b] transition-all cursor-pointer shadow-sm min-h-[44px]"
          >
            Quero Adotar
          </button>
          <button
            onClick={onOpenPix}
            className="bg-[#126b57] text-white font-bold text-sm px-6 py-3.5 rounded-2xl hover:bg-[#196f5b] transition-all cursor-pointer shadow-sm flex items-center gap-2 min-h-[44px]"
          >
            <span className="material-symbols-outlined text-base">volunteer_activism</span>
            <span>Apoiar via PIX</span>
          </button>
        </div>
      </section>
    </main>
  );
};
