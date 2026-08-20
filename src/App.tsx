import React, { useState, useEffect } from 'react';
import { Pet, ONG, Solicitation, FosterRequest, ActiveTab, User, OngSession } from './types';
import { INITIAL_PETS, INITIAL_ONGS, INITIAL_SOLICITATIONS, INITIAL_FOSTER_REQUESTS } from './data/initialData';
import { dbService } from './services/db';
import { authService } from './services/authService';
import {
  Navbar,
  Footer,
  AdoptionView,
  OngsView,
  PetDetailView,
  AdminDashboardView,
  OngDashboardView,
  UserAdoptionsView,
  FosterFormView,
  AboutView,
  AdoptionInterestModal,
  IndicarOngModal,
  AuthModal,
  ApoioPixModal,
  FosterDetailsModal,
  ProfileAnalysisModal
} from './components';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('adotar');
  const [selectedPet, setSelectedPet] = useState<Pet | null>(null);

  // Dois sistemas de autenticação 100% independentes
  const [currentUser, setCurrentUser] = useState<User | null>(() => authService.getCurrentUser());
  const [currentOng, setCurrentOng] = useState<OngSession | null>(() => authService.getCurrentOngSession());

  // Dados dinâmicos do MatchPet
  const [pets, setPets] = useState<Pet[]>([]);
  const [ongs, setOngs] = useState<ONG[]>([]);
  const [solicitations, setSolicitations] = useState<Solicitation[]>([]);
  const [fosterRequests, setFosterRequests] = useState<FosterRequest[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Carregar dados e inicializar banco
  useEffect(() => {
    async function loadData() {
      try {
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
        console.error('Erro ao carregar dados do MatchPet:', err);
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

  // Modais
  const [petForInterestModal, setPetForInterestModal] = useState<Pet | null>(null);
  const [showIndicarOngModal, setShowIndicarOngModal] = useState<boolean>(false);
  const [authModalProfile, setAuthModalProfile] = useState<'user' | 'ong' | null>(null);
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

  // Auth Handlers - Adotante
  const handleLogoutUser = () => {
    authService.logoutUser();
    setCurrentUser(null);
    if (activeTab === 'minhas-adocoes') {
      setActiveTab('adotar');
    }
    triggerToast('Sessão de adotante encerrada.');
  };

  // Auth Handlers - ONG / Admin
  const handleLogoutOng = () => {
    authService.logoutOng();
    setCurrentOng(null);
    if (activeTab === 'painel-ong' || activeTab === 'painel-admin') {
      setActiveTab('adotar');
    }
    triggerToast('Sessão de ONG / Admin encerrada.');
  };

  const handleUserAuthSuccess = (user: User) => {
    setCurrentUser(user);
    triggerToast(`Bem-vindo(a) ao MatchPet, ${user.name}!`);
    setAuthModalProfile(null);
  };

  const handleOngAuthSuccess = (session: OngSession) => {
    setCurrentOng(session);
    setAuthModalProfile(null);
    if (session.role === 'admin') {
      setActiveTab('painel-admin');
      triggerToast(`Painel do Administrador Geral ativado (${session.email})!`);
    } else {
      setActiveTab('painel-ong');
      triggerToast(`Painel da ONG ${session.name} acessado com sucesso!`);
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
    triggerToast(newFav ? `❤️ ${petName} adicionado aos favoritos!` : `💔 ${petName} removido dos favoritos.`);
  };

  const handleAddPet = async (newPetData: Partial<Pet>) => {
    if (!currentOng) {
      triggerToast('Apenas ONGs credenciadas podem cadastrar pets.');
      return;
    }

    const newPet: Pet = {
      id: `pet-${Date.now()}`,
      name: newPetData.name || 'Pet Sem Nome',
      species: newPetData.species || 'Cachorro',
      breed: newPetData.breed || 'SRD',
      city: newPetData.city || currentOng.city || 'São Paulo',
      state: newPetData.state || currentOng.state || 'SP',
      age: newPetData.age || '2 anos',
      ageGroup: newPetData.ageGroup || 'Adulto',
      gender: newPetData.gender || 'Macho',
      size: newPetData.size || 'Médio',
      color: newPetData.color || 'Caramelo',
      vaccination: newPetData.vaccination || 'Vacinado',
      castrated: newPetData.castrated ?? true,
      dewormed: newPetData.dewormed ?? true,
      specialNeeds: newPetData.specialNeeds ?? false,
      mainImage: newPetData.mainImage || 'https://images.unsplash.com/photo-1543466835-00a7907e9de1',
      galleryImages: newPetData.galleryImages || [],
      ongId: currentOng.id,
      ongName: currentOng.name,
      entryDate: new Date().toLocaleDateString('pt-BR'),
      status: 'Disponível',
      favorite: false
    };

    const saved = await dbService.savePet(newPet);
    setPets((prev) => [saved, ...prev]);
    triggerToast(`🐾 Pet "${saved.name}" cadastrado com sucesso para ${currentOng.name}!`);
  };

  const handleDeletePet = async (petId: string) => {
    await dbService.deletePet(petId);
    setPets((prev) => prev.filter((p) => p.id !== petId));
    triggerToast('Pet removido do cadastro com sucesso.');
  };

  const handleUpdatePetStatus = async (petId: string, status: 'Disponível' | 'Em Processo' | 'Adotado') => {
    await dbService.updatePetStatus(petId, status);
    setPets((prev) =>
      prev.map((p) => (p.id === petId ? { ...p, status } : p))
    );
    if (selectedPet && selectedPet.id === petId) {
      setSelectedPet((prev) => (prev ? { ...prev, status } : null));
    }
    triggerToast(`Status do pet atualizado para "${status}".`);
  };

  const handleAddSolicitation = async (data: {
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
      petImage: petForInterestModal.mainImage,
      requesterName: data.name,
      requesterEmail: currentUser?.email || data.email,
      userId: currentUser?.id,
      phone: data.phone,
      email: data.email,
      dateOrDetails: `${data.date}. ${data.notes}`,
      status: 'pending',
      ongId: petForInterestModal.ongId || 'ong-amigos-de-patas',
      ongName: petForInterestModal.ongName || 'ONG Parceira',
      createdAt: new Date().toISOString()
    };

    const saved = await dbService.saveSolicitation(newSolicitation);
    setSolicitations((prev) => [saved, ...prev]);
    triggerToast(`Interesse em ${petForInterestModal.name} enviado para a ONG!`);
    setPetForInterestModal(null);
  };

  const handleApproveSolicitation = async (id: string) => {
    await dbService.updateSolicitationStatus(id, 'approved');
    setSolicitations((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status: 'approved', adoptionGranted: true } : s))
    );
    triggerToast('Adoção concedida e aprovada com sucesso!');
  };

  const handleRejectSolicitation = async (id: string) => {
    await dbService.updateSolicitationStatus(id, 'rejected');
    setSolicitations((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status: 'rejected' } : s))
    );
    triggerToast('Solicitação recusada.');
  };

  const handleAddFosterRequest = async (data: Partial<FosterRequest>) => {
    const newReq: FosterRequest = {
      id: `foster-${Date.now()}`,
      petName: data.petName || 'Animal Resgatado',
      species: data.species || 'Cachorro',
      size: data.size || 'Médio',
      reason: data.reason || 'Pedido de acolhimento',
      timestamp: 'Agora',
      status: 'pending',
      photoUrl: data.photoUrl,
      requesterName: currentUser?.name || data.requesterName || 'Adotante',
      requesterEmail: currentUser?.email || data.requesterEmail,
      phone: currentUser?.phone || data.phone
    };

    const saved = await dbService.saveFosterRequest(newReq);
    setFosterRequests((prev) => [saved, ...prev]);
    triggerToast('Triagem cadastrada com sucesso! As ONGs parceiras foram notificadas.');
    if (currentUser) {
      setActiveTab('minhas-adocoes');
    } else {
      setActiveTab('adotar');
    }
  };

  const handleAcceptFoster = async (id: string, ongInfo?: OngSession) => {
    const ong = ongInfo || currentOng;
    if (!ong) {
      triggerToast('É necessário estar logado como ONG para aceitar acolhimento.');
      return;
    }

    await dbService.updateFosterStatus(id, 'accepted', {
      id: ong.id,
      name: ong.name,
      phone: ong.phone || '(11) 98765-4321',
      address: ong.address || `${ong.city} - ${ong.state}`
    });

    setFosterRequests((prev) =>
      prev.map((f) =>
        f.id === id
          ? {
              ...f,
              status: 'accepted',
              acceptedByOngId: ong.id,
              acceptedByOngName: ong.name,
              acceptedByOngPhone: ong.phone,
              acceptedByOngAddress: ong.address
            }
          : f
      )
    );
    triggerToast(`Acolhimento aceito pela sua ONG (${ong.name})!`);
  };

  const handleIndicarOng = async (ongData: Partial<ONG>) => {
    const newOng: ONG = {
      id: `ong-${Date.now()}`,
      cnpj: '00.000.000/0001-00',
      name: ongData.name || 'Nova ONG Indicada',
      city: ongData.city || 'São Paulo',
      state: ongData.state || 'SP',
      phone: ongData.phone || '(11) 90000-0000',
      description: ongData.description || 'Indicação da comunidade MatchPet.',
      image: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=800&q=80',
      petsCount: 0
    };

    const saved = await dbService.saveOng(newOng);
    setOngs((prev) => [...prev, saved]);
    triggerToast('Obrigado! A indicação da ONG foi enviada ao administrador.');
  };

  const favoritesCount = pets.filter((p) => p.favorite).length;

  return (
    <div className="min-h-screen flex flex-col bg-[#f7f9fb] text-[#191c1e] antialiased">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#074469] text-white px-5 py-3 rounded-2xl shadow-xl border border-[#a0efd6]/30 flex items-center gap-3 animate-in slide-in-from-bottom-5 duration-300 font-['Be_Vietnam_Pro'] text-sm font-semibold">
          <span className="material-symbols-outlined text-[#a0efd6]">notifications_active</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Navbar com Suporte a Dois Logins Independentes */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setSelectedPet(null);
          setActiveTab(tab);
        }}
        onOpenAuth={(prof) => setAuthModalProfile(prof || 'user')}
        favoritesCount={favoritesCount}
        currentUser={currentUser}
        currentOng={currentOng}
        onLogoutUser={handleLogoutUser}
        onLogoutOng={handleLogoutOng}
      />

      {/* Padding compensador para a fixed Navbar */}
      <div className="h-20" />

      {/* Loader Global */}
      {loading ? (
        <div className="flex-grow flex items-center justify-center min-h-[50vh]">
          <div className="flex flex-col items-center gap-3">
            <div className="w-12 h-12 border-4 border-[#074469] border-t-transparent rounded-full animate-spin" />
            <p className="font-['Be_Vietnam_Pro'] text-sm text-[#72787f] font-semibold">
              Carregando MatchPet...
            </p>
          </div>
        </div>
      ) : (
        <>
          {/* Visualização de Detalhes do Pet */}
          {selectedPet ? (
            <PetDetailView
              pet={selectedPet}
              onBack={() => setSelectedPet(null)}
              onToggleFavorite={() => handleToggleFavorite(selectedPet.id)}
              onManifestInterest={() => {
                if (!currentUser) {
                  setAuthModalProfile('user');
                  triggerToast('Faça login como adotante para manifestar interesse.');
                } else {
                  setPetForInterestModal(selectedPet);
                }
              }}
            />
          ) : (
            <>
              {/* ABA: ADOTAR */}
              {activeTab === 'adotar' && (
                <AdoptionView
                  pets={pets}
                  onSelectPet={(pet) => setSelectedPet(pet)}
                  onToggleFavorite={handleToggleFavorite}
                  onManifestInterest={(pet) => {
                    if (!currentUser) {
                      setAuthModalProfile('user');
                      triggerToast('Faça login como adotante para manifestar interesse.');
                    } else {
                      setPetForInterestModal(pet);
                    }
                  }}
                  onGoToFoster={() => setActiveTab('acolhimento')}
                />
              )}

              {/* ABA: ONGS PÚBLICA */}
              {activeTab === 'ongs' && (
                <OngsView
                  ongs={ongs}
                  pets={pets}
                  onSelectPet={(pet) => setSelectedPet(pet)}
                  onOpenIndicarOng={() => setShowIndicarOngModal(true)}
                  onOpenContactOng={(ong) =>
                    triggerToast(`Contato ${ong.name}: ${ong.phone} • ${ong.email || 'contato@matchpet.ong.br'}`)
                  }
                />
              )}

              {/* ABA UNIFICADA: MINHAS ADOÇÕES (EXCLUSIVO PARA ADOTANTES LOGADOS) */}
              {activeTab === 'minhas-adocoes' && (
                currentUser ? (
                  <UserAdoptionsView
                    currentUser={currentUser}
                    solicitations={solicitations}
                    fosterRequests={fosterRequests}
                    pets={pets}
                    onSelectPet={(pet) => setSelectedPet(pet)}
                    onOpenNewFoster={() => setActiveTab('acolhimento')}
                    onOpenAdoptionGallery={() => setActiveTab('adotar')}
                  />
                ) : (
                  <div className="flex-grow flex items-center justify-center min-h-[60vh] px-4">
                    <div className="bg-white rounded-3xl p-8 max-w-md w-full text-center border border-[#e0e3e5] shadow-xs">
                      <div className="w-16 h-16 bg-[#074469]/10 text-[#074469] rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <span className="material-symbols-outlined text-3xl">lock</span>
                      </div>
                      <h2 className="font-['Plus_Jakarta_Sans'] text-2xl font-bold text-[#074469] mb-2">
                        Acesso do Adotante
                      </h2>
                      <p className="font-['Be_Vietnam_Pro'] text-sm text-[#41474e] mb-6">
                        Faça login na sua conta de adotante para acompanhar seus interesses, solicitações formais e triagens.
                      </p>
                      <button
                        onClick={() => setAuthModalProfile('user')}
                        className="w-full bg-[#074469] hover:bg-[#2a5c82] text-white font-bold py-3 rounded-xl transition-all shadow-sm cursor-pointer text-sm"
                      >
                        Entrar como Adotante
                      </button>
                    </div>
                  </div>
                )
              )}

              {/* ABA: PAINEL DO ADMINISTRADOR (EXCLUSIVO PARA ADMIN) */}
              {activeTab === 'painel-admin' && (
                currentOng?.role === 'admin' ? (
                  <AdminDashboardView
                    ongs={ongs}
                    pets={pets}
                    solicitations={solicitations}
                    onOngCreated={(newOng) => {
                      setOngs((prev) => [newOng, ...prev]);
                    }}
                    onUpdateOng={(updatedOng) => {
                      setOngs((prev) => prev.map((o) => (o.id === updatedOng.id ? updatedOng : o)));
                    }}
                    onDeleteOng={(ongId) => {
                      setOngs((prev) => prev.filter((o) => o.id !== ongId));
                    }}
                  />
                ) : (
                  <div className="flex-grow flex items-center justify-center min-h-[60vh] px-4">
                    <div className="bg-white rounded-3xl p-8 max-w-md w-full text-center border border-[#e0e3e5] shadow-xs">
                      <div className="w-16 h-16 bg-[#ffdad6] text-[#ba1a1a] rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <span className="material-symbols-outlined text-3xl">admin_panel_settings</span>
                      </div>
                      <h2 className="font-['Plus_Jakarta_Sans'] text-2xl font-bold text-[#074469] mb-2">
                        Acesso Restrito ao Administrador
                      </h2>
                      <p className="font-['Be_Vietnam_Pro'] text-sm text-[#41474e] mb-6">
                        Este painel é reservado exclusivamente para a administração do MatchPet.
                      </p>
                      <button
                        onClick={() => setAuthModalProfile('ong')}
                        className="w-full bg-[#074469] hover:bg-[#2a5c82] text-white font-bold py-3 rounded-xl transition-all shadow-sm cursor-pointer text-sm"
                      >
                        Entrar com Credenciais de Admin
                      </button>
                    </div>
                  </div>
                )
              )}

              {/* ABA: PAINEL DA ONG (ISOLAMENTO ESTRITO POR ONG) */}
              {activeTab === 'painel-ong' && (
                currentOng?.role === 'ong' ? (
                  <OngDashboardView
                    currentOng={currentOng}
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
                  <div className="flex-grow flex items-center justify-center min-h-[60vh] px-4">
                    <div className="bg-white rounded-3xl p-8 max-w-md w-full text-center border border-[#e0e3e5] shadow-xs">
                      <div className="w-16 h-16 bg-[#a0efd6] text-[#126b57] rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <span className="material-symbols-outlined text-3xl">domain</span>
                      </div>
                      <h2 className="font-['Plus_Jakarta_Sans'] text-2xl font-bold text-[#074469] mb-2">
                        Painel Exclusivo da ONG
                      </h2>
                      <p className="font-['Be_Vietnam_Pro'] text-sm text-[#41474e] mb-6">
                        Faça login com o e-mail e senha exclusivos emitidos pelo administrador para a sua ONG.
                      </p>
                      <button
                        onClick={() => setAuthModalProfile('ong')}
                        className="w-full bg-[#126b57] hover:bg-[#005141] text-white font-bold py-3 rounded-xl transition-all shadow-sm cursor-pointer text-sm"
                      >
                        Entrar com Login da ONG
                      </button>
                    </div>
                  </div>
                )
              )}

              {/* ABA: COMO APOIAR / FORMULÁRIO DE ACOLHIMENTO */}
              {activeTab === 'acolhimento' && (
                <FosterFormView
                  onSubmit={handleAddFosterRequest}
                  onOpenPixModal={() => setShowPixModal(true)}
                  onGoToAdoption={() => setActiveTab('adotar')}
                />
              )}

              {/* ABA: SOBRE NÓS */}
              {activeTab === 'sobre-nos' && (
                <AboutView
                  onGoToAdoption={() => setActiveTab('adotar')}
                  onGoToFoster={() => setActiveTab('acolhimento')}
                  onOpenPix={() => setShowPixModal(true)}
                />
              )}
            </>
          )}
        </>
      )}

      {/* Footer MatchPet */}
      <Footer
        onOpenApoioModal={() => setShowPixModal(true)}
        onOpenContactModal={() => triggerToast('Central de Atendimento MatchPet: suporte@matchpet.ong.br')}
      />

      {/* Modais do Sistema */}
      {petForInterestModal && (
        <AdoptionInterestModal
          pet={petForInterestModal}
          currentUser={currentUser}
          onClose={() => setPetForInterestModal(null)}
          onRequireLogin={() => {
            setPetForInterestModal(null);
            setAuthModalProfile('user');
          }}
          onSubmit={handleAddSolicitation}
        />
      )}

      {showIndicarOngModal && (
        <IndicarOngModal
          onClose={() => setShowIndicarOngModal(false)}
          onSubmit={handleIndicarOng}
        />
      )}

      {authModalProfile && (
        <AuthModal
          defaultProfile={authModalProfile}
          onClose={() => setAuthModalProfile(null)}
          onUserSuccess={handleUserAuthSuccess}
          onOngSuccess={handleOngAuthSuccess}
        />
      )}

      {showPixModal && (
        <ApoioPixModal onClose={() => setShowPixModal(false)} />
      )}

      {activeFosterDetails && (
        <FosterDetailsModal
          request={activeFosterDetails}
          onClose={() => setActiveFosterDetails(null)}
          onAccept={() => {
            handleAcceptFoster(activeFosterDetails.id);
            setActiveFosterDetails(null);
          }}
        />
      )}

      {activeSolicitationProfile && (
        <ProfileAnalysisModal
          solicitation={activeSolicitationProfile}
          onClose={() => setActiveSolicitationProfile(null)}
          onApprove={() => {
            handleApproveSolicitation(activeSolicitationProfile.id);
            setActiveSolicitationProfile(null);
          }}
        />
      )}
    </div>
  );
}
