import React, { useState, useEffect, lazy, Suspense } from 'react';
import { Pet, ONG, Solicitation, FosterRequest, ActiveTab, User, OngSession, Partner } from './types';
import { INITIAL_PETS, INITIAL_ONGS, INITIAL_SOLICITATIONS, INITIAL_FOSTER_REQUESTS, PARTNERS_LIST } from './data/initialData';
import { dbService } from './services/db';
import { authService } from './services/authService';

// Componentes estáticos e leves
import { Sidebar } from './components/Sidebar';
import { Footer } from './components/Footer';
import { AdoptionView } from './components/AdoptionView';

// Componentes com Code-Splitting / Lazy Loading sob demanda
const OngsView = lazy(() => import('./components/OngsView').then((m) => ({ default: m.OngsView })));
const PetDetailView = lazy(() => import('./components/PetDetailView').then((m) => ({ default: m.PetDetailView })));
const AdminDashboardView = lazy(() => import('./components/AdminDashboardView').then((m) => ({ default: m.AdminDashboardView })));
const OngDashboardView = lazy(() => import('./components/OngDashboardView').then((m) => ({ default: m.OngDashboardView })));
const UserAdoptionsView = lazy(() => import('./components/UserAdoptionsView').then((m) => ({ default: m.UserAdoptionsView })));
const FosterFormView = lazy(() => import('./components/FosterFormView').then((m) => ({ default: m.FosterFormView })));
const AboutView = lazy(() => import('./components/AboutView').then((m) => ({ default: m.AboutView })));

// Modais carregados sob demanda
const AdoptionInterestModal = lazy(() => import('./components/AdoptionInterestModal').then((m) => ({ default: m.AdoptionInterestModal })));
const IndicarOngModal = lazy(() => import('./components/Modals').then((m) => ({ default: m.IndicarOngModal })));
const AuthModal = lazy(() => import('./components/Modals').then((m) => ({ default: m.AuthModal })));
const ApoioPixModal = lazy(() => import('./components/Modals').then((m) => ({ default: m.ApoioPixModal })));
const FosterDetailsModal = lazy(() => import('./components/Modals').then((m) => ({ default: m.FosterDetailsModal })));
const ProfileAnalysisModal = lazy(() => import('./components/Modals').then((m) => ({ default: m.ProfileAnalysisModal })));
const AccountSecurityModal = lazy(() => import('./components/AccountSecurityModal').then((m) => ({ default: m.AccountSecurityModal })));

