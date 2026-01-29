import React, { useState, useEffect } from 'react';
import FilterBar from './components/FilterBar';
import AnimalCard from './components/AnimalCard';
import AnimalModal from './components/AnimalModal';
import AdUnit from './components/AdUnit';
import { Animal, FilterType } from './types';
import { PRE_CACHED_ANIMALS } from './constants';
import { searchSpecies, fetchPreviewForList } from './services/biodiversityService';

function App() {
  const [currentFilter, setCurrentFilter] = useState<FilterType>(FilterType.ALL);
  const [selectedLetter, setSelectedLetter] = useState<string | null>('A'); 
  const [animals, setAnimals] = useState<Animal[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedAnimal, setSelectedAnimal] = useState<Animal | null>(null);
  const [scale, setScale] = useState(1);

  // Load "Pre-cached" list when a letter is selected
  useEffect(() => {
    if (selectedLetter) {
        setLoading(true);
        const names = PRE_CACHED_ANIMALS[selectedLetter] || [];
        fetchPreviewForList(names).then(data => {
            setAnimals(data);
            setLoading(false);
        });
    } else if (currentFilter === FilterType.ALL && !selectedLetter) {
        setAnimals([]);
    }
  }, [selectedLetter]);

  // Handle Search
  const handleSearch = async (query: string) => {
    if (!query) {
        if (selectedLetter) {
            const names = PRE_CACHED_ANIMALS[selectedLetter] || [];
            setLoading(true);
            fetchPreviewForList(names).then(data => {
                setAnimals(data);
                setLoading(false);
            });
        }
        return;
    }
    setSelectedLetter(null);
    setLoading(true);
    const results = await searchSpecies(query, currentFilter);
    setAnimals(results);
    setLoading(false);
  };

  const handleFilterChange = (type: FilterType) => {
    setCurrentFilter(type);
    if (type !== FilterType.ALL) {
        setSelectedLetter(null);
        setLoading(true);
        searchSpecies("", type).then(res => {
            setAnimals(res);
            setLoading(false);
        });
    } else {
        setSelectedLetter('A');
    }
  };

  const toggleScale = () => {
    // Cycle between 1x, 1.25x, 1.5x
    setScale(prev => prev >= 1.5 ? 1 : prev + 0.25);
  };

  return (
    <div className="min-h-screen bg-stone-900 flex justify-center py-4 sm:py-8 px-2 sm:px-4 overflow-x-hidden">
      {/* Left Sidebar Ad */}
      <div className="hidden xl:block w-[160px] shrink-0 sticky top-8 self-start">
        <AdUnit adSlot="8595191069" />
      </div>

      {/* Scale Wrapper */}
      <div
        style={{
            transform: `scale(${scale})`,
            transformOrigin: 'top center',
            // Add margin bottom to compensate for the vertical space growth when scaling
            marginBottom: `${(scale - 1) * 800}px`
        }}
        className="transition-all duration-300 ease-out w-full flex justify-center"
      >
        {/* Pokedex Main Body */}
        <div className="relative w-full max-w-5xl bg-dex-red rounded-3xl border-4 border-dex-darkRed shadow-2xl overflow-hidden flex flex-col h-[90vh]">
            
            {/* Top Section (Lights & Sensor) */}
            <div className="bg-dex-red h-24 sm:h-32 p-6 flex items-start border-b-8 border-dex-darkRed shadow-md relative z-20 shrink-0">
                {/* Big Blue Light */}
                <div className="relative">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-stone-100 border-4 border-stone-100 flex items-center justify-center shadow-lg">
                        <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-dex-blue border-4 border-blue-400 relative overflow-hidden animate-pulse">
                            <div className="absolute top-3 left-3 w-4 h-4 bg-white/60 rounded-full blur-sm"></div>
                        </div>
                    </div>
                </div>
                
                {/* 3 Small Lights */}
                <div className="flex gap-3 ml-6 mt-1">
                    <div className="w-4 h-4 rounded-full bg-red-600 border border-red-800 shadow-inner"></div>
                    <div className="w-4 h-4 rounded-full bg-dex-yellow border border-yellow-600 shadow-inner"></div>
                    <div className="w-4 h-4 rounded-full bg-green-500 border border-green-700 shadow-inner"></div>
                </div>

                <div className="ml-auto mt-2 flex flex-col items-end">
                    <h1 className="font-tech text-3xl text-white font-bold tracking-widest drop-shadow-md">CHRONOCRUZ BIO-DEX</h1>
                    <button 
                        onClick={toggleScale}
                        className="mt-1 px-2 py-0.5 bg-stone-800 border border-stone-600 rounded text-[10px] text-dex-cyan font-tech hover:bg-stone-700 hover:text-white transition-colors cursor-pointer shadow-dex-btn active:shadow-dex-btn-active active:translate-y-[2px]"
                        title="Toggle UI Scale"
                    >
                        SCALE: {scale * 100}%
                    </button>
                </div>
            </div>
            
            {/* Main Content Area (The Screen) */}
            <div className="flex-1 bg-dex-red p-4 sm:p-8 flex flex-col min-h-0">
                
                {/* Inner Dark Screen Container */}
                <div className="bg-dex-ui p-4 sm:p-6 rounded-xl border-b-4 border-r-4 border-stone-400 shadow-inner flex flex-col h-full">
                    
                    {/* Top tiny red dots on bezel */}
                    <div className="flex justify-center gap-4 mb-4 shrink-0">
                        <div className="w-2 h-2 bg-dex-red rounded-full"></div>
                        <div className="w-2 h-2 bg-dex-red rounded-full"></div>
                    </div>

                    {/* The Digital Screen */}
                    <div className="flex-1 bg-dex-screen rounded-lg border-4 border-stone-600 shadow-inset-screen overflow-hidden flex flex-col relative min-h-0">
                        {/* Filter Control Panel */}
                        <FilterBar 
                            currentFilter={currentFilter}
                            onFilterChange={handleFilterChange}
                            onSearch={handleSearch}
                            selectedLetter={selectedLetter}
                            onLetterSelect={(l) => {
                                setSelectedLetter(l);
                                if (l) setCurrentFilter(FilterType.ALL);
                            }}
                        />

                        {/* Scrollable List */}
                        <main className="flex-1 overflow-y-auto p-4 sm:p-6 no-scrollbar relative">
                            {/* Scanlines Overlay */}
                            <div className="pointer-events-none absolute inset-0 z-10 scanline opacity-10"></div>
                            
                            {loading ? (
                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                    {[...Array(6)].map((_, i) => (
                                        <div key={i} className="h-40 w-full animate-pulse rounded border-2 border-green-900 bg-green-900/20"></div>
                                    ))}
                                </div>
                            ) : animals.length > 0 ? (
                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 pb-8">
                                    {animals.map((animal) => (
                                        <AnimalCard 
                                            key={animal.id} 
                                            animal={animal} 
                                            onClick={setSelectedAnimal} 
                                        />
                                    ))}
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center h-full text-center text-dex-cyan font-tech">
                                    <div className="animate-bounce mb-4 text-4xl">NO DATA</div>
                                    <p>ADJUST SENSORS (FILTERS) TO DETECT LIFEFORMS</p>
                                </div>
                            )}
                        </main>

                        {/* Bottom Status Bar */}
                        <div className="h-8 bg-black/80 flex items-center justify-between px-4 text-xs font-tech text-dex-cyan border-t border-stone-700 shrink-0">
                            <span>STATUS: ONLINE</span>
                            <span>BATTERY: 98%</span>
                        </div>
                    </div>

                    {/* Bottom bezel decorations */}
                    <div className="flex justify-between items-center mt-4 px-4 shrink-0">
                        <div className="w-8 h-8 rounded-full bg-red-600 border-2 border-red-800"></div>
                        <div className="flex flex-col gap-1">
                            <div className="w-24 h-1 bg-stone-400 rounded"></div>
                            <div className="w-24 h-1 bg-stone-400 rounded"></div>
                            <div className="w-24 h-1 bg-stone-400 rounded"></div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Hinge Visual */}
            <div className="h-6 bg-dex-darkRed border-t border-red-900 shrink-0"></div>
        </div>
      </div>

      {/* Right Sidebar Ad */}
      <div className="hidden xl:block w-[160px] shrink-0 sticky top-8 self-start">
        <AdUnit adSlot="8595191069" />
      </div>

      <AnimalModal 
        animal={selectedAnimal} 
        onClose={() => setSelectedAnimal(null)} 
      />
    </div>
  );
}

export default App;