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
    <div className="min-h-[100dvh] bg-stone-900 flex justify-center py-2 sm:py-8 px-2 sm:px-4 overflow-x-hidden">
      {/* Left Sidebar Ad */}
      <div className="hidden xl:block w-[160px] shrink-0 sticky top-8 self-start">
        <AdUnit adSlot="8595191069" />
      </div>

      {/* Scale Wrapper */}
      <div
        style={{
            transform: window.innerWidth > 640 ? `scale(${scale})` : 'none',
            transformOrigin: 'top center',
            marginBottom: window.innerWidth > 640 ? `${(scale - 1) * 800}px` : '0px'
        }}
        className="transition-all duration-300 ease-out w-full flex justify-center"
      >
        {/* Pokedex Main Body */}
        <div className="relative w-full max-w-5xl bg-dex-red rounded-xl sm:rounded-3xl border-2 sm:border-4 border-dex-darkRed shadow-2xl overflow-hidden flex flex-col h-[95dvh] sm:h-[90vh]">

            {/* Top Section (Lights & Sensor) */}
            <div className="bg-dex-red h-auto sm:h-32 p-3 sm:p-6 flex items-start border-b-4 sm:border-b-8 border-dex-darkRed shadow-md relative z-20 shrink-0">
                {/* Big Blue Light */}
                <div className="relative">
                    <div className="w-12 h-12 sm:w-20 sm:h-20 rounded-full bg-stone-100 border-2 sm:border-4 border-stone-100 flex items-center justify-center shadow-lg">
                        <div className="w-10 h-10 sm:w-16 sm:h-16 rounded-full bg-dex-blue border-2 sm:border-4 border-blue-400 relative overflow-hidden animate-pulse">
                            <div className="absolute top-3 left-3 w-3 h-3 sm:w-4 sm:h-4 bg-white/60 rounded-full blur-sm"></div>
                        </div>
                    </div>
                </div>

                {/* 3 Small Lights */}
                <div className="flex gap-2 sm:gap-3 ml-3 sm:ml-6 mt-1">
                    <div className="w-3 h-3 sm:w-4 sm:h-4 rounded-full bg-red-600 border border-red-800 shadow-inner"></div>
                    <div className="w-3 h-3 sm:w-4 sm:h-4 rounded-full bg-dex-yellow border border-yellow-600 shadow-inner"></div>
                    <div className="w-3 h-3 sm:w-4 sm:h-4 rounded-full bg-green-500 border border-green-700 shadow-inner"></div>
                </div>

                <div className="ml-auto flex flex-col items-end">
                    <h1 className="font-tech text-xl sm:text-3xl text-white font-bold tracking-widest drop-shadow-md">CHRONOCRUZ BIO-DEX</h1>
                    {/* Hide Scale button on mobile as it's disabled */}
                    <button
                        onClick={toggleScale}
                        className="hidden sm:block mt-1 px-2 py-0.5 bg-stone-800 border border-stone-600 rounded text-[10px] text-dex-cyan font-tech hover:bg-stone-700 hover:text-white transition-colors cursor-pointer shadow-dex-btn active:shadow-dex-btn-active active:translate-y-[2px]"
                        title="Toggle UI Scale"
                    >
                        SCALE: {scale * 100}%
                    </button>
                </div>
            </div>

            {/* Main Content Area (The Screen) */}
            <div className="flex-1 bg-dex-red p-2 sm:p-8 flex flex-col min-h-0">

                {/* Inner Dark Screen Container */}
                <div className="bg-dex-ui p-2 sm:p-6 rounded-lg sm:rounded-xl border-b-2 sm:border-b-4 border-r-2 sm:border-r-4 border-stone-400 shadow-inner flex flex-col h-full">

                    {/* Top tiny red dots on bezel */}
                    <div className="flex justify-center gap-2 sm:gap-4 mb-2 sm:mb-4 shrink-0">
                        <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-dex-red rounded-full"></div>
                        <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-dex-red rounded-full"></div>
                    </div>

                    {/* The Digital Screen */}
                    <div className="flex-1 bg-dex-screen rounded sm:rounded-lg border-2 sm:border-4 border-stone-600 shadow-inset-screen overflow-hidden flex flex-col relative min-h-0">
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
                        <main className="flex-1 overflow-y-auto p-2 sm:p-6 no-scrollbar relative">
                            {/* Scanlines Overlay */}
                            <div className="pointer-events-none absolute inset-0 z-10 scanline opacity-10"></div>

                            {loading ? (
                                <div className="grid grid-cols-1 gap-3 sm:gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                    {[...Array(6)].map((_, i) => (
                                        <div key={i} className="h-32 sm:h-40 w-full animate-pulse rounded border-2 border-green-900 bg-green-900/20"></div>
                                    ))}
                                </div>
                            ) : animals.length > 0 ? (
                                <div className="grid grid-cols-1 gap-3 sm:gap-4 sm:grid-cols-2 lg:grid-cols-3 pb-8">
                                    {animals.map((animal) => (
                                        <AnimalCard
                                            key={animal.id}
                                            animal={animal}
                                            onClick={setSelectedAnimal}
                                        />
                                    ))}
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center h-full text-center text-dex-cyan font-tech px-4">
                                    <div className="animate-bounce mb-4 text-3xl sm:text-4xl">NO DATA</div>
                                    <p className="text-sm sm:text-base">ADJUST SENSORS (FILTERS) TO DETECT LIFEFORMS</p>
                                </div>
                            )}
                        </main>

                        {/* Bottom Status Bar */}
                        <div className="h-6 sm:h-8 bg-black/80 flex items-center justify-between px-2 sm:px-4 text-[10px] sm:text-xs font-tech text-dex-cyan border-t border-stone-700 shrink-0">
                            <span>STATUS: ONLINE</span>
                            <span>BATTERY: 98%</span>
                        </div>
                    </div>

                    {/* Bottom bezel decorations */}
                    <div className="flex justify-between items-center mt-2 sm:mt-4 px-2 sm:px-4 shrink-0">
                        <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-red-600 border-2 border-red-800"></div>
                        <div className="flex flex-col gap-1">
                            <div className="w-16 sm:w-24 h-1 bg-stone-400 rounded"></div>
                            <div className="w-16 sm:w-24 h-1 bg-stone-400 rounded"></div>
                            <div className="w-16 sm:w-24 h-1 bg-stone-400 rounded"></div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Hinge Visual */}
            <div className="h-4 sm:h-6 bg-dex-darkRed border-t border-red-900 shrink-0"></div>
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