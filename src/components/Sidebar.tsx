import React, { useEffect } from 'react';
import { ActiveTab, User, OngSession } from '../types';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  currentUser: User | null;
  currentOng: OngSession | null;
  onOpenAuth: (profile?: 'user' | 'ong') => void;
  onLogoutUser: () => void;
  onLogoutOng: () => void;
  favoritesCount: number;
  unreadNotificationsCount?: number;
  onOpenPixModal: () => void;
  onOpenIndicarModal: () => void;
  onOpenSecurityModal?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  onClose,
  activeTab,
  setActiveTab,
  currentUser,
  currentOng,
  onOpenAuth,
  onLogoutUser,
  onLogoutOng,
  favoritesCount,
  onOpenPixModal,
  onOpenIndicarModal,
  onOpenSecurityModal
}) => {
  const isAdmin = currentOng?.role === 'admin';
  const isOng = currentOng?.role === 'ong';

  // Fechar com ESC
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Travar scroll do body quando aberto no mobile
  useEffect(() => {
    if (isOpen && window.innerWidth < 1024) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleNavigate = (tab: ActiveTab) => {
    setActiveTab(tab);
    if (window.innerWidth < 1024) {
      onClose();
    }
  };

  return (
    <>
      {/* Backdrop Overlay com desfoque exclusivo para mobile (<lg) */}
      <div
        onClick={onClose}
        className={`lg:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-xs transition-opacity duration-300 ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        aria-hidden="true"
      />

      {/* Sidebar Lateral: Permanente e Fixa no Desktop (lg:), Gaveta no Mobile */}
      <aside
        className={`fixed top-0 left-0 bottom-0 z-50 lg:z-30 w-72 bg-white dark:bg-[#0a111a] text-[#191c1e] dark:text-[#f1f5f9] shadow-2xl lg:shadow-none flex flex-col justify-between transform transition-transform duration-300 ease-out border-r border-[#e0e3e5] dark:border-[#1e2c3c] font-['Plus_Jakarta_Sans'] ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
        aria-label="Menu de Navegação Principal"
      >
        {/* 1. Header com Logo & Identidade MatchPet (Recolorido para Modo Claro & Escuro) */}
        <div className="p-5 border-b border-[#e0e3e5] dark:border-[#1e2c3c] flex items-center justify-between bg-white dark:bg-[#0c1520] transition-colors shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#074469] dark:bg-[#5BE29D]/20 text-[#a0efd6] dark:text-[#5BE29D] border border-transparent dark:border-[#5BE29D]/40 flex items-center justify-center shadow-xs">
              <span className="material-symbols-outlined text-2xl">pets</span>
            </div>
            <div>
              <span className="font-['Plus_Jakarta_Sans'] text-2xl font-extrabold text-[#074469] dark:text-white tracking-tight">
                Match<span className="text-[#126b57] dark:text-[#5BE29D]">Pet</span>
              </span>
              <span className="block text-[10px] text-[#72787f] dark:text-[#94a3b8] font-bold tracking-widest uppercase">
                Adoção Responsável
              </span>
            </div>
          </div>

          {/* Botão de Fechar visível apenas em telas mobile */}
          <button
            onClick={onClose}
            className="lg:hidden w-9 h-9 rounded-xl text-[#72787f] dark:text-[#94a3b8] hover:text-[#074469] dark:hover:text-[#5BE29D] hover:bg-[#eceef0] dark:hover:bg-[#162230] flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Fechar menu"
          >
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        {/* 2. Corpo de Navegação com Scroll */}
        <div className="flex-1 overflow-y-auto px-4 py-5 space-y-6 scrollbar-none">
          {/* Seção: EXPLORAR PLATAFORMA */}
          <div>
            <span className="px-3 text-[11px] font-bold text-[#72787f] dark:text-[#5BE29D] uppercase tracking-wider block mb-2 font-['Plus_Jakarta_Sans']">
              Explorar Plataforma
            </span>

            <nav className="space-y-1.5 font-['Inter']">
              <button
                onClick={() => handleNavigate('adotar')}
                className={`w-full flex items-center justify-between px-3.5 py-3 rounded-2xl text-sm font-semibold transition-all cursor-pointer ${
                  activeTab === 'adotar'
                    ? 'bg-[#074469] text-white shadow-xs dark:bg-[#5BE29D]/20 dark:text-[#5BE29D] dark:border dark:border-[#5BE29D]/50 font-bold'
                    : 'text-[#41474e] dark:text-[#e2e8f0] hover:bg-[#f2f4f6] dark:hover:bg-[#162230] hover:text-[#074469] dark:hover:text-[#5BE29D]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className={`material-symbols-outlined text-xl ${activeTab === 'adotar' ? 'text-[#a0efd6] dark:text-[#5BE29D]' : 'text-[#074469] dark:text-[#5BE29D]'}`}>
                    pets
                  </span>
                  <span>Quero Adotar Pets</span>
                </div>
                {favoritesCount > 0 && (
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                      activeTab === 'adotar'
                        ? 'bg-[#a0efd6] text-[#074469] dark:bg-[#5BE29D] dark:text-[#064e3b]'
                        : 'bg-[#ffdbc9] text-[#914100] dark:bg-[#ffdbc9]/20 dark:text-[#fdba74]'
                    }`}
                  >
                    ❤️ {favoritesCount}
                  </span>
                )}
              </button>

              <button
                onClick={() => handleNavigate('ongs')}
                className={`w-full flex items-center justify-between px-3.5 py-3 rounded-2xl text-sm font-semibold transition-all cursor-pointer ${
                  activeTab === 'ongs'
                    ? 'bg-[#074469] text-white shadow-xs dark:bg-[#5BE29D]/20 dark:text-[#5BE29D] dark:border dark:border-[#5BE29D]/50 font-bold'
                    : 'text-[#41474e] dark:text-[#e2e8f0] hover:bg-[#f2f4f6] dark:hover:bg-[#162230] hover:text-[#074469] dark:hover:text-[#5BE29D]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className={`material-symbols-outlined text-xl ${activeTab === 'ongs' ? 'text-[#a0efd6] dark:text-[#5BE29D]' : 'text-[#074469] dark:text-[#5BE29D]'}`}>
                    domain
                  </span>
                  <span>ONGs Parceiras</span>
                </div>
              </button>

              <button
                onClick={() => handleNavigate('minhas-adocoes')}
                className={`w-full flex items-center justify-between px-3.5 py-3 rounded-2xl text-sm font-semibold transition-all cursor-pointer ${
                  activeTab === 'minhas-adocoes'
                    ? 'bg-[#074469] text-white shadow-xs dark:bg-[#5BE29D]/20 dark:text-[#5BE29D] dark:border dark:border-[#5BE29D]/50 font-bold'
                    : 'text-[#41474e] dark:text-[#e2e8f0] hover:bg-[#f2f4f6] dark:hover:bg-[#162230] hover:text-[#074469] dark:hover:text-[#5BE29D]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className={`material-symbols-outlined text-xl ${activeTab === 'minhas-adocoes' ? 'text-[#a0efd6] dark:text-[#5BE29D]' : 'text-[#074469] dark:text-[#5BE29D]'}`}>
                    assignment
                  </span>
                  <span>Minhas Adoções</span>
                </div>
                {currentUser && (
                  <span className="w-2.5 h-2.5 rounded-full bg-[#126b57] dark:bg-[#5BE29D] animate-pulse shadow-xs" title="Sessão conectada" />
                )}
              </button>

              <button
                onClick={() => handleNavigate('acolhimento')}
                className={`w-full flex items-center justify-between px-3.5 py-3 rounded-2xl text-sm font-semibold transition-all cursor-pointer ${
                  activeTab === 'acolhimento'
                    ? 'bg-[#074469] text-white shadow-xs dark:bg-[#5BE29D]/20 dark:text-[#5BE29D] dark:border dark:border-[#5BE29D]/50 font-bold'
                    : 'text-[#41474e] dark:text-[#e2e8f0] hover:bg-[#f2f4f6] dark:hover:bg-[#162230] hover:text-[#074469] dark:hover:text-[#5BE29D]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className={`material-symbols-outlined text-xl ${activeTab === 'acolhimento' ? 'text-[#a0efd6] dark:text-[#5BE29D]' : 'text-[#074469] dark:text-[#5BE29D]'}`}>
                    volunteer_activism
                  </span>
                  <span>Triagem Comunitária</span>
                </div>
                <span className="text-[10px] bg-[#a0efd6] text-[#126b57] dark:bg-[#5BE29D] dark:text-[#064e3b] font-bold px-2 py-0.5 rounded-full shadow-2xs">
                  Acolher
                </span>
              </button>

              <button
                onClick={() => handleNavigate('sobre-nos')}
                className={`w-full flex items-center justify-between px-3.5 py-3 rounded-2xl text-sm font-semibold transition-all cursor-pointer ${
                  activeTab === 'sobre-nos'
                    ? 'bg-[#074469] text-white shadow-xs dark:bg-[#5BE29D]/20 dark:text-[#5BE29D] dark:border dark:border-[#5BE29D]/50 font-bold'
                    : 'text-[#41474e] dark:text-[#e2e8f0] hover:bg-[#f2f4f6] dark:hover:bg-[#162230] hover:text-[#074469] dark:hover:text-[#5BE29D]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className={`material-symbols-outlined text-xl ${activeTab === 'sobre-nos' ? 'text-[#a0efd6] dark:text-[#5BE29D]' : 'text-[#074469] dark:text-[#5BE29D]'}`}>
                    info
                  </span>
                  <span>Sobre o MatchPet</span>
                </div>
              </button>
            </nav>
          </div>

          {/* Seção: PAINEL ADMINISTRATIVO (Visível EXCLUSIVAMENTE para ONGs e Administrador autenticados) */}
          {(isOng || isAdmin) && (
            <div>
              <span className="px-3 text-[11px] font-bold text-[#126b57] dark:text-[#5BE29D] uppercase tracking-wider block mb-2 font-['Plus_Jakarta_Sans']">
                Painel Administrativo
              </span>

              <div className="space-y-1.5 font-['Inter']">
                {isOng && (
                  <button
                    onClick={() => handleNavigate('painel-ong')}
                    className={`w-full flex items-center justify-between px-3.5 py-3 rounded-2xl text-sm font-semibold transition-all cursor-pointer ${
                      activeTab === 'painel-ong'
                        ? 'bg-[#126b57] text-white shadow-xs ring-2 ring-[#a0efd6] dark:bg-[#5BE29D]/25 dark:text-[#5BE29D] dark:ring-[#5BE29D]'
                        : 'bg-[#a0efd6]/30 dark:bg-[#162b25] text-[#126b57] dark:text-[#5BE29D] hover:bg-[#a0efd6]/60 dark:hover:bg-[#1c3830] font-bold'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="material-symbols-outlined text-xl">dashboard</span>
                      <span>Painel da ONG</span>
                    </div>
                    <span className="text-[10px] bg-[#126b57] dark:bg-[#5BE29D] text-white dark:text-[#064e3b] px-2 py-0.5 rounded-full font-bold">
                      Ativo
                    </span>
                  </button>
                )}

                {isAdmin && (
                  <button
                    onClick={() => handleNavigate('painel-admin')}
                    className={`w-full flex items-center justify-between px-3.5 py-3 rounded-2xl text-sm font-semibold transition-all cursor-pointer ${
                      activeTab === 'painel-admin'
                        ? 'bg-[#074469] text-white shadow-xs ring-2 ring-[#a0efd6] dark:bg-[#38bdf8]/20 dark:text-[#38bdf8] dark:ring-[#38bdf8]'
                        : 'bg-[#074469]/10 dark:bg-[#162536] text-[#074469] dark:text-[#38bdf8] hover:bg-[#074469]/20 dark:hover:bg-[#1e3246] font-bold'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="material-symbols-outlined text-xl">admin_panel_settings</span>
                      <span>Painel Administrador</span>
                    </div>
                    <span className="text-[10px] bg-[#074469] dark:bg-[#38bdf8] text-white dark:text-[#082f49] px-2 py-0.5 rounded-full font-bold">
                      Admin
                    </span>
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Seção: AÇÕES RÁPIDAS */}
          <div>
            <span className="px-3 text-[11px] font-bold text-[#72787f] dark:text-[#5BE29D] uppercase tracking-wider block mb-2 font-['Plus_Jakarta_Sans']">
              Ações Rápidas
            </span>

            <div className="grid grid-cols-2 gap-2 font-['Inter']">
              <button
                onClick={() => {
                  onOpenPixModal();
                  if (window.innerWidth < 1024) onClose();
                }}
                className="p-3 bg-[#f7f9fb] dark:bg-[#101b26] hover:bg-[#cde5ff]/30 dark:hover:bg-[#182736] rounded-2xl border border-[#e0e3e5] dark:border-[#1e2c3c] dark:hover:border-[#5BE29D]/50 text-left transition-all cursor-pointer group"
              >
                <span className="material-symbols-outlined text-[#126b57] dark:text-[#5BE29D] text-2xl group-hover:scale-110 transition-transform">
                  volunteer_activism
                </span>
                <p className="text-xs font-bold text-[#074469] dark:text-white mt-1">Doar com PIX</p>
                <p className="text-[10px] text-[#72787f] dark:text-[#94a3b8]">Apoiar resgates</p>
              </button>

              <button
                onClick={() => {
                  onOpenIndicarModal();
                  if (window.innerWidth < 1024) onClose();
                }}
                className="p-3 bg-[#f7f9fb] dark:bg-[#101b26] hover:bg-[#cde5ff]/30 dark:hover:bg-[#182736] rounded-2xl border border-[#e0e3e5] dark:border-[#1e2c3c] dark:hover:border-[#5BE29D]/50 text-left transition-all cursor-pointer group"
              >
                <span className="material-symbols-outlined text-[#074469] dark:text-[#5BE29D] text-2xl group-hover:scale-110 transition-transform">
                  add_business
                </span>
                <p className="text-xs font-bold text-[#074469] dark:text-white mt-1">Indicar ONG</p>
                <p className="text-[10px] text-[#72787f] dark:text-[#94a3b8]">Cadastrar parceiro</p>
              </button>
            </div>
          </div>
        </div>

        {/* 3. Rodapé da Sidebar: Perfil / Autenticação */}
        <div className="p-4 border-t border-[#e0e3e5] dark:border-[#1e2c3c] bg-[#f7f9fb] dark:bg-[#0c1520] space-y-3 shrink-0">
          {/* Card do Usuário Comum (Adotante) */}
          {currentUser && (
            <div className="bg-white dark:bg-[#121d28] p-3 rounded-2xl border border-[#074469]/20 dark:border-[#1e2c3c] shadow-2xs flex items-center justify-between font-['Inter']">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-9 h-9 rounded-xl bg-[#074469] dark:bg-[#5BE29D]/20 text-white dark:text-[#5BE29D] border border-transparent dark:border-[#5BE29D]/30 flex items-center justify-center font-bold text-sm shrink-0">
                  {currentUser.name.charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <p className="font-bold text-xs text-[#191c1e] dark:text-[#f8fafc] truncate">{currentUser.name}</p>
                  <p className="text-[10px] text-[#126b57] dark:text-[#5BE29D] font-semibold">Adotante Conectado</p>
                </div>
              </div>

              <div className="flex items-center gap-1">
                {onOpenSecurityModal && (
                  <button
                    onClick={() => {
                      onOpenSecurityModal();
                      if (window.innerWidth < 1024) onClose();
                    }}
                    className="p-1.5 text-[#074469] dark:text-[#5BE29D] hover:bg-[#cde5ff]/40 dark:hover:bg-[#5BE29D]/20 rounded-xl transition-colors cursor-pointer"
                    title="Segurança da Conta: Trocar Senha / E-mail"
                  >
                    <span className="material-symbols-outlined text-lg">lock_reset</span>
                  </button>
                )}
                <button
                  onClick={() => {
                    onLogoutUser();
                    if (window.innerWidth < 1024) onClose();
                  }}
                  className="p-1.5 text-[#ba1a1a] dark:text-[#f87171] hover:bg-[#ffdad6]/60 dark:hover:bg-[#ef4444]/20 rounded-xl transition-colors cursor-pointer"
                  title="Sair da conta de adotante"
                >
                  <span className="material-symbols-outlined text-lg">logout</span>
                </button>
              </div>
            </div>
          )}

          {/* Card da ONG / Administrador */}
          {currentOng && (
            <div className="bg-white dark:bg-[#121d28] p-3 rounded-2xl border border-[#126b57]/30 dark:border-[#1e2c3c] shadow-2xs flex items-center justify-between font-['Inter']">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-9 h-9 rounded-xl bg-[#126b57] dark:bg-[#5BE29D]/20 text-[#a0efd6] dark:text-[#5BE29D] border border-transparent dark:border-[#5BE29D]/30 flex items-center justify-center font-bold text-sm shrink-0">
                  <span className="material-symbols-outlined text-lg">
                    {isAdmin ? 'admin_panel_settings' : 'domain'}
                  </span>
                </div>
                <div className="min-w-0">
                  <p className="font-bold text-xs text-[#191c1e] dark:text-[#f8fafc] truncate">{currentOng.name}</p>
                  <p className="text-[10px] text-[#126b57] dark:text-[#5BE29D] font-bold uppercase tracking-wider">
                    {isAdmin ? 'Administrador' : 'ONG Logada'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => {
                    onLogoutOng();
                    if (window.innerWidth < 1024) onClose();
                  }}
                  className="p-1.5 text-[#ba1a1a] dark:text-[#f87171] hover:bg-[#ffdad6]/60 dark:hover:bg-[#ef4444]/20 rounded-xl transition-colors cursor-pointer"
                  title="Sair da conta de ONG/Admin"
                >
                  <span className="material-symbols-outlined text-lg">logout</span>
                </button>
              </div>
            </div>
          )}

          {/* Botões de Acesso quando Deslogado */}
          {!currentUser && !currentOng && (
            <div className="space-y-2 font-['Inter']">
              <button
                onClick={() => {
                  onOpenAuth('user');
                  if (window.innerWidth < 1024) onClose();
                }}
                className="w-full bg-[#074469] dark:bg-[#5BE29D] hover:bg-[#2a5c82] dark:hover:bg-[#48cf8b] text-white dark:text-[#063e2e] font-bold py-2.5 px-4 rounded-xl text-xs flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-base">login</span>
                <span>Entrar como Adotante</span>
              </button>

              <button
                onClick={() => {
                  onOpenAuth('ong');
                  if (window.innerWidth < 1024) onClose();
                }}
                className="w-full bg-white dark:bg-[#121d28] hover:bg-[#e0e3e5] dark:hover:bg-[#1c2c3d] text-[#126b57] dark:text-[#5BE29D] border border-[#126b57]/30 dark:border-[#5BE29D]/40 font-bold py-2 px-4 rounded-xl text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-base">domain</span>
                <span>Acesso ONG / Admin</span>
              </button>
            </div>
          )}
        </div>
      </aside>
    </>
  );
};
