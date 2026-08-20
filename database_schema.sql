-- ==============================================================================
-- SCHEMA DO BANCO DE DADOS: SISTEMA DE ADOÇÃO DE PETS (POSTGRESQL / SUPABASE)
-- Gerado a partir da especificação técnica completa
-- ==============================================================================

-- 1. ENUMS PARA CONSISTÊNCIA DE DADOS
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'especie_enum') THEN
        CREATE TYPE especie_enum AS ENUM ('cao', 'gato');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'porte_enum') THEN
        CREATE TYPE porte_enum AS ENUM ('pequeno', 'medio', 'grande');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'genero_enum') THEN
        CREATE TYPE genero_enum AS ENUM ('macho', 'femea');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'idade_enum') THEN
        CREATE TYPE idade_enum AS ENUM ('filhote', 'adulto', 'idoso');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'pet_status_enum') THEN
        CREATE TYPE pet_status_enum AS ENUM ('disponivel', 'em_processo', 'adotado');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'solicitacao_status_enum') THEN
        CREATE TYPE solicitacao_status_enum AS ENUM ('pendente', 'aprovada', 'recusada');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role_enum') THEN
        CREATE TYPE user_role_enum AS ENUM ('user', 'admin');
    END IF;
END $$;

-- 2. TABELA DE ONGS / PROTETORES
CREATE TABLE IF NOT EXISTS public.ongs (
    id SERIAL PRIMARY KEY,
    razao_social VARCHAR(255) NOT NULL,
    nome_fantasia VARCHAR(255),
    cnpj_documento VARCHAR(20) UNIQUE NOT NULL,
    telefone_whatsapp VARCHAR(20),
    endereco TEXT,
    email VARCHAR(255) UNIQUE NOT NULL,
    senha_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. TABELA DE USUÁRIOS / ADOTANTES / ADMINISTRADORES
CREATE TABLE IF NOT EXISTS public.usuarios (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    telefone VARCHAR(20),
    senha_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) DEFAULT 'user' CHECK (role IN ('user', 'admin')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Adiciona a coluna role caso a tabela usuarios já exista
DO $$ BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' AND table_name = 'usuarios' AND column_name = 'role'
    ) THEN
        ALTER TABLE public.usuarios ADD COLUMN role VARCHAR(20) DEFAULT 'user' CHECK (role IN ('user', 'admin'));
    END IF;
END $$;

-- 4. TABELA DE PETS
CREATE TABLE IF NOT EXISTS public.pets (
    id SERIAL PRIMARY KEY,
    ong_id INTEGER REFERENCES public.ongs(id) ON DELETE CASCADE,
    nome VARCHAR(100) NOT NULL,
    especie especie_enum NOT NULL,
    porte porte_enum NOT NULL,
    genero genero_enum NOT NULL,
    idade_aproximada idade_enum NOT NULL,
    cor VARCHAR(50),
    vacinado BOOLEAN DEFAULT FALSE,
    castrado BOOLEAN DEFAULT FALSE,
    descricao TEXT,
    status pet_status_enum DEFAULT 'disponivel',
    fotos TEXT[], -- Array de URLs das fotos
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. TABELA DE SOLICITAÇÕES (ADOÇÃO / VISITA E ACOLHIMENTO)
CREATE TABLE IF NOT EXISTS public.solicitacoes (
    id SERIAL PRIMARY KEY,
    tipo VARCHAR(50) NOT NULL CHECK (tipo IN ('adocao', 'acolhimento')),
    usuario_id INTEGER REFERENCES public.usuarios(id) ON DELETE SET NULL,
    ong_id INTEGER REFERENCES public.ongs(id) ON DELETE CASCADE,
    pet_id INTEGER REFERENCES public.pets(id) ON DELETE SET NULL, -- NULL se for acolhimento de animal próprio
    mensagem TEXT,
    dados_animal_proprio JSONB, -- Usado apenas em pedidos de acolhimento
    status solicitacao_status_enum DEFAULT 'pendente',
    data_agendamento TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. TABELA DE PARCEIROS (PATROCINADORES)
CREATE TABLE IF NOT EXISTS public.parceiros (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    logo_url TEXT,
    link_contato TEXT,
    tipo VARCHAR(100), -- 'Clinica', 'Pet Shop', etc.
    ativo BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ==============================================================================
-- INSERÇÃO / ATUALIZAÇÃO DA CONTA DE ADMINISTRADOR OBRIGATÓRIA (COM SENHA CRIPTOGRAFADA SHA-256)
-- Email: admin@gmail.com
-- Senha plana: hiqufxAqTYouTeJmYqFYPHFELoUEXwtc
-- ==============================================================================
CREATE EXTENSION IF NOT EXISTS pgcrypto;

INSERT INTO public.usuarios (nome, email, senha_hash, role)
VALUES (
    'Administrador CorrenteCão',
    'admin@gmail.com',
    encode(digest('hiqufxAqTYouTeJmYqFYPHFELoUEXwtc', 'sha256'), 'hex'),
    'admin'
)
ON CONFLICT (email) DO UPDATE SET
    nome = 'Administrador CorrenteCão',
    senha_hash = encode(digest('hiqufxAqTYouTeJmYqFYPHFELoUEXwtc', 'sha256'), 'hex'),
    role = 'admin';

-- ==============================================================================
-- ÍNDICES PARA PERFORMANCE EM CONSULTAS E FILTROS DE VITRINE / API
-- ==============================================================================
CREATE INDEX IF NOT EXISTS idx_pets_filtros ON public.pets(especie, porte, genero, idade_aproximada, status);
CREATE INDEX IF NOT EXISTS idx_pets_ong ON public.pets(ong_id);
CREATE INDEX IF NOT EXISTS idx_solicitacoes_ong ON public.solicitacoes(ong_id);
CREATE INDEX IF NOT EXISTS idx_solicitacoes_usuario ON public.solicitacoes(usuario_id);
CREATE INDEX IF NOT EXISTS idx_solicitacoes_status ON public.solicitacoes(status);
CREATE INDEX IF NOT EXISTS idx_parceiros_ativo ON public.parceiros(ativo);
CREATE INDEX IF NOT EXISTS idx_usuarios_email ON public.usuarios(email);
CREATE INDEX IF NOT EXISTS idx_usuarios_role ON public.usuarios(role);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) & POLICIES (SUPABASE)
-- ==============================================================================
ALTER TABLE public.ongs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.usuarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.solicitacoes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.parceiros ENABLE ROW LEVEL SECURITY;

-- Limpar policies prévias para idempotência
DROP POLICY IF EXISTS "Acesso completo ONGs" ON public.ongs;
DROP POLICY IF EXISTS "Acesso completo Usuários" ON public.usuarios;
DROP POLICY IF EXISTS "Acesso completo Pets" ON public.pets;
DROP POLICY IF EXISTS "Acesso completo Solicitações" ON public.solicitacoes;
DROP POLICY IF EXISTS "Acesso completo Parceiros" ON public.parceiros;

-- Políticas de acesso
CREATE POLICY "Acesso completo ONGs" ON public.ongs FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Acesso completo Usuários" ON public.usuarios FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Acesso completo Pets" ON public.pets FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Acesso completo Solicitações" ON public.solicitacoes FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Acesso completo Parceiros" ON public.parceiros FOR ALL USING (true) WITH CHECK (true);
