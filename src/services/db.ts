import { Pet, ONG, Solicitation, FosterRequest, Partner } from '../types';
import { INITIAL_PETS, INITIAL_ONGS, INITIAL_SOLICITATIONS, INITIAL_FOSTER_REQUESTS, PARTNERS_LIST } from '../data/initialData';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

const STORAGE_KEYS = {
  PETS: 'matchpet_pets_store_v2',
  ONGS: 'matchpet_ongs_store_v2',
  SOLICITATIONS: 'matchpet_solicitations_store_v2',
  FOSTER_REQUESTS: 'matchpet_foster_requests_store_v2',
  PARTNERS: 'matchpet_partners_store_v2',
  INITIALIZED: 'matchpet_initialized_v3'
};

// ==========================================
// Helpers de Local Storage (Persistência Offline/Cache)
// ==========================================
function getLocal<T>(key: string, defaultValue: T): T {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
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
    species: (row.species || (row.especie === 'gato' ? 'Gato' : 'Cachorro')) as any,
    breed: row.breed || 'SRD',
    city: row.city || 'São Paulo',
    state: row.state || 'SP',
    age: row.age || (row.idade_aproximada ? `${row.idade_aproximada}` : '2 anos'),
    ageGroup: (row.age_group || 'Adulto') as any,
    gender: (row.gender || (row.genero === 'femea' ? 'Fêmea' : 'Macho')) as any,
    size: (row.size || 'Médio') as any,
    color: row.color || row.cor || 'Caramelo',
    vaccination: row.vaccination || (row.vacinado ? 'Vacinado' : 'Pendente'),
    castrated: Boolean(row.castrated ?? row.castrado),
    dewormed: Boolean(row.dewormed ?? true),
    specialNeeds: Boolean(row.special_needs ?? false),
    mainImage: row.main_image || (Array.isArray(row.fotos) && row.fotos[0]) || 'https://images.unsplash.com/photo-1543466835-00a7907e9de1',
    galleryImages: row.gallery_images || (Array.isArray(row.fotos) ? row.fotos.slice(1) : []),
    ongId: String(row.ong_id || 'ong-amigos-de-patas'),
    ongName: row.ong_name || 'ONG Parceira',
    entryDate: row.entry_date || new Date().toLocaleDateString('pt-BR'),
    status: (row.status || 'Disponível') as any,
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
    ong_id: pet.ongId || 'ong-amigos-de-patas',
    ong_name: pet.ongName || 'ONG Parceira',
    entry_date: pet.entryDate,
    status: pet.status,
    favorite: pet.favorite ?? false
  };
}

function mapOngFromSupabase(row: any): ONG {
  return {
    id: String(row.id),
    cnpj: row.cnpj || '00.000.000/0001-00',
    name: row.name || row.nome_fantasia || row.razao_social || 'ONG Parceira',
    city: row.city || 'São Paulo',
    state: row.state || 'SP',
    phone: row.phone || row.telefone_whatsapp || '(11) 98765-4321',
    email: row.email || 'contato@ongparceira.org.br',
    passwordHash: row.senha_hash || row.password_hash,
    address: row.address || row.endereco || 'São Paulo, SP',
    image: row.image || 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b',
    description: row.description || '',
    petsCount: row.pets_count || 0,
    featured: Boolean(row.featured)
  };
}

function mapOngToSupabase(ong: ONG): any {
  return {
    id: ong.id,
    cnpj: ong.cnpj,
    name: ong.name,
    city: ong.city,
    state: ong.state,
    phone: ong.phone,
    email: ong.email,
    senha_hash: ong.passwordHash,
    address: ong.address,
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
    ongId: row.ong_id || 'ong-amigos-de-patas',
    ongName: row.ong_name || 'Amigos de Patas',
    ongPhone: row.ong_phone || '(11) 98765-4321',
    ongEmail: row.ong_email || 'contato@amigosdepatas.org.br',
    ongAddress: row.ong_address || 'Av. Paulista, 1200 - São Paulo, SP',
    createdAt: row.created_at || new Date().toISOString()
  };
}

