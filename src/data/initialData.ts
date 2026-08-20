import { Pet, ONG, Solicitation, FosterRequest, Partner } from '../types';

export const INITIAL_ONGS: ONG[] = [
  {
    id: 'ong-amigos-de-patas',
    cnpj: '12.345.678/0001-90',
    name: 'Amigos de Patas',
    city: 'São Paulo',
    state: 'SP',
    phone: '(11) 98765-4321',
    email: 'contato@amigosdepatas.org.br',
    passwordHash: '8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918', // admin123
    address: 'Av. Paulista, 1200 - Bela Vista, São Paulo - SP',
    image: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=800&q=80',
    description: 'Instalações acolhedoras dedicadas ao resgate, reabilitação e adoção responsável de cães e gatos.',
    petsCount: 48,
    featured: true
  },
  {
    id: 'ong-refugio-animal',
    cnpj: '98.765.432/0001-10',
    name: 'Refúgio Animal',
    city: 'Campinas',
    state: 'SP',
    phone: '(19) 99887-6655',
    email: 'adocao@refugioanimal.org.br',
    passwordHash: '8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918', // admin123
    address: 'Rua das Flores, 450 - Taquaral, Campinas - SP',
    image: 'https://images.unsplash.com/photo-1535268647677-300dbf3d78d1?auto=format&fit=crop&w=800&q=80',
    description: 'Comunidade engajada com equipe veterinária focada em acolhimento e filhotes resgatados.',
    petsCount: 35,
    featured: true
  },
  {
    id: 'ong-sos-focinhos',
    cnpj: '45.678.901/0001-23',
    name: 'SOS Focinhos',
    city: 'Rio de Janeiro',
    state: 'RJ',
    phone: '(21) 97766-5544',
    email: 'focinhos@sosfocinhos.org.br',
    passwordHash: '8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918', // admin123
    address: 'Rua Barata Ribeiro, 300 - Copacabana, Rio de Janeiro - RJ',
    image: 'https://images.unsplash.com/photo-1596492784531-6e6eb5ea9993?auto=format&fit=crop&w=800&q=80',
    description: 'Resgate urbano e programas de socialização e feiras de adoção semanais.',
    petsCount: 59,
    featured: true
  },
  {
    id: 'ong-instituto-patinhas',
    cnpj: '78.901.234/0001-56',
    name: 'Instituto Patinhas de Ouro',
    city: 'São Paulo',
    state: 'SP',
    phone: '(11) 97123-9988',
    email: 'adotar@patinhasdeouro.org.br',
    passwordHash: '8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918', // admin123
    address: 'Rua Vergueiro, 2500 - Vila Mariana, São Paulo - SP',
    image: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=800&q=80',
    description: 'Especializada no resgate e recuperação de cães de todos os portes com recreação.',
    petsCount: 22
  }
];

export const INITIAL_PETS: Pet[] = [
  {
    id: 'thor',
    name: 'Thor',
    species: 'Cachorro',
    breed: 'Mestiço de Golden Retriever',
    city: 'São Paulo',
    state: 'SP',
    age: '2 Anos',
    ageGroup: 'Adulto',
    gender: 'Macho',
    size: 'Grande',
    color: 'Dourado e Branco',
    vaccination: 'Vacinado',
    castrated: true,
    dewormed: true,
    mainImage: 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=800&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1587300003388-59208cc962cb?auto=format&fit=crop&w=800&q=80'
    ],
    ongId: 'ong-instituto-patinhas',
    ongName: 'Instituto Patinhas de Ouro',
    entryDate: '15/08/2023',
    status: 'Disponível',
    favorite: false
  },
  {
    id: 'caramelo',
    name: 'Caramelo',
    species: 'Cachorro',
    breed: 'Vira-lata (SRD)',
    city: 'São Paulo',
    state: 'SP',
    age: '2 anos',
    ageGroup: 'Adulto',
    gender: 'Macho',
    size: 'Médio',
    color: 'Caramelo',
    vaccination: 'Vacinado',
    castrated: true,
    dewormed: true,
    mainImage: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=800&q=80',
    ongId: 'ong-amigos-de-patas',
    ongName: 'Amigos de Patas',
    entryDate: '20/09/2023',
    status: 'Disponível',
    favorite: false
  },
  {
    id: 'luna',
    name: 'Luna',
    species: 'Gato',
    breed: 'Persa Mestiço',
    city: 'Campinas',
    state: 'SP',
    age: '1 ano',
    ageGroup: 'Adulto',
    gender: 'Fêmea',
    size: 'Pequeno',
    color: 'Branco',
    vaccination: 'Vacinado',
    castrated: true,
    dewormed: true,
    mainImage: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=800&q=80',
    ongId: 'ong-refugio-animal',
    ongName: 'Refúgio Animal',
    entryDate: '05/09/2023',
    status: 'Em Processo',
    favorite: false
  },
  {
    id: 'bolinha',
    name: 'Bolinha',
    species: 'Cachorro',
    breed: 'Border Collie Mix',
    city: 'Rio de Janeiro',
    state: 'RJ',
    age: '3 meses',
    ageGroup: 'Filhote',
    gender: 'Macho',
    size: 'Pequeno',
    color: 'Preto e Branco',
    vaccination: 'Vacinado',
    castrated: false,
    dewormed: true,
    mainImage: 'https://images.unsplash.com/photo-1546527868-ccb7ee7dfa6a?auto=format&fit=crop&w=800&q=80',
    ongId: 'ong-sos-focinhos',
    ongName: 'SOS Focinhos',
    entryDate: '12/10/2023',
    status: 'Disponível',
    favorite: false
  },
  {
    id: 'rex',
    name: 'Rex',
    species: 'Cachorro',
    breed: 'Golden Retriever Idoso',
    city: 'Rio de Janeiro',
    state: 'RJ',
    age: '8 anos',
    ageGroup: 'Idoso',
    gender: 'Macho',
    size: 'Grande',
    color: 'Dourado',
    vaccination: 'Vacinado',
    castrated: true,
    dewormed: true,
    specialNeeds: true,
    mainImage: 'https://images.unsplash.com/photo-1518717758536-85ae29035b6d?auto=format&fit=crop&w=800&q=80',
    ongId: 'ong-sos-focinhos',
    ongName: 'SOS Focinhos',
    entryDate: '01/07/2023',
    status: 'Disponível',
    favorite: false
  }
];

