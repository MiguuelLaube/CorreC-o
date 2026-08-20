import { Pet, ONG, Solicitation, FosterRequest, Partner } from '../types';

export const INITIAL_PETS: Pet[] = [
  {
    id: 'thor',
    name: 'Thor',
    species: 'Cachorro',
    breed: 'Mestiço de Golden Retriever',
    city: 'São Paulo',
    state: 'SP',
    age: 'Aprox. 2 Anos',
    ageGroup: 'Adulto',
    gender: 'Macho',
    size: 'Médio/Grande',
    color: 'Dourado e Branco',
    vaccination: 'Completa',
    castrated: true,
    dewormed: true,
    temperament: ['Dócil', 'Brincalhão', 'Bom com Crianças'],
    mainImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBhmoZIYpAE2ONKirfuZcJWXqW3qZR3OY3bnMbiokAo1HYJX9bKCG_qk1I9SQDZhnWo0LNDGRdC2mkO0TVKZMqCBozPVz80yuk1ggFOsSPsDdzP1MlIElifQ4JD8fXaot92LJWBKulWKZ9YXj-8rIMEId3I5sEEXxl-DXerG0kVX3YwX9YVsF45CG4_-VTgTLEfTwQzmtZ1Ygt6lkDxelsUSXrUXW6oNpu9dLeeaJwJlMJPOlnHu8leKQ',
    galleryImages: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBp4qQKDMA8P6IuDZj-Qq_3PNBjrGmBe8L_p5CmSucjD_7T46g_byZ2WIju0XF_gbdqweMV3N-XhPcOWFZzwA0SYGdqCvABlS7c0TPL2ewszHw1UAR3zoyA0Oq7M2zEphD3By3Mczwqr6aHODa9LP29PGOhzTpo68MQhBh_kzDVr077kf7wNWM2wre4ZrAMf80vn1IkfJCVkgf_txNu2IsllGebB6du8seCKFtPOerXZAzlHZVrQKQZpw',
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBah66qSL4wP2ixJQSUCP3KBunodRDIDq-y4SD0wu0hzqqSHx6XJKdHP1YYxu9RY1Lp6pVQJcnO7WwwKctidwG2KbHPDqoj4QVSp7Jl-o4hVUMpTM7-LJgAWBdqOAyl3aC4DGLxSOhkuQLAkyUSRnaC5GNbEQ1NghyqPyLA8FrZknsOF34_G8x2YdXFs8Ujsq3ma9PkIBB0_0LS7vIRA6NLVJMmC-fF6q4lKGOaeuEiXHvDKLaJEWHirQ',
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCe6DmvfPeA9wDekWnYbeNEzGbkPXLnLKnX3omdAWx3eoRqUal_3DlJLgCdjFlNzJFrsID8GSQ9ICrgJ0LarVwXbVGyFiJkVJaD-KrV0yVvC4HbPOIxSOgGoODy5EeDQ71Q-gwWsFcEVx89r5bNB7AYfxS8VWUw6pAxPYNbl82N9hRZo0WhRj56PZkvTE8TkoynID4yKcUQeUeimivOIpNjI2qCZroykEQH45M7wr7PZcsbEYsBvJMwkw'
    ],
    story: [
      'Thor é um cachorro incrivelmente amoroso que foi resgatado após ser encontrado vagando sozinho próximo a uma rodovia. Apesar do seu início de vida difícil, ele não perdeu a confiança nos humanos. Pelo contrário, ele adora receber carinho na barriga e está sempre pronto para uma brincadeira com bolinhas.',
      'Ele tem muita energia para gastar e seria o companheiro perfeito para uma família ativa que goste de caminhadas ou que tenha um quintal espaçoso. Thor se dá muito bem com outros cachorros e foi testado com crianças, demonstrando ser muito paciente e gentil. Ele já está acostumado a andar na coleira e conhece comandos básicos como "senta" e "fica".'
    ],
    ongId: 'instituto-patinhas-de-ouro',
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
    temperament: ['Dócil', 'Sociável', 'Alegre'],
    mainImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCShgVnQPT5ashrWFhASQOevGW7KKSAiHFyft39pLyB25hJ68R1TWlBsd6xGL_gOqKZI7tG2ZGQHEdr-Ow5MtipJAlcG0C6Q5xRPX8Er7cBWkD9wRegIGeNMyCT1At7xz4gOz-_lQu-pW6O7l908FqRzYjETqHPla1HZFpq8zdwBd8jAtfZcpk-LjUDcYEICcNib8hAb06Ct98IQhFwA7TdgxMOdA8aRjHcm-CO4z4y6S5PKcFwvCuxpQ',
    story: [
      'Caramelo é o clássico e leal vira-lata brasileiro. Foi resgatado em um dia chuvoso e desde então se transformou no xodó de todos no abrigo.',
      'Muito tranquilo dentro de casa, adora um bom cochilo à tarde e passear pela manhã.'
    ],
    ongId: 'amigos-de-patas',
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
    vaccination: 'Completa',
    castrated: true,
    dewormed: true,
    temperament: ['Calma', 'Carinhosa', 'Independente'],
    mainImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDScg8E1wLKoOxssMEgdBxsRf7VmSnckynqN8o93xST5dsliCxCeSpCtKsSHKA61no0VwRgPA-bQsSN8Go5oie71zrSFGhK5XcqoPPLpX_3l3qcW_E1-16oyaAoPrTgNeah6UgEG139u3PORPfqNLAUdiTUAbPwNth-CUHNun2XW6RfDHfPcCHVFwXy0Y3Viu4Y-B7Tfv8skkdwqzseIkyg9JkzeplglMQUooQUNtgCkZYP_AMU0swASQ',
    story: [
      'Luna é uma gatinha majestosa com pelagem branca macia e olhar sereno. Perfeita para apartamentos.',
      'Gosta de lugares altos para observar a casa e ronrona baixinho ao receber cafuné na orelha.'
    ],
    ongId: 'refugio-animal',
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
    city: 'Curitiba',
    state: 'PR',
    age: '3 meses',
    ageGroup: 'Filhote',
    gender: 'Macho',
    size: 'Pequeno',
    color: 'Preto e Branco',
    vaccination: '1ª Dose',
    castrated: false,
    dewormed: true,
    temperament: ['Brincalhão', 'Esperto', 'Curioso'],
    mainImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBEVFfc_G2QZdy7dmmkdS3qUcSTh5vRtT4ekX2CwlC6fjvunQfQbEO3y9SfwvZZABEKg2_z0MlFgZgs-L7oAAjr47kfEgLH4n-Lpk_mEhyw75Bdt0_UhZDYGl6F-nNt8SIIMvbzqGiVLFC1SpRX__vfzlt0ieqJW17g9MUsKU4f_q4ZFV54CJdnTmaxfwMDY5tFBpKDZBtsbv-rLzbkIbBizTyWBvSkXB748jXM050wIAQJm-wMptxC0A',
    story: [
      'Bolinha é pura energia e travessura! Adora correr atrás de folhas secas e brincar de cabo de guerra com brinquedos de corda.',
      'Ideal para tutores que tenham disposição para educar e brincar com um filhote cheio de vitalidade.'
    ],
    ongId: 'sos-focinhos',
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
    vaccination: 'Completa',
    castrated: true,
    dewormed: true,
    specialNeeds: true,
    temperament: ['Tranquilo', 'Sábio', 'Companheiro'],
    mainImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDe_eWX6e87-TqMJYetwbfoT1DaQAd3kxv7pDXX-CaaeN7ivMI9VZOIh2dbNAmthqieTGeAYhpNvWkdER5V1v6C3KZ7jpSeCL5fIK2H2hBVbRCHCKtoq0zSkDyUwJ3ThI5smgQyzzoNNrkjCawM3in5MTz7dRelhnIur0Vqh8vsXW8kGdM6FvznFBzNHTgrwEwIBVXS_dRg6dmW7yshKhy7lSwW96S4FTB57XOcRmo28IasXVFUt4ApGQ',
    story: [
      'Rex é um senhor muito simpático que busca um lar calmo para passar seus anos dourados. Muito educado, não late à toa.',
      'Gosta de caminhadas curtas e confortáveis e aprecia muito uma boa soneca ao lado do tutor.'
    ],
    ongId: 'sos-focinhos',
    ongName: 'SOS Focinhos',
    entryDate: '01/07/2023',
    status: 'Disponível',
    favorite: false
  }
];

