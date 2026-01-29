import React from 'react';
import { Animal } from '../types';

interface AnimalCardProps {
  animal: Animal;
  onClick: (animal: Animal) => void;
}

const AnimalCard: React.FC<AnimalCardProps> = ({ animal, onClick }) => {
  // Fallback if no image
  const bgImage = animal.imageUrl || `https://via.placeholder.com/400x300?text=${animal.commonName[0]}`;

  return (
    <div 
      onClick={() => onClick(animal)}
      className="group relative h-40 w-full cursor-pointer overflow-hidden rounded bg-black border-2 border-stone-700 hover:border-dex-cyan transition-colors"
    >
      {/* Background Image with Filter */}
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-60 group-hover:opacity-100 transition-opacity duration-300 grayscale group-hover:grayscale-0"
        style={{ backgroundImage: `url(${bgImage})` }}
      />
      
      {/* Scanline & Grid Overlay */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-30 mix-blend-overlay"></div>
      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-90"></div>

      {/* Digital Content */}
      <div className="absolute inset-0 p-3 flex flex-col justify-between">
         {/* Top ID */}
         <div className="flex justify-between items-start">
             <span className="font-tech text-xs text-stone-400">ID #{animal.id.slice(0,5)}</span>
             <div className="w-2 h-2 rounded-full bg-stone-600 group-hover:bg-dex-cyan group-hover:shadow-[0_0_5px_#22d3ee]"></div>
         </div>

         {/* Bottom Name */}
         <div>
            <h3 className="text-xl font-pixel text-white uppercase tracking-wider group-hover:text-dex-cyan">
            {animal.commonName}
            </h3>
            <p className="font-tech text-xs text-stone-400 truncate">
            {animal.scientificName}
            </p>
         </div>
      </div>
      
      {/* Corner decorations */}
      <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-stone-500 group-hover:border-dex-cyan"></div>
      <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-stone-500 group-hover:border-dex-cyan"></div>
    </div>
  );
};

export default AnimalCard;