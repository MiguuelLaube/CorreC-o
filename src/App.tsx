import React, { useState, useEffect } from 'react';
import { Pet, ONG, Solicitation, FosterRequest, ActiveTab, User } from './types';
import { INITIAL_PETS, INITIAL_ONGS, INITIAL_SOLICITATIONS, INITIAL_FOSTER_REQUESTS } from './data/initialData';
import { dbService } from './services/db';
import { authService } from './services/authService';
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

  // Authentication State
  const [currentUser, setCurrentUser] = useState<User | null>(() => authService.getCurrentUser());

  // Core dynamic state
  const [pets, setPets] = useState<Pet[]>([]);
  const [ongs, setOngs] = useState<ONG[]>([]);
  const [solicitations, setSolicitations] = useState<Solicitation[]>([]);
  const [fosterRequests, setFosterRequests] = useState<FosterRequest[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Carregar dados persistidos e inicializar conta admin
  useEffect(() => {
    async function loadData() {
      try {
        // Inicializa a conta de administrador no banco (se necessário)
        await authService.init();

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

  // Auth Handlers
  const handleLogout = () => {
    authService.logout();
    setCurrentUser(null);
    if (activeTab === 'painel-ong') {
      setActiveTab('adotar');
    }
    triggerToast('Você encerrou a sessão.');
  };

  const handleAuthSuccess = (user: User) => {
    setCurrentUser(user);
    if (user.role === 'admin') {
      triggerToast(`Bem-vindo, Administrador (${user.email})! Painel liberado.`);
    } else {
      triggerToast(`Bem-vindo(a), ${user.name}!`);
    }
  };

  // Handlers de dados
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
  const isAdmin = currentUser?.role === 'admin';

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
        currentUser={currentUser}
        onLogout={handleLogout}
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

            {/* CONTROLE DE ACESSO DO PAINEL ONG / ADMINISTRATIVO */}
            {activeTab === 'painel-ong' && (
              isAdmin ? (
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
              ) : (
                <div className="max-w-4xl mx-auto px-4 py-16 text-center my-auto">
                  <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-[#e0e3e5] max-w-lg mx-auto">
                    <div className="w-20 h-20 bg-[#ffdad6] text-[#ba1a1a] rounded-2xl flex items-center justify-center mx-auto mb-5">
                      <span className="material-symbols-outlined text-4xl">lock</span>
                    </div>
                    <span className="bg-[#ffdad6] text-[#93000a] text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                      Acesso Restrito
                    </span>
                    <h2 className="font-['Plus_Jakarta_Sans'] text-2xl md:text-3xl font-bold text-[#074469] mt-4 mb-2">
                      Painel Administrativo da ONG
                    </h2>
                    <p className="font-['Be_Vietnam_Pro'] text-sm text-[#41474e] mb-6 leading-relaxed">
                      Esta área é de acesso exclusivo para o perfil de administrador (<strong>admin@gmail.com</strong>). Contas de usuários comuns e visitantes não têm permissão para acessar esta seção.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-3 justify-center font-['Be_Vietnam_Pro'] text-sm">
                      <button
                        onClick={() => setActiveTab('adotar')}
                        className="bg-[#f2f4f6] hover:bg-[#e0e3e5] text-[#191c1e] font-semibold px-5 py-2.5 rounded-xl transition-colors cursor-pointer"
                      >
                        Voltar para Adoção
                      </button>
                      <button
                        onClick={() => setAuthModalMode('login')}
                        className="bg-[#074469] hover:bg-[#2a5c82] text-white font-bold px-5 py-2.5 rounded-xl transition-colors shadow-sm cursor-pointer flex items-center justify-center gap-2"
                      >
                        <span className="material-symbols-outlined text-base">login</span>
                        Entrar como Administrador
                      </button>
                    </div>
                  </div>
                </div>
              )
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
          onSuccess={handleAuthSuccess}
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
