import React, { useEffect, useState } from 'react';
import { X, Eye, MessageSquare, Trash2, Calendar, User, AlertCircle, Sparkles } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

interface FeedbackItem {
  id: number;
  date: string;
  rating: number;
  role: string;
  comment: string;
  // Specific Guide Questions
  q1_intro?: string;
  q2_pain?: string;
  q3_solution?: string;
}

const StatsModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const [views, setViews] = useState(0);
  const [feedbacks, setFeedbacks] = useState<FeedbackItem[]>([]);

  useEffect(() => {
    if (isOpen) {
      // Read data from localStorage
      const storedViews = localStorage.getItem('alpina_page_views') || '0';
      const storedFeedbacks = JSON.parse(localStorage.getItem('alpina_feedback_data') || '[]');
      
      setViews(parseInt(storedViews));
      setFeedbacks(storedFeedbacks);
    }
  }, [isOpen]);

  const clearData = () => {
    if(confirm('Sei sicuro di voler cancellare tutte le statistiche?')) {
        localStorage.removeItem('alpina_page_views');
        localStorage.removeItem('alpina_feedback_data');
        setViews(0);
        setFeedbacks([]);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-slate-900 p-6 flex justify-between items-center shrink-0">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            📊 Statistiche Admin (MVP)
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X size={24} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto bg-slate-50 flex-1">
           {/* KPI Cards */}
           <div className="grid grid-cols-2 gap-6 mb-8">
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
                 <div className="p-4 bg-blue-50 text-blue-600 rounded-xl">
                    <Eye size={32} />
                 </div>
                 <div>
                    <p className="text-slate-500 text-sm font-bold uppercase">Visualizzazioni Pagina</p>
                    <h3 className="text-4xl font-bold text-slate-900">{views}</h3>
                 </div>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
                 <div className="p-4 bg-purple-50 text-purple-600 rounded-xl">
                    <MessageSquare size={32} />
                 </div>
                 <div>
                    <p className="text-slate-500 text-sm font-bold uppercase">Risposte Form</p>
                    <h3 className="text-4xl font-bold text-slate-900">{feedbacks.length}</h3>
                 </div>
              </div>
           </div>

           {/* Feedback List */}
           <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-white sticky top-0 z-10">
                 <h3 className="font-bold text-slate-900">Feedback Ricevuti</h3>
                 <button onClick={clearData} className="text-red-500 text-xs font-bold flex items-center gap-1 hover:bg-red-50 px-3 py-1.5 rounded-lg transition-colors">
                    <Trash2 size={14} /> Reset Dati
                 </button>
              </div>
              
              {feedbacks.length === 0 ? (
                  <div className="p-12 text-center text-slate-400">
                      <p>Nessun feedback ricevuto ancora.</p>
                  </div>
              ) : (
                  <div className="divide-y divide-slate-100">
                     {feedbacks.map((fb) => (
                        <div key={fb.id} className="p-6 hover:bg-slate-50 transition-colors">
                           <div className="flex justify-between items-start mb-4">
                              <div className="flex items-center gap-2">
                                 <span className={`font-bold px-2 py-0.5 rounded-md text-sm ${fb.role === 'Guida Alpina' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-700'}`}>
                                    {fb.role}
                                 </span>
                                 <span className="text-slate-300">•</span>
                                 <span className="text-xs text-slate-500 flex items-center gap-1">
                                    <Calendar size={12} /> {fb.date}
                                 </span>
                              </div>
                              <div className="flex gap-1">
                                 {[1, 2, 3, 4, 5].map(star => (
                                     <span key={star} className={star <= fb.rating ? 'text-yellow-400' : 'text-slate-200'}>★</span>
                                 ))}
                              </div>
                           </div>
                           
                           {/* Content Logic based on Role */}
                           {fb.role === 'Guida Alpina' && (fb.q1_intro || fb.q2_pain || fb.q3_solution) ? (
                               <div className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-100">
                                   <div>
                                       <div className="text-xs font-bold text-slate-400 uppercase mb-1 flex items-center gap-1">
                                           <User size={12}/> Intro & Zona
                                       </div>
                                       <p className="text-slate-800 text-sm">{fb.q1_intro}</p>
                                   </div>
                                   <div>
                                       <div className="text-xs font-bold text-orange-400 uppercase mb-1 flex items-center gap-1">
                                           <AlertCircle size={12}/> Pain Points
                                       </div>
                                       <p className="text-slate-800 text-sm">{fb.q2_pain}</p>
                                   </div>
                                   <div>
                                       <div className="text-xs font-bold text-purple-400 uppercase mb-1 flex items-center gap-1">
                                           <Sparkles size={12}/> Soluzione Ideale
                                       </div>
                                       <p className="text-slate-800 text-sm">{fb.q3_solution}</p>
                                   </div>
                               </div>
                           ) : (
                               <p className="text-slate-600 text-sm leading-relaxed italic">"{fb.comment}"</p>
                           )}
                        </div>
                     ))}
                  </div>
              )}
           </div>
        </div>
      </div>
    </div>
  );
};

export default StatsModal;