import { User, UserRole } from '../types';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

const AUTH_USER_KEY = 'correntecao_auth_user';
const USERS_DB_KEY = 'correntecao_users_store_v1';

// Credenciais fixas de Administrador
export const ADMIN_CREDENTIALS = {
  email: 'admin@gmail.com',
  plainPassword: 'hiqufxAqTYouTeJmYqFYPHFELoUEXwtc',
  name: 'Administrador CorrenteCão',
  role: 'admin' as UserRole
};

/**
 * Criptografia de senha usando SHA-256 (Web Crypto API)
 * Transforma a senha em texto plano em um hash hexadecimal irreversível
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

// Helpers de Storage Local para fallback e persistência offline
function getStoredUsers(): StoredUser[] {
  try {
    const raw = localStorage.getItem(USERS_DB_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    console.error('Erro ao ler usuários do localStorage:', err);
    return [];
  }
}

function saveStoredUsers(users: StoredUser[]): void {
  try {
    localStorage.setItem(USERS_DB_KEY, JSON.stringify(users));
  } catch (err) {
    console.error('Erro ao salvar usuários no localStorage:', err);
  }
}

export const authService = {
  /**
   * Inicializa o banco com a conta de Administrador obrigatória caso ainda não exista
   */
  async init(): Promise<void> {
    try {
      const adminHash = await hashPassword(ADMIN_CREDENTIALS.plainPassword);
      const localUsers = getStoredUsers();
      const existingAdmin = localUsers.find(
        (u) => u.email.toLowerCase() === ADMIN_CREDENTIALS.email.toLowerCase()
      );

      if (!existingAdmin) {
        const adminUser: StoredUser = {
          id: 'admin-root-01',
          name: ADMIN_CREDENTIALS.name,
          email: ADMIN_CREDENTIALS.email.toLowerCase(),
          passwordHash: adminHash,
          role: 'admin',
          createdAt: new Date().toISOString()
        };
        localUsers.push(adminUser);
        saveStoredUsers(localUsers);
      }

      // Se Supabase estiver conectado, sincroniza o admin no banco remoto
      if (isSupabaseConfigured) {
        try {
          const { data } = await supabase
            .from('usuarios')
            .select('id, email, senha_hash, role')
            .eq('email', ADMIN_CREDENTIALS.email.toLowerCase())
            .maybeSingle();

          if (!data) {
            await supabase.from('usuarios').insert({
              nome: ADMIN_CREDENTIALS.name,
              email: ADMIN_CREDENTIALS.email.toLowerCase(),
              senha_hash: adminHash,
              role: 'admin'
            });
            console.log('Conta de Administrador cadastrada no Supabase.');
          } else if (data.role !== 'admin' || data.senha_hash !== adminHash) {
            await supabase
              .from('usuarios')
              .update({ role: 'admin', senha_hash: adminHash })
              .eq('email', ADMIN_CREDENTIALS.email.toLowerCase());
          }
        } catch (dbErr) {
          console.warn('Sincronização de admin no Supabase (não-bloqueante):', dbErr);
        }
      }
    } catch (error) {
      console.error('Erro ao inicializar authService:', error);
    }
  },

  /**
   * Retorna o usuário autenticado atualmente na sessão
   */
  getCurrentUser(): User | null {
    try {
      const raw = localStorage.getItem(AUTH_USER_KEY);
      if (!raw) return null;
      return JSON.parse(raw) as User;
    } catch (err) {
      return null;
    }
  },

  /**
   * Valida email e senha e retorna a sessão autenticada com seu nível de acesso
   */
  async login(
    emailInput: string,
    passwordInput: string
  ): Promise<{ success: boolean; user?: User; error?: string }> {
    const email = emailInput.trim().toLowerCase();
    const password = passwordInput.trim();

    if (!email || !password) {
      return { success: false, error: 'Por favor, preencha todos os campos.' };
    }

    const inputHash = await hashPassword(password);

    // 1. Tentar autenticação via Supabase se configurado
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase
          .from('usuarios')
          .select('*')
          .eq('email', email)
          .maybeSingle();

        if (!error && data) {
          if (data.senha_hash === inputHash) {
            const user: User = {
              id: String(data.id),
              name: data.nome || data.name || (data.role === 'admin' ? 'Administrador' : 'Usuário'),
              email: data.email,
              role: (data.role === 'admin' || email === ADMIN_CREDENTIALS.email) ? 'admin' : 'user',
              phone: data.telefone || data.phone,
              createdAt: data.created_at
            };
            localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
            return { success: true, user };
          } else {
            return { success: false, error: 'Senha incorreta. Tente novamente.' };
          }
        }
      } catch (err) {
        console.warn('Falha na autenticação via Supabase, verificando credenciais locais:', err);
      }
    }

    // 2. Validação direta para a conta fixa de Administrador
    if (email === ADMIN_CREDENTIALS.email) {
      const adminHash = await hashPassword(ADMIN_CREDENTIALS.plainPassword);
      if (inputHash === adminHash) {
        const adminUser: User = {
          id: 'admin-root-01',
          name: ADMIN_CREDENTIALS.name,
          email: ADMIN_CREDENTIALS.email,
          role: 'admin',
          createdAt: new Date().toISOString()
        };
        localStorage.setItem(AUTH_USER_KEY, JSON.stringify(adminUser));
        return { success: true, user: adminUser };
      } else {
        return { success: false, error: 'Senha de administrador incorreta.' };
      }
    }

    // 3. Fallback de usuários no localStorage
    const localUsers = getStoredUsers();
    const foundUser = localUsers.find((u) => u.email.toLowerCase() === email);

    if (!foundUser) {
      return { success: false, error: 'E-mail não cadastrado no sistema.' };
    }

    if (foundUser.passwordHash !== inputHash) {
      return { success: false, error: 'Senha incorreta. Tente novamente.' };
    }

    const sessionUser: User = {
      id: foundUser.id,
      name: foundUser.name,
      email: foundUser.email,
      role: foundUser.role || (foundUser.email === ADMIN_CREDENTIALS.email ? 'admin' : 'user'),
      phone: foundUser.phone,
      createdAt: foundUser.createdAt
    };

    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(sessionUser));
    return { success: true, user: sessionUser };
  },

  /**
   * Registra um novo usuário comum no banco com senha criptografada (SHA-256)
   */
  async register(
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

    // Se tentar cadastrar o email de admin pela rota de usuário comum
    const isSpecialAdmin = email === ADMIN_CREDENTIALS.email.toLowerCase();
    const role: UserRole = isSpecialAdmin ? 'admin' : 'user';
    const passwordHash = await hashPassword(password);

    // Verificar se usuário já existe localmente
    const localUsers = getStoredUsers();
    const existingIndex = localUsers.findIndex((u) => u.email.toLowerCase() === email);
    if (existingIndex >= 0 && !isSpecialAdmin) {
      return { success: false, error: 'Este e-mail já está cadastrado. Faça login.' };
    }

    const newUser: StoredUser = {
      id: `user-${Date.now()}`,
      name,
      email,
      passwordHash,
      role,
      phone,
      createdAt: new Date().toISOString()
    };

    // Salvar localmente
    if (existingIndex >= 0) {
      localUsers[existingIndex] = newUser;
    } else {
      localUsers.push(newUser);
    }
    saveStoredUsers(localUsers);

    // Salvar no Supabase se configurado
    if (isSupabaseConfigured) {
      try {
        const { error } = await supabase.from('usuarios').insert({
          nome: name,
          email,
          senha_hash: passwordHash,
          role,
          telefone: phone
        });
        if (error) {
          console.warn('Erro ao inserir usuário no Supabase:', error.message);
        }
      } catch (dbErr) {
        console.error('Falha de conexão com Supabase ao registrar usuário:', dbErr);
      }
    }

    const sessionUser: User = {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      phone: newUser.phone,
      createdAt: newUser.createdAt
    };

    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(sessionUser));
    return { success: true, user: sessionUser };
  },

  /**
   * Finaliza a sessão do usuário
   */
  logout(): void {
    localStorage.removeItem(AUTH_USER_KEY);
  }
};
