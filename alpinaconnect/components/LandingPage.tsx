import React, { useState, useEffect } from 'react';
import { Mountain, Shield, LayoutDashboard, ArrowRight, Star, Globe, Users, Share2, MessageSquare, BarChart, Languages, Calendar, CheckCircle, CreditCard, Activity, Search } from 'lucide-react';
import AlpinaApp from './AlpinaApp';
import FeedbackModal from './FeedbackModal';
import StatsModal from './StatsModal';

const LandingPage = () => {
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const [isStatsOpen, setIsStatsOpen] = useState(false);
  const [lang, setLang] = useState<'it' | 'en'>('it');
  const [activeFeatureTab, setActiveFeatureTab] = useState<'client' | 'guide'>('client');

  // Track Page Views on Mount
  useEffect(() => {
    const currentViews = parseInt(localStorage.getItem('alpina_page_views') || '0');
    localStorage.setItem('alpina_page_views', (currentViews + 1).toString());
  }, []);
  
  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleShare = async () => {
    const shareData = {
      title: 'AlpinaConnect',
      text: lang === 'it' 
        ? 'La piattaforma digitale definitiva per Guide Alpine e appassionati.' 
        : 'The ultimate digital platform for Alpine Guides and enthusiasts.',
      url: window.location.href,
    };

    if (navigator.share && navigator.canShare(shareData)) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.debug('Share cancelled');
      }
    } else {
      try {
        await navigator.clipboard.writeText(window.location.href);
        alert(lang === 'it' ? 'Link copiato!' : 'Link copied!');
      } catch (err) {
        alert('Error copying link.');
      }
    }
  };

  // --- TRANSLATIONS DICTIONARY ---
  const t = {
    it: {
      share: "Condividi",
      demoBtn: "Prova la Demo",
      heroTitle: <>Trova la tua Guida per<br/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-white">ogni avventura in montagna.</span></>,
      heroSub: "La piattaforma digitale definitiva per Guide Alpine e appassionati. Marketplace globale, sicurezza verificata e gestione professionale.",
      ctaStart: "Inizia Ora",
      ctaFeedback: "Lascia Feedback",
      ctaNote: "Aiutaci a migliorare l'MVP. Il tuo parere è essenziale.",
      
      // Features Section
      featuresTitle: "Tutto ciò che ti serve",
      featuresSub: "Una suite completa di strumenti pensati per chi vive la montagna.",
      tabClient: "Per Appassionati",
      tabGuide: "Per Guide Alpine",
      
      // Client Features
      c1Title: "Marketplace Globale",
      c1Desc: "Trova avventure in tutto il mondo con filtri avanzati per attività e difficoltà.",
      c2Title: "Prenotazioni Sicure",
      c2Desc: "Sistema di pagamento integrato e polizze di cancellazione chiare.",
      c3Title: "Sports Passport",
      c3Desc: "Il tuo CV sportivo digitale. Tieni traccia delle tue ascese e condividi il tuo livello.",
      c4Title: "Chat Diretta",
      c4Desc: "Parla direttamente con la tua guida prima di prenotare per personalizzare l'esperienza.",

      // Guide Features
      g1Title: "Gestionale Completo",
      g1Desc: "Dashboard 'Mission Control' per gestire calendario, meteo e clienti in un unico posto.",
      g2Title: "Fatturazione Auto",
      g2Desc: "Generazione automatica di fatture e gestione fiscale semplificata.",
      g3Title: "CRM Clienti",
      g3Desc: "Visualizza il passaporto sportivo dei clienti per valutare l'idoneità tecnica.",
      g4Title: "Visibilità",
      g4Desc: "Raggiungi un pubblico globale e riempi i buchi nel tuo calendario.",

      demoTitle: "Prova la Piattaforma",
      demoDesc: "Interagisci direttamente con l'interfaccia reale. Esplora il marketplace, gestisci il profilo cliente e visualizza la dashboard della guida.",
      systemOnline: "Sistema Online",
      footerDesc: "Connettiamo passione e professionalità. La piattaforma leader per l'alpinismo moderno.",
      product: "Prodotto",
      company: "Compagnia",
      feedbackTitle: "Feedback",
      feedbackDesc: "Aiutaci a migliorare la piattaforma.",
      rights: "Tutti i diritti riservati.",
      adminStats: "Admin Stats"
    },
    en: {
      share: "Share",
      demoBtn: "Try Demo",
      heroTitle: <>Find your Guide for<br/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-white">every mountain adventure.</span></>,
      heroSub: "The ultimate digital platform for Alpine Guides and enthusiasts. Global marketplace, verified safety, and professional management.",
      ctaStart: "Start Now",
      ctaFeedback: "Give Feedback",
      ctaNote: "Help us improve this MVP. Your opinion is essential.",
      
      // Features Section
      featuresTitle: "Everything You Need",
      featuresSub: "A complete suite of tools designed for those who live the mountain life.",
      tabClient: "For Adventurers",
      tabGuide: "For Alpine Guides",

      // Client Features
      c1Title: "Global Marketplace",
      c1Desc: "Find adventures worldwide with advanced filters for activity and difficulty.",
      c2Title: "Secure Bookings",
      c2Desc: "Integrated payment system and clear cancellation policies.",
      c3Title: "Sports Passport",
      c3Desc: "Your digital sports CV. Track your ascents and share your skill level.",
      c4Title: "Direct Chat",
      c4Desc: "Chat directly with your guide before booking to customize the experience.",

      // Guide Features
      g1Title: "Complete Management",
      g1Desc: "'Mission Control' dashboard to manage calendar, weather, and clients in one place.",
      g2Title: "Auto Invoicing",
      g2Desc: "Automatic invoice generation and simplified tax management.",
      g3Title: "Client CRM",
      g3Desc: "View clients' sports passports to assess technical suitability.",
      g4Title: "Visibility",
      g4Desc: "Reach a global audience and fill gaps in your calendar.",

      demoTitle: "Try the Platform",
      demoDesc: "Interact directly with the real interface. Explore the marketplace, manage the client profile, and view the guide dashboard.",
      systemOnline: "System Online",
      footerDesc: "Connecting passion and professionalism. The leading platform for modern alpinism.",
      product: "Product",
      company: "Company",
      feedbackTitle: "Feedback",
      feedbackDesc: "Help us improve the platform.",
      rights: "All rights reserved.",
      adminStats: "Admin Stats"
    }
  }[lang];

  const clientFeatures = [
    { icon: Search, title: t.c1Title, desc: t.c1Desc },
    { icon: CreditCard, title: t.c2Title, desc: t.c2Desc },
    { icon: Activity, title: t.c3Title, desc: t.c3Desc },
    { icon: MessageSquare, title: t.c4Title, desc: t.c4Desc },
  ];

  const guideFeatures = [
    { icon: LayoutDashboard, title: t.g1Title, desc: t.g1Desc },
    { icon: Shield, title: t.g2Title, desc: t.g2Desc },
    { icon: Users, title: t.g3Title, desc: t.g3Desc },
    { icon: Globe, title: t.g4Title, desc: t.g4Desc },
  ];

  return (
    <div className="font-sans text-slate-900 bg-white relative">
      <FeedbackModal isOpen={isFeedbackOpen} onClose={() => setIsFeedbackOpen(false)} lang={lang} />
      <StatsModal isOpen={isStatsOpen} onClose={() => setIsStatsOpen(false)} />

      {/* --- HERO SECTION --- */}
      <div className="relative min-h-screen flex flex-col">
        {/* Navigation */}
        <nav className="absolute top-0 w-full z-20 px-6 py-6 flex justify-between items-center max-w-7xl mx-auto left-0 right-0">
          <div className="flex items-center gap-2">
             <div className="bg-white p-2 rounded-xl">
               <Mountain size={24} className="text-slate-900" strokeWidth={2.5} />
             </div>
             <span className="font-bold text-xl tracking-tight text-white drop-shadow-md">AlpinaConnect</span>
          </div>
          
          <div className="flex items-center gap-3">
            {/* Language Switcher */}
            <button 
                onClick={() => setLang(lang === 'it' ? 'en' : 'it')}
                className="bg-white/10 hover:bg-white/20 backdrop-blur-md text-white px-3 py-2.5 rounded-full font-bold text-sm transition-all flex items-center gap-2 cursor-pointer border border-white/10"
            >
                <Languages size={16} />
                <span>{lang.toUpperCase()}</span>
            </button>

            <button 
              onClick={handleShare}
              className="bg-white/10 hover:bg-white/20 backdrop-blur-md text-white px-4 py-2.5 rounded-full font-bold text-sm transition-all flex items-center gap-2 cursor-pointer border border-white/10"
              title={t.share}
            >
              <Share2 size={16} />
              <span className="hidden sm:inline">{t.share}</span>
            </button>
            <a 
              href="#demo" 
              onClick={(e) => scrollToSection(e, 'demo')}
              className="bg-white text-slate-900 px-6 py-2.5 rounded-full font-bold text-sm hover:bg-slate-100 transition-colors shadow-lg cursor-pointer"
            >
              {t.demoBtn}
            </a>
          </div>
        </nav>

        {/* Hero Content */}
        <div className="flex-1 flex items-center justify-center relative overflow-hidden">
           <img 
             src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=2070&auto=format&fit=crop" 
             className="absolute inset-0 w-full h-full object-cover"
             alt="Mountains"
           />
           <div className="absolute inset-0 bg-gradient-to-b from-slate-900/60 to-slate-900/40"></div>
           
           <div className="relative z-10 text-center px-4 max-w-4xl mx-auto mt-20">
              <h1 className="text-5xl md:text-7xl font-bold text-white tracking-tight mb-6 drop-shadow-xl">
                {t.heroTitle}
              </h1>
              <p className="text-lg md:text-xl text-slate-200 mb-10 max-w-2xl mx-auto leading-relaxed font-medium">
                {t.heroSub}
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                 <a 
                   href="#demo" 
                   onClick={(e) => scrollToSection(e, 'demo')}
                   className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-full font-bold text-lg transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1 flex items-center justify-center gap-2 cursor-pointer w-full sm:w-auto"
                 >
                   {t.ctaStart} <ArrowRight size={20}/>
                 </a>
                 <button 
                   onClick={() => setIsFeedbackOpen(true)}
                   className="bg-yellow-400 hover:bg-yellow-500 text-slate-900 px-8 py-4 rounded-full font-bold text-lg transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1 flex items-center justify-center gap-2 cursor-pointer w-full sm:w-auto"
                 >
                   <MessageSquare size={20} /> {t.ctaFeedback}
                 </button>
              </div>
              <p className="mt-4 text-slate-300 text-sm">{t.ctaNote}</p>
           </div>
        </div>
      </div>

      {/* --- FEATURES SECTION (DETAILED) --- */}
      <section id="features" className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">
           <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-slate-900 mb-4">{t.featuresTitle}</h2>
              <p className="text-slate-500 max-w-2xl mx-auto mb-8">{t.featuresSub}</p>
              
              {/* Toggle Switch */}
              <div className="inline-flex bg-white p-1.5 rounded-full border border-slate-200 shadow-sm">
                 <button 
                   onClick={() => setActiveFeatureTab('client')}
                   className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all ${activeFeatureTab === 'client' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-500 hover:text-slate-800'}`}
                 >
                   {t.tabClient}
                 </button>
                 <button 
                   onClick={() => setActiveFeatureTab('guide')}
                   className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all ${activeFeatureTab === 'guide' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-500 hover:text-slate-800'}`}
                 >
                   {t.tabGuide}
                 </button>
              </div>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {(activeFeatureTab === 'client' ? clientFeatures : guideFeatures).map((feature, idx) => (
                 <div key={idx} className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 group hover:-translate-y-1">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-colors ${activeFeatureTab === 'client' ? 'bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white' : 'bg-purple-50 text-purple-600 group-hover:bg-purple-600 group-hover:text-white'}`}>
                       <feature.icon size={28} />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 mb-3">{feature.title}</h3>
                    <p className="text-sm text-slate-500 leading-relaxed">
                      {feature.desc}
                    </p>
                 </div>
              ))}
           </div>
        </div>
      </section>

      {/* --- DEMO SECTION --- */}
      <section id="demo" className="py-24 bg-slate-900 text-white overflow-hidden relative">
         {/* Background decoration */}
         <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5 pointer-events-none"></div>
         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-600/20 rounded-full blur-[120px] pointer-events-none"></div>

         <div className="max-w-7xl mx-auto px-6 relative z-10">
            <div className="flex flex-col md:flex-row items-end justify-between mb-12 gap-6">
               <div className="max-w-xl">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30 text-xs font-bold uppercase tracking-wide mb-4">
                     <Star size={12} fill="currentColor" /> Live Preview
                  </div>
                  <h2 className="text-4xl font-bold mb-4">{t.demoTitle}</h2>
                  <p className="text-slate-400 text-lg">
                    {t.demoDesc}
                  </p>
               </div>
               <div className="flex items-center gap-4 text-sm font-medium text-slate-400">
                  <div className="flex items-center gap-2">
                     <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                     {t.systemOnline}
                  </div>
                  <div className="hidden md:block h-4 w-px bg-slate-700"></div>
                  <div className="hidden md:block">v2.4.0 Stable</div>
               </div>
            </div>

            {/* APP CONTAINER (Mock Window) */}
            <div className="rounded-2xl border border-slate-700/50 bg-slate-800 shadow-2xl overflow-hidden ring-1 ring-white/10">
               {/* Window Header */}
               <div className="h-12 bg-slate-800 border-b border-slate-700 flex items-center px-4 justify-between select-none">
                  <div className="flex gap-2">
                     <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                     <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                     <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
                  </div>
                  <div className="flex items-center gap-2 px-4 py-1.5 bg-slate-900 rounded-md text-xs text-slate-400 font-mono border border-slate-700">
                     <Shield size={10} /> alpinaconnect.com/app
                  </div>
                  <div className="w-16"></div> {/* Spacer */}
               </div>

               {/* The Actual App */}
               <div className="h-[800px] bg-white overflow-hidden relative isolate">
                  <AlpinaApp lang={lang} />
               </div>
            </div>
         </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="bg-white border-t border-slate-100 py-16">
         <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
               <div>
                  <div className="flex items-center gap-2 mb-6">
                     <div className="bg-slate-900 p-1.5 rounded-lg text-white">
                        <Mountain size={20} strokeWidth={2.5} />
                     </div>
                     <span className="font-bold text-xl tracking-tight text-slate-900">AlpinaConnect</span>
                  </div>
                  <p className="text-slate-500 text-sm leading-relaxed">
                     {t.footerDesc}
                  </p>
               </div>
               
               <div>
                  <h4 className="font-bold text-slate-900 mb-4">{t.product}</h4>
                  <ul className="space-y-3 text-sm text-slate-500">
                     <li><a href="#" className="hover:text-blue-600 transition-colors">Features</a></li>
                     <li><a href="#" className="hover:text-blue-600 transition-colors">For Guides</a></li>
                     <li><a href="#" className="hover:text-blue-600 transition-colors">For Clients</a></li>
                     <li><a href="#" className="hover:text-blue-600 transition-colors">Pricing</a></li>
                  </ul>
               </div>

               <div>
                  <h4 className="font-bold text-slate-900 mb-4">{t.company}</h4>
                  <ul className="space-y-3 text-sm text-slate-500">
                     <li><a href="#" className="hover:text-blue-600 transition-colors">About</a></li>
                     <li><a href="#" className="hover:text-blue-600 transition-colors">Careers</a></li>
                     <li><a href="#" className="hover:text-blue-600 transition-colors">Blog</a></li>
                     <li><a href="#" className="hover:text-blue-600 transition-colors">Contact</a></li>
                  </ul>
               </div>

               <div>
                  <h4 className="font-bold text-slate-900 mb-4">{t.feedbackTitle}</h4>
                  <p className="text-sm text-slate-500 mb-4">{t.feedbackDesc}</p>
                  <button onClick={() => setIsFeedbackOpen(true)} className="inline-flex items-center gap-2 text-sm font-bold text-blue-600 hover:text-blue-800 transition-colors">
                     {t.ctaFeedback} <MessageSquare size={14} />
                  </button>
               </div>
            </div>
            
            <div className="border-t border-slate-100 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-slate-400">
               <p>&copy; 2024 AlpinaConnect Inc. {t.rights}</p>
               <div className="flex gap-6 mt-4 md:mt-0 items-center">
                  <a href="#" className="hover:text-slate-900">Privacy Policy</a>
                  <a href="#" className="hover:text-slate-900">Terms of Service</a>
                  <button 
                    onClick={() => setIsStatsOpen(true)} 
                    className="flex items-center gap-1 text-slate-300 hover:text-slate-600 ml-4 transition-colors"
                    title={t.adminStats}
                  >
                     <BarChart size={14} /> {t.adminStats}
                  </button>
               </div>
            </div>
         </div>
      </footer>

      {/* Floating Action Button (FAB) for Feedback - Always visible on scroll */}
      <button 
         onClick={() => setIsFeedbackOpen(true)}
         className="fixed bottom-6 right-6 z-40 bg-yellow-400 hover:bg-yellow-500 text-slate-900 p-4 rounded-full shadow-2xl transition-transform hover:scale-110 flex items-center gap-2 font-bold"
      >
         <MessageSquare size={24} />
         <span className="hidden md:inline">{t.ctaFeedback}</span>
      </button>
    </div>
  );
};

export default LandingPage;