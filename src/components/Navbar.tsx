import React, { useState } from 'react';
import { ActiveTab, User, OngSession } from '../types';

interface NavbarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  onOpenAuth: (defaultProfile?: 'user' | 'ong') => void;
  favoritesCount: number;
  currentUser: User | null;
  currentOng: OngSession | null;
  onLogoutUser: () => void;
  onLogoutOng: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenAuth,
  favoritesCount,
  currentUser,
  currentOng,
  onLogoutUser,
  onLogoutOng
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isAdmin = currentOng?.role === 'admin';
  const isOng = currentOng?.role === 'ong';

  const handleNav = (tab: ActiveTab) => {
    setActiveTab(tab);
    setMobileMenuOpen(false);
  };

  return (
    <header className="fixed top-0 w-full z-50 shadow-xs bg-[#f7f9fb]/95 backdrop-blur-md border-b border-[#e0e3e5]/80">
      <div className="flex justify-between items-center px-4 md:px-16 h-20 max-w-7xl mx-auto">
        {/* Brand: MatchPet */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => handleNav('adotar')}
            className="text-left group flex items-center gap-2.5 cursor-pointer focus:outline-none"
            aria-label="MatchPet Início"
          >
            <div className="w-10 h-10 rounded-2xl bg-[#074469] text-[#a0efd6] flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
              <span className="material-symbols-outlined text-2xl">pets</span>
            </div>
            <div>
              <span className="font-['Plus_Jakarta_Sans'] text-2xl md:text-3xl font-extrabold text-[#074469] tracking-tight">
                Match<span className="text-[#126b57]">Pet</span>
              </span>
            </div>
          </button>
        </div>

        {/* Navigation Links (Desktop) */}
        <nav className="hidden md:flex gap-4 lg:gap-6 items-center font-['Be_Vietnam_Pro'] text-sm lg:text-base">
          <button
            onClick={() => handleNav('adotar')}
            className={`transition-colors duration-200 cursor-pointer font-medium pb-1 ${
              activeTab === 'adotar'
                ? 'text-[#074469] border-b-2 border-[#074469] font-bold'
                : 'text-[#41474e] hover:text-[#074469]'
            }`}
          >
            Adotar
          </button>

          <button
            onClick={() => handleNav('ongs')}
            className={`transition-colors duration-200 cursor-pointer font-medium pb-1 ${
              activeTab === 'ongs'
                ? 'text-[#074469] border-b-2 border-[#074469] font-bold'
                : 'text-[#41474e] hover:text-[#074469]'
            }`}
          >
            ONGs
          </button>

          {/* Aba Unificada para o Adotante Logado */}
          {currentUser && (
            <button
              onClick={() => handleNav('minhas-adocoes')}
              className={`transition-colors duration-200 cursor-pointer font-medium pb-1 flex items-center gap-1.5 ${
                activeTab === 'minhas-adocoes'
                  ? 'text-[#074469] border-b-2 border-[#074469] font-bold'
                  : 'text-[#41474e] hover:text-[#074469]'
              }`}
            >
              <span className="material-symbols-outlined text-base">assignment</span>
              <span>Minhas Adoções</span>
            </button>
          )}

          {/* Painel Exclusivo da ONG Logada */}
          {isOng && (
            <button
              onClick={() => handleNav('painel-ong')}
              className={`transition-all duration-200 cursor-pointer text-xs lg:text-sm px-3.5 py-1.5 rounded-full flex items-center gap-1.5 shadow-xs ${
                activeTab === 'painel-ong'
                  ? 'bg-[#126b57] text-white font-bold ring-2 ring-[#a0efd6]'
                  : 'bg-[#a0efd6]/60 text-[#126b57] hover:bg-[#a0efd6] font-bold border border-[#126b57]/20'
              }`}
            >
              <span className="material-symbols-outlined text-base">domain</span>
              <span>Painel da ONG</span>
            </button>
          )}

          {/* Painel do Administrador Geral */}
          {isAdmin && (
            <button
              onClick={() => handleNav('painel-admin')}
              className={`transition-all duration-200 cursor-pointer text-xs lg:text-sm px-3.5 py-1.5 rounded-full flex items-center gap-1.5 shadow-xs ${
                activeTab === 'painel-admin'
                  ? 'bg-[#074469] text-white font-bold ring-2 ring-[#a0efd6]'
                  : 'bg-[#074469]/10 text-[#074469] hover:bg-[#074469]/20 font-bold border border-[#074469]/30'
              }`}
            >
              <span className="material-symbols-outlined text-base">admin_panel_settings</span>
              <span>Painel Admin</span>
            </button>
          )}

          {!currentUser && !currentOng && (
            <>
              <button
                onClick={() => handleNav('acolhimento')}
                className={`transition-colors duration-200 cursor-pointer font-medium pb-1 ${
                  activeTab === 'acolhimento'
                    ? 'text-[#074469] border-b-2 border-[#074469] font-bold'
                    : 'text-[#41474e] hover:text-[#074469]'
                }`}
              >
                Como Apoiar
              </button>

              <button
                onClick={() => handleNav('sobre-nos')}
                className={`transition-colors duration-200 cursor-pointer font-medium pb-1 ${
                  activeTab === 'sobre-nos'
                    ? 'text-[#074469] border-b-2 border-[#074469] font-bold'
                    : 'text-[#41474e] hover:text-[#074469]'
                }`}
              >
                Sobre Nós
              </button>
            </>
          )}
        </nav>

        {/* Actions & Session Badges (Desktop) */}
        <div className="hidden md:flex items-center gap-3 font-['Be_Vietnam_Pro'] text-sm">
          {favoritesCount > 0 && (
            <span className="flex items-center gap-1 text-[#6d2f00] bg-[#ffdbc9] px-2.5 py-1 rounded-full text-xs font-bold">
              <span className="material-symbols-outlined text-sm material-symbols-fill text-[#914100]">favorite</span>
              {favoritesCount}
            </span>
          )}

          {/* Sessão da ONG ou Admin */}
          {currentOng && (
            <div className="flex items-center gap-2 bg-white border border-[#126b57]/40 px-3 py-1.5 rounded-2xl shadow-2xs">
              <div className="w-7 h-7 rounded-xl bg-[#126b57] text-[#a0efd6] flex items-center justify-center text-xs font-bold">
                <span className="material-symbols-outlined text-sm">
                  {isAdmin ? 'admin_panel_settings' : 'domain'}
                </span>
              </div>
              <div className="text-left">
                <div className="font-bold text-xs text-[#191c1e] max-w-[120px] truncate leading-tight">
                  {currentOng.name}
                </div>
                <span className="text-[9px] font-bold uppercase tracking-wider text-[#126b57]">
                  {isAdmin ? 'Administrador' : 'ONG Logada'}
                </span>
              </div>
              <button
                onClick={onLogoutOng}
                className="text-[#ba1a1a] hover:bg-[#ffdad6]/60 p-1 rounded-lg transition-colors cursor-pointer ml-1"
                title="Sair da conta de ONG / Admin"
              >
                <span className="material-symbols-outlined text-base">logout</span>
              </button>
            </div>
          )}

          {/* Sessão do Adotante (Usuário Comum) */}
          {currentUser && (
            <div className="flex items-center gap-2 bg-white border border-[#074469]/30 px-3 py-1.5 rounded-2xl shadow-2xs">
              <div className="w-7 h-7 rounded-xl bg-[#074469] text-white flex items-center justify-center text-xs font-bold">
                {currentUser.name.charAt(0).toUpperCase()}
              </div>
              <div className="text-left">
                <div className="font-bold text-xs text-[#191c1e] max-w-[110px] truncate leading-tight">
                  {currentUser.name}
                </div>
                <span className="text-[9px] font-bold uppercase tracking-wider text-[#074469]">
                  Adotante
                </span>
              </div>
              <button
                onClick={onLogoutUser}
                className="text-[#ba1a1a] hover:bg-[#ffdad6]/60 p-1 rounded-lg transition-colors cursor-pointer ml-1"
                title="Sair da conta de adotante"
              >
                <span className="material-symbols-outlined text-base">logout</span>
              </button>
            </div>
          )}

          {/* Botão de Autenticação se não houver login */}
          {!currentUser && !currentOng && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => onOpenAuth('user')}
                className="bg-[#074469] hover:bg-[#2a5c82] text-white px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer flex items-center gap-1.5"
              >
                <span className="material-symbols-outlined text-base">login</span>
                <span>Entrar / Cadastrar</span>
              </button>
            </div>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <div className="flex md:hidden items-center gap-2">
          {favoritesCount > 0 && (
            <span className="flex items-center gap-0.5 text-[#6d2f00] bg-[#ffdbc9] px-2 py-0.5 rounded-full text-xs font-bold">
              <span className="material-symbols-outlined text-xs material-symbols-fill text-[#914100]">favorite</span>
              {favoritesCount}
            </span>
          )}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-[#074469] hover:bg-[#e0e3e5] rounded-xl focus:outline-none"
            aria-label="Menu"
          >
            <span className="material-symbols-outlined">{mobileMenuOpen ? 'close' : 'menu'}</span>
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#f7f9fb] border-b border-[#e0e3e5] px-6 py-4 space-y-2.5 font-['Be_Vietnam_Pro'] shadow-lg animate-in slide-in-from-top duration-200">
          {currentUser && (
            <div className="flex items-center justify-between pb-3 border-b border-[#e0e3e5]">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-[#074469] text-white flex items-center justify-center font-bold text-xs">
                  {currentUser.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="font-bold text-xs text-[#191c1e]">{currentUser.name}</div>
                  <span className="text-[10px] text-[#074469] font-bold">Adotante Conectado</span>
                </div>
              </div>
              <button
                onClick={() => {
                  onLogoutUser();
                  setMobileMenuOpen(false);
                }}
                className="text-xs text-[#ba1a1a] font-bold bg-[#ffdad6]/60 px-3 py-1 rounded-lg"
              >
                Sair
              </button>
            </div>
          )}

          {currentOng && (
            <div className="flex items-center justify-between pb-3 border-b border-[#e0e3e5]">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-[#126b57] text-[#a0efd6] flex items-center justify-center font-bold text-xs">
                  <span className="material-symbols-outlined text-sm">domain</span>
                </div>
                <div>
                  <div className="font-bold text-xs text-[#191c1e]">{currentOng.name}</div>
                  <span className="text-[10px] text-[#126b57] font-bold">
                    {isAdmin ? 'Administrador' : 'ONG Conectada'}
                  </span>
                </div>
              </div>
              <button
                onClick={() => {
                  onLogoutOng();
                  setMobileMenuOpen(false);
                }}
                className="text-xs text-[#ba1a1a] font-bold bg-[#ffdad6]/60 px-3 py-1 rounded-lg"
              >
                Sair
              </button>
            </div>
          )}

          <button
            onClick={() => handleNav('adotar')}
            className={`block w-full text-left py-2 px-3 rounded-lg ${activeTab === 'adotar' ? 'bg-[#074469] text-white font-bold' : 'text-[#41474e]'}`}
          >
            Adotar Pets
          </button>
          <button
            onClick={() => handleNav('ongs')}
            className={`block w-full text-left py-2 px-3 rounded-lg ${activeTab === 'ongs' ? 'bg-[#074469] text-white font-bold' : 'text-[#41474e]'}`}
          >
            ONGs Parceiras
          </button>

          {currentUser && (
            <button
              onClick={() => handleNav('minhas-adocoes')}
              className={`block w-full text-left py-2 px-3 rounded-lg ${activeTab === 'minhas-adocoes' ? 'bg-[#074469] text-white font-bold' : 'text-[#41474e]'}`}
            >
              Minhas Adoções
            </button>
          )}

          {isOng && (
            <button
              onClick={() => handleNav('painel-ong')}
              className={`block w-full text-left py-2 px-3 rounded-lg bg-[#a0efd6]/50 text-[#126b57] font-bold`}
            >
              Painel da ONG
            </button>
          )}

          {isAdmin && (
            <button
              onClick={() => handleNav('painel-admin')}
              className={`block w-full text-left py-2 px-3 rounded-lg bg-[#074469] text-white font-bold`}
            >
              Painel do Administrador
            </button>
          )}

          {!currentUser && !currentOng && (
            <div className="pt-3 border-t border-[#e0e3e5] space-y-2">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenAuth('user');
                }}
                className="w-full py-2.5 text-center bg-[#074469] text-white rounded-xl font-bold text-xs"
              >
                Entrar / Cadastrar no MatchPet
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
};
