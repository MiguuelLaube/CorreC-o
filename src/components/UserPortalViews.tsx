import React from 'react';
import { ActiveTab, Pet, Solicitation, FosterRequest, User } from '../types';

interface UserPortalProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  currentUser: User | null;
  solicitations: Solicitation[];
  fosterRequests: FosterRequest[];
  pets: Pet[];
  onSelectPet: (pet: Pet) => void;
  onOpenNewFoster: () => void;
  onOpenAdoptionGallery: () => void;
}

export const UserPortalViews: React.FC<UserPortalProps> = ({
  activeTab,
  setActiveTab,
  currentUser,
  solicitations,
  fosterRequests,
  pets,
  onSelectPet,
  onOpenNewFoster,
  onOpenAdoptionGallery
}) => {
  // Filtros de solicitações e acolhimentos do usuário (ou todas as vinculadas ao perfil logado)
  const userEmail = currentUser?.email?.toLowerCase();
  
  // Interesses em Adoção (Visitas e manifestações de interesse)
  const interestSolicitations = solicitations.filter(
    (s) => s.type === 'Visita' || (s.requesterEmail && s.requesterEmail.toLowerCase() === userEmail)
  );

  // Solicitações formais de adoção
  const adoptionSolicitations = solicitations.filter(
    (s) => s.type === 'Adoção' || s.adoptionGranted !== undefined
  );

  // Triagens / Acolhimentos
  const userFosterRequests = fosterRequests;

  return (
    <main className="flex-grow pt-8 pb-20 px-4 md:px-16 max-w-7xl mx-auto w-full">
      {/* Header do Portal do Cliente */}
      <header className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#e0e3e5]">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="bg-[#074469] text-[#a0efd6] text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full">
                Portal do Adotante
              </span>
              <span className="text-xs text-[#72787f]">Área do Cliente Logado</span>
            </div>
            <h1 className="font-['Plus_Jakarta_Sans'] text-3xl md:text-4xl font-bold text-[#074469]">
              Olá, {currentUser?.name || 'Adotante'}!
            </h1>
            <p className="font-['Be_Vietnam_Pro'] text-sm md:text-base text-[#41474e] mt-1">
              Acompanhe aqui o status dos seus interesses, solicitações de adoção e triagens em tempo real.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onOpenAdoptionGallery}
              className="bg-[#074469] hover:bg-[#2a5c82] text-white font-['Be_Vietnam_Pro'] text-xs font-semibold px-4 py-2.5 rounded-xl transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              <span className="material-symbols-outlined text-base">search</span>
              <span>Explorar Mais Pets</span>
            </button>
          </div>
        </div>

        {/* Barra de Navegação entre as 3 Abas */}
        <div className="flex overflow-x-auto gap-2 sm:gap-4 mt-6 p-1.5 bg-[#eceef0] rounded-2xl border border-[#c1c7cf]/40 font-['Be_Vietnam_Pro'] text-xs sm:text-sm font-semibold">
          {/* Aba 1 */}
          <button
            onClick={() => setActiveTab('status-interesse')}
            className={`flex-1 min-w-[200px] py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer ${
              activeTab === 'status-interesse'
                ? 'bg-[#074469] text-white shadow-sm'
                : 'text-[#41474e] hover:text-[#074469] hover:bg-white/60'
            }`}
          >
            <span className="material-symbols-outlined text-lg">favorite</span>
            <span>Status de Interesse</span>
            <span
              className={`text-[11px] px-2 py-0.5 rounded-full font-bold ${
                activeTab === 'status-interesse'
                  ? 'bg-[#a0efd6] text-[#074469]'
                  : 'bg-[#e0e3e5] text-[#5b636a]'
              }`}
            >
              {interestSolicitations.length}
            </span>
          </button>

          {/* Aba 2 */}
          <button
            onClick={() => setActiveTab('solicitacoes-adocao')}
            className={`flex-1 min-w-[200px] py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer ${
              activeTab === 'solicitacoes-adocao'
                ? 'bg-[#074469] text-white shadow-sm'
                : 'text-[#41474e] hover:text-[#074469] hover:bg-white/60'
            }`}
          >
            <span className="material-symbols-outlined text-lg">assignment_turned_in</span>
            <span>Solicitação de Adoção</span>
            <span
              className={`text-[11px] px-2 py-0.5 rounded-full font-bold ${
                activeTab === 'solicitacoes-adocao'
                  ? 'bg-[#a0efd6] text-[#074469]'
                  : 'bg-[#e0e3e5] text-[#5b636a]'
              }`}
            >
              {adoptionSolicitations.length}
            </span>
          </button>

          {/* Aba 3 */}
          <button
            onClick={() => setActiveTab('triagem-incompleta')}
            className={`flex-1 min-w-[200px] py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer ${
              activeTab === 'triagem-incompleta'
                ? 'bg-[#074469] text-white shadow-sm'
                : 'text-[#41474e] hover:text-[#074469] hover:bg-white/60'
            }`}
          >
            <span className="material-symbols-outlined text-lg">clinical_notes</span>
            <span>Triagem Incompleta</span>
            <span
              className={`text-[11px] px-2 py-0.5 rounded-full font-bold ${
                activeTab === 'triagem-incompleta'
                  ? 'bg-[#a0efd6] text-[#074469]'
                  : 'bg-[#e0e3e5] text-[#5b636a]'
              }`}
            >
              {userFosterRequests.length}
            </span>
          </button>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* ABA 1: STATUS DE INTERESSE EM ADOÇÃO */}
      {/* ========================================================================= */}
      {activeTab === 'status-interesse' && (
        <section className="space-y-6 animate-in fade-in duration-300">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="font-['Plus_Jakarta_Sans'] text-2xl font-bold text-[#074469]">
                Seus Interesses em Animais
              </h2>
              <p className="font-['Be_Vietnam_Pro'] text-xs sm:text-sm text-[#72787f]">
                Acompanhe o andamento das visitas e manifestações de interesse que você realizou.
              </p>
            </div>
          </div>

          {interestSolicitations.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-[#e0e3e5] shadow-xs">
              <div className="w-16 h-16 bg-[#a0efd6]/50 text-[#074469] rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="material-symbols-outlined text-3xl">favorite_border</span>
              </div>
              <h3 className="font-['Plus_Jakarta_Sans'] text-xl font-bold text-[#074469] mb-2">
                Nenhum interesse registrado ainda
              </h3>
              <p className="font-['Be_Vietnam_Pro'] text-sm text-[#41474e] max-w-md mx-auto mb-6">
                Navegue pela nossa vitrine de animais resgatados e manifeste seu interesse para agendar uma visita!
              </p>
              <button
                onClick={onOpenAdoptionGallery}
                className="bg-[#074469] text-white font-['Be_Vietnam_Pro'] font-bold text-sm px-6 py-3 rounded-xl hover:bg-[#2a5c82] transition-colors"
              >
                Ver Animais Disponíveis
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {interestSolicitations.map((item) => {
                const pet = pets.find((p) => p.id === item.petId || p.name === item.petName);
                const petImage =
                  item.petImage ||
                  pet?.mainImage ||
                  'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=600&q=80';

                // Determinação visual do estado atual
                const isApproved = item.status === 'approved';
                const isRejected = item.status === 'rejected';
                const isInReview = item.status === 'in_review';
                const isPending = item.status === 'pending' || (!isApproved && !isRejected && !isInReview);

                return (
                  <div
                    key={item.id}
                    className="bg-white rounded-2xl p-6 shadow-xs border border-[#e0e3e5] flex flex-col justify-between hover:border-[#074469]/40 transition-all"
                  >
                    <div>
                      {/* Top status header */}
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={petImage}
                            alt={item.petName}
                            className="w-16 h-16 rounded-xl object-cover border border-[#e0e3e5] shadow-xs"
                          />
                          <div>
                            <span className="text-[11px] font-['Be_Vietnam_Pro'] text-[#72787f] uppercase font-semibold">
                              Interesse em Adoção
                            </span>
                            <h3 className="font-['Plus_Jakarta_Sans'] text-xl font-bold text-[#074469]">
                              {item.petName}
                            </h3>
                            {pet && (
                              <p className="font-['Be_Vietnam_Pro'] text-xs text-[#41474e]">
                                Porte {pet.size} • {pet.gender} • {pet.age}
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Badge de Estado Atual */}
                        <div>
                          {isApproved && (
                            <span className="bg-[#a0efd6] text-[#126b57] font-['Be_Vietnam_Pro'] text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1 shadow-2xs">
                              <span className="material-symbols-outlined text-sm">check_circle</span>
                              Aprovado
                            </span>
                          )}
                          {isInReview && (
                            <span className="bg-[#cde5ff] text-[#003355] font-['Be_Vietnam_Pro'] text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                              <span className="material-symbols-outlined text-sm">hourglass_top</span>
                              Em Análise
                            </span>
                          )}
                          {isPending && (
                            <span className="bg-[#ffdbc9] text-[#6d2f00] font-['Be_Vietnam_Pro'] text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                              <span className="material-symbols-outlined text-sm">schedule</span>
                              Pendente
                            </span>
                          )}
                          {isRejected && (
                            <span className="bg-[#ffdad6] text-[#ba1a1a] font-['Be_Vietnam_Pro'] text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                              <span className="material-symbols-outlined text-sm">cancel</span>
                              Rejeitado
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Informações detalhadas */}
                      <div className="bg-[#f7f9fb] p-4 rounded-xl border border-[#e0e3e5] space-y-2 font-['Be_Vietnam_Pro'] text-xs sm:text-sm text-[#41474e] mb-4">
                        <div className="flex justify-between">
                          <span className="text-[#72787f]">Data do Interesse:</span>
                          <strong className="text-[#191c1e]">
                            {item.createdAt ? new Date(item.createdAt).toLocaleDateString('pt-BR') : '18/08/2026'}
                          </strong>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-[#72787f]">Horário / Detalhes:</span>
                          <span className="text-[#191c1e] font-medium">{item.dateOrDetails}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-[#72787f]">ONG Responsável:</span>
                          <strong className="text-[#074469]">{item.ongName || 'Amigos de Patas'}</strong>
                        </div>
                      </div>

                      {/* Linha de Progresso Visual das Etapas */}
                      <div className="mb-4">
                        <p className="text-[11px] font-bold text-[#72787f] uppercase mb-2 font-['Be_Vietnam_Pro']">
                          Etapa do Processo:
                        </p>
                        <div className="grid grid-cols-3 gap-2 text-center text-[10px] font-['Be_Vietnam_Pro'] font-bold">
                          <div
                            className={`p-2 rounded-lg ${
                              isPending || isInReview || isApproved
                                ? 'bg-[#074469] text-white'
                                : 'bg-[#e0e3e5] text-[#72787f]'
                            }`}
                          >
                            1. Registrado
                          </div>
                          <div
                            className={`p-2 rounded-lg ${
                              isInReview || isApproved
                                ? 'bg-[#074469] text-white'
                                : 'bg-[#e0e3e5] text-[#72787f]'
                            }`}
                          >
                            2. Em Análise
                          </div>
                          <div
                            className={`p-2 rounded-lg ${
                              isApproved
                                ? 'bg-[#126b57] text-white'
                                : isRejected
                                ? 'bg-[#ba1a1a] text-white'
                                : 'bg-[#e0e3e5] text-[#72787f]'
                            }`}
                          >
                            3. {isRejected ? 'Recusado' : 'Visita Aprovada'}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Botões de Ação */}
                    <div className="flex gap-2 pt-3 border-t border-[#e0e3e5]">
                      {pet && (
                        <button
                          onClick={() => onSelectPet(pet)}
                          className="flex-1 bg-[#f2f4f6] hover:bg-[#e0e3e5] text-[#074469] font-['Be_Vietnam_Pro'] text-xs font-semibold py-2.5 rounded-xl transition-colors text-center cursor-pointer"
                        >
                          Ver Ficha do Pet
                        </button>
                      )}
                      <button
                        onClick={() =>
                          alert(
                            `Para dúvidas sobre ${item.petName}, fale com a ${
                              item.ongName || 'ONG'
                            } pelo telefone: ${item.ongPhone || '(11) 98765-4321'}`
                          )
                        }
                        className="flex-1 bg-[#074469] hover:bg-[#2a5c82] text-white font-['Be_Vietnam_Pro'] text-xs font-semibold py-2.5 rounded-xl transition-colors text-center cursor-pointer"
                      >
                        Contatar ONG
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      )}

      {/* ========================================================================= */}
      {/* ABA 2: SOLICITAÇÃO DE ADOÇÃO (COM CONTATO DA ONG E STATUS DE CONCESSÃO) */}
      {/* ========================================================================= */}
      {activeTab === 'solicitacoes-adocao' && (
        <section className="space-y-6 animate-in fade-in duration-300">
          <div>
            <h2 className="font-['Plus_Jakarta_Sans'] text-2xl font-bold text-[#074469]">
              Solicitações Formais de Adoção
            </h2>
            <p className="font-['Be_Vietnam_Pro'] text-xs sm:text-sm text-[#72787f]">
              Verifique se a sua adoção foi concedida e obtenha os dados de contato direto da ONG responsável.
            </p>
          </div>

          {adoptionSolicitations.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-[#e0e3e5] shadow-xs">
              <div className="w-16 h-16 bg-[#cde5ff] text-[#074469] rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="material-symbols-outlined text-3xl">assignment</span>
              </div>
              <h3 className="font-['Plus_Jakarta_Sans'] text-xl font-bold text-[#074469] mb-2">
                Nenhuma solicitação de adoção em andamento
              </h3>
              <p className="font-['Be_Vietnam_Pro'] text-sm text-[#41474e] max-w-md mx-auto mb-6">
                Após manifestar interesse e visitar um animal, sua solicitação formal de adoção aparecerá aqui para acompanhamento.
              </p>
              <button
                onClick={onOpenAdoptionGallery}
                className="bg-[#074469] text-white font-['Be_Vietnam_Pro'] font-bold text-sm px-6 py-3 rounded-xl hover:bg-[#2a5c82] transition-colors"
              >
                Conhecer Pets para Adotar
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {adoptionSolicitations.map((sol) => {
                const isGranted = sol.adoptionGranted || sol.status === 'approved';
                const isPending = sol.status === 'pending' || sol.status === 'in_review';
                const isDenied = sol.status === 'rejected';

                const pet = pets.find((p) => p.id === sol.petId || p.name === sol.petName);
                const petImage =
                  sol.petImage ||
                  pet?.mainImage ||
                  'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=600&q=80';

                return (
                  <div
                    key={sol.id}
                    className={`rounded-3xl p-6 sm:p-8 shadow-sm border transition-all ${
                      isGranted
                        ? 'bg-white border-[#126b57]/40 ring-1 ring-[#126b57]/30'
                        : 'bg-white border-[#e0e3e5]'
                    }`}
                  >
                    {/* Confirmação se a adoção foi concedida */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#e0e3e5]">
                      <div className="flex items-center gap-4">
                        <img
                          src={petImage}
                          alt={sol.petName}
                          className="w-20 h-20 rounded-2xl object-cover border border-[#e0e3e5] shadow-xs"
                        />
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs font-semibold text-[#72787f] font-['Be_Vietnam_Pro'] uppercase">
                              Protocolo #{sol.id.slice(-6)}
                            </span>
                          </div>
                          <h3 className="font-['Plus_Jakarta_Sans'] text-2xl font-bold text-[#074469]">
                            Adoção de {sol.petName}
                          </h3>
                          <p className="font-['Be_Vietnam_Pro'] text-xs sm:text-sm text-[#41474e]">
                            Solicitante: <strong>{sol.requesterName}</strong> • Realizada em:{' '}
                            {sol.createdAt ? new Date(sol.createdAt).toLocaleDateString('pt-BR') : '15/08/2026'}
                          </p>
                        </div>
                      </div>

                      {/* Status Visual Claro */}
                      <div>
                        {isGranted && (
                          <div className="bg-[#126b57] text-white px-5 py-2.5 rounded-2xl flex items-center gap-2 shadow-xs">
                            <span className="material-symbols-outlined text-2xl">verified</span>
                            <div>
                              <p className="text-[10px] uppercase font-bold tracking-wider text-[#a0efd6]">
                                Confirmação
                              </p>
                              <p className="font-['Plus_Jakarta_Sans'] text-sm font-bold">
                                Adoção Concedida! 🎉
                              </p>
                            </div>
                          </div>
                        )}
                        {isPending && (
                          <div className="bg-[#cde5ff] text-[#003355] px-5 py-2.5 rounded-2xl flex items-center gap-2">
                            <span className="material-symbols-outlined text-2xl">pending_actions</span>
                            <div>
                              <p className="text-[10px] uppercase font-bold tracking-wider text-[#003355]/70">
                                Em Análise
                              </p>
                              <p className="font-['Plus_Jakarta_Sans'] text-sm font-bold">
                                Solicitação em Processamento
                              </p>
                            </div>
                          </div>
                        )}
                        {isDenied && (
                          <div className="bg-[#ffdad6] text-[#ba1a1a] px-5 py-2.5 rounded-2xl flex items-center gap-2">
                            <span className="material-symbols-outlined text-2xl">cancel</span>
                            <div>
                              <p className="text-[10px] uppercase font-bold tracking-wider text-[#ba1a1a]/70">
                                Resultado
                              </p>
                              <p className="font-['Plus_Jakarta_Sans'] text-sm font-bold">
                                Adoção Não Concedida
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Banner de Celebração se Concedida */}
                    {isGranted && (
                      <div className="mt-6 bg-[#a0efd6]/40 border border-[#126b57]/20 p-4 rounded-2xl flex items-center gap-3">
                        <span className="material-symbols-outlined text-[#126b57] text-2xl">task_alt</span>
                        <p className="font-['Be_Vietnam_Pro'] text-xs sm:text-sm text-[#005141] font-medium leading-relaxed">
                          <strong>Parabéns! Sua adoção foi autorizada pela ONG.</strong> Utilize os dados de contato abaixo para agendar a retirada do seu novo companheiro e assinar o termo de responsabilidade.
                        </p>
                      </div>
                    )}

                    {/* BOX OBRIGATÓRIO: Dados de Contato da ONG Responsável */}
                    <div className="mt-6 bg-[#f7f9fb] p-6 rounded-2xl border border-[#e0e3e5]">
                      <div className="flex items-center gap-2 mb-4">
                        <span className="material-symbols-outlined text-[#074469] text-xl">contact_phone</span>
                        <h4 className="font-['Plus_Jakarta_Sans'] text-base font-bold text-[#074469]">
                          Dados de Contato da ONG Responsável
                        </h4>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 font-['Be_Vietnam_Pro'] text-sm">
                        <div className="bg-white p-4 rounded-xl border border-[#e0e3e5]">
                          <span className="text-xs text-[#72787f] block mb-1">Instituição / ONG:</span>
                          <strong className="text-[#074469] text-base block">
                            {sol.ongName || 'Instituto Patinhas de Ouro'}
                          </strong>
                          <span className="text-xs text-[#41474e]">
                            {sol.ongAddress || 'Rua Vergueiro, 2500 - São Paulo, SP'}
                          </span>
                        </div>

                        <div className="bg-white p-4 rounded-xl border border-[#e0e3e5] flex flex-col justify-between">
                          <div>
                            <span className="text-xs text-[#72787f] block mb-1">Telefone & WhatsApp:</span>
                            <strong className="text-[#191c1e] text-base block">
                              {sol.ongPhone || '(11) 97123-9988'}
                            </strong>
                          </div>
                          <a
                            href={`https://wa.me/55${(sol.ongPhone || '11971239988').replace(/\D/g, '')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-2 inline-flex items-center justify-center gap-1.5 bg-[#126b57] hover:bg-[#005141] text-white text-xs font-semibold py-2 px-3 rounded-lg transition-colors"
                          >
                            <span className="material-symbols-outlined text-sm">chat</span>
                            Falar no WhatsApp
                          </a>
                        </div>

                        <div className="bg-white p-4 rounded-xl border border-[#e0e3e5] flex flex-col justify-between">
                          <div>
                            <span className="text-xs text-[#72787f] block mb-1">E-mail Oficial:</span>
                            <span className="text-[#191c1e] font-semibold text-sm break-all block">
                              {sol.ongEmail || 'adotar@patinhasdeouro.org.br'}
                            </span>
                          </div>
                          <a
                            href={`mailto:${sol.ongEmail || 'adotar@patinhasdeouro.org.br'}?subject=Adoção de ${sol.petName} - Protocolo ${sol.id}`}
                            className="mt-2 inline-flex items-center justify-center gap-1.5 bg-[#074469] hover:bg-[#2a5c82] text-white text-xs font-semibold py-2 px-3 rounded-lg transition-colors"
                          >
                            <span className="material-symbols-outlined text-sm">mail</span>
                            Enviar E-mail
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      )}

      {/* ========================================================================= */}
      {/* ABA 3: TRIAGEM INCOMPLETA */}
      {/* ========================================================================= */}
      {activeTab === 'triagem-incompleta' && (
        <section className="space-y-6 animate-in fade-in duration-300">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="bg-[#ffdbc9] text-[#6d2f00] text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full">
                  Triagem e Acolhimento
                </span>
              </div>
              <h2 className="font-['Plus_Jakarta_Sans'] text-2xl font-bold text-[#074469]">
                Processos de Triagem e Impossibilidade de Adoção
              </h2>
              <p className="font-['Be_Vietnam_Pro'] text-xs sm:text-sm text-[#72787f]">
                Acompanhe as solicitações de triagem para animais que você descobriu que não pode adotar ou acolher.
              </p>
            </div>

            <button
              onClick={onOpenNewFoster}
              className="bg-[#126b57] hover:bg-[#005141] text-white font-['Be_Vietnam_Pro'] text-xs sm:text-sm font-semibold px-5 py-2.5 rounded-xl transition-all shadow-xs flex items-center gap-1.5 cursor-pointer shrink-0"
            >
              <span className="material-symbols-outlined text-base">add_circle</span>
              <span>Iniciar Nova Triagem</span>
            </button>
          </div>

          {userFosterRequests.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-[#e0e3e5] shadow-xs">
              <div className="w-16 h-16 bg-[#ffdbc9] text-[#6d2f00] rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="material-symbols-outlined text-3xl">clinical_notes</span>
              </div>
              <h3 className="font-['Plus_Jakarta_Sans'] text-xl font-bold text-[#074469] mb-2">
                Nenhuma triagem ativa no momento
              </h3>
              <p className="font-['Be_Vietnam_Pro'] text-sm text-[#41474e] max-w-md mx-auto mb-6">
                Caso você tenha resgatado um animal ou descoberto que não pode prosseguir com uma adoção, você pode cadastrar um pedido de acolhimento e triagem com as ONGs parceiras.
              </p>
              <button
                onClick={onOpenNewFoster}
                className="bg-[#074469] text-white font-['Be_Vietnam_Pro'] font-bold text-sm px-6 py-3 rounded-xl hover:bg-[#2a5c82] transition-colors"
              >
                Solicitar Triagem de Animal
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6">
              {userFosterRequests.map((foster) => {
                const isAccepted = foster.status === 'accepted';
                const isPending = foster.status === 'pending';
                const isDeclined = foster.status === 'declined';

                return (
                  <div
                    key={foster.id}
                    className={`bg-white rounded-3xl p-6 sm:p-8 shadow-xs border transition-all ${
                      isAccepted ? 'border-[#126b57]/40 ring-1 ring-[#126b57]/20' : 'border-[#e0e3e5]'
                    }`}
                  >
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 pb-6 border-b border-[#e0e3e5]">
                      <div className="flex items-start gap-4">
                        <img
                          src={
                            foster.photoUrl ||
                            'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=600&q=80'
                          }
                          alt={foster.petName}
                          className="w-20 h-20 rounded-2xl object-cover border border-[#e0e3e5] shadow-xs shrink-0"
                        />
                        <div>
                          <span className="text-xs text-[#72787f] font-semibold font-['Be_Vietnam_Pro'] uppercase">
                            Triagem #{foster.id.slice(-6)} • {foster.timestamp}
                          </span>
                          <h3 className="font-['Plus_Jakarta_Sans'] text-2xl font-bold text-[#074469]">
                            {foster.petName || 'Animal em Avaliação'} ({foster.species})
                          </h3>
                          <p className="font-['Be_Vietnam_Pro'] text-xs sm:text-sm text-[#41474e] mt-1">
                            Tutor solicitante: <strong>{foster.requesterName || currentUser?.name || 'Cliente'}</strong>
                          </p>
                        </div>
                      </div>

                      {/* Status de Aceite pela ONG */}
                      <div>
                        {isAccepted ? (
                          <div className="bg-[#a0efd6] text-[#126b57] px-4 py-2 rounded-2xl flex items-center gap-2 shadow-2xs">
                            <span className="material-symbols-outlined text-xl">verified_user</span>
                            <div>
                              <p className="text-[10px] font-bold uppercase tracking-wider text-[#005141]">
                                Status da Triagem
                              </p>
                              <p className="font-['Plus_Jakarta_Sans'] text-sm font-bold">
                                Aceito por ONG Parceira ✓
                              </p>
                            </div>
                          </div>
                        ) : isPending ? (
                          <div className="bg-[#ffdbc9] text-[#6d2f00] px-4 py-2 rounded-2xl flex items-center gap-2">
                            <span className="material-symbols-outlined text-xl">hourglass_empty</span>
                            <div>
                              <p className="text-[10px] font-bold uppercase tracking-wider text-[#6d2f00]/80">
                                Em Análise
                              </p>
                              <p className="font-['Plus_Jakarta_Sans'] text-sm font-bold">
                                Aguardando ONG Voluntária
                              </p>
                            </div>
                          </div>
                        ) : (
                          <div className="bg-[#ffdad6] text-[#ba1a1a] px-4 py-2 rounded-2xl flex items-center gap-2">
                            <span className="material-symbols-outlined text-xl">do_not_disturb_on</span>
                            <div>
                              <p className="text-[10px] font-bold uppercase tracking-wider text-[#ba1a1a]/80">
                                Encerrado
                              </p>
                              <p className="font-['Plus_Jakarta_Sans'] text-sm font-bold">
                                Triagem Recusada
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Motivo informado */}
                    <div className="mt-4">
                      <span className="text-xs font-bold text-[#72787f] uppercase font-['Be_Vietnam_Pro']">
                        Motivo / Histórico da Triagem:
                      </span>
                      <p className="mt-1 bg-[#f7f9fb] p-4 rounded-xl text-sm font-['Be_Vietnam_Pro'] text-[#191c1e] border border-[#e0e3e5] leading-relaxed">
                        {foster.reason}
                      </p>
                    </div>

                    {/* Se aceito por uma ONG, exibir os dados de contato dela */}
                    {isAccepted ? (
                      <div className="mt-6 bg-[#a0efd6]/30 p-6 rounded-2xl border border-[#126b57]/20">
                        <div className="flex items-center gap-2 mb-3">
                          <span className="material-symbols-outlined text-[#126b57] text-xl">handshake</span>
                          <h4 className="font-['Plus_Jakarta_Sans'] text-base font-bold text-[#074469]">
                            A ONG {foster.acceptedByOngName || 'Amigos de Patas'} aceitou o acolhimento!
                          </h4>
                        </div>
                        <p className="font-['Be_Vietnam_Pro'] text-xs sm:text-sm text-[#41474e] mb-4">
                          Entre em contato diretamente com a instituição acolhedora para combinar a entrega segura do animal:
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-['Be_Vietnam_Pro'] text-sm">
                          <div className="bg-white p-3.5 rounded-xl border border-[#e0e3e5]">
                            <span className="text-xs text-[#72787f] block">Telefone / WhatsApp:</span>
                            <strong className="text-[#074469] text-base block mt-0.5">
                              {foster.acceptedByOngPhone || '(11) 98765-4321'}
                            </strong>
                          </div>

                          <div className="bg-white p-3.5 rounded-xl border border-[#e0e3e5]">
                            <span className="text-xs text-[#72787f] block">Endereço de Acolhimento:</span>
                            <strong className="text-[#191c1e] text-sm block mt-0.5">
                              {foster.acceptedByOngAddress || 'Av. Paulista, 1200 - São Paulo, SP'}
                            </strong>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="mt-4 bg-[#f2f4f6] p-4 rounded-xl text-xs font-['Be_Vietnam_Pro'] text-[#72787f] flex items-center gap-2">
                        <span className="material-symbols-outlined text-base text-[#074469]">info</span>
                        <span>
                          Sua solicitação de triagem está visível no painel das ONGs credenciadas. Assim que uma entidade aceitar o acolhimento, os dados de contato serão exibidos aqui.
                        </span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </section>
      )}
    </main>
  );
};
