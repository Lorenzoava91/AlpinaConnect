import React, { useState, useEffect } from 'react';
import { Trip, Client, Guide, Coordinates } from '../types';
import CreateTripForm from './CreateTripForm';
import SportsPassportModal from './SportsPassportModal';
import { Plus, Users, Calendar as CalendarIcon, Wallet, ChevronRight, Clock, BarChart3, UserCog, ScrollText, CheckCircle, Upload, Save, TrendingUp, FileText, Mountain, ChevronLeft, MapPin, X, AlertCircle } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, BarChart, Bar, Cell } from 'recharts';
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, isSameMonth, isSameDay, addMonths, subMonths, isWithinInterval, parseISO } from 'date-fns';
import { it, enUS } from 'date-fns/locale';
import { fetchWeatherForecast, getWeatherIcon, WeatherData } from '../services/weatherService';

interface Props {
  trips: Trip[];
  onAddTrip: (trip: Trip) => void;
  onApproveRequest: (tripId: string, client: Client) => void;
  guide: Guide;
  lang: 'it' | 'en';
}

// Interface for the clicked event
interface CalendarEvent {
    date: string;
    type: 'pending' | 'confirmed';
    client: string;
    tripTitle: string;
    coords: Coordinates;
    location: string;
}

// Internal Calendar Component for Guide
const GuideCalendar = ({ trips, lang }: { trips: Trip[], lang: 'it' | 'en' }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [weatherMap, setWeatherMap] = useState<Record<string, WeatherData>>({});
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  
  const locale = lang === 'it' ? it : enUS;

  const t = {
    it: {
        calendar: "Calendario Uscite",
        pending: "In Attesa",
        confirmed: "Confermate",
        client: "Cliente",
        activity: "Attività",
        weather: "Meteo Previsto",
        avg: "Media",
        weatherWarn: "Prevista pioggia/neve. Controlla l'equipaggiamento impermeabile.",
        weatherSafe: "Condizioni stabili. Ricorda occhiali da sole e protezione solare.",
        noWeather: "Meteo non disponibile (data troppo lontana o passata).",
        days: ['Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab', 'Dom']
    },
    en: {
        calendar: "Trip Calendar",
        pending: "Pending",
        confirmed: "Confirmed",
        client: "Client",
        activity: "Activity",
        weather: "Forecast",
        avg: "Avg",
        weatherWarn: "Rain/Snow expected. Check waterproof gear.",
        weatherSafe: "Stable conditions. Remember sunglasses and sunscreen.",
        noWeather: "Weather unavailable (date too far or past).",
        days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    }
  }[lang];

  // Flatten events: Pending Requests and Confirmed Clients
  // We only care about specific dates requested by clients
  const events: CalendarEvent[] = trips.flatMap(trip => {
     const pending = trip.pendingRequests
       .filter(c => c.requestedDate)
       .map(c => ({ 
           date: c.requestedDate!, 
           type: 'pending' as const, 
           client: c.name, 
           tripTitle: trip.title, 
           location: trip.location,
           coords: trip.coordinates 
       }));
     
     const confirmed = trip.enrolledClients
       .filter(c => c.requestedDate)
       .map(c => ({ 
           date: c.requestedDate!, 
           type: 'confirmed' as const, 
           client: c.name, 
           tripTitle: trip.title,
           location: trip.location,
           coords: trip.coordinates 
       }));

     return [...pending, ...confirmed];
  });

  // Fetch weather for upcoming events
  useEffect(() => {
     const loadWeather = async () => {
        const newWeatherMap: Record<string, WeatherData> = {};
        
        for (const event of events) {
           const key = `${event.date}-${event.tripTitle}`;
           if (!weatherMap[key]) {
              const w = await fetchWeatherForecast(event.coords.lat, event.coords.lng, event.date);
              if (w) newWeatherMap[key] = w;
           }
        }
        
        if (Object.keys(newWeatherMap).length > 0) {
           setWeatherMap(prev => ({ ...prev, ...newWeatherMap }));
        }
     };
     loadWeather();
  }, [currentMonth, trips]);

  const renderCells = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart, { weekStartsOn: 1 });
    const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });

    const rows = [];
    let days = [];
    let day = startDate;

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        const dateStr = format(day, 'yyyy-MM-dd');
        const dayEvents = events.filter(e => e.date === dateStr);
        const isCurrentMonth = isSameMonth(day, monthStart);

        days.push(
          <div key={day.toString()} className={`min-h-[110px] border border-slate-100 p-2 relative flex flex-col ${!isCurrentMonth ? 'bg-slate-50/50' : 'bg-white'}`}>
            <span className={`text-xs font-bold ${isSameDay(day, new Date()) ? 'bg-blue-600 text-white w-6 h-6 flex items-center justify-center rounded-full' : 'text-slate-400'}`}>
              {format(day, 'd')}
            </span>
            
            <div className="mt-2 space-y-1.5 flex-1">
              {dayEvents.map((evt, idx) => {
                 const weather = weatherMap[`${evt.date}-${evt.tripTitle}`];
                 const WeatherIcon = weather ? getWeatherIcon(weather.weatherCode).icon : null;
                 const wColor = weather ? getWeatherIcon(weather.weatherCode).color : '';
                 
                 return (
                  <button 
                    key={idx} 
                    onClick={() => setSelectedEvent(evt)}
                    className={`w-full p-1.5 rounded-lg text-[10px] border flex items-center justify-between group relative transition-all hover:shadow-md cursor-pointer text-left ${evt.type === 'confirmed' ? 'bg-green-50 border-green-100 text-green-800 hover:bg-green-100' : 'bg-orange-50 border-orange-100 text-orange-800 hover:bg-orange-100'}`}
                  >
                    <div className="truncate flex-1">
                      <span className="font-bold block truncate">{evt.client}</span>
                      <span className="opacity-75 truncate">{evt.tripTitle}</span>
                    </div>
                    
                    {weather && WeatherIcon && (
                       <div className={`ml-2 flex flex-col items-center justify-center bg-white/50 rounded p-0.5 px-1 min-w-[24px]`}>
                          <div className={wColor}><WeatherIcon size={12} /></div>
                          <span className="text-[8px] font-bold text-slate-600 leading-none mt-0.5">{Math.round(weather.maxTemp)}°</span>
                       </div>
                    )}
                  </button>
                 )
              })}
            </div>
          </div>
        );
        day = addDays(day, 1);
      }
      rows.push(<div key={day.toString()} className="grid grid-cols-7">{days}</div>);
      days = [];
    }
    return <div>{rows}</div>;
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden relative">
       <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <h3 className="font-bold text-slate-800 flex items-center gap-2">
             <CalendarIcon size={18} /> {t.calendar}
          </h3>
          <div className="flex items-center gap-4">
             <button onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}><ChevronLeft size={20} /></button>
             <span className="font-bold capitalize">{format(currentMonth, 'MMMM yyyy', { locale })}</span>
             <button onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}><ChevronRight size={20} /></button>
          </div>
       </div>
       <div className="grid grid-cols-7 bg-slate-50 border-b border-slate-100">
         {t.days.map(d => (
           <div key={d} className="py-2 text-center text-xs font-bold text-slate-400 uppercase">{d}</div>
         ))}
       </div>
       {renderCells()}

       {/* EVENT DETAIL MODAL */}
       {selectedEvent && (
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
             <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden">
                <div className={`p-4 text-white flex justify-between items-start ${selectedEvent.type === 'confirmed' ? 'bg-green-600' : 'bg-orange-500'}`}>
                    <div>
                        <h4 className="font-bold text-lg">{selectedEvent.type === 'confirmed' ? t.confirmed : t.pending}</h4>
                        <p className="text-white/80 text-xs flex items-center gap-1"><CalendarIcon size={12}/> {format(new Date(selectedEvent.date), 'd MMMM yyyy', {locale})}</p>
                    </div>
                    <button onClick={() => setSelectedEvent(null)} className="p-1 hover:bg-white/20 rounded-full transition-colors"><X size={18}/></button>
                </div>
                <div className="p-5 space-y-4">
                    <div>
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{t.client}</span>
                        <div className="flex items-center gap-2 mt-1">
                            <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-600">{selectedEvent.client.charAt(0)}</div>
                            <span className="font-bold text-slate-900">{selectedEvent.client}</span>
                        </div>
                    </div>
                    <div>
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{t.activity}</span>
                        <h5 className="font-bold text-slate-800">{selectedEvent.tripTitle}</h5>
                        <p className="text-sm text-slate-500 flex items-center gap-1"><MapPin size={14}/> {selectedEvent.location}</p>
                    </div>
                    
                    {/* WEATHER SECTION IN MODAL */}
                    {weatherMap[`${selectedEvent.date}-${selectedEvent.tripTitle}`] ? (
                        <div className="bg-blue-50 rounded-xl p-4 border border-blue-100 mt-2">
                             {(() => {
                                 const w = weatherMap[`${selectedEvent.date}-${selectedEvent.tripTitle}`];
                                 const WIcon = getWeatherIcon(w.weatherCode).icon;
                                 return (
                                     <div className="flex items-center justify-between">
                                         <div>
                                             <div className="text-xs font-bold text-blue-400 uppercase tracking-wider mb-1">{t.weather}</div>
                                             <div className="font-bold text-blue-900 flex items-center gap-2">
                                                 <WIcon size={20} /> {getWeatherIcon(w.weatherCode).label}
                                             </div>
                                             <div className="text-sm text-blue-700 mt-1">
                                                Min: <b>{w.minTemp}°</b>  Max: <b>{w.maxTemp}°</b>
                                             </div>
                                         </div>
                                         <div className="text-center">
                                             <div className="text-3xl font-bold text-blue-600">{Math.round((w.minTemp + w.maxTemp)/2)}°</div>
                                             <div className="text-[10px] text-blue-400">{t.avg}</div>
                                         </div>
                                     </div>
                                 )
                             })()}
                             <div className="mt-3 pt-3 border-t border-blue-100 flex gap-2 text-xs text-blue-700 items-start">
                                <AlertCircle size={14} className="shrink-0 mt-0.5"/>
                                <span>
                                    {weatherMap[`${selectedEvent.date}-${selectedEvent.tripTitle}`].weatherCode > 50 
                                     ? t.weatherWarn 
                                     : t.weatherSafe}
                                </span>
                             </div>
                        </div>
                    ) : (
                        <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 text-center text-slate-400 text-xs italic">
                            {t.noWeather}
                        </div>
                    )}
                </div>
             </div>
          </div>
       )}
    </div>
  );
};