function mapSolicitationToSupabase(sol: Solicitation): any {
  return {
    id: String(sol.id),
    type: sol.type,
    pet_id: sol.petId,
    pet_name: sol.petName,
    pet_image: sol.petImage,
    requester_name: sol.requesterName,
    requester_email: sol.requesterEmail || sol.email,
    date_or_details: sol.dateOrDetails,
    status: sol.status,
    adoption_granted: sol.adoptionGranted ?? false,
    phone: sol.phone,
    email: sol.email,
    ong_id: sol.ongId,
    ong_name: sol.ongName,
    ong_phone: sol.ongPhone,
    ong_email: sol.ongEmail,
    ong_address: sol.ongAddress
  };
}

function mapFosterFromSupabase(row: any): FosterRequest {
  return {
    id: String(row.id),
    petName: row.pet_name || '',
    species: row.species || 'Cachorro',
    reason: row.reason || row.mensagem || '',
    timestamp: row.timestamp || (row.created_at ? new Date(row.created_at).toLocaleTimeString('pt-BR') : new Date().toLocaleTimeString('pt-BR')),
    status: (row.status === 'aprovada' ? 'accepted' : row.status === 'recusada' ? 'declined' : (row.status || 'pending')) as any,
    photoUrl: row.photo_url,
    requesterName: row.requester_name,
    requesterEmail: row.requester_email || row.email,
    phone: row.phone,
    acceptedByOngId: row.accepted_by_ong_id,
    acceptedByOngName: row.accepted_by_ong_name,
    acceptedByOngPhone: row.accepted_by_ong_phone,
    acceptedByOngAddress: row.accepted_by_ong_address
  };
}

function mapFosterToSupabase(foster: FosterRequest): any {
  return {
    id: String(foster.id),
    pet_name: foster.petName,
    species: foster.species,
    reason: foster.reason,
    timestamp: foster.timestamp,
    status: foster.status,
    photo_url: foster.photoUrl,
    requester_name: foster.requesterName,
    requester_email: foster.requesterEmail,
    phone: foster.phone,
    accepted_by_ong_id: foster.acceptedByOngId,
    accepted_by_ong_name: foster.acceptedByOngName,
    accepted_by_ong_phone: foster.acceptedByOngPhone,
    accepted_by_ong_address: foster.acceptedByOngAddress
  };
}

