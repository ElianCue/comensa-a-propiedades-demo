import React from 'react';

export default function Logo({ light = false }: { light?: boolean }) {
  const colors = [
    '#22C55E', // green
    '#06B6D4', // cyan
    '#3B82F6', // blue
    '#8B5CF6', // purple
    '#D946EF', // magenta
    '#EF4444', // red
    '#F59E0B', // orange
    '#EAB308', // yellow
  ];

  return (
    <div className="flex items-center gap-3 group cursor-pointer">
      <div className="relative w-10 h-10">
        {/* House Silhouette */}
        <svg 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke={light ? "white" : "black"} 
          strokeWidth="2.5" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          className="w-8 h-8 absolute bottom-0 left-0 z-10"
        >
          <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          <polyline points="9 22 9 12 15 12 15 22" />
        </svg>
        
        {/* Spectrum Fan Arc */}
        <div className="absolute -top-1 -right-1 w-8 h-8 flex items-center justify-center">
          {colors.map((color, i) => (
            <div
              key={i}
              className="absolute w-full h-[3px] rounded-full origin-left"
              style={{
                backgroundColor: color,
                transform: `rotate(${i * 12 - 45}deg) translateX(10px)`,
                opacity: 0.8
              }}
            />
          ))}
        </div>
      </div>
      <div className="flex flex-col -space-y-1">
        <span className={light ? "text-white text-xl font-black italic tracking-tighter" : "text-gray-900 text-xl font-black italic tracking-tighter"}>
          COMENSAÑA
        </span>
        <span className={light ? "text-white/60 text-[10px] font-black uppercase tracking-[0.2em]" : "text-gray-400 text-[10px] font-black uppercase tracking-[0.2em]"}>
          Propiedades
        </span>
      </div>
    </div>
  );
}
