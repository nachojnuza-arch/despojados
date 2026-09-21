import React from 'react';
import { Sparkles, Disc, ArrowDownRight, Newspaper, Megaphone, Flame } from 'lucide-react';
import { SiteContent } from '../types';

interface HeroSectionProps {
  onOpenAdmin: () => void;
  siteContent?: SiteContent;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onOpenAdmin, siteContent }) => {
  const bandName = siteContent?.bandName || 'DESPOJADOS';
  const heroBadge = siteContent?.heroBadge || 'MOVIDA CULTURAL AUTOGESTIVA // LA PLATA // A PULMÓN';
  const heroTitle = siteContent?.heroTitle || bandName;
  const heroSubtitle = siteContent?.heroSubtitle || 'Canción Barrial, Resistencia & Sonido Autogestivo';
  const heroDescription =
    siteContent?.heroDescription ||
    'Archivo sonoro y colectivo cultural de Despojados: escuchá las canciones en la bandeja del galpón, hojeá el fanzine de novedades y compartí la música libre sin intermediarios.';
  const origin = siteContent?.origin || 'LA PLATA // BUENOS AIRES';

  return (
    <div className="bg-[#f5efe4] paper-kraft p-5 sm:p-7 flex flex-col justify-between relative shadow-[5px_5px_0px_#181816] border-2 border-[#181816] overflow-hidden">
      {/* Realist Masking Tape Strips on Top Corners */}
      <div className="absolute -top-3 left-6 w-32 h-7 bg-[#eedfa8]/90 rotate-[-4deg] shadow-sm pointer-events-none border-b border-[#181816]/30 font-fanzine text-[9px] text-[#181816] flex items-center justify-center font-bold uppercase tracking-widest">
        ★ EDICIÓN AUTOGESTIVA
      </div>
      <div className="absolute -top-3 right-6 w-28 h-6 bg-[#eedfa8]/90 rotate-[3deg] shadow-sm pointer-events-none border-b border-[#181816]/30 font-fanzine text-[9px] text-[#181816] flex items-center justify-center font-bold uppercase tracking-widest">
        A PULMÓN ★
      </div>

      <div className="flex flex-col gap-4 relative z-10 pt-2">
        {/* Badges / Stamp Chips */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="stamp-red text-xs px-2.5 py-1">
            CIRCUITO INDEPENDIENTE
          </span>
          <span className="stamp-black text-sm px-2.5 py-0.5">
            COOPERATIVA CULTURAL
          </span>
          <span className="bg-[#181816] text-[#facc15] font-fanzine text-xs px-2 py-1 uppercase font-bold border border-black">
            {origin}
          </span>
        </div>

        {/* Street Poster Headline */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-2 font-fanzine text-xs sm:text-sm text-[#b91c1c] font-bold uppercase tracking-wider">
            <Flame className="w-4 h-4 fill-[#b91c1c] text-[#b91c1c]" />
            <span>{heroBadge}</span>
          </div>

          <h1 className="font-poster text-5xl sm:text-6xl lg:text-7xl uppercase tracking-normal text-[#181816] font-black leading-[0.88] drop-shadow-[2px_2px_0px_#facc15]">
            {heroTitle}
          </h1>

          <div className="inline-block bg-[#b91c1c] text-[#facc15] px-3 py-1 font-poster text-xl sm:text-2xl font-black uppercase tracking-wide -rotate-1 self-start shadow-[3px_3px_0px_#181816] border border-[#181816] mt-1">
            {heroSubtitle}
          </div>
        </div>

        {/* Fanzine manifesto paragraph */}
        <p className="font-fanzine text-sm sm:text-base text-[#241f1a] max-w-xl font-bold pt-1 leading-relaxed bg-[#ece4d4]/70 p-3 border-l-4 border-[#b91c1c] shadow-sm">
          "{heroDescription}"
        </p>
      </div>

      {/* Rehearsal room & community photo with tape & caption */}
      <div className="relative mt-4 border-2 border-[#181816] bg-[#181816] shadow-[3px_3px_0px_#181816] overflow-hidden group">
        <img
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuCacxB2Xar5biMqOgp9B0LqQeka0PbHlXdfo7kMhhuDu0hGv2BRVxLnSsVvfEzA2F-CpeignVpzxHsB6r0EeA3t0pdrpigNFQiafqQPQpFefbt0wEJc8ovNiXAVll0qDe2eWpc8CQ3k2Nv3I0AWYIEDq95RHX-RjY135gGXOWb7PN8ZNPCiylDjG-tSei3T73CJrAVvfZ6ZnNJDXmbXQZZrceW6Yty8X_JJQqS-xlMe_ULiTiafxTX9aA"
          alt="Ensayos comunitarios con mate y guitarras en el galpón de La Plata"
          className="w-full h-44 sm:h-52 object-cover filter grayscale contrast-125 group-hover:scale-105 transition-transform duration-500 opacity-90"
        />
        {/* Halftone / scanline tint */}
        <div className="absolute inset-0 bg-[#b91c1c]/10 mix-blend-multiply pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
        
        {/* Caption bar */}
        <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between text-white">
          <div className="flex items-center gap-2 font-fanzine text-xs uppercase tracking-wide">
            <span className="w-2.5 h-2.5 rounded-full bg-[#facc15] animate-ping" />
            <span className="font-bold">GALPÓN COMUNITARIO // ENSAYO A PUERTAS ABIERTAS</span>
          </div>
          <span className="font-poster text-sm bg-[#facc15] text-[#181816] px-2 py-0.5 font-black uppercase border border-black">
            AUDIO EN VIVO
          </span>
        </div>
      </div>

      {/* Quick Action Footer */}
      <div className="mt-5 pt-2 flex flex-wrap items-center justify-between gap-3 bg-[#e8dece] p-3 border-2 border-[#181816]">
        <div className="flex items-center gap-2 font-fanzine text-xs uppercase font-bold text-[#181816]">
          <Disc className="w-4 h-4 text-[#b91c1c]" />
          <span>Bandeja del Galpón</span>
          <span className="text-[#8c7b6c]">/</span>
          <span className="text-[#b91c1c]">Prensado Libre</span>
        </div>

        <div className="flex items-center gap-2">
          <a
            href="#surcos-catalogo"
            className="bg-[#181816] hover:bg-[#2b2b27] text-[#facc15] font-poster text-lg uppercase px-3.5 py-1.5 shadow-[2px_2px_0px_#181816] active:translate-x-[1px] active:translate-y-[1px] flex items-center gap-1.5 transition-all border border-black"
          >
            <span>Batea de Temas</span>
            <ArrowDownRight className="w-4 h-4" />
          </a>

          <a
            href="#publicaciones"
            className="bg-[#facc15] hover:bg-[#fde047] text-[#181816] font-poster text-lg uppercase px-3.5 py-1.5 border-2 border-[#181816] shadow-[2px_2px_0px_#181816] active:translate-x-[1px] active:translate-y-[1px] flex items-center gap-1.5 transition-all"
          >
            <Newspaper className="w-4 h-4 text-[#b91c1c]" />
            <span>Fanzine</span>
          </a>

          <a
            href="#acerca-del-artista"
            className="bg-[#b91c1c] hover:bg-[#991b1b] text-white font-poster text-lg uppercase px-3.5 py-1.5 shadow-[2px_2px_0px_#181816] active:translate-x-[1px] active:translate-y-[1px] flex items-center gap-1.5 transition-all border border-black"
          >
            <span>Manifiesto</span>
            <ArrowDownRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    </div>
  );
};
