import React, { useState } from 'react';
import { Trip, Difficulty, ActivityType } from '../types';
import { MapPin, Calendar, ArrowRight, List, Map as MapIcon, X, Star, MessageCircle, Send } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import BookingModal from './BookingModal';
import L from 'leaflet';

interface Props {
  trips: Trip[];
  onRequestJoin: (tripId: string, date: string) => void;
  lang: 'it' | 'en';
}

// Fix for default Leaflet marker icons not loading in some bundlers
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const Marketplace: React.FC<Props> = ({ trips, onRequestJoin, lang }) => {
  const [viewMode, setViewMode] = useState<'list' | 'map'>('map');
  const [contactModalTrip, setContactModalTrip] = useState<Trip | null>(null);
  const [bookingModalTrip, setBookingModalTrip] = useState<Trip | null>(null);

  const t = {
    it: {
      exploreTitle: "Esplora le Alpi e non solo",
      exploreSub: "Trova la tua prossima avventura con le migliori guide alpine.",
      all: "Tutte",
      list: "Elenco",
      map: "Mappa",
      guide: "Guida Alpina",
      chat: "Chat",
      book: "Prenota",
      customize: "Personalizza",
      days: "gg",
      availableUntil: "Disponibile fino al",
      customizeTitle: "Personalizza Esperienza",
      writeTo: "Scrivi a",
      subject: "Oggetto",
      messageLabel: "Il tuo Messaggio",
      messagePlaceholder: "Ciao! Vorrei sapere se è possibile modificare l'itinerario...",
      sendMessage: "Invia Messaggio",
      reqInfo: "Richiesta info",
      msgSent: "Messaggio inviato a",
      msgSentSub: "Ti risponderà presto."
    },
    en: {
      exploreTitle: "Explore the Alps and Beyond",
      exploreSub: "Find your next adventure with the best alpine guides.",
      all: "All",
      list: "List",
      map: "Map",
      guide: "Alpine Guide",
      chat: "Chat",
      book: "Book",
      customize: "Customize",
      days: "days",
      availableUntil: "Available until",
      customizeTitle: "Customize Experience",
      writeTo: "Write to",
      subject: "Subject",
      messageLabel: "Your Message",
      messagePlaceholder: "Hi! I would like to know if it's possible to change the itinerary...",
      sendMessage: "Send Message",
      reqInfo: "Info request",
      msgSent: "Message sent to",
      msgSentSub: "They will reply soon."
    }
  }[lang];

  const categories = [t.all, ...Object.values(ActivityType)];

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`${t.msgSent} ${contactModalTrip?.guideName}! ${t.msgSentSub}`);
    setContactModalTrip(null);
  };

  const handleBookingConfirm = (date: string) => {
    if (bookingModalTrip) {
      onRequestJoin(bookingModalTrip.id, date);
      setBookingModalTrip(null);
    }
  };

  // Custom function to create div icons for the map
  const createCustomIcon = (price: number, difficulty: string) => {
    const colorClass = difficulty === Difficulty.Expert ? '#ef4444' : difficulty === Difficulty.Hard ? '#f97316' : '#22c55e'; // tailwind colors
    
    return L.divIcon({
      className: 'custom-pin',
      html: `
        <div style="position: relative; display: flex; align-items: center; justify-content: center;">
          <div style="width: 32px; height: 32px; border-radius: 9999px; background-color: ${colorClass}; border: 2px solid white; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1); display: flex; align-items: center; justify-content: center; color: white;">
             <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m8 3 4 8 5-5 5 15H2L8 3z"/></svg>
          </div>
          <div style="position: absolute; top: 100%; margin-top: 4px; background-color: rgba(0,0,0,0.75); color: white; font-size: 10px; padding: 2px 6px; border-radius: 4px; white-space: nowrap; backdrop-filter: blur(4px);">
             €${price}
          </div>
        </div>
      `,
      iconSize: [32, 32],
      iconAnchor: [16, 16], // Center
      popupAnchor: [0, -20]
    });
  };

  return (
    <div className="space-y-8 pb-20">
      {/* Hero Section */}
      <div className="relative rounded-3xl overflow-hidden h-[300px] text-white">
        <img 
          src="https://images.unsplash.com/photo-1551632811-561732d1e306?q=80&w=2070&auto=format&fit=crop" 
          alt="Alps" 
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-transparent flex flex-col justify-end p-8 md:p-12">
           <h1 className="text-3xl md:text-4xl font-bold mb-2">
             {t.exploreTitle}
           </h1>
           <p className="text-slate-200 max-w-xl">
             {t.exploreSub}
           </p>
        </div>
      </div>

      {/* Filter & View Toggle Bar */}
      <div className="sticky top-4 z-30 bg-white/90 backdrop-blur-md p-2 rounded-2xl shadow-sm border border-slate-100/50 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex gap-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 no-scrollbar px-2">
          {categories.map((f, i) => (
            <button key={i} className={`whitespace-nowrap px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${i === 0 ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
              {f}
            </button>
          ))}
        </div>

        <div className="flex bg-slate-100 p-1 rounded-xl shrink-0">
          <button 
            onClick={() => setViewMode('list')}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${viewMode === 'list' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            <List size={16} /> {t.list}
          </button>
          <button 
            onClick={() => setViewMode('map')}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${viewMode === 'map' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            <MapIcon size={16} /> {t.map}
          </button>
        </div>
      </div>

      {/* CONTENT: Map View */}
      {viewMode === 'map' && (
        <div className="bg-slate-100 rounded-3xl overflow-hidden h-[600px] relative border border-slate-200 shadow-inner z-0">
            <MapContainer 
                center={[45.8, 9.0]} // Center Northern Italy roughly
                zoom={7} 
                style={{ height: '100%', width: '100%' }}
                className="z-0"
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {trips.map(trip => (
                    <Marker 
                        key={trip.id} 
                        position={[trip.coordinates.lat, trip.coordinates.lng]}
                        icon={createCustomIcon(trip.price, trip.difficulty)}
                    >
                        <Popup className="custom-popup" closeButton={false} maxWidth={300} minWidth={280}>
                           <div className="p-0">
                                <div className="relative">
                                    <img src={trip.image} className="w-full h-32 object-cover rounded-t-xl" alt="" />
                                    <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide">
                                        {trip.activityType}
                                    </div>
                                </div>
                                <div className="p-3">
                                    <div className="flex items-center gap-1 text-yellow-500 text-xs font-bold mb-1">
                                        <Star size={12} fill="currentColor" /> {trip.guideRating}
                                        <span className="text-slate-400 font-normal">• {trip.guideName}</span>
                                    </div>
                                    <h4 className="font-bold text-slate-900 text-sm leading-tight mb-1">{trip.title}</h4>
                                    <p className="text-xs text-slate-500 mb-3 flex items-center gap-1"><MapPin size={10}/> {trip.location}</p>
                                    
                                    <div className="flex gap-2">
                                        <button 
                                            onClick={(e) => { e.stopPropagation(); setContactModalTrip(trip); }}
                                            className="flex-1 bg-white border border-slate-200 text-slate-700 text-xs font-bold py-2 rounded-lg hover:bg-slate-50 transition-colors flex items-center justify-center gap-1"
                                        >
                                            <MessageCircle size={12} /> {t.chat}
                                        </button>
                                        <button 
                                            onClick={(e) => { e.stopPropagation(); setBookingModalTrip(trip); }}
                                            className="flex-1 bg-slate-900 text-white text-xs font-bold py-2 rounded-lg hover:bg-slate-800 transition-colors"
                                        >
                                            {t.book}
                                        </button>
                                    </div>
                                </div>
                           </div>
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>
        </div>
      )}

      {/* CONTENT: List View */}
      {viewMode === 'list' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-in fade-in duration-300">
          {trips.map(trip => (
            <div key={trip.id} className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 flex flex-col h-full">
              <div className="relative h-56 overflow-hidden">
                 <img 
                   src={trip.image} 
                   alt={trip.title} 
                   className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                 />
                 <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-lg text-xs font-bold text-slate-900 uppercase tracking-wide">
                   {trip.activityType}
                 </div>
                 <div className="absolute bottom-4 left-4 text-white">
                    <div className="flex items-center gap-1.5 text-sm font-medium bg-black/40 px-2 py-1 rounded-md backdrop-blur-sm">
                      <MapPin size={14} /> {trip.location}
                    </div>
                 </div>
              </div>

              <div className="p-6 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors leading-tight">{trip.title}</h3>
                  <span className="text-lg font-bold text-slate-900">€{trip.price}</span>
                </div>
                
                <div className="flex gap-4 mb-4 text-sm text-slate-500">
                   <div className="flex items-center gap-1.5">
                      <Calendar size={16} className="text-blue-500" />
                      {trip.durationDays} {t.days}
                   </div>
                   <div className="flex items-center gap-1.5 text-xs text-slate-400">
                      {t.availableUntil} {trip.availableTo}
                   </div>
                </div>

                <div className="border-t border-slate-100 my-4 pt-4">
                   <div className="flex items-center justify-between">
                     <div className="flex items-center gap-2">
                       <img src={trip.guideAvatar} alt={trip.guideName} className="w-8 h-8 rounded-full border border-slate-200" />
                       <div>
                         <div className="text-xs text-slate-500 font-medium">{t.guide}</div>
                         <div className="text-sm font-bold text-slate-800 flex items-center gap-1">
                           {trip.guideName}
                           <div className="flex items-center text-yellow-400 text-xs">
                             <Star size={10} fill="currentColor" /> {trip.guideRating}
                           </div>
                         </div>
                       </div>
                     </div>
                   </div>
                </div>
                
                <div className="mt-auto flex gap-3">
                   <button 
                    onClick={() => setContactModalTrip(trip)}
                    className="flex-1 bg-white border border-slate-200 text-slate-700 px-4 py-2.5 rounded-lg text-sm font-bold hover:bg-slate-50 transition-colors flex items-center justify-center gap-2">
                     <MessageCircle size={16} /> {t.customize}
                   </button>
                   <button 
                    onClick={() => setBookingModalTrip(trip)}
                    className="flex-1 bg-slate-900 text-white px-4 py-2.5 rounded-lg text-sm font-bold hover:bg-slate-800 transition-colors flex items-center justify-center gap-2">
                     {t.book} <ArrowRight size={16} />
                   </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* CONTACT MODAL */}
      {contactModalTrip && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
           <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
              <div className="bg-slate-900 text-white p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-bold">{t.customizeTitle}</h3>
                  <button onClick={() => setContactModalTrip(null)} className="text-slate-300 hover:text-white">
                    <X size={24} />
                  </button>
                </div>
                <div className="flex items-center gap-3 bg-slate-800/50 p-3 rounded-xl border border-slate-700/50">
                  <img src={contactModalTrip.guideAvatar} className="w-10 h-10 rounded-full" alt="Guide" />
                  <div>
                    <p className="text-xs text-slate-400 uppercase font-bold">{t.writeTo}</p>
                    <p className="font-bold">{contactModalTrip.guideName}</p>
                  </div>
                </div>
              </div>
              <form onSubmit={handleContactSubmit} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">{t.subject}</label>
                  <input 
                    readOnly
                    value={`${t.reqInfo}: ${contactModalTrip.title}`}
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-500 text-sm font-medium"
                  />
                </div>
                <div>
                   <label className="block text-sm font-bold text-slate-700 mb-1">{t.messageLabel}</label>
                   <textarea 
                     rows={4}
                     className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-900 outline-none text-sm resize-none"
                     placeholder={t.messagePlaceholder}
                     autoFocus
                   ></textarea>
                </div>
                <button type="submit" className="w-full bg-slate-900 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-slate-800 transition-all">
                  <Send size={18} /> {t.sendMessage}
                </button>
              </form>
           </div>
        </div>
      )}

      {/* BOOKING CALENDAR MODAL */}
      {bookingModalTrip && (
        <BookingModal 
          trip={bookingModalTrip} 
          onClose={() => setBookingModalTrip(null)} 
          onConfirm={handleBookingConfirm} 
          lang={lang}
        />
      )}
    </div>
  );
};

export default Marketplace;