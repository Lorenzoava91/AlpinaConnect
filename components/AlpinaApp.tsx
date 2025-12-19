import React, { useState } from 'react';
import { Trip, Client, Difficulty, ActivityType, SportsPassport, Review, Guide } from '../types';
import Marketplace from './Marketplace';
import Dashboard from './Dashboard';
import ClientProfile from './ClientProfile';
import { MemoryRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Mountain, LayoutDashboard, Compass, User } from 'lucide-react';

// --- HELPER FOR DYNAMIC DATES ---
const getRelativeDate = (days: number) => {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString().split('T')[0];
};

// --- MOCK DATA ---
const MOCK_REVIEWS: Review[] = [
  {
    id: 'r1',
    authorName: 'Guida Alpina Marco',
    rating: 5,
    comment: 'Cliente eccellente, ottima preparazione fisica e tecnica. Molto rispettoso della montagna.',
    date: '2023-08-10',
    role: 'Guide'
  },
  {
    id: 'r2',
    authorName: 'Guida Luca B.',
    rating: 4,
    comment: 'Buona resistenza, tecnica da affinare sul ripido, ma grande entusiasmo.',
    date: '2023-02-15',
    role: 'Guide'
  }
];

const MOCK_PASSPORT: SportsPassport = {
  level: 'Intermedio',
  verified: true,
  yearsExperience: 5,
  lastAscents: ['Gran Paradiso', 'Breithorn Occidentale', 'Piz Palü'],
  fitnessScore: 85,
  technicalScore: 65
};

const MOCK_CLIENT: Client = {
  id: 'client-1',
  name: 'Marco Rossi',
  email: 'marco@test.com',
  passport: MOCK_PASSPORT,
  billingInfo: {
    address: 'Via delle Alpi 12',
    city: 'Milano',
    zipCode: '20100',
    country: 'Italia',
    taxId: 'RSSMRC80A01H501U'
  },
  reviews: MOCK_REVIEWS,
  transactions: [
    {
      id: 'tx-001',
      date: '2023-12-15',
      description: 'Acconto prenotazione',
      amount: 150,
      type: 'deposit',
      status: 'completed',
      guideName: 'Jean-Pierre Luc',
      tripTitle: 'Freeride a Courmayeur',
      method: 'Credit Card'
    },
    {
      id: 'tx-002',
      date: getRelativeDate(-1), // Yesterday
      description: 'Saldo finale',
      amount: 200,
      type: 'balance',
      status: 'pending',
      guideName: 'Jean-Pierre Luc',
      tripTitle: 'Freeride a Courmayeur',
      method: 'Bank Transfer'
    },
    {
      id: 'tx-003',
      date: '2023-11-20',
      description: 'Pagamento completo',
      amount: 360,
      type: 'full_payment',
      status: 'completed',
      guideName: 'Sara Conti',
      tripTitle: 'Corso Base Arrampicata',
      method: 'Apple Pay'
    },
    {
      id: 'tx-004',
      date: '2023-10-05',
      description: 'Rimborso per maltempo',
      amount: 120,
      type: 'refund',
      status: 'completed',
      guideName: 'Marco Belli',
      tripTitle: 'Canyoning Val Bodengo',
      method: 'Credit Card'
    }
  ]
};

const SECOND_CLIENT: Client = {
  id: 'client-2',
  name: 'Elena Bianchi',
  email: 'elena@test.com',
  passport: { ...MOCK_PASSPORT, level: 'Esperto', yearsExperience: 8 },
  reviews: [],
  requestedDate: getRelativeDate(2),
  transactions: []
};

const THIRD_CLIENT: Client = {
  id: 'client-3',
  name: 'Roberto Verdi',
  email: 'rob@test.com',
  passport: { ...MOCK_PASSPORT, level: 'Principiante', yearsExperience: 1 },
  reviews: [],
  requestedDate: getRelativeDate(5),
  transactions: []
};

const MOCK_GUIDE: Guide = {
  id: 'g1',
  name: 'Jean-Pierre Luc',
  email: 'jp.luc@guidealpine.it',
  phoneNumber: '+39 333 1234567',
  avatar: 'https://ui-avatars.com/api/?name=Jean+Pierre&background=0d9488&color=fff',
  alboNumber: 'IT-AO-1234',
  bio: 'Guida Alpina UIAGM con oltre 15 anni di esperienza. Specializzato in sci alpinismo e alta quota. Vivo a Courmayeur.',
  reviews: [],
  earningsHistory: [
    { month: 'Gen', amount: 3200 },
    { month: 'Feb', amount: 4500 },
    { month: 'Mar', amount: 3800 },
    { month: 'Apr', amount: 2100 },
    { month: 'Mag', amount: 1500 },
    { month: 'Giu', amount: 4200 },
  ],
  marketTrends: [
    { activity: 'Ski Touring', demand: 85 },
    { activity: 'Freeride', demand: 60 },
    { activity: 'Ice Climbing', demand: 30 },
    { activity: 'Alpinismo', demand: 75 },
  ],
  invoices: [
    { id: 'INV-001', clientName: 'Mario Rossi', date: '2024-02-10', amount: 350, status: 'Paid' },
    { id: 'INV-002', clientName: 'Giulia Bianchi', date: '2024-02-15', amount: 400, status: 'Pending' },
    { id: 'INV-003', clientName: 'Team RedBull', date: '2024-01-20', amount: 1200, status: 'Paid' },
  ]
};

