import React, { useState } from 'react';
import { Pet } from '../types';

interface PetDetailViewProps {
  pet: Pet;
  onBack: () => void;
  onToggleFavorite: (petId: string) => void;
  onManifestarInteresse: (pet: Pet) => void;
}

export const PetDetailView: React.FC<PetDetailViewProps> = ({
  pet,
  onBack,
  onToggleFavorite,
  onManifestarInteresse
}) => {
  // Galeria de fotos com fallback para a foto principal
  const gallery = [pet.mainImage, ...(pet.galleryImages || [])];
  const [activeImageIndex, setActiveImageIndex] = useState<number>(0);

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 lg:px-16 py-6 sm:py-10 w-full font-['Plus_Jakarta_Sans']">
      {/* Botão de retorno */}
      <div className="mb-6">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-[#074469] dark:text-[#5BE29D] font-bold text-xs sm:text-sm hover:bg-[#f1f5f9] dark:hover:bg-[#162230] cursor-pointer bg-white dark:bg-[#121d28] px-4 py-2.5 rounded-2xl border border-[#e2e8f0] dark:border-[#1e2c3c] shadow-xs min-h-[42px] transition-all"
        >
          <span className="material-symbols-outlined text-lg">arrow_back</span>
          <span>Voltar para vitrine de animais</span>
        </button>
      </div>

      {/* Seção Principal: Galeria & Ficha Técnica */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 mb-12 items-start">
        {/* Galeria de Fotos */}
        <div className="space-y-3">
          <div className="w-full h-[320px] sm:h-[400px] md:h-[440px] rounded-3xl overflow-hidden shadow-sm border border-[#e2e8f0] dark:border-[#1e2c3c] bg-[#e2e8f0] dark:bg-[#162230] relative">
            <img
              className="w-full h-full object-cover transition-all duration-300"
              src={gallery[activeImageIndex] || pet.mainImage}
              alt={`Foto de ${pet.name}`}
            />
          </div>

          {/* Miniaturas de fotos */}
          {gallery.length > 1 && (
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
              {gallery.map((imgUrl, index) => (
                <button
                  key={index}
                  onClick={() => setActiveImageIndex(index)}
                  className={`h-20 sm:h-24 rounded-2xl overflow-hidden shadow-xs relative cursor-pointer group border-2 transition-all ${
                    activeImageIndex === index
                      ? 'border-[#074469] dark:border-[#5BE29D] scale-98 ring-2 ring-[#074469]/20 dark:ring-[#5BE29D]/30'
                      : 'border-transparent opacity-80 hover:opacity-100'
                  }`}
                  aria-label={`Ver foto ${index + 1}`}
                >
                  <img
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    src={imgUrl}
                    alt={`Miniatura ${index + 1}`}
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Ficha Técnica & Ações */}
        <div className="flex flex-col justify-between h-full space-y-6 text-left">
          <div>
            <div className="flex justify-between items-start mb-2">
              <div>
                <span className="bg-[#a0efd6]/50 dark:bg-[#5BE29D]/20 text-[#126b57] dark:text-[#5BE29D] border border-[#126b57]/20 dark:border-[#5BE29D]/40 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                  Disponível para Adoção
                </span>
                <h1 className="font-['Plus_Jakarta_Sans'] text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#074469] dark:text-white mt-2.5">
                  {pet.name}
                </h1>
              </div>

              <button
                onClick={() => onToggleFavorite(pet.id)}
                aria-label="Favoritar"
                className="p-3 rounded-2xl hover:bg-[#f1f5f9] dark:hover:bg-[#162230] transition-all cursor-pointer border border-[#e2e8f0] dark:border-[#1e2c3c] shadow-xs bg-white dark:bg-[#121d28] hover:scale-105 active:scale-95"
              >
                <span
                  className={`material-symbols-outlined text-2xl sm:text-3xl transition-colors ${
                    pet.favorite ? 'material-symbols-fill text-[#ba1a1a]' : 'text-[#64748b] dark:text-[#94a3b8] hover:text-[#ba1a1a]'
                  }`}
                >
                  favorite
                </span>
              </button>
            </div>

            <p className="font-['Inter'] text-sm sm:text-base text-[#475569] dark:text-[#cbd5e1] mb-6">
              {pet.city || 'São Paulo'}, {pet.state || 'SP'} • Cadastrado por <strong className="text-[#074469] dark:text-white">{pet.ongName || 'ONG Parceira'}</strong>
            </p>

            {/* Ficha Técnica Detalhada */}
            <div className="bg-[#f8fafc] dark:bg-[#101b26] rounded-3xl p-5 sm:p-6 border border-[#e2e8f0] dark:border-[#1e2c3c] shadow-xs">
              <h2 className="font-['Plus_Jakarta_Sans'] text-base sm:text-lg font-bold text-[#074469] dark:text-[#5BE29D] mb-4 flex items-center gap-2 border-b border-[#e2e8f0] dark:border-[#1e2c3c] pb-3">
                <span className="material-symbols-outlined text-lg sm:text-xl">badge</span>
                <span>Ficha do Animal</span>
              </h2>

              <div className="grid grid-cols-2 gap-3 sm:gap-4 font-['Inter'] text-sm">
                <div className="bg-white dark:bg-[#162230] p-3.5 rounded-2xl border border-[#e2e8f0] dark:border-[#24364a] shadow-2xs">
                  <span className="text-xs text-[#64748b] dark:text-[#94a3b8] flex items-center gap-1 mb-1 font-medium">
                    <span className="material-symbols-outlined text-base">calendar_month</span>
                    Idade
                  </span>
                  <strong className="text-base text-[#0f172a] dark:text-[#f8fafc] font-bold">{pet.age}</strong>
                </div>

                <div className="bg-white dark:bg-[#162230] p-3.5 rounded-2xl border border-[#e2e8f0] dark:border-[#24364a] shadow-2xs">
                  <span className="text-xs text-[#64748b] dark:text-[#94a3b8] flex items-center gap-1 mb-1 font-medium">
                    <span className="material-symbols-outlined text-base">straighten</span>
                    Porte
                  </span>
                  <strong className="text-base text-[#0f172a] dark:text-[#f8fafc] font-bold">{pet.size}</strong>
                </div>

                <div className="bg-white dark:bg-[#162230] p-3.5 rounded-2xl border border-[#e2e8f0] dark:border-[#24364a] shadow-2xs">
                  <span className="text-xs text-[#64748b] dark:text-[#94a3b8] flex items-center gap-1 mb-1 font-medium">
                    <span className="material-symbols-outlined text-base">
                      {pet.gender === 'Macho' ? 'male' : 'female'}
                    </span>
                    Gênero
                  </span>
                  <strong className="text-base text-[#0f172a] dark:text-[#f8fafc] font-bold">{pet.gender}</strong>
                </div>

                <div className="bg-white dark:bg-[#162230] p-3.5 rounded-2xl border border-[#e2e8f0] dark:border-[#24364a] shadow-2xs">
                  <span className="text-xs text-[#64748b] dark:text-[#94a3b8] flex items-center gap-1 mb-1 font-medium">
                    <span className="material-symbols-outlined text-base">vaccines</span>
                    Vacinação
                  </span>
                  <span className="inline-block bg-[#a0efd6]/60 dark:bg-[#5BE29D]/20 text-[#126b57] dark:text-[#5BE29D] font-bold px-2.5 py-0.5 rounded-lg text-xs">
                    {pet.vaccination === 'Vacinado' || pet.vaccination === 'Sim' || pet.vaccination === 'Completa'
                      ? 'Vacinado(a) ✓'
                      : pet.vaccination || 'Vacinado(a)'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* ONG Responsável Card */}
          <div className="bg-white dark:bg-[#121d28] rounded-3xl p-4 sm:p-5 border border-[#e2e8f0] dark:border-[#1e2c3c] flex items-center gap-4 shadow-xs">
            <div className="w-12 h-12 rounded-2xl bg-[#074469] dark:bg-[#5BE29D]/20 text-white dark:text-[#5BE29D] border border-transparent dark:border-[#5BE29D]/30 flex items-center justify-center shrink-0 shadow-xs">
              <span className="material-symbols-outlined text-2xl">home_health</span>
            </div>
            <div>
              <p className="font-['Inter'] text-xs uppercase tracking-wider text-[#64748b] dark:text-[#94a3b8] font-bold">
                ONG Responsável pelo Pet
              </p>
              <p className="font-['Plus_Jakarta_Sans'] text-base sm:text-lg text-[#074469] dark:text-white font-bold">
                {pet.ongName || 'Amigos de Patas'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section: Manifestar Interesse / Agendar Visita */}
      <section className="bg-[#074469] dark:bg-[#0c1b29] text-white rounded-3xl p-6 sm:p-8 md:p-10 flex flex-col md:flex-row justify-between items-center text-center md:text-left gap-6 shadow-md relative overflow-hidden border border-[#2a5c82]/40 dark:border-[#1e2c3c]">
        <div className="relative z-10 max-w-2xl">
          <h3 className="font-['Plus_Jakarta_Sans'] text-2xl md:text-3xl font-extrabold mb-2">
            Quer adotar o {pet.name}?
          </h3>
          <p className="font-['Inter'] text-sm md:text-base text-[#cde5ff] dark:text-[#cbd5e1] leading-relaxed">
            Manifeste seu interesse agora para agendar uma visita e conhecer o animalzinho de perto. A ONG {pet.ongName || 'responsável'} entrará em contato para os próximos passos.
          </p>
        </div>

        <button
          onClick={() => onManifestarInteresse(pet)}
          className="relative z-10 bg-white dark:bg-[#5BE29D] text-[#074469] dark:text-[#063e2e] font-['Plus_Jakarta_Sans'] font-extrabold text-sm sm:text-base rounded-2xl px-8 py-4 shadow-sm hover:bg-[#f8fafc] dark:hover:bg-[#48cf8b] active:scale-95 transition-all whitespace-nowrap cursor-pointer hover:scale-102 min-h-[48px]"
        >
          Manifestar Interesse / Agendar Visita
        </button>
      </section>
    </main>
  );
};
