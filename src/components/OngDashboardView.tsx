import React, { useState } from 'react';
import { Pet, Solicitation, FosterRequest, OngSession, Species, Size, Gender, AgeGroup } from '../types';
import { ApplicantDetailsModal } from './ApplicantDetailsModal';
import { EditPetModal } from './EditPetModal';

interface OngDashboardViewProps {
  currentOng: OngSession;
  pets: Pet[];
  solicitations: Solicitation[];
  fosterRequests: FosterRequest[];
  onAddPet: (newPet: Partial<Pet>) => void;
  onUpdatePet?: (updatedPet: Pet) => void;
  onDeletePet: (petId: string) => void;
  onUpdatePetStatus: (petId: string, status: 'Disponível' | 'Em Processo' | 'Adotado') => void;
  onApproveSolicitation: (id: string) => void;
  onRejectSolicitation: (id: string, reason?: string) => void;
  onAcceptFoster: (id: string, ongInfo: OngSession) => void;
  onDeclineFoster?: (id: string, reason?: string) => void;
  onPromoteFosterToCatalog?: (foster: FosterRequest) => void;
  onOpenFosterDetails?: (foster: FosterRequest) => void;
  onOpenSolicitationProfile?: (sol: Solicitation) => void;
}

export const OngDashboardView: React.FC<OngDashboardViewProps> = ({
  currentOng,
  pets,
  solicitations,
  fosterRequests,
  onAddPet,
  onUpdatePet,
  onDeletePet,
  onUpdatePetStatus,
  onApproveSolicitation,
  onRejectSolicitation,
  onAcceptFoster,
  onDeclineFoster,
  onPromoteFosterToCatalog,
  onOpenFosterDetails,
  onOpenSolicitationProfile
}) => {
  const [showAddForm, setShowAddForm] = useState<boolean>(false);
  const [editingPet, setEditingPet] = useState<Pet | null>(null);

  // Modais de Perfil / Questionário Detalhado
  const [selectedApplicantSol, setSelectedApplicantSol] = useState<Solicitation | null>(null);
  const [selectedApplicantFoster, setSelectedApplicantFoster] = useState<FosterRequest | null>(null);

  // Filtros de visualização
  const [filterTable, setFilterTable] = useState<'all' | 'Disponível' | 'Em Processo' | 'Adotado'>('all');
  const [solicitationTab, setSolicitationTab] = useState<'ativas' | 'historico'>('ativas');
  const [fosterTab, setFosterTab] = useState<'pendentes' | 'acolhidos' | 'historico'>('pendentes');

  // Isolamento estrito de dados: Apenas os pets pertencentes a esta ONG
  const myPets = pets.filter((p) => p.ongId === currentOng.id || p.ongName?.toLowerCase() === currentOng.name?.toLowerCase());

  // Solicitações desta ONG
  const mySolicitations = solicitations.filter(
    (s) => s.ongId === currentOng.id || s.ongName?.toLowerCase() === currentOng.name?.toLowerCase()
  );

  // Solicitações ativas / pendentes (as que foram negadas/rejeitadas somem da lista ativa)
  const myActiveSolicitations = mySolicitations.filter((s) => s.status === 'pending' && !s.dismissedByOng);
  const myHistorySolicitations = mySolicitations.filter((s) => s.status !== 'pending' || s.dismissedByOng);

  // Triagens vinculadas ou abertas
  const myFosters = fosterRequests.filter(
    (f) => f.acceptedByOngId === currentOng.id || (f.status === 'pending' && !f.dismissedByOng) || f.status === 'declined'
  );

  const myPendingFosters = myFosters.filter((f) => f.status === 'pending' && !f.dismissedByOng);
  const myAcceptedFosters = myFosters.filter((f) => f.status === 'accepted' && f.acceptedByOngId === currentOng.id);
  const myHistoryFosters = myFosters.filter((f) => f.status === 'declined' || f.dismissedByOng);

  // Formulário Completo de Cadastro de Pet com Upload Múltiplo
  const [newPetName, setNewPetName] = useState('');
  const [newPetSpecies, setNewPetSpecies] = useState<Species>('Cachorro');
  const [newPetBreed, setNewPetBreed] = useState('SRD');
  const [newPetAge, setNewPetAge] = useState('');
  const [newPetAgeGroup, setNewPetAgeGroup] = useState<AgeGroup>('Adulto');
  const [newPetSize, setNewPetSize] = useState<Size>('Médio');
  const [newPetGender, setNewPetGender] = useState<Gender>('Macho');
  const [newPetColor, setNewPetColor] = useState('Caramelo');
  const [newPetVaccinated, setNewPetVaccinated] = useState<boolean>(true);
  const [newPetCastrated, setNewPetCastrated] = useState<boolean>(true);
  const [newPetDewormed, setNewPetDewormed] = useState<boolean>(true);
  const [newPetSpecialNeeds, setNewPetSpecialNeeds] = useState<boolean>(false);
  const [newPetDescription, setNewPetDescription] = useState('');

  // Fotos Múltiplas do Cadastro
  const [newPetMainImage, setNewPetMainImage] = useState('');
  const [newPetGallery, setNewPetGallery] = useState<string[]>([]);
  const [inputImageUrl, setInputImageUrl] = useState('');

  // Upload múltiplo via arquivo
  const handleMultiFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        if (!newPetMainImage) {
          setNewPetMainImage(result);
        } else {
          setNewPetGallery((prev) => [...prev, result]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleAddUrlImage = () => {
    if (!inputImageUrl.trim()) return;
    if (!newPetMainImage) {
      setNewPetMainImage(inputImageUrl.trim());
    } else {
      setNewPetGallery((prev) => [...prev, inputImageUrl.trim()]);
    }
    setInputImageUrl('');
  };

  const handleRemoveGalleryImage = (idxToRemove: number) => {
    setNewPetGallery((prev) => prev.filter((_, idx) => idx !== idxToRemove));
  };

  const handleSetAsMain = (url: string, idx: number) => {
    const oldMain = newPetMainImage;
    setNewPetMainImage(url);
    setNewPetGallery((prev) => {
      const updated = [...prev];
      updated[idx] = oldMain;
      return updated;
    });
  };

  const handleSaveNewPet = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPetName.trim()) return;

    onAddPet({
      name: newPetName.trim(),
      species: newPetSpecies,
      breed: newPetBreed.trim() || 'SRD',
      age: newPetAge.trim() || '2 anos',
      ageGroup: newPetAgeGroup,
      size: newPetSize,
      gender: newPetGender,
      color: newPetColor.trim() || 'Caramelo',
      vaccination: newPetVaccinated ? 'Vacinado' : 'Pendente',
      castrated: newPetCastrated,
      dewormed: newPetDewormed,
      specialNeeds: newPetSpecialNeeds,
      description: newPetDescription.trim(),
      mainImage:
        newPetMainImage.trim() ||
        'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=600&q=80',
      galleryImages: newPetGallery,
      city: currentOng.city || 'São Paulo',
      state: currentOng.state || 'SP',
      entryDate: new Date().toLocaleDateString('pt-BR'),
      status: 'Disponível',
      ongId: currentOng.id,
      ongName: currentOng.name,
      adoptionHistory: [
        {
          id: `hist-init-${Date.now()}`,
          date: new Date().toLocaleDateString('pt-BR') + ' ' + new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
          type: 'cadastro_ong',
          title: 'Pet Cadastrado no Catálogo da ONG',
          description: `Animal incluído sob a tutela de ${currentOng.name}.`,
          actorName: currentOng.name,
          actorRole: 'ong'
        }
      ]
    });

    // Reset formulário
    setNewPetName('');
    setNewPetAge('');
    setNewPetBreed('SRD');
    setNewPetSize('Médio');
    setNewPetGender('Macho');
    setNewPetVaccinated(true);
    setNewPetCastrated(true);
    setNewPetDewormed(true);
    setNewPetSpecialNeeds(false);
    setNewPetDescription('');
    setNewPetMainImage('');
    setNewPetGallery([]);
    setInputImageUrl('');
    setShowAddForm(false);
  };

  const displayedPets = myPets.filter((p) => {
    if (filterTable === 'all') return true;
    return p.status === filterTable;
  });

  return (
    <main className="flex-grow pt-8 pb-20 px-4 md:px-16 max-w-7xl mx-auto w-full font-['Be_Vietnam_Pro']">
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
              <p className="text-xs sm:text-sm text-[#41474e] mt-0.5">
                CNPJ: <strong>{currentOng.cnpj || '12.345.678/0001-90'}</strong> • {currentOng.city}, {currentOng.state} • {currentOng.email}
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowAddForm(true)}
            className="bg-[#074469] hover:bg-[#2a5c82] text-white text-xs sm:text-sm font-bold px-5 py-3 rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer shrink-0"
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
          <h3 className="text-xs text-[#72787f] uppercase font-semibold">Total sob sua Tutela</h3>
          <p className="font-['Plus_Jakarta_Sans'] text-3xl font-bold text-[#074469] mt-1">{myPets.length}</p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-xs border border-[#e0e3e5]">
          <div className="flex justify-between items-start mb-2">
            <span className="material-symbols-outlined text-[#126b57] text-3xl">task_alt</span>
            <span className="bg-[#ffdbc9] text-[#6d2f00] text-xs font-bold px-2.5 py-0.5 rounded-full">
              Aprovadas
            </span>
          </div>
          <h3 className="text-xs text-[#72787f] uppercase font-semibold">Adoções Concedidas</h3>
          <p className="font-['Plus_Jakarta_Sans'] text-3xl font-bold text-[#126b57] mt-1">
            {mySolicitations.filter((s) => s.status === 'approved').length}
          </p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-xs border border-[#e0e3e5]">
          <div className="flex justify-between items-start mb-2">
            <span className="material-symbols-outlined text-[#914100] text-3xl">mark_email_unread</span>
            <span className="bg-[#ffdad6] text-[#93000a] text-xs font-bold px-2.5 py-0.5 rounded-full">
              Pendentes
            </span>
          </div>
          <h3 className="text-xs text-[#72787f] uppercase font-semibold">Notificações / Pedidos Ativos</h3>
          <p className="font-['Plus_Jakarta_Sans'] text-3xl font-bold text-[#914100] mt-1">{myActiveSolicitations.length}</p>
        </div>
      </div>

      {/* FORMULÁRIO DE CADASTRO DE PETS COM MULTI-FOTOS E GALERIA */}
      {showAddForm && (
        <section className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-[#074469] mb-12 animate-in fade-in slide-in-from-top duration-300">
          <div className="flex justify-between items-center mb-2">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#074469] text-2xl">add_circle</span>
              <h2 className="font-['Plus_Jakarta_Sans'] text-2xl font-bold text-[#074469]">
                Cadastrar Novo Pet sob tutela da {currentOng.name}
              </h2>
            </div>
            <button
              onClick={() => setShowAddForm(false)}
              className="text-[#72787f] hover:text-[#191c1e] p-1.5 rounded-lg hover:bg-[#e0e3e5] cursor-pointer"
            >
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>

          <p className="text-xs text-[#41474e] mb-6">
            O animal será adicionado ao catálogo oficial da sua instituição com suporte a upload de múltiplas fotos e controle histórico.
          </p>

          <form onSubmit={handleSaveNewPet} className="space-y-4 text-xs sm:text-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#41474e] mb-1">Nome do Pet *</label>
                <input
                  type="text"
                  required
                  value={newPetName}
                  onChange={(e) => setNewPetName(e.target.value)}
                  placeholder="Ex: Pipoca, Thor, Luna, Bob..."
                  className="w-full rounded-xl border border-[#c1c7cf] bg-[#f2f4f6] p-2.5 outline-none focus:border-[#074469] focus:bg-white text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#41474e] mb-1">Espécie *</label>
                <select
                  value={newPetSpecies}
                  onChange={(e) => setNewPetSpecies(e.target.value as Species)}
                  className="w-full rounded-xl border border-[#c1c7cf] bg-[#f2f4f6] p-2.5 outline-none focus:border-[#074469] focus:bg-white text-xs cursor-pointer"
                >
                  <option value="Cachorro">Cachorro</option>
                  <option value="Gato">Gato</option>
                  <option value="Outro">Outro</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#41474e] mb-1">Idade *</label>
                <input
                  type="text"
                  required
                  value={newPetAge}
                  onChange={(e) => setNewPetAge(e.target.value)}
                  placeholder="Ex: 2 anos, 4 meses..."
                  className="w-full rounded-xl border border-[#c1c7cf] bg-[#f2f4f6] p-2.5 outline-none focus:border-[#074469] focus:bg-white text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#41474e] mb-1">Porte *</label>
                <select
                  value={newPetSize}
                  onChange={(e) => setNewPetSize(e.target.value as Size)}
                  className="w-full rounded-xl border border-[#c1c7cf] bg-[#f2f4f6] p-2.5 outline-none focus:border-[#074469] focus:bg-white text-xs cursor-pointer"
                >
                  <option value="Pequeno">Pequeno (até 10kg)</option>
                  <option value="Médio">Médio (10kg a 25kg)</option>
                  <option value="Grande">Grande (acima de 25kg)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#41474e] mb-1">Gênero *</label>
                <select
                  value={newPetGender}
                  onChange={(e) => setNewPetGender(e.target.value as Gender)}
                  className="w-full rounded-xl border border-[#c1c7cf] bg-[#f2f4f6] p-2.5 outline-none focus:border-[#074469] focus:bg-white text-xs cursor-pointer"
                >
                  <option value="Macho">Macho</option>
                  <option value="Fêmea">Fêmea</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#41474e] mb-1">Raça / Mistura</label>
                <input
                  type="text"
                  value={newPetBreed}
                  onChange={(e) => setNewPetBreed(e.target.value)}
                  placeholder="Ex: SRD, Poodle, Labrador..."
                  className="w-full rounded-xl border border-[#c1c7cf] bg-[#f2f4f6] p-2.5 outline-none focus:border-[#074469] focus:bg-white text-xs"
                />
              </div>
            </div>

            {/* Checkboxes de Saúde */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
              <label className="flex items-center gap-2 p-2.5 bg-[#f7f9fb] rounded-xl border border-[#e0e3e5] cursor-pointer">
                <input
                  type="checkbox"
                  checked={newPetVaccinated}
                  onChange={(e) => setNewPetVaccinated(e.target.checked)}
                  className="w-4 h-4 accent-[#074469]"
                />
                <span className="text-xs font-semibold">Animal Vacinado</span>
              </label>

              <label className="flex items-center gap-2 p-2.5 bg-[#f7f9fb] rounded-xl border border-[#e0e3e5] cursor-pointer">
                <input
                  type="checkbox"
                  checked={newPetCastrated}
                  onChange={(e) => setNewPetCastrated(e.target.checked)}
                  className="w-4 h-4 accent-[#074469]"
                />
                <span className="text-xs font-semibold">Castrado</span>
              </label>

              <label className="flex items-center gap-2 p-2.5 bg-[#f7f9fb] rounded-xl border border-[#e0e3e5] cursor-pointer">
                <input
                  type="checkbox"
                  checked={newPetDewormed}
                  onChange={(e) => setNewPetDewormed(e.target.checked)}
                  className="w-4 h-4 accent-[#074469]"
                />
                <span className="text-xs font-semibold">Vermifugado</span>
              </label>

              <label className="flex items-center gap-2 p-2.5 bg-[#f7f9fb] rounded-xl border border-[#e0e3e5] cursor-pointer">
                <input
                  type="checkbox"
                  checked={newPetSpecialNeeds}
                  onChange={(e) => setNewPetSpecialNeeds(e.target.checked)}
                  className="w-4 h-4 accent-[#074469]"
                />
                <span className="text-xs font-semibold">Cuidados Especiais</span>
              </label>
            </div>

            {/* Upload de Múltiplas Fotos */}
            <div className="p-4 bg-[#f7f9fb] rounded-2xl border border-[#e0e3e5] space-y-3">
              <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
                <label className="text-xs font-bold text-[#074469] flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-base">photo_library</span>
                  <span>Fotos do Pet (Upload de Múltiplas Fotos ou Links) *</span>
                </label>
                <label className="bg-[#074469] hover:bg-[#2a5c82] text-white px-3.5 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer inline-flex items-center gap-1 shrink-0">
                  <span className="material-symbols-outlined text-base">upload_file</span>
                  <span>Selecionar Fotos do Dispositivo</span>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleMultiFileUpload}
                    className="hidden"
                  />
                </label>
              </div>

              <div className="flex gap-2">
                <input
                  type="url"
                  value={inputImageUrl}
                  onChange={(e) => setInputImageUrl(e.target.value)}
                  placeholder="Ou cole uma URL de imagem direta (https://...)"
                  className="flex-1 rounded-xl border border-[#c1c7cf] bg-white p-2 text-xs outline-none focus:border-[#074469]"
                />
                <button
                  type="button"
                  onClick={handleAddUrlImage}
                  className="bg-white hover:bg-[#e0e3e5] text-[#074469] border border-[#074469]/30 font-bold px-4 py-2 rounded-xl text-xs cursor-pointer shrink-0"
                >
                  + Adicionar Foto
                </button>
              </div>

              {/* Pré-visualização da Galeria de Fotos */}
              {(newPetMainImage || newPetGallery.length > 0) && (
                <div className="pt-2">
                  <span className="text-[11px] font-bold text-[#41474e] block mb-2">
                    Galeria Selecionada (Primeira foto é a de capa):
                  </span>
                  <div className="flex flex-wrap gap-3">
                    {/* Foto Principal */}
                    {newPetMainImage && (
                      <div className="relative w-20 h-20 rounded-2xl overflow-hidden border-2 border-[#074469] shadow-xs group">
                        <img
                          src={newPetMainImage}
                          alt="Foto Capa"
                          className="w-full h-full object-cover"
                        />
                        <span className="absolute bottom-0 inset-x-0 bg-[#074469] text-white text-[9px] font-bold text-center py-0.5">
                          Capa
                        </span>
                      </div>
                    )}

                    {/* Miniaturas da Galeria */}
                    {newPetGallery.map((imgUrl, idx) => (
                      <div
                        key={`new-gal-${idx}`}
                        className="relative w-20 h-20 rounded-2xl overflow-hidden border border-[#e0e3e5] shadow-xs group"
                      >
                        <img
                          src={imgUrl}
                          alt={`Foto ${idx + 2}`}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1 p-1">
                          <button
                            type="button"
                            onClick={() => handleSetAsMain(imgUrl, idx)}
                            className="bg-white text-[#074469] text-[9px] font-bold px-1.5 py-0.5 rounded cursor-pointer"
                          >
                            Virar Capa
                          </button>
                          <button
                            type="button"
                            onClick={() => handleRemoveGalleryImage(idx)}
                            className="bg-[#ffdad6] text-[#ba1a1a] text-[9px] font-bold px-1.5 py-0.5 rounded cursor-pointer"
                          >
                            Remover
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#41474e] mb-1">
                História / Descrição do Animal (Opcional)
              </label>
              <textarea
                rows={2}
                value={newPetDescription}
                onChange={(e) => setNewPetDescription(e.target.value)}
                placeholder="Conte sobre o temperamento, porte, hábitos e como foi o resgate..."
                className="w-full rounded-xl border border-[#c1c7cf] bg-[#f2f4f6] p-2.5 outline-none focus:border-[#074469] focus:bg-white text-xs resize-none"
              />
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-[#e0e3e5]">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-5 py-2.5 text-[#41474e] text-xs font-semibold hover:bg-[#e0e3e5] rounded-xl cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="bg-[#074469] hover:bg-[#2a5c82] text-white font-bold text-xs px-7 py-2.5 rounded-xl shadow-xs transition-colors cursor-pointer"
              >
                Salvar e Publicar Pet
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
            <div className="flex flex-wrap justify-between items-center gap-3 mb-4">
              <div className="flex items-center gap-3">
                <h2 className="font-['Plus_Jakarta_Sans'] text-xl sm:text-2xl font-bold text-[#074469]">
                  Seus Pets Cadastrados
                </h2>
                <div className="flex gap-1 bg-[#eceef0] p-1 rounded-lg text-xs">
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
                  <button
                    onClick={() => setFilterTable('Adotado')}
                    className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                      filterTable === 'Adotado' ? 'bg-white font-semibold shadow-xs text-[#6d2f00]' : 'text-[#72787f]'
                    }`}
                  >
                    Adotados
                  </button>
                </div>
              </div>

              <button
                onClick={() => setShowAddForm(true)}
                className="text-xs sm:text-sm font-semibold text-[#126b57] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>+ Novo Pet</span>
              </button>
            </div>

            {displayedPets.length === 0 ? (
              <div className="text-center py-10">
                <p className="text-sm text-[#72787f] mb-3">
                  Nenhum pet encontrado neste filtro sob a tutela de {currentOng.name}.
                </p>
                <button
                  onClick={() => setShowAddForm(true)}
                  className="bg-[#074469] text-white font-bold text-xs px-4 py-2 rounded-xl cursor-pointer"
                >
                  Cadastrar Pet
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-[#f2f4f6] border-b border-[#e0e3e5] text-xs font-semibold text-[#41474e] uppercase tracking-wider">
                      <th className="p-4">Pet</th>
                      <th className="p-4">Porte / Gênero</th>
                      <th className="p-4">Fotos</th>
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
                            <p className="text-xs text-[#72787f]">{pet.species} • {pet.age}</p>
                          </div>
                        </td>

                        <td className="p-4 text-[#41474e] text-xs sm:text-sm">
                          {pet.size} • {pet.gender}
                        </td>

                        <td className="p-4">
                          <span className="inline-flex items-center gap-1 bg-[#eceef0] text-[#074469] text-xs font-bold px-2 py-0.5 rounded-md">
                            <span className="material-symbols-outlined text-xs">photo_camera</span>
                            <span>{1 + (pet.galleryImages?.length || 0)}</span>
                          </span>
                        </td>

                        <td className="p-4">
                          <button
                            onClick={() =>
                              onUpdatePetStatus(
                                pet.id,
                                pet.status === 'Disponível' ? 'Em Processo' : pet.status === 'Em Processo' ? 'Adotado' : 'Disponível'
                              )
                            }
                            title="Clique para alternar o status do pet"
                            className={`px-3 py-1 rounded-full text-xs font-semibold cursor-pointer transition-colors ${
                              pet.status === 'Disponível'
                                ? 'bg-[#a0efd6] text-[#126b57] hover:bg-[#87d5bd]'
                                : pet.status === 'Adotado'
                                ? 'bg-[#cde5ff] text-[#074469] hover:bg-[#b8d9f9]'
                                : 'bg-[#e0e3e5] text-[#41474e] hover:bg-[#d8dadc]'
                            }`}
                          >
                            {pet.status}
                          </button>
                        </td>

                        <td className="p-4 text-right">
                          <div className="flex gap-2 justify-end">
                            <button
                              onClick={() => setEditingPet(pet)}
                              className="p-1.5 text-[#074469] hover:bg-[#cde5ff]/40 rounded-lg transition-colors cursor-pointer flex items-center gap-1 font-bold text-xs"
                              title="Editar informações completas do pet"
                            >
                              <span className="material-symbols-outlined text-lg">edit</span>
                              <span>Editar</span>
                            </button>
                            <button
                              onClick={() => {
                                if (confirm(`Deseja remover ${pet.name} do cadastro?`)) {
                                  onDeletePet(pet.id);
                                }
                              }}
                              className="p-1.5 text-[#ba1a1a] hover:bg-[#ffdad6]/40 rounded-lg transition-colors cursor-pointer"
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
            <div className="flex flex-wrap justify-between items-center gap-3 mb-4">
              <div>
                <h2 className="font-['Plus_Jakarta_Sans'] text-xl sm:text-2xl font-bold text-[#074469]">
                  Triagem & Acolhimentos
                </h2>
                <p className="text-xs text-[#72787f]">
                  Animais resgatados pela comunidade que necessitam de acolhimento institucional.
                </p>
              </div>

              {/* Abas da Triagem */}
              <div className="flex gap-1 bg-[#eceef0] p-1 rounded-xl text-xs font-semibold">
                <button
                  onClick={() => setFosterTab('pendentes')}
                  className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                    fosterTab === 'pendentes' ? 'bg-white text-[#074469] font-bold shadow-xs' : 'text-[#72787f]'
                  }`}
                >
                  Pendentes ({myPendingFosters.length})
                </button>
                <button
                  onClick={() => setFosterTab('acolhidos')}
                  className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                    fosterTab === 'acolhidos' ? 'bg-[#126b57] text-white font-bold shadow-xs' : 'text-[#72787f]'
                  }`}
                >
                  Acolhidos ({myAcceptedFosters.length})
                </button>
                <button
                  onClick={() => setFosterTab('historico')}
                  className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                    fosterTab === 'historico' ? 'bg-white text-[#72787f] font-bold shadow-xs' : 'text-[#72787f]'
                  }`}
                >
                  Histórico ({myHistoryFosters.length})
                </button>
              </div>
            </div>

            {/* Lista da Triagem */}
            {fosterTab === 'pendentes' && (
              myPendingFosters.length === 0 ? (
                <div className="text-center py-8 bg-[#f7f9fb] rounded-2xl border border-[#e0e3e5] text-xs text-[#72787f]">
                  Nenhum pedido de acolhimento pendente no momento.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {myPendingFosters.map((req) => (
                    <div
                      key={req.id}
                      className="bg-[#f7f9fb] rounded-2xl p-5 shadow-2xs border border-[#e0e3e5] flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex justify-between items-start mb-2">
                          <span className="bg-[#ffdbc9] text-[#331200] px-2.5 py-0.5 rounded-full text-xs font-semibold">
                            Triagem Aberta
                          </span>
                          <span className="text-xs text-[#72787f]">{req.timestamp}</span>
                        </div>

                        <h3 className="font-['Plus_Jakarta_Sans'] text-base font-bold text-[#191c1e] mb-1">
                          {req.petName ? `Pet: ${req.petName} (${req.species})` : 'Animal resgatado'}
                        </h3>

                        {/* Nome do solicitante clicável */}
                        <p className="text-xs text-[#41474e] mb-2">
                          Solicitante:{' '}
                          <button
                            type="button"
                            onClick={() => setSelectedApplicantFoster(req)}
                            className="font-bold text-[#074469] hover:underline cursor-pointer"
                            title="Clique para ver dados completos e questionário"
                          >
                            {req.requesterName || 'Adotante'}
                          </button>
                        </p>

                        <p className="text-xs text-[#72787f] mb-4 line-clamp-2 leading-relaxed">
                          {req.reason}
                        </p>
                      </div>

                      <div className="mt-auto flex gap-2 pt-2 border-t border-[#e0e3e5]/60">
                        <button
                          onClick={() => setSelectedApplicantFoster(req)}
                          className="flex-1 bg-white hover:bg-[#e0e3e5] text-[#191c1e] text-xs font-bold py-2 rounded-xl transition-colors border border-[#e0e3e5] cursor-pointer"
                        >
                          Ver Detalhes
                        </button>
                        <button
                          onClick={() => {
                            if (onDeclineFoster) {
                              onDeclineFoster(req.id);
                            }
                          }}
                          className="px-3 bg-[#ffdad6] hover:bg-[#ffb4ab] text-[#ba1a1a] text-xs font-bold py-2 rounded-xl transition-colors cursor-pointer"
                          title="Negar acolhimento"
                        >
                          Negar
                        </button>
                        <button
                          onClick={() => onAcceptFoster(req.id, currentOng)}
                          className="flex-1 bg-[#126b57] hover:bg-[#005141] text-white text-xs font-bold py-2 rounded-xl transition-colors cursor-pointer shadow-xs"
                        >
                          Aceitar
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )
            )}

            {/* Triagens Acolhidas por esta ONG */}
            {fosterTab === 'acolhidos' && (
              myAcceptedFosters.length === 0 ? (
                <div className="text-center py-8 bg-[#f7f9fb] rounded-2xl border border-[#e0e3e5] text-xs text-[#72787f]">
                  Sua ONG ainda não acolheu animais da triagem.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {myAcceptedFosters.map((req) => (
                    <div
                      key={req.id}
                      className="bg-white rounded-2xl p-5 shadow-2xs border border-[#126b57]/30 flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex justify-between items-start mb-2">
                          <span className="bg-[#a0efd6] text-[#126b57] px-2.5 py-0.5 rounded-full text-xs font-bold">
                            Acolhido por {currentOng.name} ✓
                          </span>
                        </div>

                        <h3 className="font-['Plus_Jakarta_Sans'] text-base font-bold text-[#074469] mb-1">
                          {req.petName} ({req.species})
                        </h3>

                        <p className="text-xs text-[#41474e] mb-2">
                          Resgatado por:{' '}
                          <button
                            type="button"
                            onClick={() => setSelectedApplicantFoster(req)}
                            className="font-bold text-[#074469] hover:underline cursor-pointer"
                          >
                            {req.requesterName}
                          </button>
                        </p>
                      </div>

                      <div className="mt-4 pt-3 border-t border-[#e0e3e5] flex gap-2">
                        {onPromoteFosterToCatalog && (
                          <button
                            onClick={() => onPromoteFosterToCatalog(req)}
                            className="flex-1 bg-[#074469] hover:bg-[#2a5c82] text-white text-xs font-bold py-2 rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-1 shadow-xs"
                          >
                            <span className="material-symbols-outlined text-sm">add_to_photos</span>
                            <span>Mover para Catálogo da ONG</span>
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )
            )}

            {/* Histórico de Triagens Negadas */}
            {fosterTab === 'historico' && (
              myHistoryFosters.length === 0 ? (
                <div className="text-center py-8 bg-[#f7f9fb] rounded-2xl border border-[#e0e3e5] text-xs text-[#72787f]">
                  Nenhum registro de triagem arquivada ou negada.
                </div>
              ) : (
                <div className="space-y-3">
                  {myHistoryFosters.map((req) => (
                    <div
                      key={req.id}
                      className="bg-[#f7f9fb] rounded-xl p-3.5 border border-[#e0e3e5] flex items-center justify-between"
                    >
                      <div>
                        <p className="font-bold text-xs text-[#191c1e]">
                          {req.petName} ({req.species}) • Solicitante: {req.requesterName}
                        </p>
                        <span className="text-[10px] text-[#ba1a1a] font-bold uppercase tracking-wider">
                          Status: Negado / Recusado
                        </span>
                      </div>
                      <button
                        onClick={() => setSelectedApplicantFoster(req)}
                        className="text-xs text-[#074469] font-bold hover:underline"
                      >
                        Ver Detalhes
                      </button>
                    </div>
                  ))}
                </div>
              )
            )}
          </section>
        </div>

        {/* Sidebar: Solicitações de Adoção Recebidas */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-3xl p-6 shadow-xs border border-[#e0e3e5] h-full flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-['Plus_Jakarta_Sans'] text-xl font-bold text-[#074469] flex items-center gap-2">
                <span className="material-symbols-outlined text-[#126b57]">inbox</span>
                <span>Pedidos de Adoção</span>
              </h2>

              <div className="flex gap-1 bg-[#eceef0] p-1 rounded-xl text-xs font-semibold">
                <button
                  onClick={() => setSolicitationTab('ativas')}
                  className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                    solicitationTab === 'ativas' ? 'bg-white text-[#074469] font-bold shadow-xs' : 'text-[#72787f]'
                  }`}
                >
                  Novos ({myActiveSolicitations.length})
                </button>
                <button
                  onClick={() => setSolicitationTab('historico')}
                  className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                    solicitationTab === 'historico' ? 'bg-white text-[#72787f] font-bold shadow-xs' : 'text-[#72787f]'
                  }`}
                >
                  Histórico
                </button>
              </div>
            </div>

            {/* ABA 1: SOLICITAÇÕES ATIVAS / PENDENTES */}
            {solicitationTab === 'ativas' && (
              myActiveSolicitations.length === 0 ? (
                <div className="my-auto text-center py-10">
                  <span className="material-symbols-outlined text-[#c1c7cf] text-4xl mb-2">mark_email_read</span>
                  <p className="text-xs text-[#72787f]">
                    Nenhuma solicitação pendente no momento. Quando um adotante manifestar interesse, o pedido aparecerá aqui!
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {myActiveSolicitations.map((sol) => (
                    <div
                      key={sol.id}
                      className="bg-[#f7f9fb] rounded-2xl p-4 border border-[#e0e3e5] relative overflow-hidden shadow-2xs animate-in fade-in"
                    >
                      <div className="absolute top-0 left-0 w-1.5 h-full bg-[#126b57]" />

                      <div className="ml-2">
                        <div className="flex justify-between items-center mb-1">
                          <p className="font-['Plus_Jakarta_Sans'] text-sm text-[#074469] font-bold">
                            {sol.type}: {sol.petName}
                          </p>
                          <span className="text-[10px] font-bold text-[#126b57] bg-[#a0efd6] px-2 py-0.5 rounded-full">
                            Novo
                          </span>
                        </div>

                        {/* Nome do adotante CLICÁVEL que abre questionário completo */}
                        <p className="text-xs text-[#41474e] mb-1">
                          Adotante:{' '}
                          <button
                            type="button"
                            onClick={() => setSelectedApplicantSol(sol)}
                            className="font-bold text-[#074469] hover:underline cursor-pointer inline-flex items-center gap-1"
                            title="Clique para ver o questionário completo do adotante"
                          >
                            <span>{sol.requesterName}</span>
                            <span className="material-symbols-outlined text-xs">open_in_new</span>
                          </button>
                        </p>

                        <p className="text-[11px] text-[#72787f] mb-3">
                          Contato: {sol.phone || sol.email}
                        </p>

                        {/* Botões de Ação Imediata: Negar e Conceder */}
                        <div className="flex gap-2">
                          <button
                            onClick={() => onRejectSolicitation(sol.id)}
                            className="flex-1 text-[#ba1a1a] bg-[#ffdad6]/70 hover:bg-[#ffdad6] py-2 rounded-xl text-xs font-bold transition-colors border border-[#ffdad6] cursor-pointer"
                            title="Negar pedido e remover das notificações ativas"
                          >
                            Negar
                          </button>
                          <button
                            onClick={() => onApproveSolicitation(sol.id)}
                            className="flex-1 text-[#126b57] bg-[#a0efd6]/70 hover:bg-[#a0efd6] py-2 rounded-xl text-xs font-bold transition-colors border border-[#a0efd6] cursor-pointer shadow-2xs"
                            title="Conceder adoção"
                          >
                            Conceder
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )
            )}

            {/* ABA 2: HISTÓRICO DE SOLICITAÇÕES CONCLUÍDAS E NEGADAS */}
            {solicitationTab === 'historico' && (
              myHistorySolicitations.length === 0 ? (
                <div className="my-auto text-center py-10">
                  <p className="text-xs text-[#72787f]">
                    Nenhum pedido no histórico.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {myHistorySolicitations.map((sol) => (
                    <div
                      key={sol.id}
                      className="bg-[#f7f9fb] rounded-xl p-3 border border-[#e0e3e5] text-xs"
                    >
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-bold text-[#074469]">{sol.petName}</span>
                        {sol.status === 'approved' && (
                          <span className="text-[10px] font-bold text-[#126b57] bg-[#a0efd6] px-2 py-0.5 rounded-full">
                            Concedida ✓
                          </span>
                        )}
                        {sol.status === 'rejected' && (
                          <span className="text-[10px] font-bold text-[#ba1a1a] bg-[#ffdad6] px-2 py-0.5 rounded-full">
                            Negado
                          </span>
                        )}
                      </div>
                      <p className="text-[#41474e]">
                        Adotante:{' '}
                        <button
                          type="button"
                          onClick={() => setSelectedApplicantSol(sol)}
                          className="font-semibold text-[#074469] hover:underline"
                        >
                          {sol.requesterName}
                        </button>
                      </p>
                    </div>
                  ))}
                </div>
              )
            )}
          </div>
        </div>
      </div>

      {/* Modal de Detalhes e Questionário do Adotante */}
      {selectedApplicantSol && (
        <ApplicantDetailsModal
          solicitation={selectedApplicantSol}
          onClose={() => setSelectedApplicantSol(null)}
          onApproveSolicitation={(id) => {
            onApproveSolicitation(id);
            setSelectedApplicantSol(null);
          }}
          onRejectSolicitation={(id, reason) => {
            onRejectSolicitation(id, reason);
            setSelectedApplicantSol(null);
          }}
        />
      )}

      {/* Modal de Detalhes da Triagem */}
      {selectedApplicantFoster && (
        <ApplicantDetailsModal
          foster={selectedApplicantFoster}
          onClose={() => setSelectedApplicantFoster(null)}
          onAcceptFoster={(id) => {
            onAcceptFoster(id, currentOng);
            setSelectedApplicantFoster(null);
          }}
          onDeclineFoster={(id, reason) => {
            if (onDeclineFoster) {
              onDeclineFoster(id, reason);
            }
            setSelectedApplicantFoster(null);
          }}
        />
      )}

      {/* Modal de Edição Completa de Pet */}
      {editingPet && (
        <EditPetModal
          pet={editingPet}
          onClose={() => setEditingPet(null)}
          onSave={(updatedPet) => {
            if (onUpdatePet) {
              onUpdatePet(updatedPet);
            }
            setEditingPet(null);
          }}
        />
      )}
    </main>
  );
};
