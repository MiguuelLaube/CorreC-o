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
  // Gallery images with main image fallback
  const gallery = [pet.mainImage, ...(pet.galleryImages || [])];
  const [activeImageIndex, setActiveImageIndex] = useState<number>(0);

  return (
    <main className="max-w-7xl mx-auto px-4 md:px-16 py-8 md:py-12 w-full">
      {/* Back button */}
      <div className="mb-6">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-[#074469] font-['Be_Vietnam_Pro'] text-sm font-semibold hover:underline cursor-pointer bg-white px-3 py-1.5 rounded-lg border border-[#c1c7cf]/40 shadow-xs"
        >
          <span className="material-symbols-outlined text-base">arrow_back</span>
          <span>Voltar para lista de animais</span>
        </button>
      </div>

      {/* Hero Gallery & Quick Info */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 mb-16 items-start">
        {/* Gallery */}
        <div className="space-y-3">
          {/* Main big image */}
          <div className="w-full h-[320px] sm:h-[400px] rounded-2xl overflow-hidden shadow-sm border border-[#e0e3e5] bg-[#e0e3e5] relative">
            <img
              className="w-full h-full object-cover transition-all duration-300"
              src={gallery[activeImageIndex] || pet.mainImage}
              alt={`Foto de ${pet.name}`}
            />
          </div>

          {/* Thumbnails row */}
          {gallery.length > 1 && (
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
              {gallery.map((imgUrl, index) => (
                <button
                  key={index}
                  onClick={() => setActiveImageIndex(index)}
                  className={`h-24 rounded-xl overflow-hidden shadow-xs relative cursor-pointer group border-2 transition-all ${
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
                  <div className="absolute inset-0 bg-[#074469]/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="material-symbols-outlined text-white text-lg material-symbols-fill">
                      zoom_in
                    </span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Quick Info */}
        <div className="flex flex-col justify-center pt-2">
          <div className="flex justify-between items-start mb-2">
            <h1 className="font-['Plus_Jakarta_Sans'] text-4xl sm:text-5xl font-bold text-[#074469]">
              {pet.name}
            </h1>
            <button
              onClick={() => onToggleFavorite(pet.id)}
              aria-label="Favoritar"
              className="p-2.5 rounded-full hover:bg-[#e0e3e5]/60 transition-colors cursor-pointer border border-[#c1c7cf]/40 shadow-xs"
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

          <p className="font-['Plus_Jakarta_Sans'] text-xl md:text-2xl font-semibold text-[#41474e] mb-5">
            {pet.breed} • {pet.city}, {pet.state}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-8">
            {pet.temperament.map((trait, idx) => (
              <span
                key={idx}
                className="bg-[#a0efd6] text-[#196f5b] rounded-full px-4 py-1.5 font-['Be_Vietnam_Pro'] text-sm font-semibold shadow-xs"
              >
                {trait}
              </span>
            ))}
            {pet.castrated && (
              <span className="bg-[#cde5ff] text-[#001d32] rounded-full px-4 py-1.5 font-['Be_Vietnam_Pro'] text-sm font-semibold shadow-xs">
                Castrado(a)
              </span>
            )}
          </div>

          {/* Responsible ONG Card */}
          <div className="bg-[#f2f4f6] rounded-2xl p-5 border border-[#c1c7cf]/40 flex items-center gap-4 shadow-xs">
            <div className="w-12 h-12 rounded-full bg-[#074469] flex items-center justify-center text-white shrink-0 shadow-sm">
              <span className="material-symbols-outlined text-2xl">volunteer_activism</span>
            </div>
            <div>
              <p className="font-['Be_Vietnam_Pro'] text-xs uppercase tracking-wide text-[#72787f] font-semibold">
                ONG Responsável
              </p>
              <p className="font-['Be_Vietnam_Pro'] text-lg text-[#074469] font-bold">
                {pet.ongName}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Detailed Info (Story & Technical Sheet) */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 items-start">
        {/* Description / Story */}
        <div className="md:col-span-2 space-y-6">
          <h2 className="font-['Plus_Jakarta_Sans'] text-2xl md:text-3xl font-bold text-[#074469]">
            A História do {pet.name}
          </h2>
          <div className="space-y-4 font-['Be_Vietnam_Pro'] text-base md:text-lg text-[#41474e] leading-relaxed">
            {pet.story.map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>
        </div>

        {/* Technical Sheet ("Ficha Técnica") */}
        <div className="bg-[#eceef0] rounded-2xl p-6 shadow-sm border border-[#c1c7cf]/30">
          <h3 className="font-['Plus_Jakarta_Sans'] text-xl font-bold text-[#074469] mb-4 border-b border-[#c1c7cf]/40 pb-3">
            Ficha Técnica
          </h3>
          <ul className="space-y-3 font-['Be_Vietnam_Pro'] text-sm">
            <li className="flex justify-between items-center py-1.5 border-b border-[#c1c7cf]/20">
              <span className="text-[#41474e] flex items-center gap-2">
                <span className="material-symbols-outlined text-lg text-[#72787f]">pets</span>
                Espécie
              </span>
              <span className="font-semibold text-[#191c1e]">{pet.species}</span>
            </li>

            <li className="flex justify-between items-center py-1.5 border-b border-[#c1c7cf]/20">
              <span className="text-[#41474e] flex items-center gap-2">
                <span className="material-symbols-outlined text-lg text-[#72787f]">straighten</span>
                Porte
              </span>
              <span className="font-semibold text-[#191c1e]">{pet.size}</span>
            </li>

            <li className="flex justify-between items-center py-1.5 border-b border-[#c1c7cf]/20">
              <span className="text-[#41474e] flex items-center gap-2">
                <span className="material-symbols-outlined text-lg text-[#72787f]">
                  {pet.gender === 'Macho' ? 'male' : 'female'}
                </span>
                Gênero
              </span>
              <span className="font-semibold text-[#191c1e]">{pet.gender}</span>
            </li>

            <li className="flex justify-between items-center py-1.5 border-b border-[#c1c7cf]/20">
              <span className="text-[#41474e] flex items-center gap-2">
                <span className="material-symbols-outlined text-lg text-[#72787f]">calendar_month</span>
                Idade
              </span>
              <span className="font-semibold text-[#191c1e]">{pet.age}</span>
            </li>

            <li className="flex justify-between items-center py-1.5 border-b border-[#c1c7cf]/20">
              <span className="text-[#41474e] flex items-center gap-2">
                <span className="material-symbols-outlined text-lg text-[#72787f]">palette</span>
                Cor
              </span>
              <span className="font-semibold text-[#191c1e]">{pet.color}</span>
            </li>

            <li className="flex justify-between items-center py-1.5 border-b border-[#c1c7cf]/20">
              <span className="text-[#41474e] flex items-center gap-2">
                <span className="material-symbols-outlined text-lg text-[#72787f]">vaccines</span>
                Vacinação
              </span>
              <span className="font-semibold text-[#126b57] bg-[#a0efd6]/60 px-2 py-0.5 rounded text-xs">
                {pet.vaccination}
              </span>
            </li>

            <li className="flex justify-between items-center py-1.5">
              <span className="text-[#41474e] flex items-center gap-2">
                <span className="material-symbols-outlined text-lg text-[#72787f]">content_cut</span>
                Castração
              </span>
              <span className="font-semibold text-[#126b57] bg-[#a0efd6]/60 px-2 py-0.5 rounded text-xs">
                {pet.castrated ? 'Sim' : 'Não'}
              </span>
            </li>
          </ul>
        </div>
      </section>

      {/* CTA Section */}
      <section className="mt-16 bg-[#2a5c82] text-white rounded-2xl p-8 md:p-10 flex flex-col md:flex-row justify-between items-center text-center md:text-left gap-6 shadow-md relative overflow-hidden">
        {/* Subtle radial pattern */}
        <div
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
            backgroundSize: '20px 20px'
          }}
        />

        <div className="relative z-10 max-w-2xl">
          <h3 className="font-['Plus_Jakarta_Sans'] text-2xl md:text-3xl font-bold mb-2">
            Dê um lar amoroso para o {pet.name}!
          </h3>
          <p className="font-['Be_Vietnam_Pro'] text-sm md:text-base text-[#a5d4ff] leading-relaxed">
            O processo de adoção é simples, mas rigoroso para garantir a segurança dos animais. Manifeste seu interesse agora e a ONG {pet.ongName} entrará em contato.
          </p>
        </div>

        <button
          onClick={() => onManifestarInteresse(pet)}
          className="relative z-10 bg-white text-[#074469] font-['Be_Vietnam_Pro'] font-bold text-sm md:text-base rounded-xl px-8 py-4 shadow-sm hover:scale-105 active:scale-95 transition-all whitespace-nowrap cursor-pointer hover:bg-[#f7f9fb]"
        >
          Manifestar Interesse / Agendar Visita
        </button>
      </section>
    </main>
  );
};
