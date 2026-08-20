import React, { useState } from 'react';
import { Pet, ONG, Solicitation, FosterRequest, User, OngSession } from '../types';
import { authService, ADMIN_CREDENTIALS } from '../services/authService';

/* 1. Manifestar Interesse / Agendar Visita Modal */
interface AdoptionInterestModalProps {
  pet: Pet;
  currentUser: User | null;
  onClose: () => void;
  onRequireLogin: () => void;
  onSubmit: (data: { name: string; phone: string; email: string; date: string; notes: string }) => void;
}

export const AdoptionInterestModal: React.FC<AdoptionInterestModalProps> = ({
  pet,
  currentUser,
  onClose,
  onRequireLogin,
  onSubmit
}) => {
  const [name, setName] = useState(currentUser?.name || '');
  const [phone, setPhone] = useState(currentUser?.phone || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [date, setDate] = useState('Sábado, 14h');
  const [housingType, setHousingType] = useState('Casa com quintal telado');
  const [notes, setNotes] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      onRequireLogin();
      return;
    }
    if (!name || !phone) return;
    onSubmit({
      name,
      phone,
      email: currentUser.email || email,
      date,
      notes: `${housingType}. ${notes}`
    });
    setSubmitted(true);
    setTimeout(() => {
      onClose();
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 md:p-8 shadow-2xl border border-[#e0e3e5] relative animate-in fade-in zoom-in duration-200">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-[#72787f] hover:text-[#191c1e] p-1.5 rounded-full hover:bg-[#e0e3e5] cursor-pointer"
        >
          <span className="material-symbols-outlined">close</span>
        </button>

        {submitted ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-[#a0efd6] text-[#126b57] rounded-2xl flex items-center justify-center mx-auto mb-4">
              <span className="material-symbols-outlined text-3xl">check</span>
            </div>
            <h3 className="font-['Plus_Jakarta_Sans'] text-2xl font-bold text-[#074469] mb-2">
              Interesse Registrado no MatchPet!
            </h3>
            <p className="font-['Be_Vietnam_Pro'] text-sm text-[#41474e]">
              A ONG <strong>{pet.ongName}</strong> recebeu seu contato e você pode acompanhar o status na aba <strong>Minhas Adoções</strong>.
            </p>
          </div>
        ) : !currentUser ? (
          <div className="text-center py-6">
            <div className="w-16 h-16 bg-[#ffdbc9] text-[#6d2f00] rounded-2xl flex items-center justify-center mx-auto mb-4">
              <span className="material-symbols-outlined text-3xl">lock</span>
            </div>
            <h3 className="font-['Plus_Jakarta_Sans'] text-2xl font-bold text-[#074469] mb-2">
              Identificação Obrigatória
            </h3>
            <p className="font-['Be_Vietnam_Pro'] text-sm text-[#41474e] mb-6 leading-relaxed">
              Para manifestar interesse e agendar uma visita com o(a) <strong>{pet.name}</strong>, é necessário entrar na sua conta de adotante no MatchPet.
            </p>
            <button
              onClick={onRequireLogin}
              className="bg-[#074469] hover:bg-[#2a5c82] text-white font-['Be_Vietnam_Pro'] font-bold text-sm px-6 py-3 rounded-xl transition-all shadow-sm w-full cursor-pointer"
            >
              Fazer Login / Cadastrar-se
            </button>
          </div>
        ) : (
          <div>
            <div className="flex items-center gap-3 mb-4 pb-3 border-b border-[#e0e3e5]">
              <img
                src={pet.mainImage}
                alt={pet.name}
                className="w-14 h-14 rounded-2xl object-cover border border-[#e0e3e5] shadow-2xs"
              />
              <div>
                <h3 className="font-['Plus_Jakarta_Sans'] text-xl font-bold text-[#074469]">
                  Quero adotar o {pet.name}
                </h3>
                <p className="font-['Be_Vietnam_Pro'] text-xs text-[#72787f]">
                  ONG Responsável: <strong>{pet.ongName}</strong>
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3.5 font-['Be_Vietnam_Pro'] text-sm">
              <div>
                <label className="block text-xs font-semibold text-[#41474e] mb-1">
                  Seu Nome Completo *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ex: Mariana Silva"
                  className="w-full bg-[#f2f4f6] border border-[#c1c7cf] rounded-xl p-2.5 outline-none focus:border-[#074469] focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#41474e] mb-1">
                    WhatsApp / Telefone *
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="(11) 99887-6655"
                    className="w-full bg-[#f2f4f6] border border-[#c1c7cf] rounded-xl p-2.5 outline-none focus:border-[#074469] focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#41474e] mb-1">
                    E-mail do Adotante
                  </label>
                  <input
                    type="email"
                    disabled
                    value={currentUser.email}
                    className="w-full bg-[#e0e3e5]/60 border border-[#c1c7cf] rounded-xl p-2.5 outline-none text-[#72787f] cursor-not-allowed"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#41474e] mb-1">
                    Melhor dia para visita
                  </label>
                  <select
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full bg-[#f2f4f6] border border-[#c1c7cf] rounded-xl p-2.5 outline-none focus:border-[#074469] focus:bg-white cursor-pointer"
                  >
                    <option value="Sábado, 10h às 12h">Sábado, 10h às 12h</option>
                    <option value="Sábado, 14h às 16h">Sábado, 14h às 16h</option>
                    <option value="Domingo, 11h às 13h">Domingo, 11h às 13h</option>
                    <option value="Dia de semana (A combinar)">Dia de semana (A combinar)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#41474e] mb-1">
                    Tipo de residência
                  </label>
                  <select
                    value={housingType}
                    onChange={(e) => setHousingType(e.target.value)}
                    className="w-full bg-[#f2f4f6] border border-[#c1c7cf] rounded-xl p-2.5 outline-none focus:border-[#074469] focus:bg-white cursor-pointer"
                  >
                    <option value="Casa com quintal seguro">Casa com quintal seguro</option>
                    <option value="Apartamento com rede de proteção">Apartamento com rede de proteção</option>
                    <option value="Sítio / Chácara">Sítio / Chácara</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#41474e] mb-1">
                  Mensagem / Observações para a ONG
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Ex: Tenho outro cão dócil, moro com família..."
                  className="w-full bg-[#f2f4f6] border border-[#c1c7cf] rounded-xl p-2.5 outline-none focus:border-[#074469] focus:bg-white resize-none"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full bg-[#074469] hover:bg-[#2a5c82] text-white font-bold py-3 rounded-xl transition-all shadow-sm active:scale-98 cursor-pointer"
                >
                  Confirmar Interesse e Agendamento
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

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
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 md:p-8 shadow-2xl border border-[#e0e3e5] relative animate-in fade-in zoom-in duration-200">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-[#72787f] hover:text-[#191c1e] p-1.5 rounded-full hover:bg-[#e0e3e5] cursor-pointer"
        >
          <span className="material-symbols-outlined">close</span>
        </button>

        {submitted ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-[#a0efd6] text-[#126b57] rounded-2xl flex items-center justify-center mx-auto mb-4">
              <span className="material-symbols-outlined text-3xl">thumb_up</span>
            </div>
            <h3 className="font-['Plus_Jakarta_Sans'] text-2xl font-bold text-[#074469] mb-2">
              Indicação Enviada!
            </h3>
            <p className="font-['Be_Vietnam_Pro'] text-sm text-[#41474e]">
              A equipe do MatchPet entrará em contato para cadastrar a instituição.
            </p>
          </div>
        ) : (
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-[#074469]/10 text-[#074469] flex items-center justify-center">
                <span className="material-symbols-outlined text-2xl">add_business</span>
              </div>
              <div>
                <h3 className="font-['Plus_Jakarta_Sans'] text-2xl font-bold text-[#074469]">
                  Indicar uma ONG
                </h3>
                <p className="font-['Be_Vietnam_Pro'] text-xs text-[#72787f]">
                  Ajude a expandir a rede de adoção do MatchPet.
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3.5 mt-5 font-['Be_Vietnam_Pro'] text-sm">
              <div>
                <label className="block text-xs font-semibold text-[#41474e] mb-1">
                  Nome da ONG ou Protetor *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ex: Associação Patinhas do Bem"
                  className="w-full bg-[#f2f4f6] border border-[#c1c7cf] rounded-xl p-2.5 outline-none focus:border-[#074469] focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#41474e] mb-1">
                    Cidade *
                  </label>
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Ex: São Paulo"
                    className="w-full bg-[#f2f4f6] border border-[#c1c7cf] rounded-xl p-2.5 outline-none focus:border-[#074469] focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#41474e] mb-1">
                    Estado (UF)
                  </label>
                  <input
                    type="text"
                    value={state}
                    onChange={(e) => setState(e.target.value.toUpperCase().slice(0, 2))}
                    placeholder="SP"
                    className="w-full bg-[#f2f4f6] border border-[#c1c7cf] rounded-xl p-2.5 outline-none focus:border-[#074469] focus:bg-white uppercase font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#41474e] mb-1">
                  Telefone / WhatsApp de Contato *
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="(11) 98765-4321"
                  className="w-full bg-[#f2f4f6] border border-[#c1c7cf] rounded-xl p-2.5 outline-none focus:border-[#074469] focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#41474e] mb-1">
                  Breve descrição ou link das redes sociais
                </label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Ex: @ongpatinhas no Instagram, atuam com cães resgatados..."
                  className="w-full bg-[#f2f4f6] border border-[#c1c7cf] rounded-xl p-2.5 outline-none focus:border-[#074469] focus:bg-white resize-none"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full bg-[#074469] hover:bg-[#2a5c82] text-white font-bold py-3 rounded-xl transition-all shadow-sm cursor-pointer"
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
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 md:p-8 shadow-2xl border border-[#e0e3e5] relative animate-in fade-in zoom-in duration-200">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-[#72787f] hover:text-[#191c1e] p-1.5 rounded-full hover:bg-[#e0e3e5] cursor-pointer"
        >
          <span className="material-symbols-outlined">close</span>
        </button>

        {/* SELETOR DE PERFIL: ADOTANTE VS ONG/ADMIN */}
        <div className="flex bg-[#eceef0] p-1 rounded-2xl mb-6 font-['Be_Vietnam_Pro'] text-xs font-bold">
          <button
            type="button"
            onClick={() => {
              setProfileType('user');
              setErrorMessage(null);
            }}
            className={`flex-1 py-2.5 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              profileType === 'user' ? 'bg-[#074469] text-white shadow-xs' : 'text-[#41474e] hover:text-[#074469]'
            }`}
          >
            <span className="material-symbols-outlined text-sm">person</span>
            <span>Sou Adotante</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setProfileType('ong');
              setErrorMessage(null);
            }}
            className={`flex-1 py-2.5 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              profileType === 'ong' ? 'bg-[#126b57] text-white shadow-xs' : 'text-[#41474e] hover:text-[#126b57]'
            }`}
          >
            <span className="material-symbols-outlined text-sm">domain</span>
            <span>Sou ONG / Admin</span>
          </button>
        </div>

        {/* Error message banner */}
        {errorMessage && (
          <div className="mb-4 bg-[#ffdad6] text-[#ba1a1a] p-3 rounded-xl text-xs font-['Be_Vietnam_Pro'] flex items-center gap-2">
            <span className="material-symbols-outlined text-sm">error</span>
            <span>{errorMessage}</span>
          </div>
        )}

        {/* ========================================================================= */}
        {/* FLUXO 1: LOGIN / CADASTRO DE ADOTANTE */}
        {/* ========================================================================= */}
        {profileType === 'user' && (
          <div>
            <div className="flex border-b border-[#e0e3e5] mb-5">
              <button
                type="button"
                onClick={() => {
                  setUserMode('login');
                  setErrorMessage(null);
                }}
                className={`flex-1 pb-2.5 text-center font-['Plus_Jakarta_Sans'] font-bold text-sm border-b-2 transition-all cursor-pointer ${
                  userMode === 'login' ? 'border-[#074469] text-[#074469]' : 'border-transparent text-[#72787f]'
                }`}
              >
                Entrar
              </button>
              <button
                type="button"
                onClick={() => {
                  setUserMode('register');
                  setErrorMessage(null);
                }}
                className={`flex-1 pb-2.5 text-center font-['Plus_Jakarta_Sans'] font-bold text-sm border-b-2 transition-all cursor-pointer ${
                  userMode === 'register' ? 'border-[#074469] text-[#074469]' : 'border-transparent text-[#72787f]'
                }`}
              >
                Criar Conta
              </button>
            </div>

            <form onSubmit={handleUserSubmit} className="space-y-3.5 font-['Be_Vietnam_Pro'] text-sm">
              {userMode === 'register' && (
                <div>
                  <label className="block text-xs font-semibold text-[#41474e] mb-1">
                    Nome Completo *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Seu nome completo"
                    className="w-full bg-[#f2f4f6] border border-[#c1c7cf] rounded-xl p-2.5 outline-none focus:border-[#074469] focus:bg-white text-xs"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-[#41474e] mb-1">
                  E-mail do Adotante *
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu@email.com"
                  className="w-full bg-[#f2f4f6] border border-[#c1c7cf] rounded-xl p-2.5 outline-none focus:border-[#074469] focus:bg-white text-xs"
                />
              </div>

              {userMode === 'register' && (
                <div>
                  <label className="block text-xs font-semibold text-[#41474e] mb-1">
                    WhatsApp (Opcional)
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="(11) 98765-4321"
                    className="w-full bg-[#f2f4f6] border border-[#c1c7cf] rounded-xl p-2.5 outline-none focus:border-[#074469] focus:bg-white text-xs"
                  />
                </div>
              )}

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-xs font-semibold text-[#41474e]">
                    Senha *
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
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-[#f2f4f6] border border-[#c1c7cf] rounded-xl p-2.5 outline-none focus:border-[#074469] focus:bg-white font-mono text-xs"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#074469] hover:bg-[#2a5c82] disabled:opacity-60 text-white font-bold py-3 rounded-xl transition-all shadow-sm cursor-pointer"
                >
                  {loading ? 'Acessando...' : userMode === 'login' ? 'Entrar como Adotante' : 'Cadastrar e Entrar'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ========================================================================= */}
        {/* FLUXO 2: LOGIN DE ONG OU ADMINISTRADOR GERAL */}
        {/* ========================================================================= */}
        {profileType === 'ong' && (
          <div>
            <div className="mb-4">
              <h3 className="font-['Plus_Jakarta_Sans'] font-bold text-base text-[#126b57]">
                Acesso Restrito: ONGs & Administração
              </h3>
              <p className="font-['Be_Vietnam_Pro'] text-xs text-[#72787f] mt-0.5">
                Utilize as credenciais geradas pelo Administrador MatchPet.
              </p>
            </div>

            <form onSubmit={handleOngSubmit} className="space-y-3.5 font-['Be_Vietnam_Pro'] text-sm">
              <div>
                <label className="block text-xs font-semibold text-[#41474e] mb-1">
                  E-mail da Instituição ou Admin *
                </label>
                <input
                  type="email"
                  required
                  value={ongEmail}
                  onChange={(e) => setOngEmail(e.target.value)}
                  placeholder="login@ong.org.br ou admin@gmail.com"
                  className="w-full bg-[#f2f4f6] border border-[#c1c7cf] rounded-xl p-2.5 outline-none focus:border-[#126b57] focus:bg-white text-xs"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-xs font-semibold text-[#41474e]">
                    Senha de Acesso *
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-[11px] text-[#126b57] hover:underline cursor-pointer"
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
                  className="w-full bg-[#f2f4f6] border border-[#c1c7cf] rounded-xl p-2.5 outline-none focus:border-[#126b57] focus:bg-white font-mono text-xs"
                />
              </div>

              {/* Botão de Atalho para Admin */}
              <div className="pt-1">
                <button
                  type="button"
                  onClick={fillAdminCredentials}
                  className="w-full text-left text-[11px] text-[#074469] bg-[#074469]/5 hover:bg-[#074469]/10 p-2 rounded-xl border border-[#074469]/20 flex items-center justify-between cursor-pointer"
                >
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-xs">admin_panel_settings</span>
                    Preencher credenciais do <strong>Administrador</strong>
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#074469]">Auto-fill</span>
                </button>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#126b57] hover:bg-[#005141] disabled:opacity-60 text-white font-bold py-3 rounded-xl transition-all shadow-sm cursor-pointer"
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
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 md:p-8 shadow-2xl border border-[#e0e3e5] relative animate-in fade-in zoom-in duration-200 text-center">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-[#72787f] hover:text-[#191c1e] p-1.5 rounded-full hover:bg-[#e0e3e5] cursor-pointer"
        >
          <span className="material-symbols-outlined">close</span>
        </button>

        <div className="w-16 h-16 bg-[#a0efd6] text-[#126b57] rounded-2xl flex items-center justify-center mx-auto mb-4">
          <span className="material-symbols-outlined text-3xl">volunteer_activism</span>
        </div>

        <h3 className="font-['Plus_Jakarta_Sans'] text-2xl font-bold text-[#074469] mb-2">
          Apoie o MatchPet
        </h3>
        <p className="font-['Be_Vietnam_Pro'] text-xs sm:text-sm text-[#41474e] mb-6 leading-relaxed">
          Sua doação voluntária ajuda na manutenção da plataforma MatchPet e no suporte alimentar e médico de centenas de animais resgatados.
        </p>

        <div className="bg-[#f7f9fb] p-4 rounded-2xl border border-[#e0e3e5] flex items-center justify-between gap-2 mb-6">
          <span className="font-mono text-xs text-[#074469] font-bold truncate">{pixKey}</span>
          <button
            onClick={handleCopy}
            className="bg-[#074469] hover:bg-[#2a5c82] text-white text-xs font-bold px-3 py-1.5 rounded-lg transition-colors shrink-0 cursor-pointer"
          >
            {copied ? 'Copiado! ✓' : 'Copiar Chave'}
          </button>
        </div>

        <button
          onClick={onClose}
          className="w-full bg-[#f2f4f6] hover:bg-[#e0e3e5] text-[#191c1e] font-semibold py-2.5 rounded-xl text-xs"
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
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 md:p-8 shadow-2xl border border-[#e0e3e5] relative animate-in fade-in zoom-in duration-200">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-[#72787f] hover:text-[#191c1e] p-1.5 rounded-full hover:bg-[#e0e3e5] cursor-pointer"
        >
          <span className="material-symbols-outlined">close</span>
        </button>

        <h3 className="font-['Plus_Jakarta_Sans'] text-2xl font-bold text-[#074469] mb-4">
          Detalhes da Triagem
        </h3>

        <div className="bg-[#f7f9fb] p-4 rounded-2xl border border-[#e0e3e5] space-y-2 text-xs font-['Be_Vietnam_Pro'] text-[#41474e] mb-6">
          <p><strong>Animal:</strong> {request.petName} ({request.species})</p>
          <p><strong>Solicitante:</strong> {request.requesterName || 'Adotante'}</p>
          <p><strong>Telefone / WhatsApp:</strong> {request.phone || 'Não informado'}</p>
          <p><strong>Motivo / Histórico:</strong> {request.reason}</p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 bg-[#f2f4f6] hover:bg-[#e0e3e5] text-[#191c1e] font-bold py-2.5 rounded-xl text-xs cursor-pointer"
          >
            Fechar
          </button>
          <button
            onClick={() => {
              onAccept();
              onClose();
            }}
            className="flex-1 bg-[#126b57] hover:bg-[#005141] text-white font-bold py-2.5 rounded-xl text-xs transition-colors cursor-pointer shadow-xs"
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
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 md:p-8 shadow-2xl border border-[#e0e3e5] relative animate-in fade-in zoom-in duration-200">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-[#72787f] hover:text-[#191c1e] p-1.5 rounded-full hover:bg-[#e0e3e5] cursor-pointer"
        >
          <span className="material-symbols-outlined">close</span>
        </button>

        <h3 className="font-['Plus_Jakarta_Sans'] text-2xl font-bold text-[#074469] mb-4">
          Análise de Adoção: {solicitation.petName}
        </h3>

        <div className="bg-[#f7f9fb] p-4 rounded-2xl border border-[#e0e3e5] space-y-2 text-xs font-['Be_Vietnam_Pro'] text-[#41474e] mb-6">
          <p><strong>Candidato Adotante:</strong> {solicitation.requesterName}</p>
          <p><strong>Telefone / WhatsApp:</strong> {solicitation.phone || 'Não informado'}</p>
          <p><strong>E-mail:</strong> {solicitation.email || 'Não informado'}</p>
          <p><strong>Detalhes / Residência:</strong> {solicitation.dateOrDetails}</p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 bg-[#f2f4f6] hover:bg-[#e0e3e5] text-[#191c1e] font-bold py-2.5 rounded-xl text-xs cursor-pointer"
          >
            Fechar
          </button>
          <button
            onClick={() => {
              onApprove();
              onClose();
            }}
            className="flex-1 bg-[#126b57] hover:bg-[#005141] text-white font-bold py-2.5 rounded-xl text-xs transition-colors cursor-pointer shadow-xs"
          >
            Conceder Adoção
          </button>
        </div>
      </div>
    </div>
  );
};
