export type Species = 'Cachorro' | 'Gato' | 'Outro';
export type Size = 'Pequeno' | 'Médio' | 'Grande' | 'Médio/Grande';
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

export interface Pet {
  id: string;
  name: string;
  species: Species;
  breed: string;
  city: string;
  state: string;
  age: string;
  ageGroup: AgeGroup;
  gender: Gender;
  size: Size;
  color: string;
  vaccination: string;
  castrated: boolean;
  dewormed?: boolean;
  specialNeeds?: boolean;
  temperament: string[];
  mainImage: string;
  galleryImages?: string[];
  story: string[];
  ongId: string;
  ongName: string;
  entryDate: string;
  status: 'Disponível' | 'Em Processo' | 'Adotado';
  favorite?: boolean;
}

export interface ONG {
  id: string;
  name: string;
  city: string;
  state: string;
  phone: string;
  image: string;
  description: string;
  petsCount: number;
  featured?: boolean;
}

export interface Solicitation {
  id: string;
  type: 'Visita' | 'Adoção';
  petId: string;
  petName: string;
  requesterName: string;
  dateOrDetails: string;
  status: 'pending' | 'approved' | 'rejected';
  phone?: string;
  email?: string;
}

export interface FosterRequest {
  id: string;
  petName: string;
  species: string;
  reason: string;
  timestamp: string;
  status: 'pending' | 'accepted' | 'declined';
  photoUrl?: string;
  requesterName?: string;
  phone?: string;
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

export type ActiveTab = 'adotar' | 'ongs' | 'como-apoiar' | 'sobre-nos' | 'painel-ong' | 'acolhimento';