const INITIAL_TRIPS: Trip[] = [
  // 1. Courmayeur Freeride
  {
    id: 't1',
    title: 'Freeride a Courmayeur',
    location: 'Courmayeur, AO',
    coordinates: { lat: 45.7969, lng: 6.9672 },
    date: getRelativeDate(2),
    availableFrom: getRelativeDate(-2),
    availableTo: getRelativeDate(25),
    durationDays: 1,
    price: 350,
    difficulty: Difficulty.Hard,
    activityType: ActivityType.SkiTouring,
    description: 'Giornata dedicata al freeride sui pendii del Monte Bianco. Richiesta ottima tecnica di sci fuoripista.',
    equipment: ['ARTVA', 'Pala', 'Sonda', 'Sci larghi'],
    guideId: 'g1',
    guideName: 'Jean-Pierre Luc',
    guideAvatar: 'https://ui-avatars.com/api/?name=Jean+Pierre&background=0d9488&color=fff',
    guideRating: 4.9,
    maxParticipants: 4,
    enrolledClients: [{...SECOND_CLIENT, requestedDate: getRelativeDate(1)}], 
    pendingRequests: [{ ...MOCK_CLIENT, requestedDate: getRelativeDate(2) }],
    image: 'https://images.unsplash.com/photo-1551524559-8af4e6624178?q=80&w=1926&auto=format&fit=crop'
  },
  // 2. Arco Climbing
  {
    id: 't2',
    title: 'Corso Base Arrampicata',
    location: 'Arco, TN',
    coordinates: { lat: 45.9177, lng: 10.8867 },
    date: getRelativeDate(10),
    availableFrom: getRelativeDate(5),
    availableTo: getRelativeDate(60),
    durationDays: 3,
    price: 360,
    difficulty: Difficulty.Easy,
    activityType: ActivityType.Climbing,
    description: 'Impara le basi della sicurezza e del movimento in verticale nella mecca dell\'arrampicata italiana. Corso di 3 giorni.',
    equipment: ['Scarpette', 'Imbrago', 'Casco'],
    guideId: 'g2',
    guideName: 'Sara Conti',
    guideAvatar: 'https://ui-avatars.com/api/?name=Sara+Conti&background=ec4899&color=fff',
    guideRating: 4.8,
    maxParticipants: 6,
    enrolledClients: [],
    pendingRequests: [],
    image: 'https://images.unsplash.com/photo-1522690984813-f9a882d92176?q=80&w=2070&auto=format&fit=crop'
  },
  // 3. Gran Paradiso
  {
    id: 't7',
    title: 'Ascesa al Gran Paradiso',
    location: 'Valsavarenche, AO',
    coordinates: { lat: 45.5204, lng: 7.2662 },
    date: getRelativeDate(1),
    availableFrom: getRelativeDate(0),
    availableTo: getRelativeDate(15),
    durationDays: 2,
    price: 450,
    difficulty: Difficulty.Hard,
    activityType: ActivityType.Mountaineering,
    description: 'L\'unico 4000 interamente italiano. Salita classica dal rifugio Vittorio Emanuele.',
    equipment: ['Ramponi', 'Piccozza', 'Imbrago', 'Casco'],
    guideId: 'g1',
    guideName: 'Jean-Pierre Luc',
    guideAvatar: 'https://ui-avatars.com/api/?name=Jean+Pierre&background=0d9488&color=fff',
    guideRating: 4.9,
    maxParticipants: 4,
    enrolledClients: [{...THIRD_CLIENT, requestedDate: getRelativeDate(1)}],
    pendingRequests: [],
    image: 'https://images.unsplash.com/photo-1655823862283-7d72c833c945?q=80&w=2070&auto=format&fit=crop'
  },
  // 4. Lofoten
  {
    id: 'n1',
    title: 'Lofoten Ski & Sail',
    location: 'Svolvær, Norway',
    coordinates: { lat: 68.2354, lng: 14.5683 },
    date: getRelativeDate(5),
    availableFrom: getRelativeDate(2),
    availableTo: getRelativeDate(60),
    durationDays: 6,
    price: 1800,
    difficulty: Difficulty.Hard,
    activityType: ActivityType.SkiTouring,
    description: 'Una settimana indimenticabile veleggiando tra i fiordi e scendendo montagne che finiscono nel mare. Aurora boreale inclusa.',
    equipment: ['Sci Alpinismo', 'Pala', 'Sonda', 'ARTVA', 'Abbigliamento Artico'],
    guideId: 'g-nor-1',
    guideName: 'Olav Hansen',
    guideAvatar: 'https://ui-avatars.com/api/?name=Olav+Hansen&background=2563eb&color=fff',
    guideRating: 5.0,
    maxParticipants: 8,
    enrolledClients: [],
    pendingRequests: [{...SECOND_CLIENT, requestedDate: getRelativeDate(5)}],
    image: 'https://images.unsplash.com/photo-1517926863004-98425e404b90?q=80&w=2066&auto=format&fit=crop'
  },
  // 5. Lyngen Alps
  {
    id: 'n2',
    title: 'Lyngen Alps Traverse',
    location: 'Tromsø, Norway',
    coordinates: { lat: 69.6492, lng: 18.9553 },
    date: getRelativeDate(12),
    availableFrom: getRelativeDate(10),
    availableTo: getRelativeDate(90),
    durationDays: 4,
    price: 950,
    difficulty: Difficulty.Expert,
    activityType: ActivityType.SkiTouring,
    description: 'Scialpinismo nelle remote Alpi di Lyngen. Pendii ripidi e neve polverosa garantita.',
    equipment: ['Sci Alpinismo', 'Rampanti', 'Piccozza'],
    guideId: 'g-nor-1',
    guideName: 'Olav Hansen',
    guideAvatar: 'https://ui-avatars.com/api/?name=Olav+Hansen&background=2563eb&color=fff',
    guideRating: 5.0,
    maxParticipants: 4,
    enrolledClients: [],
    pendingRequests: [],
    image: 'https://images.unsplash.com/photo-1621689252358-6931557d1958?q=80&w=2070&auto=format&fit=crop'
  },
  // 6. Cinque Torri
  {
    id: 't8',
    title: 'Arrampicata Cinque Torri',
    location: 'Cortina d\'Ampezzo, BL',
    coordinates: { lat: 46.5094, lng: 12.0558 },
    date: getRelativeDate(3),
    availableFrom: getRelativeDate(1),
    availableTo: getRelativeDate(30),
    durationDays: 1,
    price: 280,
    difficulty: Difficulty.Moderate,
    activityType: ActivityType.Climbing,
    description: 'Giornata di arrampicata in uno degli scenari più iconici delle Dolomiti.',
    equipment: ['Scarpette', 'Imbrago', 'Casco'],
    guideId: 'g3',
    guideName: 'Marco Belli',
    guideAvatar: 'https://ui-avatars.com/api/?name=Marco+Belli&background=f97316&color=fff',
    guideRating: 4.9,
    maxParticipants: 2,
    enrolledClients: [],
    pendingRequests: [{...SECOND_CLIENT, requestedDate: getRelativeDate(3)}],
    image: 'https://images.unsplash.com/photo-1566807952763-d345a0eb3c42?q=80&w=2072&auto=format&fit=crop'
  },
  // 7. Tre Cime di Lavaredo
  {
    id: 't9',
    title: 'Giro delle Tre Cime',
    location: 'Auronzo di Cadore, BL',
    coordinates: { lat: 46.6187, lng: 12.3023 },
    date: getRelativeDate(4),
    availableFrom: getRelativeDate(1),
    availableTo: getRelativeDate(45),
    durationDays: 1,
    price: 150,
    difficulty: Difficulty.Easy,
    activityType: ActivityType.Hiking,
    description: 'Trekking panoramico attorno alle iconiche Tre Cime di Lavaredo. Adatto a tutti.',
    equipment: ['Scarponi', 'Zaino', 'Giacca a vento'],
    guideId: 'g3',
    guideName: 'Marco Belli',
    guideAvatar: 'https://ui-avatars.com/api/?name=Marco+Belli&background=f97316&color=fff',
    guideRating: 4.9,
    maxParticipants: 8,
    enrolledClients: [],
    pendingRequests: [],
    image: 'https://images.unsplash.com/photo-1629124450379-b1d55694c965?q=80&w=2070&auto=format&fit=crop'
  },
  // 8. Marmolada
  {
    id: 't10',
    title: 'Marmolada Skitour',
    location: 'Malga Ciapela, BL',
    coordinates: { lat: 46.4340, lng: 11.8659 },
    date: getRelativeDate(6),
    availableFrom: getRelativeDate(2),
    availableTo: getRelativeDate(20),
    durationDays: 1,
    price: 220,
    difficulty: Difficulty.Moderate,
    activityType: ActivityType.SkiTouring,
    description: 'Scialpinismo sulla Regina delle Dolomiti fino a Punta Penia.',
    equipment: ['Sci Alpinismo', 'Ramponi', 'Imbrago'],
    guideId: 'g3',
    guideName: 'Marco Belli',
    guideAvatar: 'https://ui-avatars.com/api/?name=Marco+Belli&background=f97316&color=fff',
    guideRating: 4.9,
    maxParticipants: 5,
    enrolledClients: [],
    pendingRequests: [],
    image: 'https://images.unsplash.com/photo-1549880181-56a44cf4a9a5?q=80&w=2070&auto=format&fit=crop'
  },
  // 9. Monviso
  {
    id: 't11',
    title: 'Re di Pietra - Monviso',
    location: 'Crissolo, CN',
    coordinates: { lat: 44.6677, lng: 7.0906 },
    date: getRelativeDate(15),
    availableFrom: getRelativeDate(10),
    availableTo: getRelativeDate(60),
    durationDays: 2,
    price: 550,
    difficulty: Difficulty.Hard,
    activityType: ActivityType.Mountaineering,
    description: 'Ascesa alla vetta del Monviso per la via Normale. Richiede buon allenamento.',
    equipment: ['Ramponi', 'Casco', 'Imbrago', 'Corda'],
    guideId: 'g1',
    guideName: 'Jean-Pierre Luc',
    guideAvatar: 'https://ui-avatars.com/api/?name=Jean+Pierre&background=0d9488&color=fff',
    guideRating: 4.9,
    maxParticipants: 2,
    enrolledClients: [],
    pendingRequests: [],
    image: 'https://images.unsplash.com/photo-1685375545226-0e9e1c3a6473?q=80&w=2070&auto=format&fit=crop'
  },
  // 10. Etna Sci
  {
    id: 't12',
    title: 'Etna Volcano Ski',
    location: 'Nicolosi, CT',
    coordinates: { lat: 37.7510, lng: 14.9934 },
    date: getRelativeDate(7),
    availableFrom: getRelativeDate(1),
    availableTo: getRelativeDate(30),
    durationDays: 1,
    price: 180,
    difficulty: Difficulty.Moderate,
    activityType: ActivityType.SkiTouring,
    description: 'Un\'esperienza unica: sciare su un vulcano attivo con vista mare.',
    equipment: ['Sci Alpinismo', 'Pelli', 'Giacca a vento'],
    guideId: 'g4',
    guideName: 'Giuseppe Rossi',
    guideAvatar: 'https://ui-avatars.com/api/?name=Giuseppe+Rossi&background=ef4444&color=fff',
    guideRating: 5.0,
    maxParticipants: 6,
    enrolledClients: [],
    pendingRequests: [],
    image: 'https://images.unsplash.com/photo-1614093259344-3c6f966b933d?q=80&w=2070&auto=format&fit=crop'
  },
  // 11. Val di Mello
  {
    id: 't13',
    title: 'Bouldering Val di Mello',
    location: 'Val Masino, SO',
    coordinates: { lat: 46.2570, lng: 9.6358 },
    date: getRelativeDate(8),
    availableFrom: getRelativeDate(1),
    availableTo: getRelativeDate(90),
    durationDays: 2,
    price: 200,
    difficulty: Difficulty.Moderate,
    activityType: ActivityType.Climbing,
    description: 'Weekend dedicato al bouldering nella "Yosemite Italiana".',
    equipment: ['Scarpette', 'Crash Pad (incluso)', 'Magnesite'],
    guideId: 'g2',
    guideName: 'Sara Conti',
    guideAvatar: 'https://ui-avatars.com/api/?name=Sara+Conti&background=ec4899&color=fff',
    guideRating: 4.8,
    maxParticipants: 8,
    enrolledClients: [],
    pendingRequests: [],
    image: 'https://images.unsplash.com/photo-1564417728475-4316d3f3f273?q=80&w=1974&auto=format&fit=crop'
  },
  // 12. Finale Ligure
  {
    id: 't14',
    title: 'Climbing Finale Ligure',
    location: 'Finale Ligure, SV',
    coordinates: { lat: 44.1705, lng: 8.3438 },
    date: getRelativeDate(5),
    availableFrom: getRelativeDate(1),
    availableTo: getRelativeDate(120),
    durationDays: 2,
    price: 250,
    difficulty: Difficulty.Moderate,
    activityType: ActivityType.Climbing,
    description: 'Arrampicata su calcare vista mare. Perfetto per perfezionare la tecnica.',
    equipment: ['Scarpette', 'Imbrago', 'Corda'],
    guideId: 'g2',
    guideName: 'Sara Conti',
    guideAvatar: 'https://ui-avatars.com/api/?name=Sara+Conti&background=ec4899&color=fff',
    guideRating: 4.8,
    maxParticipants: 6,
    enrolledClients: [],
    pendingRequests: [],
    image: 'https://images.unsplash.com/photo-1678129088686-2580a8270d19?q=80&w=2070&auto=format&fit=crop'
  },
  // 13. Adamello
  {
    id: 't15',
    title: 'Traversata dell\'Adamello',
    location: 'Ponte di Legno, BS',
    coordinates: { lat: 46.2163, lng: 10.5513 },
    date: getRelativeDate(20),
    availableFrom: getRelativeDate(15),
    availableTo: getRelativeDate(45),
    durationDays: 2,
    price: 400,
    difficulty: Difficulty.Hard,
    activityType: ActivityType.SkiTouring,
    description: 'Il più grande ghiacciaio delle Alpi Italiane. Notte al rifugio ai Caduti dell\'Adamello.',
    equipment: ['Sci Alpinismo', 'Ramponi', 'Piccozza'],
    guideId: 'g3',
    guideName: 'Marco Belli',
    guideAvatar: 'https://ui-avatars.com/api/?name=Marco+Belli&background=f97316&color=fff',
    guideRating: 4.9,
    maxParticipants: 4,
    enrolledClients: [],
    pendingRequests: [],
    image: 'https://images.unsplash.com/photo-1547627407-37c223a2a688?q=80&w=2070&auto=format&fit=crop'
  },
  // 14. Monte Rosa
  {
    id: 't16',
    title: 'Capanna Margherita 4554m',
    location: 'Alagna Valsesia, VC',
    coordinates: { lat: 45.9288, lng: 7.8741 },
    date: getRelativeDate(25),
    availableFrom: getRelativeDate(20),
    availableTo: getRelativeDate(80),
    durationDays: 2,
    price: 500,
    difficulty: Difficulty.Hard,
    activityType: ActivityType.Mountaineering,
    description: 'Salita al rifugio più alto d\'Europa. Panorama mozzafiato su tutte le Alpi.',
    equipment: ['Ramponi', 'Piccozza', 'Imbrago', 'Abbigliamento Caldo'],
    guideId: 'g1',
    guideName: 'Jean-Pierre Luc',
    guideAvatar: 'https://ui-avatars.com/api/?name=Jean+Pierre&background=0d9488&color=fff',
    guideRating: 4.9,
    maxParticipants: 3,
    enrolledClients: [],
    pendingRequests: [],
    image: 'https://images.unsplash.com/photo-1517457904328-984f885f8f87?q=80&w=2071&auto=format&fit=crop'
  },
  // 15. Cervino
  {
    id: 't17',
    title: 'Cervino - Via Italiana',
    location: 'Breuil-Cervinia, AO',
    coordinates: { lat: 45.9766, lng: 7.6585 },
    date: getRelativeDate(30),
    availableFrom: getRelativeDate(25),
    availableTo: getRelativeDate(60),
    durationDays: 2,
    price: 1300,
    difficulty: Difficulty.Expert,
    activityType: ActivityType.Mountaineering,
    description: 'La montagna più iconica. Salita per la cresta del Leone. Solo per alpinisti esperti.',
    equipment: ['Ramponi', 'Piccozza', 'Casco', 'Imbrago'],
    guideId: 'g1',
    guideName: 'Jean-Pierre Luc',
    guideAvatar: 'https://ui-avatars.com/api/?name=Jean+Pierre&background=0d9488&color=fff',
    guideRating: 4.9,
    maxParticipants: 1,
    enrolledClients: [],
    pendingRequests: [],
    image: 'https://images.unsplash.com/photo-1506540209455-2244249be50c?q=80&w=1974&auto=format&fit=crop'
  },
  // 16. Brenta Ferrata
  {
    id: 't18',
    title: 'Via delle Bocchette',
    location: 'Madonna di Campiglio, TN',
    coordinates: { lat: 46.1738, lng: 10.8876 },
    date: getRelativeDate(14),
    availableFrom: getRelativeDate(10),
    availableTo: getRelativeDate(90),
    durationDays: 3,
    price: 600,
    difficulty: Difficulty.Moderate,
    activityType: ActivityType.Hiking,
    description: 'Il trekking su via ferrata più famoso delle Dolomiti. Spettacolare e aereo.',
    equipment: ['Kit Ferrata', 'Imbrago', 'Casco', 'Guanti'],
    guideId: 'g3',
    guideName: 'Marco Belli',
    guideAvatar: 'https://ui-avatars.com/api/?name=Marco+Belli&background=f97316&color=fff',
    guideRating: 4.9,
    maxParticipants: 5,
    enrolledClients: [],
    pendingRequests: [],
    image: 'https://images.unsplash.com/photo-1585560667746-857c74233266?q=80&w=2070&auto=format&fit=crop'
  },
  // 17. Selvaggio Blu
  {
    id: 't19',
    title: 'Selvaggio Blu Trek',
    location: 'Baunei, NU',
    coordinates: { lat: 40.0905, lng: 9.6865 },
    date: getRelativeDate(40),
    availableFrom: getRelativeDate(30),
    availableTo: getRelativeDate(120),
    durationDays: 5,
    price: 900,
    difficulty: Difficulty.Hard,
    activityType: ActivityType.Hiking,
    description: 'Il trekking più difficile d\'Italia. Falesie a picco sul mare e notti sotto le stelle.',
    equipment: ['Sacco a pelo', 'Zaino 50L', 'Imbrago'],
    guideId: 'g2',
    guideName: 'Sara Conti',
    guideAvatar: 'https://ui-avatars.com/api/?name=Sara+Conti&background=ec4899&color=fff',
    guideRating: 4.8,
    maxParticipants: 8,
    enrolledClients: [],
    pendingRequests: [],
    image: 'https://images.unsplash.com/photo-1554303387-a25e197593c6?q=80&w=1953&auto=format&fit=crop'
  },
  // 18. Pizzo Coca
  {
    id: 't20',
    title: 'Pizzo Coca - Orobie',
    location: 'Valbondione, BG',
    coordinates: { lat: 46.0694, lng: 10.0135 },
    date: getRelativeDate(9),
    availableFrom: getRelativeDate(5),
    availableTo: getRelativeDate(40),
    durationDays: 2,
    price: 250,
    difficulty: Difficulty.Moderate,
    activityType: ActivityType.Hiking,
    description: 'La vetta più alta delle Orobie Bergamasche. Ambiente selvaggio e stambecchi garantiti.',
    equipment: ['Scarponi', 'Bastoncini'],
    guideId: 'g5',
    guideName: 'Luca Ferrari',
    guideAvatar: 'https://ui-avatars.com/api/?name=Luca+Ferrari&background=8b5cf6&color=fff',
    guideRating: 4.7,
    maxParticipants: 6,
    enrolledClients: [],
    pendingRequests: [],
    image: 'https://images.unsplash.com/photo-1491553895911-0055eca6402d?q=80&w=2080&auto=format&fit=crop'
  },
  // 19. Gran Sasso
  {
    id: 't21',
    title: 'Corno Grande Direttissima',
    location: 'Assergi, AQ',
    coordinates: { lat: 42.4578, lng: 13.5658 },
    date: getRelativeDate(11),
    availableFrom: getRelativeDate(5),
    availableTo: getRelativeDate(60),
    durationDays: 1,
    price: 180,
    difficulty: Difficulty.Moderate,
    activityType: ActivityType.Mountaineering,
    description: 'Salita alla vetta più alta degli Appennini per la Direttissima.',
    equipment: ['Casco', 'Scarponi Rigidi'],
    guideId: 'g4',
    guideName: 'Giuseppe Rossi',
    guideAvatar: 'https://ui-avatars.com/api/?name=Giuseppe+Rossi&background=ef4444&color=fff',
    guideRating: 5.0,
    maxParticipants: 4,
    enrolledClients: [],
    pendingRequests: [],
    image: 'https://images.unsplash.com/photo-1629737116773-4556488a0e86?q=80&w=2070&auto=format&fit=crop'
  },
  // 20. Majella
  {
    id: 't22',
    title: 'Scialpinismo Majella',
    location: 'Caramanico Terme, PE',
    coordinates: { lat: 42.1583, lng: 14.0044 },
    date: getRelativeDate(5),
    availableFrom: getRelativeDate(1),
    availableTo: getRelativeDate(30),
    durationDays: 1,
    price: 160,
    difficulty: Difficulty.Moderate,
    activityType: ActivityType.SkiTouring,
    description: 'Sciare vista mare sulla "Montagna Madre" d\'Abruzzo. Canali entusiasmanti.',
    equipment: ['Sci Alpinismo', 'ARTVA'],
    guideId: 'g4',
    guideName: 'Giuseppe Rossi',
    guideAvatar: 'https://ui-avatars.com/api/?name=Giuseppe+Rossi&background=ef4444&color=fff',
    guideRating: 5.0,
    maxParticipants: 6,
    enrolledClients: [],
    pendingRequests: [],
    image: 'https://images.unsplash.com/photo-1662582847120-c73e16440c94?q=80&w=2070&auto=format&fit=crop'
  },
  // 21. Val Grande
  {
    id: 't23',
    title: 'Wild Val Grande',
    location: 'Verbania, VB',
    coordinates: { lat: 46.0374, lng: 8.5204 },
    date: getRelativeDate(18),
    availableFrom: getRelativeDate(15),
    availableTo: getRelativeDate(90),
    durationDays: 3,
    price: 350,
    difficulty: Difficulty.Hard,
    activityType: ActivityType.Hiking,
    description: 'Attraversata dell\'area wilderness più grande d\'Italia. Per chi cerca l\'avventura vera.',
    equipment: ['Sacco a pelo', 'Fornelletto', 'Tenda'],
    guideId: 'g5',
    guideName: 'Luca Ferrari',
    guideAvatar: 'https://ui-avatars.com/api/?name=Luca+Ferrari&background=8b5cf6&color=fff',
    guideRating: 4.7,
    maxParticipants: 6,
    enrolledClients: [],
    pendingRequests: [],
    image: 'https://images.unsplash.com/photo-1502472584811-0a2f2ca84465?q=80&w=2069&auto=format&fit=crop'
  },
  // 22. Dolomiti Friulane
  {
    id: 't24',
    title: 'Campanile di Val Montanaia',
    location: 'Cimolais, PN',
    coordinates: { lat: 46.3888, lng: 12.4497 },
    date: getRelativeDate(22),
    availableFrom: getRelativeDate(15),
    availableTo: getRelativeDate(60),
    durationDays: 2,
    price: 400,
    difficulty: Difficulty.Hard,
    activityType: ActivityType.Climbing,
    description: 'L\'urlo di pietra. Una guglia isolata in uno dei luoghi più selvaggi delle Dolomiti.',
    equipment: ['Scarpette', 'Imbrago', 'Casco', 'Corda Doppia'],
    guideId: 'g3',
    guideName: 'Marco Belli',
    guideAvatar: 'https://ui-avatars.com/api/?name=Marco+Belli&background=f97316&color=fff',
    guideRating: 4.9,
    maxParticipants: 2,
    enrolledClients: [],
    pendingRequests: [],
    image: 'https://images.unsplash.com/photo-1469395279261-396566cb2573?q=80&w=2070&auto=format&fit=crop'
  },
  // 23. Gole Alcantara
  {
    id: 't25',
    title: 'Canyoning Gole Alcantara',
    location: 'Motta Camastra, ME',
    coordinates: { lat: 37.8780, lng: 15.1764 },
    date: getRelativeDate(15),
    availableFrom: getRelativeDate(10),
    availableTo: getRelativeDate(90),
    durationDays: 1,
    price: 80,
    difficulty: Difficulty.Easy,
    activityType: ActivityType.Canyoning,
    description: 'Discesa fluviale tra le incredibili pareti di basalto lavico.',
    equipment: ['Muta (inclusa)', 'Casco (incluso)'],
    guideId: 'g4',
    guideName: 'Giuseppe Rossi',
    guideAvatar: 'https://ui-avatars.com/api/?name=Giuseppe+Rossi&background=ef4444&color=fff',
    guideRating: 5.0,
    maxParticipants: 10,
    enrolledClients: [],
    pendingRequests: [],
    image: 'https://images.unsplash.com/photo-1626943891465-b7470f7d5448?q=80&w=2070&auto=format&fit=crop'
  },
  // 24. Val Bodengo
  {
    id: 't26',
    title: 'Canyoning Val Bodengo',
    location: 'Gordona, SO',
    coordinates: { lat: 46.2848, lng: 9.3567 },
    date: getRelativeDate(30),
    availableFrom: getRelativeDate(20),
    availableTo: getRelativeDate(60),
    durationDays: 1,
    price: 90,
    difficulty: Difficulty.Moderate,
    activityType: ActivityType.Canyoning,
    description: 'Tuffi e toboga in acque cristalline. Divertimento puro in Valchiavenna.',
    equipment: ['Muta', 'Imbrago', 'Casco'],
    guideId: 'g5',
    guideName: 'Luca Ferrari',
    guideAvatar: 'https://ui-avatars.com/api/?name=Luca+Ferrari&background=8b5cf6&color=fff',
    guideRating: 4.7,
    maxParticipants: 8,
    enrolledClients: [],
    pendingRequests: [],
    image: 'https://images.unsplash.com/photo-1596395349146-5ec91a108b97?q=80&w=2070&auto=format&fit=crop'
  },
  // 25. Ortles
  {
    id: 't27',
    title: 'Ortles - Via Normale',
    location: 'Solda, BZ',
    coordinates: { lat: 46.5244, lng: 10.5516 },
    date: getRelativeDate(28),
    availableFrom: getRelativeDate(20),
    availableTo: getRelativeDate(70),
    durationDays: 2,
    price: 550,
    difficulty: Difficulty.Hard,
    activityType: ActivityType.Mountaineering,
    description: 'La cima più alta dell\'Alto Adige (3905m). Un grande classico dell\'alpinismo.',
    equipment: ['Ramponi', 'Piccozza', 'Corda'],
    guideId: 'g2',
    guideName: 'Sara Conti',
    guideAvatar: 'https://ui-avatars.com/api/?name=Sara+Conti&background=ec4899&color=fff',
    guideRating: 4.8,
    maxParticipants: 2,
    enrolledClients: [],
    pendingRequests: [],
    image: 'https://images.unsplash.com/photo-1502404618037-975949d838c6?q=80&w=2070&auto=format&fit=crop'
  }
];

