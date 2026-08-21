import React, { useState } from 'react';
import { Pet, ONG, Solicitation, FosterRequest, User, OngSession } from '../types';
import { authService, ADMIN_CREDENTIALS } from '../services/authService';

/* 1. Manifestar Interesse / Agendar Visita Modal */
export { AdoptionInterestModal } from './AdoptionInterestModal';

/* 2. Indicar ONG Modal */
interface IndicarOngModalProps {
  onClose: () => void;
  onSubmit: (ong: Partial<ONG>) => void;
}

export const IndicarOngModal: React.FC<IndicarOngModalProps> = ({ onClose, onSubmit }) => {
  const [name, setName] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('SP');
  const [phone, setPhone] = useState('');
  const [description, setDescription] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !city || !phone) return;
    onSubmit({
      name,
      city,
      state,
      phone,
      description
    });
    setSubmitted(true);
    setTimeout(() => {
      onClose();
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto font-['Plus_Jakarta_Sans']">
      <div className="bg-white dark:bg-[#121d28] rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-[#e2e8f0] dark:border-[#1e2c3c] relative animate-in fade-in zoom-in duration-200 text-left">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-[#64748b] dark:text-[#94a3b8] hover:text-[#0f172a] dark:hover:text-white p-2 rounded-full hover:bg-[#f1f5f9] dark:hover:bg-[#162230] cursor-pointer transition-colors"
        >
          <span className="material-symbols-outlined text-xl">close</span>
        </button>

        {submitted ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-[#a0efd6]/50 dark:bg-[#5BE29D]/20 text-[#126b57] dark:text-[#5BE29D] border border-[#126b57]/20 dark:border-[#5BE29D]/40 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xs">
              <span className="material-symbols-outlined text-3xl">thumb_up</span>
            </div>
            <h3 className="font-['Plus_Jakarta_Sans'] text-2xl font-bold text-[#074469] dark:text-white mb-2">
              Indicação Enviada!
            </h3>
            <p className="font-['Inter'] text-sm text-[#475569] dark:text-[#cbd5e1]">
              A equipe do MatchPet entrará em contato para cadastrar a instituição.
            </p>
          </div>
        ) : (
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-2xl bg-[#074469]/10 dark:bg-[#5BE29D]/15 text-[#074469] dark:text-[#5BE29D] flex items-center justify-center shadow-2xs">
                <span className="material-symbols-outlined text-2xl">add_business</span>
              </div>
              <div>
                <h3 className="font-['Plus_Jakarta_Sans'] text-xl sm:text-2xl font-bold text-[#074469] dark:text-white">
                  Indicar uma ONG
                </h3>
                <p className="font-['Inter'] text-xs text-[#64748b] dark:text-[#94a3b8]">
                  Ajude a expandir a rede de adoção do MatchPet.
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3.5 mt-5 font-['Inter'] text-sm">
              <div>
                <label className="block text-xs font-bold text-[#0f172a] dark:text-[#f1f5f9] mb-1">
                  Nome da ONG ou Protetor *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ex: Associação Patinhas do Bem"
                  className="w-full bg-[#f8fafc] dark:bg-[#162230] border border-[#cbd5e1] dark:border-[#2b3e52] rounded-xl px-3.5 py-2.5 outline-none focus:border-[#074469] dark:focus:border-[#5BE29D] text-sm text-[#0f172a] dark:text-[#f1f5f9]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#0f172a] dark:text-[#f1f5f9] mb-1">
                    Cidade *
                  </label>
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Ex: São Paulo"
                    className="w-full bg-[#f8fafc] dark:bg-[#162230] border border-[#cbd5e1] dark:border-[#2b3e52] rounded-xl px-3.5 py-2.5 outline-none focus:border-[#074469] dark:focus:border-[#5BE29D] text-sm text-[#0f172a] dark:text-[#f1f5f9]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#0f172a] dark:text-[#f1f5f9] mb-1">
                    Estado (UF)
                  </label>
                  <input
                    type="text"
                    value={state}
                    onChange={(e) => setState(e.target.value.toUpperCase().slice(0, 2))}
                    placeholder="SP"
                    className="w-full bg-[#f8fafc] dark:bg-[#162230] border border-[#cbd5e1] dark:border-[#2b3e52] rounded-xl px-3.5 py-2.5 outline-none focus:border-[#074469] dark:focus:border-[#5BE29D] uppercase font-mono text-sm text-[#0f172a] dark:text-[#f1f5f9]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#0f172a] dark:text-[#f1f5f9] mb-1">
                  Telefone / WhatsApp de Contato *
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="(11) 98765-4321"
                  className="w-full bg-[#f8fafc] dark:bg-[#162230] border border-[#cbd5e1] dark:border-[#2b3e52] rounded-xl px-3.5 py-2.5 outline-none focus:border-[#074469] dark:focus:border-[#5BE29D] text-sm text-[#0f172a] dark:text-[#f1f5f9]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#0f172a] dark:text-[#f1f5f9] mb-1">
                  Breve descrição ou link das redes sociais
                </label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Ex: @ongpatinhas no Instagram, atuam com cães resgatados..."
                  className="w-full bg-[#f8fafc] dark:bg-[#162230] border border-[#cbd5e1] dark:border-[#2b3e52] rounded-xl px-3.5 py-2.5 outline-none focus:border-[#074469] dark:focus:border-[#5BE29D] resize-none text-sm text-[#0f172a] dark:text-[#f1f5f9]"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full bg-[#074469] dark:bg-[#5BE29D] hover:bg-[#2a5c82] dark:hover:bg-[#48cf8b] text-white dark:text-[#063e2e] font-bold py-3.5 rounded-2xl transition-all shadow-xs cursor-pointer min-h-[44px]"
                >
                  Enviar Indicação
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

/* 3. Auth Modal (DOIS SISTEMAS DE LOGIN 100% INDEPENDENTES: ADOTANTE VS ONG/ADMIN) */
interface AuthModalProps {
  defaultProfile?: 'user' | 'ong';
  onClose: () => void;
  onUserSuccess?: (user: User) => void;
  onOngSuccess?: (session: OngSession) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  defaultProfile = 'user',
  onClose,
  onUserSuccess,
  onOngSuccess
}) => {
  const [profileType, setProfileType] = useState<'user' | 'ong'>(defaultProfile);
  const [userMode, setUserMode] = useState<'login' | 'register'>('login');

  // Adotante states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');

  // ONG/Admin states
  const [ongEmail, setOngEmail] = useState('');
  const [ongPassword, setOngPassword] = useState('');

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fillAdminCredentials = () => {
    setOngEmail(ADMIN_CREDENTIALS.email);
    setOngPassword(ADMIN_CREDENTIALS.plainPassword);
    setErrorMessage(null);
  };

  const handleUserSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setLoading(true);

    try {
      if (userMode === 'login') {
        const result = await authService.loginUser(email, password);
        if (!result.success || !result.user) {
          setErrorMessage(result.error || 'Credenciais de adotante inválidas.');
          setLoading(false);
          return;
        }
        if (onUserSuccess) onUserSuccess(result.user);
        onClose();
      } else {
        const result = await authService.registerUser(name, email, password, phone);
        if (!result.success || !result.user) {
          setErrorMessage(result.error || 'Não foi possível cadastrar a conta de adotante.');
          setLoading(false);
          return;
        }
        if (onUserSuccess) onUserSuccess(result.user);
        onClose();
      }
    } catch (err: any) {
      setErrorMessage(err?.message || 'Erro ao autenticar.');
    } finally {
      setLoading(false);
    }
  };

  const handleOngSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setLoading(true);

    try {
      const result = await authService.loginOngOrAdmin(ongEmail, ongPassword);
      if (!result.success || !result.session) {
        setErrorMessage(result.error || 'Credenciais de ONG ou Administrador inválidas.');
        setLoading(false);
        return;
      }
      if (onOngSuccess) onOngSuccess(result.session);
      onClose();
    } catch (err: any) {
      setErrorMessage(err?.message || 'Erro ao processar login de ONG/Admin.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto font-['Plus_Jakarta_Sans']">
      <div className="bg-white dark:bg-[#121d28] rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-[#e2e8f0] dark:border-[#1e2c3c] relative animate-in fade-in zoom-in duration-200 text-left">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-[#64748b] dark:text-[#94a3b8] hover:text-[#0f172a] dark:hover:text-white p-2 rounded-full hover:bg-[#f1f5f9] dark:hover:bg-[#162230] cursor-pointer transition-colors"
        >
          <span className="material-symbols-outlined text-xl">close</span>
        </button>

        {/* Alternador de Perfil: Adotante vs ONG/Admin */}
        <div className="flex bg-[#f1f5f9] dark:bg-[#162230] p-1 rounded-2xl mb-6 border border-[#e2e8f0] dark:border-[#2b3e52]">
          <button
            type="button"
            onClick={() => {
              setProfileType('user');
              setErrorMessage(null);
            }}
            className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              profileType === 'user'
                ? 'bg-[#074469] text-white shadow-xs'
                : 'text-[#475569] dark:text-[#cbd5e1] hover:text-[#0f172a]'
            }`}
          >
            <span className="material-symbols-outlined text-base">person</span>
            <span>Sou Adotante</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setProfileType('ong');
              setErrorMessage(null);
            }}
            className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              profileType === 'ong'
                ? 'bg-[#126b57] text-white shadow-xs'
                : 'text-[#475569] dark:text-[#cbd5e1] hover:text-[#0f172a]'
            }`}
          >
            <span className="material-symbols-outlined text-base">domain</span>
            <span>ONG / Admin</span>
          </button>
        </div>

        {errorMessage && (
          <div className="mb-4 bg-[#ffdad6] dark:bg-[#ba1a1a]/20 border border-[#ba1a1a] text-[#93000a] dark:text-[#f87171] p-3 rounded-xl text-xs font-semibold flex items-center gap-2">
            <span className="material-symbols-outlined text-base shrink-0">error</span>
            <span>{errorMessage}</span>
          </div>
        )}

        {/* ========================================================================= */}
        {/* PERFIL: ADOTANTE (LOGIN OU CADASTRO) */}
        {/* ========================================================================= */}
        {profileType === 'user' && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="font-['Plus_Jakarta_Sans'] font-bold text-lg text-[#074469] dark:text-white">
                  {userMode === 'login' ? 'Entrar como Adotante' : 'Cadastro de Adotante'}
                </h3>
                <p className="font-['Inter'] text-xs text-[#64748b] dark:text-[#94a3b8] mt-0.5">
                  {userMode === 'login'
                    ? 'Acesse suas manifestações de interesse e histórico.'
                    : 'Crie sua conta para manifestar interesse em animais.'}
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setUserMode(userMode === 'login' ? 'register' : 'login');
                  setErrorMessage(null);
                }}
                className="text-xs text-[#074469] dark:text-[#5BE29D] font-bold hover:underline cursor-pointer"
              >
                {userMode === 'login' ? 'Criar Conta' : 'Já tenho conta'}
              </button>
            </div>

            <form onSubmit={handleUserSubmit} className="space-y-3 font-['Inter'] text-sm">
              {userMode === 'register' && (
                <>
                  <div>
                    <label className="block text-xs font-bold text-[#0f172a] dark:text-[#f1f5f9] mb-1">
                      Nome Completo *
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Ex: Maria Silva"
                      className="w-full bg-[#f8fafc] dark:bg-[#162230] border border-[#cbd5e1] dark:border-[#2b3e52] rounded-xl p-2.5 outline-none focus:border-[#074469] dark:focus:border-[#5BE29D] text-xs text-[#0f172a] dark:text-[#f1f5f9]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#0f172a] dark:text-[#f1f5f9] mb-1">
                      Telefone / WhatsApp *
                    </label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="(11) 98765-4321"
                      className="w-full bg-[#f8fafc] dark:bg-[#162230] border border-[#cbd5e1] dark:border-[#2b3e52] rounded-xl p-2.5 outline-none focus:border-[#074469] dark:focus:border-[#5BE29D] text-xs text-[#0f172a] dark:text-[#f1f5f9]"
                    />
                  </div>
                </>
              )}

              <div>
                <label className="block text-xs font-bold text-[#0f172a] dark:text-[#f1f5f9] mb-1">
                  E-mail do Adotante *
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seuemail@exemplo.com"
                  className="w-full bg-[#f8fafc] dark:bg-[#162230] border border-[#cbd5e1] dark:border-[#2b3e52] rounded-xl p-2.5 outline-none focus:border-[#074469] dark:focus:border-[#5BE29D] text-xs text-[#0f172a] dark:text-[#f1f5f9]"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-xs font-bold text-[#0f172a] dark:text-[#f1f5f9]">
                    Senha *
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-[11px] text-[#074469] dark:text-[#5BE29D] hover:underline cursor-pointer font-semibold"
                  >
                    {showPassword ? 'Ocultar' : 'Mostrar'}
                  </button>
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-[#f8fafc] dark:bg-[#162230] border border-[#cbd5e1] dark:border-[#2b3e52] rounded-xl p-2.5 outline-none focus:border-[#074469] dark:focus:border-[#5BE29D] font-mono text-xs text-[#0f172a] dark:text-[#f1f5f9]"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#074469] dark:bg-[#5BE29D] hover:bg-[#2a5c82] dark:hover:bg-[#48cf8b] disabled:opacity-60 text-white dark:text-[#063e2e] font-bold py-3.5 rounded-2xl transition-all shadow-xs cursor-pointer min-h-[44px]"
                >
                  {loading
                    ? 'Aguarde...'
                    : userMode === 'login'
                    ? 'Entrar no MatchPet'
                    : 'Finalizar Cadastro de Adotante'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ========================================================================= */}
        {/* PERFIL: ONG / ADMINISTRADOR */}
        {/* ========================================================================= */}
        {profileType === 'ong' && (
          <div>
            <div className="mb-4">
              <h3 className="font-['Plus_Jakarta_Sans'] font-bold text-lg text-[#126b57] dark:text-[#5BE29D]">
                Acesso Restrito: ONGs & Administração
              </h3>
              <p className="font-['Inter'] text-xs text-[#64748b] dark:text-[#94a3b8] mt-0.5">
                Utilize as credenciais geradas pelo Administrador MatchPet.
              </p>
            </div>

            <form onSubmit={handleOngSubmit} className="space-y-3.5 font-['Inter'] text-sm">
              <div>
                <label className="block text-xs font-bold text-[#0f172a] dark:text-[#f1f5f9] mb-1">
                  E-mail da Instituição ou Admin *
                </label>
                <input
                  type="email"
                  required
                  value={ongEmail}
                  onChange={(e) => setOngEmail(e.target.value)}
                  placeholder="login@ong.org.br ou admin@gmail.com"
                  className="w-full bg-[#f8fafc] dark:bg-[#162230] border border-[#cbd5e1] dark:border-[#2b3e52] rounded-xl p-2.5 outline-none focus:border-[#126b57] dark:focus:border-[#5BE29D] text-xs text-[#0f172a] dark:text-[#f1f5f9]"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-xs font-bold text-[#0f172a] dark:text-[#f1f5f9]">
                    Senha de Acesso *
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-[11px] text-[#126b57] dark:text-[#5BE29D] hover:underline cursor-pointer font-semibold"
                  >
                    {showPassword ? 'Ocultar' : 'Mostrar'}
                  </button>
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={ongPassword}
                  onChange={(e) => setOngPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-[#f8fafc] dark:bg-[#162230] border border-[#cbd5e1] dark:border-[#2b3e52] rounded-xl p-2.5 outline-none focus:border-[#126b57] dark:focus:border-[#5BE29D] font-mono text-xs text-[#0f172a] dark:text-[#f1f5f9]"
                />
              </div>

              {/* Botão de Atalho para Admin */}
              <div className="pt-1">
                <button
                  type="button"
                  onClick={fillAdminCredentials}
                  className="w-full text-left text-[11px] text-[#074469] dark:text-[#5BE29D] bg-[#074469]/5 dark:bg-[#5BE29D]/10 hover:bg-[#074469]/10 p-2.5 rounded-xl border border-[#074469]/20 dark:border-[#5BE29D]/30 flex items-center justify-between cursor-pointer transition-colors"
                >
                  <span className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-sm">admin_panel_settings</span>
                    <span>Preencher credenciais do <strong>Administrador</strong></span>
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#074469] dark:text-[#5BE29D]">Auto-fill</span>
                </button>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#126b57] hover:bg-[#005141] disabled:opacity-60 text-white font-bold py-3.5 rounded-2xl transition-all shadow-xs cursor-pointer min-h-[44px]"
                >
                  {loading ? 'Validando Acesso...' : 'Entrar no Painel da ONG / Admin'}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

/* 4. Apoio PIX Modal */
export const ApoioPixModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [copied, setCopied] = useState(false);
  const pixKey = 'apoio@matchpet.ong.br';

  const handleCopy = () => {
    navigator.clipboard.writeText(pixKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 font-['Plus_Jakarta_Sans']">
      <div className="bg-white dark:bg-[#121d28] rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-[#e2e8f0] dark:border-[#1e2c3c] relative animate-in fade-in zoom-in duration-200 text-center">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-[#64748b] dark:text-[#94a3b8] hover:text-[#0f172a] dark:hover:text-white p-2 rounded-full hover:bg-[#f1f5f9] dark:hover:bg-[#162230] cursor-pointer transition-colors"
        >
          <span className="material-symbols-outlined text-xl">close</span>
        </button>

        <div className="w-16 h-16 bg-[#a0efd6]/50 dark:bg-[#5BE29D]/20 text-[#126b57] dark:text-[#5BE29D] border border-[#126b57]/20 dark:border-[#5BE29D]/40 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xs">
          <span className="material-symbols-outlined text-3xl">volunteer_activism</span>
        </div>

        <h3 className="font-['Plus_Jakarta_Sans'] text-2xl font-bold text-[#074469] dark:text-white mb-2">
          Apoie o MatchPet
        </h3>
        <p className="font-['Inter'] text-xs sm:text-sm text-[#475569] dark:text-[#cbd5e1] mb-6 leading-relaxed">
          Sua doação voluntária ajuda na manutenção da plataforma MatchPet e no suporte alimentar e médico de centenas de animais resgatados.
        </p>

        <div className="bg-[#f8fafc] dark:bg-[#162230] p-4 rounded-2xl border border-[#e2e8f0] dark:border-[#2b3e52] flex items-center justify-between gap-2 mb-6">
          <span className="font-mono text-xs sm:text-sm text-[#074469] dark:text-[#5BE29D] font-bold truncate">{pixKey}</span>
          <button
            onClick={handleCopy}
            className="bg-[#074469] dark:bg-[#5BE29D] hover:bg-[#2a5c82] dark:hover:bg-[#48cf8b] text-white dark:text-[#063e2e] text-xs font-bold px-3.5 py-2 rounded-xl transition-colors shrink-0 cursor-pointer shadow-2xs"
          >
            {copied ? 'Copiado! ✓' : 'Copiar Chave'}
          </button>
        </div>

        <button
          onClick={onClose}
          className="w-full bg-[#f1f5f9] dark:bg-[#162230] hover:bg-[#e2e8f0] dark:hover:bg-[#1e2f40] text-[#0f172a] dark:text-[#f1f5f9] font-bold py-3 rounded-xl text-xs sm:text-sm transition-colors cursor-pointer"
        >
          Fechar
        </button>
      </div>
    </div>
  );
};

/* 5. Foster Details Modal */
export const FosterDetailsModal: React.FC<{
  request: FosterRequest;
  onClose: () => void;
  onAccept: () => void;
}> = ({ request, onClose, onAccept }) => {
  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 font-['Plus_Jakarta_Sans']">
      <div className="bg-white dark:bg-[#121d28] rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-[#e2e8f0] dark:border-[#1e2c3c] relative animate-in fade-in zoom-in duration-200 text-left">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-[#64748b] dark:text-[#94a3b8] hover:text-[#0f172a] dark:hover:text-white p-2 rounded-full hover:bg-[#f1f5f9] dark:hover:bg-[#162230] cursor-pointer transition-colors"
        >
          <span className="material-symbols-outlined text-xl">close</span>
        </button>

        <h3 className="font-['Plus_Jakarta_Sans'] text-2xl font-bold text-[#074469] dark:text-white mb-4">
          Detalhes da Triagem
        </h3>

        <div className="bg-[#f8fafc] dark:bg-[#162230] p-4 sm:p-5 rounded-2xl border border-[#e2e8f0] dark:border-[#2b3e52] space-y-2 text-xs sm:text-sm font-['Inter'] text-[#475569] dark:text-[#cbd5e1] mb-6">
          <p><strong className="text-[#0f172a] dark:text-white">Animal:</strong> {request.petName} ({request.species})</p>
          <p><strong className="text-[#0f172a] dark:text-white">Solicitante:</strong> {request.requesterName || 'Adotante'}</p>
          <p><strong className="text-[#0f172a] dark:text-white">Telefone / WhatsApp:</strong> {request.phone || 'Não informado'}</p>
          <p><strong className="text-[#0f172a] dark:text-white">Motivo / Histórico:</strong> {request.reason}</p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 bg-[#f1f5f9] dark:bg-[#162230] hover:bg-[#e2e8f0] dark:hover:bg-[#1e2f40] text-[#0f172a] dark:text-[#f1f5f9] font-bold py-3 rounded-xl text-xs sm:text-sm cursor-pointer transition-colors"
          >
            Fechar
          </button>
          <button
            onClick={() => {
              onAccept();
              onClose();
            }}
            className="flex-1 bg-[#126b57] hover:bg-[#005141] text-white font-bold py-3 rounded-xl text-xs sm:text-sm transition-colors cursor-pointer shadow-xs"
          >
            Aceitar Acolhimento
          </button>
        </div>
      </div>
    </div>
  );
};

/* 6. Profile Analysis Modal */
export const ProfileAnalysisModal: React.FC<{
  solicitation: Solicitation;
  onClose: () => void;
  onApprove: () => void;
}> = ({ solicitation, onClose, onApprove }) => {
  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 font-['Plus_Jakarta_Sans']">
      <div className="bg-white dark:bg-[#121d28] rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-[#e2e8f0] dark:border-[#1e2c3c] relative animate-in fade-in zoom-in duration-200 text-left">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-[#64748b] dark:text-[#94a3b8] hover:text-[#0f172a] dark:hover:text-white p-2 rounded-full hover:bg-[#f1f5f9] dark:hover:bg-[#162230] cursor-pointer transition-colors"
        >
          <span className="material-symbols-outlined text-xl">close</span>
        </button>

        <h3 className="font-['Plus_Jakarta_Sans'] text-2xl font-bold text-[#074469] dark:text-white mb-4">
          Análise de Adoção: {solicitation.petName}
        </h3>

        <div className="bg-[#f8fafc] dark:bg-[#162230] p-4 sm:p-5 rounded-2xl border border-[#e2e8f0] dark:border-[#2b3e52] space-y-2 text-xs sm:text-sm font-['Inter'] text-[#475569] dark:text-[#cbd5e1] mb-6">
          <p><strong className="text-[#0f172a] dark:text-white">Candidato Adotante:</strong> {solicitation.requesterName}</p>
          <p><strong className="text-[#0f172a] dark:text-white">Telefone / WhatsApp:</strong> {solicitation.phone || 'Não informado'}</p>
          <p><strong className="text-[#0f172a] dark:text-white">E-mail:</strong> {solicitation.email || 'Não informado'}</p>
          <p><strong className="text-[#0f172a] dark:text-white">Detalhes / Residência:</strong> {solicitation.dateOrDetails}</p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 bg-[#f1f5f9] dark:bg-[#162230] hover:bg-[#e2e8f0] dark:hover:bg-[#1e2f40] text-[#0f172a] dark:text-[#f1f5f9] font-bold py-3 rounded-xl text-xs sm:text-sm cursor-pointer transition-colors"
          >
            Fechar
          </button>
          <button
            onClick={() => {
              onApprove();
              onClose();
            }}
            className="flex-1 bg-[#126b57] hover:bg-[#005141] text-white font-bold py-3 rounded-xl text-xs sm:text-sm transition-colors cursor-pointer shadow-xs"
          >
            Conceder Adoção
          </button>
        </div>
      </div>
    </div>
  );
};