// ==========================================
// SERVIÇO DE BANCO DE DADOS UNIFICADO (COM ISOLAMENTO POR ONG)
// ==========================================
export const dbService = {
  // ----------------------------------------
  // PETS (ISOLAMENTO POR ONG DISPONÍVEL)
  // ----------------------------------------
  async getPets(filterOngId?: string): Promise<Pet[]> {
    let allPets: Pet[] = [];

    if (isSupabaseConfigured) {
      try {
        let query = supabase.from('pets').select('*').order('created_at', { ascending: false });
        if (filterOngId) {
          query = query.eq('ong_id', filterOngId);
        }
        const { data, error } = await query;

        if (!error && data && data.length > 0) {
          allPets = data.map(mapPetFromSupabase);
        } else if (!error && data && data.length === 0 && !filterOngId) {
          const seeds = INITIAL_PETS.map(mapPetToSupabase);
          await supabase.from('pets').upsert(seeds);
          allPets = INITIAL_PETS;
        }
      } catch (err) {
        console.warn('Falha ao buscar pets no Supabase, usando local:', err);
      }
    }

    if (allPets.length === 0) {
      const local = getLocal<Pet[]>(STORAGE_KEYS.PETS, INITIAL_PETS);
      allPets = filterOngId ? local.filter((p) => p.ongId === filterOngId) : local;
    }

    return allPets;
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
        await supabase.from('pets').upsert(payload);
      } catch (err) {
        console.error('Falha de conexão ao salvar pet no Supabase:', err);
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
        await supabase.from('pets').delete().eq('id', petId);
      } catch (err) {
        console.error('Falha ao deletar pet no Supabase:', err);
      }
    }
  },

  async updatePetStatus(petId: string, status: 'Disponível' | 'Em Processo' | 'Adotado'): Promise<void> {
    const currentPets = getLocal<Pet[]>(STORAGE_KEYS.PETS, INITIAL_PETS);
    const updatedPets = currentPets.map((p) => (p.id === petId ? { ...p, status } : p));
    setLocal(STORAGE_KEYS.PETS, updatedPets);

    if (isSupabaseConfigured) {
      try {
        await supabase.from('pets').update({ status }).eq('id', petId);
      } catch (err) {
        console.error('Falha ao atualizar status no Supabase:', err);
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
        console.error('Erro ao sincronizar favorito:', err);
      }
    }

    return newFavState;
  },

  // ----------------------------------------
  // ONGS (ADMIN GESTÃO E VITRINE PÚBLICA)
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
          await supabase.from('ongs').upsert(seeds);
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

  async deleteOng(id: string): Promise<void> {
    const currentOngs = getLocal<ONG[]>(STORAGE_KEYS.ONGS, INITIAL_ONGS);
    const updatedOngs = currentOngs.filter((o) => o.id !== id);
    setLocal(STORAGE_KEYS.ONGS, updatedOngs);

    if (isSupabaseConfigured) {
      try {
        await supabase.from('ongs').delete().eq('id', id);
      } catch (err) {
        console.error('Erro ao deletar ONG no Supabase:', err);
      }
    }
  },

  // ----------------------------------------
  // SOLICITAÇÕES (ISOLAMENTO POR ONG OU ADOTANTE)
  // ----------------------------------------
  async getSolicitations(filterOngId?: string, filterUserEmail?: string): Promise<Solicitation[]> {
    let all: Solicitation[] = [];

    if (isSupabaseConfigured) {
      try {
        let query = supabase.from('solicitations').select('*').order('created_at', { ascending: false });
        if (filterOngId) {
          query = query.eq('ong_id', filterOngId);
        }
        if (filterUserEmail) {
          query = query.eq('requester_email', filterUserEmail.toLowerCase());
        }
        const { data, error } = await query;

        if (!error && data && data.length > 0) {
          all = data.map(mapSolicitationFromSupabase);
        } else if (!error && data && data.length === 0 && !filterOngId && !filterUserEmail) {
          const seeds = INITIAL_SOLICITATIONS.map(mapSolicitationToSupabase);
          await supabase.from('solicitations').upsert(seeds);
          all = INITIAL_SOLICITATIONS;
        }
      } catch (err) {
        console.warn('Falha ao buscar solicitações no Supabase:', err);
      }
    }

    if (all.length === 0) {
      const local = getLocal<Solicitation[]>(STORAGE_KEYS.SOLICITATIONS, INITIAL_SOLICITATIONS);
      all = local.filter((s) => {
        if (filterOngId && s.ongId !== filterOngId) return false;
        if (filterUserEmail && s.requesterEmail?.toLowerCase() !== filterUserEmail.toLowerCase()) return false;
        return true;
      });
    }

    return all;
  },

  async saveSolicitation(solicitation: Solicitation): Promise<Solicitation> {
    const current = getLocal<Solicitation[]>(STORAGE_KEYS.SOLICITATIONS, INITIAL_SOLICITATIONS);
    const updated = [solicitation, ...current];
    setLocal(STORAGE_KEYS.SOLICITATIONS, updated);

    if (isSupabaseConfigured) {
      try {
        const payload = mapSolicitationToSupabase(solicitation);
        await supabase.from('solicitations').upsert(payload);
      } catch (err) {
        console.error('Erro ao salvar solicitação no Supabase:', err);
      }
    }

    return solicitation;
  },

  async updateSolicitationStatus(id: string, status: 'approved' | 'rejected' | 'pending'): Promise<void> {
    const current = getLocal<Solicitation[]>(STORAGE_KEYS.SOLICITATIONS, INITIAL_SOLICITATIONS);
    const updated = current.map((s) => (s.id === id ? { ...s, status, adoptionGranted: status === 'approved' } : s));
    setLocal(STORAGE_KEYS.SOLICITATIONS, updated);

    if (isSupabaseConfigured) {
      try {
        await supabase.from('solicitations').update({ status, adoption_granted: status === 'approved' }).eq('id', id);
      } catch (err) {
        console.error('Erro ao atualizar status no Supabase:', err);
      }
    }
  },

  // ----------------------------------------
  // PEDIDOS DE ACOLHIMENTO E TRIAGEM
  // ----------------------------------------
  async getFosterRequests(filterOngId?: string, filterUserEmail?: string): Promise<FosterRequest[]> {
    let all: FosterRequest[] = [];

    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase
          .from('foster_requests')
          .select('*')
          .order('created_at', { ascending: false });

        if (!error && data && data.length > 0) {
          all = data.map(mapFosterFromSupabase);
        } else if (!error && data && data.length === 0 && !filterOngId && !filterUserEmail) {
          const seeds = INITIAL_FOSTER_REQUESTS.map(mapFosterToSupabase);
          await supabase.from('foster_requests').upsert(seeds);
          all = INITIAL_FOSTER_REQUESTS;
        }
      } catch (err) {
        console.warn('Falha ao buscar acolhimentos no Supabase:', err);
      }
    }

    if (all.length === 0) {
      all = getLocal<FosterRequest[]>(STORAGE_KEYS.FOSTER_REQUESTS, INITIAL_FOSTER_REQUESTS);
    }

    // Filtrar com segurança se especificado
    if (filterOngId) {
      all = all.filter((f) => f.acceptedByOngId === filterOngId || f.status === 'pending');
    }
    if (filterUserEmail) {
      all = all.filter((f) => f.requesterEmail?.toLowerCase() === filterUserEmail.toLowerCase());
    }

    return all;
  },

  async saveFosterRequest(foster: FosterRequest): Promise<FosterRequest> {
    const current = getLocal<FosterRequest[]>(STORAGE_KEYS.FOSTER_REQUESTS, INITIAL_FOSTER_REQUESTS);
    const updated = [foster, ...current];
    setLocal(STORAGE_KEYS.FOSTER_REQUESTS, updated);

    if (isSupabaseConfigured) {
      try {
        const payload = mapFosterToSupabase(foster);
        await supabase.from('foster_requests').upsert(payload);
      } catch (err) {
        console.error('Erro ao salvar acolhimento no Supabase:', err);
      }
    }

    return foster;
  },

  async updateFosterStatus(
    id: string,
    status: 'accepted' | 'declined' | 'pending',
    ongInfo?: { id: string; name: string; phone: string; address: string }
  ): Promise<void> {
    const current = getLocal<FosterRequest[]>(STORAGE_KEYS.FOSTER_REQUESTS, INITIAL_FOSTER_REQUESTS);
    const updated = current.map((f) =>
      f.id === id
        ? {
            ...f,
            status,
            acceptedByOngId: ongInfo?.id || f.acceptedByOngId,
            acceptedByOngName: ongInfo?.name || f.acceptedByOngName,
            acceptedByOngPhone: ongInfo?.phone || f.acceptedByOngPhone,
            acceptedByOngAddress: ongInfo?.address || f.acceptedByOngAddress
          }
        : f
    );
    setLocal(STORAGE_KEYS.FOSTER_REQUESTS, updated);

    if (isSupabaseConfigured) {
      try {
        await supabase
          .from('foster_requests')
          .update({
            status,
            accepted_by_ong_id: ongInfo?.id,
            accepted_by_ong_name: ongInfo?.name,
            accepted_by_ong_phone: ongInfo?.phone,
            accepted_by_ong_address: ongInfo?.address
          })
          .eq('id', id);
      } catch (err) {
        console.error('Erro ao atualizar acolhimento no Supabase:', err);
      }
    }
  },

  // ----------------------------------------
  // PARCEIROS (PARTNERS)
  // ----------------------------------------
  async getPartners(): Promise<Partner[]> {
    return PARTNERS_LIST;
  }
};