export const INITIAL_ONGS: ONG[] = [
  {
    id: 'amigos-de-patas',
    name: 'Amigos de Patas',
    city: 'São Paulo',
    state: 'SP',
    phone: '(11) 98765-4321',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCeLWHs24XaUcWLidTvmpWuyCMw79Zvw3YtCMtvI7QR2MEDwN0zEEk7pBgnaXtzl3m-Ow18esAG9DeT1_Loqm8j6moJmSbj0oF_-aB6alzR1XWIn_UZOKA3kl7fCPNLN6TzmJidMgALYrc-JHjx4_ycMy5pTvzEwjjACU7aeSp6LncJsSlsfJsqdI10izFuoaQbL-UyOyNSmFMS-HR4Y_MSAEyxsF4F_VIM0YoiuWNBBFBhKrJCKWDkkg',
    description: 'Instalações modernas e acolhedoras dedicadas ao resgate, reabilitação física e adoção responsável de cães e gatos.',
    petsCount: 48,
    featured: true
  },
  {
    id: 'refugio-animal',
    name: 'Refúgio Animal',
    city: 'Campinas',
    state: 'SP',
    phone: '(19) 99887-6655',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAal_LQVRsLJrWGjq_JrhZvFhx7n-dYP-JvZClyOqq_ZEuAp1S84ut4ZBNOfu-rgyXrsirPgK0uLSMvxOpFIf0RMdx7d6nb7ne0HnQ33EoiL6hHggD-UVK1M-7xtHv6yhZpm8FsIjZ6UH3q-f_KDCQPRHMUQaGAlFVeby5aHsK4eSmi6dDakTWfPkn8Q4FsmeT_Ide8CU2rb0UU_qqjmaNJhLHIcjoqyXK3ukVqzJgV7dUIJmwrI_BnpQ',
    description: 'Comunidade engajada com equipe veterinária voluntária focada em acolhimento materno e filhotes resgatados.',
    petsCount: 35,
    featured: true
  },
  {
    id: 'sos-focinhos',
    name: 'SOS Focinhos',
    city: 'Rio de Janeiro',
    state: 'RJ',
    phone: '(21) 97766-5544',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAQYINo3Couhtwk7HhwVXJ_pbJsX_-WrHe2Elm23NUr7j_WuvczwXzxoD92dSgn1fjcChWWFj6H_KshQVtC9HRIBOjnbBh4ILrPzx8Tnm05pvXZK9tnoqBXS30eBAYQPTmqMBpa2VJKJJK1dB4ZAXkyoxz0x3QhmeJrJP-BXyDPbp1dok7EGlIID1xSOIhcsmBVkODI3CLBeudf66HlGAsAVyuCrSWkOS-vayA7ZovQudoTzZ8oiouhzw',
    description: 'Resgate urbano e programas intensivos de socialização, adestramento positivo e feiras de adoção semanais.',
    petsCount: 59,
    featured: true
  },
  {
    id: 'instituto-patinhas-de-ouro',
    name: 'Instituto Patinhas de Ouro',
    city: 'São Paulo',
    state: 'SP',
    phone: '(11) 97123-9988',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCeLWHs24XaUcWLidTvmpWuyCMw79Zvw3YtCMtvI7QR2MEDwN0zEEk7pBgnaXtzl3m-Ow18esAG9DeT1_Loqm8j6moJmSbj0oF_-aB6alzR1XWIn_UZOKA3kl7fCPNLN6TzmJidMgALYrc-JHjx4_ycMy5pTvzEwjjACU7aeSp6LncJsSlsfJsqdI10izFuoaQbL-UyOyNSmFMS-HR4Y_MSAEyxsF4F_VIM0YoiuWNBBFBhKrJCKWDkkg',
    description: 'Especializada no resgate e recuperação de cães de médio e grande porte, com infraestrutura de recreação.',
    petsCount: 22
  }
];

