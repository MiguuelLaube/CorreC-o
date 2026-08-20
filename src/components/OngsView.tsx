import React, { useState, useMemo } from 'react';
import { ONG, Pet } from '../types';

interface OngsViewProps {
  ongs: ONG[];
  pets: Pet[];
  onSelectPet: (pet: Pet) => void;
  onOpenIndicarOng: () => void;
  onOpenContactOng: (ong: ONG) => void;
}

export const OngsView: React.FC<OngsViewProps> = ({
  ongs,
  pets,
  onSelectPet,
  onOpenIndicarOng,
  onOpenContactOng
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOngDetails, setSelectedOngDetails] = useState<ONG | null>(null);

  const filteredOngs = useMemo(() => {
    if (!searchQuery.trim()) return ongs;
    const q = searchQuery.toLowerCase();
    return ongs.filter(
      (ong) =>
        ong.name.toLowerCase().includes(q) ||
        ong.city.toLowerCase().includes(q) ||
        ong.state.toLowerCase().includes(q)
    );
  }, [ongs, searchQuery]);

  return (
    <main className="flex-grow pt-8 pb-20 px-4 md:px-16 max-w-7xl mx-auto w-full">
      {/* Hero / Search Section */}
      <section className="mb-12">
        <h1 className="font-['Plus_Jakarta_Sans'] text-3xl sm:text-4xl md:text-5xl font-bold text-[#074469] mb-4">
          Encontre ONGs Parceiras
        </h1>
        <p className="font-['Be_Vietnam_Pro'] text-base sm:text-lg text-[#41474e] mb-8 max-w-2xl leading-relaxed">
          Conheça as instituições dedicadas ao resgate e cuidado de animais. Busque por nome ou cidade para encontrar ONGs próximas a você e saiba como apoiar.
        </p>

        <div className="bg-white p-2.5 rounded-xl shadow-sm flex items-center gap-3 border border-[#c1c7cf]/40 focus-within:border-[#074469] transition-all max-w-xl">
          <span className="material-symbols-outlined text-[#72787f] ml-2">search</span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar por cidade ou nome da ONG..."
            className="w-full bg-transparent border-none focus:ring-0 text-[#191c1e] font-['Be_Vietnam_Pro'] text-sm sm:text-base placeholder-[#72787f] p-0 outline-none"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="text-xs text-[#72787f] hover:text-[#191c1e] px-1"
            >
              Limpar
            </button>
          )}
          <button
            onClick={() => {}}
            className="bg-[#074469] text-white p-2.5 rounded-lg hover:bg-[#2a5c82] transition-colors cursor-pointer flex items-center justify-center shrink-0"
            aria-label="Pesquisar"
          >
            <span className="material-symbols-outlined text-lg">arrow_forward</span>
          </button>
        </div>
      </section>

      {/* Bento Grid of ONGs */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredOngs.map((ong, index) => (
          <article
            key={ong.id}
            className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 border border-[#c1c7cf]/30 overflow-hidden flex flex-col"
          >
            <div className="h-52 w-full bg-[#e0e3e5] relative overflow-hidden group">
              <img
                src={ong.image}
                alt={ong.name}
                className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
              />
              {index === 0 && (
                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-sm">
                  <span className="material-symbols-outlined text-[#914100] material-symbols-fill text-xl">
                    favorite
                  </span>
                </div>
              )}
            </div>

            <div className="p-6 flex-grow flex flex-col justify-between">
              <div>
                <h3 className="font-['Plus_Jakarta_Sans'] text-2xl font-semibold text-[#191c1e] mb-1">
                  {ong.name}
                </h3>
                <p className="font-['Be_Vietnam_Pro'] text-sm text-[#41474e] flex items-center gap-1 mb-3">
                  <span className="material-symbols-outlined text-[#72787f] text-lg">location_on</span>
                  {ong.city}, {ong.state}
                </p>
                <p className="font-['Be_Vietnam_Pro'] text-xs text-[#72787f] line-clamp-2 mb-4">
                  {ong.description}
                </p>
              </div>

              <div className="pt-4 flex items-center justify-between border-t border-[#e0e3e5]/60">
                <p className="font-['Be_Vietnam_Pro'] text-xs sm:text-sm text-[#074469] font-semibold flex items-center gap-1">
                  <span className="material-symbols-outlined text-base">call</span>
                  {ong.phone}
                </p>
                <button
                  onClick={() => setSelectedOngDetails(ong)}
                  className="bg-[#a0efd6] text-[#196f5b] font-['Be_Vietnam_Pro'] text-xs sm:text-sm font-semibold px-3.5 py-1.5 rounded-lg hover:bg-[#87d5bd] transition-colors cursor-pointer"
                >
                  Ver Perfil
                </button>
              </div>
            </div>
          </article>
        ))}

        {/* Empty State / Call to Action style card */}
        <article className="bg-[#f2f4f6] rounded-xl border border-dashed border-[#c1c7cf] flex flex-col items-center justify-center p-8 text-center min-h-[350px]">
          <div className="bg-[#2a5c82]/15 p-4 rounded-full mb-4 text-[#074469]">
            <span className="material-symbols-outlined text-4xl">add_business</span>
          </div>
          <h3 className="font-['Plus_Jakarta_Sans'] text-2xl font-semibold text-[#191c1e] mb-2">
            Conhece uma ONG?
          </h3>
          <p className="font-['Be_Vietnam_Pro'] text-sm text-[#41474e] mb-6 max-w-[260px] leading-relaxed">
            Ajude-nos a expandir nossa rede. Indique uma instituição para se tornar parceira.
          </p>
          <button
            onClick={onOpenIndicarOng}
            className="bg-[#074469] text-white font-['Be_Vietnam_Pro'] text-sm font-semibold px-5 py-2.5 rounded-lg hover:bg-[#2a5c82] transition-colors shadow-sm cursor-pointer"
          >
            Indicar ONG
          </button>
        </article>
      </section>

      {/* ONG Profile Modal if selected */}
      {selectedOngDetails && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 md:p-8 shadow-2xl border border-[#e0e3e5] relative animate-in fade-in zoom-in duration-200">
            <button
              onClick={() => setSelectedOngDetails(null)}
              className="absolute top-4 right-4 text-[#72787f] hover:text-[#191c1e] p-1.5 rounded-full hover:bg-[#e0e3e5]"
            >
              <span className="material-symbols-outlined">close</span>
            </button>

            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 rounded-xl overflow-hidden bg-[#e0e3e5] shrink-0">
                <img
                  src={selectedOngDetails.image}
                  alt={selectedOngDetails.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h2 className="font-['Plus_Jakarta_Sans'] text-2xl font-bold text-[#074469]">
                  {selectedOngDetails.name}
                </h2>
                <p className="font-['Be_Vietnam_Pro'] text-sm text-[#41474e] flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm text-[#72787f]">location_on</span>
                  {selectedOngDetails.city}, {selectedOngDetails.state} • {selectedOngDetails.phone}
                </p>
              </div>
            </div>

            <p className="font-['Be_Vietnam_Pro'] text-sm text-[#41474e] mb-6 leading-relaxed bg-[#f7f9fb] p-4 rounded-xl border border-[#e0e3e5]">
              {selectedOngDetails.description}
            </p>

            <h3 className="font-['Plus_Jakarta_Sans'] text-lg font-bold text-[#074469] mb-3">
              Animais sob tutela desta ONG:
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-56 overflow-y-auto p-1">
              {pets
                .filter((p) => p.ongName.toLowerCase() === selectedOngDetails.name.toLowerCase() || p.ongId === selectedOngDetails.id)
                .map((pet) => (
                  <div
                    key={pet.id}
                    onClick={() => {
                      setSelectedOngDetails(null);
                      onSelectPet(pet);
                    }}
                    className="bg-[#f7f9fb] rounded-lg p-2 border border-[#e0e3e5] hover:border-[#074469] cursor-pointer text-left transition-colors flex items-center gap-2"
                  >
                    <img
                      src={pet.mainImage}
                      alt={pet.name}
                      className="w-10 h-10 rounded-md object-cover"
                    />
                    <div>
                      <p className="font-['Plus_Jakarta_Sans'] font-semibold text-xs text-[#191c1e]">
                        {pet.name}
                      </p>
                      <p className="font-['Be_Vietnam_Pro'] text-[11px] text-[#72787f]">
                        {pet.species} • {pet.age}
                      </p>
                    </div>
                  </div>
                ))}
            </div>

            <div className="mt-6 flex justify-end gap-3 border-t border-[#e0e3e5] pt-4">
              <button
                onClick={() => {
                  setSelectedOngDetails(null);
                  onOpenContactOng(selectedOngDetails);
                }}
                className="bg-[#074469] text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-[#2a5c82] transition-colors"
              >
                Entrar em Contato com a ONG
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};
