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
    <main className="flex-grow pt-8 pb-20 px-4 md:px-16 max-w-7xl mx-auto w-full">
      {/* Hero Section */}
      <section className="text-center max-w-3xl mx-auto mb-16 space-y-4">
        <span className="bg-[#a0efd6] text-[#196f5b] font-['Be_Vietnam_Pro'] text-xs font-bold uppercase tracking-wider px-3.5 py-1 rounded-full">
          Nossa Missão
        </span>
        <h1 className="font-['Plus_Jakarta_Sans'] text-3xl sm:text-4xl md:text-5xl font-bold text-[#074469]">
          Conectando quem quer amar a quem precisa de um lar
        </h1>
        <p className="font-['Be_Vietnam_Pro'] text-base md:text-lg text-[#41474e] leading-relaxed">
          O CorrenteCão nasceu para unir abrigos, ONGs dedicadas e futuros tutores responsáveis por meio de uma plataforma simples, transparente e acolhedora.
        </p>
      </section>

      {/* 3 Pillars Grid */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        <div className="bg-white rounded-2xl p-8 shadow-xs border border-[#e0e3e5] space-y-4 flex flex-col justify-between">
          <div>
            <div className="w-14 h-14 bg-[#cde5ff] text-[#074469] rounded-2xl flex items-center justify-center mb-4">
              <span className="material-symbols-outlined text-3xl">verified_user</span>
            </div>
            <h3 className="font-['Plus_Jakarta_Sans'] text-2xl font-bold text-[#074469] mb-2">
              Confiança & Segurança
            </h3>
            <p className="font-['Be_Vietnam_Pro'] text-sm text-[#41474e] leading-relaxed">
              Todas as ONGs cadastradas passam por verificação rigorosa, garantindo que os animais recebam vacinas, cuidados veterinários e triagem adequada.
            </p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-8 shadow-xs border border-[#e0e3e5] space-y-4 flex flex-col justify-between">
          <div>
            <div className="w-14 h-14 bg-[#a0efd6] text-[#196f5b] rounded-2xl flex items-center justify-center mb-4">
              <span className="material-symbols-outlined text-3xl">favorite</span>
            </div>
            <h3 className="font-['Plus_Jakarta_Sans'] text-2xl font-bold text-[#074469] mb-2">
              Amor & Acolhimento
            </h3>
            <p className="font-['Be_Vietnam_Pro'] text-sm text-[#41474e] leading-relaxed">
              Auxiliamos tutores em momentos delicados com o nosso formulário de acolhimento e triagem humanizada, evitando o abandono de animais.
            </p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-8 shadow-xs border border-[#e0e3e5] space-y-4 flex flex-col justify-between">
          <div>
            <div className="w-14 h-14 bg-[#ffdbc9] text-[#914100] rounded-2xl flex items-center justify-center mb-4">
              <span className="material-symbols-outlined text-3xl">diversity_1</span>
            </div>
            <h3 className="font-['Plus_Jakarta_Sans'] text-2xl font-bold text-[#074469] mb-2">
              Comunidade Ativa
            </h3>
            <p className="font-['Be_Vietnam_Pro'] text-sm text-[#41474e] leading-relaxed">
              Rede integrada com clínicas parceiras, doadores via PIX e voluntários apaixonados que transformam a realidade de milhares de vidas.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Box */}
      <section className="bg-[#074469] text-white rounded-2xl p-8 md:p-12 text-center max-w-4xl mx-auto space-y-6">
        <h2 className="font-['Plus_Jakarta_Sans'] text-2xl md:text-3xl font-bold">
          Faça parte desta corrente do bem
        </h2>
        <p className="font-['Be_Vietnam_Pro'] text-sm md:text-base text-[#a5d4ff] max-w-2xl mx-auto leading-relaxed">
          Seja adotando, indicando um abrigo parceiro ou apoiando financeiramente com qualquer valor, você salva vidas.
        </p>
        <div className="flex flex-wrap justify-center gap-4 pt-2">
          <button
            onClick={onGoToAdoption}
            className="bg-white text-[#074469] font-['Be_Vietnam_Pro'] font-bold text-sm px-6 py-3 rounded-xl hover:bg-[#f7f9fb] transition-all cursor-pointer shadow-sm"
          >
            Quero Adotar
          </button>
          <button
            onClick={onOpenPix}
            className="bg-[#126b57] text-white font-['Be_Vietnam_Pro'] font-bold text-sm px-6 py-3 rounded-xl hover:bg-[#196f5b] transition-all cursor-pointer shadow-sm flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-base">volunteer_activism</span>
            Apoiar via PIX
          </button>
        </div>
      </section>
    </main>
  );
};
