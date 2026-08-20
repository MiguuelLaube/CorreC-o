import React, { useState } from 'react';
import { Pet, Solicitation, FosterRequest, User } from '../types';

interface UserAdoptionsViewProps {
  currentUser: User;
  solicitations: Solicitation[];
  fosterRequests: FosterRequest[];
  pets: Pet[];
  onSelectPet: (pet: Pet) => void;
  onOpenNewFoster: () => void;
  onOpenAdoptionGallery: () => void;
  onCancelSolicitation?: (solicitationId: string) => void;
}

export const UserAdoptionsView: React.FC<UserAdoptionsViewProps> = ({
  currentUser,
  solicitations,
  fosterRequests,
  pets,
  onSelectPet,
  onOpenNewFoster,
  onOpenAdoptionGallery,
  onCancelSolicitation
}) => {
  const [filterStatus, setFilterStatus] = useState<'todos' | 'em_andamento' | 'aprovadas' | 'triagens'>('todos');
  const [cancelingId, setCancelingId] = useState<string | null>(null);

  const userEmail = currentUser.email.toLowerCase();

  // Filtragem estrita para o usuário logado
  const userSolicitations = solicitations.filter(
    (s) =>
      (s.userId && s.userId === currentUser.id) ||
      (s.requesterEmail && s.requesterEmail.toLowerCase() === userEmail) ||
      (s.email && s.email.toLowerCase() === userEmail)
  );

  const userFosters = fosterRequests.filter(
    (f) =>
      (f.userId && f.userId === currentUser.id) ||
      (f.requesterEmail && f.requesterEmail.toLowerCase() === userEmail) ||
      !f.requesterEmail
  );

  const inProgressAdoptions = userSolicitations.filter(
    (s) => s.status === 'pending' || s.status === 'in_review' || (s.type === 'Visita' && s.status !== 'approved' && s.status !== 'rejected')
  );

  const approvedAdoptions = userSolicitations.filter(
    (s) => s.status === 'approved' || s.status === 'completed' || s.adoptionGranted === true
  );

  const filteredList =
    filterStatus === 'em_andamento'
      ? inProgressAdoptions
      : filterStatus === 'aprovadas'
      ? approvedAdoptions
      : userSolicitations;

  const totalActive = inProgressAdoptions.length + approvedAdoptions.length + userFosters.length;

  const handleConfirmCancel = (id: string) => {
    if (onCancelSolicitation) {
      onCancelSolicitation(id);
    }
    setCancelingId(null);
  };

  return (
    <main className="flex-grow pt-8 pb-20 px-4 md:px-16 max-w-7xl mx-auto w-full font-['Be_Vietnam_Pro']">
      {/* Header do Portal do Adotante */}
      <header className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#e0e3e5]">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="bg-[#074469] text-[#a0efd6] text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full">
                Área do Adotante
              </span>
              <span className="text-xs text-[#72787f]">Minhas Adoções & Interesses</span>
            </div>
            <h1 className="font-['Plus_Jakarta_Sans'] text-3xl md:text-4xl font-bold text-[#074469]">
              Olá, {currentUser.name}!
            </h1>
            <p className="text-sm md:text-base text-[#41474e] mt-1">
              Acompanhe o status em tempo real de cada animal em que você manifestou interesse.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onOpenAdoptionGallery}
              className="bg-[#074469] hover:bg-[#2a5c82] text-white text-xs sm:text-sm font-semibold px-5 py-3 rounded-xl transition-all shadow-xs flex items-center gap-2 cursor-pointer"
            >
              <span className="material-symbols-outlined text-base">search</span>
              <span>Encontrar Mais Pets</span>
            </button>
          </div>
        </div>

        {/* Barra de Filtros Rápidos */}
        <div className="flex overflow-x-auto gap-2 mt-6 p-1.5 bg-[#eceef0] rounded-2xl border border-[#c1c7cf]/40 text-xs sm:text-sm font-semibold">
          <button
            onClick={() => setFilterStatus('todos')}
            className={`flex-1 min-w-[140px] py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer ${
              filterStatus === 'todos' ? 'bg-[#074469] text-white shadow-xs' : 'text-[#41474e] hover:bg-white/60'
            }`}
          >
            <span>Todos os Processos</span>
            <span
              className={`text-[11px] px-2 py-0.2 rounded-full font-bold ${
                filterStatus === 'todos' ? 'bg-[#a0efd6] text-[#074469]' : 'bg-[#e0e3e5]'
              }`}
            >
              {userSolicitations.length}
            </span>
          </button>

          <button
            onClick={() => setFilterStatus('em_andamento')}
            className={`flex-1 min-w-[150px] py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer ${
              filterStatus === 'em_andamento' ? 'bg-[#074469] text-white shadow-xs' : 'text-[#41474e] hover:bg-white/60'
            }`}
          >
            <span className="material-symbols-outlined text-base">hourglass_top</span>
            <span>Em Andamento ({inProgressAdoptions.length})</span>
          </button>

          <button
            onClick={() => setFilterStatus('aprovadas')}
            className={`flex-1 min-w-[160px] py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer ${
              filterStatus === 'aprovadas' ? 'bg-[#074469] text-white shadow-xs' : 'text-[#41474e] hover:bg-white/60'
            }`}
          >
            <span className="material-symbols-outlined text-base">verified</span>
            <span>Aprovadas ({approvedAdoptions.length})</span>
          </button>

          <button
            onClick={() => setFilterStatus('triagens')}
            className={`flex-1 min-w-[150px] py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer ${
              filterStatus === 'triagens' ? 'bg-[#074469] text-white shadow-xs' : 'text-[#41474e] hover:bg-white/60'
            }`}
          >
            <span className="material-symbols-outlined text-base">clinical_notes</span>
            <span>Triagens ({userFosters.length})</span>
          </button>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* SEÇÃO PRINCIPAL DE ADOÇÕES */}
      {/* ========================================================================= */}
      {filterStatus !== 'triagens' && (
        <div className="space-y-6">
          {filteredList.length === 0 ? (
            <div className="bg-white rounded-3xl p-10 md:p-14 text-center border border-[#e0e3e5] shadow-xs">
              <div className="w-16 h-16 bg-[#cde5ff] text-[#074469] rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="material-symbols-outlined text-3xl">pets</span>
              </div>
              <h3 className="font-['Plus_Jakarta_Sans'] text-2xl font-bold text-[#074469] mb-2">
                Nenhum processo de adoção encontrado
              </h3>
              <p className="text-sm text-[#41474e] max-w-md mx-auto mb-6">
                Você ainda não possui processos nesta categoria. Explore os pets disponíveis no MatchPet e manifeste seu interesse!
              </p>
              <button
                onClick={onOpenAdoptionGallery}
                className="bg-[#074469] hover:bg-[#2a5c82] text-white font-bold text-sm px-6 py-3 rounded-xl transition-all shadow-xs cursor-pointer inline-flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-base">favorite</span>
                <span>Explorar Animais para Adoção</span>
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {filteredList.map((item) => {
                const pet = pets.find((p) => p.id === item.petId || p.name.toLowerCase() === item.petName.toLowerCase());
                const petImage =
                  item.petImage ||
                  pet?.mainImage ||
                  'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=600&q=80';

                const isApproved = item.status === 'approved' || item.status === 'completed' || item.adoptionGranted;
                const isInReview = item.status === 'in_review';
                const isRejected = item.status === 'rejected';
                const isCanceled = item.status === 'canceled';
                const isPending = !isApproved && !isInReview && !isRejected && !isCanceled;

                // Etapa da timeline (1: Registrado, 2: Em Análise, 3: Visita/Entrevista, 4: Concedida)
                const currentStepNumber = isApproved ? 4 : isInReview ? 2 : isPending ? 1 : 1;

                const phoneClean = (item.ongPhone || '(11) 98765-4321').replace(/\D/g, '');
                const whatsappMessage = encodeURIComponent(
                  `Olá, equipe da ${item.ongName || 'ONG'}! Registrei interesse na adoção do(a) pet ${item.petName} (Protocolo #${String(item.id).slice(-6)}). Gostaria de acompanhar o processo!`
                );

                return (
                  <div
                    key={item.id}
                    className={`bg-white rounded-3xl p-6 sm:p-8 shadow-xs border transition-all ${
                      isApproved
                        ? 'border-[#126b57]/40 ring-1 ring-[#126b57]/30'
                        : isCanceled
                        ? 'border-[#c1c7cf] opacity-75'
                        : 'border-[#e0e3e5] hover:border-[#074469]/30'
                    }`}
                  >
                    {/* Header do Card */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#e0e3e5]">
                      <div className="flex items-center gap-4">
                        <img
                          src={petImage}
                          alt={item.petName}
                          className="w-20 h-20 rounded-2xl object-cover border border-[#e0e3e5] shadow-xs shrink-0"
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-[11px] font-mono font-bold text-[#72787f] uppercase">
                              Protocolo #{String(item.id).slice(-6)}
                            </span>
                            <span className="text-xs text-[#72787f]">•</span>
                            <span className="text-xs text-[#72787f]">
                              {item.createdAt ? new Date(item.createdAt).toLocaleDateString('pt-BR') : 'Hoje'}
                            </span>
                          </div>

                          <h2 className="font-['Plus_Jakarta_Sans'] text-2xl font-bold text-[#074469]">
                            {item.petName}
                          </h2>

                          <p className="text-xs text-[#41474e] mt-0.5">
                            ONG: <strong className="text-[#074469]">{item.ongName || 'ONG Parceira'}</strong> • Local: {item.ongAddress || 'São Paulo - SP'}
                          </p>
                        </div>
                      </div>

                      {/* Status Badge Principal */}
                      <div>
                        {isApproved && (
                          <div className="bg-[#126b57] text-white px-5 py-2.5 rounded-2xl flex items-center gap-2.5 shadow-xs">
                            <span className="material-symbols-outlined text-2xl">verified</span>
                            <div>
                              <p className="text-[10px] uppercase font-bold tracking-wider text-[#a0efd6]">Status</p>
                              <p className="font-['Plus_Jakarta_Sans'] text-sm font-bold">Adoção Concedida! 🎉</p>
                            </div>
                          </div>
                        )}

                        {isInReview && (
                          <div className="bg-[#cde5ff] text-[#003355] px-5 py-2.5 rounded-2xl flex items-center gap-2.5">
                            <span className="material-symbols-outlined text-2xl text-[#074469]">hourglass_top</span>
                            <div>
                              <p className="text-[10px] uppercase font-bold tracking-wider text-[#003355]/70">Status</p>
                              <p className="font-['Plus_Jakarta_Sans'] text-sm font-bold">Em Análise pela ONG</p>
                            </div>
                          </div>
                        )}

                        {isPending && (
                          <div className="bg-[#ffdbc9] text-[#6d2f00] px-5 py-2.5 rounded-2xl flex items-center gap-2.5">
                            <span className="material-symbols-outlined text-2xl text-[#914100]">schedule</span>
                            <div>
                              <p className="text-[10px] uppercase font-bold tracking-wider text-[#6d2f00]/70">Status</p>
                              <p className="font-['Plus_Jakarta_Sans'] text-sm font-bold">Interesse Registrado</p>
                            </div>
                          </div>
                        )}

                        {isRejected && (
                          <div className="bg-[#ffdad6] text-[#ba1a1a] px-5 py-2.5 rounded-2xl flex items-center gap-2.5">
                            <span className="material-symbols-outlined text-2xl">cancel</span>
                            <div>
                              <p className="text-[10px] uppercase font-bold tracking-wider text-[#ba1a1a]/70">Resultado</p>
                              <p className="font-['Plus_Jakarta_Sans'] text-sm font-bold">Não Aprovado</p>
                            </div>
                          </div>
                        )}

                        {isCanceled && (
                          <div className="bg-[#f2f4f6] text-[#72787f] px-5 py-2.5 rounded-2xl flex items-center gap-2.5 border border-[#c1c7cf]">
                            <span className="material-symbols-outlined text-2xl">do_not_disturb_on</span>
                            <div>
                              <p className="text-[10px] uppercase font-bold tracking-wider">Status</p>
                              <p className="font-['Plus_Jakarta_Sans'] text-sm font-bold">Cancelado pelo Adotante</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Timeline de Progresso Visual (4 Etapas) */}
                    {!isCanceled && !isRejected && (
                      <div className="py-6 border-b border-[#e0e3e5]">
                        <p className="text-xs font-bold text-[#72787f] uppercase tracking-wider mb-4">
                          Linha do Tempo da Adoção
                        </p>
                        <div className="grid grid-cols-4 gap-2 sm:gap-4 relative">
                          {/* Passo 1 */}
                          <div className="flex flex-col items-center text-center">
                            <div className="w-8 h-8 rounded-full bg-[#074469] text-white flex items-center justify-center text-xs font-bold mb-1 shadow-2xs">
                              ✓
                            </div>
                            <span className="text-[11px] sm:text-xs font-bold text-[#074469]">1. Interesse</span>
                            <span className="text-[10px] text-[#72787f] hidden sm:block">Enviado com sucesso</span>
                          </div>

                          {/* Passo 2 */}
                          <div className="flex flex-col items-center text-center">
                            <div
                              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold mb-1 shadow-2xs ${
                                currentStepNumber >= 2
                                  ? 'bg-[#074469] text-white'
                                  : 'bg-[#f2f4f6] text-[#72787f] border border-[#c1c7cf]'
                              }`}
                            >
                              {currentStepNumber >= 2 ? '✓' : '2'}
                            </div>
                            <span
                              className={`text-[11px] sm:text-xs font-bold ${
                                currentStepNumber >= 2 ? 'text-[#074469]' : 'text-[#72787f]'
                              }`}
                            >
                              2. Análise
                            </span>
                            <span className="text-[10px] text-[#72787f] hidden sm:block">Avaliação do Lar</span>
                          </div>

                          {/* Passo 3 */}
                          <div className="flex flex-col items-center text-center">
                            <div
                              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold mb-1 shadow-2xs ${
                                currentStepNumber >= 3
                                  ? 'bg-[#074469] text-white'
                                  : 'bg-[#f2f4f6] text-[#72787f] border border-[#c1c7cf]'
                              }`}
                            >
                              {currentStepNumber >= 3 ? '✓' : '3'}
                            </div>
                            <span
                              className={`text-[11px] sm:text-xs font-bold ${
                                currentStepNumber >= 3 ? 'text-[#074469]' : 'text-[#72787f]'
                              }`}
                            >
                              3. Visita
                            </span>
                            <span className="text-[10px] text-[#72787f] hidden sm:block">Conhecer o pet</span>
                          </div>

                          {/* Passo 4 */}
                          <div className="flex flex-col items-center text-center">
                            <div
                              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold mb-1 shadow-2xs ${
                                currentStepNumber >= 4
                                  ? 'bg-[#126b57] text-white'
                                  : 'bg-[#f2f4f6] text-[#72787f] border border-[#c1c7cf]'
                              }`}
                            >
                              {currentStepNumber >= 4 ? '🎉' : '4'}
                            </div>
                            <span
                              className={`text-[11px] sm:text-xs font-bold ${
                                currentStepNumber >= 4 ? 'text-[#126b57]' : 'text-[#72787f]'
                              }`}
                            >
                              4. Concessão
                            </span>
                            <span className="text-[10px] text-[#72787f] hidden sm:block">Pet em casa!</span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Detalhes & Próximas Ações Rápidas */}
                    <div className="pt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
                      {/* Coluna 1 e 2: Informações do Cadastro */}
                      <div className="lg:col-span-2 space-y-3">
                        <div className="bg-[#f7f9fb] p-4 rounded-2xl border border-[#e0e3e5] space-y-2 text-xs sm:text-sm">
                          <div className="flex justify-between items-center pb-2 border-b border-[#e0e3e5]">
                            <span className="text-[#72787f]">Data & Agendamento Preferido:</span>
                            <strong className="text-[#074469]">{item.dateOrDetails || 'A combinar com a ONG'}</strong>
                          </div>
                          {item.notes && (
                            <div className="pt-1">
                              <span className="text-[#72787f] block mb-0.5">Informações do Questionário:</span>
                              <p className="text-[#191c1e] text-xs bg-white p-2.5 rounded-xl border border-[#e0e3e5]">
                                {item.notes}
                              </p>
                            </div>
                          )}
                        </div>

                        {/* Botões de Ação do Adotante */}
                        <div className="flex flex-wrap gap-2 pt-1">
                          {pet && (
                            <button
                              onClick={() => onSelectPet(pet)}
                              className="bg-[#f2f4f6] hover:bg-[#e0e3e5] text-[#074469] text-xs font-bold px-4 py-2.5 rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
                            >
                              <span className="material-symbols-outlined text-base">visibility</span>
                              <span>Ver Ficha do Pet</span>
                            </button>
                          )}

                          {!isCanceled && !isApproved && (
                            <button
                              onClick={() => setCancelingId(item.id)}
                              className="bg-white hover:bg-[#ffdad6] text-[#ba1a1a] text-xs font-semibold px-4 py-2.5 rounded-xl transition-colors border border-[#ffdad6] cursor-pointer ml-auto"
                            >
                              Cancelar Solicitação
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Coluna 3: Caixa de Contato Direto com a ONG */}
                      <div className="bg-[#f7f9fb] p-5 rounded-2xl border border-[#e0e3e5] flex flex-col justify-between space-y-4">
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <span className="material-symbols-outlined text-[#074469] text-xl">support_agent</span>
                            <h4 className="font-['Plus_Jakarta_Sans'] text-sm font-bold text-[#074469]">
                              Contato da ONG
                            </h4>
                          </div>
                          <p className="text-xs text-[#41474e] font-semibold">{item.ongName || 'ONG Parceira'}</p>
                          <p className="text-xs text-[#72787f] mt-0.5">{item.ongPhone || '(11) 98765-4321'}</p>
                          <p className="text-xs text-[#72787f] break-all">{item.ongEmail || 'contato@ong.org.br'}</p>
                        </div>

                        <div className="space-y-2">
                          <a
                            href={`https://wa.me/55${phoneClean}?text=${whatsappMessage}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full bg-[#126b57] hover:bg-[#005141] text-white text-xs font-bold py-2.5 px-3 rounded-xl transition-all shadow-xs flex items-center justify-center gap-2"
                          >
                            <span className="material-symbols-outlined text-base">chat</span>
                            <span>Falar no WhatsApp</span>
                          </a>

                          <a
                            href={`tel:${item.ongPhone || '11987654321'}`}
                            className="w-full bg-white hover:bg-[#e0e3e5] text-[#074469] text-xs font-semibold py-2 px-3 rounded-xl transition-colors border border-[#c1c7cf] flex items-center justify-center gap-1.5"
                          >
                            <span className="material-symbols-outlined text-base">call</span>
                            <span>Ligar para a ONG</span>
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* SEÇÃO DE TRIAGENS & ACOLHIMENTOS */}
      {/* ========================================================================= */}
      {filterStatus === 'triagens' && (
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="font-['Plus_Jakarta_Sans'] text-2xl font-bold text-[#074469]">
                Triagens & Pedidos de Acolhimento
              </h2>
              <p className="text-xs text-[#72787f]">
                Acompanhe o suporte de ONGs parceiras para animais resgatados ou em situação de vulnerabilidade.
              </p>
            </div>

            <button
              onClick={onOpenNewFoster}
              className="bg-[#126b57] hover:bg-[#005141] text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition-all shadow-xs flex items-center gap-1.5 cursor-pointer shrink-0"
            >
              <span className="material-symbols-outlined text-base">add_circle</span>
              <span>Novo Pedido de Acolhimento</span>
            </button>
          </div>

          {userFosters.length === 0 ? (
            <div className="bg-white rounded-3xl p-10 text-center border border-[#e0e3e5]">
              <p className="text-sm text-[#72787f] mb-4">Você não possui pedidos de triagem no momento.</p>
              <button
                onClick={onOpenNewFoster}
                className="bg-[#074469] text-white font-bold text-xs px-5 py-2.5 rounded-xl"
              >
                Solicitar Triagem / Acolhimento
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6">
              {userFosters.map((foster) => {
                const isAccepted = foster.status === 'accepted';

                return (
                  <div
                    key={foster.id}
                    className={`bg-white rounded-3xl p-6 sm:p-8 shadow-xs border transition-all ${
                      isAccepted ? 'border-[#126b57]/40 ring-1 ring-[#126b57]/20' : 'border-[#e0e3e5]'
                    }`}
                  >
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 pb-4 border-b border-[#e0e3e5]">
                      <div>
                        <span className="text-xs text-[#72787f] font-mono font-semibold uppercase">
                          Triagem #{String(foster.id || '000000').slice(-6)} • {foster.timestamp}
                        </span>
                        <h3 className="font-['Plus_Jakarta_Sans'] text-2xl font-bold text-[#074469]">
                          {foster.petName} ({foster.species})
                        </h3>
                      </div>

                      <div>
                        {isAccepted ? (
                          <span className="bg-[#a0efd6] text-[#126b57] px-4 py-1.5 rounded-full text-xs font-bold inline-flex items-center gap-1">
                            <span className="material-symbols-outlined text-base">verified_user</span>
                            Acolhimento Aceito ✓
                          </span>
                        ) : (
                          <span className="bg-[#ffdbc9] text-[#6d2f00] px-4 py-1.5 rounded-full text-xs font-bold inline-flex items-center gap-1">
                            <span className="material-symbols-outlined text-base">hourglass_empty</span>
                            Em Avaliação pelas ONGs
                          </span>
                        )}
                      </div>
                    </div>

                    <p className="mt-4 bg-[#f7f9fb] p-4 rounded-xl text-sm text-[#191c1e] border border-[#e0e3e5]">
                      <strong>Motivo informado:</strong> {foster.reason}
                    </p>

                    {isAccepted && (
                      <div className="mt-4 bg-[#a0efd6]/30 p-4 rounded-xl border border-[#126b57]/20">
                        <p className="text-xs font-bold text-[#074469] mb-1">
                          Instituição Acolhedora: {foster.acceptedByOngName || 'Amigos de Patas'}
                        </p>
                        <p className="text-xs text-[#41474e]">
                          Contato: {foster.acceptedByOngPhone || '(11) 98765-4321'} • Endereço:{' '}
                          {foster.acceptedByOngAddress || 'São Paulo - SP'}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </section>
      )}

      {/* MODAL DE CONFIRMAÇÃO DE CANCELAMENTO */}
      {cancelingId && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 text-center shadow-2xl border border-[#e0e3e5] animate-in zoom-in-95">
            <div className="w-14 h-14 bg-[#ffdad6] text-[#ba1a1a] rounded-2xl flex items-center justify-center mx-auto mb-3">
              <span className="material-symbols-outlined text-3xl">warning</span>
            </div>
            <h3 className="font-['Plus_Jakarta_Sans'] text-xl font-bold text-[#074469] mb-2">
              Cancelar Manifestação de Interesse?
            </h3>
            <p className="text-xs text-[#41474e] mb-6">
              A ONG será informada sobre o encerramento do processo e a vaga para adoção deste pet será liberada para outros interessados.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setCancelingId(null)}
                className="flex-1 bg-[#f2f4f6] hover:bg-[#e0e3e5] text-[#41474e] font-semibold text-xs py-2.5 rounded-xl cursor-pointer"
              >
                Voltar
              </button>
              <button
                onClick={() => handleConfirmCancel(cancelingId)}
                className="flex-1 bg-[#ba1a1a] hover:bg-[#93000a] text-white font-bold text-xs py-2.5 rounded-xl transition-colors cursor-pointer"
              >
                Confirmar Cancelamento
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};
