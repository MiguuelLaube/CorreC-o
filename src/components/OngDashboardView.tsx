import React, { useState } from 'react';
import { Pet, Solicitation, FosterRequest, OngSession } from '../types';

interface OngDashboardViewProps {
  currentOng: OngSession;
  pets: Pet[];
  solicitations: Solicitation[];
  fosterRequests: FosterRequest[];
  onAddPet: (newPet: Partial<Pet>) => void;
  onDeletePet: (petId: string) => void;
  onUpdatePetStatus: (petId: string, status: 'Disponível' | 'Em Processo' | 'Adotado') => void;
  onApproveSolicitation: (id: string) => void;
  onRejectSolicitation: (id: string) => void;
  onAcceptFoster: (id: string, ongInfo: OngSession) => void;
  onOpenFosterDetails: (foster: FosterRequest) => void;
  onOpenSolicitationProfile: (sol: Solicitation) => void;
}

export const OngDashboardView: React.FC<OngDashboardViewProps> = ({
  currentOng,
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

  // Isolamento estrito de dados: Apenas os pets pertencentes a esta ONG
  const myPets = pets.filter((p) => p.ongId === currentOng.id || p.ongName?.toLowerCase() === currentOng.name?.toLowerCase());

  // Solicitações recebidas exclusivamente para os pets desta ONG
  const mySolicitations = solicitations.filter(
    (s) => s.ongId === currentOng.id || s.ongName?.toLowerCase() === currentOng.name?.toLowerCase()
  );

  // Triagens aceitas por esta ONG ou abertas
  const myFosters = fosterRequests.filter(
    (f) => f.acceptedByOngId === currentOng.id || f.status === 'pending'
  );

  // Formulário: Apenas as 6 informações de cadastro de pet
  const [newPetName, setNewPetName] = useState('');
  const [newPetAge, setNewPetAge] = useState('');
  const [newPetSize, setNewPetSize] = useState<'Pequeno' | 'Médio' | 'Grande'>('Médio');
  const [newPetGender, setNewPetGender] = useState<'Macho' | 'Fêmea'>('Macho');
  const [newPetVaccinated, setNewPetVaccinated] = useState<boolean>(true);
  const [newPetImageUrl, setNewPetImageUrl] = useState('');

  const [filterTable, setFilterTable] = useState<'all' | 'Disponível' | 'Em Processo'>('all');

  const handleSavePet = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPetName.trim()) return;

    onAddPet({
      name: newPetName.trim(),
      age: newPetAge.trim() || '2 anos',
      size: newPetSize,
      gender: newPetGender,
      vaccination: newPetVaccinated ? 'Vacinado' : 'Pendente',
      mainImage:
        newPetImageUrl.trim() ||
        'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=600&q=80',
      galleryImages: [],
      species: 'Cachorro',
      city: currentOng.city || 'São Paulo',
      state: currentOng.state || 'SP',
      entryDate: new Date().toLocaleDateString('pt-BR'),
      status: 'Disponível',
      ongId: currentOng.id,
      ongName: currentOng.name
    });

    setNewPetName('');
    setNewPetAge('');
    setNewPetSize('Médio');
    setNewPetGender('Macho');
    setNewPetVaccinated(true);
    setNewPetImageUrl('');
    setShowAddForm(false);
  };

  const displayedPets = myPets.filter((p) => {
    if (filterTable === 'all') return true;
    return p.status === filterTable;
  });

  return (
    <main className="flex-grow pt-8 pb-20 px-4 md:px-16 max-w-7xl mx-auto w-full">
      {/* Header com Dados da ONG Logada */}
      <header className="mb-8 bg-white p-6 sm:p-8 rounded-3xl border border-[#e0e3e5] shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <img
              src={currentOng.image || 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=800&q=80'}
              alt={currentOng.name}
              className="w-16 h-16 rounded-2xl object-cover border border-[#e0e3e5] shadow-2xs shrink-0"
            />
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="bg-[#126b57] text-[#a0efd6] text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full">
                  Painel de Gestão da ONG
                </span>
                <span className="text-xs text-[#72787f]">Ambiente Isolado</span>
              </div>
              <h1 className="font-['Plus_Jakarta_Sans'] text-2xl sm:text-3xl font-bold text-[#074469]">
                {currentOng.name}
              </h1>
              <p className="font-['Be_Vietnam_Pro'] text-xs sm:text-sm text-[#41474e] mt-0.5">
                CNPJ: <strong>{currentOng.cnpj || '12.345.678/0001-90'}</strong> • {currentOng.city}, {currentOng.state} • {currentOng.email}
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowAddForm(true)}
            className="bg-[#074469] hover:bg-[#2a5c82] text-white font-['Be_Vietnam_Pro'] text-xs sm:text-sm font-bold px-5 py-3 rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer shrink-0"
          >
            <span className="material-symbols-outlined text-lg">add_circle</span>
            <span>Cadastrar Novo Pet</span>
          </button>
        </div>
      </header>

      {/* Grid de Estatísticas Exclusivas desta ONG */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
        <div className="bg-white rounded-2xl p-6 shadow-xs border border-[#e0e3e5]">
          <div className="flex justify-between items-start mb-2">
            <span className="material-symbols-outlined text-[#074469] text-3xl">pets</span>
            <span className="bg-[#a0efd6] text-[#126b57] text-xs font-bold px-2.5 py-0.5 rounded-full">
              Seus Pets
            </span>
          </div>
          <h3 className="font-['Be_Vietnam_Pro'] text-xs text-[#72787f] uppercase font-semibold">Total sob sua Tutela</h3>
          <p className="font-['Plus_Jakarta_Sans'] text-3xl font-bold text-[#074469] mt-1">{myPets.length}</p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-xs border border-[#e0e3e5]">
          <div className="flex justify-between items-start mb-2">
            <span className="material-symbols-outlined text-[#126b57] text-3xl">task_alt</span>
            <span className="bg-[#ffdbc9] text-[#6d2f00] text-xs font-bold px-2.5 py-0.5 rounded-full">
              Aprovadas
            </span>
          </div>
          <h3 className="font-['Be_Vietnam_Pro'] text-xs text-[#72787f] uppercase font-semibold">Adoções Concedidas</h3>
          <p className="font-['Plus_Jakarta_Sans'] text-3xl font-bold text-[#126b57] mt-1">
            {mySolicitations.filter((s) => s.status === 'approved').length}
          </p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-xs border border-[#e0e3e5]">
          <div className="flex justify-between items-start mb-2">
            <span className="material-symbols-outlined text-[#914100] text-3xl">mail</span>
            <span className="bg-[#ffdad6] text-[#93000a] text-xs font-bold px-2.5 py-0.5 rounded-full">
              Novas
            </span>
          </div>
          <h3 className="font-['Be_Vietnam_Pro'] text-xs text-[#72787f] uppercase font-semibold">Solicitações Recebidas</h3>
          <p className="font-['Plus_Jakarta_Sans'] text-3xl font-bold text-[#914100] mt-1">{mySolicitations.length}</p>
        </div>
      </div>

      {/* FORMULÁRIO DE CADASTRO DE PETS (6 CAMPOS) */}
      {showAddForm && (
        <section className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-[#074469] mb-12 animate-in fade-in slide-in-from-top duration-300">
          <div className="flex justify-between items-center mb-2">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#074469] text-2xl">add_circle</span>
              <h2 className="font-['Plus_Jakarta_Sans'] text-2xl font-bold text-[#074469]">
                Cadastrar Pet sob tutela da {currentOng.name}
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
            O pet será vinculado automaticamente à sua ONG e ficará visível no seu perfil público e na vitrine do MatchPet.
          </p>

          <form onSubmit={handleSavePet} className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* 1. Nome do pet */}
            <div className="flex flex-col gap-1.5">
              <label className="font-['Be_Vietnam_Pro'] text-xs font-semibold text-[#41474e]">
                Nome do Pet *
              </label>
              <input
                type="text"
                required
                value={newPetName}
                onChange={(e) => setNewPetName(e.target.value)}
                placeholder="Ex: Thor, Pipoca, Mel, Bob..."
                className="rounded-xl border border-[#c1c7cf] bg-[#f2f4f6] p-3 font-['Be_Vietnam_Pro'] text-sm focus:border-[#074469] focus:bg-white outline-none"
              />
            </div>

            {/* 2. Idade */}
            <div className="flex flex-col gap-1.5">
              <label className="font-['Be_Vietnam_Pro'] text-xs font-semibold text-[#41474e]">
                Idade *
              </label>
              <input
                type="text"
                required
                value={newPetAge}
                onChange={(e) => setNewPetAge(e.target.value)}
                placeholder="Ex: 2 anos, 4 meses, 6 anos..."
                className="rounded-xl border border-[#c1c7cf] bg-[#f2f4f6] p-3 font-['Be_Vietnam_Pro'] text-sm focus:border-[#074469] focus:bg-white outline-none"
              />
            </div>

            {/* 3. Porte */}
            <div className="flex flex-col gap-1.5">
              <label className="font-['Be_Vietnam_Pro'] text-xs font-semibold text-[#41474e]">
                Porte *
              </label>
              <select
                value={newPetSize}
                onChange={(e) => setNewPetSize(e.target.value as any)}
                className="rounded-xl border border-[#c1c7cf] bg-[#f2f4f6] p-3 font-['Be_Vietnam_Pro'] text-sm focus:border-[#074469] focus:bg-white outline-none cursor-pointer"
              >
                <option value="Pequeno">Pequeno (até 10kg)</option>
                <option value="Médio">Médio (10kg a 25kg)</option>
                <option value="Grande">Grande (acima de 25kg)</option>
              </select>
            </div>

            {/* 4. Gênero */}
            <div className="flex flex-col gap-1.5">
              <label className="font-['Be_Vietnam_Pro'] text-xs font-semibold text-[#41474e]">
                Gênero *
              </label>
              <select
                value={newPetGender}
                onChange={(e) => setNewPetGender(e.target.value as any)}
                className="rounded-xl border border-[#c1c7cf] bg-[#f2f4f6] p-3 font-['Be_Vietnam_Pro'] text-sm focus:border-[#074469] focus:bg-white outline-none cursor-pointer"
              >
                <option value="Macho">Macho</option>
                <option value="Fêmea">Fêmea</option>
              </select>
            </div>

            {/* 5. Vacinado (Checkbox) */}
            <div className="flex items-center gap-3 p-3.5 bg-[#f7f9fb] rounded-xl border border-[#c1c7cf]/60 md:col-span-2">
              <input
                type="checkbox"
                id="petVaccinatedCheckOng"
                checked={newPetVaccinated}
                onChange={(e) => setNewPetVaccinated(e.target.checked)}
                className="w-5 h-5 accent-[#074469] rounded cursor-pointer"
              />
              <label
                htmlFor="petVaccinatedCheckOng"
                className="font-['Be_Vietnam_Pro'] text-sm font-semibold text-[#191c1e] cursor-pointer"
              >
                Animal Vacinado (Vacinação completa e atualizada)
              </label>
            </div>

            {/* 6. Fotos do pet */}
            <div className="flex flex-col gap-1.5 md:col-span-2">
              <label className="font-['Be_Vietnam_Pro'] text-xs font-semibold text-[#41474e]">
                Fotos do Pet (URL da imagem principal) *
              </label>
              <input
                type="url"
                required
                value={newPetImageUrl}
                onChange={(e) => setNewPetImageUrl(e.target.value)}
                placeholder="https://exemplo.com/foto-do-pet.jpg"
                className="rounded-xl border border-[#c1c7cf] bg-[#f2f4f6] p-3 font-['Be_Vietnam_Pro'] text-sm focus:border-[#074469] focus:bg-white outline-none"
              />
              {newPetImageUrl && (
                <div className="mt-2 flex items-center gap-3">
                  <img
                    src={newPetImageUrl}
                    alt="Pré-visualização"
                    className="w-16 h-16 rounded-xl object-cover border border-[#e0e3e5] shadow-xs"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=300&q=80';
                    }}
                  />
                  <span className="text-xs text-[#126b57] font-semibold">
                    Pré-visualização da imagem
                  </span>
                </div>
              )}
            </div>

            <div className="md:col-span-2 flex justify-end gap-3 mt-4 pt-4 border-t border-[#e0e3e5]">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-5 py-2.5 text-[#41474e] font-['Be_Vietnam_Pro'] text-sm font-semibold hover:bg-[#e0e3e5] rounded-xl cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="bg-[#074469] text-white font-['Be_Vietnam_Pro'] font-bold text-sm px-7 py-2.5 rounded-xl hover:bg-[#2a5c82] transition-colors cursor-pointer shadow-sm"
              >
                Cadastrar Pet
              </button>
            </div>
          </form>
        </section>
      )}

      {/* Grid Principal: Pets & Triagens vs Solicitações */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Coluna Principal (2 cols) */}
        <div className="lg:col-span-2 space-y-10">
          {/* Tabela de Pets desta ONG */}
          <section className="bg-white rounded-3xl p-6 shadow-xs border border-[#e0e3e5]">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-3">
                <h2 className="font-['Plus_Jakarta_Sans'] text-xl sm:text-2xl font-bold text-[#074469]">
                  Seus Pets Cadastrados
                </h2>
                <div className="flex gap-1 bg-[#eceef0] p-1 rounded-lg text-xs font-['Be_Vietnam_Pro']">
                  <button
                    onClick={() => setFilterTable('all')}
                    className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                      filterTable === 'all' ? 'bg-white font-semibold shadow-xs text-[#074469]' : 'text-[#72787f]'
                    }`}
                  >
                    Todos ({myPets.length})
                  </button>
                  <button
                    onClick={() => setFilterTable('Disponível')}
                    className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                      filterTable === 'Disponível' ? 'bg-white font-semibold shadow-xs text-[#126b57]' : 'text-[#72787f]'
                    }`}
                  >
                    Disponíveis
                  </button>
                </div>
              </div>

              <button
                onClick={() => setShowAddForm(true)}
                className="font-['Be_Vietnam_Pro'] text-xs sm:text-sm font-semibold text-[#126b57] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>+ Novo Pet</span>
              </button>
            </div>

            {displayedPets.length === 0 ? (
              <div className="text-center py-10">
                <p className="text-sm text-[#72787f] font-['Be_Vietnam_Pro'] mb-3">
                  Nenhum pet cadastrado sob a tutela de {currentOng.name} ainda.
                </p>
                <button
                  onClick={() => setShowAddForm(true)}
                  className="bg-[#074469] text-white font-bold text-xs px-4 py-2 rounded-xl"
                >
                  Cadastrar Primeiro Pet
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse font-['Be_Vietnam_Pro']">
                  <thead>
                    <tr className="bg-[#f2f4f6] border-b border-[#e0e3e5] text-xs font-semibold text-[#41474e] uppercase tracking-wider">
                      <th className="p-4">Pet</th>
                      <th className="p-4">Porte / Gênero</th>
                      <th className="p-4">Vacinação</th>
                      <th className="p-4">Status</th>
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
                            <p className="text-xs text-[#72787f]">Idade: {pet.age}</p>
                          </div>
                        </td>

                        <td className="p-4 text-[#41474e] text-xs sm:text-sm">
                          {pet.size} • {pet.gender}
                        </td>

                        <td className="p-4">
                          <span className="bg-[#a0efd6] text-[#126b57] text-xs font-semibold px-2 py-0.5 rounded-md">
                            {pet.vaccination === 'Vacinado' ? 'Vacinado ✓' : pet.vaccination}
                          </span>
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
                                ? 'bg-[#a0efd6] text-[#126b57] hover:bg-[#87d5bd]'
                                : 'bg-[#e0e3e5] text-[#41474e] hover:bg-[#d8dadc]'
                            }`}
                          >
                            {pet.status}
                          </button>
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
            )}
          </section>

          {/* Seção: Triagem de Acolhimento */}
          <section className="bg-white rounded-3xl p-6 shadow-xs border border-[#e0e3e5]">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h2 className="font-['Plus_Jakarta_Sans'] text-xl sm:text-2xl font-bold text-[#074469]">
                  Triagem & Acolhimentos
                </h2>
                <p className="font-['Be_Vietnam_Pro'] text-xs text-[#72787f]">
                  Solicitações de acolhimento de animais para a rede de ONGs.
                </p>
              </div>
              <span className="text-xs text-[#126b57] font-bold bg-[#a0efd6]/60 px-2.5 py-1 rounded-full">
                {myFosters.length} pedidos
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {myFosters.map((req) => (
                <div
                  key={req.id}
                  className="bg-[#f7f9fb] rounded-2xl p-5 shadow-2xs border border-[#e0e3e5] flex flex-col justify-between"
                >
                  <div>
                    <div className="flex justify-between items-start mb-3">
                      <span className="bg-[#ffdbc9] text-[#331200] px-2.5 py-0.5 rounded-full text-xs font-semibold font-['Be_Vietnam_Pro']">
                        Triagem
                      </span>
                      <span className="text-xs text-[#72787f]">{req.timestamp}</span>
                    </div>

                    <h3 className="font-['Plus_Jakarta_Sans'] text-base font-semibold text-[#191c1e] mb-1">
                      {req.petName ? `Pet: ${req.petName} (${req.species})` : 'Animal resgatado'}
                    </h3>
                    <p className="font-['Be_Vietnam_Pro'] text-sm text-[#41474e] mb-4 line-clamp-2">
                      {req.reason}
                    </p>
                  </div>

                  <div className="mt-auto flex gap-2 pt-2 border-t border-[#e0e3e5]/60">
                    <button
                      onClick={() => onOpenFosterDetails(req)}
                      className="flex-1 bg-white hover:bg-[#e0e3e5] text-[#191c1e] font-['Be_Vietnam_Pro'] text-xs font-semibold py-2 rounded-lg transition-colors border border-[#e0e3e5] cursor-pointer"
                    >
                      Detalhes
                    </button>
                    <button
                      onClick={() => onAcceptFoster(req.id, currentOng)}
                      className={`flex-1 font-['Be_Vietnam_Pro'] text-xs font-semibold py-2 rounded-lg transition-colors cursor-pointer ${
                        req.status === 'accepted' && req.acceptedByOngId === currentOng.id
                          ? 'bg-[#a0efd6] text-[#126b57]'
                          : 'bg-[#126b57] text-white hover:bg-[#005141]'
                      }`}
                    >
                      {req.status === 'accepted' && req.acceptedByOngId === currentOng.id
                        ? 'Acolhido por Você ✓'
                        : 'Aceitar Acolhimento'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Sidebar: Solicitações Recebidas para os Pets desta ONG */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-3xl p-6 shadow-xs border border-[#e0e3e5] h-full flex flex-col">
            <h2 className="font-['Plus_Jakarta_Sans'] text-xl font-bold text-[#074469] mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-[#126b57]">inbox</span>
              <span>Solicitações de Adoção ({mySolicitations.length})</span>
            </h2>

            {mySolicitations.length === 0 ? (
              <div className="my-auto text-center py-10">
                <span className="material-symbols-outlined text-[#c1c7cf] text-4xl mb-2">mark_email_unread</span>
                <p className="text-xs font-['Be_Vietnam_Pro'] text-[#72787f]">
                  Nenhuma solicitação para os seus pets no momento.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {mySolicitations.map((sol) => (
                  <div
                    key={sol.id}
                    className="bg-[#f7f9fb] rounded-xl p-4 border border-[#e0e3e5] relative overflow-hidden shadow-2xs"
                  >
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
                          <span className="text-[11px] font-bold text-[#126b57] bg-[#a0efd6] px-2 py-0.5 rounded-full">
                            Concedida
                          </span>
                        )}
                        {sol.status === 'rejected' && (
                          <span className="text-[11px] font-bold text-[#ba1a1a] bg-[#ffdad6] px-2 py-0.5 rounded-full">
                            Recusada
                          </span>
                        )}
                      </div>

                      <p className="font-['Be_Vietnam_Pro'] text-xs text-[#41474e] mb-3 leading-relaxed">
                        Adotante: <strong className="text-[#191c1e]">{sol.requesterName}</strong>
                        <br />
                        Contato: {sol.phone || sol.email}
                      </p>

                      {sol.status === 'pending' && (
                        <div className="flex gap-2">
                          <button
                            onClick={() => onApproveSolicitation(sol.id)}
                            className="flex-1 text-[#126b57] bg-[#a0efd6]/60 hover:bg-[#a0efd6] py-1.5 rounded-lg font-['Be_Vietnam_Pro'] text-xs font-bold transition-colors border border-[#a0efd6] cursor-pointer"
                          >
                            Conceder Adoção
                          </button>
                          <button
                            onClick={() => onRejectSolicitation(sol.id)}
                            className="flex-1 text-[#ba1a1a] bg-[#ffdad6]/60 hover:bg-[#ffdad6] py-1.5 rounded-lg font-['Be_Vietnam_Pro'] text-xs font-bold transition-colors border border-[#ffdad6] cursor-pointer"
                          >
                            Recusar
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
};
