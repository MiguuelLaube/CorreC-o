-- ==============================================================================
-- SCHEMA SUPABASE: PROJETO CORRENTECÃO (CORRE-C-O)
-- ==============================================================================

-- 1. TABELA DE ONGS
CREATE TABLE IF NOT EXISTS public.ongs (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    city TEXT NOT NULL,
    state TEXT NOT NULL,
    phone TEXT NOT NULL,
    image TEXT NOT NULL,
    description TEXT,
    pets_count INTEGER DEFAULT 0,
    featured BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. TABELA DE PETS (ANIMAIS PARA ADOÇÃO)
CREATE TABLE IF NOT EXISTS public.pets (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    species TEXT NOT NULL CHECK (species IN ('Cachorro', 'Gato', 'Outro')),
    breed TEXT NOT NULL,
    city TEXT NOT NULL,
    state TEXT NOT NULL,
    age TEXT NOT NULL,
    age_group TEXT NOT NULL CHECK (age_group IN ('Filhote', 'Adulto', 'Idoso')),
    gender TEXT NOT NULL CHECK (gender IN ('Macho', 'Fêmea')),
    size TEXT NOT NULL CHECK (size IN ('Pequeno', 'Médio', 'Grande', 'Médio/Grande')),
    color TEXT NOT NULL,
    vaccination TEXT DEFAULT 'Vacinado',
    castrated BOOLEAN DEFAULT FALSE,
    dewormed BOOLEAN DEFAULT FALSE,
    special_needs BOOLEAN DEFAULT FALSE,
    temperament TEXT[] DEFAULT '{}',
    main_image TEXT NOT NULL,
    gallery_images TEXT[] DEFAULT '{}',
    story TEXT[] DEFAULT '{}',
    ong_id TEXT REFERENCES public.ongs(id) ON DELETE SET NULL,
    ong_name TEXT NOT NULL,
    entry_date TEXT,
    status TEXT DEFAULT 'Disponível' CHECK (status IN ('Disponível', 'Em Processo', 'Adotado')),
    favorite BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. TABELA DE SOLICITAÇÕES (VISITAS E ADOÇÕES)
CREATE TABLE IF NOT EXISTS public.solicitations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    type TEXT NOT NULL CHECK (type IN ('Visita', 'Adoção')),
    pet_id TEXT REFERENCES public.pets(id) ON DELETE CASCADE,
    pet_name TEXT NOT NULL,
    requester_name TEXT NOT NULL,
    date_or_details TEXT NOT NULL,
    phone TEXT,
    email TEXT,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. TABELA DE PEDIDOS DE ACOLHIMENTO (FOSTER REQUESTS)
CREATE TABLE IF NOT EXISTS public.foster_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    pet_name TEXT NOT NULL,
    species TEXT NOT NULL,
    reason TEXT NOT NULL,
    timestamp TEXT,
    photo_url TEXT,
    requester_name TEXT,
    phone TEXT,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'declined')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. TABELA DE PARCEIROS (PARTNERS)
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
-- CONFIGURAÇÃO DE SEGURANÇA (ROW LEVEL SECURITY - RLS)
-- ==============================================================================

ALTER TABLE public.ongs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.solicitations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.foster_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.partners ENABLE ROW LEVEL SECURITY;

-- Políticas públicas de Leitura (Qualquer visitante pode ver pets, ongs e parceiros)
CREATE POLICY "Leitura pública de ONGs" ON public.ongs FOR SELECT USING (true);
CREATE POLICY "Leitura pública de Pets" ON public.pets FOR SELECT USING (true);
CREATE POLICY "Leitura pública de Parceiros" ON public.partners FOR SELECT USING (true);

-- Políticas para Inserção pública (Qualquer usuário pode enviar solicitações e acolhimentos)
CREATE POLICY "Criação pública de Solicitações" ON public.solicitations FOR INSERT WITH CHECK (true);
CREATE POLICY "Criação pública de Acolhimentos" ON public.foster_requests FOR INSERT WITH CHECK (true);

-- Leitura/Edição para ONGs / Painel administrativo
CREATE POLICY "Leitura de Solicitações" ON public.solicitations FOR SELECT USING (true);
CREATE POLICY "Atualização de Solicitações" ON public.solicitations FOR UPDATE USING (true);

CREATE POLICY "Leitura de Acolhimentos" ON public.foster_requests FOR SELECT USING (true);
CREATE POLICY "Atualização de Acolhimentos" ON public.foster_requests FOR UPDATE USING (true);

CREATE POLICY "Gerenciamento de Pets" ON public.pets FOR ALL USING (true);
CREATE POLICY "Gerenciamento de ONGs" ON public.ongs FOR ALL USING (true);
