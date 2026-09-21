import React, { useState } from 'react';
import { Track } from '../types';
import { Disc, Filter, Sparkles, Music, Play } from 'lucide-react';

interface SurcosCatalogProps {
  tracks: Track[];
  currentTrackId: string;
  onLoadTrack: (track: Track) => void;
}

export const SurcosCatalog: React.FC<SurcosCatalogProps> = ({
  tracks,
  currentTrackId,
  onLoadTrack,
}) => {
  const [speedFilter, setSpeedFilter] = useState<'ALL' | '33 RPM' | '45 RPM' | 'ACÚSTICOS'>('ALL');

  const filteredTracks = tracks.filter((t) => {
    if (speedFilter === 'ALL') return true;
    if (speedFilter === '33 RPM') return t.speed === '33 RPM';
    if (speedFilter === '45 RPM') return t.speed === '45 RPM';
    if (speedFilter === 'ACÚSTICOS') {
      return (
        t.recordingNotes?.toLowerCase().includes('acústic') ||
        t.format?.toLowerCase().includes('acústic') ||
        t.title?.toLowerCase().includes('acústic')
      );
    }
    return true;
  });

  return (
    <section id="surcos-catalogo" className="flex flex-col gap-6 scroll-mt-28">
      {/* Section Header & Filters */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b-2 border-[#181816] pb-4">
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-2">
            <span className="stamp-red text-xs px-2.5 py-0.5 font-bold">
              BATEA COMUNITARIA
            </span>
            <span className="stamp-black text-xs px-2 py-0.5 font-bold">
              CIRCULACIÓN LIBRE
            </span>
          </div>
          <h2 className="font-poster text-4xl sm:text-5xl uppercase tracking-tight text-[#181816] font-black leading-none">
            REPERTORIO &amp; GRABACIONES DEL GALPÓN
          </h2>
          <p className="font-fanzine text-sm sm:text-base text-[#3d3429] max-w-2xl font-bold">
            Elegí cualquier surco de la batea para que empiece a girar en la bandeja. Música producida a pulmón, grabada en salas barriales y compartida sin intermediarios.
          </p>
        </div>

        {/* Filter Buttons */}
        <div className="flex items-center gap-2 font-poster text-base flex-wrap">
          <span className="flex items-center gap-1 uppercase text-[#181816] font-black font-fanzine text-xs">
            <Filter className="w-3.5 h-3.5 text-[#b91c1c]" />
            FILTRAR:
          </span>

          <button
            type="button"
            onClick={() => setSpeedFilter('ALL')}
            className={`px-3 py-1 uppercase font-bold border-2 border-[#181816] transition-all shadow-[2px_2px_0px_#181816] active:translate-x-[1px] active:translate-y-[1px] cursor-pointer ${
              speedFilter === 'ALL'
                ? 'bg-[#181816] text-[#facc15]'
                : 'bg-[#ece3d1] text-[#181816] hover:bg-[#f6efe2]'
            }`}
          >
            TODOS ({tracks.length})
          </button>

          <button
            type="button"
            onClick={() => setSpeedFilter('33 RPM')}
            className={`px-3 py-1 uppercase font-bold border-2 border-[#181816] transition-all shadow-[2px_2px_0px_#181816] active:translate-x-[1px] active:translate-y-[1px] cursor-pointer ${
              speedFilter === '33 RPM'
                ? 'bg-[#181816] text-[#facc15]'
                : 'bg-[#ece3d1] text-[#181816] hover:bg-[#f6efe2]'
            }`}
          >
            33 RPM (LP)
          </button>

          <button
            type="button"
            onClick={() => setSpeedFilter('45 RPM')}
            className={`px-3 py-1 uppercase font-bold border-2 border-[#181816] transition-all shadow-[2px_2px_0px_#181816] active:translate-x-[1px] active:translate-y-[1px] cursor-pointer ${
              speedFilter === '45 RPM'
                ? 'bg-[#181816] text-[#facc15]'
                : 'bg-[#ece3d1] text-[#181816] hover:bg-[#f6efe2]'
            }`}
          >
            45 RPM (EP)
          </button>

          <button
            type="button"
            onClick={() => setSpeedFilter('ACÚSTICOS')}
            className={`px-3 py-1 uppercase font-bold border-2 border-[#181816] transition-all shadow-[2px_2px_0px_#181816] active:translate-x-[1px] active:translate-y-[1px] cursor-pointer ${
              speedFilter === 'ACÚSTICOS'
                ? 'bg-[#181816] text-[#facc15]'
                : 'bg-[#ece3d1] text-[#181816] hover:bg-[#f6efe2]'
            }`}
          >
            ACÚSTICOS
          </button>
        </div>
      </div>

      {/* Cards Grid (Sleeves Crate Layout) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
        {filteredTracks.map((track, idx) => {
          const isCurrent = currentTrackId === track.id;
          return (
            <div
              key={track.id}
              className={`bg-[#f5efe4] paper-kraft p-5 flex flex-col justify-between shadow-[4px_4px_0px_#181816] relative group border-2 border-[#181816] transition-transform ${
                isCurrent ? 'ring-4 ring-[#b91c1c]' : ''
              }`}
            >
              {/* Tape Sticker Tag */}
              <div
                className={`absolute -top-3 left-6 px-3 py-0.5 font-fanzine text-[10px] uppercase shadow-sm border border-[#181816] font-bold ${
                  idx % 2 === 0
                    ? 'bg-[#eedfa8] text-[#181816] rotate-[-2deg]'
                    : 'bg-[#facc15] text-[#181816] rotate-[2deg]'
                }`}
              >
                {track.hasCustomAudio ? 'AUDIO ORIGINAL SUBIDO' : 'PRENSADO AUTOGESTIVO'}
              </div>

              <div className="flex flex-col gap-4 mt-2">
                {/* Vinyl Cover Artwork Frame */}
                <div className="relative overflow-hidden bg-[#181816] border-2 border-[#181816] shadow-[2px_2px_0px_#181816]">
                  <img
                    src={
                      track.coverUrl ||
                      'https://lh3.googleusercontent.com/aida-public/AB6AXuBbIOA4OG6qP6zaGo-TVABqDiacUDuSWwQ10szC0msiP6uvhXr3miJgVXPWvcYjDRYZ_UWAwLkmJLRY6FhGWSdXALNRxavnM_jB-zM_E1YN8P1KTNdtkPfFZ4wYoVvJUvI78onUHeN2ZSBAOfR1drBCK2k4hMA2HL28_E79atWKXPRu8DY-ChY5nA_OUILxXC58rMt6eJxO-C034Fu75hgxMSdYB3bfwmJizt7QqgHhgRdqwuzBpaO9Ng'
                    }
                    alt={track.title}
                    className="w-full h-48 sm:h-52 object-cover filter contrast-125 grayscale group-hover:grayscale-0 transition-all duration-300 opacity-90 group-hover:opacity-100"
                  />
                  <span className="absolute top-2 right-2 bg-[#181816] text-[#facc15] font-poster text-sm px-2 py-0.5 uppercase shadow-[2px_2px_0px_#181816] border border-black font-bold">
                    {track.format || `${track.speed}`}
                  </span>
                  {track.hasCustomAudio && (
                    <span className="absolute bottom-2 left-2 bg-[#b91c1c] text-white font-fanzine text-[10px] px-2 py-0.5 font-bold uppercase shadow border border-black">
                      PISTA COMPLETA
                    </span>
                  )}
                </div>

                {/* Info */}
                <div className="flex flex-col gap-1">
                  <span className="font-fanzine text-xs text-[#b91c1c] uppercase font-bold tracking-wider truncate">
                    {track.artist}
                  </span>
                  <h3 className="font-poster text-3xl uppercase text-[#181816] leading-none font-black line-clamp-2">
                    {track.title}
                  </h3>
                  <p className="font-fanzine text-xs text-[#423a31] line-clamp-2 font-semibold">
                    {track.recordingNotes} - Grabado y registrado en el circuito barrial independiente.
                  </p>
                </div>

                {/* Metadata Matrix */}
                <div className="grid grid-cols-2 gap-1.5 font-fanzine text-xs bg-[#e8decb] p-3 text-[#181816] border-2 border-[#181816]">
                  <div>
                    <span className="text-[#6d6153] uppercase block text-[10px] font-bold">FORMATO:</span>
                    <span className="font-bold truncate block text-[#181816]">{track.format}</span>
                  </div>
                  <div>
                    <span className="text-[#6d6153] uppercase block text-[10px] font-bold">VELOCIDAD:</span>
                    <span className="font-bold truncate block text-[#181816]">{track.speed}</span>
                  </div>
                  <div>
                    <span className="text-[#6d6153] uppercase block text-[10px] font-bold">SALA / ESPACIO:</span>
                    <span className="font-bold truncate block text-[#181816]">{track.venueOrStudio || 'GALPÓN LA PLATA'}</span>
                  </div>
                  <div>
                    <span className="text-[#6d6153] uppercase block text-[10px] font-bold">AÑO:</span>
                    <span className="font-bold truncate block text-[#181816]">{track.year || '2024'}</span>
                  </div>
                </div>
              </div>

              {/* Action */}
              <div className="mt-4 pt-3 border-t-2 border-[#181816] flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => onLoadTrack(track)}
                  className={`font-poster text-lg uppercase px-3.5 py-1.5 shadow-[2px_2px_0px_#181816] active:translate-x-[1px] active:translate-y-[1px] flex items-center gap-1.5 transition-all border-2 border-black cursor-pointer ${
                    isCurrent
                      ? 'bg-[#b91c1c] text-[#facc15]'
                      : 'bg-[#181816] hover:bg-[#b91c1c] text-white hover:text-[#facc15]'
                  }`}
                >
                  <Disc className={`w-4 h-4 text-[#facc15] ${isCurrent ? 'animate-spin' : ''}`} />
                  <span>{isCurrent ? 'Girando en Bandeja' : 'Cargar en Bandeja'}</span>
                </button>

                <span className="font-fanzine text-xs text-[#181816] uppercase font-bold">
                  {track.side} // {track.duration}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
