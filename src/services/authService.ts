import { User, UserRole, OngSession, ONG } from '../types';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { INITIAL_ONGS } from '../data/initialData';

// Chaves de armazenamento isoladas para os dois sistemas de login
const USER_SESSION_KEY = 'matchpet_user_session';
const ONG_SESSION_KEY = 'matchpet_ong_session';
const USERS_STORE_KEY = 'matchpet_users_store_v2';
const ONGS_STORE_KEY = 'matchpet_ongs_store_v2';

// Credenciais fixas de Administrador
export const ADMIN_CREDENTIALS = {
  email: 'admin@gmail.com',
  plainPassword: 'hiqufxAqTYouTeJmYqFYPHFELoUEXwtc',
  name: 'Administrador MatchPet',
  role: 'admin' as const
};

/**
 * Helper para garantir que requisições ao Supabase nunca travem a UI
 */
async function withTimeout<T>(promiseLike: PromiseLike<T> | Promise<T>, ms = 2500): Promise<T> {
  const promise = Promise.resolve(promiseLike);
  return Promise.race([
    promise,
    new Promise<T>((_, reject) => setTimeout(() => reject(new Error('Timeout de conexão com banco')), ms))
  ]);
}

/**
 * Criptografia de senha usando SHA-256 (Web Crypto API)
 */
export async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

interface StoredUser {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  role: UserRole;
  phone?: string;
  createdAt: string;
}

