import React, { useState } from 'react';
import { Client, BillingInfo } from '../types';
import { MapPin, Calendar, Camera, Activity, Award, Link as LinkIcon, Smartphone, Mountain, Settings, Plus, User, Shield, CreditCard, Save, MessageSquare, Quote, Wallet, Clock, ArrowDownLeft, ArrowUpRight, CheckCircle2 } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

interface Props {
  client: Client;
  lang: 'it' | 'en';
}

// --- MOCK DATA ---
const mockStravaData = [
  { time: '0h', alt: 1200, hr: 90 },
  { time: '1h', alt: 1600, hr: 135 },
  { time: '2h', alt: 2100, hr: 155 },
  { time: '3h', alt: 2800, hr: 162 },
  { time: '4h', alt: 2200, hr: 120 },
  { time: '5h', alt: 1200, hr: 100 },
];

const mockGallery = [
  'https://images.unsplash.com/photo-1522690984813-f9a882d92176?q=80&w=600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1551524559-8af4e6624178?q=80&w=600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5?q=80&w=600&auto=format&fit=crop',
];

interface ActivityLog {
  id: string | number;
  title: string;
  date: string;
  location: string;
  type: 'guided' | 'personal';
  guideName?: string;
  stats?: string;
}

const initialActivities: ActivityLog[] = [
  { id: 1, title: 'Gran Paradiso Vetta', date: '2023-07-15', guideName: 'Mario Rossi', location: 'Valsavarenche', type: 'guided', stats: '1300m d+' },
  { id: 2, title: 'Corso Ghiaccio Base', date: '2023-02-02', guideName: 'Luca Bianchi', location: 'Cogne', type: 'guided' },
  { id: 3, title: 'Allenamento Sella', date: '2023-11-10', location: 'Dolomiti', type: 'personal', stats: '800m d+' },
];

