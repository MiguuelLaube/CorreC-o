export type Species = 'Cachorro' | 'Gato' | 'Outro';
export type Size = 'Pequeno' | 'Médio' | 'Grande';
export type Gender = 'Macho' | 'Fêmea';
export type AgeGroup = 'Filhote' | 'Adulto' | 'Idoso';

export type UserRole = 'admin' | 'user';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
  createdAt?: string;
}

export interface OngSession {
  id: string;
  name: string;
  email: string;
  cnpj: string;
  role: 'ong' | 'admin';
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  image?: string;
  description?: string;
  createdAt?: string;
}

export interface AdoptionHistoryEntry {
  id: string;
  date: string;
  type: 'triagem_acolhimento' | 'cadastro_ong' | 'solicitacao_adocao' | 'adocao_aprovada' | 'adocao_negada' | 'edicao_dados';
  title: string;
  description: string;
  actorName?: string;
  actorRole?: 'ong' | 'adotante' | 'admin' | 'sistema';
}

export interface Pet {
  id: string;
  name: string;
  species?: Species;
  breed?: string;
  city?: string;
  state?: string;
  age: string;
  ageGroup?: AgeGroup;
  gender: Gender;
  size: Size;
  color?: string;
  vaccination: string;
  castrated?: boolean;
  dewormed?: boolean;
  specialNeeds?: boolean;
  description?: string;
  mainImage: string;
  galleryImages?: string[];
  ongId?: string;
  ongName?: string;
  entryDate?: string;
  status: 'Disponível' | 'Em Processo' | 'Adotado';
  favorite?: boolean;
  originFosterId?: string;
  adoptionHistory?: AdoptionHistoryEntry[];
}

export interface ONG {
  id: string;
  cnpj: string;
  name: string;
  city: string;
  state: string;
  phone: string;
  image: string;
  description: string;
  petsCount: number;
  featured?: boolean;
  email?: string;
  passwordHash?: string;
  address?: string;
  createdAt?: string;
}

export interface Solicitation {
  id: string;
  type: 'Visita' | 'Adoção' | 'Interesse';
  petId: string;
  petName: string;
  petImage?: string;
  requesterName: string;
  requesterEmail?: string;
  userId?: string;
  dateOrDetails: string;
  status: 'pending' | 'in_review' | 'approved' | 'rejected' | 'completed' | 'canceled';
  phone?: string;
  email?: string;
  ongId?: string;
  ongName?: string;
  ongPhone?: string;
  ongEmail?: string;
  ongAddress?: string;
  adoptionGranted?: boolean;
  housingType?: string;
  hasOtherPets?: string;
  hasChildrenOrElderly?: string;
  hoursAlone?: string;
  visitPreference?: string;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
  rejectedAt?: string;
  rejectionReason?: string;
  dismissedByOng?: boolean;
}

export interface FosterRequest {
  id: string;
  userId?: string;
  petName: string;
  species: string;
  size?: string;
  reason: string;
  timestamp: string;
  status: 'pending' | 'accepted' | 'declined';
  photoUrl?: string;
  galleryUrls?: string[];
  requesterName?: string;
  requesterEmail?: string;
  phone?: string;
  acceptedByOngId?: string;
  acceptedByOngName?: string;
  acceptedByOngPhone?: string;
  acceptedByOngEmail?: string;
  acceptedByOngAddress?: string;
  acceptedAt?: string;
  declinedAt?: string;
  rejectionReason?: string;
  promotedToPetId?: string;
  dismissedByOng?: boolean;
}

export interface Partner {
  id: string;
  name: string;
  category: string;
  tagline: string;
  image: string;
  url: string;
  badge?: string;
  discountOrBenefit?: string;
}

export interface AppNotification {
  id: string;
  userId?: string;
  userEmail?: string;
  ongId?: string;
  title: string;
  message: string;
  type: 'adoption_rejected' | 'adoption_approved' | 'foster_accepted' | 'foster_declined' | 'info';
  relatedId?: string;
  read: boolean;
  createdAt: string;
}

export type ActiveTab =
  | 'adotar'
  | 'ongs'
  | 'como-apoiar'
  | 'sobre-nos'
  | 'minhas-adocoes'
  | 'painel-admin'
  | 'painel-ong'
  | 'acolhimento';