export const INITIAL_SOLICITATIONS: Solicitation[] = [
  {
    id: 'sol-1',
    type: 'Visita',
    petId: 'bolinha',
    petName: 'Bolinha',
    requesterName: 'João Silva',
    dateOrDetails: 'Sábado, 14h',
    status: 'pending',
    phone: '(11) 98112-3344',
    email: 'joao.silva@email.com'
  },
  {
    id: 'sol-2',
    type: 'Adoção',
    petId: 'luna',
    petName: 'Luna',
    requesterName: 'Maria Oliveira',
    dateOrDetails: 'Formulário preenchido (Apto telado, sem outros pets)',
    status: 'pending',
    phone: '(19) 99221-7788',
    email: 'maria.oliveira@email.com'
  }
];

export const INITIAL_FOSTER_REQUESTS: FosterRequest[] = [
  {
    id: 'foster-1',
    petName: 'Max',
    species: 'Cachorro',
    reason: 'Mudança de país. Infelizmente terei que me mudar e não posso levar meu cachorro de porte grande.',
    timestamp: 'Hoje, 10:30',
    status: 'pending',
    requesterName: 'Carlos Eduardo',
    phone: '(11) 97722-1199'
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
    discountOrBenefit: '15% de desconto para adotantes CorrenteCão'
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
  },
  {
    id: 'partner-4',
    name: 'VetCare Centro Diagnóstico',
    category: 'Exames & Diagnósticos',
    tagline: 'Ultrassom, raio-x digital e exames laboratoriais rápidos',
    image: 'https://images.unsplash.com/photo-1576201836106-db1758fd1c97?auto=format&fit=crop&w=800&q=80',
    url: 'https://vetcarediagnosticos.com.br',
    badge: 'Clínica Parceira',
    discountOrBenefit: 'Checkup preventivo com valor social'
  },
  {
    id: 'partner-5',
    name: 'DogResort & Creche Recreativa',
    category: 'Hotelzinho & Daycare',
    tagline: 'Área verde de 2.000m² com monitores e piscina pet',
    image: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=800&q=80',
    url: 'https://dogresortpark.com.br',
    badge: 'Lazer & Hospedagem',
    discountOrBenefit: '2 dias de daycare experimental grátis'
  },
  {
    id: 'partner-6',
    name: 'PetMóvel Resgate & Táxi Pet',
    category: 'Transporte Seguro',
    tagline: 'Veículos climatizados com caixas de transporte certificadas',
    image: 'https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?auto=format&fit=crop&w=800&q=80',
    url: 'https://petmoveltransporte.com.br',
    badge: 'Mobilidade Pet',
    discountOrBenefit: 'Transporte gratuito no dia da adoção'
  },
  {
    id: 'partner-7',
    name: 'BioPharma Manipulação Veterinária',
    category: 'Farmácia Veterinária',
    tagline: 'Medicamentos manipulados em biscoitos e pastas palatáveis',
    image: 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?auto=format&fit=crop&w=800&q=80',
    url: 'https://biopharmavet.com.br',
    badge: 'Manipulação',
    discountOrBenefit: '10% de desconto em fórmulas contínuas'
  },
  {
    id: 'partner-8',
    name: 'EducaCão Comportamento Animal',
    category: 'Adestramento Positivo',
    tagline: 'Treinamentos com reforço positivo para adaptação ao novo lar',
    image: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?auto=format&fit=crop&w=800&q=80',
    url: 'https://educacaoanimal.com.br',
    badge: 'Comportamental',
    discountOrBenefit: 'Consultoria de adaptação gratuita'
  }
];
