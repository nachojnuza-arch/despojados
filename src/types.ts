export interface Track {
  id: string;
  title: string;
  artist: string;
  album?: string;
  duration: string;
  durationSeconds: number;
  side: 'LADO A' | 'LADO B';
  speed: '33 RPM' | '45 RPM';
  format: string; // e.g. 'VINILO 180g', '7" SINGLE 45 RPM', '10" MINI-LP', 'ACÚSTICO'
  grooveLabel: string;
  recordingNotes: string;
  venueOrStudio: string;
  year: string;
  coverUrl?: string;
  audioBlobUrl?: string; // If user uploaded custom audio
  hasCustomAudio?: boolean;
  chords?: string[];
  createdAt: number;
}

export interface TurntableState {
  currentTrack: Track;
  isPlaying: boolean;
  isMotorOn: boolean;
  isNeedleDown: boolean;
  currentTime: number;
  duration: number;
  volume: number; // 0 to 1
  speed: '33 RPM' | '45 RPM';
  activeSide: 'LADO A' | 'LADO B';
  crackleEnabled: boolean;
}

export interface Post {
  id: string;
  title: string;
  category: string; // e.g. 'Novedad', 'Lanzamiento', 'Próximo Show', 'Ensayo'
  date: string;
  content: string;
  imageUrl?: string;
  createdAt: number;
}

export interface SiteContent {
  bandName: string;
  heroBadge: string;
  heroTitle: string;
  heroSubtitle: string;
  heroDescription: string;
  bioTitle: string;
  bioText1: string;
  bioText2: string;
  origin: string;
  productionNotes: string;
}
