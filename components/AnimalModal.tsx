import React, { useEffect, useState, useRef } from 'react';
import { Animal, AnimalDetail, ChatMessage } from '../types';
import { getSpeciesDetails } from '../services/biodiversityService';
import { generateAnimalSummary, chatWithNaturalist, generateFunFact } from '../services/geminiService';

interface AnimalModalProps {
  animal: Animal | null;
  onClose: () => void;
}

const AnimalModal: React.FC<AnimalModalProps> = ({ animal, onClose }) => {
  const [details, setDetails] = useState<AnimalDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [aiSummary, setAiSummary] = useState<string>('');
  const [funFact, setFunFact] = useState<string>('');
  
  // Chat State
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [isChatting, setIsChatting] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (animal) {
      setLoading(true);
      setDetails(null);
      setAiSummary('');
      setFunFact('');
      setChatHistory([{ id: 'init', role: 'model', text: `SYSTEM INITIALIZED. SUBJECT: ${animal.commonName.toUpperCase()}. WAITING FOR INPUT...` }]);
      
      const fetchData = async () => {
        const [fetchedDetails, summary, fact] = await Promise.all([
          getSpeciesDetails(animal.id),
          generateAnimalSummary(animal.commonName),
          generateFunFact(animal.commonName)
        ]);
        
        setDetails(fetchedDetails);
        setAiSummary(summary);
        setFunFact(fact);
        setLoading(false);
      };

      fetchData();
    }
  }, [animal]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || !animal) return;

    const userMsg: ChatMessage = { id: Date.now().toString(), role: 'user', text: chatInput };
    setChatHistory(prev => [...prev, userMsg]);
    setChatInput('');
    setIsChatting(true);

    try {
      const historyForApi = chatHistory.map(m => ({ role: m.role, text: m.text }));
      const responseText = await chatWithNaturalist(historyForApi, userMsg.text, animal.commonName);
      setChatHistory(prev => [...prev, { id: (Date.now() + 1).toString(), role: 'model', text: responseText || "DATA CORRUPTION. RETRY." }]);
    } catch (err) {
      setChatHistory(prev => [...prev, { id: (Date.now() + 1).toString(), role: 'model', text: "CONNECTION LOST." }]);
    } finally {
      setIsChatting(false);
    }
  };

  if (!animal) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity" onClick={onClose} />
      
      {/* Device Body */}
      <div className="relative flex h-full max-h-[95vh] w-full max-w-6xl flex-col overflow-hidden rounded-xl border-4 border-dex-darkRed bg-dex-red shadow-2xl md:flex-row">
        
        {/* Close Button Mobile */}
        <button onClick={onClose} className="absolute top-2 right-2 z-20 rounded bg-stone-900 border border-stone-500 p-2 text-red-500 font-pixel hover:bg-stone-800 md:hidden">
          CLOSE [X]
        </button>

        {/* Left Panel: Image Visualizer */}
        <div className="relative h-64 w-full bg-dex-screen p-4 md:h-full md:w-5/12 border-b-4 md:border-b-0 md:border-r-4 border-dex-darkRed flex flex-col">
            <div className="mb-2 flex justify-between items-center text-dex-cyan font-tech text-xs">
                 <span>VISUAL_FEED_01</span>
                 <span className="animate-pulse">RECORDING...</span>
            </div>
            
            <div className="flex-1 rounded border-2 border-stone-600 bg-black overflow-hidden relative group">
                {details?.imageUrl || animal.imageUrl ? (
                    <img 
                        src={details?.imageUrl || animal.imageUrl} 
                        alt={animal.commonName}
                        className="h-full w-full object-contain"
                    />
                ) : (
                    <div className="flex h-full w-full items-center justify-center text-dex-cyan font-pixel">NO SIGNAL</div>
                )}
                {/* Grid Overlay */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%] pointer-events-none"></div>
                
                {/* Targeting Reticle */}
                <div className="absolute top-4 left-4 w-4 h-4 border-t-2 border-l-2 border-dex-cyan opacity-50"></div>
                <div className="absolute bottom-4 right-4 w-4 h-4 border-b-2 border-r-2 border-dex-cyan opacity-50"></div>
            </div>

            <div className="mt-4 bg-stone-800 p-2 rounded border border-stone-600">
                <h2 className="text-2xl font-pixel text-white uppercase text-center tracking-widest">{animal.commonName}</h2>
                <p className="font-tech text-xs text-center text-dex-cyan uppercase">{details?.scientificName || animal.scientificName}</p>
            </div>
        </div>

        {/* Right Panel: Data Readout */}
        <div className="flex flex-1 flex-col overflow-hidden bg-stone-200">
          <div className="flex-1 overflow-y-auto p-4 md:p-6 bg-stone-800 text-stone-300 font-tech">
             
             {/* Header Controls */}
             <div className="flex justify-between items-start mb-6">
                 <div className="flex gap-2">
                    <span className="px-2 py-1 bg-dex-blue text-white text-xs border border-blue-400 rounded-sm">
                        {details?.taxonomy.class || 'ANIMALIA'}
                    </span>
                    <span className="px-2 py-1 bg-stone-600 text-white text-xs border border-stone-500 rounded-sm">
                        {details?.taxonomy.order || 'UNKNOWN'}
                    </span>
                 </div>
                 <button onClick={onClose} className="hidden md:block text-dex-red hover:text-white font-pixel text-xl uppercase">
                    [ POWER OFF ]
                 </button>
            </div>

            {loading ? (
              <div className="space-y-4 font-pixel text-green-500 animate-pulse">
                <p>{'>'} DOWNLOADING BIOMETRICS...</p>
                <p>{'>'} ANALYZING DNA SEQUENCE...</p>
                <p>{'>'} ACCESSING GLOBAL DATABASE...</p>
              </div>
            ) : (
              <div className="space-y-6">
                
                {/* AI Analysis Box */}
                <div className="bg-stone-900 border border-stone-600 p-4 rounded relative overflow-hidden">
                   <div className="absolute top-0 left-0 w-full h-1 bg-dex-cyan opacity-50"></div>
                   <div className="flex items-center gap-2 mb-2 text-dex-cyan border-b border-stone-700 pb-2">
                       <span className="font-pixel text-lg">AI_ANALYSIS_MODULE</span>
                   </div>
                   <p className="text-stone-300 text-sm leading-relaxed font-mono">
                      {aiSummary}
                   </p>
                </div>

                {/* Data Grid */}
                <div className="grid grid-cols-2 gap-4">
                     <div className="bg-stone-900 border border-stone-600 p-2 rounded">
                        <p className="text-[10px] text-stone-500 uppercase">Conservation Status</p>
                        <p className="text-dex-yellow font-bold uppercase">{details?.conservationStatus || 'N/A'}</p>
                     </div>
                     <div className="bg-stone-900 border border-stone-600 p-2 rounded">
                        <p className="text-[10px] text-stone-500 uppercase">Family</p>
                        <p className="text-white font-bold uppercase">{details?.taxonomy.family || animal.family || 'N/A'}</p>
                     </div>
                </div>

                {/* Fun Fact Warning */}
                 {funFact && (
                    <div className="border border-dex-yellow bg-yellow-900/20 p-3 rounded">
                        <p className="text-xs font-bold text-dex-yellow uppercase mb-1 flex items-center">
                            <span className="animate-pulse mr-2">⚠</span> INTERESTING FACT
                        </p>
                        <p className="text-stone-200 text-sm italic">"{funFact}"</p>
                    </div>
                )}

                {/* Description */}
                <div>
                   <h3 className="font-pixel text-lg text-white mb-1 bg-stone-700 px-2">ENTRY DESCRIPTION</h3>
                   <div className="bg-stone-900 p-3 border-l-4 border-stone-500 text-sm text-stone-400">
                     {details?.description ? details.description.replace(/<[^>]*>?/gm, '').slice(0, 300) + '...' : 'DATA NOT FOUND IN ARCHIVES.'}
                   </div>
                </div>

              </div>
            )}
          </div>

          {/* Chat Terminal */}
          <div className="h-1/3 min-h-[200px] border-t-4 border-dex-darkRed bg-black p-4 flex flex-col font-tech">
             <div className="text-xs text-green-600 mb-2 flex justify-between">
                <span>TERMINAL_LINK_ESTABLISHED</span>
                <span>BAUD: 9600</span>
             </div>
             
             <div className="flex-1 overflow-y-auto mb-2 space-y-1 pr-2 no-scrollbar">
                {chatHistory.map((msg) => (
                    <div key={msg.id} className={`text-sm break-words ${msg.role === 'user' ? 'text-dex-cyan text-right' : 'text-green-500'}`}>
                        <span className="opacity-50 text-[10px] mr-2">[{msg.role === 'user' ? 'USR' : 'SYS'}]</span>
                        {msg.text}
                    </div>
                ))}
                {isChatting && (
                    <div className="text-green-500 text-sm animate-pulse">{'>'} PROCESSING REQUEST...</div>
                )}
                <div ref={chatEndRef} />
             </div>

             <form onSubmit={handleSendMessage} className="flex gap-2 border-t border-green-900/50 pt-2">
                <span className="text-green-500 text-lg">{'>'}</span>
                <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    placeholder="ENTER QUERY..."
                    className="flex-1 bg-transparent border-none text-green-500 focus:outline-none uppercase font-tech placeholder-green-900"
                    autoFocus
                />
             </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnimalModal;