import React, { useState } from 'react';
import { User, OngSession } from '../types';
import { authService } from '../services/authService';

interface AccountSecurityModalProps {
  currentUser: User | null;
  currentOng: OngSession | null;
  onClose: () => void;
  onSuccess?: (msg: string) => void;
  initialMode?: 'password' | 'email';
}

export const AccountSecurityModal: React.FC<AccountSecurityModalProps> = ({
  currentUser,
  currentOng,
  onClose,
  onSuccess,
  initialMode = 'password'
}) => {
  const [activeMode, setActiveMode] = useState<'password' | 'email'>(initialMode);

  // Estados de Senha
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Estados de E-mail
  const [newEmail, setNewEmail] = useState('');
  const [confirmEmail, setConfirmEmail] = useState('');

  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const currentEmailDisplay = currentUser?.email || currentOng?.email || 'Não informado';
  const accountHolderName = currentUser?.name || currentOng?.name || 'Sua Conta';

  const isOng = currentOng?.role === 'ong';
  const isAdmin = currentOng?.role === 'admin';

  // Handler: Trocar Senha (Adotante)
  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMessage(null);

    if (!currentPassword.trim()) {
      setStatusMessage({ type: 'error', text: 'Informe sua senha atual para autorizar a alteração.' });
      return;
    }

    if (newPassword !== confirmPassword) {
      setStatusMessage({ type: 'error', text: 'A confirmação de senha não confere.' });
      return;
    }

    if (newPassword.length < 6) {
      setStatusMessage({ type: 'error', text: 'A nova senha deve conter no mínimo 6 caracteres.' });
      return;
    }

    if (newPassword.trim() === currentPassword.trim()) {
      setStatusMessage({ type: 'error', text: 'A nova senha deve ser diferente da senha atual.' });
      return;
    }

    setLoading(true);
    try {
      const result = await authService.updatePassword(newPassword, currentPassword);
      if (!result.success) {
        setStatusMessage({ type: 'error', text: result.error || 'Erro ao alterar a senha.' });
      } else {
        setStatusMessage({ type: 'success', text: result.message || 'Senha alterada com sucesso via Supabase!' });
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        if (onSuccess) onSuccess('Senha atualizada com sucesso!');
        setTimeout(() => {
          onClose();
        }, 1600);
      }
    } catch (err: any) {
      setStatusMessage({ type: 'error', text: err?.message || 'Falha na comunicação com o Supabase.' });
    } finally {
      setLoading(false);
    }
  };

  // Handler: Trocar E-mail (Adotante)
  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMessage(null);

    if (newEmail.trim().toLowerCase() !== confirmEmail.trim().toLowerCase()) {
      setStatusMessage({ type: 'error', text: 'A confirmação do novo e-mail não confere.' });
      return;
    }

    if (!newEmail.includes('@') || newEmail.length < 5) {
      setStatusMessage({ type: 'error', text: 'Informe um endereço de e-mail válido.' });
      return;
    }

    setLoading(true);
    try {
      const result = await authService.updateEmail(newEmail);
      if (!result.success) {
        setStatusMessage({ type: 'error', text: result.error || 'Erro ao atualizar e-mail.' });
      } else {
        setStatusMessage({ type: 'success', text: result.message || 'E-mail atualizado com sucesso no Supabase!' });
        setNewEmail('');
        setConfirmEmail('');
        if (onSuccess) onSuccess('E-mail atualizado com sucesso!');
        setTimeout(() => {
          onClose();
        }, 1800);
      }
    } catch (err: any) {
      setStatusMessage({ type: 'error', text: err?.message || 'Falha ao atualizar e-mail no Supabase.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 md:p-8 shadow-2xl border border-[#e0e3e5] relative animate-in fade-in zoom-in duration-200 font-['Be_Vietnam_Pro']">
        {/* Botão de Fechar */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-[#72787f] hover:text-[#191c1e] p-1.5 rounded-full hover:bg-[#e0e3e5] cursor-pointer"
          aria-label="Fechar"
        >
          <span className="material-symbols-outlined">close</span>
        </button>

        {/* Cabeçalho do Modal no padrão MatchPet */}
        <div className="flex items-center gap-3 mb-5">
          <div className="w-11 h-11 rounded-2xl bg-[#074469]/10 text-[#074469] flex items-center justify-center shadow-xs">
            <span className="material-symbols-outlined text-2xl">
              {activeMode === 'password' ? 'lock_reset' : 'mark_email_read'}
            </span>
          </div>
          <div>
            <h3 className="font-['Plus_Jakarta_Sans'] text-xl md:text-2xl font-bold text-[#074469]">
              {activeMode === 'password' ? 'Alterar Senha' : 'Alterar E-mail'}
            </h3>
            <p className="text-xs text-[#72787f]">
              Gerenciamento de segurança autenticado via <strong>Supabase</strong>
            </p>
          </div>
        </div>

        {/* Seletor de Abas (Apenas Senha e E-mail) */}
        <div className="flex bg-[#eceef0] p-1 rounded-2xl mb-6 text-xs font-bold">
          <button
            type="button"
            onClick={() => {
              setActiveMode('password');
              setStatusMessage(null);
            }}
            className={`flex-1 py-2.5 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              activeMode === 'password' ? 'bg-[#074469] text-white shadow-xs' : 'text-[#41474e] hover:text-[#074469]'
            }`}
          >
            <span className="material-symbols-outlined text-sm">key</span>
            <span>Alterar Senha</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveMode('email');
              setStatusMessage(null);
            }}
            className={`flex-1 py-2.5 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              activeMode === 'email' ? 'bg-[#074469] text-white shadow-xs' : 'text-[#41474e] hover:text-[#074469]'
            }`}
          >
            <span className="material-symbols-outlined text-sm">mail</span>
            <span>Alterar E-mail</span>
          </button>
        </div>

        {/* Banner de Feedback / Alerta */}
        {statusMessage && (
          <div
            className={`mb-4 p-3 rounded-xl text-xs font-semibold flex items-center gap-2 ${
              statusMessage.type === 'success'
                ? 'bg-[#a0efd6]/60 border border-[#126b57]/30 text-[#126b57]'
                : 'bg-[#ffdad6] text-[#ba1a1a]'
            }`}
          >
            <span className="material-symbols-outlined text-base shrink-0">
              {statusMessage.type === 'success' ? 'check_circle' : 'error'}
            </span>
            <span>{statusMessage.text}</span>
          </div>
        )}

        {/* ========================================================================= */}
        {/* ABA 1: TROCAR SENHA */}
        {/* ========================================================================= */}
        {activeMode === 'password' && (
          isOng || isAdmin ? (
            <div className="space-y-4 text-sm">
              <div className="bg-[#f7f9fb] p-3 rounded-xl border border-[#e0e3e5] text-xs text-[#41474e]">
                Perfil: <strong className="text-[#074469]">{accountHolderName}</strong> ({currentEmailDisplay})
              </div>

              <div className="bg-[#ffdad6]/40 border border-[#ffdad6] text-[#ba1a1a] p-4 rounded-2xl text-xs space-y-2">
                <div className="flex items-center gap-2 font-bold text-sm">
                  <span className="material-symbols-outlined text-base">admin_panel_settings</span>
                  <span>{isAdmin ? 'Credenciais do Administrador' : 'Gerenciamento Exclusivo do Administrador'}</span>
                </div>
                <p className="leading-relaxed text-[#41474e]">
                  {isAdmin
                    ? 'As credenciais do Administrador Geral são fixas no sistema por questões de segurança institucional.'
                    : 'A senha de acesso da sua ONG é gerenciada e alterada exclusivamente pelo Administrador Geral no Painel de Administração.'}
                </p>
                {!isAdmin && (
                  <p className="text-[11px] text-[#72787f]">
                    Caso precise redefinir sua senha, solicite suporte à administração do MatchPet.
                  </p>
                )}
              </div>

              <button
                type="button"
                onClick={onClose}
                className="w-full bg-[#074469] hover:bg-[#2a5c82] text-white font-bold py-2.5 rounded-xl transition-all shadow-sm cursor-pointer text-xs"
              >
                Entendido
              </button>
            </div>
          ) : (
            <form onSubmit={handlePasswordSubmit} className="space-y-3.5 text-sm">
              <div className="bg-[#f7f9fb] p-3 rounded-xl border border-[#e0e3e5] text-xs text-[#41474e] mb-2">
                Conta de Adotante: <strong className="text-[#074469]">{accountHolderName}</strong> ({currentEmailDisplay})
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#41474e] mb-1">
                  Senha Atual *
                </label>
                <input
                  type="password"
                  required
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Digite sua senha atual"
                  className="w-full bg-[#f2f4f6] border border-[#c1c7cf] rounded-xl p-2.5 outline-none focus:border-[#074469] focus:bg-white text-xs font-mono"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-xs font-semibold text-[#41474e]">
                    Nova Senha *
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-[11px] text-[#074469] hover:underline cursor-pointer"
                  >
                    {showPassword ? 'Ocultar' : 'Mostrar'}
                  </button>
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Mínimo 6 caracteres"
                  className="w-full bg-[#f2f4f6] border border-[#c1c7cf] rounded-xl p-2.5 outline-none focus:border-[#074469] focus:bg-white text-xs font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#41474e] mb-1">
                  Confirmar Nova Senha *
                </label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repita a nova senha"
                  className="w-full bg-[#f2f4f6] border border-[#c1c7cf] rounded-xl p-2.5 outline-none focus:border-[#074469] focus:bg-white text-xs font-mono"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#074469] hover:bg-[#2a5c82] disabled:opacity-60 text-white font-bold py-3 rounded-xl transition-all shadow-sm cursor-pointer text-sm"
                >
                  {loading ? 'Atualizando no Supabase...' : 'Salvar Nova Senha'}
                </button>
              </div>
            </form>
          )
        )}

        {/* ========================================================================= */}
        {/* ABA 2: TROCAR E-MAIL */}
        {/* ========================================================================= */}
        {activeMode === 'email' && (
          isOng || isAdmin ? (
            <div className="space-y-4 text-sm">
              <div className="bg-[#f7f9fb] p-3 rounded-xl border border-[#e0e3e5] text-xs text-[#41474e]">
                Perfil: <strong className="text-[#074469]">{accountHolderName}</strong> ({currentEmailDisplay})
              </div>

              <div className="bg-[#ffdad6]/40 border border-[#ffdad6] text-[#ba1a1a] p-4 rounded-2xl text-xs space-y-2">
                <div className="flex items-center gap-2 font-bold text-sm">
                  <span className="material-symbols-outlined text-base">admin_panel_settings</span>
                  <span>{isAdmin ? 'E-mail do Administrador' : 'Alteração Restrita ao Administrador'}</span>
                </div>
                <p className="leading-relaxed text-[#41474e]">
                  {isAdmin
                    ? 'O e-mail do Administrador Geral é fixo e não pode ser alterado.'
                    : 'O e-mail cadastrado da ONG só pode ser alterado pelo Administrador Geral no Painel de Administração de ONGs.'}
                </p>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="w-full bg-[#074469] hover:bg-[#2a5c82] text-white font-bold py-2.5 rounded-xl transition-all shadow-sm cursor-pointer text-xs"
              >
                Entendido
              </button>
            </div>
          ) : (
            <form onSubmit={handleEmailSubmit} className="space-y-3.5 text-sm">
              <div className="bg-[#f7f9fb] p-3 rounded-xl border border-[#e0e3e5] text-xs text-[#41474e] mb-2">
                E-mail atual: <strong className="text-[#074469]">{currentEmailDisplay}</strong>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#41474e] mb-1">
                  Novo Endereço de E-mail *
                </label>
                <input
                  type="email"
                  required
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="novo@email.com"
                  className="w-full bg-[#f2f4f6] border border-[#c1c7cf] rounded-xl p-2.5 outline-none focus:border-[#074469] focus:bg-white text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#41474e] mb-1">
                  Confirmar Novo E-mail *
                </label>
                <input
                  type="email"
                  required
                  value={confirmEmail}
                  onChange={(e) => setConfirmEmail(e.target.value)}
                  placeholder="Repita o novo e-mail"
                  className="w-full bg-[#f2f4f6] border border-[#c1c7cf] rounded-xl p-2.5 outline-none focus:border-[#074469] focus:bg-white text-xs"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#074469] hover:bg-[#2a5c82] disabled:opacity-60 text-white font-bold py-3 rounded-xl transition-all shadow-sm cursor-pointer text-sm"
                >
                  {loading ? 'Atualizando no Supabase...' : 'Atualizar E-mail'}
                </button>
              </div>
            </form>
          )
        )}
      </div>
    </div>
  );
};
