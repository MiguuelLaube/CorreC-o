import React, { useState } from 'react';
import { Pet, ONG, Solicitation, FosterRequest } from '../types';

/* 1. Manifestar Interesse / Agendar Visita Modal */
interface AdoptionInterestModalProps {
  pet: Pet;
  onClose: () => void;
  onSubmit: (data: { name: string; phone: string; email: string; date: string; notes: string }) => void;
}

export const AdoptionInterestModal: React.FC<AdoptionInterestModalProps> = ({
  pet,
  onClose,
  onSubmit
}) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [date, setDate] = useState('Sábado, 14h');
  const [housingType, setHousingType] = useState('Casa com quintal telado');
  const [notes, setNotes] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone) return;
    onSubmit({
      name,
      phone,
      email,
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
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 md:p-8 shadow-2xl border border-[#e0e3e5] relative animate-in fade-in zoom-in duration-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#72787f] hover:text-[#191c1e] p-1.5 rounded-full hover:bg-[#e0e3e5]"
        >
          <span className="material-symbols-outlined">close</span>
        </button>

        {submitted ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-[#a0efd6] text-[#196f5b] rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="material-symbols-outlined text-3xl">check</span>
            </div>
            <h3 className="font-['Plus_Jakarta_Sans'] text-2xl font-bold text-[#074469] mb-2">
              Interesse Registrado!
            </h3>
            <p className="font-['Be_Vietnam_Pro'] text-sm text-[#41474e]">
              A ONG <strong>{pet.ongName}</strong> entrará em contato via WhatsApp para confirmar sua visita ao <strong>{pet.name}</strong>.
            </p>
          </div>
        ) : (
          <div>
            <div className="flex items-center gap-3 mb-4 pb-3 border-b border-[#e0e3e5]">
              <img
                src={pet.mainImage}
                alt={pet.name}
                className="w-14 h-14 rounded-xl object-cover border border-[#e0e3e5]"
              />
              <div>
                <h3 className="font-['Plus_Jakarta_Sans'] text-xl font-bold text-[#074469]">
                  Quero adotar o {pet.name}
                </h3>
                <p className="font-['Be_Vietnam_Pro'] text-xs text-[#72787f]">
                  ONG Responsável: {pet.ongName}
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 font-['Be_Vietnam_Pro'] text-sm">
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
                  className="w-full bg-[#f2f4f6] border border-[#c1c7cf] rounded-lg p-2.5 outline-none focus:border-[#074469] focus:bg-white"
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
                    className="w-full bg-[#f2f4f6] border border-[#c1c7cf] rounded-lg p-2.5 outline-none focus:border-[#074469] focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#41474e] mb-1">
                    E-mail
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="seu@email.com"
                    className="w-full bg-[#f2f4f6] border border-[#c1c7cf] rounded-lg p-2.5 outline-none focus:border-[#074469] focus:bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#41474e] mb-1">
                    Melhor dia/horário para visita
                  </label>
                  <select
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full bg-[#f2f4f6] border border-[#c1c7cf] rounded-lg p-2.5 outline-none focus:border-[#074469] focus:bg-white cursor-pointer"
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
                    className="w-full bg-[#f2f4f6] border border-[#c1c7cf] rounded-lg p-2.5 outline-none focus:border-[#074469] focus:bg-white cursor-pointer"
                  >
                    <option value="Casa com quintal seguro">Casa com quintal seguro</option>
                    <option value="Apartamento com rede de proteção">Apartamento com rede de proteção</option>
                    <option value="Sítio / Chácara">Sítio / Chácara</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#41474e] mb-1">
                  Tem outros animais ou crianças? Alguma observação?
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Ex: Tenho outro cão dócil, moro com família..."
                  className="w-full bg-[#f2f4f6] border border-[#c1c7cf] rounded-lg p-2.5 outline-none focus:border-[#074469] focus:bg-white resize-none"
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
    if (!name || !city) return;

    onSubmit({
      name,
      city,
      state,
      phone: phone || '(11) 90000-0000',
      description: description || 'Instituição dedicada ao bem-estar e resgate animal.',
      image:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuCeLWHs24XaUcWLidTvmpWuyCMw79Zvw3YtCMtvI7QR2MEDwN0zEEk7pBgnaXtzl3m-Ow18esAG9DeT1_Loqm8j6moJmSbj0oF_-aB6alzR1XWIn_UZOKA3kl7fCPNLN6TzmJidMgALYrc-JHjx4_ycMy5pTvzEwjjACU7aeSp6LncJsSlsfJsqdI10izFuoaQbL-UyOyNSmFMS-HR4Y_MSAEyxsF4F_VIM0YoiuWNBBFBhKrJCKWDkkg'
    });

    setSubmitted(true);
    setTimeout(() => {
      onClose();
    }, 1600);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 md:p-8 shadow-2xl border border-[#e0e3e5] relative animate-in fade-in zoom-in duration-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#72787f] hover:text-[#191c1e] p-1.5 rounded-full hover:bg-[#e0e3e5]"
        >
          <span className="material-symbols-outlined">close</span>
        </button>

        {submitted ? (
          <div className="text-center py-6">
            <div className="w-16 h-16 bg-[#a0efd6] text-[#196f5b] rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="material-symbols-outlined text-3xl">check</span>
            </div>
            <h3 className="font-['Plus_Jakarta_Sans'] text-2xl font-bold text-[#074469] mb-2">
              Indicação Enviada!
            </h3>
            <p className="font-['Be_Vietnam_Pro'] text-sm text-[#41474e]">
              A ONG foi adicionada à nossa lista de parceiras com sucesso!
            </p>
          </div>
        ) : (
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-[#2a5c82]/15 rounded-xl flex items-center justify-center text-[#074469]">
                <span className="material-symbols-outlined">add_business</span>
              </div>
              <div>
                <h3 className="font-['Plus_Jakarta_Sans'] text-xl font-bold text-[#074469]">
                  Indicar uma ONG Parceira
                </h3>
                <p className="font-['Be_Vietnam_Pro'] text-xs text-[#72787f]">
                  Ajude a conectar mais abrigos a novos tutores
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 font-['Be_Vietnam_Pro'] text-sm">
              <div>
                <label className="block text-xs font-semibold text-[#41474e] mb-1">
                  Nome da Instituição *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ex: Associação Patas Felizes"
                  className="w-full bg-[#f2f4f6] border border-[#c1c7cf] rounded-lg p-2.5 outline-none focus:border-[#074469] focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2">
                  <label className="block text-xs font-semibold text-[#41474e] mb-1">
                    Cidade *
                  </label>
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Ex: Santos"
                    className="w-full bg-[#f2f4f6] border border-[#c1c7cf] rounded-lg p-2.5 outline-none focus:border-[#074469] focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#41474e] mb-1">
                    UF
                  </label>
                  <select
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="w-full bg-[#f2f4f6] border border-[#c1c7cf] rounded-lg p-2.5 outline-none focus:border-[#074469] focus:bg-white cursor-pointer"
                  >
                    <option value="SP">SP</option>
                    <option value="RJ">RJ</option>
                    <option value="MG">MG</option>
                    <option value="PR">PR</option>
                    <option value="RS">RS</option>
                    <option value="SC">SC</option>
                    <option value="BA">BA</option>
                    <option value="DF">DF</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#41474e] mb-1">
                  Telefone / WhatsApp da ONG
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="(11) 98765-4321"
                  className="w-full bg-[#f2f4f6] border border-[#c1c7cf] rounded-lg p-2.5 outline-none focus:border-[#074469] focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#41474e] mb-1">
                  Breve descrição das atividades
                </label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Resgate de cães e gatos, feiras de adoção..."
                  className="w-full bg-[#f2f4f6] border border-[#c1c7cf] rounded-lg p-2.5 outline-none focus:border-[#074469] focus:bg-white resize-none"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full bg-[#074469] hover:bg-[#2a5c82] text-white font-bold py-3 rounded-xl transition-all shadow-sm active:scale-98 cursor-pointer"
                >
                  Cadastrar Indicação
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

/* 3. Auth Modal (Entrar / Cadastrar) */
interface AuthModalProps {
  mode: 'login' | 'register';
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ mode: initialMode, onClose }) => {
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess(true);
    setTimeout(() => {
      onClose();
    }, 1400);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 md:p-8 shadow-2xl border border-[#e0e3e5] relative animate-in fade-in zoom-in duration-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#72787f] hover:text-[#191c1e] p-1.5 rounded-full hover:bg-[#e0e3e5]"
        >
          <span className="material-symbols-outlined">close</span>
        </button>

        {success ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-[#a0efd6] text-[#196f5b] rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="material-symbols-outlined text-3xl">check</span>
            </div>
            <h3 className="font-['Plus_Jakarta_Sans'] text-2xl font-bold text-[#074469] mb-1">
              {mode === 'login' ? 'Bem-vindo de volta!' : 'Conta criada com sucesso!'}
            </h3>
            <p className="font-['Be_Vietnam_Pro'] text-sm text-[#41474e]">
              Acesso liberado a todas as funcionalidades do CorrenteCão.
            </p>
          </div>
        ) : (
          <div>
            <h3 className="font-['Plus_Jakarta_Sans'] text-2xl font-bold text-[#074469] mb-1">
              {mode === 'login' ? 'Acessar CorrenteCão' : 'Criar Conta no CorrenteCão'}
            </h3>
            <p className="font-['Be_Vietnam_Pro'] text-xs text-[#72787f] mb-6">
              {mode === 'login'
                ? 'Entre para acompanhar suas adoções e favoritos'
                : 'Cadastre-se como adotante ou voluntário'}
            </p>

            <form onSubmit={handleSubmit} className="space-y-4 font-['Be_Vietnam_Pro'] text-sm">
              {mode === 'register' && (
                <div>
                  <label className="block text-xs font-semibold text-[#41474e] mb-1">Nome</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Seu nome"
                    className="w-full bg-[#f2f4f6] border border-[#c1c7cf] rounded-lg p-2.5 outline-none focus:border-[#074469] focus:bg-white"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-[#41474e] mb-1">E-mail</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="exemplo@email.com"
                  className="w-full bg-[#f2f4f6] border border-[#c1c7cf] rounded-lg p-2.5 outline-none focus:border-[#074469] focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#41474e] mb-1">Senha</label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-[#f2f4f6] border border-[#c1c7cf] rounded-lg p-2.5 outline-none focus:border-[#074469] focus:bg-white"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-[#074469] hover:bg-[#2a5c82] text-white font-bold py-3 rounded-xl transition-all shadow-sm cursor-pointer"
              >
                {mode === 'login' ? 'Entrar' : 'Cadastrar'}
              </button>
            </form>

            <div className="mt-6 text-center text-xs font-['Be_Vietnam_Pro'] text-[#72787f]">
              {mode === 'login' ? (
                <p>
                  Não tem uma conta?{' '}
                  <button
                    onClick={() => setMode('register')}
                    className="text-[#074469] font-bold hover:underline"
                  >
                    Cadastre-se grátis
                  </button>
                </p>
              ) : (
                <p>
                  Já possui conta?{' '}
                  <button
                    onClick={() => setMode('login')}
                    className="text-[#074469] font-bold hover:underline"
                  >
                    Fazer Login
                  </button>
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

/* 4. PIX Apoio Modal */
export const ApoioPixModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [copied, setCopied] = useState(false);
  const pixKey = 'contato@correntecao.ong.br';

  const copyPix = () => {
    navigator.clipboard.writeText(pixKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 md:p-8 shadow-2xl border border-[#e0e3e5] relative text-center">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#72787f] hover:text-[#191c1e] p-1.5 rounded-full hover:bg-[#e0e3e5]"
        >
          <span className="material-symbols-outlined">close</span>
        </button>

        <div className="w-14 h-14 bg-[#a0efd6] text-[#196f5b] rounded-2xl flex items-center justify-center mx-auto mb-3">
          <span className="material-symbols-outlined text-3xl">volunteer_activism</span>
        </div>

        <h3 className="font-['Plus_Jakarta_Sans'] text-2xl font-bold text-[#074469] mb-1">
          Apoio via PIX
        </h3>
        <p className="font-['Be_Vietnam_Pro'] text-xs text-[#41474e] mb-6">
          100% das doações são repassadas diretamente para a compra de ração, vacinas e cuidados veterinários das ONGs cadastradas.
        </p>

        {/* QR Code box */}
        <div className="bg-[#f7f9fb] p-6 rounded-2xl border border-[#e0e3e5] inline-block mb-4">
          <div className="w-44 h-44 bg-white border-2 border-[#074469] rounded-xl flex items-center justify-center mx-auto p-2">
            {/* SVG simulated QR Code */}
            <svg viewBox="0 0 100 100" className="w-full h-full text-[#074469]">
              <rect x="5" y="5" width="30" height="30" fill="currentColor" />
              <rect x="10" y="10" width="20" height="20" fill="white" />
              <rect x="14" y="14" width="12" height="12" fill="currentColor" />
              
              <rect x="65" y="5" width="30" height="30" fill="currentColor" />
              <rect x="70" y="10" width="20" height="20" fill="white" />
              <rect x="74" y="14" width="12" height="12" fill="currentColor" />

              <rect x="5" y="65" width="30" height="30" fill="currentColor" />
              <rect x="10" y="70" width="20" height="20" fill="white" />
              <rect x="14" y="74" width="12" height="12" fill="currentColor" />

              <rect x="42" y="10" width="10" height="10" fill="currentColor" />
              <rect x="45" y="28" width="10" height="20" fill="currentColor" />
              <rect x="60" y="42" width="25" height="10" fill="currentColor" />
              <rect x="42" y="65" width="15" height="15" fill="currentColor" />
              <rect x="65" y="75" width="20" height="12" fill="currentColor" />
            </svg>
          </div>
          <span className="text-[11px] font-['Be_Vietnam_Pro'] text-[#72787f] block mt-2">
            Escaneie com o app do seu banco
          </span>
        </div>

        {/* Chave PIX copy */}
        <div className="flex items-center gap-2 bg-[#f2f4f6] p-2 rounded-xl border border-[#c1c7cf] mb-4">
          <input
            type="text"
            readOnly
            value={pixKey}
            className="bg-transparent font-['Be_Vietnam_Pro'] text-xs text-[#191c1e] w-full px-2 outline-none font-mono"
          />
          <button
            onClick={copyPix}
            className="bg-[#074469] text-white text-xs font-semibold px-3 py-1.5 rounded-lg hover:bg-[#2a5c82] transition-colors whitespace-nowrap cursor-pointer"
          >
            {copied ? 'Copiado!' : 'Copiar'}
          </button>
        </div>

        <button
          onClick={onClose}
          className="w-full text-[#41474e] hover:text-[#191c1e] text-xs font-semibold py-2"
        >
          Fechar
        </button>
      </div>
    </div>
  );
};

/* 5. Triagem Foster Request Details Modal */
export const FosterDetailsModal: React.FC<{
  request: FosterRequest;
  onClose: () => void;
  onAccept: () => void;
}> = ({ request, onClose, onAccept }) => {
  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 md:p-8 shadow-2xl border border-[#e0e3e5] relative animate-in fade-in zoom-in duration-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#72787f] hover:text-[#191c1e] p-1.5 rounded-full hover:bg-[#e0e3e5]"
        >
          <span className="material-symbols-outlined">close</span>
        </button>

        <span className="bg-[#ffdbc9] text-[#331200] px-3 py-1 rounded-full text-xs font-bold font-['Be_Vietnam_Pro']">
          Triagem de Acolhimento
        </span>

        <h3 className="font-['Plus_Jakarta_Sans'] text-2xl font-bold text-[#074469] mt-3 mb-1">
          {request.petName || 'Animal Resgatado'} ({request.species})
        </h3>
        <p className="text-xs text-[#72787f] mb-4">Recebido: {request.timestamp}</p>

        <div className="bg-[#f7f9fb] p-4 rounded-xl border border-[#e0e3e5] space-y-3 font-['Be_Vietnam_Pro'] text-sm text-[#41474e] mb-6">
          <p>
            <strong>Tutor solicitante:</strong> {request.requesterName || 'Não informado'}
          </p>
          <p>
            <strong>Contato:</strong> {request.phone || '(11) 98765-4321'}
          </p>
          <div>
            <strong>Motivo informado:</strong>
            <p className="mt-1 text-xs sm:text-sm text-[#191c1e] bg-white p-3 rounded-lg border border-[#c1c7cf]/40 leading-relaxed">
              {request.reason}
            </p>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 bg-[#eceef0] hover:bg-[#e0e3e5] text-[#191c1e] font-semibold py-2.5 rounded-xl text-sm"
          >
            Fechar
          </button>
          <button
            onClick={() => {
              onAccept();
              onClose();
            }}
            className="flex-1 bg-[#126b57] hover:bg-[#005141] text-white font-semibold py-2.5 rounded-xl text-sm shadow-sm"
          >
            Aceitar Acolhimento
          </button>
        </div>
      </div>
    </div>
  );
};

/* 6. Profile Analysis Modal for Adoption */
export const ProfileAnalysisModal: React.FC<{
  solicitation: Solicitation;
  onClose: () => void;
  onApprove: () => void;
}> = ({ solicitation, onClose, onApprove }) => {
  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 md:p-8 shadow-2xl border border-[#e0e3e5] relative animate-in fade-in zoom-in duration-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#72787f] hover:text-[#191c1e] p-1.5 rounded-full hover:bg-[#e0e3e5]"
        >
          <span className="material-symbols-outlined">close</span>
        </button>

        <div className="flex items-center gap-2 mb-2">
          <span className="material-symbols-outlined text-[#074469]">person_search</span>
          <h3 className="font-['Plus_Jakarta_Sans'] text-2xl font-bold text-[#074469]">
            Análise de Perfil do Candidato
          </h3>
        </div>

        <p className="font-['Be_Vietnam_Pro'] text-xs text-[#72787f] mb-4">
          Solicitação para adoção de: <strong className="text-[#074469]">{solicitation.petName}</strong>
        </p>

        <div className="bg-[#f7f9fb] p-4 rounded-xl border border-[#e0e3e5] space-y-3 font-['Be_Vietnam_Pro'] text-sm text-[#41474e] mb-6">
          <div className="flex justify-between pb-2 border-b border-[#e0e3e5]">
            <span>Candidato(a):</span>
            <strong className="text-[#191c1e]">{solicitation.requesterName}</strong>
          </div>
          <div className="flex justify-between pb-2 border-b border-[#e0e3e5]">
            <span>Telefone / WhatsApp:</span>
            <strong className="text-[#074469]">{solicitation.phone || '(19) 99221-7788'}</strong>
          </div>
          <div className="flex justify-between pb-2 border-b border-[#e0e3e5]">
            <span>E-mail:</span>
            <span className="text-[#191c1e]">{solicitation.email || 'candidato@email.com'}</span>
          </div>
          <div className="space-y-1">
            <span className="font-semibold text-xs text-[#72787f] uppercase">Checklist do questionário:</span>
            <ul className="text-xs space-y-1 text-[#191c1e]">
              <li className="flex items-center gap-1 text-[#126b57]">
                <span className="material-symbols-outlined text-sm">check_circle</span>
                Residência com telas e proteção adequada
              </li>
              <li className="flex items-center gap-1 text-[#126b57]">
                <span className="material-symbols-outlined text-sm">check_circle</span>
                Todos os moradores da casa estão de acordo
              </li>
              <li className="flex items-center gap-1 text-[#126b57]">
                <span className="material-symbols-outlined text-sm">check_circle</span>
                Disponibilidade financeira para vacinas e cuidados veterinários
              </li>
            </ul>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 bg-[#eceef0] hover:bg-[#e0e3e5] text-[#191c1e] font-semibold py-2.5 rounded-xl text-sm"
          >
            Fechar
          </button>
          <button
            onClick={() => {
              onApprove();
              onClose();
            }}
            className="flex-1 bg-[#074469] hover:bg-[#2a5c82] text-white font-semibold py-2.5 rounded-xl text-sm shadow-sm"
          >
            Aprovar Adoção
          </button>
        </div>
      </div>
    </div>
  );
};