const ClientProfile: React.FC<Props> = ({ client, lang }) => {
  const [isStravaConnected, setIsStravaConnected] = useState(false);
  const [activeTab, setActiveTab] = useState<'journal' | 'media' | 'billing' | 'reviews' | 'payments'>('journal');
  
  // Activity State
  const [activities, setActivities] = useState<ActivityLog[]>(initialActivities);
  const [showActivityModal, setShowActivityModal] = useState(false);
  const [newActivity, setNewActivity] = useState({ title: '', date: '', location: '', stats: '' });

  // Billing State
  const [billingInfo, setBillingInfo] = useState<BillingInfo>(client.billingInfo || {
    address: '', city: '', zipCode: '', country: 'Italia', taxId: '', vatNumber: '', sdiCode: ''
  });

  const t = {
    it: {
        tabs: { journal: "Diario & Attività", media: "Media & Integrazioni", payments: "Pagamenti", reviews: "Dicono di te", billing: "Dati & Fatturazione" },
        level: "Livello",
        feedback: "Feedback",
        journalTitle: "Il tuo Diario",
        logActivity: "Registra Attività",
        badges: "Badge Conquistati",
        totalSpent: "Totale Speso",
        toPay: "Da Saldare",
        refunds: "Rimborsi",
        transactions: "Storico Transazioni",
        deposit: "Acconto",
        balance: "Saldo",
        refund: "Rimborso",
        payment: "Pagamento",
        completed: "Completato",
        pending: "In Sospeso",
        failed: "Fallito",
        noTx: "Nessuna transazione trovata.",
        sync: "Sincronizzazione",
        stravaDesc: "Sincronizza automaticamente le tue attività per tenere traccia dei dislivelli e migliorare il tuo Sports Passport.",
        connectStrava: "Connetti Account Strava",
        syncActive: "Sincronizzazione Attiva",
        gallery: "Galleria Fotografica",
        reviewsTitle: "Cosa dicono di te",
        reviewsDesc: "Le recensioni delle Guide Alpine sono basate sulle esperienze condivise in montagna. Costruisci la tua reputazione dimostrando preparazione, rispetto e spirito di adattamento.",
        noReviews: "Non hai ancora ricevuto feedback dalle guide.",
        billingTitle: "Dati di Fatturazione",
        billingDesc: "Questi dati verranno utilizzati dalle Guide Alpine per emettere le fatture automaticamente.",
        address: "Indirizzo di Residenza",
        fiscal: "Dati Fiscali",
        save: "Salva Dati",
        newActTitle: "Nuova Attività Personale",
        cancel: "Annulla",
        saveJournal: "Salva nel Diario"
    },
    en: {
        tabs: { journal: "Journal & Activities", media: "Media & Integrations", payments: "Payments", reviews: "Reviews", billing: "Billing Info" },
        level: "Level",
        feedback: "Feedback",
        journalTitle: "Your Journal",
        logActivity: "Log Activity",
        badges: "Badges Earned",
        totalSpent: "Total Spent",
        toPay: "To Pay",
        refunds: "Refunds",
        transactions: "Transaction History",
        deposit: "Deposit",
        balance: "Balance",
        refund: "Refund",
        payment: "Payment",
        completed: "Completed",
        pending: "Pending",
        failed: "Failed",
        noTx: "No transactions found.",
        sync: "Synchronization",
        stravaDesc: "Automatically sync your activities to track elevation gain and improve your Sports Passport.",
        connectStrava: "Connect Strava Account",
        syncActive: "Sync Active",
        gallery: "Photo Gallery",
        reviewsTitle: "What they say about you",
        reviewsDesc: "Reviews from Alpine Guides are based on shared mountain experiences. Build your reputation by demonstrating preparation, respect, and adaptability.",
        noReviews: "You haven't received feedback from guides yet.",
        billingTitle: "Billing Information",
        billingDesc: "This data will be used by Alpine Guides to issue invoices automatically.",
        address: "Residential Address",
        fiscal: "Fiscal Data",
        save: "Save Data",
        newActTitle: "New Personal Activity",
        cancel: "Cancel",
        saveJournal: "Save to Journal"
    }
  }[lang];

  const handleSaveActivity = (e: React.FormEvent) => {
    e.preventDefault();
    const activity: ActivityLog = {
      id: Date.now(),
      title: newActivity.title,
      date: newActivity.date,
      location: newActivity.location,
      stats: newActivity.stats,
      type: 'personal'
    };
    setActivities([activity, ...activities]);
    setShowActivityModal(false);
    setNewActivity({ title: '', date: '', location: '', stats: '' });
  };

  return (
    <div className="space-y-10 pb-20 font-sans text-slate-900">
      
      {/* --- HEADER --- */}
      <div className="relative">
        <div className="h-48 rounded-3xl bg-gradient-to-r from-slate-900 to-slate-800 overflow-hidden shadow-xl">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        </div>
        
        <div className="max-w-5xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-end -mt-16 gap-6 mb-6">
            <div className="w-32 h-32 rounded-3xl bg-white p-1 shadow-2xl">
              <img 
                src={`https://ui-avatars.com/api/?name=${client.name}&background=0f172a&color=fff&size=200`} 
                alt={client.name} 
                className="w-full h-full object-cover rounded-2xl"
              />
            </div>
            
            <div className="flex-1 pb-2">
              <h1 className="text-3xl font-bold text-slate-900 tracking-tight">{client.name}</h1>
              <p className="text-slate-500 font-medium">{client.email}</p>
            </div>

            <div className="flex gap-3 mb-2">
               <div className="bg-white px-4 py-2 rounded-xl shadow-sm border border-slate-100 flex flex-col items-center">
                 <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">{t.level}</span>
                 <span className="font-bold text-slate-900">{client.passport.level}</span>
               </div>
               <div className="bg-white px-4 py-2 rounded-xl shadow-sm border border-slate-100 flex flex-col items-center">
                 <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">{t.feedback}</span>
                 <div className="font-bold text-blue-600 flex items-center gap-1">
                    <MessageSquare size={14} fill="currentColor" className="text-blue-200" /> {client.reviews.length}
                 </div>
               </div>
            </div>
          </div>
        </div>
      </div>

      {/* --- NAVIGATION --- */}
      <div className="max-w-5xl mx-auto px-6">
        <div className="flex border-b border-slate-200 overflow-x-auto">
          {[
            { id: 'journal', label: t.tabs.journal, icon: Calendar },
            { id: 'media', label: t.tabs.media, icon: Activity },
            { id: 'payments', label: t.tabs.payments, icon: Wallet },
            { id: 'reviews', label: t.tabs.reviews, icon: MessageSquare },
            { id: 'billing', label: t.tabs.billing, icon: CreditCard },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-6 py-4 text-sm font-semibold transition-all border-b-2 whitespace-nowrap ${
                activeTab === tab.id 
                  ? 'border-slate-900 text-slate-900' 
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <tab.icon size={18} />
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* --- CONTENT --- */}
      <div className="max-w-5xl mx-auto px-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        
        {/* JOURNAL TAB */}
        {activeTab === 'journal' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="font-bold text-xl text-slate-900 tracking-tight">{t.journalTitle}</h3>
                <button 
                  onClick={() => setShowActivityModal(true)}
                  className="bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-800 transition-colors shadow-lg shadow-slate-200 flex items-center gap-2"
                >
                  <Plus size={16} /> {t.logActivity}
                </button>
              </div>

              <div className="space-y-4">
                {activities.map(activity => (
                  <div key={activity.id} className="group bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all flex items-start gap-4">
                    <div className={`p-3 rounded-xl shrink-0 ${activity.type === 'guided' ? 'bg-indigo-50 text-indigo-600' : 'bg-amber-50 text-amber-600'}`}>
                      {activity.type === 'guided' ? <Shield size={24} /> : <User size={24} />}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-bold text-lg text-slate-900 group-hover:text-blue-600 transition-colors">{activity.title}</h4>
                          <p className="text-sm text-slate-500 flex items-center gap-2 mt-1">
                            <MapPin size={14} /> {activity.location} 
                            <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                            <Calendar size={14} /> {activity.date}
                          </p>
                        </div>
                        <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wide border ${
                          activity.type === 'guided' 
                            ? 'bg-indigo-50 border-indigo-100 text-indigo-600' 
                            : 'bg-amber-50 border-amber-100 text-amber-600'
                        }`}>
                          {activity.type === 'guided' ? 'Guidata' : 'Personale'}
                        </span>
                      </div>
                      
                      <div className="mt-3 flex items-center gap-4 text-sm">
                        {activity.guideName && (
                          <span className="text-slate-600 font-medium">Guida: {activity.guideName}</span>
                        )}
                        {activity.stats && (
                          <span className="text-slate-600 font-medium flex items-center gap-1">
                             <Activity size={14} className="text-slate-400" /> {activity.stats}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-6">
               <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-6 text-white shadow-xl">
                  <h3 className="font-bold text-lg mb-6 flex items-center gap-2">
                    <Award size={20} className="text-yellow-400" /> {t.badges}
                  </h3>
                  <div className="grid grid-cols-3 gap-3">
                      {[
                        { icon: '🏔️', name: '4000m Club', active: true },
                        { icon: '❄️', name: 'Ice Master', active: false },
                        { icon: '⛷️', name: 'Skimo Racer', active: false },
                        { icon: '🧗', name: 'Climber', active: true },
                        { icon: '🦅', name: 'Explorer', active: false },
                        { icon: '⛺', name: 'Wild', active: false },
                      ].map((badge, i) => (
                        <div key={i} className={`bg-white/10 p-3 rounded-2xl text-center backdrop-blur-sm border border-white/10 ${badge.active ? 'opacity-100' : 'opacity-40 grayscale'}`}>
                          <div className="text-2xl mb-1">{badge.icon}</div>
                          <div className="text-[9px] font-bold uppercase tracking-wider text-slate-200">{badge.name}</div>
                        </div>
                      ))}
                  </div>
               </div>
            </div>
          </div>
        )}

        {/* PAYMENTS TAB (NEW) */}
        {activeTab === 'payments' && (
            <div className="space-y-8">
                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-3 bg-green-50 text-green-600 rounded-xl">
                                <Wallet size={24} />
                            </div>
                            <span className="text-slate-500 font-bold text-sm uppercase tracking-wide">{t.totalSpent}</span>
                        </div>
                        <h3 className="text-3xl font-bold text-slate-900">
                             €{client.transactions.filter(t => t.status === 'completed' && t.type !== 'refund').reduce((acc, t) => acc + t.amount, 0).toFixed(2)}
                        </h3>
                    </div>

                    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-3 bg-orange-50 text-orange-600 rounded-xl">
                                <Clock size={24} />
                            </div>
                            <span className="text-slate-500 font-bold text-sm uppercase tracking-wide">{t.toPay}</span>
                        </div>
                        <h3 className="text-3xl font-bold text-slate-900">
                            €{client.transactions.filter(t => t.status === 'pending').reduce((acc, t) => acc + t.amount, 0).toFixed(2)}
                        </h3>
                    </div>

                    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                         <div className="flex items-center gap-3 mb-4">
                            <div className="p-3 bg-purple-50 text-purple-600 rounded-xl">
                                <ArrowDownLeft size={24} />
                            </div>
                            <span className="text-slate-500 font-bold text-sm uppercase tracking-wide">{t.refunds}</span>
                        </div>
                        <h3 className="text-3xl font-bold text-slate-900">
                            €{client.transactions.filter(t => t.type === 'refund').reduce((acc, t) => acc + t.amount, 0).toFixed(2)}
                        </h3>
                    </div>
                </div>

                {/* Transactions List */}
                <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
                    <div className="bg-slate-50 px-8 py-6 border-b border-slate-100">
                        <h3 className="font-bold text-lg text-slate-900">{t.transactions}</h3>
                    </div>
                    
                    {client.transactions.length > 0 ? (
                        <div className="divide-y divide-slate-100">
                            {client.transactions.map((tx) => (
                                <div key={tx.id} className="p-6 hover:bg-slate-50 transition-colors flex flex-col md:flex-row items-center gap-6">
                                    <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${
                                        tx.type === 'refund' ? 'bg-purple-50 text-purple-600' :
                                        tx.status === 'pending' ? 'bg-orange-50 text-orange-600' :
                                        'bg-green-50 text-green-600'
                                    }`}>
                                        {tx.type === 'refund' ? <ArrowDownLeft size={20} /> : <ArrowUpRight size={20} />}
                                    </div>
                                    
                                    <div className="flex-1 text-center md:text-left">
                                        <h4 className="font-bold text-slate-900">{tx.description}</h4>
                                        <p className="text-sm text-slate-500">{tx.tripTitle} • Guida: {tx.guideName}</p>
                                        <p className="text-xs text-slate-400 mt-1">{tx.date} • {tx.method || 'Online Payment'}</p>
                                    </div>

                                    <div className="flex flex-col items-center md:items-end gap-2">
                                        <div className="flex items-center gap-2">
                                             <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide border ${
                                                 tx.type === 'deposit' ? 'bg-blue-50 border-blue-100 text-blue-600' :
                                                 tx.type === 'balance' ? 'bg-indigo-50 border-indigo-100 text-indigo-600' :
                                                 tx.type === 'refund' ? 'bg-purple-50 border-purple-100 text-purple-600' :
                                                 'bg-slate-100 border-slate-200 text-slate-600'
                                             }`}>
                                                 {tx.type === 'deposit' ? t.deposit : 
                                                  tx.type === 'balance' ? t.balance : 
                                                  tx.type === 'refund' ? t.refund : t.payment}
                                             </span>
                                             
                                             <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide border ${
                                                 tx.status === 'completed' ? 'bg-green-50 border-green-100 text-green-600' :
                                                 tx.status === 'pending' ? 'bg-orange-50 border-orange-100 text-orange-600' :
                                                 'bg-red-50 border-red-100 text-red-600'
                                             }`}>
                                                 {tx.status === 'completed' ? t.completed : 
                                                  tx.status === 'pending' ? t.pending : t.failed}
                                             </span>
                                        </div>
                                        <div className={`text-xl font-bold ${tx.type === 'refund' ? 'text-green-600' : 'text-slate-900'}`}>
                                            {tx.type === 'refund' ? '+' : '-'} €{tx.amount.toFixed(2)}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="p-12 text-center text-slate-400">
                            <Wallet size={48} className="mx-auto mb-4 opacity-20" />
                            <p>{t.noTx}</p>
                        </div>
                    )}
                </div>
            </div>
        )}

        {/* MEDIA / INTEGRATIONS TAB */}
        {activeTab === 'media' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
             <div className="space-y-6">
               <h3 className="font-bold text-xl text-slate-900 tracking-tight">{t.sync}</h3>
               <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm text-center">
                 <div className="inline-flex p-4 bg-orange-50 text-[#fc4c02] rounded-full mb-4">
                   <Activity size={32} />
                 </div>
                 <h4 className="text-lg font-bold text-slate-900 mb-2">Strava Integration</h4>
                 <p className="text-slate-500 mb-6 max-w-sm mx-auto">{t.stravaDesc}</p>
                 
                 {!isStravaConnected ? (
                   <button 
                     onClick={() => setIsStravaConnected(true)}
                     className="bg-[#fc4c02] hover:bg-[#e34402] text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg shadow-orange-200 hover:shadow-orange-300 transform hover:-translate-y-0.5"
                   >
                     {t.connectStrava}
                   </button>
                 ) : (
                   <div className="space-y-6">
                     <button 
                       onClick={() => setIsStravaConnected(false)}
                       className="bg-emerald-50 text-emerald-600 px-6 py-2 rounded-full text-sm font-bold border border-emerald-100 inline-flex items-center gap-2"
                     >
                       <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> {t.syncActive}
                     </button>
                     <div className="h-48 w-full bg-slate-50 rounded-xl overflow-hidden border border-slate-100">
                        <ResponsiveContainer width="100%" height="100%">
                         <AreaChart data={mockStravaData}>
                           <defs>
                             <linearGradient id="colorAlt" x1="0" y1="0" x2="0" y2="1">
                               <stop offset="5%" stopColor="#fc4c02" stopOpacity={0.1}/>
                               <stop offset="95%" stopColor="#fc4c02" stopOpacity={0}/>
                             </linearGradient>
                           </defs>
                           <Area type="monotone" dataKey="alt" stroke="#fc4c02" strokeWidth={2} fillOpacity={1} fill="url(#colorAlt)" />
                         </AreaChart>
                       </ResponsiveContainer>
                     </div>
                   </div>
                 )}
               </div>
             </div>

             <div className="space-y-6">
                <h3 className="font-bold text-xl text-slate-900 tracking-tight">{t.gallery}</h3>
                <div className="grid grid-cols-2 gap-4">
                  {mockGallery.map((src, i) => (
                    <div key={i} className="aspect-square relative group rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all cursor-pointer">
                      <img src={src} alt="Gallery" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors"></div>
                    </div>
                  ))}
                  <div className="aspect-square bg-slate-50 rounded-2xl flex flex-col items-center justify-center text-slate-400 cursor-pointer hover:bg-slate-100 transition-colors border-2 border-dashed border-slate-200 hover:border-slate-300 hover:text-slate-500 group">
                    <Camera size={28} className="mb-2 group-hover:scale-110 transition-transform" />
                    <span className="text-xs font-bold uppercase tracking-wide">Upload</span>
                  </div>
                </div>
             </div>
          </div>
        )}
        
        {/* REVIEWS TAB (UPDATED: NO NUMBERS) */}
        {activeTab === 'reviews' && (
            <div className="max-w-3xl mx-auto space-y-8">
                <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm text-center">
                    <div className="inline-flex p-3 bg-blue-50 text-blue-600 rounded-2xl mb-4">
                        <MessageSquare size={32} />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">{t.reviewsTitle}</h3>
                    <p className="text-slate-500 text-sm max-w-md mx-auto leading-relaxed">
                        {t.reviewsDesc}
                    </p>
                </div>

                <div className="space-y-4">
                    {client.reviews.length > 0 ? (
                        client.reviews.map(review => (
                            <div key={review.id} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-4 opacity-5">
                                    <Quote size={80} className="text-slate-900" />
                                </div>
                                <div className="flex justify-between items-start mb-4 relative z-10">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold border border-slate-200">
                                            {review.authorName.charAt(0)}
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-slate-900 text-base">{review.authorName}</h4>
                                            <div className="flex items-center gap-2 text-xs">
                                                <span className="text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full font-medium">Guida Alpina</span>
                                                <span className="text-slate-400">• {review.date}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="relative z-10 pl-2 border-l-4 border-slate-200">
                                    <p className="text-slate-700 text-base leading-relaxed italic">"{review.comment}"</p>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-12 text-slate-400 border-2 border-dashed border-slate-200 rounded-2xl">
                            <MessageSquare size={48} className="mx-auto mb-4 opacity-20" />
                            <p>{t.noReviews}</p>
                        </div>
                    )}
                </div>
            </div>
        )}

        {/* BILLING TAB */}
        {activeTab === 'billing' && (
          <div className="max-w-2xl mx-auto">
             <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="bg-slate-50 px-8 py-6 border-b border-slate-100">
                  <h3 className="font-bold text-lg text-slate-900">{t.billingTitle}</h3>
                  <p className="text-sm text-slate-500">{t.billingDesc}</p>
                </div>
                
                <form className="p-8 space-y-6">
                   <div className="space-y-4">
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">{t.address}</h4>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Indirizzo e N. Civico</label>
                        <input 
                          type="text" 
                          value={billingInfo.address}
                          onChange={(e) => setBillingInfo({...billingInfo, address: e.target.value})}
                          className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none transition-all bg-slate-50 focus:bg-white"
                          placeholder="Via Roma 1"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-1">Città</label>
                          <input 
                            type="text" 
                            value={billingInfo.city}
                            onChange={(e) => setBillingInfo({...billingInfo, city: e.target.value})}
                            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-slate-900 outline-none bg-slate-50 focus:bg-white"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-1">CAP</label>
                          <input 
                            type="text" 
                            value={billingInfo.zipCode}
                            onChange={(e) => setBillingInfo({...billingInfo, zipCode: e.target.value})}
                            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-slate-900 outline-none bg-slate-50 focus:bg-white"
                          />
                        </div>
                      </div>
                   </div>

                   <hr className="border-slate-100" />

                   <div className="space-y-4">
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">{t.fiscal}</h4>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Codice Fiscale (Obbligatorio)</label>
                        <input 
                          type="text" 
                          value={billingInfo.taxId}
                          onChange={(e) => setBillingInfo({...billingInfo, taxId: e.target.value})}
                          className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-slate-900 outline-none bg-slate-50 focus:bg-white uppercase"
                          placeholder="RSSMRA..."
                        />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-1">Partita IVA (Opzionale)</label>
                          <input 
                            type="text" 
                            value={billingInfo.vatNumber}
                            onChange={(e) => setBillingInfo({...billingInfo, vatNumber: e.target.value})}
                            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-slate-900 outline-none bg-slate-50 focus:bg-white"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-1">Codice SDI o PEC</label>
                          <input 
                            type="text" 
                            value={billingInfo.sdiCode}
                            onChange={(e) => setBillingInfo({...billingInfo, sdiCode: e.target.value})}
                            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-slate-900 outline-none bg-slate-50 focus:bg-white"
                            placeholder="0000000"
                          />
                        </div>
                      </div>
                   </div>

                   <div className="pt-4">
                     <button type="button" className="w-full bg-slate-900 text-white py-3 rounded-xl font-bold text-sm hover:bg-slate-800 transition-all flex items-center justify-center gap-2 shadow-lg shadow-slate-200">
                       <Save size={18} /> {t.save}
                     </button>
                   </div>
                </form>
             </div>
          </div>
        )}

      </div>

      {/* --- ADD ACTIVITY MODAL --- */}
      {showActivityModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
           <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200">
              <div className="bg-slate-50 px-6 py-4 border-b border-slate-100 flex justify-between items-center">
                <h3 className="font-bold text-lg text-slate-900">{t.newActTitle}</h3>
                <button onClick={() => setShowActivityModal(false)} className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-900 transition-colors">
                  &times;
                </button>
              </div>
              <form onSubmit={handleSaveActivity} className="p-6 space-y-4">
                 <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">Titolo</label>
                    <input 
                      autoFocus
                      required
                      className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-slate-900 outline-none"
                      placeholder="Es. Sciata a Pila"
                      value={newActivity.title}
                      onChange={e => setNewActivity({...newActivity, title: e.target.value})}
                    />
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                   <div>
                      <label className="block text-sm font-bold text-slate-700 mb-1">Data</label>
                      <input 
                        type="date"
                        required
                        className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-slate-900 outline-none"
                        value={newActivity.date}
                        onChange={e => setNewActivity({...newActivity, date: e.target.value})}
                      />
                   </div>
                   <div>
                      <label className="block text-sm font-bold text-slate-700 mb-1">Località</label>
                      <input 
                        required
                        className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-slate-900 outline-none"
                        placeholder="Es. Aosta"
                        value={newActivity.location}
                        onChange={e => setNewActivity({...newActivity, location: e.target.value})}
                      />
                   </div>
                 </div>
                 <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">Statistiche (opzionale)</label>
                    <input 
                      className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-slate-900 outline-none"
                      placeholder="Es. 800m d+, 12km"
                      value={newActivity.stats}
                      onChange={e => setNewActivity({...newActivity, stats: e.target.value})}
                    />
                 </div>
                 <div className="pt-4 flex gap-3">
                   <button 
                    type="button" 
                    onClick={() => setShowActivityModal(false)}
                    className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold text-sm hover:bg-slate-50"
                   >
                     {t.cancel}
                   </button>
                   <button 
                    type="submit"
                    className="flex-1 py-2.5 rounded-xl bg-slate-900 text-white font-bold text-sm hover:bg-slate-800 shadow-lg shadow-slate-200"
                   >
                     {t.saveJournal}
                   </button>
                 </div>
              </form>
           </div>
        </div>
      )}

    </div>
  );
};

export default ClientProfile;