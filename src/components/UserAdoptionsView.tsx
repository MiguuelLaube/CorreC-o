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
}

export const UserAdoptionsView: React.FC<UserAdoptionsViewProps> = ({
  currentUser,
  solicitations,
  fosterRequests,
  pets,
  onSelectPet,
  onOpenNewFoster,
  onOpenAdoptionGallery
}) => {
  const [subTab, setSubTab] = useState<'todos' | 'interesses' | 'solicitacoes' | 'triagens'>('todos');

  const userEmail = currentUser.email.toLowerCase();

  // Filtragem dos processos do adotante logado
  const userInterests = solicitations.filter(
    (s) => s.type === 'Visita' || (s.requesterEmail && s.requesterEmail.toLowerCase() === userEmail)
  );

  const userAdoptions = solicitations.filter(
    (s) => s.type === 'Adoção' || s.adoptionGranted !== undefined
  );

  const userFosters = fosterRequests.filter(
    (f) => !f.requesterEmail || f.requesterEmail.toLowerCase() === userEmail
  );

  const totalCount = userInterests.length + userAdoptions.length + userFosters.length;

  return (
    <main className="flex-grow pt-8 pb-20 px-4 md:px-16 max-w-7xl mx-auto w-full">
      {/* Header Unificado do Portal do Adotante */}
      <header className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#e0e3e5]">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="bg-[#074469] text-[#a0efd6] text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full">
                Portal do Adotante MatchPet
              </span>
              <span className="text-xs text-[#72787f]">Seus Processos de Adoção</span>
            </div>
            <h1 className="font-['Plus_Jakarta_Sans'] text-3xl md:text-4xl font-bold text-[#074469]">
              Olá, {currentUser.name}!
            </h1>
            <p className="font-['Be_Vietnam_Pro'] text-sm md:text-base text-[#41474e] mt-1">
              Centralize e acompanhe todos os seus interesses, solicitações formais e triagens em um só lugar.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onOpenAdoptionGallery}
              className="bg-[#074469] hover:bg-[#2a5c82] text-white font-['Be_Vietnam_Pro'] text-xs sm:text-sm font-semibold px-5 py-2.5 rounded-xl transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              <span className="material-symbols-outlined text-base">search</span>
              <span>Encontrar Mais Pets</span>
            </button>
          </div>
        </div>

        {/* Sub-Navegação Integrada */}
        <div className="flex overflow-x-auto gap-2 mt-6 p-1.5 bg-[#eceef0] rounded-2xl border border-[#c1c7cf]/40 font-['Be_Vietnam_Pro'] text-xs sm:text-sm font-semibold">
          <button
            onClick={() => setSubTab('todos')}
            className={`flex-1 min-w-[140px] py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer ${
              subTab === 'todos' ? 'bg-[#074469] text-white shadow-xs' : 'text-[#41474e] hover:bg-white/60'
            }`}
          >
            <span>Visão Geral</span>
            <span className={`text-[11px] px-2 py-0.2 rounded-full font-bold ${subTab === 'todos' ? 'bg-[#a0efd6] text-[#074469]' : 'bg-[#e0e3e5]'}`}>
              {totalCount}
            </span>
          </button>

          <button
            onClick={() => setSubTab('interesses')}
            className={`flex-1 min-w-[150px] py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer ${
              subTab === 'interesses' ? 'bg-[#074469] text-white shadow-xs' : 'text-[#41474e] hover:bg-white/60'
            }`}
          >
            <span className="material-symbols-outlined text-base">favorite</span>
            <span>Interesses ({userInterests.length})</span>
          </button>

          <button
            onClick={() => setSubTab('solicitacoes')}
            className={`flex-1 min-w-[160px] py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer ${
              subTab === 'solicitacoes' ? 'bg-[#074469] text-white shadow-xs' : 'text-[#41474e] hover:bg-white/60'
            }`}
          >
            <span className="material-symbols-outlined text-base">assignment_turned_in</span>
            <span>Solicitações ({userAdoptions.length})</span>
          </button>

          <button
            onClick={() => setSubTab('triagens')}
            className={`flex-1 min-w-[150px] py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer ${
              subTab === 'triagens' ? 'bg-[#074469] text-white shadow-xs' : 'text-[#41474e] hover:bg-white/60'
            }`}
          >
            <span className="material-symbols-outlined text-base">clinical_notes</span>
            <span>Triagens ({userFosters.length})</span>
          </button>
        </div>
      </header>

      {/* Conteúdo Dinâmico Centralizado */}
      <div className="space-y-10">
        {/* SEÇÃO 1: INTERESSES & VISITAS */}
        {(subTab === 'todos' || subTab === 'interesses') && (
          <section className="space-y-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#074469] text-2xl">favorite</span>
                <h2 className="font-['Plus_Jakarta_Sans'] text-2xl font-bold text-[#074469]">
                  Interesses em Animais
                </h2>
              </div>
              <span className="text-xs text-[#72787f] font-semibold">{userInterests.length} registros</span>
            </div>

            {userInterests.length === 0 ? (
              <div className="bg-white rounded-3xl p-8 text-center border border-[#e0e3e5]">
                <p className="text-sm font-['Be_Vietnam_Pro'] text-[#72787f] mb-3">
                  Você ainda não manifestou interesse em nenhum pet.
                </p>
                <button
                  onClick={onOpenAdoptionGallery}
                  className="bg-[#074469] text-white font-bold text-xs px-4 py-2 rounded-xl"
                >
                  Explorar Animais Disponíveis
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {userInterests.map((item) => {
                  const pet = pets.find((p) => p.id === item.petId || p.name === item.petName);
                  const petImage =
                    item.petImage ||
                    pet?.mainImage ||
                    'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=600&q=80';

                  const isApproved = item.status === 'approved';
                  const isRejected = item.status === 'rejected';
                  const isInReview = item.status === 'in_review';
                  const isPending = !isApproved && !isRejected && !isInReview;

                  return (
                    <div
                      key={item.id}
                      className="bg-white rounded-2xl p-6 shadow-xs border border-[#e0e3e5] flex flex-col justify-between hover:border-[#074469]/40 transition-all"
                    >
                      <div>
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={petImage}
                              alt={item.petName}
                              className="w-16 h-16 rounded-xl object-cover border border-[#e0e3e5] shadow-xs"
                            />
                            <div>
                              <span className="text-[11px] font-['Be_Vietnam_Pro'] text-[#72787f] uppercase font-semibold">
                                Interesse / Visita
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

                          <div>
                            {isApproved && (
                              <span className="bg-[#a0efd6] text-[#126b57] font-['Be_Vietnam_Pro'] text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
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

                        <div className="bg-[#f7f9fb] p-4 rounded-xl border border-[#e0e3e5] space-y-2 font-['Be_Vietnam_Pro'] text-xs sm:text-sm text-[#41474e] mb-4">
                          <div className="flex justify-between">
                            <span className="text-[#72787f]">Data do Interesse:</span>
                            <strong>
                              {item.createdAt ? new Date(item.createdAt).toLocaleDateString('pt-BR') : '18/08/2026'}
                            </strong>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-[#72787f]">ONG Responsável:</span>
                            <strong className="text-[#074469]">{item.ongName || 'ONG Parceira'}</strong>
                          </div>
                        </div>
                      </div>

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
                              `Contato da ${item.ongName || 'ONG'}: ${
                                item.ongPhone || '(11) 98765-4321'
                              } • E-mail: ${item.ongEmail || 'contato@matchpet.ong.br'}`
                            )
                          }
                          className="flex-1 bg-[#074469] hover:bg-[#2a5c82] text-white font-['Be_Vietnam_Pro'] text-xs font-semibold py-2.5 rounded-xl transition-colors text-center cursor-pointer"
                        >
                          Falar com a ONG
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        )}

        {/* SEÇÃO 2: SOLICITAÇÕES DE ADOÇÃO */}
        {(subTab === 'todos' || subTab === 'solicitacoes') && (
          <section className="space-y-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#074469] text-2xl">assignment_turned_in</span>
                <h2 className="font-['Plus_Jakarta_Sans'] text-2xl font-bold text-[#074469]">
                  Solicitações Formais de Adoção
                </h2>
              </div>
              <span className="text-xs text-[#72787f] font-semibold">{userAdoptions.length} solicitações</span>
            </div>

            {userAdoptions.length === 0 ? (
              <div className="bg-white rounded-3xl p-8 text-center border border-[#e0e3e5]">
                <p className="text-sm font-['Be_Vietnam_Pro'] text-[#72787f]">
                  Nenhuma solicitação formal de adoção registrada no momento.
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {userAdoptions.map((sol) => {
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
                      className={`rounded-3xl p-6 sm:p-8 shadow-xs border transition-all ${
                        isGranted ? 'bg-white border-[#126b57]/40 ring-1 ring-[#126b57]/30' : 'bg-white border-[#e0e3e5]'
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#e0e3e5]">
                        <div className="flex items-center gap-4">
                          <img
                            src={petImage}
                            alt={sol.petName}
                            className="w-18 h-18 rounded-2xl object-cover border border-[#e0e3e5] shadow-xs"
                          />
                          <div>
                            <span className="text-xs font-semibold text-[#72787f] uppercase font-['Be_Vietnam_Pro']">
                              Protocolo #{String(sol.id || '000000').slice(-6)}
                            </span>
                            <h3 className="font-['Plus_Jakarta_Sans'] text-2xl font-bold text-[#074469]">
                              Adoção de {sol.petName}
                            </h3>
                            <p className="font-['Be_Vietnam_Pro'] text-xs sm:text-sm text-[#41474e]">
                              ONG Responsável: <strong>{sol.ongName || 'Amigos de Patas'}</strong>
                            </p>
                          </div>
                        </div>

                        <div>
                          {isGranted && (
                            <div className="bg-[#126b57] text-white px-5 py-2.5 rounded-2xl flex items-center gap-2 shadow-xs">
                              <span className="material-symbols-outlined text-2xl">verified</span>
                              <div>
                                <p className="text-[10px] uppercase font-bold tracking-wider text-[#a0efd6]">Status</p>
                                <p className="font-['Plus_Jakarta_Sans'] text-sm font-bold">Adoção Concedida! 🎉</p>
                              </div>
                            </div>
                          )}
                          {isPending && (
                            <div className="bg-[#cde5ff] text-[#003355] px-5 py-2.5 rounded-2xl flex items-center gap-2">
                              <span className="material-symbols-outlined text-2xl">pending_actions</span>
                              <div>
                                <p className="text-[10px] uppercase font-bold tracking-wider text-[#003355]/70">Em Análise</p>
                                <p className="font-['Plus_Jakarta_Sans'] text-sm font-bold">Aguardando Aprovação da ONG</p>
                              </div>
                            </div>
                          )}
                          {isDenied && (
                            <div className="bg-[#ffdad6] text-[#ba1a1a] px-5 py-2.5 rounded-2xl flex items-center gap-2">
                              <span className="material-symbols-outlined text-2xl">cancel</span>
                              <div>
                                <p className="text-[10px] uppercase font-bold tracking-wider text-[#ba1a1a]/70">Resultado</p>
                                <p className="font-['Plus_Jakarta_Sans'] text-sm font-bold">Não Concedida</p>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Box de Contato da ONG Responsável */}
                      <div className="mt-6 bg-[#f7f9fb] p-6 rounded-2xl border border-[#e0e3e5]">
                        <h4 className="font-['Plus_Jakarta_Sans'] text-sm font-bold text-[#074469] mb-3 flex items-center gap-2">
                          <span className="material-symbols-outlined text-base">contact_phone</span>
                          <span>Contato Direto com a ONG</span>
                        </h4>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 font-['Be_Vietnam_Pro'] text-sm">
                          <div className="bg-white p-3.5 rounded-xl border border-[#e0e3e5]">
                            <span className="text-xs text-[#72787f] block">Instituição:</span>
                            <strong className="text-[#074469]">{sol.ongName || 'Amigos de Patas'}</strong>
                            <p className="text-xs text-[#41474e] mt-0.5">{sol.ongAddress || 'São Paulo - SP'}</p>
                          </div>

                          <div className="bg-white p-3.5 rounded-xl border border-[#e0e3e5] flex flex-col justify-between">
                            <div>
                              <span className="text-xs text-[#72787f] block">WhatsApp / Telefone:</span>
                              <strong className="text-[#191c1e]">{sol.ongPhone || '(11) 98765-4321'}</strong>
                            </div>
                            <a
                              href={`https://wa.me/55${(sol.ongPhone || '11987654321').replace(/\D/g, '')}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="mt-2 inline-flex items-center justify-center gap-1 bg-[#126b57] text-white text-xs font-semibold py-1.5 rounded-lg"
                            >
                              Abrir WhatsApp
                            </a>
                          </div>

                          <div className="bg-white p-3.5 rounded-xl border border-[#e0e3e5] flex flex-col justify-between">
                            <div>
                              <span className="text-xs text-[#72787f] block">E-mail:</span>
                              <span className="text-xs font-semibold text-[#191c1e] break-all">{sol.ongEmail || 'contato@matchpet.ong.br'}</span>
                            </div>
                            <a
                              href={`mailto:${sol.ongEmail || 'contato@matchpet.ong.br'}`}
                              className="mt-2 inline-flex items-center justify-center gap-1 bg-[#074469] text-white text-xs font-semibold py-1.5 rounded-lg"
                            >
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

        {/* SEÇÃO 3: TRIAGENS & ACOLHIMENTO */}
        {(subTab === 'todos' || subTab === 'triagens') && (
          <section className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#074469] text-2xl">clinical_notes</span>
                <h2 className="font-['Plus_Jakarta_Sans'] text-2xl font-bold text-[#074469]">
                  Processos de Triagem & Acolhimento
                </h2>
              </div>

              <button
                onClick={onOpenNewFoster}
                className="bg-[#126b57] hover:bg-[#005141] text-white font-['Be_Vietnam_Pro'] text-xs font-semibold px-4 py-2.5 rounded-xl transition-all shadow-xs flex items-center gap-1 cursor-pointer shrink-0"
              >
                <span className="material-symbols-outlined text-base">add_circle</span>
                <span>Nova Solicitação de Triagem</span>
              </button>
            </div>

            {userFosters.length === 0 ? (
              <div className="bg-white rounded-3xl p-8 text-center border border-[#e0e3e5]">
                <p className="text-sm font-['Be_Vietnam_Pro'] text-[#72787f] mb-3">
                  Nenhuma triagem ativa no momento.
                </p>
                <button
                  onClick={onOpenNewFoster}
                  className="bg-[#074469] text-white font-bold text-xs px-4 py-2 rounded-xl"
                >
                  Solicitar Acolhimento de Animal
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6">
                {userFosters.map((foster) => {
                  const isAccepted = foster.status === 'accepted';

                  return (
                    <div
                      key={foster.id}
                      className={`bg-white rounded-3xl p-6 shadow-xs border transition-all ${
                        isAccepted ? 'border-[#126b57]/40 ring-1 ring-[#126b57]/20' : 'border-[#e0e3e5]'
                      }`}
                    >
                      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 pb-4 border-b border-[#e0e3e5]">
                        <div>
                          <span className="text-xs text-[#72787f] font-semibold uppercase font-['Be_Vietnam_Pro']">
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
                              Aceito por ONG Parceira ✓
                            </span>
                          ) : (
                            <span className="bg-[#ffdbc9] text-[#6d2f00] px-4 py-1.5 rounded-full text-xs font-bold inline-flex items-center gap-1">
                              <span className="material-symbols-outlined text-base">hourglass_empty</span>
                              Em Análise pelas ONGs
                            </span>
                          )}
                        </div>
                      </div>

                      <p className="mt-3 bg-[#f7f9fb] p-4 rounded-xl text-sm font-['Be_Vietnam_Pro'] text-[#191c1e] border border-[#e0e3e5]">
                        <strong>Motivo informado:</strong> {foster.reason}
                      </p>

                      {isAccepted && (
                        <div className="mt-4 bg-[#a0efd6]/30 p-4 rounded-xl border border-[#126b57]/20">
                          <p className="text-xs font-bold text-[#074469] mb-1 font-['Be_Vietnam_Pro']">
                            Acolhimento aceito pela instituição: {foster.acceptedByOngName || 'Amigos de Patas'}
                          </p>
                          <p className="text-xs text-[#41474e] font-['Be_Vietnam_Pro']">
                            Telefone: {foster.acceptedByOngPhone || '(11) 98765-4321'} • Endereço: {foster.acceptedByOngAddress || 'São Paulo - SP'}
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
      </div>
    </main>
  );
};
