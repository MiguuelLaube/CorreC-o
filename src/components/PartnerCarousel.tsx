import React, { useState, useRef, useEffect } from 'react';
import { Partner } from '../types';
import { PARTNERS_LIST } from '../data/initialData';

interface PartnerCarouselProps {
  partners?: Partner[];
  onSelectPartner?: (partner: Partner) => void;
  title?: string;
  subtitle?: string;
  compact?: boolean;
}

export const PartnerCarousel: React.FC<PartnerCarouselProps> = ({
  partners = PARTNERS_LIST,
  onSelectPartner,
  title = 'Nossos Parceiros & Benefícios Exclusivos',
  subtitle = 'Empresas, hospitais veterinários e serviços que garantem descontos e vantagens para adotantes e acolhedores.',
  compact = false
}) => {
  const [selectedPartnerModal, setSelectedPartnerModal] = useState<Partner | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Estados e Refs para Drag & Interação
  const [isDragging, setIsDragging] = useState(false);
  const isDraggingRef = useRef(false);
  const isHoveredRef = useRef(false);
  const startXRef = useRef(0);
  const startScrollLeftRef = useRef(0);
  const hasDraggedRef = useRef(false);

  // Lista com 5 repetições para garantir buffer infinito robusto em ambas as direções
  const safePartners = partners && partners.length > 0 ? partners : PARTNERS_LIST;
  const loopList = [
    ...safePartners,
    ...safePartners,
    ...safePartners,
    ...safePartners,
    ...safePartners
  ];

  const isModalOpen = selectedPartnerModal !== null;
  const isModalOpenRef = useRef(false);
  isModalOpenRef.current = isModalOpen;

  // Inicializar o scroll no centro exato (conjunto 2 de 5)
  const initScrollPosition = () => {
    const container = containerRef.current;
    if (container && container.scrollWidth > 0) {
      const singleSetWidth = container.scrollWidth / 5;
      container.scrollLeft = singleSetWidth * 2;
    }
  };

  useEffect(() => {
    initScrollPosition();
    const handleResize = () => initScrollPosition();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [safePartners]);

  // Loop de Auto-Scroll contínuo e perceptivelmente lento
  // Pausa imediatamente durante drag ou modal aberto, e retoma suavemente ao fechar
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let animationFrameId: number;
    let lastTimestamp: number | null = null;
    const speed = 18; // Velocidade perceptivelmente lenta e suave (18px/s)

    const step = (timestamp: number) => {
      // Se estiver arrastando ou com modal aberto, pausa imediatamente e reseta o timestamp
      if (isDraggingRef.current || isModalOpenRef.current) {
        lastTimestamp = null;
      } else {
        if (lastTimestamp === null) {
          lastTimestamp = timestamp;
        }
        const delta = Math.min((timestamp - lastTimestamp) / 1000, 0.1);
        lastTimestamp = timestamp;

        if (container && container.scrollWidth > 0) {
          container.scrollLeft += speed * delta;

          const singleSetWidth = container.scrollWidth / 5;
          // Se avançou além do conjunto 3 -> volta 1 conjunto
          if (container.scrollLeft >= singleSetWidth * 3) {
            container.scrollLeft -= singleSetWidth;
          }
          // Se retrocedeu antes do conjunto 1 -> avança 1 conjunto
          else if (container.scrollLeft <= singleSetWidth * 1) {
            container.scrollLeft += singleSetWidth;
          }
        }
      }

      animationFrameId = requestAnimationFrame(step);
    };

    animationFrameId = requestAnimationFrame(step);

    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  // Handlers de Mouse Drag
  const handleMouseDown = (e: React.MouseEvent) => {
    const container = containerRef.current;
    if (!container) return;

    isDraggingRef.current = true;
    setIsDragging(true);
    hasDraggedRef.current = false;
    startXRef.current = e.pageX;
    startScrollLeftRef.current = container.scrollLeft;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDraggingRef.current) return;
    const container = containerRef.current;
    if (!container) return;

    e.preventDefault();
    const dx = e.pageX - startXRef.current;

    if (Math.abs(dx) > 4) {
      hasDraggedRef.current = true;
    }

    container.scrollLeft = startScrollLeftRef.current - dx;

    // Loop infinito bidirecional imediato durante o arraste
    const singleSetWidth = container.scrollWidth / 5;
    if (container.scrollLeft >= singleSetWidth * 3) {
      container.scrollLeft -= singleSetWidth;
      startScrollLeftRef.current -= singleSetWidth;
    } else if (container.scrollLeft <= singleSetWidth * 1) {
      container.scrollLeft += singleSetWidth;
      startScrollLeftRef.current += singleSetWidth;
    }
  };

  const handleEndDrag = () => {
    isDraggingRef.current = false;
    setIsDragging(false);
  };

  // Handlers de Touch (Mobile & Tablets)
  const handleTouchStart = (e: React.TouchEvent) => {
    const container = containerRef.current;
    if (!container || e.touches.length === 0) return;

    isDraggingRef.current = true;
    setIsDragging(true);
    hasDraggedRef.current = false;
    startXRef.current = e.touches[0].pageX;
    startScrollLeftRef.current = container.scrollLeft;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDraggingRef.current) return;
    const container = containerRef.current;
    if (!container || e.touches.length === 0) return;

    const dx = e.touches[0].pageX - startXRef.current;

    if (Math.abs(dx) > 4) {
      hasDraggedRef.current = true;
    }

    container.scrollLeft = startScrollLeftRef.current - dx;

    const singleSetWidth = container.scrollWidth / 5;
    if (container.scrollLeft >= singleSetWidth * 3) {
      container.scrollLeft -= singleSetWidth;
      startScrollLeftRef.current -= singleSetWidth;
    } else if (container.scrollLeft <= singleSetWidth * 1) {
      container.scrollLeft += singleSetWidth;
      startScrollLeftRef.current += singleSetWidth;
    }
  };

  // Listener global de liberação do ponteiro
  useEffect(() => {
    const onWindowMouseUp = () => {
      if (isDraggingRef.current) {
        handleEndDrag();
      }
    };
    window.addEventListener('mouseup', onWindowMouseUp);
    window.addEventListener('touchend', onWindowMouseUp);
    return () => {
      window.removeEventListener('mouseup', onWindowMouseUp);
      window.removeEventListener('touchend', onWindowMouseUp);
    };
  }, []);

  // Botões de navegação rápida
  const scrollStep = (direction: 'left' | 'right') => {
    const container = containerRef.current;
    if (!container) return;

    const offset = direction === 'left' ? -320 : 320;
    container.scrollBy({ left: offset, behavior: 'smooth' });

    setTimeout(() => {
      if (!container) return;
      const singleSetWidth = container.scrollWidth / 5;
      if (container.scrollLeft >= singleSetWidth * 3) {
        container.scrollLeft -= singleSetWidth;
      } else if (container.scrollLeft <= singleSetWidth * 1) {
        container.scrollLeft += singleSetWidth;
      }
    }, 350);
  };

  const handleCardClick = (partner: Partner) => {
    if (hasDraggedRef.current) {
      return; // Se o usuário estava arrastando, não abre modal
    }
    if (onSelectPartner) {
      onSelectPartner(partner);
    } else {
      setSelectedPartnerModal(partner);
    }
  };

  return (
    <section
      className={`w-full relative overflow-hidden font-['Plus_Jakarta_Sans'] ${
        compact
          ? 'py-6'
          : 'py-12 bg-gradient-to-b from-[#f2f4f6] to-[#e6e8ea] dark:from-[#09111a] dark:to-[#0f1924] border-t border-[#e0e3e5] dark:border-[#1e2c3c] transition-colors'
      }`}
    >
      {/* Luzes decorativas de fundo */}
      {!compact && (
        <>
          <div className="absolute top-0 left-1/4 w-80 h-80 bg-[#cde5ff]/30 dark:bg-[#5BE29D]/10 rounded-full blur-3xl pointer-events-none -translate-y-1/2" />
          <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-[#a0efd6]/25 dark:bg-[#074469]/20 rounded-full blur-3xl pointer-events-none translate-y-1/2" />
        </>
      )}

      {/* Cabeçalho da Seção */}
      <div className="max-w-7xl mx-auto px-4 md:px-16 mb-8 text-center relative z-10">
        <div className="inline-flex items-center gap-2 bg-[#cde5ff] dark:bg-[#5BE29D]/20 text-[#074469] dark:text-[#5BE29D] border border-transparent dark:border-[#5BE29D]/40 text-xs font-bold px-3 py-1 rounded-full mb-2.5 shadow-2xs">
          <span className="material-symbols-outlined text-sm">handshake</span>
          <span>Rede de Apoio & Parceiros Oficiais</span>
        </div>
        <h2 className="font-['Plus_Jakarta_Sans'] text-2xl md:text-3xl font-bold text-[#074469] dark:text-white">
          {title}
        </h2>
        <p className="text-xs md:text-sm text-[#41474e] dark:text-[#cbd5e1] font-['Inter'] mt-1.5 max-w-2xl mx-auto leading-relaxed">
          {subtitle}
        </p>
      </div>

      {/* Container do Carrossel com Controles */}
      <div className="relative max-w-7xl mx-auto px-2 sm:px-6">
        {/* Botão Anterior (Desktop) */}
        <button
          onClick={() => scrollStep('left')}
          className="hidden sm:flex absolute left-0 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-2xl bg-white/90 dark:bg-[#162230]/90 backdrop-blur-md shadow-lg border border-[#e0e3e5] dark:border-[#2b3e52] text-[#074469] dark:text-[#5BE29D] hover:bg-[#074469] dark:hover:bg-[#5BE29D] hover:text-white dark:hover:text-[#063e2e] items-center justify-center transition-all cursor-pointer hover:scale-105 active:scale-95"
          aria-label="Rolar para a esquerda"
        >
          <span className="material-symbols-outlined text-2xl">chevron_left</span>
        </button>

        {/* Trilha do Carrossel com Suporte a Drag & Swipe Bidirecional */}
        <div
          ref={containerRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          className={`flex gap-5 overflow-x-hidden py-4 select-none px-4 sm:px-10 scrollbar-none will-change-scroll ${
            isDragging ? 'cursor-grabbing' : 'cursor-grab'
          }`}
          style={{
            WebkitOverflowScrolling: 'touch',
            scrollbarWidth: 'none',
            msOverflowStyle: 'none'
          }}
        >
          {loopList.map((partner, index) => (
            <div
              key={`partner-card-${partner.id}-${index}`}
              onClick={() => handleCardClick(partner)}
              className="group shrink-0 w-[280px] sm:w-[320px] bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 border border-[#e0e3e5] hover:border-[#074469] flex flex-col justify-between cursor-pointer text-left relative"
            >
              {/* Imagem do Parceiro com Overlay */}
              <div className="relative h-40 w-full overflow-hidden bg-slate-900">
                <img
                  src={partner.image}
                  alt={partner.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100 pointer-events-none"
                  loading="lazy"
                  draggable={false}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />

                {/* Badge Superior */}
                {partner.badge && (
                  <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-md text-[#074469] text-[11px] font-bold px-2.5 py-0.5 rounded-full shadow-xs border border-white/40 flex items-center gap-1 pointer-events-none">
                    <span className="material-symbols-outlined text-xs text-[#126b57]">verified</span>
                    <span>{partner.badge}</span>
                  </div>
                )}

                {/* Categoria na Imagem */}
                <div className="absolute bottom-2.5 left-3 right-3 flex justify-between items-center text-white pointer-events-none">
                  <span className="text-[11px] font-semibold bg-black/50 backdrop-blur-xs px-2.5 py-0.5 rounded-lg border border-white/20">
                    {partner.category}
                  </span>
                  <div className="w-7 h-7 rounded-full bg-white/20 backdrop-blur-md group-hover:bg-[#074469] group-hover:text-white transition-colors flex items-center justify-center text-white shadow-xs">
                    <span className="material-symbols-outlined text-sm">arrow_outward</span>
                  </div>
                </div>
              </div>

              {/* Corpo do Card */}
              <div className="p-4 flex flex-col flex-1 justify-between gap-3 bg-gradient-to-b from-white to-[#f7f9fb] dark:from-[#121d28] dark:to-[#0f1822] pointer-events-none transition-colors">
                <div>
                  <h3 className="font-['Plus_Jakarta_Sans'] text-base font-bold text-[#074469] dark:text-white group-hover:text-[#2a5c82] dark:group-hover:text-[#5BE29D] transition-colors line-clamp-1">
                    {partner.name}
                  </h3>
                  <p className="text-xs text-[#41474e] dark:text-[#cbd5e1] font-['Inter'] mt-1 line-clamp-2 leading-relaxed">
                    {partner.tagline}
                  </p>
                </div>

                {partner.discountOrBenefit && (
                  <div className="mt-1 pt-2 border-t border-[#e0e3e5] dark:border-[#1e2c3c] flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[#914100] dark:text-[#5BE29D] text-sm shrink-0">
                      redeem
                    </span>
                    <span className="text-[11px] font-semibold text-[#6d2f00] dark:text-[#5BE29D] line-clamp-1 font-['Inter']">
                      {partner.discountOrBenefit}
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Botão Próximo (Desktop) */}
        <button
          onClick={() => scrollStep('right')}
          className="hidden sm:flex absolute right-0 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-2xl bg-white/90 dark:bg-[#162230]/90 backdrop-blur-md shadow-lg border border-[#e0e3e5] dark:border-[#2b3e52] text-[#074469] dark:text-[#5BE29D] hover:bg-[#074469] dark:hover:bg-[#5BE29D] hover:text-white dark:hover:text-[#063e2e] items-center justify-center transition-all cursor-pointer hover:scale-105 active:scale-95"
          aria-label="Rolar para a direita"
        >
          <span className="material-symbols-outlined text-2xl">chevron_right</span>
        </button>
      </div>

      {/* Dica de Uso */}
      <div className="mt-4 text-center">
        <p className="text-[11px] text-[#72787f] dark:text-[#94a3b8] font-['Inter'] flex items-center justify-center gap-1">
          <span className="material-symbols-outlined text-xs">swipe</span>
          <span>Arraste para ambos os lados ou clique em um parceiro para detalhes e benefícios.</span>
        </p>
      </div>

      {/* Modal de Detalhes do Parceiro */}
      {selectedPartnerModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#121d28] rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-[#e0e3e5] dark:border-[#1e2c3c] relative animate-in fade-in zoom-in duration-200">
            <button
              onClick={() => setSelectedPartnerModal(null)}
              className="absolute top-3.5 right-3.5 z-10 bg-black/50 hover:bg-black/80 text-white p-2 rounded-full backdrop-blur-md transition-colors cursor-pointer"
              aria-label="Fechar"
            >
              <span className="material-symbols-outlined text-base">close</span>
            </button>

            {/* Header da Imagem */}
            <div className="relative h-52 w-full">
              <img
                src={selectedPartnerModal.image}
                alt={selectedPartnerModal.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
              <div className="absolute bottom-4 left-6 right-6 text-white">
                <span className="text-[11px] font-semibold bg-[#a0efd6] dark:bg-[#5BE29D] text-[#196f5b] dark:text-[#064e3b] px-2.5 py-0.5 rounded-full inline-block mb-1">
                  {selectedPartnerModal.category}
                </span>
                <h3 className="font-['Plus_Jakarta_Sans'] text-2xl font-bold">
                  {selectedPartnerModal.name}
                </h3>
              </div>
            </div>

            {/* Conteúdo do Modal */}
            <div className="p-6 space-y-4 font-['Inter']">
              <p className="text-sm text-[#41474e] dark:text-[#cbd5e1] leading-relaxed">
                {selectedPartnerModal.tagline}
              </p>

              {selectedPartnerModal.discountOrBenefit && (
                <div className="bg-[#ffdbc9]/60 dark:bg-[#5BE29D]/15 border border-[#ffdbc9] dark:border-[#5BE29D]/30 rounded-2xl p-4 flex items-start gap-3">
                  <span className="material-symbols-outlined text-[#914100] dark:text-[#5BE29D] text-2xl shrink-0">
                    card_giftcard
                  </span>
                  <div>
                    <h4 className="text-[11px] font-bold text-[#6d2f00] dark:text-[#5BE29D] uppercase tracking-wider">
                      Benefício Exclusivo para Adotantes
                    </h4>
                    <p className="text-sm font-semibold text-[#191c1e] dark:text-white mt-0.5">
                      {selectedPartnerModal.discountOrBenefit}
                    </p>
                  </div>
                </div>
              )}

              <div className="bg-[#f2f4f6] dark:bg-[#162230] rounded-2xl p-4 text-xs text-[#41474e] dark:text-[#cbd5e1] space-y-2">
                <p className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-sm text-[#126b57] dark:text-[#5BE29D]">verified</span>
                  <span>
                    Empresa parceira oficial cadastrada na rede <strong>MatchPet</strong>
                  </span>
                </p>
                <p className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-sm text-[#074469] dark:text-[#5BE29D]">link</span>
                  <span>
                    Link oficial:{' '}
                    <span className="font-mono text-[#074469] dark:text-[#5BE29D]">
                      {selectedPartnerModal.url || 'https://matchpet.ong.br'}
                    </span>
                  </span>
                </p>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedPartnerModal(null)}
                  className="flex-1 bg-[#eceef0] dark:bg-[#1e2f42] hover:bg-[#e0e3e5] dark:hover:bg-[#273a50] text-[#191c1e] dark:text-[#e2e8f0] font-semibold py-3 rounded-xl text-xs sm:text-sm transition-colors cursor-pointer"
                >
                  Fechar
                </button>
                <a
                  href={
                    selectedPartnerModal.url && (selectedPartnerModal.url.startsWith('http://') || selectedPartnerModal.url.startsWith('https://'))
                      ? selectedPartnerModal.url
                      : '#'
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => {
                    if (!selectedPartnerModal.url || (!selectedPartnerModal.url.startsWith('http://') && !selectedPartnerModal.url.startsWith('https://'))) {
                      e.preventDefault();
                    }
                    setTimeout(() => setSelectedPartnerModal(null), 500);
                  }}
                  className="flex-1 bg-[#074469] dark:bg-[#5BE29D] hover:bg-[#2a5c82] dark:hover:bg-[#48cf8b] text-white dark:text-[#063e2e] font-semibold py-3 rounded-xl text-xs sm:text-sm transition-all shadow-sm flex items-center justify-center gap-1.5 text-center cursor-pointer font-['Plus_Jakarta_Sans']"
                >
                  <span>Acessar Parceiro</span>
                  <span className="material-symbols-outlined text-sm">open_in_new</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
