import React, { useState, useMemo } from 'react';
import { Pet, Species, Size, Gender, AgeGroup, Partner } from '../types';
import { PARTNERS_LIST } from '../data/initialData';
import { PartnerCarousel } from './PartnerCarousel';

interface AdoptionViewProps {
  pets: Pet[];
  partners?: Partner[];
  onSelectPet: (pet: Pet) => void;
  onToggleFavorite: (petId: string) => void;
  onQueroAjudar: () => void;
  onNavigateToMyAdoptions?: () => void;
  activeAdoptionsCount?: number;
}

export const AdoptionView: React.FC<AdoptionViewProps> = ({
  pets,
  partners = PARTNERS_LIST,
  onSelectPet,
  onToggleFavorite,
  onQueroAjudar,
  onNavigateToMyAdoptions,
  activeAdoptionsCount = 0
}) => {
  const [selectedSpecies, setSelectedSpecies] = useState<string>('all');
  const [selectedSize, setSelectedSize] = useState<string>('all');
  const [selectedGender, setSelectedGender] = useState<string>('all');
  const [selectedAgeGroup, setSelectedAgeGroup] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [visibleCount, setVisibleCount] = useState<number>(8);

  const filteredPets = useMemo(() => {
    return pets.filter((pet) => {
      // Species filter
      if (selectedSpecies !== 'all') {
        if (selectedSpecies === 'Cães' && pet.species !== 'Cachorro') return false;
        if (selectedSpecies === 'Gatos' && pet.species !== 'Gato') return false;
      }
      // Size filter
      if (selectedSize !== 'all' && !pet.size.toLowerCase().includes(selectedSize.toLowerCase())) {
        return false;
      }
      // Gender filter
      if (selectedGender !== 'all' && pet.gender !== selectedGender) {
        return false;
      }
      // Age group filter
      if (selectedAgeGroup !== 'all' && pet.ageGroup !== selectedAgeGroup) {
        return false;
      }
      // Search query (name, breed, city)
      if (searchQuery.trim() !== '') {
        const query = searchQuery.toLowerCase();
        const matchesName = pet.name.toLowerCase().includes(query);
        const matchesBreed = pet.breed.toLowerCase().includes(query);
        const matchesCity = pet.city.toLowerCase().includes(query);
        if (!matchesName && !matchesBreed && !matchesCity) return false;
      }
      return true;
    });
  }, [pets, selectedSpecies, selectedSize, selectedGender, selectedAgeGroup, searchQuery]);

  const scrollToPets = () => {
    const el = document.getElementById('pets-grid-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const hasActiveFilters =
    selectedSpecies !== 'all' ||
    selectedSize !== 'all' ||
    selectedGender !== 'all' ||
    selectedAgeGroup !== 'all' ||
    searchQuery !== '';

  const clearFilters = () => {
    setSelectedSpecies('all');
    setSelectedSize('all');
    setSelectedGender('all');
    setSelectedAgeGroup('all');
    setSearchQuery('');
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Banner Superior se houver Adoções em Andamento */}
      {activeAdoptionsCount > 0 && onNavigateToMyAdoptions && (
        <div className="bg-[#074469] text-white py-3 px-4 sm:px-6 md:px-12 lg:px-16 text-xs sm:text-sm font-['Inter'] shadow-xs">
          <div className="max-w-7xl mx-auto w-full flex flex-col sm:flex-row items-center justify-between gap-2.5">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#a0efd6] text-lg">assignment</span>
              <span>
                Você possui <strong>{activeAdoptionsCount} processo(s) de adoção</strong> em andamento no MatchPet.
              </span>
            </div>
            <button
              onClick={onNavigateToMyAdoptions}
              className="bg-[#a0efd6] hover:bg-white text-[#074469] font-bold text-xs px-4 py-1.5 rounded-xl transition-colors cursor-pointer shrink-0 shadow-2xs"
            >
              Acompanhar Minhas Adoções →
            </button>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section className="relative w-full overflow-hidden bg-[#f1f5f9] dark:bg-[#0b141e] py-10 sm:py-14 md:py-16 px-4 sm:px-6 md:px-12 lg:px-16 border-b border-[#e2e8f0] dark:border-[#1e2c3c] transition-colors">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
          <div className="space-y-5 sm:space-y-6 z-10 text-left">
            <h1 className="font-['Plus_Jakarta_Sans'] text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#074469] dark:text-white leading-[1.15] tracking-tight">
              Encontre seu novo <span className="text-[#126b57] dark:text-[#5BE29D]">melhor amigo</span>
            </h1>
            <p className="font-['Inter'] text-sm sm:text-base md:text-lg text-[#475569] dark:text-[#cbd5e1] leading-relaxed max-w-xl">
              Conectamos você a milhares de animais resgatados que esperam por um lar cheio de amor. Adote, mude uma vida e preencha a sua com alegria.
            </p>
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <button
                onClick={scrollToPets}
                className="bg-[#074469] dark:bg-[#5BE29D] text-white dark:text-[#063e2e] font-['Plus_Jakarta_Sans'] font-bold text-sm px-6 py-3.5 rounded-2xl shadow-sm hover:-translate-y-0.5 hover:bg-[#2a5c82] dark:hover:bg-[#48cf8b] active:translate-y-0 transition-all duration-200 cursor-pointer min-h-[44px] flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-lg">pets</span>
                <span>Ver Animais Disponíveis</span>
              </button>
              <button
                onClick={onQueroAjudar}
                className="bg-white dark:bg-[#132822] text-[#126b57] dark:text-[#5BE29D] border border-[#126b57]/30 dark:border-[#5BE29D]/40 font-['Plus_Jakarta_Sans'] font-bold text-sm px-6 py-3.5 rounded-2xl hover:-translate-y-0.5 hover:bg-[#f8fafc] dark:hover:bg-[#1c3830] active:translate-y-0 transition-all duration-200 flex items-center gap-2 cursor-pointer shadow-xs min-h-[44px]"
              >
                <span className="material-symbols-outlined text-xl">volunteer_activism</span>
                <span>Quero Ajudar</span>
              </button>
            </div>
          </div>

          <div className="relative h-64 sm:h-80 md:h-[380px] rounded-3xl overflow-hidden shadow-md border border-[#e2e8f0] dark:border-[#1e2c3c]">
            <img
              className="w-full h-full object-cover"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuB6Q4m-DHht8uwBTT4C6gyLufMI8cNDqDxok9nQ_h1gtlYmmptqT2vb7Y-8i5IypqOR5EXqIWlRbTt9K_UF51K1GPd3V4za-qIP5x6PcVsHpEvB7nReLoXkTkHwOhB22IhbToEigLabUK0LMEj2C0uAuEYq2J104sM8EhnkIq8XFsVNU7d7sc_MXpMAHFwnJEEzGpvbZy38BAWdx4d2FJDfUPX6vvsia02vatHslz2vJEZMsLlPh1lNzQ"
              alt="Cachorrinho filhote e gatinho juntos em sala de estar aconchegante"
              loading="eager"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent pointer-events-none" />
          </div>
        </div>
      </section>

      {/* Dynamic Filters Section */}
      <section id="pets-grid-section" className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 lg:px-16 pt-8 pb-6 w-full">
        <div className="bg-white dark:bg-[#101b26] rounded-3xl p-4 sm:p-5 shadow-xs border border-[#e2e8f0] dark:border-[#1e2c3c] flex flex-col lg:flex-row lg:items-center justify-between gap-4 transition-colors">
          <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
            <span className="font-['Plus_Jakarta_Sans'] font-bold text-sm text-[#074469] dark:text-[#5BE29D] flex items-center gap-1.5 whitespace-nowrap">
              <span className="material-symbols-outlined text-lg">filter_list</span>
              Filtros:
            </span>

            {/* Espécie */}
            <select
              value={selectedSpecies}
              onChange={(e) => setSelectedSpecies(e.target.value)}
              className="font-['Inter'] text-xs sm:text-sm bg-[#f8fafc] dark:bg-[#162230] border border-[#cbd5e1] dark:border-[#2b3e52] rounded-xl px-3 py-2 sm:py-2.5 text-[#0f172a] dark:text-[#f1f5f9] focus:border-[#074469] dark:focus:border-[#5BE29D] outline-none cursor-pointer font-medium shadow-2xs"
            >
              <option value="all">Espécie: Todas</option>
              <option value="Cães">Cães</option>
              <option value="Gatos">Gatos</option>
            </select>

            {/* Porte */}
            <select
              value={selectedSize}
              onChange={(e) => setSelectedSize(e.target.value)}
              className="font-['Inter'] text-xs sm:text-sm bg-[#f8fafc] dark:bg-[#162230] border border-[#cbd5e1] dark:border-[#2b3e52] rounded-xl px-3 py-2 sm:py-2.5 text-[#0f172a] dark:text-[#f1f5f9] focus:border-[#074469] dark:focus:border-[#5BE29D] outline-none cursor-pointer font-medium shadow-2xs"
            >
              <option value="all">Porte: Todos</option>
              <option value="Pequeno">Pequeno</option>
              <option value="Médio">Médio</option>
              <option value="Grande">Grande</option>
            </select>

            {/* Gênero */}
            <select
              value={selectedGender}
              onChange={(e) => setSelectedGender(e.target.value)}
              className="font-['Inter'] text-xs sm:text-sm bg-[#f8fafc] dark:bg-[#162230] border border-[#cbd5e1] dark:border-[#2b3e52] rounded-xl px-3 py-2 sm:py-2.5 text-[#0f172a] dark:text-[#f1f5f9] focus:border-[#074469] dark:focus:border-[#5BE29D] outline-none cursor-pointer font-medium shadow-2xs"
            >
              <option value="all">Gênero: Todos</option>
              <option value="Macho">Macho</option>
              <option value="Fêmea">Fêmea</option>
            </select>

            {/* Idade */}
            <select
              value={selectedAgeGroup}
              onChange={(e) => setSelectedAgeGroup(e.target.value)}
              className="font-['Inter'] text-xs sm:text-sm bg-[#f8fafc] dark:bg-[#162230] border border-[#cbd5e1] dark:border-[#2b3e52] rounded-xl px-3 py-2 sm:py-2.5 text-[#0f172a] dark:text-[#f1f5f9] focus:border-[#074469] dark:focus:border-[#5BE29D] outline-none cursor-pointer font-medium shadow-2xs"
            >
              <option value="all">Idade: Todas</option>
              <option value="Filhote">Filhote</option>
              <option value="Adulto">Adulto</option>
              <option value="Idoso">Idoso</option>
            </select>

            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="text-xs text-[#ba1a1a] dark:text-[#f87171] hover:underline font-bold px-2.5 py-1.5 flex items-center gap-1 cursor-pointer rounded-lg hover:bg-[#ffdad6]/40 transition-colors"
              >
                <span className="material-symbols-outlined text-sm">close</span>
                Limpar filtros
              </button>
            )}
          </div>

          {/* Search box */}
          <div className="relative min-w-[200px] w-full lg:max-w-xs">
            <span className="material-symbols-outlined absolute left-3 top-2.5 text-[#64748b] dark:text-[#94a3b8] text-sm pointer-events-none">
              search
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar por nome, raça..."
              className="w-full font-['Inter'] text-xs sm:text-sm bg-[#f8fafc] dark:bg-[#162230] border border-[#cbd5e1] dark:border-[#2b3e52] rounded-xl pl-9 pr-4 py-2 sm:py-2.5 text-[#0f172a] dark:text-[#f1f5f9] placeholder-[#64748b] dark:placeholder-[#94a3b8] focus:border-[#074469] dark:focus:border-[#5BE29D] outline-none shadow-2xs"
            />
          </div>
        </div>
      </section>

      {/* Pet Cards Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 lg:px-16 pb-16 w-full">
        {filteredPets.length === 0 ? (
          <div className="bg-white dark:bg-[#101b26] rounded-3xl p-10 sm:p-14 text-center border border-[#e2e8f0] dark:border-[#1e2c3c] my-6 shadow-xs">
            <div className="w-16 h-16 bg-[#ffdbc9] dark:bg-[#ffdbc9]/20 rounded-2xl flex items-center justify-center mx-auto mb-4 text-[#914100] dark:text-[#fdba74]">
              <span className="material-symbols-outlined text-3xl">pets</span>
            </div>
            <h3 className="font-['Plus_Jakarta_Sans'] text-xl font-bold text-[#074469] dark:text-white mb-2">
              Nenhum pet encontrado com os filtros selecionados
            </h3>
            <p className="font-['Inter'] text-[#475569] dark:text-[#cbd5e1] text-sm mb-6 max-w-md mx-auto leading-relaxed">
              Tente redefinir os filtros para visualizar outros animaizinhos incríveis disponíveis para adoção.
            </p>
            <button
              onClick={clearFilters}
              className="bg-[#074469] dark:bg-[#5BE29D] text-white dark:text-[#063e2e] px-6 py-3 rounded-xl text-sm font-bold hover:bg-[#2a5c82] dark:hover:bg-[#48cf8b] transition-colors cursor-pointer shadow-xs"
            >
              Ver todos os animais
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredPets.slice(0, visibleCount).map((pet) => (
              <article
                key={pet.id}
                onClick={() => onSelectPet(pet)}
                className="bg-white dark:bg-[#121d28] rounded-3xl overflow-hidden shadow-xs hover:shadow-lg hover:-translate-y-1 transition-all duration-300 border border-[#e2e8f0] dark:border-[#1e2c3c] group relative flex flex-col cursor-pointer text-left"
              >
                {/* Favorite Button */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleFavorite(pet.id);
                  }}
                  className="absolute top-3 right-3 z-10 w-9 h-9 rounded-full bg-white/90 dark:bg-[#0c1520]/90 backdrop-blur-xs flex items-center justify-center text-[#475569] hover:text-[#ba1a1a] hover:scale-110 active:scale-95 transition-all shadow-sm cursor-pointer border border-[#e2e8f0] dark:border-[#1e2c3c]"
                  aria-label={`Favoritar ${pet.name}`}
                >
                  <span
                    className={`material-symbols-outlined text-xl transition-colors ${
                      pet.favorite ? 'material-symbols-fill text-[#ba1a1a]' : 'text-[#64748b] dark:text-[#94a3b8] hover:text-[#ba1a1a]'
                    }`}
                  >
                    favorite
                  </span>
                </button>

                {/* Pet Image */}
                <div className="h-56 bg-[#e2e8f0] dark:bg-[#1a2838] relative overflow-hidden">
                  <img
                    src={pet.mainImage}
                    alt={`Foto de ${pet.name}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  {pet.status === 'Em Processo' && (
                    <span className="absolute bottom-2.5 left-2.5 bg-white/90 dark:bg-[#0c1520]/90 text-[#475569] dark:text-[#cbd5e1] text-[11px] font-bold px-2.5 py-0.5 rounded-lg backdrop-blur-xs border border-[#e2e8f0] dark:border-[#1e2c3c]">
                      Em Processo
                    </span>
                  )}
                </div>

                {/* Pet Information */}
                <div className="p-4 sm:p-5 space-y-2 flex-grow flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <h3 className="font-['Plus_Jakarta_Sans'] text-lg sm:text-xl font-bold text-[#0f172a] dark:text-white group-hover:text-[#074469] dark:group-hover:text-[#5BE29D] transition-colors truncate">
                        {pet.name}
                      </h3>
                      <span
                        className="material-symbols-outlined text-[#074469] dark:text-[#5BE29D] text-xl shrink-0"
                        title={pet.gender}
                      >
                        {pet.gender === 'Macho' ? 'male' : 'female'}
                      </span>
                    </div>

                    <p className="font-['Inter'] text-xs sm:text-sm text-[#475569] dark:text-[#cbd5e1] flex items-center gap-1.5 mb-1 font-medium">
                      <span className="material-symbols-outlined text-sm text-[#64748b] dark:text-[#94a3b8]">cake</span>
                      <span>{pet.age}</span>
                    </p>

                    <p className="font-['Inter'] text-xs sm:text-sm text-[#475569] dark:text-[#cbd5e1] flex items-center gap-1.5 font-medium">
                      <span className="material-symbols-outlined text-sm text-[#64748b] dark:text-[#94a3b8]">location_on</span>
                      <span>{pet.city}, {pet.state}</span>
                    </p>
                  </div>

                  {/* Badges / Chips */}
                  <div className="pt-3 flex flex-wrap gap-1.5 border-t border-[#e2e8f0] dark:border-[#1e2c3c] mt-2 font-['Inter']">
                    <span className="text-[11px] font-bold bg-[#a0efd6]/50 dark:bg-[#5BE29D]/20 text-[#126b57] dark:text-[#5BE29D] border border-[#126b57]/20 dark:border-[#5BE29D]/40 px-2.5 py-0.5 rounded-full">
                      {pet.vaccination?.toLowerCase().includes('completa') || pet.vaccination?.toLowerCase() === 'vacinado' ? 'Vacinado' : pet.vaccination || 'Vacinado'}
                    </span>
                    <span className="text-[11px] font-semibold bg-[#f1f5f9] dark:bg-[#1a2838] text-[#475569] dark:text-[#cbd5e1] border border-[#e2e8f0] dark:border-[#2b3e52] px-2.5 py-0.5 rounded-full">
                      Porte {pet.size}
                    </span>
                    <span className="text-[11px] font-semibold bg-[#cde5ff]/40 dark:bg-[#074469]/30 text-[#074469] dark:text-[#a5d4ff] border border-[#074469]/20 px-2 py-0.5 rounded-full">
                      {pet.gender}
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* Ver Mais Animais Button */}
        {filteredPets.length > visibleCount && (
          <div className="mt-12 flex justify-center">
            <button
              onClick={() => setVisibleCount((prev) => prev + 8)}
              className="font-['Plus_Jakarta_Sans'] text-sm font-bold text-[#074469] dark:text-[#5BE29D] hover:text-white dark:hover:text-[#063e2e] bg-white dark:bg-[#162230] hover:bg-[#074469] dark:hover:bg-[#5BE29D] border-2 border-[#074469] dark:border-[#5BE29D] px-8 py-3.5 rounded-2xl shadow-xs transition-all cursor-pointer min-h-[48px] flex items-center gap-2"
            >
              <span>Ver Mais Animais ({filteredPets.length - visibleCount} restantes)</span>
              <span className="material-symbols-outlined text-lg">expand_more</span>
            </button>
          </div>
        )}
      </section>
    </div>
  );
};
