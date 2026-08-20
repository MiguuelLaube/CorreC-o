import { Pet, ONG, Solicitation, FosterRequest, Partner } from '../types';
import { INITIAL_PETS, INITIAL_ONGS, INITIAL_SOLICITATIONS, INITIAL_FOSTER_REQUESTS, PARTNERS_LIST } from '../data/initialData';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

const STORAGE_KEYS = {
  PETS: 'correntecao_pets',
  ONGS: 'correntecao_ongs',
  SOLICITATIONS: 'correntecao_solicitations',
  FOSTER_REQUESTS: 'correntecao_foster_requests',
  PARTNERS: 'correntecao_partners',
  INITIALIZED: 'correntecao_initialized_v2'
};

// ==========================================
// Helpers de Local Storage (Persistência Offline/Cache)
// ==========================================
function getLocal<T>(key: string, defaultValue: T): T {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error(`Erro ao ler localStorage (${key}):`, error);
    return defaultValue;
  }
}

function setLocal<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Erro ao salvar no localStorage (${key}):`, error);
  }
}

function ensureLocalInitialized(): void {
  if (!localStorage.getItem(STORAGE_KEYS.INITIALIZED)) {
    setLocal(STORAGE_KEYS.PETS, INITIAL_PETS);
    setLocal(STORAGE_KEYS.ONGS, INITIAL_ONGS);
    setLocal(STORAGE_KEYS.SOLICITATIONS, INITIAL_SOLICITATIONS);
    setLocal(STORAGE_KEYS.FOSTER_REQUESTS, INITIAL_FOSTER_REQUESTS);
    setLocal(STORAGE_KEYS.PARTNERS, PARTNERS_LIST);
    localStorage.setItem(STORAGE_KEYS.INITIALIZED, 'true');
  }
}

// Inicializar na carga do módulo
if (typeof window !== 'undefined') {
  ensureLocalInitialized();
}

// ==========================================
// Mapeadores Supabase <-> TypeScript
// ==========================================
function mapPetFromSupabase(row: any): Pet {
  return {
    id: String(row.id),
    name: row.name || row.nome || '',
    species: (row.species || (row.especie === 'cao' ? 'Cachorro' : row.especie === 'gato' ? 'Gato' : 'Cachorro')) as any,
    breed: row.breed || 'SRD',
    city: row.city || 'São Paulo',
    state: row.state || 'SP',
    age: row.age || (row.idade_aproximada ? `${row.idade_aproximada}` : '2 anos'),
    ageGroup: (row.age_group || (row.idade_aproximada === 'filhote' ? 'Filhote' : row.idade_aproximada === 'idoso' ? 'Idoso' : 'Adulto')) as any,
    gender: (row.gender || (row.genero === 'macho' ? 'Macho' : 'Fêmea')) as any,
    size: (row.size || (row.porte === 'pequeno' ? 'Pequeno' : row.porte === 'grande' ? 'Grande' : 'Médio')) as any,
    color: row.color || row.cor || 'Caramelo',
    vaccination: row.vaccination || (row.vacinado ? 'Vacinado' : 'Pendente'),
    castrated: Boolean(row.castrated ?? row.castrado),
    dewormed: Boolean(row.dewormed ?? true),
    specialNeeds: Boolean(row.special_needs ?? false),
    mainImage: row.main_image || (row.fotos && row.fotos[0]) || 'https://images.unsplash.com/photo-1543466835-00a7907e9de1',
    galleryImages: row.gallery_images || (row.fotos ? row.fotos.slice(1) : []),
    ongId: String(row.ong_id || 'amigos-de-patas'),
    ongName: row.ong_name || 'ONG Amigo Fiel',
    entryDate: row.entry_date || new Date().toLocaleDateString('pt-BR'),
    status: (row.status === 'disponivel' ? 'Disponível' : row.status === 'em_processo' ? 'Em Processo' : row.status === 'adotado' ? 'Adotado' : (row.status || 'Disponível')) as any,
    favorite: Boolean(row.favorite)
  };
}

function mapPetToSupabase(pet: Pet): any {
  return {
    id: pet.id,
    name: pet.name,
    species: pet.species || 'Cachorro',
    breed: pet.breed || 'SRD',
    city: pet.city || 'São Paulo',
    state: pet.state || 'SP',
    age: pet.age,
    age_group: pet.ageGroup || 'Adulto',
    gender: pet.gender,
    size: pet.size,
    color: pet.color || 'Caramelo',
    vaccination: pet.vaccination,
    castrated: pet.castrated ?? true,
    dewormed: pet.dewormed ?? true,
    special_needs: pet.specialNeeds ?? false,
    main_image: pet.mainImage,
    gallery_images: pet.galleryImages || [],
    ong_id: pet.ongId || 'amigos-de-patas',
    ong_name: pet.ongName || 'ONG Amigo Fiel',
    entry_date: pet.entryDate,
    status: pet.status,
    favorite: pet.favorite ?? false
  };
}

function mapOngFromSupabase(row: any): ONG {
  return {
    id: String(row.id),
    name: row.name || row.nome_fantasia || row.razao_social || 'ONG Parceira',
    city: row.city || (row.endereco ? row.endereco.split(',')[0] : 'São Paulo'),
    state: row.state || 'SP',
    phone: row.phone || row.telefone_whatsapp || '(11) 98765-4321',
    email: row.email || 'contato@ongparceira.org.br',
    address: row.endereco || row.address || 'São Paulo, SP',
    image: row.image || 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b',
    description: row.description || '',
    petsCount: row.pets_count || 0,
    featured: Boolean(row.featured)
  };
}

function mapOngToSupabase(ong: ONG): any {
  return {
    id: ong.id,
    name: ong.name,
    city: ong.city,
    state: ong.state,
    phone: ong.phone,
    email: ong.email,
    image: ong.image,
    description: ong.description,
    pets_count: ong.petsCount,
    featured: ong.featured ?? false
  };
}

function mapSolicitationFromSupabase(row: any): Solicitation {
  return {
    id: String(row.id),
    type: (row.type === 'adocao' ? 'Adoção' : row.type === 'acolhimento' ? 'Visita' : (row.type || 'Visita')) as any,
    petId: String(row.pet_id || ''),
    petName: row.pet_name || 'Pet Cadastrado',
    petImage: row.pet_image,
    requesterName: row.requester_name || 'Solicitante',
    requesterEmail: row.requester_email || row.email,
    dateOrDetails: row.date_or_details || row.mensagem || '',
    status: (row.status === 'aprovada' ? 'approved' : row.status === 'recusada' ? 'rejected' : (row.status || 'pending')) as any,
    adoptionGranted: Boolean(row.adoption_granted ?? (row.status === 'approved' && row.type === 'Adoção')),
    phone: row.phone || '',
    email: row.email || '',
    ongId: row.ong_id || 'amigos-de-patas',
    ongName: row.ong_name || 'Amigos de Patas',
    ongPhone: row.ong_phone || '(11) 98765-4321',
    ongEmail: row.ong_email || 'contato@amigosdepatas.org.br',
    ongAddress: row.ong_address || 'Av. Paulista, 1200 - São Paulo, SP',
    createdAt: row.created_at || new Date().toISOString()
  };
}

function mapSolicitationToSupabase(sol: Solicitation): any {
  return {
    id: sol.id,
    type: sol.type,
    pet_id: sol.petId,
    pet_name: sol.petName,
    requester_name: sol.requesterName,
    date_or_details: sol.dateOrDetails,
    status: sol.status,
    phone: sol.phone,
    email: sol.email
  };
}

function mapFosterFromSupabase(row: any): FosterRequest {
  return {
    id: String(row.id),
    petName: row.pet_name || '',
    species: row.species || (row.dados_animal_proprio?.especie) || 'Cachorro',
    reason: row.reason || row.mensagem || '',
    timestamp: row.timestamp || (row.created_at ? new Date(row.created_at).toLocaleTimeString('pt-BR') : new Date().toLocaleTimeString('pt-BR')),
    status: (row.status === 'aprovada' ? 'accepted' : row.status === 'recusada' ? 'declined' : (row.status || 'pending')) as any,
    photoUrl: row.photo_url || row.dados_animal_proprio?.foto,
    requesterName: row.requester_name,
    phone: row.phone,
    acceptedByOngName: row.accepted_by_ong_name || (row.status === 'accepted' ? 'Amigos de Patas' : undefined),
    acceptedByOngPhone: row.accepted_by_ong_phone || (row.status === 'accepted' ? '(11) 98765-4321' : undefined),
    acceptedByOngAddress: row.accepted_by_ong_address || (row.status === 'accepted' ? 'Av. Paulista, 1200 - São Paulo, SP' : undefined)
  };
}

function mapFosterToSupabase(foster: FosterRequest): any {
  return {
    id: foster.id,
    pet_name: foster.petName,
    species: foster.species,
    reason: foster.reason,
    timestamp: foster.timestamp,
    status: foster.status,
    photo_url: foster.photoUrl,
    requester_name: foster.requesterName,
    phone: foster.phone
  };
}

function mapPartnerFromSupabase(row: any): Partner {
  return {
    id: String(row.id),
    name: row.name || row.nome,
    category: row.category || row.tipo || 'Parceiro',
    tagline: row.tagline || row.tipo || '',
    image: row.image || row.logo_url || 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e',
    url: row.url || row.link_contato || '#',
    badge: row.badge,
    discountOrBenefit: row.discount_or_benefit
  };
}

function mapPartnerToSupabase(p: Partner): any {
  return {
    id: p.id,
    name: p.name,
    category: p.category,
    tagline: p.tagline,
    image: p.image,
    url: p.url,
    badge: p.badge,
    discount_or_benefit: p.discountOrBenefit
  };
}

// ==========================================
// SERVIÇO DE BANCO DE DADOS UNIFICADO (DB SERVICE)
// ==========================================
export const dbService = {
  // ----------------------------------------
  // PETS
  // ----------------------------------------
  async getPets(): Promise<Pet[]> {
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase
          .from('pets')
          .select('*')
          .order('created_at', { ascending: false });

        if (!error && data && data.length > 0) {
          const mapped = data.map(mapPetFromSupabase);
          setLocal(STORAGE_KEYS.PETS, mapped);
          return mapped;
        }

        // Se a tabela estiver vazia, faz o seed inicial
        if (!error && data && data.length === 0) {
          const seeds = INITIAL_PETS.map(mapPetToSupabase);
          await supabase.from('pets').insert(seeds);
          setLocal(STORAGE_KEYS.PETS, INITIAL_PETS);
          return INITIAL_PETS;
        }
      } catch (err) {
        console.warn('Falha ao buscar pets no Supabase, usando local:', err);
      }
    }
    return getLocal<Pet[]>(STORAGE_KEYS.PETS, INITIAL_PETS);
  },

  async savePet(pet: Pet): Promise<Pet> {
    const currentPets = getLocal<Pet[]>(STORAGE_KEYS.PETS, INITIAL_PETS);
    const existingIndex = currentPets.findIndex((p) => p.id === pet.id);
    let updatedPets: Pet[];

    if (existingIndex >= 0) {
      updatedPets = [...currentPets];
      updatedPets[existingIndex] = pet;
    } else {
      updatedPets = [pet, ...currentPets];
    }
    setLocal(STORAGE_KEYS.PETS, updatedPets);

    if (isSupabaseConfigured) {
      try {
        const payload = mapPetToSupabase(pet);
        const { error } = await supabase.from('pets').upsert(payload);
        if (error) console.error('Erro ao salvar pet no Supabase:', error);
      } catch (err) {
        console.error('Falha de conexão com Supabase ao salvar pet:', err);
      }
    }

    return pet;
  },

  async deletePet(petId: string): Promise<void> {
    const currentPets = getLocal<Pet[]>(STORAGE_KEYS.PETS, INITIAL_PETS);
    const updatedPets = currentPets.filter((p) => p.id !== petId);
    setLocal(STORAGE_KEYS.PETS, updatedPets);

    if (isSupabaseConfigured) {
      try {
        const { error } = await supabase.from('pets').delete().eq('id', petId);
        if (error) console.error('Erro ao deletar pet no Supabase:', error);
      } catch (err) {
        console.error('Falha de conexão com Supabase ao deletar pet:', err);
      }
    }
  },

  async updatePetStatus(petId: string, status: 'Disponível' | 'Em Processo' | 'Adotado'): Promise<void> {
    const currentPets = getLocal<Pet[]>(STORAGE_KEYS.PETS, INITIAL_PETS);
    const updatedPets = currentPets.map((p) => (p.id === petId ? { ...p, status } : p));
    setLocal(STORAGE_KEYS.PETS, updatedPets);

    if (isSupabaseConfigured) {
      try {
        const { error } = await supabase.from('pets').update({ status }).eq('id', petId);
        if (error) console.error('Erro ao atualizar status no Supabase:', error);
      } catch (err) {
        console.error('Falha de conexão com Supabase ao atualizar status:', err);
      }
    }
  },

  async toggleFavorite(petId: string): Promise<boolean> {
    const currentPets = getLocal<Pet[]>(STORAGE_KEYS.PETS, INITIAL_PETS);
    let newFavState = false;
    const updatedPets = currentPets.map((p) => {
      if (p.id === petId) {
        newFavState = !p.favorite;
        return { ...p, favorite: newFavState };
      }
      return p;
    });
    setLocal(STORAGE_KEYS.PETS, updatedPets);

    if (isSupabaseConfigured) {
      try {
        await supabase.from('pets').update({ favorite: newFavState }).eq('id', petId);
      } catch (err) {
        console.error('Erro ao sincronizar favorito com Supabase:', err);
      }
    }

    return newFavState;
  },

  // ----------------------------------------
  // ONGS
  // ----------------------------------------
  async getOngs(): Promise<ONG[]> {
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase.from('ongs').select('*').order('name');
        if (!error && data && data.length > 0) {
          const mapped = data.map(mapOngFromSupabase);
          setLocal(STORAGE_KEYS.ONGS, mapped);
          return mapped;
        }
        if (!error && data && data.length === 0) {
          const seeds = INITIAL_ONGS.map(mapOngToSupabase);
          await supabase.from('ongs').insert(seeds);
          setLocal(STORAGE_KEYS.ONGS, INITIAL_ONGS);
          return INITIAL_ONGS;
        }
      } catch (err) {
        console.warn('Falha ao buscar ONGs no Supabase:', err);
      }
    }
    return getLocal<ONG[]>(STORAGE_KEYS.ONGS, INITIAL_ONGS);
  },

  async saveOng(ong: ONG): Promise<ONG> {
    const currentOngs = getLocal<ONG[]>(STORAGE_KEYS.ONGS, INITIAL_ONGS);
    const existingIndex = currentOngs.findIndex((o) => o.id === ong.id);
    let updatedOngs: ONG[];

    if (existingIndex >= 0) {
      updatedOngs = [...currentOngs];
      updatedOngs[existingIndex] = ong;
    } else {
      updatedOngs = [...currentOngs, ong];
    }
    setLocal(STORAGE_KEYS.ONGS, updatedOngs);

    if (isSupabaseConfigured) {
      try {
        const payload = mapOngToSupabase(ong);
        await supabase.from('ongs').upsert(payload);
      } catch (err) {
        console.error('Erro ao sincronizar ONG com Supabase:', err);
      }
    }

    return ong;
  },

  // ----------------------------------------
  // SOLICITAÇÕES (VISITAS E ADOÇÕES)
  // ----------------------------------------
  async getSolicitations(): Promise<Solicitation[]> {
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase
          .from('solicitations')
          .select('*')
          .order('created_at', { ascending: false });

        if (!error && data && data.length > 0) {
          const mapped = data.map(mapSolicitationFromSupabase);
          setLocal(STORAGE_KEYS.SOLICITATIONS, mapped);
          return mapped;
        }
        if (!error && data && data.length === 0) {
          const seeds = INITIAL_SOLICITATIONS.map(mapSolicitationToSupabase);
          await supabase.from('solicitations').insert(seeds);
          setLocal(STORAGE_KEYS.SOLICITATIONS, INITIAL_SOLICITATIONS);
          return INITIAL_SOLICITATIONS;
        }
      } catch (err) {
        console.warn('Falha ao buscar solicitações no Supabase:', err);
      }
    }
    return getLocal<Solicitation[]>(STORAGE_KEYS.SOLICITATIONS, INITIAL_SOLICITATIONS);
  },

  async saveSolicitation(solicitation: Solicitation): Promise<Solicitation> {
    const current = getLocal<Solicitation[]>(STORAGE_KEYS.SOLICITATIONS, INITIAL_SOLICITATIONS);
    const updated = [solicitation, ...current];
    setLocal(STORAGE_KEYS.SOLICITATIONS, updated);

    if (isSupabaseConfigured) {
      try {
        const payload = mapSolicitationToSupabase(solicitation);
        await supabase.from('solicitations').insert(payload);
      } catch (err) {
        console.error('Erro ao salvar solicitação no Supabase:', err);
      }
    }

    return solicitation;
  },

  async updateSolicitationStatus(id: string, status: 'approved' | 'rejected' | 'pending'): Promise<void> {
    const current = getLocal<Solicitation[]>(STORAGE_KEYS.SOLICITATIONS, INITIAL_SOLICITATIONS);
    const updated = current.map((s) => (s.id === id ? { ...s, status } : s));
    setLocal(STORAGE_KEYS.SOLICITATIONS, updated);

    if (isSupabaseConfigured) {
      try {
        await supabase.from('solicitations').update({ status }).eq('id', id);
      } catch (err) {
        console.error('Erro ao atualizar status da solicitação no Supabase:', err);
      }
    }
  },

  // ----------------------------------------
  // PEDIDOS DE ACOLHIMENTO (FOSTER REQUESTS)
  // ----------------------------------------
  async getFosterRequests(): Promise<FosterRequest[]> {
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase
          .from('foster_requests')
          .select('*')
          .order('created_at', { ascending: false });

        if (!error && data && data.length > 0) {
          const mapped = data.map(mapFosterFromSupabase);
          setLocal(STORAGE_KEYS.FOSTER_REQUESTS, mapped);
          return mapped;
        }
        if (!error && data && data.length === 0) {
          const seeds = INITIAL_FOSTER_REQUESTS.map(mapFosterToSupabase);
          await supabase.from('foster_requests').insert(seeds);
          setLocal(STORAGE_KEYS.FOSTER_REQUESTS, INITIAL_FOSTER_REQUESTS);
          return INITIAL_FOSTER_REQUESTS;
        }
      } catch (err) {
        console.warn('Falha ao buscar pedidos de acolhimento no Supabase:', err);
      }
    }
    return getLocal<FosterRequest[]>(STORAGE_KEYS.FOSTER_REQUESTS, INITIAL_FOSTER_REQUESTS);
  },

  async saveFosterRequest(foster: FosterRequest): Promise<FosterRequest> {
    const current = getLocal<FosterRequest[]>(STORAGE_KEYS.FOSTER_REQUESTS, INITIAL_FOSTER_REQUESTS);
    const updated = [foster, ...current];
    setLocal(STORAGE_KEYS.FOSTER_REQUESTS, updated);

    if (isSupabaseConfigured) {
      try {
        const payload = mapFosterToSupabase(foster);
        await supabase.from('foster_requests').insert(payload);
      } catch (err) {
        console.error('Erro ao salvar acolhimento no Supabase:', err);
      }
    }

    return foster;
  },

  async updateFosterStatus(id: string, status: 'accepted' | 'declined' | 'pending'): Promise<void> {
    const current = getLocal<FosterRequest[]>(STORAGE_KEYS.FOSTER_REQUESTS, INITIAL_FOSTER_REQUESTS);
    const updated = current.map((f) => (f.id === id ? { ...f, status } : f));
    setLocal(STORAGE_KEYS.FOSTER_REQUESTS, updated);

    if (isSupabaseConfigured) {
      try {
        await supabase.from('foster_requests').update({ status }).eq('id', id);
      } catch (err) {
        console.error('Erro ao atualizar status do acolhimento no Supabase:', err);
      }
    }
  },

  // ----------------------------------------
  // PARCEIROS (PARTNERS)
  // ----------------------------------------
  async getPartners(): Promise<Partner[]> {
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase
          .from('partners')
          .select('*')
          .order('created_at', { ascending: false });

        if (!error && data && data.length > 0) {
          const mapped = data.map(mapPartnerFromSupabase);
          setLocal(STORAGE_KEYS.PARTNERS, mapped);
          return mapped;
        }
        if (!error && data && data.length === 0) {
          const seeds = PARTNERS_LIST.map(mapPartnerToSupabase);
          await supabase.from('partners').insert(seeds);
          setLocal(STORAGE_KEYS.PARTNERS, PARTNERS_LIST);
          return PARTNERS_LIST;
        }
      } catch (err) {
        console.warn('Falha ao buscar parceiros no Supabase:', err);
      }
    }
    return getLocal<Partner[]>(STORAGE_KEYS.PARTNERS, PARTNERS_LIST);
  },

  // ----------------------------------------
  // Reset / Restauração para testes
  // ----------------------------------------
  resetToDefaults(): void {
    setLocal(STORAGE_KEYS.PETS, INITIAL_PETS);
    setLocal(STORAGE_KEYS.ONGS, INITIAL_ONGS);
    setLocal(STORAGE_KEYS.SOLICITATIONS, INITIAL_SOLICITATIONS);
    setLocal(STORAGE_KEYS.FOSTER_REQUESTS, INITIAL_FOSTER_REQUESTS);
    setLocal(STORAGE_KEYS.PARTNERS, PARTNERS_LIST);
  }
};
