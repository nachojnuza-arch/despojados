import React from 'react';
import { Disc3, Radio, Newspaper, Music, Wrench, Sparkles, Megaphone } from 'lucide-react';

interface HeaderProps {
  currentView: 'public' | 'admin';
  onViewChange: (view: 'public' | 'admin') => void;
  activeSection: string;
  bandName?: string;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  onViewChange,
  activeSection,
  bandName = 'DESPOJADOS',
}) => {
  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-[#dfd4c0] border-b-2 border-[#181816] shadow-[0_4px_0_#181816]">
      {/* Top Street Poster Ticker */}
      <div className="bg-[#facc15] px-4 py-1 border-b-2 border-[#181816] flex items-center justify-between overflow-hidden text-[#181816]">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest font-fanzine truncate">
          <Megaphone className="w-3.5 h-3.5 shrink-0 text-[#b91c1c] animate-bounce" />
          <span>
            MOVIMIENTO CULTURAL AUTOGESTIVO // LA PLATA // MÚSICA POPULAR A PULMÓN // COOPERATIVA &amp; COMUNIDAD
          </span>
        </div>
        <div className="hidden md:flex items-center gap-2 text-xs font-label uppercase tracking-wider shrink-0 font-bold">
          <span className="bg-[#181816] text-[#facc15] px-1.5 py-0.2">EDICIÓN INDEPENDIENTE</span>
          <span>•</span>
          <span>SIN INTERMEDIARIOS</span>
          <span>•</span>
          <span>CIRCULACIÓN LIBRE</span>
        </div>
      </div>

      {/* Main Header Bar */}
      <div className="h-20 max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">
        {/* Brand */}
        <div 
          onClick={() => onViewChange('public')}
          className="flex items-center gap-3 cursor-pointer select-none group"
        >
          <div className="w-11 h-11 bg-[#b91c1c] border-2 border-[#181816] shadow-[3px_3px_0px_#181816] flex items-center justify-center text-white group-hover:bg-[#991b1b] group-active:translate-x-[1px] group-active:translate-y-[1px] transition-all">
            <Disc3 className="w-7 h-7 animate-spin" style={{ animationDuration: '7s' }} />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="font-poster text-3xl sm:text-4xl font-black uppercase tracking-tight text-[#181816] leading-none">
                {bandName.toUpperCase()}
              </span>
              <span className="stamp-red text-[9px] px-1.5 py-0.5 font-bold uppercase hidden sm:inline-flex">
                AUTOGESTIÓN
              </span>
            </div>
            <span className="font-fanzine text-[11px] text-[#423a31] uppercase tracking-wider font-bold">
              Colectivo Musical &amp; Archivo Barrial
            </span>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="hidden lg:flex items-center gap-2 font-poster text-lg uppercase tracking-wider">
          <button
            onClick={() => {
              onViewChange('public');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className={`px-3.5 py-1.5 transition-all cursor-pointer border-2 border-[#181816] shadow-[2px_2px_0px_#181816] ${
              currentView === 'public' && activeSection === 'turntable'
                ? 'bg-[#181816] text-[#facc15]'
                : 'bg-[#ece3d1] text-[#181816] hover:bg-[#f6efe2]'
            }`}
          >
            La Bandeja del Galpón
          </button>
          
          <a
            href="#surcos-catalogo"
            onClick={() => {
              if (currentView !== 'public') onViewChange('public');
            }}
            className="px-3.5 py-1.5 bg-[#ece3d1] hover:bg-[#f6efe2] text-[#181816] border-2 border-[#181816] shadow-[2px_2px_0px_#181816] transition-all cursor-pointer"
          >
            Batea Comunitaria
          </a>

          <a
            href="#publicaciones"
            onClick={() => {
              if (currentView !== 'public') onViewChange('public');
            }}
            className="px-3.5 py-1.5 bg-[#ece3d1] hover:bg-[#f6efe2] text-[#181816] border-2 border-[#181816] shadow-[2px_2px_0px_#181816] transition-all cursor-pointer flex items-center gap-1.5"
          >
            <Newspaper className="w-4 h-4 text-[#b91c1c]" />
            Fanzine &amp; Novedades
          </a>

          <a
            href="#acerca-del-artista"
            onClick={() => {
              if (currentView !== 'public') onViewChange('public');
            }}
            className="px-3.5 py-1.5 bg-[#ece3d1] hover:bg-[#f6efe2] text-[#181816] border-2 border-[#181816] shadow-[2px_2px_0px_#181816] transition-all cursor-pointer"
          >
            El Colectivo
          </a>

          {/* Admin toggle button */}
          <button
            onClick={() => onViewChange(currentView === 'admin' ? 'public' : 'admin')}
            className={`ml-2 px-3 py-1.5 font-poster text-lg uppercase border-2 border-[#181816] shadow-[3px_3px_0px_#181816] cursor-pointer flex items-center gap-1.5 transition-all active:translate-x-[1px] active:translate-y-[1px] ${
              currentView === 'admin'
                ? 'bg-[#b91c1c] text-white'
                : 'bg-[#facc15] text-[#181816] hover:bg-[#fde047]'
            }`}
          >
            <Wrench className="w-4 h-4" />
            <span>{currentView === 'admin' ? '← Volver al Galpón' : 'Taller de Edición'}</span>
          </button>
        </nav>

        {/* Right Info & Mobile Button */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={() => onViewChange(currentView === 'admin' ? 'public' : 'admin')}
            className="lg:hidden px-2.5 py-1.5 bg-[#facc15] text-[#181816] border-2 border-[#181816] shadow-[2px_2px_0px_#181816] text-xs font-fanzine uppercase font-bold flex items-center gap-1"
          >
            <Wrench className="w-3.5 h-3.5" />
            <span>{currentView === 'admin' ? 'Galpón' : 'Taller'}</span>
          </button>

          <div className="hidden sm:flex flex-col text-right font-fanzine text-xs">
            <span className="text-[#181816] font-bold uppercase flex items-center justify-end gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-600 animate-ping"></span>
              {bandName}
            </span>
            <span className="text-[#b91c1c] font-bold uppercase">La Plata // Diagonal Sur</span>
          </div>

          <div className="w-9 h-9 bg-[#273628] border-2 border-[#181816] shadow-[2px_2px_0px_#181816] flex items-center justify-center text-[#facc15]" title="Transmisión Comunitaria en Vivo">
            <Radio className="w-5 h-5" />
          </div>
        </div>
      </div>
    </header>
  );
};