export const INITIAL_SOLICITATIONS: Solicitation[] = [
  {
    id: 'sol-1',
    type: 'Visita',
    petId: 'bolinha',
    petName: 'Bolinha',
    petImage: 'https://images.unsplash.com/photo-1546527868-ccb7ee7dfa6a?auto=format&fit=crop&w=800&q=80',
    requesterName: 'Adotante',
    requesterEmail: 'user@gmail.com',
    dateOrDetails: 'Sábado, 14h às 16h',
    status: 'in_review',
    phone: '(11) 98112-3344',
    email: 'user@gmail.com',
    ongId: 'ong-sos-focinhos',
    ongName: 'SOS Focinhos',
    ongPhone: '(21) 97766-5544',
    ongEmail: 'focinhos@sosfocinhos.org.br',
    ongAddress: 'Rua Barata Ribeiro, 300 - Rio de Janeiro - RJ',
    createdAt: '2026-08-18T10:00:00Z'
  },
  {
    id: 'sol-2',
    type: 'Adoção',
    petId: 'thor',
    petName: 'Thor',
    petImage: 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=800&q=80',
    requesterName: 'Adotante',
    requesterEmail: 'user@gmail.com',
    dateOrDetails: 'Formulário completo preenchido (Casa com quintal telado)',
    status: 'approved',
    adoptionGranted: true,
    phone: '(11) 98112-3344',
    email: 'user@gmail.com',
    ongId: 'ong-instituto-patinhas',
    ongName: 'Instituto Patinhas de Ouro',
    ongPhone: '(11) 97123-9988',
    ongEmail: 'adotar@patinhasdeouro.org.br',
    ongAddress: 'Rua Vergueiro, 2500 - Vila Mariana, São Paulo - SP',
    createdAt: '2026-08-15T14:30:00Z'
  }
];

export const INITIAL_FOSTER_REQUESTS: FosterRequest[] = [
  {
    id: 'foster-1',
    petName: 'Max',
    species: 'Cachorro',
    size: 'Grande',
    reason: 'Triagem iniciada: Impossibilidade de acolhimento definitivo por diagnóstico de alergia crônica.',
    timestamp: 'Ontem, 16:45',
    status: 'accepted',
    photoUrl: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=600&q=80',
    requesterName: 'Adotante',
    requesterEmail: 'user@gmail.com',
    phone: '(11) 97722-1199',
    acceptedByOngId: 'ong-amigos-de-patas',
    acceptedByOngName: 'Amigos de Patas',
    acceptedByOngPhone: '(11) 98765-4321',
    acceptedByOngEmail: 'acolhimento@amigosdepatas.org.br',
    acceptedByOngAddress: 'Av. Paulista, 1200 - Bela Vista, São Paulo - SP',
    acceptedAt: '2026-08-20T11:00:00Z'
  }
];

export const PARTNERS_LIST: Partner[] = [
  {
    id: 'partner-1',
    name: 'Hospital Veterinário VidaPet 24h',
    category: 'Saúde & Emergência',
    tagline: 'Pronto-atendimento 24h e UTI veterinária completa',
    image: 'https://images.unsplash.com/photo-1628009368231-7bb7cfcb0def?auto=format&fit=crop&w=800&q=80',
    url: 'https://vidapet24h.com.br',
    badge: 'Parceiro Master',
    discountOrBenefit: '15% de desconto para adotantes MatchPet'
  },
  {
    id: 'partner-2',
    name: 'PetShop & Spa Amigo Fiel',
    category: 'Estética & Cuidados',
    tagline: 'Banho relaxante, tosa higiênica e produtos selecionados',
    image: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=800&q=80',
    url: 'https://amigofielpet.com.br',
    badge: 'Banho & Tosa',
    discountOrBenefit: '1º banho cortesia na adoção responsável'
  },
  {
    id: 'partner-3',
    name: 'NutriPet Alimentação Natural',
    category: 'Nutrição Animal',
    tagline: 'Refeições balanceadas, orgânicas e sem conservantes',
    image: 'https://images.unsplash.com/photo-1589924691995-400dc9ecc119?auto=format&fit=crop&w=800&q=80',
    url: 'https://nutripetnatural.com.br',
    badge: '100% Natural',
    discountOrBenefit: 'Cupom R$ 50 no kit boas-vindas'
  }
];
