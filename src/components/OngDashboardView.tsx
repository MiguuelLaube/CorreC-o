import React, { useState } from 'react';
import { Pet, Solicitation, FosterRequest } from '../types';

interface OngDashboardViewProps {
  pets: Pet[];
  solicitations: Solicitation[];
  fosterRequests: FosterRequest[];
  onAddPet: (newPet: Partial<Pet>) => void;
  onDeletePet: (petId: string) => void;
  onUpdatePetStatus: (petId: string, status: 'Disponível' | 'Em Processo' | 'Adotado') => void;
  onApproveSolicitation: (id: string) => void;
  onRejectSolicitation: (id: string) => void;
  onAcceptFoster: (id: string) => void;
  onOpenFosterDetails: (foster: FosterRequest) => void;
  onOpenSolicitationProfile: (sol: Solicitation) => void;
}

export const OngDashboardView: React.FC<OngDashboardViewProps> = ({
  pets,
  solicitations,
  fosterRequests,
  onAddPet,
  onDeletePet,
  onUpdatePetStatus,
  onApproveSolicitation,
  onRejectSolicitation,
  onAcceptFoster,
  onOpenFosterDetails,
  onOpenSolicitationProfile
}) => {
  const [showAddForm, setShowAddForm] = useState<boolean>(false);
  const [newPetName, setNewPetName] = useState('');
  const [newPetSpecies, setNewPetSpecies] = useState<'Cachorro' | 'Gato' | 'Outro'>('Cachorro');
  const [newPetSize, setNewPetSize] = useState<'Pequeno' | 'Médio' | 'Grande'>('Médio');
  const [newPetGender, setNewPetGender] = useState<'Macho' | 'Fêmea'>('Macho');
  const [newPetAge, setNewPetAge] = useState('');
  const [newPetVaccination, setNewPetVaccination] = useState('');
  const [newPetNotes, setNewPetNotes] = useState('');
  const [newPetImageUrl, setNewPetImageUrl] = useState('');

  const [filterTable, setFilterTable] = useState<'all' | 'Disponível' | 'Em Processo'>('all');

  const handleSavePet = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPetName.trim()) return;

    onAddPet({
      name: newPetName,
      species: newPetSpecies,
      size: newPetSize,
      gender: newPetGender,
      age: newPetAge || 'Idade não informada',
      vaccination: newPetVaccination || 'Pendente',
      breed: `${newPetSpecies} SRD`,
      city: 'São Paulo',
      state: 'SP',
      color: 'Variada',
      castrated: true,
      temperament: ['Dócil', 'Sociável'],
      story: [newPetNotes || 'Pet resgatado com carinho aguardando um tutor responsável.'],
      mainImage:
        newPetImageUrl ||
        (newPetSpecies === 'Gato'
          ? 'https://lh3.googleusercontent.com/aida-public/AB6AXuDScg8E1wLKoOxssMEgdBxsRf7VmSnckynqN8o93xST5dsliCxCeSpCtKsSHKA61no0VwRgPA-bQsSN8Go5oie71zrSFGhK5XcqoPPLpX_3l3qcW_E1-16oyaAoPrTgNeah6UgEG139u3PORPfqNLAUdiTUAbPwNth-CUHNun2XW6RfDHfPcCHVFwXy0Y3Viu4Y-B7Tfv8skkdwqzseIkyg9JkzeplglMQUooQUNtgCkZYP_AMU0swASQ'
          : 'https://lh3.googleusercontent.com/aida-public/AB6AXuBABlLXFsIBLAS-PY3pbFcuknt6Zsdsry4Sa2KPOz0Pd1R4ywe-Gw3K5eDps15ZlH0usF6ejtIp_8PkW9FpkLTAu_X4HmS7kak08cFgWzFS3pvv9CI537XwuqGiizLsnzTQoUlTjQA5gBFi5bYWXD4yhRERx2SmsHiLVYQ8EziM9fG54IqTXzoMDgEA8dfNV63rr2WxXvyn8DkuG4Obm3T-TmE4tuQu1mfNidMAA7Y8TMKRkSeI2ngZHQ'),
      entryDate: new Date().toLocaleDateString('pt-BR'),
      status: 'Disponível',
      ongId: 'amigos-de-patas',
      ongName: 'ONG Amigo Fiel'
    });

    // Reset form
    setNewPetName('');
    setNewPetAge('');
    setNewPetVaccination('');
    setNewPetNotes('');
    setNewPetImageUrl('');
    setShowAddForm(false);
  };

  const displayedPets = pets.filter((p) => {
    if (filterTable === 'all') return true;
    return p.status === filterTable;
  });

  return (
    <main className="flex-grow pt-8 pb-20 px-4 md:px-16 max-w-7xl mx-auto w-full">
      {/* Header */}
      <header className="mb-8">
        <h1 className="font-['Plus_Jakarta_Sans'] text-3xl md:text-5xl font-bold text-[#074469] mb-2">
          Painel de Gestão
        </h1>
        <p className="font-['Be_Vietnam_Pro'] text-base md:text-lg text-[#41474e]">
          Visão geral e controle das operações da sua ONG.
        </p>
      </header>

      {/* Bento Grid: Stats & Quick Action */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {/* Stat Card 1 */}
        <div className="bg-white rounded-2xl p-6 shadow-xs border border-[#e0e3e5] flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <span className="material-symbols-outlined text-[#074469] text-3xl">pets</span>
            <span className="bg-[#a0efd6] text-[#196f5b] font-['Be_Vietnam_Pro'] text-xs font-semibold px-2.5 py-1 rounded-full">
              +5 esta semana
            </span>
          </div>
          <div>
            <h3 className="font-['Be_Vietnam_Pro'] text-sm text-[#41474e] mb-1">Total de Pets</h3>
            <p className="font-['Plus_Jakarta_Sans'] text-3xl md:text-4xl font-bold text-[#074469]">
              {140 + pets.length}
            </p>
          </div>
        </div>

        {/* Stat Card 2 */}
        <div className="bg-white rounded-2xl p-6 shadow-xs border border-[#e0e3e5] flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <span className="material-symbols-outlined text-[#126b57] text-3xl">volunteer_activism</span>
            <span className="bg-[#ffdbc9] text-[#331200] font-['Be_Vietnam_Pro'] text-xs font-semibold px-2.5 py-1 rounded-full">
              3 finalizadas
            </span>
          </div>
          <div>
            <h3 className="font-['Be_Vietnam_Pro'] text-sm text-[#41474e] mb-1">Adoções em Curso</h3>
            <p className="font-['Plus_Jakarta_Sans'] text-3xl md:text-4xl font-bold text-[#074469]">
              18
            </p>
          </div>
        </div>

        {/* Stat Card 3 */}
        <div className="bg-white rounded-2xl p-6 shadow-xs border border-[#e0e3e5] flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <span className="material-symbols-outlined text-[#914100] text-3xl">mail</span>
            <span className="bg-[#ffdad6] text-[#93000a] font-['Be_Vietnam_Pro'] text-xs font-bold px-2.5 py-1 rounded-full animate-pulse">
              Novas!
            </span>
          </div>
          <div>
            <h3 className="font-['Be_Vietnam_Pro'] text-sm text-[#41474e] mb-1">Solicitações Pendentes</h3>
            <p className="font-['Plus_Jakarta_Sans'] text-3xl md:text-4xl font-bold text-[#074469]">
              {solicitations.filter((s) => s.status === 'pending').length + 22}
            </p>
          </div>
        </div>

        {/* Action Card Button (Compact) */}
        {!showAddForm && (
          <div
            onClick={() => setShowAddForm(true)}
            className="bg-[#2a5c82] hover:bg-[#074469] rounded-2xl p-6 shadow-xs flex flex-col justify-center items-center text-center cursor-pointer transition-all group border border-[#074469]"
          >
            <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-white text-3xl">add_circle</span>
            </div>
            <h3 className="font-['Plus_Jakarta_Sans'] text-xl font-bold text-white">
              Cadastrar Novo Pet
            </h3>
            <p className="font-['Be_Vietnam_Pro'] text-xs text-[#a5d4ff] mt-1">
              Clique para abrir o formulário
            </p>
          </div>
        )}
      </div>

      {/* Expanded Add Pet Form Card */}
      {showAddForm && (
        <section className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-[#2a5c82] mb-12 animate-in fade-in slide-in-from-top duration-300">
          <div className="flex justify-between items-center mb-2">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#074469] text-2xl">add_circle</span>
              <h2 className="font-['Plus_Jakarta_Sans'] text-2xl font-bold text-[#074469]">
                Cadastrar Novo Pet
              </h2>
            </div>
            <button
              onClick={() => setShowAddForm(false)}
              className="text-[#72787f] hover:text-[#191c1e] p-1.5 rounded-lg hover:bg-[#e0e3e5] cursor-pointer"
            >
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>

          <p className="text-xs font-['Be_Vietnam_Pro'] text-[#41474e] mb-6">
            Cadastrando como: <span className="font-bold text-[#126b57]">ONG Amigo Fiel</span>
          </p>

          <form onSubmit={handleSavePet} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label className="font-['Be_Vietnam_Pro'] text-xs font-semibold text-[#41474e]">
                Nome do Pet *
              </label>
              <input
                type="text"
                required
                value={newPetName}
                onChange={(e) => setNewPetName(e.target.value)}
                placeholder="Ex: Rex, Thor, Pipoca..."
                className="rounded-lg border border-[#c1c7cf] bg-[#f2f4f6] p-2.5 font-['Be_Vietnam_Pro'] text-sm focus:border-[#074469] focus:bg-white outline-none"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="font-['Be_Vietnam_Pro'] text-xs font-semibold text-[#41474e]">
                Espécie
              </label>
              <select
                value={newPetSpecies}
                onChange={(e) => setNewPetSpecies(e.target.value as any)}
                className="rounded-lg border border-[#c1c7cf] bg-[#f2f4f6] p-2.5 font-['Be_Vietnam_Pro'] text-sm focus:border-[#074469] focus:bg-white outline-none cursor-pointer"
              >
                <option value="Cachorro">Cão</option>
                <option value="Gato">Gato</option>
                <option value="Outro">Outro</option>
              </select>
            </div>

            <div className="flex flex-col gap-1">
              <label className="font-['Be_Vietnam_Pro'] text-xs font-semibold text-[#41474e]">
                Porte
              </label>
              <select
                value={newPetSize}
                onChange={(e) => setNewPetSize(e.target.value as any)}
                className="rounded-lg border border-[#c1c7cf] bg-[#f2f4f6] p-2.5 font-['Be_Vietnam_Pro'] text-sm focus:border-[#074469] focus:bg-white outline-none cursor-pointer"
              >
                <option value="Pequeno">Pequeno</option>
                <option value="Médio">Médio</option>
                <option value="Grande">Grande</option>
              </select>
            </div>

            <div className="flex flex-col gap-1">
              <label className="font-['Be_Vietnam_Pro'] text-xs font-semibold text-[#41474e]">
                Gênero
              </label>
              <select
                value={newPetGender}
                onChange={(e) => setNewPetGender(e.target.value as any)}
                className="rounded-lg border border-[#c1c7cf] bg-[#f2f4f6] p-2.5 font-['Be_Vietnam_Pro'] text-sm focus:border-[#074469] focus:bg-white outline-none cursor-pointer"
              >
                <option value="Macho">Macho</option>
                <option value="Fêmea">Fêmea</option>
              </select>
            </div>

            <div className="flex flex-col gap-1">
              <label className="font-['Be_Vietnam_Pro'] text-xs font-semibold text-[#41474e]">
                Idade
              </label>
              <input
                type="text"
                value={newPetAge}
                onChange={(e) => setNewPetAge(e.target.value)}
                placeholder="Ex: 2 anos, 4 meses"
                className="rounded-lg border border-[#c1c7cf] bg-[#f2f4f6] p-2.5 font-['Be_Vietnam_Pro'] text-sm focus:border-[#074469] focus:bg-white outline-none"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="font-['Be_Vietnam_Pro'] text-xs font-semibold text-[#41474e]">
                Vacinação
              </label>
              <input
                type="text"
                value={newPetVaccination}
                onChange={(e) => setNewPetVaccination(e.target.value)}
                placeholder="Ex: V10, Raiva em dia"
                className="rounded-lg border border-[#c1c7cf] bg-[#f2f4f6] p-2.5 font-['Be_Vietnam_Pro'] text-sm focus:border-[#074469] focus:bg-white outline-none"
              />
            </div>

            <div className="flex flex-col gap-1 md:col-span-2">
              <label className="font-['Be_Vietnam_Pro'] text-xs font-semibold text-[#41474e]">
                Observações / História
              </label>
              <textarea
                value={newPetNotes}
                onChange={(e) => setNewPetNotes(e.target.value)}
                placeholder="Detalhes adicionais, temperamento, histórico de resgate..."
                rows={3}
                className="rounded-lg border border-[#c1c7cf] bg-[#f2f4f6] p-2.5 font-['Be_Vietnam_Pro'] text-sm focus:border-[#074469] focus:bg-white outline-none resize-none"
              />
            </div>

            <div className="md:col-span-2 flex justify-end gap-3 mt-2">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-4 py-2 text-[#41474e] font-['Be_Vietnam_Pro'] text-sm font-semibold hover:bg-[#e0e3e5] rounded-lg cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="bg-[#074469] text-white font-['Be_Vietnam_Pro'] font-semibold text-sm px-6 py-2.5 rounded-lg hover:bg-[#2a5c82] transition-colors cursor-pointer shadow-sm"
              >
                Salvar Cadastro
              </button>
            </div>
          </form>
        </section>
      )}

      {/* Main 2-Column Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Column: Pet List & Triagem (2 cols) */}
        <div className="lg:col-span-2 space-y-10">
          {/* Section: Pets Cadastrados */}
          <section>
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-3">
                <h2 className="font-['Plus_Jakarta_Sans'] text-2xl font-bold text-[#074469]">
                  Pets Cadastrados
                </h2>
                <div className="hidden sm:flex gap-1 bg-[#eceef0] p-1 rounded-lg text-xs font-['Be_Vietnam_Pro']">
                  <button
                    onClick={() => setFilterTable('all')}
                    className={`px-2.5 py-1 rounded-md transition-colors ${
                      filterTable === 'all' ? 'bg-white font-semibold shadow-xs text-[#074469]' : 'text-[#72787f]'
                    }`}
                  >
                    Todos ({pets.length})
                  </button>
                  <button
                    onClick={() => setFilterTable('Disponível')}
                    className={`px-2.5 py-1 rounded-md transition-colors ${
                      filterTable === 'Disponível'
                        ? 'bg-white font-semibold shadow-xs text-[#126b57]'
                        : 'text-[#72787f]'
                    }`}
                  >
                    Disponíveis
                  </button>
                  <button
                    onClick={() => setFilterTable('Em Processo')}
                    className={`px-2.5 py-1 rounded-md transition-colors ${
                      filterTable === 'Em Processo'
                        ? 'bg-white font-semibold shadow-xs text-[#41474e]'
                        : 'text-[#72787f]'
                    }`}
                  >
                    Em Processo
                  </button>
                </div>
              </div>

              <button
                onClick={() => setShowAddForm(true)}
                className="font-['Be_Vietnam_Pro'] text-xs sm:text-sm font-semibold text-[#126b57] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>+ Novo Pet</span>
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </button>
            </div>

            <div className="bg-white rounded-2xl shadow-xs border border-[#e0e3e5] overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse font-['Be_Vietnam_Pro']">
                  <thead>
                    <tr className="bg-[#f2f4f6] border-b border-[#e0e3e5] text-xs font-semibold text-[#41474e] uppercase tracking-wider">
                      <th className="p-4">Pet</th>
                      <th className="p-4">Status</th>
                      <th className="p-4">Entrada</th>
                      <th className="p-4 text-right">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#e0e3e5] text-sm">
                    {displayedPets.map((pet) => (
                      <tr key={pet.id} className="hover:bg-[#f7f9fb] transition-colors">
                        <td className="p-4 flex items-center gap-3">
                          <img
                            src={pet.mainImage}
                            alt={pet.name}
                            className="w-11 h-11 rounded-full object-cover shadow-xs border border-[#e0e3e5] shrink-0"
                          />
                          <div>
                            <p className="font-['Plus_Jakarta_Sans'] font-semibold text-[#191c1e]">
                              {pet.name}
                            </p>
                            <p className="text-xs text-[#72787f]">
                              {pet.species} • {pet.ageGroup}
                            </p>
                          </div>
                        </td>

                        <td className="p-4">
                          <button
                            onClick={() =>
                              onUpdatePetStatus(
                                pet.id,
                                pet.status === 'Disponível' ? 'Em Processo' : 'Disponível'
                              )
                            }
                            title="Clique para alternar o status"
                            className={`px-3 py-1 rounded-full text-xs font-semibold cursor-pointer transition-colors ${
                              pet.status === 'Disponível'
                                ? 'bg-[#a0efd6] text-[#196f5b] hover:bg-[#87d5bd]'
                                : 'bg-[#e0e3e5] text-[#41474e] hover:bg-[#d8dadc]'
                            }`}
                          >
                            {pet.status}
                          </button>
                        </td>

                        <td className="p-4 text-[#41474e] text-xs sm:text-sm">
                          {pet.entryDate || '12/10/2023'}
                        </td>

                        <td className="p-4 text-right">
                          <div className="flex gap-2 justify-end">
                            <button
                              onClick={() => {
                                const newName = prompt('Editar nome do pet:', pet.name);
                                if (newName && newName.trim()) {
                                  pet.name = newName;
                                  onUpdatePetStatus(pet.id, pet.status);
                                }
                              }}
                              className="p-1.5 text-[#72787f] hover:text-[#074469] hover:bg-[#e0e3e5] rounded-lg transition-colors cursor-pointer"
                              title="Editar"
                            >
                              <span className="material-symbols-outlined text-lg">edit</span>
                            </button>
                            <button
                              onClick={() => {
                                if (confirm(`Deseja remover ${pet.name} do cadastro?`)) {
                                  onDeletePet(pet.id);
                                }
                              }}
                              className="p-1.5 text-[#72787f] hover:text-[#ba1a1a] hover:bg-[#ffdad6]/40 rounded-lg transition-colors cursor-pointer"
                              title="Excluir"
                            >
                              <span className="material-symbols-outlined text-lg">delete</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          {/* Section: Triagem de Acolhimento */}
          <section>
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-['Plus_Jakarta_Sans'] text-2xl font-bold text-[#074469]">
                Triagem de Acolhimento
              </h2>
              <span className="text-xs text-[#72787f] font-semibold">
                {fosterRequests.filter((f) => f.status === 'pending').length} solicitações aguardando
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {fosterRequests.map((req) => (
                <div
                  key={req.id}
                  className="bg-white rounded-2xl p-5 shadow-xs border border-[#e0e3e5] flex flex-col justify-between"
                >
                  <div>
                    <div className="flex justify-between items-start mb-3">
                      <span className="bg-[#ffdbc9] text-[#331200] px-2.5 py-0.5 rounded-full text-xs font-semibold font-['Be_Vietnam_Pro']">
                        Pedido de Doação
                      </span>
                      <span className="text-xs text-[#72787f]">{req.timestamp}</span>
                    </div>

                    <h3 className="font-['Plus_Jakarta_Sans'] text-base font-semibold text-[#191c1e] mb-1">
                      {req.petName ? `Pet: ${req.petName} (${req.species})` : 'Motivo: Mudança de país'}
                    </h3>
                    <p className="font-['Be_Vietnam_Pro'] text-sm text-[#41474e] mb-4 line-clamp-2">
                      {req.reason}
                    </p>
                  </div>

                  <div className="mt-auto flex gap-2 pt-2 border-t border-[#e0e3e5]/60">
                    <button
                      onClick={() => onOpenFosterDetails(req)}
                      className="flex-1 bg-[#eceef0] hover:bg-[#e0e3e5] text-[#191c1e] font-['Be_Vietnam_Pro'] text-xs font-semibold py-2 rounded-lg transition-colors cursor-pointer"
                    >
                      Detalhes
                    </button>
                    <button
                      onClick={() => onAcceptFoster(req.id)}
                      className={`flex-1 font-['Be_Vietnam_Pro'] text-xs font-semibold py-2 rounded-lg transition-colors cursor-pointer ${
                        req.status === 'accepted'
                          ? 'bg-[#a0efd6] text-[#196f5b]'
                          : 'bg-[#126b57] text-white hover:bg-[#005141]'
                      }`}
                    >
                      {req.status === 'accepted' ? 'Aceito ✓' : 'Aceitar'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Sidebar: Solicitações de Adoção (1 col) */}
        <div className="lg:col-span-1">
          <div className="bg-[#f2f4f6] rounded-2xl p-6 shadow-xs border border-[#e0e3e5] h-full flex flex-col">
            <h2 className="font-['Plus_Jakarta_Sans'] text-2xl font-bold text-[#074469] mb-6 flex items-center gap-2">
              <span className="material-symbols-outlined text-[#126b57]">inbox</span>
              <span>Solicitações</span>
            </h2>

            <div className="space-y-4">
              {solicitations.map((sol) => (
                <div
                  key={sol.id}
                  className="bg-white rounded-xl p-4 border border-[#e0e3e5] relative overflow-hidden shadow-xs"
                >
                  {/* Color strip accent on left */}
                  <div
                    className={`absolute top-0 left-0 w-1.5 h-full ${
                      sol.type === 'Visita' ? 'bg-[#126b57]' : 'bg-[#914100]'
                    }`}
                  />

                  <div className="ml-2">
                    <div className="flex justify-between items-center mb-1">
                      <p className="font-['Plus_Jakarta_Sans'] text-sm text-[#074469] font-bold">
                        {sol.type}: {sol.petName}
                      </p>
                      {sol.status === 'approved' && (
                        <span className="text-[11px] font-bold text-[#196f5b] bg-[#a0efd6] px-2 py-0.5 rounded-full">
                          Aprovada
                        </span>
                      )}
                      {sol.status === 'rejected' && (
                        <span className="text-[11px] font-bold text-[#ba1a1a] bg-[#ffdad6] px-2 py-0.5 rounded-full">
                          Recusada
                        </span>
                      )}
                    </div>

                    <p className="font-['Be_Vietnam_Pro'] text-xs text-[#41474e] mb-3 leading-relaxed">
                      Por: <span className="font-semibold">{sol.requesterName}</span>
                      <br />
                      {sol.type === 'Visita' ? `Para: ${sol.dateOrDetails}` : sol.dateOrDetails}
                    </p>

                    {sol.status === 'pending' && (
                      <div className="flex gap-2">
                        {sol.type === 'Visita' ? (
                          <>
                            <button
                              onClick={() => onApproveSolicitation(sol.id)}
                              className="flex-1 text-[#126b57] bg-[#a0efd6]/50 hover:bg-[#a0efd6] py-1.5 rounded-lg font-['Be_Vietnam_Pro'] text-xs font-semibold transition-colors border border-[#a0efd6] cursor-pointer"
                            >
                              Aprovar
                            </button>
                            <button
                              onClick={() => onRejectSolicitation(sol.id)}
                              className="flex-1 text-[#ba1a1a] bg-[#ffdad6]/50 hover:bg-[#ffdad6] py-1.5 rounded-lg font-['Be_Vietnam_Pro'] text-xs font-semibold transition-colors border border-[#ffdad6] cursor-pointer"
                            >
                              Recusar
                            </button>
                          </>
                        ) : (
                          <button
                            onClick={() => onOpenSolicitationProfile(sol)}
                            className="w-full text-[#074469] bg-[#a5d4ff]/40 hover:bg-[#a5d4ff]/70 py-2 rounded-lg font-['Be_Vietnam_Pro'] text-xs font-semibold transition-colors border border-[#a5d4ff] cursor-pointer"
                          >
                            Analisar Perfil
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 pt-4 border-t border-[#c1c7cf]/40 text-center">
              <p className="text-xs font-['Be_Vietnam_Pro'] text-[#72787f]">
                Notificações de novas adoções sincronizadas em tempo real.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};