const Navbar = ({ lang }: { lang: 'it' | 'en' }) => {
  const location = useLocation();
  const isDashboard = location.pathname === '/dashboard';
  const isProfile = location.pathname === '/profile';

  const t = {
    it: {
      market: "Marketplace",
      guideArea: "Area Guide"
    },
    en: {
      market: "Marketplace",
      guideArea: "Guide Area"
    }
  }[lang];

  return (
    <nav className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-200/50 supports-[backdrop-filter]:bg-white/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="bg-slate-900 p-1.5 rounded-lg text-white transition-transform group-hover:scale-110 duration-300">
              <Mountain size={20} strokeWidth={2.5} />
            </div>
            <span className="font-bold text-xl tracking-tight text-slate-900">AlpinaConnect</span>
          </Link>
          
          <div className="flex items-center gap-2 md:gap-4">
            <Link 
              to="/" 
              className={`flex items-center gap-2 px-3 py-2 rounded-full text-sm font-medium transition-all ${!isDashboard && !isProfile ? 'bg-slate-100 text-slate-900' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'}`}
            >
              <Compass size={18} /> <span className="hidden md:inline">{t.market}</span>
            </Link>
            
            <Link 
              to="/dashboard" 
              className={`flex items-center gap-2 px-3 py-2 rounded-full text-sm font-medium transition-all ${isDashboard ? 'bg-slate-100 text-slate-900' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'}`}
            >
              <LayoutDashboard size={18} /> <span className="hidden md:inline">{t.guideArea}</span>
            </Link>

            <div className="h-6 w-px bg-slate-200 mx-1"></div>

            <Link 
              to="/profile" 
              className={`flex items-center gap-2 transition-all pl-2 ${isProfile ? 'opacity-100' : 'opacity-70 hover:opacity-100'}`}
            >
               <span className="hidden md:block text-sm font-semibold text-slate-700">{MOCK_CLIENT.name.split(' ')[0]}</span>
              <div className={`w-9 h-9 rounded-full bg-slate-200 text-white flex items-center justify-center overflow-hidden border-2 ${isProfile ? 'border-slate-900' : 'border-transparent'}`}>
                <img src={`https://ui-avatars.com/api/?name=${MOCK_CLIENT.name}&background=0f172a&color=fff&size=100`} alt="Profile" />
              </div>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

interface Props {
  lang?: 'it' | 'en';
}

const AlpinaApp: React.FC<Props> = ({ lang = 'it' }) => {
  const [trips, setTrips] = useState<Trip[]>(INITIAL_TRIPS);

  const handleAddTrip = (newTrip: Trip) => {
    setTrips([...trips, newTrip]);
  };

  const handleRequestJoin = (tripId: string, date: string) => {
    setTrips(prev => prev.map(t => {
      if (t.id === tripId) {
        if (t.pendingRequests.find(c => c.id === MOCK_CLIENT.id) || t.enrolledClients.find(c => c.id === MOCK_CLIENT.id)) {
           alert(lang === 'it' ? "Hai già inviato una richiesta per questa attività!" : "You have already sent a request for this activity!");
           return t;
        }
        
        const clientWithDate = { ...MOCK_CLIENT, requestedDate: date };
        alert(lang === 'it' ? `Richiesta inviata per il ${date}! La guida verificherà la disponibilità.` : `Request sent for ${date}! The guide will check availability.`);
        
        return { ...t, pendingRequests: [...t.pendingRequests, clientWithDate] };
      }
      return t;
    }));
  };

  const handleApproveRequest = (tripId: string, client: Client) => {
    setTrips(prev => prev.map(t => {
      if (t.id === tripId) {
        return {
          ...t,
          pendingRequests: t.pendingRequests.filter(c => c.id !== client.id),
          enrolledClients: [...t.enrolledClients, client]
        };
      }
      return t;
    }));
  };

  return (
    <MemoryRouter>
      <div className="h-full bg-zinc-50 font-sans selection:bg-slate-200 overflow-y-auto">
        <Navbar lang={lang} />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Routes>
            <Route path="/" element={<Marketplace trips={trips} onRequestJoin={handleRequestJoin} lang={lang} />} />
            <Route path="/dashboard" element={<Dashboard trips={trips} onAddTrip={handleAddTrip} onApproveRequest={handleApproveRequest} guide={MOCK_GUIDE} lang={lang} />} />
            <Route path="/profile" element={<ClientProfile client={MOCK_CLIENT} lang={lang} />} />
          </Routes>
        </main>
      </div>
    </MemoryRouter>
  );
};

export default AlpinaApp;