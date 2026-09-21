import React from 'react';
import { Track } from '../types';
import { Play, Pause, SkipBack, SkipForward, Disc, Radio } from 'lucide-react';

interface BottomPlayerBarProps {
  currentTrack: Track;
  isPlaying: boolean;
  isMotorOn: boolean;
  currentTime: number;
  duration: number;
  speed: '33 RPM' | '45 RPM';
  onTogglePlay: () => void;
  onPrevTrack: () => void;
  onNextTrack: () => void;
  onSeek: (seconds: number) => void;
}

export const BottomPlayerBar: React.FC<BottomPlayerBarProps> = ({
  currentTrack,
  isPlaying,
  isMotorOn,
  currentTime,
  duration,
  speed,
  onTogglePlay,
  onPrevTrack,
  onNextTrack,
  onSeek,
}) => {
  const formatTime = (secs: number) => {
    if (isNaN(secs) || secs < 0) return '00:00';
    const m = Math.floor(secs / 60)
      .toString()
      .padStart(2, '0');
    const s = Math.floor(secs % 60)
      .toString()
      .padStart(2, '0');
    return `${m}:${s}`;
  };

  const totalDurationSeconds = duration || currentTrack.durationSeconds || 240;
  const progressPercent = Math.min(100, Math.max(0, (currentTime / totalDurationSeconds) * 100));

  const handleProgressBarClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const ratio = Math.max(0, Math.min(1, clickX / rect.width));
    onSeek(ratio * totalDurationSeconds);
  };

  return (
    <aside className="fixed bottom-0 left-0 right-0 z-50 bg-[#181816] text-[#e8decb] border-t-4 border-[#b91c1c] shadow-[0_-4px_10px_rgba(0,0,0,0.6)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2 flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Left Track & Rotating Mini Vinyl */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          {/* Spinning Mini Vinyl */}
          <div
            className={`relative w-11 h-11 rounded-full bg-black border-2 border-neutral-700 flex items-center justify-center shadow-md overflow-hidden shrink-0 ${
              isPlaying && isMotorOn ? 'spin-vinyl' : 'spin-paused'
            }`}
          >
            <div className="w-5 h-5 rounded-full bg-[#b91c1c] flex items-center justify-center border border-[#facc15]">
              <div className="w-1.5 h-1.5 rounded-full bg-black" />
            </div>
          </div>

          <div className="flex flex-col truncate">
            <div className="flex items-center gap-2 truncate">
              <span className="font-poster text-xs bg-[#b91c1c] text-[#facc15] px-2 py-0.5 uppercase font-bold shrink-0">
                {speed}
              </span>
              <span className="font-poster text-lg font-bold text-[#facc15] uppercase tracking-tight truncate leading-none">
                {currentTrack.title} • {currentTrack.side}
              </span>
            </div>

            <div className="flex items-center gap-2 font-fanzine text-[11px] text-[#c8beaf] truncate mt-0.5 font-bold">
              <span className="text-[#facc15] truncate">{currentTrack.artist}</span>
              <span>•</span>
              <span className="font-mono text-white">
                {formatTime(currentTime)} / {formatTime(totalDurationSeconds)}
              </span>
              <span>•</span>
              <span className="text-[#4ade80] font-black shrink-0">
                {isPlaying && isMotorOn ? 'GIRANDO EN BANDEJA' : 'DETENIDA'}
              </span>
            </div>
          </div>
        </div>

        {/* Center Controls */}
        <div className="flex items-center gap-3 w-full md:w-1/3">
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              type="button"
              onClick={onPrevTrack}
              className="w-8 h-8 bg-[#2a2723] text-[#facc15] border border-black flex items-center justify-center hover:bg-neutral-800 active:translate-x-[1px] active:translate-y-[1px] cursor-pointer shadow-[1px_1px_0px_#000]"
              title="Pista anterior"
            >
              <SkipBack className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={onTogglePlay}
              className="w-9 h-9 bg-[#b91c1c] text-[#facc15] border border-black flex items-center justify-center hover:bg-[#991b1b] active:translate-x-[1px] active:translate-y-[1px] cursor-pointer shadow-[2px_2px_0px_#000]"
              title={isPlaying ? 'Pausar Bandeja' : 'Reproducir'}
            >
              {isPlaying && isMotorOn ? (
                <Pause className="w-4 h-4 fill-[#facc15]" />
              ) : (
                <Play className="w-4 h-4 fill-[#facc15]" />
              )}
            </button>

            <button
              type="button"
              onClick={onNextTrack}
              className="w-8 h-8 bg-[#2a2723] text-[#facc15] border border-black flex items-center justify-center hover:bg-neutral-800 active:translate-x-[1px] active:translate-y-[1px] cursor-pointer shadow-[1px_1px_0px_#000]"
              title="Siguiente pista"
            >
              <SkipForward className="w-4 h-4" />
            </button>
          </div>

          <div className="flex-1 flex flex-col gap-1">
            {/* Interactive Progress Bar */}
            <div
              onClick={handleProgressBarClick}
              className="w-full bg-neutral-900 h-2 border border-neutral-700 cursor-pointer relative overflow-hidden"
              title="Hacé clic para mover la aguja sobre el surco"
            >
              <div
                className="bg-[#b91c1c] h-full transition-all duration-150"
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            <div className="flex justify-between font-fanzine text-[10px] text-[#facc15] font-bold">
              <span>PÚA SHURE DIAMANTE</span>
              <span className="uppercase text-[#a89e90]">AUDIO AUTOGESTIVO</span>
            </div>
          </div>
        </div>

        {/* Right Vinyl Status & Controls */}
        <div className="hidden lg:flex items-center gap-4 font-fanzine text-xs">
          <div className="flex items-center gap-1.5 font-bold">
            <Radio className="w-4 h-4 text-[#facc15]" />
            <span className="text-[#a89e90] uppercase">SURCO:</span>
            <span className="text-[#facc15]">GRABACIÓN DIRECTA</span>
          </div>

          <div className="px-2.5 py-0.5 border border-black bg-[#2a2723] text-[#facc15] font-bold uppercase tracking-wider text-[11px] font-poster">
            SONIDO GALPÓN
          </div>
        </div>
      </div>
    </aside>
  );
};