// Helpers de Storage Local
function getStoredUsers(): StoredUser[] {
  try {
    const raw = localStorage.getItem(USERS_STORE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    return [];
  }
}

function saveStoredUsers(users: StoredUser[]): void {
  try {
    localStorage.setItem(USERS_STORE_KEY, JSON.stringify(users));
  } catch (err) {
    console.error('Erro ao salvar usuários no storage:', err);
  }
}

function getStoredOngs(): ONG[] {
  try {
    const raw = localStorage.getItem(ONGS_STORE_KEY);
    if (!raw) {
      localStorage.setItem(ONGS_STORE_KEY, JSON.stringify(INITIAL_ONGS));
      return INITIAL_ONGS;
    }
    return JSON.parse(raw);
  } catch (err) {
    return INITIAL_ONGS;
  }
}

function saveStoredOngs(ongs: ONG[]): void {
  try {
    localStorage.setItem(ONGS_STORE_KEY, JSON.stringify(ongs));
  } catch (err) {
    console.error('Erro ao salvar ONGs no storage:', err);
  }
}

export const authService = {
  /**
   * Inicializa o banco com a conta de Administrador e ONGs iniciais
   */
  async init(): Promise<void> {
    try {
      getStoredOngs(); // Garante inicialização local
      const adminHash = await hashPassword(ADMIN_CREDENTIALS.plainPassword);

      if (isSupabaseConfigured) {
        withTimeout(
          supabase
            .from('usuarios')
            .select('id, email, senha_hash, role')
            .eq('email', ADMIN_CREDENTIALS.email.toLowerCase())
            .maybeSingle(),
          2000
        )
          .then(async ({ data }: any) => {
            if (!data) {
              await supabase.from('usuarios').insert({
                nome: ADMIN_CREDENTIALS.name,
                email: ADMIN_CREDENTIALS.email.toLowerCase(),
                senha_hash: adminHash,
                role: 'admin'
              });
            }
          })
          .catch((err) => console.warn('Sync admin Supabase:', err));
      }
    } catch (error) {
      console.error('Erro ao inicializar authService:', error);
    }
  },

  // ============================================================================
  // 1. SISTEMA DE AUTENTICAÇÃO DE ADOTANTES (USUÁRIOS COMUNS)
  // ============================================================================
  getCurrentUser(): User | null {
    try {
      const raw = localStorage.getItem(USER_SESSION_KEY);
      if (!raw) return null;
      return JSON.parse(raw) as User;
    } catch (err) {
      return null;
    }
  },

  async loginUser(
    emailInput: string,
    passwordInput: string
  ): Promise<{ success: boolean; user?: User; error?: string }> {
    const email = emailInput.trim().toLowerCase();
    const password = passwordInput.trim();

    if (!email || !password) {
      return { success: false, error: 'Preencha o e-mail e a senha.' };
    }

    const inputHash = await hashPassword(password);

    // Tentar via Supabase
    if (isSupabaseConfigured) {
      try {
        const { data, error }: any = await withTimeout(
          supabase
            .from('usuarios')
            .select('*')
            .eq('email', email)
            .maybeSingle(),
          2500
        );

        if (!error && data && data.senha_hash === inputHash) {
          const user: User = {
            id: String(data.id),
            name: data.nome || 'Adotante',
            email: data.email,
            role: 'user',
            phone: data.telefone,
            createdAt: data.created_at
          };
          localStorage.setItem(USER_SESSION_KEY, JSON.stringify(user));
          return { success: true, user };
        }
      } catch (err) {
        console.warn('Fallback para autenticação local de adotante:', err);
      }
    }

    // Fallback Local
    const localUsers = getStoredUsers();
    const found = localUsers.find((u) => u.email.toLowerCase() === email);

    if (!found || found.passwordHash !== inputHash) {
      return { success: false, error: 'E-mail ou senha de adotante inválidos.' };
    }

    const sessionUser: User = {
      id: found.id,
      name: found.name,
      email: found.email,
      role: 'user',
      phone: found.phone,
      createdAt: found.createdAt
    };

    localStorage.setItem(USER_SESSION_KEY, JSON.stringify(sessionUser));
    return { success: true, user: sessionUser };
  },

  async registerUser(
    nameInput: string,
    emailInput: string,
    passwordInput: string,
    phoneInput?: string
  ): Promise<{ success: boolean; user?: User; error?: string }> {
    const name = nameInput.trim();
    const email = emailInput.trim().toLowerCase();
    const password = passwordInput.trim();
    const phone = phoneInput?.trim();

    if (!name || !email || !password) {
      return { success: false, error: 'Preencha todos os campos obrigatórios.' };
    }

    if (password.length < 6) {
      return { success: false, error: 'A senha deve conter no mínimo 6 caracteres.' };
    }

    const passwordHash = await hashPassword(password);
    const localUsers = getStoredUsers();
    const existing = localUsers.find((u) => u.email.toLowerCase() === email);

    if (existing) {
      return { success: false, error: 'Este e-mail já está cadastrado como adotante.' };
    }

    const newUser: StoredUser = {
      id: `user-${Date.now()}`,
      name,
      email,
      passwordHash,
      role: 'user',
      phone,
      createdAt: new Date().toISOString()
    };

    localUsers.push(newUser);
    saveStoredUsers(localUsers);

    if (isSupabaseConfigured) {
      withTimeout(
        supabase.from('usuarios').insert({
          nome: name,
          email,
          senha_hash: passwordHash,
          role: 'user',
          telefone: phone
        }),
        2500
      ).catch((err) => console.warn('Erro ao registrar no Supabase:', err));
    }

    const user: User = {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      role: 'user',
      phone: newUser.phone,
      createdAt: newUser.createdAt
    };

    localStorage.setItem(USER_SESSION_KEY, JSON.stringify(user));
    return { success: true, user };
  },

  logoutUser(): void {
    localStorage.removeItem(USER_SESSION_KEY);
  },

  // ============================================================================
  // 2. SISTEMA DE AUTENTICAÇÃO DE ONGS E ADMINISTRADOR (100% INDEPENDENTE)
  // ============================================================================
  getCurrentOngSession(): OngSession | null {
    try {
      const raw = localStorage.getItem(ONG_SESSION_KEY);
      if (!raw) return null;
      return JSON.parse(raw) as OngSession;
    } catch (err) {
      return null;
    }
  },

  async loginOngOrAdmin(
    emailInput: string,
    passwordInput: string
  ): Promise<{ success: boolean; session?: OngSession; error?: string }> {
    const email = emailInput.trim().toLowerCase();
    const password = passwordInput.trim();

    if (!email || !password) {
      return { success: false, error: 'Preencha o e-mail e a senha.' };
    }

    const inputHash = await hashPassword(password);

    // 1. Verificação de Administrador Root
    if (email === ADMIN_CREDENTIALS.email.toLowerCase()) {
      const adminHash = await hashPassword(ADMIN_CREDENTIALS.plainPassword);
      if (inputHash === adminHash) {
        const adminSession: OngSession = {
          id: 'admin-root-01',
          name: ADMIN_CREDENTIALS.name,
          email: ADMIN_CREDENTIALS.email,
          cnpj: '00.000.000/0001-00',
          role: 'admin',
          createdAt: new Date().toISOString()
        };
        localStorage.setItem(ONG_SESSION_KEY, JSON.stringify(adminSession));
        return { success: true, session: adminSession };
      } else {
        return { success: false, error: 'Senha de administrador incorreta.' };
      }
    }

    // 2. Verificação de ONG no Supabase
    if (isSupabaseConfigured) {
      try {
        const { data, error }: any = await withTimeout(
          supabase
            .from('ongs')
            .select('*')
            .eq('email', email)
            .maybeSingle(),
          2500
        );

        if (!error && data) {
          if (data.senha_hash === inputHash || data.password_hash === inputHash) {
            const ongSession: OngSession = {
              id: String(data.id),
              name: data.name || data.nome || 'ONG Parceira',
              email: data.email,
              cnpj: data.cnpj || '00.000.000/0001-00',
              role: 'ong',
              phone: data.phone || data.telefone_whatsapp,
              address: data.address || data.endereco,
              city: data.city,
              state: data.state,
              image: data.image,
              description: data.description,
              createdAt: data.created_at
            };
            localStorage.setItem(ONG_SESSION_KEY, JSON.stringify(ongSession));
            return { success: true, session: ongSession };
          } else {
            return { success: false, error: 'Senha da ONG incorreta.' };
          }
        }
      } catch (err) {
        console.warn('Fallback para autenticação local de ONG:', err);
      }
    }

    // 3. Fallback de ONG no LocalStorage
    const localOngs = getStoredOngs();
    const foundOng = localOngs.find(
      (o) => (o.email && o.email.toLowerCase() === email)
    );

    if (!foundOng) {
      return { success: false, error: 'ONG não encontrada com este e-mail. Solicite cadastro ao Administrador.' };
    }

    if (foundOng.passwordHash && foundOng.passwordHash !== inputHash) {
      return { success: false, error: 'Senha da ONG incorreta. Tente novamente.' };
    }

    const ongSession: OngSession = {
      id: foundOng.id,
      name: foundOng.name,
      email: foundOng.email || email,
      cnpj: foundOng.cnpj || '00.000.000/0001-00',
      role: 'ong',
      phone: foundOng.phone,
      address: foundOng.address,
      city: foundOng.city,
      state: foundOng.state,
      image: foundOng.image,
      description: foundOng.description,
      createdAt: foundOng.createdAt
    };

    localStorage.setItem(ONG_SESSION_KEY, JSON.stringify(ongSession));
    return { success: true, session: ongSession };
  },

  /**
   * Criação de nova ONG pelo Administrador com credenciais de login
   */
  async registerOngByAdmin(data: {
    cnpj: string;
    name: string;
    email: string;
    passwordPlain: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    description: string;
    image?: string;
  }): Promise<{ success: boolean; ong?: ONG; error?: string }> {
    const cnpj = data.cnpj.trim();
    const name = data.name.trim();
    const email = data.email.trim().toLowerCase();
    const password = data.passwordPlain.trim();

    if (!cnpj || !name || !email || !password) {
      return { success: false, error: 'CNPJ, Nome da ONG, E-mail e Senha são obrigatórios.' };
    }

    if (password.length < 6) {
      return { success: false, error: 'A senha de acesso deve conter pelo menos 6 dígitos.' };
    }

    const passwordHash = await hashPassword(password);
    const id = `ong-${Date.now()}`;

    const newOng: ONG = {
      id,
      cnpj,
      name,
      email,
      passwordHash,
      phone: data.phone.trim() || '(11) 90000-0000',
      address: data.address.trim() || 'Endereço não informado',
      city: data.city.trim() || 'São Paulo',
      state: data.state.trim() || 'SP',
      description: data.description.trim() || 'Instituição dedicada ao resgate e bem-estar animal.',
      image:
        data.image?.trim() ||
        'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=800&q=80',
      petsCount: 0,
      featured: false,
      createdAt: new Date().toISOString()
    };

    // Salvar localmente
    const localOngs = getStoredOngs();
    localOngs.push(newOng);
    saveStoredOngs(localOngs);

    // Salvar no Supabase
    if (isSupabaseConfigured) {
      try {
        await withTimeout(
          supabase.from('ongs').upsert({
            id: newOng.id,
            cnpj: newOng.cnpj,
            name: newOng.name,
            email: newOng.email,
            senha_hash: passwordHash,
            phone: newOng.phone,
            address: newOng.address,
            city: newOng.city,
            state: newOng.state,
            description: newOng.description,
            image: newOng.image,
            pets_count: 0
          }),
          3000
        );
      } catch (err) {
        console.error('Erro ao sincronizar nova ONG no Supabase:', err);
      }
    }

    return { success: true, ong: newOng };
  },

  /**
   * Atualização de ONG existente pelo Administrador
   */
  async updateOngByAdmin(data: {
    id: string;
    cnpj: string;
    name: string;
    email: string;
    passwordPlain?: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    description: string;
    image?: string;
  }): Promise<{ success: boolean; ong?: ONG; error?: string }> {
    const cnpj = data.cnpj.trim();
    const name = data.name.trim();
    const email = data.email.trim().toLowerCase();

    if (!cnpj || !name || !email) {
      return { success: false, error: 'CNPJ, Nome da ONG e E-mail são obrigatórios.' };
    }

    const localOngs = getStoredOngs();
    const index = localOngs.findIndex((o) => o.id === data.id);

    if (index < 0) {
      return { success: false, error: 'ONG não encontrada para atualização.' };
    }

    let passwordHash = localOngs[index].passwordHash;
    if (data.passwordPlain && data.passwordPlain.trim().length > 0) {
      if (data.passwordPlain.trim().length < 6) {
        return { success: false, error: 'A nova senha deve ter no mínimo 6 dígitos.' };
      }
      passwordHash = await hashPassword(data.passwordPlain.trim());
    }

    const updatedOng: ONG = {
      ...localOngs[index],
      cnpj,
      name,
      email,
      passwordHash,
      phone: data.phone.trim() || localOngs[index].phone,
      address: data.address.trim() || localOngs[index].address,
      city: data.city.trim() || localOngs[index].city,
      state: data.state.trim() || localOngs[index].state,
      description: data.description.trim() || localOngs[index].description,
      image: data.image?.trim() || localOngs[index].image
    };

    localOngs[index] = updatedOng;
    saveStoredOngs(localOngs);

    if (isSupabaseConfigured) {
      try {
        const payload: any = {
          id: updatedOng.id,
          cnpj: updatedOng.cnpj,
          name: updatedOng.name,
          email: updatedOng.email,
          phone: updatedOng.phone,
          address: updatedOng.address,
          city: updatedOng.city,
          state: updatedOng.state,
          description: updatedOng.description,
          image: updatedOng.image
        };
        if (passwordHash) {
          payload.senha_hash = passwordHash;
        }

        await withTimeout(
          supabase.from('ongs').upsert(payload),
          3000
        );
      } catch (err) {
        console.error('Erro ao sincronizar atualização da ONG no Supabase:', err);
      }
    }

    return { success: true, ong: updatedOng };
  },

  /**
   * Exclusão de ONG pelo Administrador
   */
  async deleteOngByAdmin(id: string): Promise<{ success: boolean; error?: string }> {
    const localOngs = getStoredOngs();
    const filtered = localOngs.filter((o) => o.id !== id);
    saveStoredOngs(filtered);

    if (isSupabaseConfigured) {
      try {
        await withTimeout(supabase.from('ongs').delete().eq('id', id), 3000);
      } catch (err) {
        console.error('Erro ao remover ONG do Supabase:', err);
      }
    }

    return { success: true };
  },

  logoutOng(): void {
    localStorage.removeItem(ONG_SESSION_KEY);
  }
};
