/**
 * Audio Engine: Supports real user uploaded audio files via HTML5 Audio + Blob URL,
 * plus a Web Audio API synthesizer for vintage tone generation, acoustic guitar chord plucks,
 * and authentic warm vinyl crackle/surface noise ("fritura cálida").
 */

class AudioEngine {
  private audioElement: HTMLAudioElement | null = null;
  private audioCtx: AudioContext | null = null;
  private crackleNode: AudioBufferSourceNode | null = null;
  private crackleGain: GainNode | null = null;
  private synthInterval: number | null = null;
  private isSynthPlaying = false;
  private isCrackleRunning = false;
  private volume = 0.8;
  private isNeedleDown = true;
  private isMotorRunning = true;
  private currentSpeed: '33 RPM' | '45 RPM' = '33 RPM';

  private onTimeUpdateCallback: ((time: number, duration: number) => void) | null = null;
  private onTrackEndedCallback: (() => void) | null = null;

  constructor() {
    if (typeof window !== 'undefined') {
      this.audioElement = new Audio();
      this.audioElement.preload = 'auto';

      this.audioElement.addEventListener('timeupdate', () => {
        if (this.audioElement && this.onTimeUpdateCallback) {
          this.onTimeUpdateCallback(
            this.audioElement.currentTime,
            this.audioElement.duration || 0
          );
        }
      });

      this.audioElement.addEventListener('ended', () => {
        if (this.onTrackEndedCallback) {
          this.onTrackEndedCallback();
        }
      });
    }
  }

  private initAudioContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;