// Skeleton de carregamento leve e moderno
const ViewSkeleton = () => (
  <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 md:px-12 lg:px-16 py-10 w-full animate-pulse space-y-6">
    <div className="h-8 bg-[#e2e8f0] dark:bg-[#162230] rounded-2xl w-1/3" />
    <div className="h-4 bg-[#e2e8f0] dark:bg-[#162230] rounded-xl w-2/3" />
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 pt-4">
      <div className="h-64 bg-[#e2e8f0] dark:bg-[#162230] rounded-3xl" />
      <div className="h-64 bg-[#e2e8f0] dark:bg-[#162230] rounded-3xl" />
      <div className="h-64 bg-[#e2e8f0] dark:bg-[#162230] rounded-3xl" />
    </div>
  </main>
);

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('adotar');
  const [selectedPet, setSelectedPet] = useState<Pet | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);

  // Dois sistemas de autenticação 100% independentes
  const [currentUser, setCurrentUser] = useState<User | null>(() => authService.getCurrentUser());
  const [currentOng, setCurrentOng] = useState<OngSession | null>(() => authService.getCurrentOngSession());

  // Dados dinâmicos do MatchPet
  const [pets, setPets] = useState<Pet[]>([]);
  const [ongs, setOngs] = useState<ONG[]>([]);
  const [solicitations, setSolicitations] = useState<Solicitation[]>([]);
  const [fosterRequests, setFosterRequests] = useState<FosterRequest[]>([]);
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Carregar dados e inicializar banco
  useEffect(() => {
    async function loadData() {
      try {
        await authService.init();

        const [loadedPets, loadedOngs, loadedSols, loadedFosters, loadedPartners] = await Promise.all([
          dbService.getPets(),
          dbService.getOngs(),
          dbService.getSolicitations(),
          dbService.getFosterRequests(),
          dbService.getPartners()
        ]);
        setPets(loadedPets);
        setOngs(loadedOngs);
        setSolicitations(loadedSols);
        setFosterRequests(loadedFosters);
        setPartners(loadedPartners);
      } catch (err) {
        console.error('Erro ao carregar dados do MatchPet:', err);
        setPets(INITIAL_PETS);
        setOngs(INITIAL_ONGS);
        setSolicitations(INITIAL_SOLICITATIONS);
        setFosterRequests(INITIAL_FOSTER_REQUESTS);
        setPartners(PARTNERS_LIST);
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
  const [showSecurityModal, setShowSecurityModal] = useState<boolean>(false);
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
    if (session.role === 'admin') {
      setActiveTab('painel-admin');
      triggerToast('Acesso de Administrador concedido.');
    } else {
      setActiveTab('painel-ong');
      triggerToast(`Painel da ONG "${session.name}" liberado.`);
    }
    setAuthModalProfile(null);
  };

  // Handlers de Pets
  const handleToggleFavorite = async (petId: string) => {
    const updated = await dbService.toggleFavorite(petId);
    setPets((prev) => prev.map((p) => (p.id === petId ? { ...p, favorite: updated.favorite } : p)));
    if (selectedPet && selectedPet.id === petId) {
      setSelectedPet((prev) => (prev ? { ...prev, favorite: updated.favorite } : null));
    }
  };

  const handleAddPet = async (petData: Partial<Pet>) => {
    try {
      const newPet = await dbService.createPet(petData);
      setPets((prev) => [newPet, ...prev]);
      triggerToast(`Pet "${newPet.name}" cadastrado com sucesso!`);
    } catch (e: any) {
      triggerToast(e?.message || 'Erro ao cadastrar pet.');
    }
  };

  const handleUpdatePet = async (petData: Pet) => {
    try {
      const updated = await dbService.updatePet(petData);
      setPets((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
      if (selectedPet?.id === updated.id) {
        setSelectedPet(updated);
      }
      triggerToast(`Dados de "${updated.name}" atualizados com sucesso!`);
    } catch (e: any) {
      triggerToast(e?.message || 'Erro ao atualizar pet.');
    }
  };

  const handleDeletePet = async (petId: string) => {
    try {
      await dbService.deletePet(petId);
      setPets((prev) => prev.filter((p) => p.id !== petId));
      if (selectedPet?.id === petId) {
        setSelectedPet(null);
      }
      triggerToast('Animal removido do catálogo.');
    } catch (e: any) {
      triggerToast(e?.message || 'Erro ao remover pet.');
    }
  };

  const handleUpdatePetStatus = async (petId: string, newStatus: 'Disponível' | 'Em Processo' | 'Adotado') => {
    try {
      const targetPet = pets.find((p) => p.id === petId);
      if (!targetPet) return;
      const updated = await dbService.updatePet({ ...targetPet, status: newStatus });
      setPets((prev) => prev.map((p) => (p.id === petId ? updated : p)));
      if (selectedPet?.id === petId) {
        setSelectedPet(updated);
      }
      triggerToast(`Status do pet atualizado para: ${newStatus}`);
    } catch (e: any) {
      triggerToast(e?.message || 'Erro ao atualizar status.');
    }
  };

  // Handlers de Solicitações e Adoção
  const handleAddSolicitation = async (solData: Partial<Solicitation>) => {
    try {
      const newSol = await dbService.createSolicitation(solData);
      setSolicitations((prev) => [newSol, ...prev]);
      setPetForInterestModal(null);
      triggerToast(`Manifestação de interesse registrada! Protocolo #${newSol.id.slice(-6)}`);
    } catch (e: any) {
      triggerToast(e?.message || 'Erro ao registrar interesse.');
    }
  };

  const handleApproveSolicitation = async (solicitationId: string) => {
    try {
      const updatedSol = await dbService.approveSolicitation(solicitationId);
      setSolicitations((prev) => prev.map((s) => (s.id === solicitationId ? updatedSol : s)));
      // Atualiza o pet para Adotado
      if (updatedSol.petId) {
        setPets((prev) =>
          prev.map((p) => (p.id === updatedSol.petId ? { ...p, status: 'Adotado' } : p))
        );
      }
      triggerToast(`Adoção concedida com sucesso para o pet "${updatedSol.petName}"! 🎉`);
    } catch (e: any) {
      triggerToast(e?.message || 'Erro ao aprovar solicitação.');
    }
  };

  const handleRejectSolicitation = async (solicitationId: string, reason?: string) => {
    try {
      const updatedSol = await dbService.rejectSolicitation(solicitationId, reason);
      setSolicitations((prev) => prev.map((s) => (s.id === solicitationId ? updatedSol : s)));
      triggerToast('Solicitação recusada e histórico atualizado.');
    } catch (e: any) {
      triggerToast(e?.message || 'Erro ao recusar solicitação.');
    }
  };

  const handleCancelSolicitation = async (solicitationId: string) => {
    try {
      await dbService.cancelSolicitation(solicitationId);
      setSolicitations((prev) =>
        prev.map((s) => (s.id === solicitationId ? { ...s, status: 'canceled' as const } : s))
      );
      triggerToast('Processo de interesse cancelado.');
    } catch (e: any) {
      triggerToast(e?.message || 'Erro ao cancelar processo.');
    }
  };

  // Handlers de Triagem e Acolhimento
  const handleAddFosterRequest = async (fosterData: Partial<FosterRequest>) => {
    try {
      const newFoster = await dbService.createFosterRequest({
        ...fosterData,
        userId: currentUser?.id,
        requesterName: fosterData.requesterName || currentUser?.name || 'Tutor Responsável',
        requesterEmail: fosterData.requesterEmail || currentUser?.email,
        phone: fosterData.phone || currentUser?.phone || '(11) 98765-4321'
      });
      setFosterRequests((prev) => [newFoster, ...prev]);
      triggerToast('Solicitação de acolhimento enviada com sucesso para as ONGs!');
    } catch (e: any) {
      triggerToast(e?.message || 'Erro ao enviar triagem.');
    }
  };

  const handleAcceptFoster = async (fosterId: string) => {
    if (!currentOng) return;
    try {
      const updatedFoster = await dbService.acceptFosterRequest(fosterId, {
        ongId: currentOng.id,
        ongName: currentOng.name,
        ongPhone: currentOng.phone || '',
        ongEmail: currentOng.email,
        ongAddress: currentOng.address || ''
      });
      setFosterRequests((prev) => prev.map((f) => (f.id === fosterId ? updatedFoster : f)));
      triggerToast(`Acolhimento aceito pela ONG ${currentOng.name}!`);
    } catch (e: any) {
      triggerToast(e?.message || 'Erro ao aceitar acolhimento.');
    }
  };

  const handleDeclineFoster = async (fosterId: string, reason?: string) => {
    try {
      const updatedFoster = await dbService.declineFosterRequest(fosterId, reason);
      setFosterRequests((prev) => prev.map((f) => (f.id === fosterId ? updatedFoster : f)));
      triggerToast('Triagem recusada.');
    } catch (e: any) {
      triggerToast(e?.message || 'Erro ao recusar triagem.');
    }
  };

  const handlePromoteFosterToCatalog = async (foster: FosterRequest) => {
    if (!currentOng) return;
    try {
      const newPet = await dbService.promoteFosterToPet(foster, currentOng);
      setPets((prev) => [newPet, ...prev]);
      setFosterRequests((prev) =>
        prev.map((f) => (f.id === foster.id ? { ...f, promotedToPetId: newPet.id } : f))
      );
      triggerToast(`Animal "${newPet.name}" promovido e publicado no catálogo! 🐾`);
    } catch (e: any) {
      triggerToast(e?.message || 'Erro ao promover animal para o catálogo.');
    }
  };

  // Indicar ONG
  const handleIndicarOng = async (ongData: Partial<ONG>) => {
    try {
      const newOng = await dbService.createOng(ongData);
      setOngs((prev) => [newOng, ...prev]);
      triggerToast('Obrigado! A ONG foi indicada e será revisada pela equipe MatchPet.');
    } catch (e: any) {
      triggerToast(e?.message || 'Erro ao indicar ONG.');
    }
  };

  const favoritesCount = pets.filter((p) => p.favorite).length;

  return (
    <div className="min-h-screen bg-[#f7f9fb] dark:bg-[#0b131b] text-[#0f172a] dark:text-[#f1f5f9] flex flex-col font-['Inter'] transition-colors duration-200">
      {/* Toast Notification Container */}
      {toastMessage && (
        <div
          role="alert"
          className="fixed top-5 right-5 z-50 bg-[#074469] dark:bg-[#121d28] text-white border border-[#2a5c82] dark:border-[#5BE29D]/40 px-5 py-3 rounded-2xl shadow-xl flex items-center gap-3 animate-in fade-in slide-in-from-top-4 duration-300 font-['Plus_Jakarta_Sans'] max-w-md"
        >
          <span className="material-symbols-outlined text-[#a0efd6] dark:text-[#5BE29D] text-2xl shrink-0">
            check_circle
          </span>
          <p className="text-xs sm:text-sm font-semibold">{toastMessage}</p>
        </div>
      )}

      {/* Sidebar Lateral */}
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setActiveTab(tab);
          setSelectedPet(null);
        }}
        currentUser={currentUser}
        currentOng={currentOng}
        favoritesCount={favoritesCount}
        onLogoutUser={handleLogoutUser}
        onLogoutOng={handleLogoutOng}
        onOpenAuth={(profile) => setAuthModalProfile(profile || 'user')}
        onOpenPixModal={() => setShowPixModal(true)}
        onOpenIndicarModal={() => setShowIndicarOngModal(true)}
        onOpenSecurityModal={() => setShowSecurityModal(true)}
      />

      {/* Cabeçalho Mobile Compacto */}
      <header className="lg:hidden sticky top-0 z-30 bg-white/95 dark:bg-[#0c1520]/95 backdrop-blur-md border-b border-[#e2e8f0] dark:border-[#1e2c3c] px-4 py-3 flex items-center justify-between shadow-2xs font-['Plus_Jakarta_Sans'] transition-colors">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-[#074469] dark:bg-[#5BE29D]/20 text-[#a0efd6] dark:text-[#5BE29D] border border-transparent dark:border-[#5BE29D]/30 flex items-center justify-center shadow-xs">
            <span className="material-symbols-outlined text-xl">pets</span>
          </div>
          <span className="font-['Plus_Jakarta_Sans'] text-xl font-extrabold text-[#074469] dark:text-white tracking-tight">
            Match<span className="text-[#126b57] dark:text-[#5BE29D]">Pet</span>
          </span>
        </div>

        <div className="flex items-center gap-2">
          {favoritesCount > 0 && (
            <span className="text-xs bg-[#ffdbc9] dark:bg-[#ffdbc9]/20 text-[#914100] dark:text-[#fdba74] font-bold px-2 py-0.5 rounded-full">
              ❤️ {favoritesCount}
            </span>
          )}
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 text-[#074469] dark:text-[#5BE29D] hover:bg-[#f1f5f9] dark:hover:bg-[#162230] rounded-xl transition-colors cursor-pointer"
            aria-label="Abrir menu de navegação"
          >
            <span className="material-symbols-outlined text-2xl">menu</span>
          </button>
        </div>
      </header>

      {/* Conteúdo Principal com Deslocamento da Sidebar no Desktop (lg:pl-72) */}
      <div className="lg:pl-72 flex flex-col min-h-screen">
        {loading ? (
          <div className="flex-grow flex items-center justify-center min-h-[50vh]">
            <div className="flex flex-col items-center gap-3">
              <div className="w-12 h-12 border-4 border-[#074469] dark:border-[#5BE29D] border-t-transparent rounded-full animate-spin" />
              <p className="font-['Plus_Jakarta_Sans'] text-sm text-[#64748b] dark:text-[#94a3b8] font-bold">
                Carregando MatchPet...
              </p>
            </div>
          </div>
        ) : (
          <>
            {/* Visualização de Detalhes do Pet */}
            {selectedPet ? (
              <Suspense fallback={<ViewSkeleton />}>
                <PetDetailView
                  pet={selectedPet}
                  onBack={() => setSelectedPet(null)}
                  onToggleFavorite={() => handleToggleFavorite(selectedPet.id)}
                  onManifestarInteresse={(pet) => {
                    setPetForInterestModal(pet);
                  }}
                />
              </Suspense>
            ) : (
              <>
                {/* ABA: ADOTAR */}
                {activeTab === 'adotar' && (
                  <AdoptionView
                    pets={pets}
                    partners={partners}
                    onSelectPet={(pet) => setSelectedPet(pet)}
                    onToggleFavorite={handleToggleFavorite}
                    onQueroAjudar={() => setActiveTab('acolhimento')}
                    onNavigateToMyAdoptions={() => setActiveTab('minhas-adocoes')}
                    activeAdoptionsCount={
                      currentUser
                        ? solicitations.filter(
                            (s) =>
                              s.userId === currentUser.id ||
                              (s.requesterEmail && s.requesterEmail.toLowerCase() === currentUser.email.toLowerCase())
                          ).length
                        : 0
                    }
                  />
                )}

                {/* ABA: ONGS PÚBLICA */}
                {activeTab === 'ongs' && (
                  <Suspense fallback={<ViewSkeleton />}>
                    <OngsView
                      ongs={ongs}
                      pets={pets}
                      onSelectPet={(pet) => setSelectedPet(pet)}
                      onOpenIndicarOng={() => setShowIndicarOngModal(true)}
                      onOpenContactOng={(ong) =>
                        triggerToast(`Contato ${ong.name}: ${ong.phone} • ${ong.email || 'contato@matchpet.ong.br'}`)
                      }
                    />
                  </Suspense>
                )}

                {/* ABA UNIFICADA: MINHAS ADOÇÕES (EXCLUSIVO PARA ADOTANTES LOGADOS) */}
                {activeTab === 'minhas-adocoes' && (
                  currentUser ? (
                    <Suspense fallback={<ViewSkeleton />}>
                      <UserAdoptionsView
                        currentUser={currentUser}
                        solicitations={solicitations}
                        fosterRequests={fosterRequests}
                        pets={pets}
                        onSelectPet={(pet) => setSelectedPet(pet)}
                        onOpenNewFoster={() => setActiveTab('acolhimento')}
                        onOpenAdoptionGallery={() => setActiveTab('adotar')}
                        onCancelSolicitation={handleCancelSolicitation}
                      />
                    </Suspense>
                  ) : (
                    <div className="flex-grow flex items-center justify-center min-h-[60vh] px-4">
                      <div className="bg-white dark:bg-[#121d28] rounded-3xl p-8 max-w-md w-full text-center border border-[#e2e8f0] dark:border-[#1e2c3c] shadow-xs">
                        <div className="w-16 h-16 bg-[#074469]/10 dark:bg-[#5BE29D]/20 text-[#074469] dark:text-[#5BE29D] rounded-2xl flex items-center justify-center mx-auto mb-4">
                          <span className="material-symbols-outlined text-3xl">lock</span>
                        </div>
                        <h2 className="font-['Plus_Jakarta_Sans'] text-2xl font-bold text-[#074469] dark:text-white mb-2">
                          Acesso do Adotante
                        </h2>
                        <p className="font-['Inter'] text-sm text-[#475569] dark:text-[#cbd5e1] mb-6">
                          Faça login na sua conta de adotante para acompanhar seus interesses, solicitações formais e triagens.
                        </p>
                        <button
                          onClick={() => setAuthModalProfile('user')}
                          className="w-full bg-[#074469] dark:bg-[#5BE29D] hover:bg-[#2a5c82] dark:hover:bg-[#48cf8b] text-white dark:text-[#063e2e] font-bold py-3.5 rounded-2xl transition-all shadow-xs cursor-pointer text-sm"
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
                    <Suspense fallback={<ViewSkeleton />}>
                      <AdminDashboardView
                        ongs={ongs}
                        pets={pets}
                        solicitations={solicitations}
                        partners={partners}
                        onOngCreated={(newOng) => {
                          setOngs((prev) => [newOng, ...prev]);
                        }}
                        onUpdateOng={(updatedOng) => {
                          setOngs((prev) => prev.map((o) => (o.id === updatedOng.id ? updatedOng : o)));
                        }}
                        onDeleteOng={(ongId) => {
                          setOngs((prev) => prev.filter((o) => o.id !== ongId));
                        }}
                        onPartnerCreated={(newPartner) => {
                          setPartners((prev) => [newPartner, ...prev]);
                        }}
                        onUpdatePartner={(updatedPartner) => {
                          setPartners((prev) =>
                            prev.map((p) => (p.id === updatedPartner.id ? updatedPartner : p))
                          );
                        }}
                        onDeletePartner={(partnerId) => {
                          setPartners((prev) => prev.filter((p) => p.id !== partnerId));
                        }}
                      />
                    </Suspense>
                  ) : (
                    <div className="flex-grow flex items-center justify-center min-h-[60vh] px-4">
                      <div className="bg-white dark:bg-[#121d28] rounded-3xl p-8 max-w-md w-full text-center border border-[#e2e8f0] dark:border-[#1e2c3c] shadow-xs">
                        <div className="w-16 h-16 bg-[#ffdad6] dark:bg-[#ba1a1a]/20 text-[#ba1a1a] dark:text-[#f87171] rounded-2xl flex items-center justify-center mx-auto mb-4">
                          <span className="material-symbols-outlined text-3xl">admin_panel_settings</span>
                        </div>
                        <h2 className="font-['Plus_Jakarta_Sans'] text-2xl font-bold text-[#074469] dark:text-white mb-2">
                          Acesso Restrito ao Administrador
                        </h2>
                        <p className="font-['Inter'] text-sm text-[#475569] dark:text-[#cbd5e1] mb-6">
                          Este painel é reservado exclusivamente para a administração do MatchPet.
                        </p>
                        <button
                          onClick={() => setAuthModalProfile('ong')}
                          className="w-full bg-[#074469] dark:bg-[#5BE29D] hover:bg-[#2a5c82] dark:hover:bg-[#48cf8b] text-white dark:text-[#063e2e] font-bold py-3.5 rounded-2xl transition-all shadow-xs cursor-pointer text-sm"
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
                    <Suspense fallback={<ViewSkeleton />}>
                      <OngDashboardView
                        currentOng={currentOng}
                        pets={pets}
                        solicitations={solicitations}
                        fosterRequests={fosterRequests}
                        onAddPet={handleAddPet}
                        onUpdatePet={handleUpdatePet}
                        onDeletePet={handleDeletePet}
                        onUpdatePetStatus={handleUpdatePetStatus}
                        onApproveSolicitation={handleApproveSolicitation}
                        onRejectSolicitation={handleRejectSolicitation}
                        onAcceptFoster={handleAcceptFoster}
                        onDeclineFoster={handleDeclineFoster}
                        onPromoteFosterToCatalog={handlePromoteFosterToCatalog}
                        onOpenFosterDetails={(foster) => setActiveFosterDetails(foster)}
                        onOpenSolicitationProfile={(sol) => setActiveSolicitationProfile(sol)}
                      />
                    </Suspense>
                  ) : (
                    <div className="flex-grow flex items-center justify-center min-h-[60vh] px-4">
                      <div className="bg-white dark:bg-[#121d28] rounded-3xl p-8 max-w-md w-full text-center border border-[#e2e8f0] dark:border-[#1e2c3c] shadow-xs">
                        <div className="w-16 h-16 bg-[#a0efd6]/50 dark:bg-[#5BE29D]/20 text-[#126b57] dark:text-[#5BE29D] rounded-2xl flex items-center justify-center mx-auto mb-4">
                          <span className="material-symbols-outlined text-3xl">domain</span>
                        </div>
                        <h2 className="font-['Plus_Jakarta_Sans'] text-2xl font-bold text-[#074469] dark:text-white mb-2">
                          Painel Exclusivo da ONG
                        </h2>
                        <p className="font-['Inter'] text-sm text-[#475569] dark:text-[#cbd5e1] mb-6">
                          Faça login com o e-mail e senha exclusivos emitidos pelo administrador para a sua ONG.
                        </p>
                        <button
                          onClick={() => setAuthModalProfile('ong')}
                          className="w-full bg-[#126b57] hover:bg-[#005141] text-white font-bold py-3.5 rounded-2xl transition-all shadow-xs cursor-pointer text-sm"
                        >
                          Entrar com Login da ONG
                        </button>
                      </div>
                    </div>
                  )
                )}

                {/* ABA: COMO APOIAR / FORMULÁRIO DE ACOLHIMENTO */}
                {activeTab === 'acolhimento' && (
                  <Suspense fallback={<ViewSkeleton />}>
                    <FosterFormView
                      onSubmit={handleAddFosterRequest}
                      onOpenPixModal={() => setShowPixModal(true)}
                      onGoToAdoption={() => setActiveTab('adotar')}
                    />
                  </Suspense>
                )}

                {/* ABA: SOBRE NÓS */}
                {activeTab === 'sobre-nos' && (
                  <Suspense fallback={<ViewSkeleton />}>
                    <AboutView
                      onGoToAdoption={() => setActiveTab('adotar')}
                      onGoToFoster={() => setActiveTab('acolhimento')}
                      onOpenPix={() => setShowPixModal(true)}
                    />
                  </Suspense>
                )}
              </>
            )}
          </>
        )}

        {/* Footer MatchPet com Carrossel de Propagandas com Drag */}
        <Footer
          partners={partners}
          onOpenApoioModal={() => setShowPixModal(true)}
          onOpenContactModal={() => triggerToast('Central de Atendimento MatchPet: suporte@matchpet.ong.br')}
        />
      </div>

      {/* Modais do Sistema com Lazy Loading e Suspense */}
      <Suspense fallback={null}>
        {petForInterestModal && (
          <AdoptionInterestModal
            pet={petForInterestModal}
            currentUser={currentUser}
            onClose={() => setPetForInterestModal(null)}
            onRequireLogin={() => {
              setPetForInterestModal(null);
              setAuthModalProfile('user');
            }}
            onGoToMyAdoptions={() => {
              setPetForInterestModal(null);
              setActiveTab('minhas-adocoes');
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

        {showSecurityModal && (
          <AccountSecurityModal
            currentUser={currentUser}
            currentOng={currentOng}
            onClose={() => setShowSecurityModal(false)}
            onSuccess={(msg) => triggerToast(msg)}
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
      </Suspense>
    </div>
  );
}
