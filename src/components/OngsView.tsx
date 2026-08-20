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
        ong.state.toLowerCase().includes(q) ||
        (ong.cnpj && ong.cnpj.includes(q))
    );
  }, [ongs, searchQuery]);

  return (
    <main className="flex-grow pt-8 pb-20 px-4 md:px-16 max-w-7xl mx-auto w-full">
      {/* Hero / Search Section */}
      <section className="mb-12">
        <div className="flex items-center gap-2 mb-2">
          <span className="bg-[#074469] text-[#a0efd6] text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full">
            Rede MatchPet
          </span>
          <span className="text-xs text-[#72787f]">Instituições Verificadas</span>
        </div>
        <h1 className="font-['Plus_Jakarta_Sans'] text-3xl sm:text-4xl md:text-5xl font-bold text-[#074469] mb-4">
          ONGs & Protetores Parceiros
        </h1>
        <p className="font-['Be_Vietnam_Pro'] text-base sm:text-lg text-[#41474e] mb-8 max-w-2xl leading-relaxed">
          Conheça as instituições credenciadas no MatchPet. Veja o perfil público de cada ONG com seus dados, CNPJ e todos os animais disponíveis para adoção sob sua tutela.
        </p>

        <div className="bg-white p-2.5 rounded-2xl shadow-sm flex items-center gap-3 border border-[#c1c7cf]/40 focus-within:border-[#074469] transition-all max-w-xl">
          <span className="material-symbols-outlined text-[#72787f] ml-2">search</span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar por nome, cidade ou CNPJ da ONG..."
            className="w-full bg-transparent border-none focus:ring-0 text-[#191c1e] font-['Be_Vietnam_Pro'] text-sm sm:text-base placeholder-[#72787f] p-0 outline-none"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="text-xs text-[#72787f] hover:text-[#191c1e] px-1 cursor-pointer"
            >
              Limpar
            </button>
          )}
          <button
            onClick={() => {}}
            className="bg-[#074469] text-white p-2.5 rounded-xl hover:bg-[#2a5c82] transition-colors cursor-pointer flex items-center justify-center shrink-0"
            aria-label="Pesquisar"
          >
            <span className="material-symbols-outlined text-lg">arrow_forward</span>
          </button>
        </div>
      </section>

      {/* Grid de ONGs */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredOngs.map((ong) => {
          const ongPets = pets.filter(
            (p) => p.ongId === ong.id || p.ongName.toLowerCase() === ong.name.toLowerCase()
          );

          return (
            <article
              key={ong.id}
              className="bg-white rounded-3xl shadow-xs hover:shadow-md transition-all duration-300 border border-[#e0e3e5] overflow-hidden flex flex-col justify-between"
            >
              <div>
                <div className="h-48 w-full bg-[#e0e3e5] relative overflow-hidden group">
                  <img
                    src={ong.image}
                    alt={ong.name}
                    className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-xs rounded-full px-3 py-1 text-xs font-bold text-[#074469] shadow-xs">
                    {ongPets.length} pets cadastrados
                  </div>
                </div>

                <div className="p-6">
                  <div className="flex items-center gap-2 text-[11px] font-mono text-[#72787f] mb-1">
                    <span className="material-symbols-outlined text-xs">verified</span>
                    <span>CNPJ: {ong.cnpj || '12.345.678/0001-90'}</span>
                  </div>

                  <h3 className="font-['Plus_Jakarta_Sans'] text-2xl font-bold text-[#191c1e] mb-1">
                    {ong.name}
                  </h3>

                  <p className="font-['Be_Vietnam_Pro'] text-xs sm:text-sm text-[#41474e] flex items-center gap-1 mb-3">
                    <span className="material-symbols-outlined text-[#72787f] text-base">location_on</span>
                    {ong.city}, {ong.state}
                  </p>

                  <p className="font-['Be_Vietnam_Pro'] text-xs text-[#72787f] line-clamp-2 leading-relaxed mb-4">
                    {ong.description}
                  </p>
                </div>
              </div>

              <div className="p-6 pt-0 border-t border-[#e0e3e5]/60 mt-auto flex items-center justify-between">
                <p className="font-['Be_Vietnam_Pro'] text-xs text-[#074469] font-bold flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm">call</span>
                  {ong.phone}
                </p>
                <button
                  onClick={() => setSelectedOngDetails(ong)}
                  className="bg-[#074469] hover:bg-[#2a5c82] text-white font-['Be_Vietnam_Pro'] text-xs font-bold px-4 py-2 rounded-xl transition-colors cursor-pointer shadow-2xs"
                >
                  Ver Perfil & Pets
                </button>
              </div>
            </article>
          );
        })}

        {/* Card CTA: Indicar ONG */}
        <article className="bg-[#f2f4f6] rounded-3xl border border-dashed border-[#c1c7cf] flex flex-col items-center justify-center p-8 text-center min-h-[350px]">
          <div className="bg-[#074469]/10 p-4 rounded-2xl mb-4 text-[#074469]">
            <span className="material-symbols-outlined text-4xl">add_business</span>
          </div>
          <h3 className="font-['Plus_Jakarta_Sans'] text-xl font-bold text-[#191c1e] mb-2">
            Representa uma ONG?
          </h3>
          <p className="font-['Be_Vietnam_Pro'] text-xs text-[#41474e] mb-6 max-w-[260px] leading-relaxed">
            Entre em contato para solicitar o cadastro da sua instituição e receber seu login exclusivo.
          </p>
          <button
            onClick={onOpenIndicarOng}
            className="bg-[#074469] text-white font-['Be_Vietnam_Pro'] text-xs font-bold px-5 py-2.5 rounded-xl hover:bg-[#2a5c82] transition-colors shadow-xs cursor-pointer"
          >
            Indicar ou Solicitar Cadastro
          </button>
        </article>
      </section>

      {/* PERFIL PÚBLICO DA ONG COM PETS VINCULADOS */}
      {selectedOngDetails && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 md:p-8 shadow-2xl border border-[#e0e3e5] relative animate-in fade-in zoom-in duration-200 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setSelectedOngDetails(null)}
              className="absolute top-5 right-5 text-[#72787f] hover:text-[#191c1e] p-1.5 rounded-full hover:bg-[#e0e3e5] cursor-pointer"
            >
              <span className="material-symbols-outlined">close</span>
            </button>

            <div className="flex items-center gap-4 mb-4">
              <img
                src={selectedOngDetails.image}
                alt={selectedOngDetails.name}
                className="w-18 h-18 rounded-2xl object-cover border border-[#e0e3e5] shadow-xs shrink-0"
              />
              <div>
                <div className="flex items-center gap-1.5 text-xs text-[#126b57] font-bold">
                  <span className="material-symbols-outlined text-sm">verified</span>
                  <span>ONG Credenciada MatchPet</span>
                </div>
                <h2 className="font-['Plus_Jakarta_Sans'] text-2xl md:text-3xl font-bold text-[#074469]">
                  {selectedOngDetails.name}
                </h2>
                <p className="font-['Be_Vietnam_Pro'] text-xs font-mono text-[#72787f]">
                  CNPJ: {selectedOngDetails.cnpj || '12.345.678/0001-90'}
                </p>
              </div>
            </div>

            <div className="bg-[#f7f9fb] p-4 rounded-2xl border border-[#e0e3e5] space-y-2 mb-6 font-['Be_Vietnam_Pro'] text-xs sm:text-sm text-[#41474e]">
              <p className="leading-relaxed text-[#191c1e]">{selectedOngDetails.description}</p>
              <div className="pt-2 border-t border-[#e0e3e5] flex flex-wrap gap-4 text-xs text-[#72787f]">
                <span>📍 {selectedOngDetails.address || `${selectedOngDetails.city} - ${selectedOngDetails.state}`}</span>
                <span>📞 {selectedOngDetails.phone}</span>
                <span>✉️ {selectedOngDetails.email}</span>
              </div>
            </div>

            {/* Lista dos Pets desta ONG */}
            <h3 className="font-['Plus_Jakarta_Sans'] text-lg font-bold text-[#074469] mb-3 flex items-center justify-between">
              <span>Pets cadastrados por esta ONG</span>
              <span className="text-xs font-['Be_Vietnam_Pro'] text-[#72787f] font-normal">
                {pets.filter((p) => p.ongId === selectedOngDetails.id || p.ongName.toLowerCase() === selectedOngDetails.name.toLowerCase()).length} disponíveis
              </span>
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-64 overflow-y-auto p-1">
              {pets
                .filter(
                  (p) =>
                    p.ongId === selectedOngDetails.id ||
                    p.ongName.toLowerCase() === selectedOngDetails.name.toLowerCase()
                )
                .map((pet) => (
                  <div
                    key={pet.id}
                    onClick={() => {
                      setSelectedOngDetails(null);
                      onSelectPet(pet);
                    }}
                    className="bg-[#f7f9fb] rounded-2xl p-2.5 border border-[#e0e3e5] hover:border-[#074469] cursor-pointer text-left transition-all hover:shadow-2xs flex items-center gap-2.5 group"
                  >
                    <img
                      src={pet.mainImage}
                      alt={pet.name}
                      className="w-12 h-12 rounded-xl object-cover shrink-0 group-hover:scale-105 transition-transform"
                    />
                    <div>
                      <p className="font-['Plus_Jakarta_Sans'] font-bold text-xs text-[#191c1e] group-hover:text-[#074469]">
                        {pet.name}
                      </p>
                      <p className="font-['Be_Vietnam_Pro'] text-[11px] text-[#72787f]">
                        Porte {pet.size} • {pet.age}
                      </p>
                    </div>
                  </div>
                ))}
            </div>

            <div className="mt-6 flex justify-end gap-3 border-t border-[#e0e3e5] pt-4 font-['Be_Vietnam_Pro'] text-sm">
              <button
                onClick={() => {
                  setSelectedOngDetails(null);
                  onOpenContactOng(selectedOngDetails);
                }}
                className="bg-[#074469] hover:bg-[#2a5c82] text-white px-6 py-2.5 rounded-xl font-bold transition-colors cursor-pointer shadow-xs"
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
