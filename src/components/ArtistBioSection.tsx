import React from 'react';
import { Disc, Radio, Calendar, Heart, Music2, Share2, Play, Flame, Megaphone } from 'lucide-react';
import { Track, SiteContent } from '../types';

interface ArtistBioSectionProps {
  tracks: Track[];
  onPlayFeaturedTrack: (track: Track) => void;
  siteContent?: SiteContent;
}

export const ArtistBioSection: React.FC<ArtistBioSectionProps> = ({
  tracks,
  onPlayFeaturedTrack,
  siteContent,
}) => {
  const featuredTrack = tracks[0];
  const bandName = siteContent?.bandName || 'Despojados';
  const bioTitle = siteContent?.bioTitle || 'CANCIÓN COLECTIVA, CALLE & RESISTENCIA CULTURAL';
  const bioText1 =
    siteContent?.bioText1 ||
    `Este espacio fue levantado a pulmón para compartir y hacer circular la música de ${bandName} sin intermediarios ni corporaciones: con la calidez del crujido analógico, el mate compartido y el respeto por el arte popular.`;
  const bioText2 =
    siteContent?.bioText2 ||
    'Cada tema nace en salas barriales y galpones de La Plata: guitarras criollas rasgueadas con fuerza, bombos, letras de resistencia y vivencias comunitarias. Elegí cualquier canción de la batea, apoyá la púa y compartí el audio con tus amigos y vecinos.';
  const origin = siteContent?.origin || 'LA PLATA, BUENOS AIRES';
  const productionNotes = siteContent?.productionNotes || 'Producción Autogestiva & Comunitaria';

  return (
    <section
      id="acerca-del-artista"
      className="bg-[#f5efe4] paper-kraft p-6 sm:p-8 shadow-[5px_5px_0px_#181816] relative flex flex-col gap-6 border-2 border-[#181816] scroll-mt-28"
    >
      {/* Top Banner Tag */}
      <div className="absolute -top-3.5 left-6 sm:left-10 bg-[#181816] text-[#facc15] font-poster text-lg uppercase px-4 py-0.5 rotate-[-1deg] shadow-[3px_3px_0px_#181816] font-black border-2 border-[#181816] flex items-center gap-1.5">
        <Megaphone className="w-4 h-4 text-[#b91c1c]" />
        <span>EL COLECTIVO // MANIFIESTO &amp; ARCHIVO COMUNITARIO</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center pt-2">
        {/* Rehearsal Photo Card with Tape */}
        <div className="lg:col-span-5 relative bg-[#e8decb] p-3 shadow-[4px_4px_0px_#181816] border-2 border-[#181816]">
          {/* Masking tape on corner */}
          <div className="absolute -top-2 left-6 bg-[#eedfa8] text-[#181816] px-3 py-0.5 border border-[#181816]/40 font-fanzine text-[9px] uppercase font-bold rotate-[-3deg] shadow-xs pointer-events-none">
            ★ SALA BARRIAL // LA PLATA
          </div>

          <div className="relative overflow-hidden border-2 border-[#181816] bg-[#181816]">
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCacxB2Xar5biMqOgp9B0LqQeka0PbHlXdfo7kMhhuDu0hGv2BRVxLnSsVvfEzA2F-CpeignVpzxHsB6r0EeA3t0pdrpigNFQiafqQPQpFefbt0wEJc8ovNiXAVll0qDe2eWpc8CQ3k2Nv3I0AWYIEDq95RHX-RjY135gGXOWb7PN8ZNPCiylDjG-tSei3T73CJrAVvfZ6ZnNJDXmbXQZZrceW6Yty8X_JJQqS-xlMe_ULiTiafxTX9aA"
              alt="Sala de ensayo comunitaria de Despojados con mate y guitarras"
              className="w-full h-80 sm:h-96 object-cover filter grayscale contrast-125 brightness-95 opacity-90"
            />
            <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent p-4 text-white">
              <span className="font-fanzine text-xs text-[#facc15] font-bold uppercase tracking-widest block">
                {bandName.toUpperCase()}
              </span>
              <h3 className="font-poster text-3xl font-black uppercase tracking-tight text-white leading-none">
                Música Popular y Sin Dueños
              </h3>
            </div>
          </div>

          <div className="mt-2.5 p-3 bg-[#f2ece0] border-2 border-[#181816] flex flex-col gap-1 font-fanzine text-xs uppercase">
            <div className="flex items-center justify-between text-[#181816] font-bold">
              <span>ORIGEN: {origin.toUpperCase()}</span>
              <span className="text-[#b91c1c] font-black">{productionNotes.toUpperCase()}</span>
            </div>
            <span className="text-[11px] text-[#423a31] font-bold">
              Guitarras de madera noble, letras poéticas barriales y espíritu de asamblea.
            </span>
          </div>
        </div>

        {/* Story & Musical Vision */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="stamp-red text-xs px-2.5 py-0.5 font-bold">
              COOPERATIVA POPULAR
            </span>
            <span className="font-fanzine text-xs text-[#181816] uppercase font-bold tracking-wider">
              • {bandName.toUpperCase()}
            </span>
          </div>

          <h2 className="font-poster text-4xl sm:text-5xl uppercase tracking-tight text-[#181816] font-black leading-none">
            {bioTitle}
          </h2>

          <p className="font-fanzine text-sm sm:text-base text-[#2b241c] leading-relaxed font-bold bg-[#ece4d4]/60 p-3 border-l-4 border-[#b91c1c]">
            {bioText1}
          </p>

          <p className="font-fanzine text-sm sm:text-base text-[#2b241c] leading-relaxed font-bold">
            {bioText2}
          </p>

          {/* Highlights Box */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 my-2 font-fanzine text-xs">
            <div className="p-3 bg-[#e8decb] border-2 border-[#181816] shadow-[2px_2px_0px_#181816]">
              <span className="text-[#b91c1c] font-bold block mb-1 flex items-center gap-1 font-poster text-base">
                <Music2 className="w-4 h-4" /> REPERTORIO
              </span>
              <span className="font-poster text-2xl font-black text-[#181816] block leading-none">
                {tracks.length} Canciones
              </span>
              <span className="text-[11px] text-[#423a31] font-bold block mt-1">
                Disponibles para escuchar libremente
              </span>
            </div>

            <div className="p-3 bg-[#e8decb] border-2 border-[#181816] shadow-[2px_2px_0px_#181816]">
              <span className="text-[#181816] font-bold block mb-1 flex items-center gap-1 font-poster text-base">
                <Radio className="w-4 h-4 text-[#b91c1c]" /> FORMATO
              </span>
              <span className="font-poster text-2xl font-black text-[#181816] block leading-none">
                Lado A &amp; Lado B
              </span>
              <span className="text-[11px] text-[#423a31] font-bold block mt-1">
                Ordenado como disco de vinilo físico
              </span>
            </div>

            <div className="p-3 bg-[#e8decb] border-2 border-[#181816] shadow-[2px_2px_0px_#181816]">
              <span className="text-[#2b593f] font-bold block mb-1 flex items-center gap-1 font-poster text-base">
                <Heart className="w-4 h-4 text-[#b91c1c]" /> AUTOGESTIÓN
              </span>
              <span className="font-poster text-2xl font-black text-[#181816] block leading-none">
                A Pulmón
              </span>
              <span className="text-[11px] text-[#423a31] font-bold block mt-1">
                Comunidad, cultura y autogestión viva
              </span>
            </div>
          </div>

          {/* Call to action */}
          {featuredTrack && (
            <div className="mt-2 p-4 bg-[#facc15]/30 border-2 border-[#181816] flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-[3px_3px_0px_#181816]">
              <div className="flex flex-col">
                <span className="font-fanzine text-xs uppercase font-bold text-[#b91c1c]">
                  ¿Por qué tema arrancar a escuchar?
                </span>
                <span className="font-poster text-2xl uppercase font-black text-[#181816]">
                  {featuredTrack.title} — {bandName}
                </span>
              </div>

              <button
                type="button"
                onClick={() => {
                  onPlayFeaturedTrack(featuredTrack);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="bg-[#b91c1c] hover:bg-[#991b1b] text-[#facc15] font-poster text-lg uppercase px-5 py-2 font-bold shadow-[2px_2px_0px_#181816] active:translate-x-[1px] active:translate-y-[1px] flex items-center justify-center gap-2 cursor-pointer transition-all border-2 border-black"
              >
                <Play className="w-4 h-4 fill-[#facc15]" />
                <span>Poner en la Bandeja</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
