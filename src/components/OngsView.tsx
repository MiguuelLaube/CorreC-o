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
    <main className="flex-grow pt-6 sm:pt-10 pb-20 px-4 sm:px-6 md:px-12 lg:px-16 max-w-7xl mx-auto w-full font-['Plus_Jakarta_Sans']">
      {/* Hero / Search Section */}
      <section className="mb-10 sm:mb-12 text-left">
        <div className="flex items-center gap-2 mb-2.5">
          <span className="bg-[#074469] dark:bg-[#5BE29D]/20 text-[#a0efd6] dark:text-[#5BE29D] border border-transparent dark:border-[#5BE29D]/40 text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full shadow-2xs">
            Rede MatchPet
          </span>
          <span className="text-xs text-[#64748b] dark:text-[#94a3b8] font-semibold">Instituições Verificadas</span>
        </div>
        <h1 className="font-['Plus_Jakarta_Sans'] text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#074469] dark:text-white mb-3 tracking-tight">
          ONGs & Protetores Parceiros
        </h1>
        <p className="font-['Inter'] text-sm sm:text-base md:text-lg text-[#475569] dark:text-[#cbd5e1] mb-6 max-w-2xl leading-relaxed">
          Conheça as instituições credenciadas no MatchPet. Veja o perfil público de cada ONG com seus dados, CNPJ e todos os animais disponíveis para adoção sob sua tutela.
        </p>

        <div className="bg-white dark:bg-[#101b26] p-2 sm:p-2.5 rounded-2xl shadow-xs flex items-center gap-3 border border-[#cbd5e1] dark:border-[#1e2c3c] focus-within:border-[#074469] dark:focus-within:border-[#5BE29D] transition-all max-w-xl min-h-[48px]">
          <span className="material-symbols-outlined text-[#64748b] dark:text-[#94a3b8] ml-2">search</span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar por nome, cidade ou CNPJ da ONG..."
            className="w-full bg-transparent border-none focus:ring-0 text-[#0f172a] dark:text-[#f1f5f9] font-['Inter'] text-xs sm:text-sm placeholder-[#64748b] dark:placeholder-[#94a3b8] p-0 outline-none"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="text-xs text-[#64748b] dark:text-[#94a3b8] hover:text-[#0f172a] dark:hover:text-white px-1.5 font-bold cursor-pointer"
            >
              Limpar
            </button>
          )}
          <button
            onClick={() => {}}
            className="bg-[#074469] dark:bg-[#5BE29D] text-white dark:text-[#063e2e] p-2.5 rounded-xl hover:bg-[#2a5c82] dark:hover:bg-[#48cf8b] transition-colors cursor-pointer flex items-center justify-center shrink-0 shadow-2xs"
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
              className="bg-white dark:bg-[#121d28] rounded-3xl shadow-xs hover:shadow-lg hover:-translate-y-1 transition-all duration-300 border border-[#e2e8f0] dark:border-[#1e2c3c] overflow-hidden flex flex-col justify-between text-left"
            >
              <div>
                <div className="h-48 w-full bg-[#e2e8f0] dark:bg-[#1a2838] relative overflow-hidden group">
                  <img
                    src={ong.image}
                    alt={ong.name}
                    className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute top-3 right-3 bg-white/95 dark:bg-[#0c1520]/95 backdrop-blur-xs rounded-full px-3 py-1 text-xs font-bold text-[#074469] dark:text-[#5BE29D] shadow-xs border border-[#e2e8f0] dark:border-[#1e2c3c]">
                    {ongPets.length} pets cadastrados
                  </div>
                </div>

                <div className="p-5 sm:p-6">
                  <div className="flex items-center gap-1.5 text-[11px] font-mono text-[#64748b] dark:text-[#94a3b8] mb-1.5 font-semibold">
                    <span className="material-symbols-outlined text-xs text-[#126b57] dark:text-[#5BE29D]">verified</span>
                    <span>CNPJ: {ong.cnpj || '12.345.678/0001-90'}</span>
                  </div>

                  <h3 className="font-['Plus_Jakarta_Sans'] text-xl sm:text-2xl font-bold text-[#0f172a] dark:text-white mb-1.5">
                    {ong.name}
                  </h3>

                  <p className="font-['Inter'] text-xs sm:text-sm text-[#475569] dark:text-[#cbd5e1] flex items-center gap-1 mb-3 font-medium">
                    <span className="material-symbols-outlined text-[#64748b] dark:text-[#94a3b8] text-base">location_on</span>
                    {ong.city}, {ong.state}
                  </p>

                  <p className="font-['Inter'] text-xs sm:text-sm text-[#64748b] dark:text-[#94a3b8] line-clamp-2 leading-relaxed mb-4">
                    {ong.description}
                  </p>
                </div>
              </div>

              <div className="p-5 sm:p-6 pt-0 border-t border-[#e2e8f0] dark:border-[#1e2c3c] mt-auto flex items-center justify-between">
                <p className="font-['Inter'] text-xs text-[#074469] dark:text-[#5BE29D] font-bold flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-base">call</span>
                  <span>{ong.phone}</span>
                </p>
                <button
                  onClick={() => setSelectedOngDetails(ong)}
                  className="bg-[#074469] dark:bg-[#5BE29D] hover:bg-[#2a5c82] dark:hover:bg-[#48cf8b] text-white dark:text-[#063e2e] font-bold text-xs px-4 py-2.5 rounded-xl transition-all cursor-pointer shadow-2xs min-h-[38px]"
                >
                  Ver Perfil & Pets
                </button>
              </div>
            </article>
          );
        })}

        {/* Card CTA: Indicar ONG */}
        <article className="bg-[#f1f5f9] dark:bg-[#101b26] rounded-3xl border-2 border-dashed border-[#cbd5e1] dark:border-[#2b3e52] flex flex-col items-center justify-center p-8 text-center min-h-[350px]">
          <div className="bg-[#074469]/10 dark:bg-[#5BE29D]/15 p-4 rounded-2xl mb-4 text-[#074469] dark:text-[#5BE29D]">
            <span className="material-symbols-outlined text-4xl">add_business</span>
          </div>
          <h3 className="font-['Plus_Jakarta_Sans'] text-xl font-bold text-[#0f172a] dark:text-white mb-2">
            Representa uma ONG?
          </h3>
          <p className="font-['Inter'] text-xs sm:text-sm text-[#475569] dark:text-[#cbd5e1] mb-6 max-w-[260px] leading-relaxed">
            Entre em contato para solicitar o cadastro da sua instituição e receber seu login exclusivo.
          </p>
          <button
            onClick={onOpenIndicarOng}
            className="bg-[#074469] dark:bg-[#5BE29D] text-white dark:text-[#063e2e] font-bold text-xs sm:text-sm px-5 py-3 rounded-xl hover:bg-[#2a5c82] dark:hover:bg-[#48cf8b] transition-all shadow-xs cursor-pointer min-h-[44px]"
          >
            Indicar ou Solicitar Cadastro
          </button>
        </article>
      </section>

      {/* PERFIL PÚBLICO DA ONG COM PETS VINCULADOS */}
      {selectedOngDetails && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-[#121d28] rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-[#e2e8f0] dark:border-[#1e2c3c] relative animate-in fade-in zoom-in duration-200 max-h-[90vh] overflow-y-auto text-left">
            <button
              onClick={() => setSelectedOngDetails(null)}
              className="absolute top-5 right-5 text-[#64748b] dark:text-[#94a3b8] hover:text-[#0f172a] dark:hover:text-white p-2 rounded-full hover:bg-[#f1f5f9] dark:hover:bg-[#162230] cursor-pointer transition-colors"
            >
              <span className="material-symbols-outlined text-xl">close</span>
            </button>

            <div className="flex items-center gap-4 mb-4">
              <img
                src={selectedOngDetails.image}
                alt={selectedOngDetails.name}
                className="w-18 h-18 rounded-2xl object-cover border border-[#e2e8f0] dark:border-[#1e2c3c] shadow-xs shrink-0"
              />
              <div>
                <div className="flex items-center gap-1.5 text-xs text-[#126b57] dark:text-[#5BE29D] font-bold">
                  <span className="material-symbols-outlined text-sm">verified</span>
                  <span>ONG Credenciada MatchPet</span>
                </div>
                <h2 className="font-['Plus_Jakarta_Sans'] text-2xl sm:text-3xl font-bold text-[#074469] dark:text-white">
                  {selectedOngDetails.name}
                </h2>
                <p className="font-['Inter'] text-xs font-mono text-[#64748b] dark:text-[#94a3b8]">
                  CNPJ: {selectedOngDetails.cnpj || '12.345.678/0001-90'}
                </p>
              </div>
            </div>

            <div className="bg-[#f8fafc] dark:bg-[#101b26] p-4 sm:p-5 rounded-2xl border border-[#e2e8f0] dark:border-[#1e2c3c] space-y-2 mb-6 font-['Inter'] text-xs sm:text-sm text-[#475569] dark:text-[#cbd5e1]">
              <p className="leading-relaxed text-[#0f172a] dark:text-white">{selectedOngDetails.description}</p>
              <div className="pt-3 border-t border-[#e2e8f0] dark:border-[#1e2c3c] flex flex-wrap gap-4 text-xs text-[#64748b] dark:text-[#94a3b8] font-medium">
                <span>📍 {selectedOngDetails.address || `${selectedOngDetails.city} - ${selectedOngDetails.state}`}</span>
                <span>📞 {selectedOngDetails.phone}</span>
                <span>✉️ {selectedOngDetails.email}</span>
              </div>
            </div>

            {/* Lista dos Pets desta ONG */}
            <h3 className="font-['Plus_Jakarta_Sans'] text-base sm:text-lg font-bold text-[#074469] dark:text-[#5BE29D] mb-3 flex items-center justify-between">
              <span>Pets cadastrados por esta ONG</span>
              <span className="text-xs font-['Inter'] text-[#64748b] dark:text-[#94a3b8] font-normal">
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
                    className="bg-[#f8fafc] dark:bg-[#162230] rounded-2xl p-2.5 border border-[#e2e8f0] dark:border-[#2b3e52] hover:border-[#074469] dark:hover:border-[#5BE29D] cursor-pointer text-left transition-all hover:shadow-2xs flex items-center gap-2.5 group"
                  >
                    <img
                      src={pet.mainImage}
                      alt={pet.name}
                      className="w-12 h-12 rounded-xl object-cover shrink-0 group-hover:scale-105 transition-transform"
                    />
                    <div className="min-w-0">
                      <p className="font-['Plus_Jakarta_Sans'] font-bold text-xs text-[#0f172a] dark:text-white group-hover:text-[#074469] dark:group-hover:text-[#5BE29D] truncate">
                        {pet.name}
                      </p>
                      <p className="font-['Inter'] text-[11px] text-[#64748b] dark:text-[#94a3b8]">
                        Porte {pet.size} • {pet.age}
                      </p>
                    </div>
                  </div>
                ))}
            </div>

            <div className="mt-6 flex justify-end gap-3 border-t border-[#e2e8f0] dark:border-[#1e2c3c] pt-4 font-['Plus_Jakarta_Sans'] text-sm">
              <button
                onClick={() => {
                  setSelectedOngDetails(null);
                  onOpenContactOng(selectedOngDetails);
                }}
                className="bg-[#074469] dark:bg-[#5BE29D] hover:bg-[#2a5c82] dark:hover:bg-[#48cf8b] text-white dark:text-[#063e2e] px-6 py-3 rounded-xl font-bold transition-all cursor-pointer shadow-xs min-h-[44px]"
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
