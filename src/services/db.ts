import { Pet, ONG, Solicitation, FosterRequest } from '../types';
import { INITIAL_PETS, INITIAL_ONGS, INITIAL_SOLICITATIONS, INITIAL_FOSTER_REQUESTS } from '../data/initialData';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

const STORAGE_KEYS = {
  PETS: 'correntecao_pets',
  ONGS: 'correntecao_ongs',
  SOLICITATIONS: 'correntecao_solicitations',
  FOSTER_REQUESTS: 'correntecao_foster_requests',
  INITIALIZED: 'correntecao_initialized_v1'
};

// ==========================================
// Helpers de Local Storage (Persistência Offline/Navegador)
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
    id: row.id,
    name: row.name,
    species: row.species,
    breed: row.breed,
    city: row.city,
    state: row.state,
    age: row.age,
    ageGroup: row.age_group,
    gender: row.gender,
    size: row.size,
    color: row.color,
    vaccination: row.vaccination || 'Em dia',
    castrated: Boolean(row.castrated),
    dewormed: Boolean(row.dewormed),
    specialNeeds: Boolean(row.special_needs),
    temperament: row.temperament || [],
    mainImage: row.main_image,
    galleryImages: row.gallery_images || [],
    story: row.story || [],
    ongId: row.ong_id || 'amigos-de-patas',
    ongName: row.ong_name || 'ONG Parceira',
    entryDate: row.entry_date || new Date().toLocaleDateString('pt-BR'),
    status: row.status || 'Disponível',
    favorite: Boolean(row.favorite)
  };
}

function mapPetToSupabase(pet: Pet): any {
  return {
    id: pet.id,
    name: pet.name,
    species: pet.species,
    breed: pet.breed,
    city: pet.city,
    state: pet.state,
    age: pet.age,
    age_group: pet.ageGroup,
    gender: pet.gender,
    size: pet.size,
    color: pet.color,
    vaccination: pet.vaccination,
    castrated: pet.castrated,
    dewormed: pet.dewormed ?? true,
    special_needs: pet.specialNeeds ?? false,
    temperament: pet.temperament,
    main_image: pet.mainImage,
    gallery_images: pet.galleryImages || [],
    story: pet.story,
    ong_id: pet.ongId,
    ong_name: pet.ongName,
    entry_date: pet.entryDate,
    status: pet.status,
    favorite: pet.favorite ?? false
  };
}

function mapOngFromSupabase(row: any): ONG {
  return {
    id: row.id,
    name: row.name,
    city: row.city,
    state: row.state,
    phone: row.phone,
    image: row.image,
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
    image: ong.image,
    description: ong.description,
    pets_count: ong.petsCount,
    featured: ong.featured ?? false
  };
}

function mapSolicitationFromSupabase(row: any): Solicitation {
  return {
    id: row.id,
    type: row.type,
    petId: row.pet_id,
    petName: row.pet_name,
    requesterName: row.requester_name,
    dateOrDetails: row.date_or_details,
    status: row.status,
    phone: row.phone || '',
    email: row.email || ''
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
    id: row.id,
    petName: row.pet_name,
    species: row.species,
    reason: row.reason,
    timestamp: row.timestamp || new Date().toLocaleTimeString('pt-BR'),
    status: row.status,
    photoUrl: row.photo_url,
    requesterName: row.requester_name,
    phone: row.phone
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

        // Se o Supabase estiver conectado mas sem dados ainda, faz o seed inicial
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
    // 1. Sempre atualiza localmente para nunca perder os dados
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

    // 2. Se configurado, envia diretamente para o Supabase
    if (isSupabaseConfigured) {
      try {
        const payload = mapPetToSupabase(pet);
        const { error } = await supabase.from('pets').upsert(payload);
        if (error) {
          console.error('Erro ao salvar pet no Supabase:', error);
        } else {
          console.log('Pet gravado no Supabase com sucesso:', pet.name);
        }
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
          return data.map(mapOngFromSupabase);
        }
        if (!error && data && data.length === 0) {
          const seeds = INITIAL_ONGS.map(mapOngToSupabase);
          await supabase.from('ongs').insert(seeds);
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
          return data.map(mapSolicitationFromSupabase);
        }
        if (!error && data && data.length === 0) {
          const seeds = INITIAL_SOLICITATIONS.map(mapSolicitationToSupabase);
          await supabase.from('solicitations').insert(seeds);
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
          return data.map(mapFosterFromSupabase);
        }
        if (!error && data && data.length === 0) {
          const seeds = INITIAL_FOSTER_REQUESTS.map(mapFosterToSupabase);
          await supabase.from('foster_requests').insert(seeds);
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
  // Reset / Restauração para testes
  // ----------------------------------------
  resetToDefaults(): void {
    setLocal(STORAGE_KEYS.PETS, INITIAL_PETS);
    setLocal(STORAGE_KEYS.ONGS, INITIAL_ONGS);
    setLocal(STORAGE_KEYS.SOLICITATIONS, INITIAL_SOLICITATIONS);
    setLocal(STORAGE_KEYS.FOSTER_REQUESTS, INITIAL_FOSTER_REQUESTS);
  }
};
