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

export const INITIAL_PETS: Pet[] = [];

export const INITIAL_SOLICITATIONS: Solicitation[] = [];

export const INITIAL_FOSTER_REQUESTS: FosterRequest[] = [];

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
