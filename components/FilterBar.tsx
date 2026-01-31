import React, { useState, useEffect } from 'react';
import { FilterType } from '../types';
import { ALPHABET } from '../constants';

interface FilterBarProps {
  currentFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
  onSearch: (query: string) => void;
  onLetterSelect: (letter: string) => void;
  selectedLetter: string | null;
}

const FilterBar: React.FC<FilterBarProps> = ({ 
  currentFilter, 
  onFilterChange, 
  onSearch, 
  onLetterSelect, 
  selectedLetter 
}) => {
  const [searchValue, setSearchValue] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [showAllFilters, setShowAllFilters] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchValue);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchValue]);

  useEffect(() => {
    onSearch(debouncedSearch);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch]);

  const getFilterLabel = (type: FilterType) => {
    switch (type) {
      case FilterType.ALL: return 'ALL DATA';
      case FilterType.FISH: return 'FISH';
      case FilterType.SHARK_RAY: return 'SHARKS & RAYS';
      case FilterType.CNIDARIAN: return 'JELLYFISH';
      case FilterType.CETACEAN: return 'WHALES & DOLPHINS';
      case FilterType.BUTTERFLY: return 'BUTTERFLIES';
      case FilterType.BEE_ANT: return 'BEES & ANTS';
      case FilterType.MOLLUSK: return 'MOLLUSKS';
      case FilterType.CRUSTACEAN: return 'CRUSTACEANS';
      case FilterType.PRIMATE: return 'PRIMATES';
      case FilterType.CARNIVORE: return 'CARNIVORES';
      case FilterType.RODENT: return 'RODENTS';
      case FilterType.BEETLE: return 'BEETLES';
      default: return type + 'S'; // MAMMALS, BIRDS, etc.
    }
  };

  const allFilters = Object.values(FilterType);
  // Show roughly 3 rows worth of items initially (approx 12-14 items depending on width)
  const displayedFilters = showAllFilters ? allFilters : allFilters.slice(0, 14);

  return (
    <div className="w-full bg-stone-800 border-b-2 border-stone-600 p-2 sm:p-3 z-30 shrink-0">
      <div className="flex flex-col gap-3">

        {/* Top Row: Search Input (LCD Style) */}
        <div className="flex gap-2">
            <div className="flex-1 bg-dex-screenGreen rounded p-1 border-2 sm:border-4 border-stone-500 shadow-inner relative">
                <input
                type="text"
                className="w-full bg-transparent border-none text-black font-pixel text-lg sm:text-xl placeholder-green-800/60 focus:outline-none uppercase"
                placeholder="INPUT SPECIES NAME..."
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                />
                 {/* Blinking cursor effect fake */}
                {!searchValue && <div className="absolute top-2 left-2 pointer-events-none animate-pulse text-black font-pixel">_</div>}
            </div>
            {/* Search LED */}
            <div className="flex flex-col justify-center items-center">
                 <div className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full mb-1 ${searchValue ? 'bg-green-400 shadow-[0_0_5px_#4ade80]' : 'bg-green-900'}`}></div>
                 <span className="text-[0.5rem] sm:text-[0.6rem] text-stone-400 font-tech">DATA</span>
            </div>
        </div>

        {/* Categories: Wrap Layout */}
        <div className="relative">
             <div className="flex flex-wrap gap-1.5 sm:gap-2 transition-all duration-300 ease-in-out">
                {displayedFilters.map((type) => (
                <button
                    key={type}
                    onClick={() => onFilterChange(type)}
                    className={`flex-shrink-0 px-2 sm:px-3 py-1 text-[10px] sm:text-xs font-tech uppercase tracking-wider border-b-4 active:border-b-0 active:translate-y-1 transition-all rounded ${
                    currentFilter === type
                        ? 'bg-dex-blue border-blue-800 text-white'
                        : 'bg-stone-300 border-stone-400 text-stone-600 hover:bg-white'
                    }`}
                >
                    {getFilterLabel(type)}
                </button>
                ))}

                {/* Expand Toggle Button */}
                {!showAllFilters && allFilters.length > 14 && (
                    <button
                        onClick={() => setShowAllFilters(true)}
                        className="px-2 sm:px-3 py-1 text-[10px] sm:text-xs font-tech uppercase tracking-wider bg-dex-yellow border-b-4 border-yellow-700 text-black hover:bg-yellow-400 rounded active:border-b-0 active:translate-y-1"
                    >
                        + SHOW ALL
                    </button>
                )}
                 {showAllFilters && (
                    <button
                        onClick={() => setShowAllFilters(false)}
                        className="px-2 sm:px-3 py-1 text-[10px] sm:text-xs font-tech uppercase tracking-wider bg-stone-500 border-b-4 border-stone-700 text-white hover:bg-stone-400 rounded active:border-b-0 active:translate-y-1"
                    >
                        - COLLAPSE
                    </button>
                )}
            </div>
        </div>

        {/* Alphabet: Keyboard Style */}
        <div className="bg-stone-900/50 p-1 sm:p-2 rounded border border-stone-700">
            <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
                <button
                    onClick={() => onLetterSelect('')}
                    className={`flex h-6 w-6 sm:h-8 sm:w-8 min-w-[1.5rem] sm:min-w-[2rem] items-center justify-center font-pixel text-base sm:text-lg transition-all border-b-2 active:border-b-0 active:translate-y-[2px] rounded-sm ${
                    !selectedLetter
                        ? 'bg-dex-yellow border-yellow-700 text-black'
                        : 'bg-stone-600 border-stone-800 text-stone-300 hover:bg-stone-500'
                    }`}
                >
                    *
                </button>
                {ALPHABET.map((letter) => (
                    <button
                    key={letter}
                    onClick={() => onLetterSelect(letter)}
                    className={`flex h-6 w-6 sm:h-8 sm:w-8 min-w-[1.5rem] sm:min-w-[2rem] items-center justify-center font-pixel text-lg sm:text-xl transition-all border-b-2 active:border-b-0 active:translate-y-[2px] rounded-sm ${
                        selectedLetter === letter
                        ? 'bg-dex-blue border-blue-800 text-white'
                        : 'bg-stone-700 border-stone-900 text-stone-400 hover:bg-stone-600'
                    }`}
                    >
                    {letter}
                    </button>
                ))}
            </div>
        </div>
      </div>
    </div>
  );
};

export default FilterBar;