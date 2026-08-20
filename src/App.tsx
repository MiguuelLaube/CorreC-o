import React, { useState, useEffect } from 'react';
import { Pet, ONG, Solicitation, FosterRequest, ActiveTab } from './types';
import { INITIAL_PETS, INITIAL_ONGS, INITIAL_SOLICITATIONS, INITIAL_FOSTER_REQUESTS } from './data/initialData';
import { dbService } from './services/db';
import { isSupabaseConfigured } from './lib/supabase';
import {
  Navbar,
  Footer,
  AdoptionView,
  OngsView,
  PetDetailView,
  OngDashboardView,
  FosterFormView,
  AboutView,
  AdoptionInterestModal,
  IndicarOngModal,
  AuthModal,
  ApoioPixModal,
  FosterDetailsModal,
  ProfileAnalysisModal,
} from './components';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('adotar');
  const [selectedPet, setSelectedPet] = useState<Pet | null>(null);

  // Core dynamic state
  const [pets, setPets] = useState<Pet[]>([]);
  const [ongs, setOngs] = useState<ONG[]>([]);
  const [solicitations, setSolicitations] = useState<Solicitation[]>([]);
  const [fosterRequests, setFosterRequests] = useState<FosterRequest[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Carregar dados persistidos do Banco de Dados / Storage
  useEffect(() => {
    async function loadData() {
      try {
        const [loadedPets, loadedOngs, loadedSols, loadedFosters] = await Promise.all([
          dbService.getPets(),
          dbService.getOngs(),
          dbService.getSolicitations(),
          dbService.getFosterRequests()
        ]);
        setPets(loadedPets);
        setOngs(loadedOngs);
        setSolicitations(loadedSols);
        setFosterRequests(loadedFosters);
      } catch (err) {
        console.error('Erro ao carregar dados do banco:', err);
        setPets(INITIAL_PETS);
        setOngs(INITIAL_ONGS);
        setSolicitations(INITIAL_SOLICITATIONS);
        setFosterRequests(INITIAL_FOSTER_REQUESTS);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // Modals state
  const [petForInterestModal, setPetForInterestModal] = useState<Pet | null>(null);
  const [showIndicarOngModal, setShowIndicarOngModal] = useState<boolean>(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register' | null>(null);
  const [showPixModal, setShowPixModal] = useState<boolean>(false);
  const [activeFosterDetails, setActiveFosterDetails] = useState<FosterRequest | null>(null);
  const [activeSolicitationProfile, setActiveSolicitationProfile] = useState<Solicitation | null>(null);

  // Toast feedback state
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Handlers
  const handleToggleFavorite = async (petId: string) => {
    const newFav = await dbService.toggleFavorite(petId);
    setPets((prev) =>
      prev.map((p) => (p.id === petId ? { ...p, favorite: newFav } : p))
    );
    if (selectedPet && selectedPet.id === petId) {
      setSelectedPet((prev) => (prev ? { ...prev, favorite: newFav } : null));
    }
    const petName = pets.find((p) => p.id === petId)?.name || 'Pet';
    triggerToast(newFav ? `Adicionado aos favoritos: ${petName}` : `Removido dos favoritos: ${petName}`);
  };

  const handleSelectPet = (pet: Pet) => {
    setSelectedPet(pet);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToAdoption = () => {
    setSelectedPet(null);
  };

  const handleAddPet = async (newPetData: Partial<Pet>) => {
    const id = `pet-${Date.now()}`;
    const fullPet: Pet = {
      id,
      name: newPetData.name || 'Novo Pet',
      species: newPetData.species || 'Cachorro',
      breed: newPetData.breed || 'SRD',
      city: newPetData.city || 'São Paulo',
      state: newPetData.state || 'SP',
      age: newPetData.age || '1 ano',
      ageGroup: newPetData.ageGroup || 'Adulto',
      gender: newPetData.gender || 'Macho',
      size: newPetData.size || 'Médio',
      color: newPetData.color || 'Dourado',
      vaccination: newPetData.vaccination || 'Em dia',
      castrated: newPetData.castrated ?? true,
      dewormed: true,
      temperament: newPetData.temperament || ['Dócil', 'Amoroso'],
      mainImage:
        newPetData.mainImage ||
        'https://lh3.googleusercontent.com/aida-public/AB6AXuBhmoZIYpAE2ONKirfuZcJWXqW3qZR3OY3bnMbiokAo1HYJX9bKCG_qk1I9SQDZhnWo0LNDGRdC2mkO0TVKZMqCBozPVz80yuk1ggFOsSPsDdzP1MlIElifQ4JD8fXaot92LJWBKulWKZ9YXj-8rIMEId3I5sEEXxl-DXerG0kVX3YwX9YVsF45CG4_-VTgTLEfTwQzmtZ1Ygt6lkDxelsUSXrUXW6oNpu9dLeeaJwJlMJPOlnHu8leKQ',
      galleryImages: [],
      story: newPetData.story || ['Animalzinho resgatado com muito carinho procurando um novo lar.'],
      ongId: newPetData.ongId || 'amigos-de-patas',
      ongName: newPetData.ongName || 'ONG Amigo Fiel',
      entryDate: new Date().toLocaleDateString('pt-BR'),
      status: 'Disponível',
      favorite: false
    };

    await dbService.savePet(fullPet);
    setPets((prev) => [fullPet, ...prev]);
    triggerToast(`Pet ${fullPet.name} salvo no banco de dados com sucesso!`);
  };

  const handleDeletePet = async (petId: string) => {
    await dbService.deletePet(petId);
    setPets((prev) => prev.filter((p) => p.id !== petId));
    triggerToast('Pet removido do banco de dados.');
  };

  const handleUpdatePetStatus = async (
    petId: string,
    status: 'Disponível' | 'Em Processo' | 'Adotado'
  ) => {
    await dbService.updatePetStatus(petId, status);
    setPets((prev) =>
      prev.map((p) => (p.id === petId ? { ...p, status } : p))
    );
    triggerToast(`Status do pet atualizado para: ${status}`);
  };

  const handleAdoptionInterestSubmit = async (data: {
    name: string;
    phone: string;
    email: string;
    date: string;
    notes: string;
  }) => {
    if (!petForInterestModal) return;

    const newSolicitation: Solicitation = {
      id: `sol-${Date.now()}`,
      type: 'Visita',
      petId: petForInterestModal.id,
      petName: petForInterestModal.name,
      requesterName: data.name,
      dateOrDetails: `${data.date} (${data.notes})`,
      status: 'pending',
      phone: data.phone,
      email: data.email
    };

    await dbService.saveSolicitation(newSolicitation);
    setSolicitations((prev) => [newSolicitation, ...prev]);
    triggerToast(`Visita agendada e salva no banco para conhecer ${petForInterestModal.name}!`);
  };

  const handleIndicarOngSubmit = async (newOng: Partial<ONG>) => {
    const id = `ong-${Date.now()}`;
    const fullOng: ONG = {
      id,
      name: newOng.name || 'Nova ONG Parceira',
      city: newOng.city || 'São Paulo',
      state: newOng.state || 'SP',
      phone: newOng.phone || '(11) 90000-0000',
      image:
        newOng.image ||
        'https://lh3.googleusercontent.com/aida-public/AB6AXuCeLWHs24XaUcWLidTvmpWuyCMw79Zvw3YtCMtvI7QR2MEDwN0zEEk7pBgnaXtzl3m-Ow18esAG9DeT1_Loqm8j6moJmSbj0oF_-aB6alzR1XWIn_UZOKA3kl7fCPNLN6TzmJidMgALYrc-JHjx4_ycMy5pTvzEwjjACU7aeSp6LncJsSlsfJsqdI10izFuoaQbL-UyOyNSmFMS-HR4Y_MSAEyxsF4F_VIM0YoiuWNBBFBhKrJCKWDkkg',
      description: newOng.description || 'Instituição dedicada ao resgate e bem-estar animal.',
      petsCount: 12
    };

    await dbService.saveOng(fullOng);
    setOngs((prev) => [...prev, fullOng]);
    triggerToast(`ONG ${fullOng.name} cadastrada e salva com sucesso!`);
  };

  const handleFosterSubmit = async (data: Omit<FosterRequest, 'id' | 'timestamp' | 'status'>) => {
    const newFoster: FosterRequest = {
      id: `foster-${Date.now()}`,
      petName: data.petName,
      species: data.species,
      reason: data.reason,
      requesterName: data.requesterName,
      phone: data.phone,
      timestamp: 'Hoje, ' + new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      status: 'pending',
      photoUrl: data.photoUrl
    };

    await dbService.saveFosterRequest(newFoster);
    setFosterRequests((prev) => [newFoster, ...prev]);
    triggerToast('Solicitação de acolhimento gravada no banco de dados!');
  };

  const handleApproveSolicitation = async (id: string) => {
    await dbService.updateSolicitationStatus(id, 'approved');
    setSolicitations((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status: 'approved' } : s))
    );
    triggerToast('Solicitação aprovada e atualizada no banco!');
  };

  const handleRejectSolicitation = async (id: string) => {
    await dbService.updateSolicitationStatus(id, 'rejected');
    setSolicitations((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status: 'rejected' } : s))
    );
    triggerToast('Solicitação recusada e atualizada no banco.');
  };

  const handleAcceptFoster = async (id: string) => {
    await dbService.updateFosterStatus(id, 'accepted');
    setFosterRequests((prev) =>
      prev.map((f) => (f.id === id ? { ...f, status: 'accepted' } : f))
    );
    triggerToast('Acolhimento aceito e salvo no banco!');
  };

  const favoritesCount = pets.filter((p) => p.favorite).length;

  return (
    <div className="min-h-screen flex flex-col bg-[#f7f9fb] text-[#191c1e] antialiased">
      {/* Top Navigation Bar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setSelectedPet(null);
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenAuth={(mode) => setAuthModalMode(mode)}
        favoritesCount={favoritesCount}
      />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#074469] text-white px-5 py-3 rounded-xl shadow-xl flex items-center gap-2 font-['Be_Vietnam_Pro'] text-sm animate-in slide-in-from-bottom duration-300">
          <span className="material-symbols-outlined text-[#a0efd6] text-lg">info</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Views Router */}
      <div className="pt-20 flex-grow flex flex-col">
        {selectedPet ? (
          <PetDetailView
            pet={selectedPet}
            onBack={handleBackToAdoption}
            onToggleFavorite={handleToggleFavorite}
            onManifestarInteresse={(pet) => setPetForInterestModal(pet)}
          />
        ) : (
          <>
            {activeTab === 'adotar' && (
              <AdoptionView
                pets={pets}
                onSelectPet={handleSelectPet}
                onToggleFavorite={handleToggleFavorite}
                onQueroAjudar={() => setActiveTab('acolhimento')}
              />
            )}

            {activeTab === 'ongs' && (
              <OngsView
                ongs={ongs}
                pets={pets}
                onSelectPet={handleSelectPet}
                onOpenIndicarOng={() => setShowIndicarOngModal(true)}
                onOpenContactOng={(ong) => {
                  triggerToast(`Contato da ${ong.name}: ${ong.phone}`);
                }}
              />
            )}

            {activeTab === 'acolhimento' && (
              <FosterFormView
                onSubmitFoster={handleFosterSubmit}
                onGoBack={() => setActiveTab('adotar')}
              />
            )}

            {activeTab === 'painel-ong' && (
              <OngDashboardView
                pets={pets}
                solicitations={solicitations}
                fosterRequests={fosterRequests}
                onAddPet={handleAddPet}
                onDeletePet={handleDeletePet}
                onUpdatePetStatus={handleUpdatePetStatus}
                onApproveSolicitation={handleApproveSolicitation}
                onRejectSolicitation={handleRejectSolicitation}
                onAcceptFoster={handleAcceptFoster}
                onOpenFosterDetails={(foster) => setActiveFosterDetails(foster)}
                onOpenSolicitationProfile={(sol) => setActiveSolicitationProfile(sol)}
              />
            )}

            {activeTab === 'sobre-nos' && (
              <AboutView
                onGoToAdoption={() => setActiveTab('adotar')}
                onGoToFoster={() => setActiveTab('acolhimento')}
                onOpenPix={() => setShowPixModal(true)}
              />
            )}
          </>
        )}
      </div>

      {/* Footer */}
      <Footer
        onOpenApoioModal={() => setShowPixModal(true)}
        onOpenContactModal={() => triggerToast('Central de Atendimento CorrenteCão: suporte@correntecao.ong.br')}
      />

      {/* Modals Container */}
      {petForInterestModal && (
        <AdoptionInterestModal
          pet={petForInterestModal}
          onClose={() => setPetForInterestModal(null)}
          onSubmit={handleAdoptionInterestSubmit}
        />
      )}

      {showIndicarOngModal && (
        <IndicarOngModal
          onClose={() => setShowIndicarOngModal(false)}
          onSubmit={handleIndicarOngSubmit}
        />
      )}

      {authModalMode && (
        <AuthModal
          mode={authModalMode}
          onClose={() => setAuthModalMode(null)}
        />
      )}

      {showPixModal && (
        <ApoioPixModal onClose={() => setShowPixModal(false)} />
      )}

      {activeFosterDetails && (
        <FosterDetailsModal
          request={activeFosterDetails}
          onClose={() => setActiveFosterDetails(null)}
          onAccept={() => handleAcceptFoster(activeFosterDetails.id)}
        />
      )}

      {activeSolicitationProfile && (
        <ProfileAnalysisModal
          solicitation={activeSolicitationProfile}
          onClose={() => setActiveSolicitationProfile(null)}
          onApprove={() => handleApproveSolicitation(activeSolicitationProfile.id)}
        />
      )}
    </div>
  );
}
