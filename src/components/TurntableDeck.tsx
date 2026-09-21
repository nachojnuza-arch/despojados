import React from 'react';
import { Track } from '../types';
import { Play, Pause, Disc, Volume2, ArrowDown, ArrowUp, Zap, Radio, Sliders, Flame } from 'lucide-react';

interface TurntableDeckProps {
  currentTrack: Track;
  tracks: Track[];
  isPlaying: boolean;
  isMotorOn: boolean;
  isNeedleDown: boolean;
  volume: number;
  speed: '33 RPM' | '45 RPM';
  activeSide: 'LADO A' | 'LADO B';
  crackleEnabled: boolean;
  onToggleMotor: () => void;
  onToggleNeedle: () => void;
  onSpeedChange: (speed: '33 RPM' | '45 RPM') => void;
  onVolumeChange: (vol: number) => void;
  onSideChange: (side: 'LADO A' | 'LADO B') => void;
  onSelectTrack: (track: Track) => void;
}

export const TurntableDeck: React.FC<TurntableDeckProps> = ({
  currentTrack,
  tracks,
  isPlaying,
  isMotorOn,
  isNeedleDown,
  volume,
  speed,
  activeSide,
  crackleEnabled,
  onToggleMotor,
  onToggleNeedle,
  onSpeedChange,
  onVolumeChange,
  onSideChange,
  onSelectTrack,
}) => {
  // Filter tracks for the current active side
  const sideTracks = tracks.filter((t) => t.side === activeSide);

  return (
    <div className="flex flex-col gap-3 bg-[#1e1b18] text-[#f5efe6] p-4 sm:p-6 shadow-[5px_5px_0px_#181816] border-2 border-[#181816] relative">
      {/* Tape label on corner of the deck */}
      <div className="absolute -top-2.5 right-6 bg-[#eedfa8] text-[#181816] px-3 py-0.5 border border-[#181816]/40 font-fanzine text-[9px] uppercase font-bold rotate-[1.5deg] shadow-sm pointer-events-none">
        ★ CUIDAR LA PÚA - SALA COMUNITARIA ★
      </div>

      {/* Turntable Deck Top Controls Bar */}
      <div className="flex items-center justify-between border-b-2 border-[#38332e] pb-3 pt-1">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-sm bg-[#b91c1c] border border-black flex items-center justify-center text-[#facc15] shadow-sm">
            <Disc className="w-5 h-5 animate-spin" style={{ animationDuration: isMotorOn ? '4s' : '0s' }} />
          </div>
          <div>
            <h2 className="font-poster text-2xl uppercase tracking-wide text-[#facc15] leading-tight">
              LA BANDEJA DEL GALPÓN
            </h2>
            <span className="font-fanzine text-[10px] text-[#c4b9a9] uppercase block font-semibold">
              CRUJIDO DE AGUJA &amp; TOMA DIRECTA // ELEGÍ TU CANCIÓN
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-[#141210] px-2.5 py-1 border border-[#38332e]">
          <span
            className={`w-3 h-3 rounded-full transition-all ${
              isMotorOn ? 'bg-red-500 animate-pulse shadow-[0_0_8px_#ef4444]' : 'bg-neutral-700'
            }`}
            title="Motor de la bandeja"
          />
          <span className="font-fanzine text-[10px] sm:text-xs text-[#f5efe6] font-bold tracking-wider uppercase">
            {isNeedleDown ? 'PÚA: APOYADA' : 'PÚA: LEVANTADA'}
          </span>
        </div>
      </div>

      {/* The Vinyl Turntable Platter Visual */}
      <div className="relative w-full rounded-none overflow-hidden bg-[#12100e] border-2 border-[#2b2520] shadow-[inset_0_0_35px_rgba(0,0,0,0.9)] flex flex-col items-center justify-center p-3 sm:p-4">
        {/* Subtle wood / dark metal grain */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:12px_12px] pointer-events-none" />

        {/* Circular Platter Assembly */}
        <div className="relative w-full max-w-[370px] aspect-square flex items-center justify-center my-1">
          {/* Metallic Turntable Rim with Strobe Dots */}
          <div className="absolute inset-2 rounded-full border-4 border-[#2b2724] shadow-[inset_0_0_15px_rgba(0,0,0,0.95)] flex items-center justify-center">
            {/* Rubber slipmat */}
            <div className="w-[96%] h-[96%] rounded-full bg-[#181513] shadow-inner flex items-center justify-center">
              {/* Spinning Vinyl Record */}
              <div
                className={`relative z-10 w-[90%] h-[90%] rounded-full bg-[#0a0a0a] shadow-[0_0_25px_rgba(0,0,0,0.95),inset_0_0_15px_rgba(255,255,255,0.06)] flex items-center justify-center border-4 border-[#1c1c1a] transition-transform ${
                  isMotorOn
                    ? speed === '45 RPM'
                      ? 'spin-vinyl-fast'
                      : 'spin-vinyl'
                    : 'spin-paused'
                }`}
              >
                {/* Concentric Grooves */}
                <div className="w-[88%] h-[88%] rounded-full border border-neutral-700/35 flex items-center justify-center">
                  <div className="w-[80%] h-[80%] rounded-full border border-neutral-600/40 flex items-center justify-center">
                    <div className="w-[72%] h-[72%] rounded-full border border-neutral-700/50 flex items-center justify-center">
                      <div className="w-[62%] h-[62%] rounded-full border border-neutral-600/30 flex items-center justify-center">
                        {/* Center Paper Label */}
                        <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full bg-[#f4ebe1] text-[#181816] flex flex-col items-center justify-center p-2 text-center shadow-[inset_0_0_12px_rgba(0,0,0,0.35)] border-2 border-[#b91c1c] select-none">
                          <span className="font-fanzine text-[8px] uppercase tracking-widest text-[#b91c1c] font-black">
                            AUTOGESTIÓN CULTURAL
                          </span>
                          <span className="font-poster text-lg sm:text-xl uppercase font-black leading-none mt-0.5 text-black line-clamp-1">
                            {currentTrack.artist}
                          </span>
                          <span className="font-fanzine text-[8px] uppercase tracking-wider text-[#181816] font-bold mt-0.5">
                            {activeSide} // {speed}
                          </span>
                          <div className="w-3.5 h-3.5 rounded-full bg-neutral-900 mt-1 border border-neutral-600 shadow-inner flex items-center justify-center">
                            <div className="w-1 h-1 rounded-full bg-[#facc15]" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Tone Arm Simulation Overlay (Top Right to Disc) */}
          <div className="absolute right-0 top-2 w-28 h-64 pointer-events-none z-20 flex flex-col items-center">
            {/* Tone Arm Pivot Base & Counterweight */}
            <div className="w-9 h-9 rounded-full bg-[#3d3732] border-2 border-[#181816] shadow-xl flex items-center justify-center">
              <div className="w-4 h-4 rounded-full bg-[#facc15] border border-black" />
            </div>

            {/* S-Shaped Tone Arm Rod */}
            <div
              className={`w-1.5 h-40 bg-gradient-to-b from-[#e5dfd5] via-[#a89f91] to-[#6b6256] shadow-lg origin-top transition-transform duration-500 ease-out ${
                isNeedleDown
                  ? 'rotate-[-14deg] translate-x-[-12px]'
                  : 'rotate-[-2deg] translate-x-[4px]'
              }`}
            />

            {/* Cartridge & Needle Stylus with tape marker */}
            <div
              className={`w-5 h-7 bg-[#b91c1c] border border-black rounded-none shadow-md flex items-center justify-center transition-all duration-300 ${
                isNeedleDown
                  ? 'rotate-[-14deg] translate-x-[-14px] -mt-1'
                  : 'rotate-[-2deg] translate-x-[2px] -mt-1'
              }`}
              title="Cápsula magnética con púa de diamante"
            >
              <div
                className={`w-1.5 h-2.5 transition-colors ${
                  isNeedleDown ? 'bg-[#facc15] shadow-[0_0_6px_#fde047]' : 'bg-neutral-500'
                }`}
              />
            </div>
          </div>

          {/* Real-time Groove / Needle status Badge */}
          <div className="absolute bottom-2 left-2 z-20 bg-black/90 text-[#facc15] font-fanzine text-[10px] px-2.5 py-1 uppercase tracking-wider border border-[#b91c1c] flex items-center gap-2 shadow-md">
            <span
              className={`w-2 h-2 rounded-full ${
                isNeedleDown && isMotorOn ? 'bg-emerald-400 animate-pulse' : 'bg-red-500'
              }`}
            />
            <span className="truncate max-w-[240px]">
              {isNeedleDown
                ? currentTrack.grooveLabel || currentTrack.title
                : 'PÚA LEVANTADA (SILENCIO)'}
            </span>
          </div>
        </div>

        {/* Tactile Analog Physical Switches Panel */}
        <div className="w-full mt-3 pt-3 border-t-2 border-[#2b2520] grid grid-cols-2 sm:grid-cols-4 gap-2">
          {/* Motor Toggle Switch */}
          <button
            type="button"
            onClick={onToggleMotor}
            className={`font-poster text-base sm:text-lg uppercase py-2 px-2 flex flex-col items-center justify-center gap-0.5 shadow-[2px_2px_0px_#000000] active:translate-x-[1px] active:translate-y-[1px] transition-all border-2 border-black cursor-pointer ${
              isMotorOn
                ? 'bg-[#b91c1c] hover:bg-[#991b1b] text-[#facc15]'
                : 'bg-[#2b2520] hover:bg-[#38302a] text-[#c4b9a9]'
            }`}
          >
            <div className="flex items-center gap-1.5">
              {isMotorOn ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              <span>{isMotorOn ? 'DETENER BANDEJA' : 'GIRAR BANDEJA'}</span>
            </div>
          </button>

          {/* Speed Selector 33 / 45 RPM */}
          <div className="bg-[#181513] border-2 border-black p-1 flex items-center justify-around shadow-[inset_0_1px_3px_rgba(0,0,0,0.8)]">
            <button
              type="button"
              onClick={() => onSpeedChange('33 RPM')}
              className={`px-3 py-1 font-poster text-base uppercase transition-all cursor-pointer ${
                speed === '33 RPM'
                  ? 'bg-[#facc15] text-[#181816] shadow-[1px_1px_0px_#000000] font-black'
                  : 'text-[#a89e90] hover:text-white'
              }`}
            >
              33 RPM
            </button>
            <button
              type="button"
              onClick={() => onSpeedChange('45 RPM')}
              className={`px-3 py-1 font-poster text-base uppercase transition-all cursor-pointer ${
                speed === '45 RPM'
                  ? 'bg-[#facc15] text-[#181816] shadow-[1px_1px_0px_#000000] font-black'
                  : 'text-[#a89e90] hover:text-white'
              }`}
            >
              45 RPM
            </button>
          </div>

          {/* Tone Arm Cueing Lever */}
          <button
            type="button"
            onClick={onToggleNeedle}
            className={`bg-[#181513] hover:bg-[#221e1a] border-2 border-black font-poster text-base uppercase py-1.5 px-1 flex flex-col items-center justify-center gap-0.5 shadow-[2px_2px_0px_#000000] active:translate-x-[1px] active:translate-y-[1px] transition-all cursor-pointer ${
              isNeedleDown ? 'text-[#facc15]' : 'text-[#8c8070]'
            }`}
          >
            <div className="flex items-center gap-1">
              {isNeedleDown ? (
                <ArrowDown className="w-4 h-4 text-[#facc15]" />
              ) : (
                <ArrowUp className="w-4 h-4 text-neutral-400" />
              )}
              <span>{isNeedleDown ? 'BAJAR PÚA' : 'SUBIR PÚA'}</span>
            </div>
          </button>

          {/* Tube Amp Volume Knob */}
          <div className="bg-[#181513] border-2 border-black p-1.5 flex flex-col items-center justify-center shadow-[inset_0_1px_3px_rgba(0,0,0,0.8)]">
            <span className="text-[10px] font-fanzine uppercase tracking-tighter text-[#facc15] font-bold">
              VOLUMEN: {Math.round(volume * 100)}%
            </span>
            <div className="flex items-center gap-1.5 w-full mt-0.5">
              <Volume2 className="w-3.5 h-3.5 text-[#facc15] shrink-0" />
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={volume}
                onChange={(e) => onVolumeChange(parseFloat(e.target.value))}
                className="w-full accent-[#b91c1c] h-1.5 cursor-pointer bg-neutral-800"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Vinyl Tracklist / Sides Selector (LADO A & LADO B) */}
      <div className="flex flex-col gap-1.5 mt-1">
        <div className="flex items-center justify-between pb-2 border-b-2 border-[#38332e]">
          <div className="flex items-center gap-2">
            <span className="font-poster text-xl uppercase tracking-wide text-[#facc15]">
              TEMAS EN ESTE LADO
            </span>
            <span className="font-fanzine text-[10px] bg-[#b91c1c] text-white px-2 py-0.5 uppercase font-bold border border-black">
              SURCO AUTOGESTIVO
            </span>
          </div>

          <div className="flex items-center gap-1 font-poster text-base">
            <button
              type="button"
              onClick={() => onSideChange('LADO A')}
              className={`px-3 py-0.5 uppercase transition-all border border-black cursor-pointer ${
                activeSide === 'LADO A'
                  ? 'bg-[#b91c1c] text-[#facc15] shadow-[2px_2px_0px_#000]'
                  : 'bg-[#2b2520] text-[#c4b9a9] hover:text-white'
              }`}
            >
              LADO A
            </button>
            <button
              type="button"
              onClick={() => onSideChange('LADO B')}
              className={`px-3 py-0.5 uppercase transition-all border border-black cursor-pointer ${
                activeSide === 'LADO B'
                  ? 'bg-[#b91c1c] text-[#facc15] shadow-[2px_2px_0px_#000]'
                  : 'bg-[#2b2520] text-[#c4b9a9] hover:text-white'
              }`}
            >
              LADO B
            </button>
          </div>
        </div>

        {/* Track Rows */}
        <div className="flex flex-col gap-1.5 max-h-56 overflow-y-auto pr-0.5">
          {sideTracks.length === 0 ? (
            <div className="p-3 text-center text-xs font-fanzine text-[#c4b9a9] bg-[#141210] border border-[#2b2520]">
              No hay pistas en este lado. Subí canciones desde el Taller de Edición.
            </div>
          ) : (
            sideTracks.map((track) => {
              const isCurrent = currentTrack.id === track.id;
              return (
                <div
                  key={track.id}
                  onClick={() => onSelectTrack(track)}
                  className={`cursor-pointer p-2.5 flex items-center justify-between transition-colors border-2 border-black shadow-[2px_2px_0px_#000000] ${
                    isCurrent
                      ? 'bg-[#b91c1c] text-[#facc15] font-bold'
                      : 'bg-[#181513] text-[#e0d6cd] hover:bg-[#26201b]'
                  }`}
                >
                  <div className="flex items-center gap-2.5 truncate pr-2">
                    {isCurrent ? (
                      <div className="w-5 h-5 bg-[#facc15] text-[#181816] flex items-center justify-center shrink-0 border border-black">
                        <Play className="w-3 h-3 fill-current" />
                      </div>
                    ) : (
                      <Disc className="w-4 h-4 text-[#8c8070] shrink-0" />
                    )}
                    <span className="font-poster text-lg uppercase truncate tracking-wide">
                      {track.title}
                    </span>
                    {track.hasCustomAudio && (
                      <span className="bg-[#facc15] text-[#181816] text-[9px] px-1 py-0.2 font-black font-fanzine shrink-0 border border-black">
                        AUDIO
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="font-fanzine text-[10px] text-[#e8dece] opacity-80 uppercase hidden sm:inline">
                      {track.recordingNotes}
                    </span>
                    <span className="font-fanzine text-xs font-bold text-[#facc15]">
                      {track.duration}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
