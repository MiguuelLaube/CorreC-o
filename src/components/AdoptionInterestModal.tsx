import React, { useState } from 'react';
import { Pet, User } from '../types';

interface AdoptionInterestModalProps {
  pet: Pet;
  currentUser: User | null;
  onClose: () => void;
  onRequireLogin: () => void;
  onGoToMyAdoptions: () => void;
  onSubmit: (data: {
    name: string;
    phone: string;
    email: string;
    date: string;
    notes: string;
    housingType?: string;
    hasOtherPets?: string;
    hasChildrenOrElderly?: string;
    hoursAlone?: string;
    visitPreference?: string;
  }) => void;
}

export const AdoptionInterestModal: React.FC<AdoptionInterestModalProps> = ({
  pet,
  currentUser,
  onClose,
  onRequireLogin,
  onGoToMyAdoptions,
  onSubmit
}) => {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Step 1 - Contato
  const [name, setName] = useState(currentUser?.name || '');
  const [phone, setPhone] = useState(currentUser?.phone || '');
  const [email, setEmail] = useState(currentUser?.email || '');

  // Step 2 - Perfil do Lar
  const [housingType, setHousingType] = useState<string>('Casa com quintal seguro');
  const [hasOtherPets, setHasOtherPets] = useState<string>('Sim');
  const [hasChildrenOrElderly, setHasChildrenOrElderly] = useState<string>('Sim');
  const [hoursAlone, setHoursAlone] = useState<string>('4h a 8h');

  // Step 3 - Agendamento & Mensagem
  const [date, setDate] = useState('Sábado, 14h às 16h');
  const [notes, setNotes] = useState('');

  const [loading, setLoading] = useState(false);
  const [protocolCode, setProtocolCode] = useState<string>('');

  const formatPhone = (val: string) => {
    return val
      .replace(/\D/g, '')
      .replace(/^(\d{2})(\d)/g, '($1) $2')
      .replace(/(\d{5})(\d)/, '$1-$2')
      .slice(0, 15);
  };

  const handleNextStep1 = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      onRequireLogin();
      return;
    }
    if (!name.trim() || !phone.trim()) return;
    setStep(2);
  };

  const handleNextStep2 = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(3);
  };

  const handleFinalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      onRequireLogin();
      return;
    }

    setLoading(true);
    const generatedProtocol = `MP-${Math.floor(100000 + Math.random() * 900000)}`;
    setProtocolCode(generatedProtocol);

    const fullDetails = `Residência: ${housingType} | Outros pets: ${hasOtherPets} | Crianças/Idosos: ${hasChildrenOrElderly} | Horas sozinho: ${hoursAlone} | Preferência: ${date}. ${notes ? `Mensagem: ${notes}` : ''}`;

    onSubmit({
      name,
      phone,
      email: currentUser.email || email,
      date,
      notes: fullDetails,
      housingType,
      hasOtherPets,
      hasChildrenOrElderly,
      hoursAlone,
      visitPreference: date
    });

    setLoading(false);
    setStep(4);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 md:p-8 shadow-2xl border border-[#e0e3e5] relative animate-in fade-in zoom-in duration-200 max-h-[92vh] overflow-y-auto font-['Be_Vietnam_Pro']">
        {/* Botão Fechar */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-[#72787f] hover:text-[#191c1e] p-2 rounded-full hover:bg-[#e0e3e5] cursor-pointer transition-colors"
          aria-label="Fechar"
        >
          <span className="material-symbols-outlined">close</span>
        </button>

        {/* Header do Pet em Destaque */}
        <div className="flex items-center gap-4 pb-4 mb-6 border-b border-[#e0e3e5]">
          <img
            src={pet.mainImage}
            alt={pet.name}
            className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border border-[#e0e3e5] shadow-xs shrink-0"
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 text-xs text-[#126b57] font-bold">
              <span className="material-symbols-outlined text-sm">verified</span>
              <span>Adoção Responsável MatchPet</span>
            </div>
            <h2 className="font-['Plus_Jakarta_Sans'] text-2xl sm:text-3xl font-bold text-[#074469] truncate">
              Quero Adotar: {pet.name}
            </h2>
            <p className="text-xs text-[#41474e] mt-0.5">
              ONG Responsável: <strong>{pet.ongName || 'ONG Parceira'}</strong> • {pet.size} • {pet.gender} • {pet.age}
            </p>
          </div>
        </div>

        {/* Indicador Visual de Etapas (Passos 1 a 3) */}
        {step !== 4 && (
          <div className="mb-6">
            <div className="grid grid-cols-3 gap-2 text-center text-xs font-semibold">
              <div
                className={`py-2 rounded-xl transition-all ${
                  step >= 1 ? 'bg-[#074469] text-white shadow-xs font-bold' : 'bg-[#f2f4f6] text-[#72787f]'
                }`}
              >
                1. Contato
              </div>
              <div
                className={`py-2 rounded-xl transition-all ${
                  step >= 2 ? 'bg-[#074469] text-white shadow-xs font-bold' : 'bg-[#f2f4f6] text-[#72787f]'
                }`}
              >
                2. Perfil do Lar
              </div>
              <div
                className={`py-2 rounded-xl transition-all ${
                  step >= 3 ? 'bg-[#074469] text-white shadow-xs font-bold' : 'bg-[#f2f4f6] text-[#72787f]'
                }`}
              >
                3. Visita & Envio
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TELA DE AUTENTICAÇÃO REQUERIDA (SE DESLOGADO) */}
        {/* ========================================================================= */}
        {!currentUser && (
          <div className="text-center py-6">
            <div className="w-16 h-16 bg-[#cde5ff] text-[#074469] rounded-2xl flex items-center justify-center mx-auto mb-4">
              <span className="material-symbols-outlined text-3xl">login</span>
            </div>
            <h3 className="font-['Plus_Jakarta_Sans'] text-2xl font-bold text-[#074469] mb-2">
              Identificação do Adotante
            </h3>
            <p className="text-sm text-[#41474e] mb-6 max-w-md mx-auto leading-relaxed">
              Para registrar seu interesse no <strong>{pet.name}</strong> e poder acompanhar cada etapa do processo em tempo real na aba <strong>Minhas Adoções</strong>, por favor faça login ou crie sua conta gratuita.
            </p>
            <button
              onClick={onRequireLogin}
              className="bg-[#074469] hover:bg-[#2a5c82] text-white font-bold text-sm px-8 py-3.5 rounded-xl transition-all shadow-md cursor-pointer inline-flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-lg">arrow_forward</span>
              <span>Entrar / Cadastrar-se no MatchPet</span>
            </button>
          </div>
        )}

        {/* ========================================================================= */}
        {/* PASSO 1: DADOS DE CONTATO DO ADOTANTE */}
        {/* ========================================================================= */}
        {currentUser && step === 1 && (
          <form onSubmit={handleNextStep1} className="space-y-4 text-sm animate-in fade-in duration-200">
            <div className="bg-[#f7f9fb] p-4 rounded-2xl border border-[#074469]/20 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#074469] text-white flex items-center justify-center font-bold">
                  {currentUser.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="font-bold text-[#074469] text-sm">Adotante Conectado(a)</p>
                  <p className="text-xs text-[#72787f]">{currentUser.email}</p>
                </div>
              </div>
              <span className="bg-[#a0efd6] text-[#126b57] text-xs font-bold px-3 py-1 rounded-full">
                Verificado ✓
              </span>
            </div>

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
                className="w-full bg-[#f2f4f6] border border-[#c1c7cf] rounded-xl p-3 outline-none focus:border-[#074469] focus:bg-white text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#41474e] mb-1">
                WhatsApp / Telefone para Contato da ONG *
              </label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(formatPhone(e.target.value))}
                placeholder="(11) 98765-4321"
                className="w-full bg-[#f2f4f6] border border-[#c1c7cf] rounded-xl p-3 outline-none focus:border-[#074469] focus:bg-white text-sm"
              />
              <p className="text-[11px] text-[#72787f] mt-1">
                A ONG <strong>{pet.ongName}</strong> usará este contato para confirmar a entrevista e agendamento.
              </p>
            </div>

            <div className="flex justify-end pt-4 border-t border-[#e0e3e5]">
              <button
                type="submit"
                className="bg-[#074469] hover:bg-[#2a5c82] text-white font-bold text-sm px-7 py-3 rounded-xl transition-all shadow-xs flex items-center gap-2 cursor-pointer"
              >
                <span>Avançar para Perfil do Lar</span>
                <span className="material-symbols-outlined text-base">arrow_forward</span>
              </button>
            </div>
          </form>
        )}

        {/* ========================================================================= */}
        {/* PASSO 2: PERFIL DO LAR E AMBIENTE */}
        {/* ========================================================================= */}
        {currentUser && step === 2 && (
          <form onSubmit={handleNextStep2} className="space-y-5 text-sm animate-in fade-in duration-200">
            <div>
              <label className="block text-xs font-semibold text-[#41474e] mb-2">
                Tipo de Residência *
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {[
                  { label: 'Casa com quintal seguro', icon: 'home' },
                  { label: 'Apartamento com tela de proteção', icon: 'apartment' },
                  { label: 'Sítio / Chácara', icon: 'nature_people' },
                  { label: 'Casa sem quintal', icon: 'cottage' }
                ].map((item) => (
                  <button
                    key={item.label}
                    type="button"
                    onClick={() => setHousingType(item.label)}
                    className={`p-3 rounded-2xl border text-left flex items-center gap-3 transition-all cursor-pointer ${
                      housingType === item.label
                        ? 'border-[#074469] bg-[#cde5ff]/30 text-[#074469] font-bold shadow-2xs'
                        : 'border-[#c1c7cf]/60 bg-[#f2f4f6] text-[#41474e] hover:bg-white'
                    }`}
                  >
                    <span className="material-symbols-outlined text-xl">{item.icon}</span>
                    <span className="text-xs sm:text-sm">{item.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#41474e] mb-1.5">
                  Possui outros animais em casa?
                </label>
                <div className="flex gap-2">
                  {['Sim', 'Não'].map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setHasOtherPets(opt)}
                      className={`flex-1 py-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                        hasOtherPets === opt
                          ? 'border-[#074469] bg-[#074469] text-white'
                          : 'border-[#c1c7cf] bg-[#f2f4f6] text-[#41474e]'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#41474e] mb-1.5">
                  Há crianças ou idosos no lar?
                </label>
                <div className="flex gap-2">
                  {['Sim', 'Não'].map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setHasChildrenOrElderly(opt)}
                      className={`flex-1 py-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                        hasChildrenOrElderly === opt
                          ? 'border-[#074469] bg-[#074469] text-white'
                          : 'border-[#c1c7cf] bg-[#f2f4f6] text-[#41474e]'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#41474e] mb-1.5">
                Quantas horas o pet ficará sozinho por dia?
              </label>
              <div className="grid grid-cols-3 gap-2">
                {['Menos de 4h', '4h a 8h', 'Mais de 8h'].map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => setHoursAlone(opt)}
                    className={`py-2.5 px-1 rounded-xl border text-xs font-semibold transition-all cursor-pointer text-center ${
                      hoursAlone === opt
                        ? 'border-[#074469] bg-[#074469] text-white font-bold'
                        : 'border-[#c1c7cf] bg-[#f2f4f6] text-[#41474e]'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex justify-between items-center pt-4 border-t border-[#e0e3e5]">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="text-[#72787f] hover:text-[#191c1e] text-xs font-bold px-4 py-2 rounded-xl cursor-pointer"
              >
                ← Voltar
              </button>
              <button
                type="submit"
                className="bg-[#074469] hover:bg-[#2a5c82] text-white font-bold text-sm px-7 py-3 rounded-xl transition-all shadow-xs flex items-center gap-2 cursor-pointer"
              >
                <span>Avançar para Agendamento</span>
                <span className="material-symbols-outlined text-base">arrow_forward</span>
              </button>
            </div>
          </form>
        )}

        {/* ========================================================================= */}
        {/* PASSO 3: VISITA, MENSAGEM E ENVIO */}
        {/* ========================================================================= */}
        {currentUser && step === 3 && (
          <form onSubmit={handleFinalSubmit} className="space-y-4 text-sm animate-in fade-in duration-200">
            <div>
              <label className="block text-xs font-semibold text-[#41474e] mb-1.5">
                Melhor Dia / Horário para Visita ou Entrevista *
              </label>
              <select
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-[#f2f4f6] border border-[#c1c7cf] rounded-xl p-3 outline-none focus:border-[#074469] focus:bg-white text-sm cursor-pointer font-medium"
              >
                <option value="Sábado, 10h às 12h">Sábado, 10h às 12h (Manhã)</option>
                <option value="Sábado, 14h às 16h">Sábado, 14h às 16h (Tarde)</option>
                <option value="Domingo, 11h às 13h">Domingo, 11h às 13h</option>
                <option value="Dia de semana (A combinar com a ONG)">Dia de semana (A combinar com a ONG)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#41474e] mb-1">
                Mensagem ou Dúvidas para a ONG (Opcional)
              </label>
              <textarea
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder={`Conte para a ${pet.ongName || 'ONG'} por que você se interessou pelo ${pet.name}, sua experiência prévia com pets ou envie perguntas...`}
                className="w-full bg-[#f2f4f6] border border-[#c1c7cf] rounded-xl p-3 outline-none focus:border-[#074469] focus:bg-white resize-none text-sm"
              />
            </div>

            <div className="bg-[#a0efd6]/30 p-4 rounded-2xl border border-[#126b57]/20 flex items-center gap-3">
              <span className="material-symbols-outlined text-[#126b57] text-2xl">verified_user</span>
              <p className="text-xs text-[#005141] leading-relaxed">
                Ao enviar, seu interesse será registrado e vinculado à sua conta. Você poderá acompanhar o status em tempo real na aba <strong>Minhas Adoções</strong>.
              </p>
            </div>

            <div className="flex justify-between items-center pt-4 border-t border-[#e0e3e5]">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="text-[#72787f] hover:text-[#191c1e] text-xs font-bold px-4 py-2 rounded-xl cursor-pointer"
              >
                ← Voltar
              </button>
              <button
                type="submit"
                disabled={loading}
                className="bg-[#126b57] hover:bg-[#005141] text-white font-bold text-sm px-8 py-3.5 rounded-xl transition-all shadow-md flex items-center gap-2 cursor-pointer"
              >
                {loading ? (
                  <span>Registrando...</span>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-lg">send</span>
                    <span>Enviar Interesse na Adoção</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}

        {/* ========================================================================= */}
        {/* PASSO 4: SUCESSO, PROTOCOLO E BOTÃO DIRETO PARA MINHAS ADOÇÕES */}
        {/* ========================================================================= */}
        {step === 4 && (
          <div className="text-center py-6 animate-in zoom-in-95 duration-300">
            <div className="w-20 h-20 bg-[#a0efd6] text-[#126b57] rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-sm">
              <span className="material-symbols-outlined text-4xl">check_circle</span>
            </div>

            <span className="bg-[#f2f4f6] text-[#074469] font-mono font-bold text-xs px-3 py-1 rounded-full border border-[#e0e3e5]">
              Protocolo #{protocolCode}
            </span>

            <h3 className="font-['Plus_Jakarta_Sans'] text-2xl sm:text-3xl font-bold text-[#074469] mt-3 mb-2">
              Interesse Registrado com Sucesso! 🎉
            </h3>

            <p className="text-sm text-[#41474e] max-w-md mx-auto mb-6 leading-relaxed">
              A ONG <strong>{pet.ongName}</strong> recebeu seu interesse em adotar o(a) <strong>{pet.name}</strong>. O processo já está visível na sua área exclusiva.
            </p>

            {/* Caixa com próximos passos */}
            <div className="bg-[#f7f9fb] p-5 rounded-2xl border border-[#e0e3e5] text-left max-w-md mx-auto mb-6 space-y-2.5 text-xs text-[#41474e]">
              <p className="font-bold text-[#074469] text-sm mb-1">Próximos passos:</p>
              <div className="flex items-start gap-2">
                <span className="material-symbols-outlined text-[#126b57] text-base shrink-0">mark_chat_read</span>
                <span>A ONG analisará suas informações e responderá via WhatsApp ou Telefone.</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="material-symbols-outlined text-[#074469] text-base shrink-0">visibility</span>
                <span>Acompanhe o status e converse diretamente com a instituição em <strong>Minhas Adoções</strong>.</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center max-w-md mx-auto">
              <button
                onClick={() => {
                  onClose();
                  onGoToMyAdoptions();
                }}
                className="flex-1 bg-[#074469] hover:bg-[#2a5c82] text-white font-bold text-sm py-3.5 px-6 rounded-xl transition-all shadow-md cursor-pointer flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-base">assignment</span>
                <span>Acompanhar em Minhas Adoções</span>
              </button>
              <button
                onClick={onClose}
                className="bg-[#f2f4f6] hover:bg-[#e0e3e5] text-[#41474e] font-semibold text-xs py-3.5 px-5 rounded-xl cursor-pointer"
              >
                Explorar Mais Pets
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