    if (!this.audioCtx || this.audioCtx.state === 'closed') {
      const AudioCtxClass =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtxClass) {
        try {
          this.audioCtx = new AudioCtxClass();
        } catch (e) {
          console.warn('Could not initialize AudioContext:', e);
          this.audioCtx = null;
          return null;
        }
      }
    }

    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume().catch(() => {
        // Safe catch: autoplay policy or state transitions
      });
    }

    return this.audioCtx;
  }

  public setCallbacks(
    onTimeUpdate: ((time: number, duration: number) => void) | null,
    onTrackEnded: (() => void) | null
  ) {
    this.onTimeUpdateCallback = onTimeUpdate;
    this.onTrackEndedCallback = onTrackEnded;
  }

  // Load and play a track
  public playTrack(audioUrl?: string, durationSeconds = 258) {
    this.initAudioContext();

    if (audioUrl) {
      // Real audio track
      this.stopSyntheticMusic();
      if (this.audioElement) {
        this.audioElement.src = audioUrl;
        this.applyAudioSettings();
        if (this.isMotorRunning && this.isNeedleDown) {
          this.audioElement.play().catch(() => {});
        }
      }
    } else {
      // Default track: run Web Audio synthetic warm guitar & vinyl simulation
      if (this.audioElement) {
        this.audioElement.pause();
        this.audioElement.removeAttribute('src');
      }
      this.startSyntheticMusic(durationSeconds);
    }

    this.startVinylCrackle();
  }

  public pause() {
    if (this.audioElement && !this.audioElement.paused) {
      this.audioElement.pause();
    }
    this.stopSyntheticMusic();
    this.stopVinylCrackle();
  }

  public resume() {
    this.initAudioContext();
    if (this.audioElement && this.audioElement.src) {
      if (this.isMotorRunning && this.isNeedleDown) {
        this.audioElement.play().catch(() => {});
      }
    } else if (this.isSynthPlaying) {
      // synth is running or can resume
    }
    if (this.isMotorRunning && this.isNeedleDown) {
      this.startVinylCrackle();
    }
  }

  public seek(seconds: number) {
    if (this.audioElement && this.audioElement.src) {
      this.audioElement.currentTime = seconds;
    }
  }

  public setVolume(vol: number) {
    this.volume = Math.max(0, Math.min(1, vol));
    this.applyAudioSettings();
  }

  public setSpeed(speed: '33 RPM' | '45 RPM') {
    this.currentSpeed = speed;
    this.applyAudioSettings();
  }

  public setNeedleDown(needleDown: boolean) {
    this.isNeedleDown = needleDown;
    this.playNeedleSound(needleDown);
    this.applyAudioSettings();
  }

  public setMotorOn(motorOn: boolean) {
    this.isMotorRunning = motorOn;
    this.applyAudioSettings();
  }

  private applyAudioSettings() {
    const effectivePlay = this.isMotorRunning && this.isNeedleDown;
    const rate = this.currentSpeed === '45 RPM' ? 1.36 : 1.0;

    if (this.audioElement) {
      this.audioElement.volume = effectivePlay ? this.volume : 0;
      this.audioElement.playbackRate = rate;
      if (!effectivePlay && !this.audioElement.paused) {
        this.audioElement.pause();
      } else if (effectivePlay && this.audioElement.src && this.audioElement.paused) {
        this.audioElement.play().catch(() => {});
      }
    }

    if (this.crackleGain && this.audioCtx && this.audioCtx.state !== 'closed') {
      const crackleVol = effectivePlay ? this.volume * 0.15 : 0;
      try {
        this.crackleGain.gain.setValueAtTime(crackleVol, this.audioCtx.currentTime);
      } catch (e) {}
    }
  }

  // Needle drop/lift sound
  private playNeedleSound(dropping: boolean) {
    const ctx = this.initAudioContext();
    if (!ctx || ctx.state === 'closed') return;

    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      filter.type = 'bandpass';
      filter.frequency.value = dropping ? 380 : 720;
      filter.Q.value = 3;

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(dropping ? 120 : 280, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(dropping ? 40 : 180, ctx.currentTime + 0.12);

      gain.gain.setValueAtTime(this.volume * 0.25, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.16);
    } catch (e) {
      // AudioContext might be in invalid state or blocked until gesture
    }
  }

  // Continuous Vinyl surface crackle
  private startVinylCrackle() {
    const ctx = this.initAudioContext();
    if (!ctx || ctx.state === 'closed' || this.isCrackleRunning) return;

    try {
      const bufferSize = ctx.sampleRate * 3;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);

      // Generate pink/brown noise with occasional vinyl pops
      let lastOut = 0.0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        // Brownian noise filter
        lastOut = (lastOut + (0.02 * white)) / 1.02;

        // Occasional needle pop
        const isPop = Math.random() < 0.0004;
        const pop = isPop ? (Math.random() > 0.5 ? 0.7 : -0.7) : 0;

        data[i] = (lastOut * 0.4 + pop) * 0.6;
      }

      this.crackleNode = ctx.createBufferSource();
      this.crackleNode.buffer = buffer;
      this.crackleNode.loop = true;

      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.value = 1800;
      filter.Q.value = 1.2;

      this.crackleGain = ctx.createGain();
      const vol = (this.isMotorRunning && this.isNeedleDown) ? this.volume * 0.12 : 0;
      this.crackleGain.gain.setValueAtTime(vol, ctx.currentTime);

      this.crackleNode.connect(filter);
      filter.connect(this.crackleGain);
      this.crackleGain.connect(ctx.destination);

      this.crackleNode.start();
      this.isCrackleRunning = true;
    } catch (e) {
      // Ignore audio error
    }
  }

  private stopVinylCrackle() {
    if (this.crackleNode) {
      try {
        this.crackleNode.stop();
        this.crackleNode.disconnect();
      } catch (e) {}
      this.crackleNode = null;
    }
    if (this.crackleGain) {
      try {
        this.crackleGain.disconnect();
      } catch (e) {}
      this.crackleGain = null;
    }
    this.isCrackleRunning = false;
  }

  // Synthetic guitar / vintage tone loop for default songs
  private startSyntheticMusic(totalDurationSeconds: number) {
    this.stopSyntheticMusic();
    this.isSynthPlaying = true;

    let elapsed = 0;
    const chords = [
      [220, 261.63, 329.63, 392.00], // Am7
      [293.66, 369.99, 440.00, 587.33], // D9
      [174.61, 220.00, 261.63, 329.63], // Fmaj7
      [164.81, 207.65, 311.13, 392.00]  // E7#9
    ];
    let chordIdx = 0;

    const tick = () => {
      if (!this.isSynthPlaying) return;

      if (this.isMotorRunning && this.isNeedleDown) {
        elapsed += 1.6;
        if (elapsed > totalDurationSeconds) {
          elapsed = 0;
          if (this.onTrackEndedCallback) this.onTrackEndedCallback();
        }
        if (this.onTimeUpdateCallback) {
          this.onTimeUpdateCallback(elapsed, totalDurationSeconds);
        }

        const notes = chords[chordIdx % chords.length];
        chordIdx++;
        this.playAcousticArpeggio(notes);
      }
    };

    tick();
    this.synthInterval = window.setInterval(tick, 1600);
  }

  private stopSyntheticMusic() {
    this.isSynthPlaying = false;
    if (this.synthInterval) {
      clearInterval(this.synthInterval);
      this.synthInterval = null;
    }
  }

  // Pluck a single chord or arpeggio (warm electric/nylon tone)
  public playAcousticArpeggio(notes: number[]) {
    const ctx = this.initAudioContext();
    if (!ctx || ctx.state === 'closed' || !this.isMotorRunning || !this.isNeedleDown) return;

    notes.forEach((freq, idx) => {
      const delay = idx * 0.08;
      setTimeout(() => {
        if (!this.audioCtx || this.audioCtx.state === 'closed' || !this.isMotorRunning || !this.isNeedleDown) return;
        try {
          const osc = this.audioCtx.createOscillator();
          const gain = this.audioCtx.createGain();
          const filter = this.audioCtx.createBiquadFilter();

          osc.type = 'triangle';
          const rateMultiplier = this.currentSpeed === '45 RPM' ? 1.36 : 1.0;
          osc.frequency.setValueAtTime(freq * rateMultiplier, this.audioCtx.currentTime);

          filter.type = 'lowpass';
          filter.frequency.setValueAtTime(1400, this.audioCtx.currentTime);
          filter.frequency.exponentialRampToValueAtTime(350, this.audioCtx.currentTime + 1.2);

          const now = this.audioCtx.currentTime;
          gain.gain.setValueAtTime(0.001, now);
          gain.gain.linearRampToValueAtTime(this.volume * 0.16, now + 0.03);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.4);

          osc.connect(filter);
          filter.connect(gain);
          gain.connect(this.audioCtx.destination);

          osc.start(now);
          osc.stop(now + 1.5);
        } catch (e) {}
      }, delay * 1000);
    });
  }

  // Play chord from Rincón Criollo directly
  public triggerNamedChord(name: string) {
    this.initAudioContext();
    const chordMap: Record<string, number[]> = {
      'Am7': [220, 261.63, 329.63, 392.00],
      'D9': [293.66, 369.99, 440.00, 587.33],
      'Fmaj7': [174.61, 220.00, 261.63, 329.63],
      'E7(#9)': [164.81, 207.65, 311.13, 392.00],
      'Em7': [164.81, 196.00, 246.94, 293.66],
      'A7': [220, 277.18, 329.63, 392.00],
      'Cmaj7': [130.81, 164.81, 196.00, 246.94],
      'B7': [246.94, 311.13, 369.99, 440.00],
    };

    const notes = chordMap[name] || [220, 261.63, 329.63, 392.00];
    this.playAcousticArpeggio(notes);
  }

  public async destroy() {
    this.stopSyntheticMusic();
    this.stopVinylCrackle();
    if (this.audioElement) {
      try {
        this.audioElement.pause();
        this.audioElement.removeAttribute('src');
        this.audioElement.load();
      } catch (e) {}
    }
    const ctx = this.audioCtx;
    this.audioCtx = null;
    if (ctx && ctx.state !== 'closed') {
      try {
        await ctx.close();
      } catch (e) {
        // Safe: catches already closing / closed / pending resume errors
      }
    }
  }
}

export const audioEngine = new AudioEngine();
