import React, { useState } from 'react';
import { ActiveTab, User } from '../types';

interface NavbarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  onOpenAuth: (mode: 'login' | 'register') => void;
  favoritesCount: number;
  currentUser: User | null;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenAuth,
  favoritesCount,
  currentUser,
  onLogout
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isAdmin = currentUser?.role === 'admin';

  const handleNav = (tab: ActiveTab) => {
    setActiveTab(tab);
    setMobileMenuOpen(false);
  };

  return (
    <header className="fixed top-0 w-full z-50 shadow-sm bg-[#f7f9fb] border-b border-[#e0e3e5]/60">
      <div className="flex justify-between items-center px-4 md:px-16 h-20 max-w-7xl mx-auto">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => handleNav('adotar')}
            className="text-left group flex items-center gap-2 cursor-pointer focus:outline-none"
            aria-label="CorrenteCão Início"
          >
            <span className="font-['Plus_Jakarta_Sans'] text-2xl md:text-3xl font-bold text-[#074469] group-hover:opacity-90 transition-opacity">
              CorrenteCão
            </span>
          </button>
        </div>

        {/* Navigation Links (Desktop) */}
        <nav className="hidden md:flex gap-6 lg:gap-8 items-center font-['Be_Vietnam_Pro'] text-base">
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

          {/* CONTROLE DE ACESSO: O Painel ONG é exibido EXCLUSIVAMENTE para administradores */}
          {isAdmin && (
            <button
              onClick={() => handleNav('painel-ong')}
              className={`transition-all duration-200 cursor-pointer text-sm px-3.5 py-1.5 rounded-full flex items-center gap-1.5 shadow-xs ${
                activeTab === 'painel-ong'
                  ? 'bg-[#074469] text-white font-semibold ring-2 ring-[#a0efd6]'
                  : 'bg-[#a0efd6]/60 text-[#074469] hover:bg-[#a0efd6] font-bold border border-[#074469]/20'
              }`}
              title="Acessar o Painel de Gestão da ONG (Exclusivo Administrador)"
            >
              <span className="material-symbols-outlined text-base">admin_panel_settings</span>
              <span>Painel ONG</span>
            </button>
          )}
        </nav>

        {/* Actions & User State (Desktop) */}
        <div className="hidden md:flex items-center gap-3 font-['Be_Vietnam_Pro'] text-sm">
          {favoritesCount > 0 && (
            <span className="flex items-center gap-1 text-[#6d2f00] bg-[#ffdbc9] px-2.5 py-1 rounded-full text-xs font-semibold">
              <span className="material-symbols-outlined text-sm material-symbols-fill text-[#914100]">favorite</span>
              {favoritesCount}
            </span>
          )}

          {currentUser ? (
            <div className="flex items-center gap-3 bg-white/80 border border-[#e0e3e5] px-3 py-1.5 rounded-xl shadow-2xs">
              <div className="flex items-center gap-2">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                    isAdmin ? 'bg-[#074469] text-[#a0efd6]' : 'bg-[#e0e3e5] text-[#074469]'
                  }`}
                >
                  {currentUser.name.charAt(0).toUpperCase()}
                </div>
                <div className="text-left">
                  <div className="font-semibold text-xs text-[#191c1e] max-w-[130px] truncate leading-tight">
                    {currentUser.name}
                  </div>
                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.2 rounded ${
                      isAdmin ? 'bg-[#074469] text-[#a0efd6]' : 'bg-[#e0e3e5] text-[#5b636a]'
                    }`}
                  >
                    {isAdmin ? 'Admin' : 'Usuário'}
                  </span>
                </div>
              </div>

              <button
                onClick={onLogout}
                className="text-[#ba1a1a] hover:bg-[#ffdad6]/60 p-1.5 rounded-lg transition-colors cursor-pointer ml-1"
                title="Sair da conta"
              >
                <span className="material-symbols-outlined text-lg">logout</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => onOpenAuth('login')}
                className="text-[#074469] px-4 py-2 hover:bg-[#e0e3e5]/60 rounded-lg transition-colors cursor-pointer font-semibold"
              >
                Entrar
              </button>
              <button
                onClick={() => onOpenAuth('register')}
                className="bg-[#074469] text-white px-4 py-2 rounded-lg hover:bg-[#2a5c82] transition-colors shadow-sm cursor-pointer font-semibold"
              >
                Cadastrar
              </button>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="flex md:hidden items-center gap-2">
          {favoritesCount > 0 && (
            <span className="flex items-center gap-0.5 text-[#6d2f00] bg-[#ffdbc9] px-2 py-0.5 rounded-full text-xs font-bold">
              <span className="material-symbols-outlined text-xs material-symbols-fill text-[#914100]">favorite</span>
              {favoritesCount}
            </span>
          )}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-[#074469] hover:bg-[#e0e3e5] rounded-lg focus:outline-none"
            aria-label="Abrir Menu"
          >
            <span className="material-symbols-outlined">{mobileMenuOpen ? 'close' : 'menu'}</span>
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#f7f9fb] border-b border-[#e0e3e5] px-6 py-4 space-y-3 font-['Be_Vietnam_Pro'] shadow-lg animate-in slide-in-from-top duration-200">
          {currentUser && (
            <div className="flex items-center justify-between pb-3 border-b border-[#e0e3e5]">
              <div className="flex items-center gap-2.5">
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold ${
                    isAdmin ? 'bg-[#074469] text-[#a0efd6]' : 'bg-[#e0e3e5] text-[#074469]'
                  }`}
                >
                  {currentUser.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="font-bold text-sm text-[#191c1e]">{currentUser.name}</div>
                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded ${
                      isAdmin ? 'bg-[#074469] text-[#a0efd6]' : 'bg-[#e0e3e5] text-[#5b636a]'
                    }`}
                  >
                    {isAdmin ? 'Administrador' : 'Usuário Padrão'}
                  </span>
                </div>
              </div>
              <button
                onClick={() => {
                  onLogout();
                  setMobileMenuOpen(false);
                }}
                className="text-xs text-[#ba1a1a] font-semibold bg-[#ffdad6]/60 px-3 py-1.5 rounded-lg flex items-center gap-1"
              >
                <span className="material-symbols-outlined text-sm">logout</span>
                Sair
              </button>
            </div>
          )}

          <button
            onClick={() => handleNav('adotar')}
            className={`block w-full text-left py-2 px-3 rounded-lg ${
              activeTab === 'adotar' ? 'bg-[#074469] text-white font-semibold' : 'text-[#41474e]'
            }`}
          >
            Adotar
          </button>
          <button
            onClick={() => handleNav('ongs')}
            className={`block w-full text-left py-2 px-3 rounded-lg ${
              activeTab === 'ongs' ? 'bg-[#074469] text-white font-semibold' : 'text-[#41474e]'
            }`}
          >
            ONGs
          </button>
          <button
            onClick={() => handleNav('acolhimento')}
            className={`block w-full text-left py-2 px-3 rounded-lg ${
              activeTab === 'acolhimento' ? 'bg-[#074469] text-white font-semibold' : 'text-[#41474e]'
            }`}
          >
            Como Apoiar / Acolhimento
          </button>
          <button
            onClick={() => handleNav('sobre-nos')}
            className={`block w-full text-left py-2 px-3 rounded-lg ${
              activeTab === 'sobre-nos' ? 'bg-[#074469] text-white font-semibold' : 'text-[#41474e]'
            }`}
          >
            Sobre Nós
          </button>

          {/* CONTROLE DE ACESSO MOBILE: Exibe Painel ONG somente para Administrador */}
          {isAdmin && (
            <button
              onClick={() => handleNav('painel-ong')}
              className={`block w-full text-left py-2 px-3 rounded-lg flex items-center gap-2 ${
                activeTab === 'painel-ong'
                  ? 'bg-[#074469] text-white font-semibold'
                  : 'text-[#074469] bg-[#a0efd6]/50 font-bold'
              }`}
            >
              <span className="material-symbols-outlined text-sm">admin_panel_settings</span>
              Painel da ONG (Admin)
            </button>
          )}

          {!currentUser && (
            <div className="pt-3 border-t border-[#e0e3e5] flex gap-2">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenAuth('login');
                }}
                className="flex-1 py-2 text-center text-[#074469] border border-[#074469] rounded-lg font-semibold"
              >
                Entrar
              </button>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenAuth('register');
                }}
                className="flex-1 py-2 text-center bg-[#074469] text-white rounded-lg font-semibold shadow-sm"
              >
                Cadastrar
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
};
