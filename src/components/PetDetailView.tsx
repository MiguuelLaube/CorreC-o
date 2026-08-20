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
    <main className="max-w-7xl mx-auto px-4 md:px-16 py-8 md:py-12 w-full">
      {/* Botão de retorno */}
      <div className="mb-6">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-[#074469] font-['Be_Vietnam_Pro'] text-sm font-semibold hover:underline cursor-pointer bg-white px-3.5 py-2 rounded-xl border border-[#c1c7cf]/40 shadow-xs"
        >
          <span className="material-symbols-outlined text-base">arrow_back</span>
          <span>Voltar para vitrine de animais</span>
        </button>
      </div>

      {/* Seção Principal: Galeria & Ficha Técnica */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 mb-12 items-start">
        {/* Galeria de Fotos */}
        <div className="space-y-3">
          <div className="w-full h-[340px] sm:h-[420px] rounded-3xl overflow-hidden shadow-sm border border-[#e0e3e5] bg-[#e0e3e5] relative">
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
                  className={`h-24 rounded-2xl overflow-hidden shadow-xs relative cursor-pointer group border-2 transition-all ${
                    activeImageIndex === index
                      ? 'border-[#074469] scale-98 ring-2 ring-[#074469]/20'
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
        <div className="flex flex-col justify-between h-full space-y-6">
          <div>
            <div className="flex justify-between items-start mb-2">
              <div>
                <span className="bg-[#a0efd6] text-[#126b57] text-xs font-bold font-['Be_Vietnam_Pro'] px-3 py-1 rounded-full uppercase tracking-wider">
                  Disponível para Adoção
                </span>
                <h1 className="font-['Plus_Jakarta_Sans'] text-4xl sm:text-5xl font-bold text-[#074469] mt-2">
                  {pet.name}
                </h1>
              </div>

              <button
                onClick={() => onToggleFavorite(pet.id)}
                aria-label="Favoritar"
                className="p-3 rounded-2xl hover:bg-[#e0e3e5]/60 transition-colors cursor-pointer border border-[#c1c7cf]/40 shadow-xs bg-white"
              >
                <span
                  className={`material-symbols-outlined text-3xl transition-colors ${
                    pet.favorite ? 'material-symbols-fill text-[#914100]' : 'text-[#72787f] hover:text-[#914100]'
                  }`}
                >
                  favorite
                </span>
              </button>
            </div>

            <p className="font-['Be_Vietnam_Pro'] text-base text-[#41474e] mb-6">
              {pet.city || 'São Paulo'}, {pet.state || 'SP'} • Cadastrado por <strong>{pet.ongName || 'ONG Parceira'}</strong>
            </p>

            {/* Ficha Técnica Detalhada com os 5 campos principais */}
            <div className="bg-[#f2f4f6] rounded-3xl p-6 border border-[#e0e3e5] shadow-xs">
              <h2 className="font-['Plus_Jakarta_Sans'] text-lg font-bold text-[#074469] mb-4 flex items-center gap-2 border-b border-[#e0e3e5] pb-3">
                <span className="material-symbols-outlined text-[#074469]">badge</span>
                <span>Ficha do Animal</span>
              </h2>

              <div className="grid grid-cols-2 gap-4 font-['Be_Vietnam_Pro'] text-sm">
                <div className="bg-white p-3.5 rounded-2xl border border-[#e0e3e5]">
                  <span className="text-xs text-[#72787f] flex items-center gap-1 mb-1">
                    <span className="material-symbols-outlined text-base">calendar_month</span>
                    Idade
                  </span>
                  <strong className="text-base text-[#191c1e]">{pet.age}</strong>
                </div>

                <div className="bg-white p-3.5 rounded-2xl border border-[#e0e3e5]">
                  <span className="text-xs text-[#72787f] flex items-center gap-1 mb-1">
                    <span className="material-symbols-outlined text-base">straighten</span>
                    Porte
                  </span>
                  <strong className="text-base text-[#191c1e]">{pet.size}</strong>
                </div>

                <div className="bg-white p-3.5 rounded-2xl border border-[#e0e3e5]">
                  <span className="text-xs text-[#72787f] flex items-center gap-1 mb-1">
                    <span className="material-symbols-outlined text-base">
                      {pet.gender === 'Macho' ? 'male' : 'female'}
                    </span>
                    Gênero
                  </span>
                  <strong className="text-base text-[#191c1e]">{pet.gender}</strong>
                </div>

                <div className="bg-white p-3.5 rounded-2xl border border-[#e0e3e5]">
                  <span className="text-xs text-[#72787f] flex items-center gap-1 mb-1">
                    <span className="material-symbols-outlined text-base">vaccines</span>
                    Vacinação
                  </span>
                  <span className="inline-block bg-[#a0efd6] text-[#126b57] font-bold px-2.5 py-0.5 rounded-md text-xs">
                    {pet.vaccination === 'Vacinado' || pet.vaccination === 'Sim' || pet.vaccination === 'Completa'
                      ? 'Vacinado(a) ✓'
                      : pet.vaccination || 'Vacinado(a)'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* ONG Responsável Card */}
          <div className="bg-white rounded-3xl p-5 border border-[#e0e3e5] flex items-center gap-4 shadow-xs">
            <div className="w-12 h-12 rounded-2xl bg-[#074469] flex items-center justify-center text-white shrink-0 shadow-sm">
              <span className="material-symbols-outlined text-2xl">home_health</span>
            </div>
            <div>
              <p className="font-['Be_Vietnam_Pro'] text-xs uppercase tracking-wide text-[#72787f] font-semibold">
                ONG Responsável pelo Pet
              </p>
              <p className="font-['Plus_Jakarta_Sans'] text-lg text-[#074469] font-bold">
                {pet.ongName || 'Amigos de Patas'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section: Manifestar Interesse / Agendar Visita */}
      <section className="bg-[#074469] text-white rounded-3xl p-8 md:p-10 flex flex-col md:flex-row justify-between items-center text-center md:text-left gap-6 shadow-md relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <h3 className="font-['Plus_Jakarta_Sans'] text-2xl md:text-3xl font-bold mb-2">
            Quer adotar o {pet.name}?
          </h3>
          <p className="font-['Be_Vietnam_Pro'] text-sm md:text-base text-[#a5d4ff] leading-relaxed">
            Manifeste seu interesse agora para agendar uma visita e conhecer o animalzinho de perto. A ONG {pet.ongName || 'responsável'} entrará em contato para os próximos passos.
          </p>
        </div>

        <button
          onClick={() => onManifestarInteresse(pet)}
          className="relative z-10 bg-white text-[#074469] font-['Be_Vietnam_Pro'] font-bold text-sm md:text-base rounded-2xl px-8 py-4 shadow-sm hover:bg-[#f7f9fb] active:scale-95 transition-all whitespace-nowrap cursor-pointer hover:scale-102"
        >
          Manifestar Interesse / Agendar Visita
        </button>
      </section>
    </main>
  );
};