const Dashboard: React.FC<Props> = ({ trips, onAddTrip, onApproveRequest, guide, lang }) => {
  const [activeTab, setActiveTab] = useState<'activities' | 'calendar' | 'analytics' | 'profile'>('activities');
  const [showForm, setShowForm] = useState(false);
  const [selectedClientForReview, setSelectedClientForReview] = useState<{client: Client, tripId: string} | null>(null);
  
  // Local state for profile editing
  const [guideData, setGuideData] = useState<Guide>(guide);

  const t = {
    it: {
        tabs: { activities: "Attività", calendar: "Calendario", analytics: "Analytics", profile: "Profilo" },
        kpi: { next: "Prossime Uscite", pending: "Richieste in Attesa", earn: "Guadagni (Stima)" },
        manageTitle: "Gestione Uscite",
        newActivity: "Nuova Attività",
        noActivities: "Nessuna attività programmata.",
        available: "Disponibile",
        participants: "Partecipanti",
        waiting: "In attesa",
        manage: "Gestisci",
        incomingReq: "Richiesta in arrivo",
        wantsJoin: "Vuole unirsi al gruppo",
        checkPassport: "Verifica Passaporto",
        noReq: "Nessuna nuova richiesta.",
        confirmed: "Confermate",
        annualEarn: "Fatturato Annuo Corrente",
        monthTrend: "Andamento Mensile",
        marketTrend: "Market Trends",
        profileTitle: "Dati Personali",
        save: "Salva Modifiche",
        name: "Nome Completo",
        phone: "Telefono",
        cert: "Certificazioni & Albo",
        certSub: "Verifica Professionale",
        certDesc: "Il numero di iscrizione all'albo è obbligatorio per esercitare. Viene verificato automaticamente con il collegio nazionale.",
        alboNum: "Numero Iscrizione Albo",
        bio: "Bio & Esperienza",
        msgProfileUp: "Profilo aggiornato con successo! I dati dell'albo verranno verificati."
    },
    en: {
        tabs: { activities: "Activities", calendar: "Calendar", analytics: "Analytics", profile: "Profile" },
        kpi: { next: "Upcoming Trips", pending: "Pending Requests", earn: "Earnings (Est.)" },
        manageTitle: "Manage Trips",
        newActivity: "New Activity",
        noActivities: "No activities scheduled.",
        available: "Available",
        participants: "Participants",
        waiting: "Waiting",
        manage: "Manage",
        incomingReq: "Incoming Request",
        wantsJoin: "Wants to join group",
        checkPassport: "Check Passport",
        noReq: "No new requests.",
        confirmed: "Confirmed",
        annualEarn: "Current Annual Revenue",
        monthTrend: "Monthly Trend",
        marketTrend: "Market Trends",
        profileTitle: "Personal Data",
        save: "Save Changes",
        name: "Full Name",
        phone: "Phone",
        cert: "Certifications & Registry",
        certSub: "Professional Verification",
        certDesc: "Registry number is mandatory to practice. It is automatically verified with the national board.",
        alboNum: "Registry Number",
        bio: "Bio & Experience",
        msgProfileUp: "Profile updated successfully! Registry data will be verified."
    }
  }[lang];

  // Calculate simple stats
  const totalEarnings = trips.reduce((acc, t) => acc + (t.price * t.enrolledClients.length), 0);
  const pendingRequestsCount = trips.reduce((acc, t) => acc + t.pendingRequests.length, 0);
  
  if (showForm) {
    return <CreateTripForm onSave={(trip) => { onAddTrip(trip); setShowForm(false); }} onCancel={() => setShowForm(false)} lang={lang} />;
  }

  const handleProfileUpdate = (e: React.FormEvent) => {
      e.preventDefault();
      alert(t.msgProfileUp);
  }

  return (
    <div className="space-y-8 pb-20">
      
      {/* Navigation Tabs */}
      <div className="bg-white rounded-2xl p-2 shadow-sm border border-slate-100 flex overflow-x-auto no-scrollbar">
        {[
            { id: 'activities', label: t.tabs.activities, icon: Mountain },
            { id: 'calendar', label: t.tabs.calendar, icon: CalendarIcon },
            { id: 'analytics', label: t.tabs.analytics, icon: BarChart3 },
            { id: 'profile', label: t.tabs.profile, icon: UserCog },
        ].map((tab) => (
            <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${
                    activeTab === tab.id 
                    ? 'bg-slate-900 text-white shadow-md' 
                    : 'text-slate-500 hover:bg-slate-50'
                }`}
            >
                <tab.icon size={18} /> {tab.label}
            </button>
        ))}
      </div>

      {/* --- TAB: ACTIVITIES (Existing Dashboard Logic) --- */}
      {activeTab === 'activities' && (
        <div className="space-y-8 animate-in fade-in duration-300">
            {/* Header Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                    <CalendarIcon size={24} />
                    </div>
                    <div>
                    <p className="text-sm text-slate-500 font-medium">{t.kpi.next}</p>
                    <h3 className="text-2xl font-bold text-slate-900">{trips.length}</h3>
                    </div>
                </div>
                </div>
                
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-orange-50 text-orange-600 rounded-xl">
                    <Users size={24} />
                    </div>
                    <div>
                    <p className="text-sm text-slate-500 font-medium">{t.kpi.pending}</p>
                    <h3 className="text-2xl font-bold text-slate-900">{pendingRequestsCount}</h3>
                    </div>
                </div>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
                    <Wallet size={24} />
                    </div>
                    <div>
                    <p className="text-sm text-slate-500 font-medium">{t.kpi.earn}</p>
                    <h3 className="text-2xl font-bold text-slate-900">€{totalEarnings}</h3>
                    </div>
                </div>
                </div>
            </div>

            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-slate-900">{t.manageTitle}</h2>
                <button 
                onClick={() => setShowForm(true)}
                className="flex items-center gap-2 bg-slate-900 text-white px-5 py-2.5 rounded-lg hover:bg-slate-800 transition-colors shadow-lg shadow-slate-200"
                >
                <Plus size={18} /> {t.newActivity}
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main List: Trips */}
                <div className="lg:col-span-2 space-y-4">
                {trips.length === 0 && (
                    <div className="bg-white p-12 text-center rounded-2xl border border-dashed border-slate-300">
                    <p className="text-slate-500">{t.noActivities}</p>
                    </div>
                )}
                {trips.map(trip => (
                    <div key={trip.id} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-6 hover:shadow-md transition-shadow">
                    <img src={trip.image} alt={trip.title} className="w-full md:w-32 h-32 object-cover rounded-lg" />
                    <div className="flex-1">
                        <div className="flex justify-between items-start mb-2">
                            <div>
                            <h3 className="font-bold text-lg text-slate-900">{trip.title}</h3>
                            <p className="text-sm text-slate-500 flex items-center gap-1">
                                <CalendarIcon size={14} /> {t.available}: {trip.availableFrom} - {trip.availableTo}
                            </p>
                            </div>
                            <span className="px-3 py-1 bg-slate-100 text-slate-600 text-xs font-bold rounded-full uppercase tracking-wide">
                            {trip.activityType}
                            </span>
                        </div>
                        
                        <div className="mt-4 flex items-center justify-between text-sm">
                            <div className="flex items-center gap-4">
                            <div className="flex items-center gap-1 text-slate-600">
                                <Users size={16} />
                                <span>{trip.enrolledClients.length}/{trip.maxParticipants} {t.participants}</span>
                            </div>
                            <div className="flex items-center gap-1 text-slate-600">
                                <Clock size={16} />
                                <span>{t.waiting}: {trip.pendingRequests.length}</span>
                            </div>
                            </div>
                            <button className="text-blue-600 font-medium hover:text-blue-800 flex items-center gap-1 text-xs uppercase tracking-wide">
                            {t.manage} <ChevronRight size={14} />
                            </button>
                        </div>
                    </div>
                    </div>
                ))}
                </div>

                {/* Sidebar: Notifications/Requests */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 h-fit sticky top-6">
                <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                    {t.incomingReq} 
                    {pendingRequestsCount > 0 && <span className="bg-red-500 text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full">{pendingRequestsCount}</span>}
                </h3>
                
                <div className="space-y-4">
                    {trips.flatMap(trip => trip.pendingRequests.map(client => ({client, trip}))).map(({client, trip}, idx) => (
                        <div key={`${trip.id}-${client.id}-${idx}`} className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                        <div className="flex items-center justify-between mb-2">
                            <span className="font-semibold text-sm">{client.name}</span>
                            <span className="text-[10px] text-slate-400 bg-white px-2 py-0.5 rounded-full border border-slate-200">{trip.title}</span>
                        </div>
                        <p className="text-xs text-slate-500 mb-3">
                           {t.wantsJoin} {client.requestedDate ? `il ${client.requestedDate}` : ''}.
                        </p>
                        <button 
                            onClick={() => setSelectedClientForReview({client, tripId: trip.id})}
                            className="w-full py-2 bg-white border border-slate-200 text-slate-700 text-xs font-bold uppercase rounded-lg hover:bg-slate-100 transition-colors flex justify-center items-center gap-2">
                            <Users size={14} /> {t.checkPassport}
                        </button>
                        </div>
                    ))}
                    {pendingRequestsCount === 0 && (
                    <p className="text-sm text-slate-400 text-center py-4">{t.noReq}</p>
                    )}
                </div>
                </div>
            </div>
        </div>
      )}

      {/* --- TAB: CALENDAR (New) --- */}
      {activeTab === 'calendar' && (
         <div className="animate-in fade-in duration-300">
            <GuideCalendar trips={trips} lang={lang} />
            <div className="mt-4 flex gap-4 text-xs text-slate-500 justify-center">
               <div className="flex items-center gap-1"><div className="w-3 h-3 rounded bg-green-50 border border-green-100"></div> {t.confirmed}</div>
               <div className="flex items-center gap-1"><div className="w-3 h-3 rounded bg-orange-50 border border-orange-100"></div> {t.kpi.pending}</div>
            </div>
         </div>
      )}

      {/* --- TAB: ANALYTICS (Existing) --- */}
      {activeTab === 'analytics' && (
          <div className="space-y-8 animate-in fade-in duration-300">
              <div className="bg-slate-900 text-white p-8 rounded-3xl shadow-xl relative overflow-hidden">
                   <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                   <div className="relative z-10 flex justify-between items-end">
                       <div>
                           <p className="text-slate-400 font-medium mb-1">{t.annualEarn}</p>
                           <h2 className="text-4xl font-bold">€ 19.300</h2>
                       </div>
                       <div className="bg-white/10 px-4 py-2 rounded-xl backdrop-blur-sm border border-white/10 flex items-center gap-2">
                           <TrendingUp className="text-emerald-400" size={20} />
                           <span className="text-sm font-bold text-emerald-400">+12% vs 2023</span>
                       </div>
                   </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                      <h3 className="font-bold text-slate-900 mb-6 flex items-center gap-2">
                          <BarChart3 size={20} className="text-blue-600"/> {t.monthTrend}
                      </h3>
                      <div className="h-64 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                         <AreaChart data={guide.earningsHistory}>
                           <defs>
                             <linearGradient id="colorEarn" x1="0" y1="0" x2="0" y2="1">
                               <stop offset="5%" stopColor="#2563eb" stopOpacity={0.1}/>
                               <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                             </linearGradient>
                           </defs>
                           <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                           <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                           <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                           <Tooltip contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                           <Area type="monotone" dataKey="amount" stroke="#2563eb" strokeWidth={3} fillOpacity={1} fill="url(#colorEarn)" />
                         </AreaChart>
                       </ResponsiveContainer>
                      </div>
                  </div>

                  <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                      <h3 className="font-bold text-slate-900 mb-6 flex items-center gap-2">
                          <TrendingUp size={20} className="text-purple-600"/> {t.marketTrend}
                      </h3>
                      <div className="h-64 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                         <BarChart data={guide.marketTrends} layout="vertical">
                           <XAxis type="number" hide />
                           <YAxis dataKey="activity" type="category" width={100} axisLine={false} tickLine={false} tick={{fill: '#1e293b', fontSize: 12, fontWeight: 600}} />
                           <Tooltip cursor={{fill: 'transparent'}} contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                           <Bar dataKey="demand" radius={[0, 4, 4, 0]} barSize={24}>
                               {guide.marketTrends.map((entry, index) => (
                                   <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#8b5cf6' : '#a78bfa'} />
                               ))}
                           </Bar>
                         </BarChart>
                       </ResponsiveContainer>
                      </div>
                  </div>
              </div>
          </div>
      )}

      {/* --- TAB: PROFILE (Existing) --- */}
      {activeTab === 'profile' && (
          <div className="max-w-3xl mx-auto animate-in fade-in duration-300">
              <form onSubmit={handleProfileUpdate} className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
                   <div className="h-32 bg-slate-900 relative">
                       <div className="absolute -bottom-12 left-8">
                           <div className="w-24 h-24 rounded-2xl bg-white p-1 shadow-xl relative group cursor-pointer">
                               <img src={guideData.avatar} alt="Guide Profile" className="w-full h-full object-cover rounded-xl" />
                               <div className="absolute inset-0 bg-black/50 rounded-xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                   <Upload className="text-white" size={24} />
                               </div>
                           </div>
                       </div>
                   </div>
                   
                   <div className="pt-16 px-8 pb-8 space-y-8">
                       {/* Identity Section */}
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                           <div className="space-y-4">
                               <h3 className="font-bold text-slate-900 border-b border-slate-100 pb-2">{t.profileTitle}</h3>
                               <div>
                                   <label className="block text-sm font-medium text-slate-700 mb-1">{t.name}</label>
                                   <input 
                                     type="text" 
                                     value={guideData.name} 
                                     onChange={e => setGuideData({...guideData, name: e.target.value})}
                                     className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-slate-900 outline-none" 
                                   />
                               </div>
                               <div>
                                   <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                                   <input 
                                     type="email" 
                                     value={guideData.email} 
                                     onChange={e => setGuideData({...guideData, email: e.target.value})}
                                     className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-slate-900 outline-none" 
                                   />
                               </div>
                               <div>
                                   <label className="block text-sm font-medium text-slate-700 mb-1">{t.phone}</label>
                                   <input 
                                     type="text" 
                                     value={guideData.phoneNumber || ''} 
                                     onChange={e => setGuideData({...guideData, phoneNumber: e.target.value})}
                                     className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-slate-900 outline-none" 
                                     placeholder="+39 ..."
                                   />
                               </div>
                           </div>

                           <div className="space-y-4">
                               <h3 className="font-bold text-slate-900 border-b border-slate-100 pb-2 flex items-center gap-2">
                                   <ScrollText size={18} /> {t.cert}
                               </h3>
                               <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                                   <div className="flex items-start gap-3">
                                       <CheckCircle className="text-blue-600 shrink-0 mt-0.5" size={20} />
                                       <div>
                                           <h4 className="font-bold text-blue-900 text-sm">{t.certSub}</h4>
                                           <p className="text-xs text-blue-700 mb-3 leading-relaxed">
                                               {t.certDesc}
                                           </p>
                                           <div>
                                               <label className="block text-xs font-bold text-blue-800 mb-1 uppercase">{t.alboNum}</label>
                                               <input 
                                                 type="text" 
                                                 value={guideData.alboNumber} 
                                                 onChange={e => setGuideData({...guideData, alboNumber: e.target.value})}
                                                 className="w-full px-3 py-2 rounded-lg border border-blue-200 focus:ring-2 focus:ring-blue-600 outline-none font-mono text-sm" 
                                               />
                                           </div>
                                       </div>
                                   </div>
                               </div>
                               <div>
                                   <label className="block text-sm font-medium text-slate-700 mb-1">{t.bio}</label>
                                   <textarea 
                                     rows={4}
                                     value={guideData.bio}
                                     onChange={e => setGuideData({...guideData, bio: e.target.value})}
                                     className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-slate-900 outline-none resize-none text-sm"
                                   />
                               </div>
                           </div>
                       </div>
                       
                       <div className="pt-4 border-t border-slate-100 flex justify-end">
                           <button type="submit" className="bg-slate-900 text-white px-8 py-3 rounded-xl font-bold hover:bg-slate-800 transition-all flex items-center gap-2 shadow-lg shadow-slate-200">
                               <Save size={18} /> {t.save}
                           </button>
                       </div>
                   </div>
              </form>
          </div>
      )}

      {selectedClientForReview && (
        <SportsPassportModal 
          client={selectedClientForReview.client}
          onClose={() => setSelectedClientForReview(null)}
          onApprove={() => {
            onApproveRequest(selectedClientForReview.tripId, selectedClientForReview.client);
            setSelectedClientForReview(null);
          }}
          onReject={() => setSelectedClientForReview(null)}
          lang={lang}
        />
      )}
    </div>
  );
};

export default Dashboard;