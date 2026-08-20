import React, { useState, useMemo } from 'react';
import { Pet, Species, Size, Gender, AgeGroup, Partner } from '../types';
import { PARTNERS_LIST } from '../data/initialData';

interface AdoptionViewProps {
  pets: Pet[];
  onSelectPet: (pet: Pet) => void;
  onToggleFavorite: (petId: string) => void;
  onQueroAjudar: () => void;
}

export const AdoptionView: React.FC<AdoptionViewProps> = ({
  pets,
  onSelectPet,
  onToggleFavorite,
  onQueroAjudar
}) => {
  const [selectedSpecies, setSelectedSpecies] = useState<string>('all');
  const [selectedSize, setSelectedSize] = useState<string>('all');
  const [selectedGender, setSelectedGender] = useState<string>('all');
  const [selectedAgeGroup, setSelectedAgeGroup] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [visibleCount, setVisibleCount] = useState<number>(8);
  const [activePartnerModal, setActivePartnerModal] = useState<Partner | null>(null);

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
      {/* Hero Section */}
      <section className="relative w-full overflow-hidden bg-[#f2f4f6] py-12 md:py-20 px-4 md:px-16 border-b border-[#e0e3e5]/60">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
          <div className="space-y-6 z-10">
            <h1 className="font-['Plus_Jakarta_Sans'] text-3xl sm:text-4xl md:text-5xl font-bold text-[#074469] leading-tight tracking-tight">
              Encontre seu novo melhor amigo
            </h1>
            <p className="font-['Be_Vietnam_Pro'] text-base sm:text-lg text-[#41474e] leading-relaxed max-w-xl">
              Conectamos você a milhares de animais resgatados que esperam por um lar cheio de amor. Adote, mude uma vida e preencha a sua com alegria.
            </p>
            <div className="flex flex-wrap gap-4 pt-2">
              <button
                onClick={scrollToPets}
                className="bg-[#074469] text-white font-['Be_Vietnam_Pro'] font-semibold text-sm px-6 py-3.5 rounded-lg shadow-sm hover:-translate-y-0.5 hover:bg-[#2a5c82] active:translate-y-0 transition-all duration-200 cursor-pointer"
              >
                Ver Animais Disponíveis
              </button>
              <button
                onClick={onQueroAjudar}
                className="bg-[#a0efd6] text-[#196f5b] font-['Be_Vietnam_Pro'] font-semibold text-sm px-6 py-3.5 rounded-lg hover:-translate-y-0.5 hover:bg-[#87d5bd] active:translate-y-0 transition-all duration-200 flex items-center gap-2 cursor-pointer shadow-sm"
              >
                <span className="material-symbols-outlined text-xl">volunteer_activism</span>
                <span>Quero Ajudar</span>
              </button>
            </div>
          </div>

          <div className="relative h-72 sm:h-80 md:h-[400px] rounded-2xl overflow-hidden shadow-lg border border-[#e0e3e5]">
            <img
              className="w-full h-full object-cover"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuB6Q4m-DHht8uwBTT4C6gyLufMI8cNDqDxok9nQ_h1gtlYmmptqT2vb7Y-8i5IypqOR5EXqIWlRbTt9K_UF51K1GPd3V4za-qIP5x6PcVsHpEvB7nReLoXkTkHwOhB22IhbToEigLabUK0LMEj2C0uAuEYq2J104sM8EhnkIq8XFsVNU7d7sc_MXpMAHFwnJEEzGpvbZy38BAWdx4d2FJDfUPX6vvsia02vatHslz2vJEZMsLlPh1lNzQ"
              alt="Cachorrinho filhote e gatinho juntos em sala de estar aconchegante"
              loading="eager"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />
          </div>
        </div>
      </section>

      {/* Dynamic Filters Section */}
      <section id="pets-grid-section" className="max-w-7xl mx-auto px-4 md:px-16 pt-10 pb-6 w-full">
        <div className="bg-white rounded-xl p-4 md:p-5 shadow-sm border border-[#e0e3e5] flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3">
            <span className="font-['Be_Vietnam_Pro'] font-semibold text-sm text-[#074469] flex items-center gap-1.5 whitespace-nowrap">
              <span className="material-symbols-outlined text-lg">filter_list</span>
              Filtros:
            </span>

            {/* Espécie */}
            <select
              value={selectedSpecies}
              onChange={(e) => setSelectedSpecies(e.target.value)}
              className="font-['Be_Vietnam_Pro'] text-sm bg-[#f7f9fb] border border-[#c1c7cf] rounded-lg px-3 py-2 text-[#191c1e] focus:border-[#074469] focus:ring-1 focus:ring-[#074469] outline-none cursor-pointer"
            >
              <option value="all">Espécie: Todas</option>
              <option value="Cães">Cães</option>
              <option value="Gatos">Gatos</option>
            </select>

            {/* Porte */}
            <select
              value={selectedSize}
              onChange={(e) => setSelectedSize(e.target.value)}
              className="font-['Be_Vietnam_Pro'] text-sm bg-[#f7f9fb] border border-[#c1c7cf] rounded-lg px-3 py-2 text-[#191c1e] focus:border-[#074469] focus:ring-1 focus:ring-[#074469] outline-none cursor-pointer"
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
              className="font-['Be_Vietnam_Pro'] text-sm bg-[#f7f9fb] border border-[#c1c7cf] rounded-lg px-3 py-2 text-[#191c1e] focus:border-[#074469] focus:ring-1 focus:ring-[#074469] outline-none cursor-pointer"
            >
              <option value="all">Gênero: Todos</option>
              <option value="Macho">Macho</option>
              <option value="Fêmea">Fêmea</option>
            </select>

            {/* Idade */}
            <select
              value={selectedAgeGroup}
              onChange={(e) => setSelectedAgeGroup(e.target.value)}
              className="font-['Be_Vietnam_Pro'] text-sm bg-[#f7f9fb] border border-[#c1c7cf] rounded-lg px-3 py-2 text-[#191c1e] focus:border-[#074469] focus:ring-1 focus:ring-[#074469] outline-none cursor-pointer"
            >
              <option value="all">Idade: Todas</option>
              <option value="Filhote">Filhote</option>
              <option value="Adulto">Adulto</option>
              <option value="Idoso">Idoso</option>
            </select>

            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="text-xs text-[#ba1a1a] hover:underline font-medium px-2 py-1 flex items-center gap-1 cursor-pointer"
              >
                <span className="material-symbols-outlined text-sm">close</span>
                Limpar filtros
              </button>
            )}
          </div>

          {/* Search box */}
          <div className="relative min-w-[200px] max-w-xs">
            <span className="material-symbols-outlined absolute left-3 top-2.5 text-[#72787f] text-sm pointer-events-none">
              search
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar por nome, raça..."
              className="w-full pl-9 pr-3 py-2 font-['Be_Vietnam_Pro'] text-sm bg-[#f7f9fb] border border-[#c1c7cf] rounded-lg text-[#191c1e] focus:border-[#074469] focus:ring-1 focus:ring-[#074469] outline-none"
            />
          </div>
        </div>
      </section>

      {/* Pet Cards Grid */}
      <section className="max-w-7xl mx-auto px-4 md:px-16 pb-16 w-full">
        {filteredPets.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-[#e0e3e5] my-6">
            <div className="w-16 h-16 bg-[#ffdbc9] rounded-full flex items-center justify-center mx-auto mb-4 text-[#914100]">
              <span className="material-symbols-outlined text-3xl">pets</span>
            </div>
            <h3 className="font-['Plus_Jakarta_Sans'] text-xl font-bold text-[#074469] mb-2">
              Nenhum pet encontrado com os filtros selecionados
            </h3>
            <p className="font-['Be_Vietnam_Pro'] text-[#41474e] text-sm mb-4">
              Tente redefinir os filtros para visualizar outros animaizinhos incríveis disponíveis.
            </p>
            <button
              onClick={clearFilters}
              className="bg-[#074469] text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-[#2a5c82] transition-colors cursor-pointer"
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
                className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 border border-[#e0e3e5] group relative flex flex-col cursor-pointer"
              >
                {/* Favorite Button */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleFavorite(pet.id);
                  }}
                  className="absolute top-3 right-3 z-10 w-9 h-9 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center text-[#41474e] hover:text-[#914100] transition-colors shadow-sm cursor-pointer"
                  aria-label={`Favoritar ${pet.name}`}
                >
                  <span
                    className={`material-symbols-outlined text-xl transition-colors ${
                      pet.favorite ? 'material-symbols-fill text-[#914100]' : 'text-[#72787f] hover:text-[#914100]'
                    }`}
                  >
                    favorite
                  </span>
                </button>

                {/* Pet Image */}
                <div className="h-52 bg-[#e6e8ea] relative overflow-hidden">
                  <img
                    src={pet.mainImage}
                    alt={`Foto de ${pet.name}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  {pet.status === 'Em Processo' && (
                    <span className="absolute bottom-2 left-2 bg-[#e0e3e5]/90 text-[#41474e] text-xs font-semibold px-2 py-0.5 rounded backdrop-blur-sm">
                      Em Processo
                    </span>
                  )}
                </div>

                {/* Pet Information */}
                <div className="p-4 space-y-2 flex-grow flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <h3 className="font-['Plus_Jakarta_Sans'] text-xl font-semibold text-[#191c1e] group-hover:text-[#074469] transition-colors">
                        {pet.name}
                      </h3>
                      <span
                        className="material-symbols-outlined text-[#074469] text-xl"
                        title={pet.gender}
                      >
                        {pet.gender === 'Macho' ? 'male' : 'female'}
                      </span>
                    </div>

                    <p className="font-['Be_Vietnam_Pro'] text-sm text-[#41474e] flex items-center gap-1.5 mb-1">
                      <span className="material-symbols-outlined text-sm text-[#72787f]">cake</span>
                      <span>{pet.age}</span>
                    </p>

                    <p className="font-['Be_Vietnam_Pro'] text-sm text-[#41474e] flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-sm text-[#72787f]">location_on</span>
                      <span>{pet.city}, {pet.state}</span>
                    </p>
                  </div>

                  {/* Badges / Chips */}
                  <div className="pt-3 flex flex-wrap gap-1.5 border-t border-[#e0e3e5]/60 mt-2">
                    {pet.vaccination && (
                      <span className="font-['Be_Vietnam_Pro'] text-xs font-semibold bg-[#a0efd6] text-[#196f5b] px-2.5 py-0.5 rounded-full">
                        {pet.vaccination.toLowerCase().includes('completa') ? 'Vacinado' : pet.vaccination}
                      </span>
                    )}
                    {pet.temperament.slice(0, 1).map((trait, idx) => (
                      <span
                        key={idx}
                        className="font-['Be_Vietnam_Pro'] text-xs bg-[#e6e8ea] text-[#41474e] px-2.5 py-0.5 rounded-full font-medium"
                      >
                        {trait}
                      </span>
                    ))}
                    {pet.castrated && (
                      <span className="font-['Be_Vietnam_Pro'] text-xs bg-[#f2f4f6] text-[#126b57] px-2 py-0.5 rounded-full border border-[#a0efd6]">
                        Castrado
                      </span>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* Ver Mais Animais Button */}
        {filteredPets.length > visibleCount && (
          <div className="mt-10 flex justify-center">
            <button
              onClick={() => setVisibleCount((prev) => prev + 8)}
              className="font-['Be_Vietnam_Pro'] text-sm font-semibold text-[#074469] border border-[#c1c7cf] px-8 py-3 rounded-lg hover:bg-[#e0e3e5]/50 transition-colors shadow-sm cursor-pointer"
            >
              Ver Mais Animais ({filteredPets.length - visibleCount} restantes)
            </button>
          </div>
        )}
      </section>

      {/* Partners Carousel */}
      <section className="bg-gradient-to-b from-[#f2f4f6] to-[#e6e8ea] py-16 overflow-hidden border-t border-[#e0e3e5] relative">
        {/* Decorative background glow accents */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#cde5ff]/30 rounded-full blur-3xl pointer-events-none -translate-y-1/2" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#a0efd6]/25 rounded-full blur-3xl pointer-events-none translate-y-1/2" />

        <div className="max-w-7xl mx-auto px-4 md:px-16 mb-10 text-center relative z-10">
          <div className="inline-flex items-center gap-2 bg-[#cde5ff] text-[#074469] font-['Be_Vietnam_Pro'] text-xs font-bold px-3 py-1 rounded-full mb-3 shadow-xs">
            <span className="material-symbols-outlined text-sm">handshake</span>
            <span>Rede de Apoio CorrenteCão</span>
          </div>
          <h2 className="font-['Plus_Jakarta_Sans'] text-3xl md:text-4xl font-bold text-[#074469]">
            Nossos Parceiros & Benefícios
          </h2>
          <p className="font-['Be_Vietnam_Pro'] text-base md:text-lg text-[#41474e] mt-2 max-w-2xl mx-auto">
            Empresas, hospitais e clínicas veterinárias que garantem vantagens exclusivas para adotantes e acolhedores.
          </p>
        </div>

        {/* Carousel Infinite Slider */}
        <div className="relative w-full overflow-hidden py-4">
          <div className="carousel-track items-stretch gap-6 px-4">
            {/* First Sequence */}
            {PARTNERS_LIST.map((partner) => (
              <a
                key={`p1-${partner.id}`}
                href={partner.url || '#'}
                onClick={(e) => {
                  e.preventDefault();
                  setActivePartnerModal(partner);
                }}
                className="group flex-shrink-0 w-[300px] sm:w-[340px] bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 border border-[#c1c7cf]/50 hover:border-[#074469] flex flex-col justify-between cursor-pointer text-left relative"
                aria-label={`Ver detalhes do parceiro ${partner.name}`}
              >
                {/* Image Header with Badge & Gradient */}
                <div className="relative h-44 w-full overflow-hidden bg-slate-900">
                  <img
                    src={partner.image}
                    alt={partner.name}
                    className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500 opacity-90 group-hover:opacity-100"
                    loading="lazy"
                  />
                  {/* Gradient Overlay for Text Readability */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />

                  {/* Top Badge */}
                  {partner.badge && (
                    <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-md text-[#074469] font-['Be_Vietnam_Pro'] text-xs font-bold px-2.5 py-1 rounded-full shadow-md border border-white/40 flex items-center gap-1">
                      <span className="material-symbols-outlined text-xs text-[#126b57]">verified</span>
                      <span>{partner.badge}</span>
                    </div>
                  )}

                  {/* Category Pill on Image Bottom */}
                  <div className="absolute bottom-3 left-3 right-3 flex justify-between items-end text-white">
                    <span className="font-['Be_Vietnam_Pro'] text-xs font-medium bg-black/40 backdrop-blur-xs px-2.5 py-0.5 rounded-md border border-white/20">
                      {partner.category}
                    </span>
                    <span className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md group-hover:bg-[#074469] group-hover:text-white transition-colors flex items-center justify-center text-white shadow-xs">
                      <span className="material-symbols-outlined text-base">arrow_outward</span>
                    </span>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-5 flex flex-col flex-grow justify-between gap-3 bg-gradient-to-b from-white to-[#f7f9fb]">
                  <div>
                    <h3 className="font-['Plus_Jakarta_Sans'] text-lg font-bold text-[#074469] group-hover:text-[#2a5c82] transition-colors line-clamp-1">
                      {partner.name}
                    </h3>
                    <p className="font-['Be_Vietnam_Pro'] text-xs sm:text-sm text-[#41474e] mt-1 line-clamp-2 leading-relaxed">
                      {partner.tagline}
                    </p>
                  </div>

                  {/* Benefit Tag */}
                  {partner.discountOrBenefit && (
                    <div className="mt-2 pt-2.5 border-t border-[#e0e3e5] flex items-center gap-2">
                      <span className="material-symbols-outlined text-[#914100] text-base shrink-0">
                        redeem
                      </span>
                      <span className="font-['Be_Vietnam_Pro'] text-xs font-semibold text-[#6d2f00] line-clamp-1">
                        {partner.discountOrBenefit}
                      </span>
                    </div>
                  )}
                </div>
              </a>
            ))}

            {/* Duplicated Sequence for Seamless Infinite Scrolling */}
            {PARTNERS_LIST.map((partner) => (
              <a
                key={`p2-${partner.id}`}
                href={partner.url || '#'}
                onClick={(e) => {
                  e.preventDefault();
                  setActivePartnerModal(partner);
                }}
                className="group flex-shrink-0 w-[300px] sm:w-[340px] bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 border border-[#c1c7cf]/50 hover:border-[#074469] flex flex-col justify-between cursor-pointer text-left relative"
                aria-label={`Ver detalhes do parceiro ${partner.name}`}
              >
                {/* Image Header with Badge & Gradient */}
                <div className="relative h-44 w-full overflow-hidden bg-slate-900">
                  <img
                    src={partner.image}
                    alt={partner.name}
                    className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500 opacity-90 group-hover:opacity-100"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />

                  {partner.badge && (
                    <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-md text-[#074469] font-['Be_Vietnam_Pro'] text-xs font-bold px-2.5 py-1 rounded-full shadow-md border border-white/40 flex items-center gap-1">
                      <span className="material-symbols-outlined text-xs text-[#126b57]">verified</span>
                      <span>{partner.badge}</span>
                    </div>
                  )}

                  <div className="absolute bottom-3 left-3 right-3 flex justify-between items-end text-white">
                    <span className="font-['Be_Vietnam_Pro'] text-xs font-medium bg-black/40 backdrop-blur-xs px-2.5 py-0.5 rounded-md border border-white/20">
                      {partner.category}
                    </span>
                    <span className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md group-hover:bg-[#074469] group-hover:text-white transition-colors flex items-center justify-center text-white shadow-xs">
                      <span className="material-symbols-outlined text-base">arrow_outward</span>
                    </span>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-5 flex flex-col flex-grow justify-between gap-3 bg-gradient-to-b from-white to-[#f7f9fb]">
                  <div>
                    <h3 className="font-['Plus_Jakarta_Sans'] text-lg font-bold text-[#074469] group-hover:text-[#2a5c82] transition-colors line-clamp-1">
                      {partner.name}
                    </h3>
                    <p className="font-['Be_Vietnam_Pro'] text-xs sm:text-sm text-[#41474e] mt-1 line-clamp-2 leading-relaxed">
                      {partner.tagline}
                    </p>
                  </div>

                  {partner.discountOrBenefit && (
                    <div className="mt-2 pt-2.5 border-t border-[#e0e3e5] flex items-center gap-2">
                      <span className="material-symbols-outlined text-[#914100] text-base shrink-0">
                        redeem
                      </span>
                      <span className="font-['Be_Vietnam_Pro'] text-xs font-semibold text-[#6d2f00] line-clamp-1">
                        {partner.discountOrBenefit}
                      </span>
                    </div>
                  )}
                </div>
              </a>
            ))}
          </div>
        </div>

        <div className="mt-6 text-center">
          <p className="text-xs font-['Be_Vietnam_Pro'] text-[#72787f]">
            💡 Passe o mouse ou toque para pausar o carrossel. Clique para ver detalhes e benefícios do parceiro.
          </p>
        </div>
      </section>

      {/* Partner Details Modal */}
      {activePartnerModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl border border-[#e0e3e5] relative animate-in fade-in zoom-in duration-200">
            <button
              onClick={() => setActivePartnerModal(null)}
              className="absolute top-3 right-3 z-10 bg-black/50 hover:bg-black/80 text-white p-2 rounded-full backdrop-blur-md transition-colors"
              aria-label="Fechar"
            >
              <span className="material-symbols-outlined text-sm">close</span>
            </button>

            {/* Modal Image Header */}
            <div className="relative h-56 w-full">
              <img
                src={activePartnerModal.image}
                alt={activePartnerModal.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
              <div className="absolute bottom-4 left-6 right-6 text-white">
                <span className="text-xs font-semibold bg-[#a0efd6] text-[#196f5b] px-2.5 py-1 rounded-full inline-block mb-1">
                  {activePartnerModal.category}
                </span>
                <h3 className="font-['Plus_Jakarta_Sans'] text-2xl font-bold">
                  {activePartnerModal.name}
                </h3>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4 font-['Be_Vietnam_Pro']">
              <p className="text-sm md:text-base text-[#41474e] leading-relaxed">
                {activePartnerModal.tagline}
              </p>

              {activePartnerModal.discountOrBenefit && (
                <div className="bg-[#ffdbc9]/60 border border-[#ffdbc9] rounded-xl p-4 flex items-start gap-3">
                  <span className="material-symbols-outlined text-[#914100] text-2xl">card_giftcard</span>
                  <div>
                    <h4 className="text-xs font-bold text-[#6d2f00] uppercase tracking-wider">
                      Benefício Exclusivo para Adotantes
                    </h4>
                    <p className="text-sm font-semibold text-[#191c1e] mt-0.5">
                      {activePartnerModal.discountOrBenefit}
                    </p>
                  </div>
                </div>
              )}

              <div className="bg-[#f2f4f6] rounded-xl p-4 text-xs text-[#41474e] space-y-1.5">
                <p className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-sm text-[#126b57]">verified</span>
                  <span>Empresa parceira oficial cadastrada na rede <strong>CorrenteCão</strong></span>
                </p>
                <p className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-sm text-[#074469]">link</span>
                  <span>Link de acesso: <span className="font-mono text-[#074469]">{activePartnerModal.url}</span></span>
                </p>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setActivePartnerModal(null)}
                  className="flex-1 bg-[#eceef0] hover:bg-[#e0e3e5] text-[#191c1e] font-semibold py-3 rounded-xl text-sm transition-colors cursor-pointer"
                >
                  Fechar
                </button>
                <a
                  href={activePartnerModal.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => {
                    setTimeout(() => setActivePartnerModal(null), 500);
                  }}
                  className="flex-1 bg-[#074469] hover:bg-[#2a5c82] text-white font-semibold py-3 rounded-xl text-sm transition-all shadow-sm flex items-center justify-center gap-1.5 text-center cursor-pointer"
                >
                  <span>Visitar Parceiro</span>
                  <span className="material-symbols-outlined text-sm">open_in_new</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
