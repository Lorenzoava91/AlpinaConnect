export enum Difficulty {
  Easy = 'Facile',
  Moderate = 'Intermedio',
  Hard = 'Difficile',
  Expert = 'Estremo'
}

export enum ActivityType {
  SkiTouring = 'Sci Alpinismo',
  Climbing = 'Arrampicata',
  Hiking = 'Trekking',
  Mountaineering = 'Alpinismo',
  Freeride = 'Freeride',
  IceClimbing = 'Cascate di Ghiaccio',
  Canyoning = 'Canyoning'
}

export interface Review {
  id: string;
  authorName: string;
  authorAvatar?: string;
  rating: number; // 1 to 5
  comment: string;
  date: string;
  role: 'Guide' | 'Client';
}

export interface SportsPassport {
  level: string;
  verified: boolean;
  yearsExperience: number;
  lastAscents: string[];
  fitnessScore: number; // 0-100
  technicalScore: number; // 0-100
}

export interface BillingInfo {
  address: string;
  city: string;
  zipCode: string;
  country: string;
  taxId: string; // Codice Fiscale
  vatNumber?: string; // Partita IVA (optional)
  sdiCode?: string; // Codice Univoco
  pec?: string;
}

export interface PaymentTransaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  type: 'deposit' | 'full_payment' | 'refund' | 'balance'; // Acconto, Saldo, Rimborso
  status: 'completed' | 'pending' | 'failed';
  guideName: string;
  tripTitle: string;
  method?: 'Credit Card' | 'Bank Transfer' | 'Apple Pay';
}

export interface Client {
  id: string;
  name: string;
  email: string;
  passport: SportsPassport;
  billingInfo?: BillingInfo;
  reviews: Review[];
  requestedDate?: string; // The date the client wants to book
  transactions: PaymentTransaction[];
}

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface Trip {
  id: string;
  title: string;
  location: string;
  coordinates: Coordinates;
  
  // Availability Logic
  availableFrom: string; // ISO Date YYYY-MM-DD
  availableTo: string;   // ISO Date YYYY-MM-DD
  durationDays: number;
  
  // Legacy/Display date (can be removed later or used as "Season Start")
  date: string; 

  price: number;
  difficulty: Difficulty;
  activityType: ActivityType;
  description: string;
  equipment: string[];
  
  // Guide Info
  guideId: string;
  guideName: string;
  guideAvatar: string;
  guideRating: number;

  image: string;
  maxParticipants: number;
  enrolledClients: Client[];
  pendingRequests: Client[];
}

// Analytics Types
export interface MonthlyEarning {
  month: string;
  amount: number;
}

export interface MarketTrend {
  activity: string;
  demand: number; // 0-100
}

export interface Invoice {
  id: string;
  clientName: string;
  date: string;
  amount: number;
  status: 'Paid' | 'Pending';
}

export interface Guide {
  id: string;
  name: string;
  email: string;
  phoneNumber?: string;
  avatar: string;
  alboNumber: string; // Numero Iscrizione Albo
  bio: string;
  reviews: Review[];
  
  // Analytics Data
  earningsHistory: MonthlyEarning[];
  marketTrends: MarketTrend[];
  invoices: Invoice[];
}