import React, { useState } from 'react';
import { ActiveTab } from '../types';

interface NavbarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  onOpenAuth: (mode: 'login' | 'register') => void;
  favoritesCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenAuth,
  favoritesCount
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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

          {/* Quick shortcut to ONG Dashboard */}
          <button
            onClick={() => handleNav('painel-ong')}
            className={`transition-colors duration-200 cursor-pointer text-sm px-3 py-1 rounded-full flex items-center gap-1.5 ${
              activeTab === 'painel-ong'
                ? 'bg-[#074469] text-white font-semibold'
                : 'bg-[#a0efd6]/50 text-[#126b57] hover:bg-[#a0efd6] font-medium'
            }`}
            title="Acessar o Painel de Gestão da ONG"
          >
            <span className="material-symbols-outlined text-base">dashboard</span>
            <span>Painel ONG</span>
          </button>
        </nav>

        {/* Actions (Desktop) */}
        <div className="hidden md:flex items-center gap-3 font-['Be_Vietnam_Pro'] text-sm font-semibold">
          {favoritesCount > 0 && (
            <span className="flex items-center gap-1 text-[#6d2f00] bg-[#ffdbc9] px-2.5 py-1 rounded-full text-xs font-semibold">
              <span className="material-symbols-outlined text-sm material-symbols-fill text-[#914100]">favorite</span>
              {favoritesCount}
            </span>
          )}
          <button
            onClick={() => onOpenAuth('login')}
            className="text-[#074469] px-4 py-2 hover:bg-[#e0e3e5]/60 rounded-lg transition-colors cursor-pointer"
          >
            Entrar
          </button>
          <button
            onClick={() => onOpenAuth('register')}
            className="bg-[#074469] text-white px-4 py-2 rounded-lg hover:bg-[#2a5c82] transition-colors shadow-sm cursor-pointer"
          >
            Cadastrar
          </button>
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
        <div className="md:hidden bg-[#f7f9fb] border-b border-[#e0e3e5] px-6 py-4 space-y-3 font-['Be_Vietnam_Pro'] shadow-lg">
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
          <button
            onClick={() => handleNav('painel-ong')}
            className={`block w-full text-left py-2 px-3 rounded-lg flex items-center gap-2 ${
              activeTab === 'painel-ong' ? 'bg-[#126b57] text-white font-semibold' : 'text-[#126b57] bg-[#a0efd6]/40'
            }`}
          >
            <span className="material-symbols-outlined text-sm">dashboard</span>
            Painel da ONG
          </button>

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
        </div>
      )}
    </header>
  );
};
