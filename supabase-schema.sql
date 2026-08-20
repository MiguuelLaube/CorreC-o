-- ==============================================================================
-- SCHEMA SUPABASE: PROJETO CORRENTECÃO (CORRE-C-O)
-- Executável múltiplas vezes sem conflitos (Idempotente)
-- ==============================================================================

-- Habilitar extensão pgcrypto
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- 1. TABELA DE USUÁRIOS / AUTENTICAÇÃO COM NÍVEIS DE PERMISSÃO (ADMIN / USER)
CREATE TABLE IF NOT EXISTS public.usuarios (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    telefone VARCHAR(20),
    senha_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) DEFAULT 'user' CHECK (role IN ('user', 'admin')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Garantir existência da coluna role caso a tabela já existisse
DO $$ BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' AND table_name = 'usuarios' AND column_name = 'role'
    ) THEN
        ALTER TABLE public.usuarios ADD COLUMN role VARCHAR(20) DEFAULT 'user' CHECK (role IN ('user', 'admin'));
    END IF;
END $$;

-- 2. TABELA DE ONGS
CREATE TABLE IF NOT EXISTS public.ongs (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    city TEXT NOT NULL,
    state TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT,
    address TEXT,
    image TEXT NOT NULL,
    description TEXT,
    pets_count INTEGER DEFAULT 0,
    featured BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. TABELA DE PETS (CADASTRO ENXUTO: NOME, IDADE, PORTE, GÊNERO, VACINADO, FOTOS)
CREATE TABLE IF NOT EXISTS public.pets (
    id TEXT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    age VARCHAR(50) NOT NULL,
    size VARCHAR(20) NOT NULL CHECK (size IN ('Pequeno', 'Médio', 'Grande')),
    gender VARCHAR(10) NOT NULL CHECK (gender IN ('Macho', 'Fêmea')),
    vaccination VARCHAR(50) DEFAULT 'Vacinado',
    main_image TEXT NOT NULL,
    gallery_images TEXT[] DEFAULT '{}',
    species TEXT DEFAULT 'Cachorro',
    breed TEXT DEFAULT 'SRD',
    city TEXT DEFAULT 'São Paulo',
    state TEXT DEFAULT 'SP',
    ong_id TEXT REFERENCES public.ongs(id) ON DELETE SET NULL,
    ong_name TEXT DEFAULT 'ONG Amigo Fiel',
    entry_date TEXT,
    status TEXT DEFAULT 'Disponível' CHECK (status IN ('Disponível', 'Em Processo', 'Adotado')),
    favorite BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. TABELA DE SOLICITAÇÕES (VISITAS E ADOÇÕES) COM ID TEXT FLEXÍVEL
CREATE TABLE IF NOT EXISTS public.solicitations (
    id TEXT PRIMARY KEY,
    type TEXT NOT NULL CHECK (type IN ('Visita', 'Adoção')),
    pet_id TEXT,
    pet_name TEXT NOT NULL,
    pet_image TEXT,
    requester_name TEXT NOT NULL,
    requester_email TEXT,
    date_or_details TEXT NOT NULL,
    phone TEXT,
    email TEXT,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'in_review', 'approved', 'rejected')),
    adoption_granted BOOLEAN DEFAULT FALSE,
    ong_id TEXT,
    ong_name TEXT,
    ong_phone TEXT,
    ong_email TEXT,
    ong_address TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Converter coluna ID para TEXT caso a tabela já existisse como UUID
DO $$ BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' AND table_name = 'solicitations' AND data_type = 'uuid'
    ) THEN
        ALTER TABLE public.solicitations ALTER COLUMN id TYPE TEXT USING id::text;
    END IF;
END $$;

-- 5. TABELA DE PEDIDOS DE ACOLHIMENTO E TRIAGEM COM ID TEXT FLEXÍVEL
CREATE TABLE IF NOT EXISTS public.foster_requests (
    id TEXT PRIMARY KEY,
    pet_name TEXT NOT NULL,
    species TEXT NOT NULL,
    size TEXT DEFAULT 'Médio',
    reason TEXT NOT NULL,
    timestamp TEXT,
    photo_url TEXT,
    requester_name TEXT,
    requester_email TEXT,
    phone TEXT,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'declined')),
    accepted_by_ong_id TEXT,
    accepted_by_ong_name TEXT,
    accepted_by_ong_phone TEXT,
    accepted_by_ong_email TEXT,
    accepted_by_ong_address TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Converter coluna ID para TEXT caso a tabela já existisse como UUID
DO $$ BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' AND table_name = 'foster_requests' AND data_type = 'uuid'
    ) THEN
        ALTER TABLE public.foster_requests ALTER COLUMN id TYPE TEXT USING id::text;
    END IF;
END $$;

-- 6. TABELA DE PARCEIROS (PATROCINADORES)
CREATE TABLE IF NOT EXISTS public.partners (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    tagline TEXT,
    image TEXT NOT NULL,
    url TEXT NOT NULL,
    badge TEXT,
    discount_or_benefit TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==============================================================================
-- CONTA DE ADMINISTRADOR OBRIGATÓRIA (HASH SHA-256)
-- Email: admin@gmail.com
-- Senha plana: hiqufxAqTYouTeJmYqFYPHFELoUEXwtc
-- ==============================================================================
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
-- CONFIGURAÇÃO DE SEGURANÇA (ROW LEVEL SECURITY - RLS)
-- ==============================================================================
ALTER TABLE public.usuarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ongs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.solicitations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.foster_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.partners ENABLE ROW LEVEL SECURITY;

-- Limpar policies antigas se existirem
DROP POLICY IF EXISTS "Gerenciamento de Usuários" ON public.usuarios;
DROP POLICY IF EXISTS "Gerenciamento de ONGs" ON public.ongs;
DROP POLICY IF EXISTS "Gerenciamento de Pets" ON public.pets;
DROP POLICY IF EXISTS "Gerenciamento de Parceiros" ON public.partners;
DROP POLICY IF EXISTS "Gerenciamento de Solicitações" ON public.solicitations;
DROP POLICY IF EXISTS "Gerenciamento de Acolhimentos" ON public.foster_requests;

-- Criar políticas de acesso completo
CREATE POLICY "Gerenciamento de Usuários" ON public.usuarios FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Gerenciamento de ONGs" ON public.ongs FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Gerenciamento de Pets" ON public.pets FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Gerenciamento de Parceiros" ON public.partners FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Gerenciamento de Solicitações" ON public.solicitations FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Gerenciamento de Acolhimentos" ON public.foster_requests FOR ALL USING (true) WITH CHECK (true);
