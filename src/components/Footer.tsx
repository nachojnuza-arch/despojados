import React from 'react';
import { Lock, Disc, Radio, Flame } from 'lucide-react';

interface FooterProps {
  onOpenAdmin: () => void;
  bandName?: string;
}

export const Footer: React.FC<FooterProps> = ({ onOpenAdmin, bandName = 'DESPOJADOS' }) => {
  return (
    <footer className="w-full bg-[#181816] text-[#e8decb] border-t-4 border-[#181816] py-10 mt-16 shadow-[0_-4px_0px_#181816]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-start justify-between gap-6">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <span className="stamp-red text-xs px-2.5 py-0.5 font-bold">
              GALPÓN CULTURAL
            </span>
            <span className="font-fanzine text-xs text-[#facc15] font-bold uppercase">
              LA PLATA // CIRCUITO AUTOGESTIVO
            </span>
          </div>
          <span className="font-poster text-3xl sm:text-4xl uppercase font-black text-[#facc15] tracking-wide leading-none">
            {bandName.toUpperCase()}
          </span>
          <p className="font-fanzine text-xs sm:text-sm text-[#c8beaf] max-w-md leading-relaxed font-bold">
            Espacio y archivo sonoro de {bandName}. Grabado y compartido a pulmón, con bandeja de vinilo comunitaria, acordes de libre circulación y cultura sin dueños.
          </p>
        </div>

        <div className="flex flex-col gap-2 font-fanzine text-xs uppercase text-[#e8decb]">
          <span className="font-poster text-lg text-[#facc15] font-bold">
            Bateas, Galpones &amp; Coordenadas
          </span>
          <span className="text-[#a89e90] font-bold">
            La Plata, Buenos Aires // Sonido Barrial // Sin Intermediarios
          </span>
          <div className="flex items-center justify-between gap-4 pt-2 border-t border-[#3d3429]">
            <span className="text-[#facc15] font-black text-[11px]">
              APOYÁ LA CULTURA INDEPENDIENTE Y LOS ESPACIOS AUTOGESTIVOS
            </span>
            {/* Master Access button */}
            <button
              type="button"
              onClick={onOpenAdmin}
              className="bg-[#2a2723] hover:bg-[#b91c1c] text-[#facc15] hover:text-white px-3 py-1 border border-[#4d4439] transition-colors flex items-center gap-1.5 text-xs font-poster uppercase cursor-pointer"
              title="Taller de Edición y Carga de Música"
            >
              <Lock className="w-3.5 h-3.5 text-[#facc15]" />
              <span>Taller de Edición</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
