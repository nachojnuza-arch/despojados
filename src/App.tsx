import React, { useState, useEffect, useRef } from 'react';
import { Track, Post, SiteContent } from './types';
import {
  DEFAULT_TRACKS,
  loadTracks,
  loadPosts,
  loadSiteContent,
} from './services/storageService';
import { audioEngine } from './services/audioEngine';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { TurntableDeck } from './components/TurntableDeck';
import { SurcosCatalog } from './components/SurcosCatalog';
import { PostsSection } from './components/PostsSection';
import { ArtistBioSection } from './components/ArtistBioSection';
import { AdminPanel } from './components/AdminPanel';
import { BottomPlayerBar } from './components/BottomPlayerBar';
import { Footer } from './components/Footer';
import { Disc3, Radio } from 'lucide-react';

export default function App() {
  const [tracks, setTracks] = useState<Track[]>(DEFAULT_TRACKS);
  const [currentTrack, setCurrentTrack] = useState<Track>(DEFAULT_TRACKS[0]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [siteContent, setSiteContent] = useState<SiteContent>({
    bandName: 'Despojados',
    heroBadge: 'BANDA OFICIAL // ROCK & CANCIÓN RIOPLATENSE',
    heroTitle: 'DESPOJADOS',
    heroSubtitle: 'Música de Autor & Sonido Analógico',
    heroDescription:
      'Bienvenidos a nuestro archivo musical: escuchá cada canción en el tocadiscos, recorré nuestro catálogo y descubrí la historia de cada tema.',
    bioTitle: 'CANCIONES QUE CUENTAN HISTORIAS CON CALIDEZ ANALÓGICA',
    bioText1:
      'Este espacio fue creado para compartir y difundir la música de Despojados tal como fue concebida: con la pausa, la textura y el respeto por cada canción que evoca escuchar un disco de vinilo.',
    bioText2:
      'Cada tema reúne arreglos de guitarras criollas, bajos marcados, órganos vintage y relatos urbanos nacidos en las tardes rioplatenses. Podés elegir cualquier canción de la lista, colocar la aguja virtual sobre el surco y disfrutar de la experiencia completa.',
    origin: 'LA PLATA, BUENOS AIRES',
    productionNotes: 'Edición Autogestionada',
  });

  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [isMotorOn, setIsMotorOn] = useState<boolean>(true);
  const [isNeedleDown, setIsNeedleDown] = useState<boolean>(true);
  const [currentTime, setCurrentTime] = useState<number>(85); // start at 01:25 as in original mockup
  const [duration, setDuration] = useState<number>(258);
  const [volume, setVolume] = useState<number>(0.8);
  const [speed, setSpeed] = useState<'33 RPM' | '45 RPM'>('33 RPM');
  const [activeSide, setActiveSide] = useState<'LADO A' | 'LADO B'>('LADO A');
  const [crackleEnabled, setCrackleEnabled] = useState<boolean>(true);

  const tracksRef = useRef(tracks);
  tracksRef.current = tracks;
  const currentTrackRef = useRef(currentTrack);
  currentTrackRef.current = currentTrack;
  const handleNextTrackRef = useRef<() => void>(() => {});

  const [currentView, setCurrentView] = useState<'public' | 'admin'>('public');
  const [adminInitialTab, setAdminInitialTab] = useState<'music' | 'posts' | 'content'>('music');
  const [activeSection, setActiveSection] = useState<string>('turntable');

  // Check URL query on mount for direct admin access (?admin=true or #admin)
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('admin') === 'true' || window.location.hash === '#admin') {
      setCurrentView('admin');
    }
  }, []);

  // Load tracks, site content, and posts from server API on mount
  useEffect(() => {
    loadTracks().then((loaded) => {
      if (loaded && loaded.length > 0) {
        setTracks(loaded);
        setCurrentTrack(loaded[0]);
        setDuration(loaded[0].durationSeconds || 258);
      }
    });

    loadSiteContent().then((content) => {
      if (content) {
        setSiteContent(content);
      }
    });

    loadPosts().then((loadedPosts) => {
      if (loadedPosts) {
        setPosts(loadedPosts);
      }
    });
  }, []);

  // Setup audio callbacks once on mount
  useEffect(() => {
    audioEngine.setCallbacks(
      (time, totalDuration) => {
        setCurrentTime(time);
        if (totalDuration > 0) {
          setDuration(totalDuration);
        }
      },
      () => {
        // Track ended -> play next track
        handleNextTrackRef.current();
      }
    );

    return () => {
      audioEngine.setCallbacks(null, null);
    };
  }, []);

  // Destroy engine only when the entire App unmounts
  useEffect(() => {
    return () => {
      audioEngine.destroy();
    };
  }, []);

  // Sync speed & volume to engine
  useEffect(() => {
    audioEngine.setVolume(volume);
  }, [volume]);

  useEffect(() => {
    audioEngine.setSpeed(speed);
  }, [speed]);

  useEffect(() => {
    audioEngine.setNeedleDown(isNeedleDown);
  }, [isNeedleDown]);

  useEffect(() => {
    audioEngine.setMotorOn(isMotorOn);
  }, [isMotorOn]);

  // Load and play a track
  const playSelectedTrack = (track: Track) => {
    setCurrentTrack(track);
    setDuration(track.durationSeconds || 258);
    setCurrentTime(0);
    setActiveSide(track.side);
    setSpeed(track.speed);

    setIsMotorOn(true);
    setIsNeedleDown(true);
    setIsPlaying(true);

    audioEngine.setMotorOn(true);
    audioEngine.setNeedleDown(true);
    audioEngine.setSpeed(track.speed);
    audioEngine.playTrack(track.audioBlobUrl, track.durationSeconds || 258);
  };

  // Motor toggle
  const handleToggleMotor = () => {
    const nextMotor = !isMotorOn;
    setIsMotorOn(nextMotor);
    audioEngine.setMotorOn(nextMotor);

    if (nextMotor && isNeedleDown) {
      setIsPlaying(true);
      audioEngine.resume();
    } else {
      setIsPlaying(false);
      audioEngine.pause();
    }
  };

  // Tone Arm Needle Toggle (Cueing Lever)
  const handleToggleNeedle = () => {
    const nextNeedle = !isNeedleDown;
    setIsNeedleDown(nextNeedle);
    audioEngine.setNeedleDown(nextNeedle);
  };

  // Speed change
  const handleSpeedChange = (newSpeed: '33 RPM' | '45 RPM') => {
    setSpeed(newSpeed);
    audioEngine.setSpeed(newSpeed);
  };

  // Side change
  const handleSideChange = (newSide: 'LADO A' | 'LADO B') => {
    setActiveSide(newSide);
    // Find first track of that side
    const firstTrackOfSide = tracks.find((t) => t.side === newSide);
    if (firstTrackOfSide && firstTrackOfSide.id !== currentTrack.id) {
      playSelectedTrack(firstTrackOfSide);
    }
  };

  // Prev / Next track navigation
  const handlePrevTrack = () => {
    const curTracks = tracksRef.current;
    const curTrack = currentTrackRef.current;
    if (curTracks.length === 0) return;
    const currentIdx = curTracks.findIndex((t) => t.id === curTrack.id);
    const prevIdx = currentIdx <= 0 ? curTracks.length - 1 : currentIdx - 1;
    playSelectedTrack(curTracks[prevIdx]);
  };

  const handleNextTrack = () => {
    const curTracks = tracksRef.current;
    const curTrack = currentTrackRef.current;
    if (curTracks.length === 0) return;
    const currentIdx = curTracks.findIndex((t) => t.id === curTrack.id);
    const nextIdx = (currentIdx + 1) % curTracks.length;
    playSelectedTrack(curTracks[nextIdx]);
  };
  handleNextTrackRef.current = handleNextTrack;

  // Seek
  const handleSeek = (seconds: number) => {
    setCurrentTime(seconds);
    audioEngine.seek(seconds);
  };

  // Master bottom player play/pause toggle
  const handleBottomTogglePlay = () => {
    if (isPlaying && isMotorOn) {
      handleToggleMotor();
    } else {
      if (!isMotorOn) {
        setIsMotorOn(true);
        audioEngine.setMotorOn(true);
      }
      if (!isNeedleDown) {
        setIsNeedleDown(true);
        audioEngine.setNeedleDown(true);
      }
      setIsPlaying(true);
      audioEngine.resume();
    }
  };

  // Add new track from Admin
  const handleTrackAdded = (newTrack: Track) => {
    const updated = [newTrack, ...tracks];
    setTracks(updated);
    playSelectedTrack(newTrack);
  };

  // Delete track
  const handleTrackDeleted = (trackId: string) => {
    const updated = tracks.filter((t) => t.id !== trackId);
    setTracks(updated);
    if (currentTrack.id === trackId && updated.length > 0) {
      playSelectedTrack(updated[0]);
    }
  };

  // Update track
  const handleTrackUpdated = (updatedTrack: Track) => {
    const updated = tracks.map((t) => (t.id === updatedTrack.id ? updatedTrack : t));
    setTracks(updated);
    if (currentTrack.id === updatedTrack.id) {
      setCurrentTrack(updatedTrack);
    }
  };

  // Reset Archive
  const handleResetArchive = async () => {
    const loaded = await loadTracks();
    setTracks(loaded);
    if (loaded.length > 0) {
      playSelectedTrack(loaded[0]);
    }
  };

  // Post handlers
  const handlePostAdded = (newPost: Post) => {
    setPosts((prev) => [newPost, ...prev]);
  };

  const handlePostUpdated = (updatedPost: Post) => {
    setPosts((prev) => prev.map((p) => (p.id === updatedPost.id ? updatedPost : p)));
  };

  const handlePostDeleted = (postId: string) => {
    setPosts((prev) => prev.filter((p) => p.id !== postId));
  };

  const handleSiteContentUpdated = (updated: SiteContent) => {
    setSiteContent(updated);
  };

  return (
    <div className="min-h-screen bg-[#fcf9f5] font-body text-[#1c1c1a] flex flex-col justify-between">
      {/* Fixed Header */}
      <Header
        currentView={currentView}
        onViewChange={(view) => setCurrentView(view)}
        activeSection={activeSection}
        bandName={siteContent.bandName}
      />

      {/* Main Content Area */}
      <main className="w-full pt-28 pb-36 max-w-7xl mx-auto px-4 sm:px-6">
        {currentView === 'admin' ? (
          /* Dedicated Admin Page */
          <AdminPanel
            tracks={tracks}
            posts={posts}
            siteContent={siteContent}
            initialTab={adminInitialTab}
            onBackToTurntable={() => {
              setCurrentView('public');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onTrackAdded={handleTrackAdded}
            onTrackDeleted={handleTrackDeleted}
            onTrackUpdated={handleTrackUpdated}
            onResetArchive={handleResetArchive}
            onLoadTrackToTurntable={(track) => {
              playSelectedTrack(track);
              setCurrentView('public');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onPostAdded={handlePostAdded}
            onPostUpdated={handlePostUpdated}
            onPostDeleted={handlePostDeleted}
            onSiteContentUpdated={handleSiteContentUpdated}
          />
        ) : (
          /* Public Vinyl & Turntable Page */
          <div className="flex flex-col w-full gap-8">
            {/* Top Banner: Warm Tungsten & Vinyl Notice */}
            <div className="w-full flex justify-center -mt-3 sm:-mt-5">
              <div className="bg-[#fdc34d] text-[#715000] px-4 sm:px-6 py-1 font-label text-xs sm:text-sm uppercase tracking-wider rotate-[-1deg] shadow-[3px_3px_0px_#1c1c1a] flex items-center gap-2 select-none border border-[#1c1c1a] text-center font-bold">
                <Radio className="w-4 h-4 shrink-0" />
                <span className="truncate">
                  {siteContent.bandName.toUpperCase()} // SONIDO ANALÓGICO // PRENSADO VIRGEN EN 180g // TOCADISCOS OFICIAL
                </span>
                <Disc3 className="w-4 h-4 shrink-0" />
              </div>
            </div>

            {/* Top Hero Grid: Left Column (Manifesto) + Right Column (Interactive Turntable) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-stretch">
              <div className="lg:col-span-6 flex flex-col">
                <HeroSection
                  onOpenAdmin={() => {
                    setAdminInitialTab('music');
                    setCurrentView('admin');
                  }}
                  siteContent={siteContent}
                />
              </div>

              <div className="lg:col-span-6 flex flex-col">
                <TurntableDeck
                  currentTrack={currentTrack}
                  tracks={tracks}
                  isPlaying={isPlaying}
                  isMotorOn={isMotorOn}
                  isNeedleDown={isNeedleDown}
                  volume={volume}
                  speed={speed}
                  activeSide={activeSide}
                  crackleEnabled={crackleEnabled}
                  onToggleMotor={handleToggleMotor}
                  onToggleNeedle={handleToggleNeedle}
                  onSpeedChange={handleSpeedChange}
                  onVolumeChange={(vol) => setVolume(vol)}
                  onSideChange={handleSideChange}
                  onSelectTrack={playSelectedTrack}
                />
              </div>
            </div>

            {/* Section: Catálogo de Canciones & Discos del Artista */}
            <SurcosCatalog
              tracks={tracks}
              currentTrackId={currentTrack.id}
              onLoadTrack={(track) => {
                playSelectedTrack(track);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />

            {/* Section: Publicaciones, Novedades & Fechas con Fotos */}
            <PostsSection
              posts={posts}
              siteContent={siteContent}
              onOpenAdminPosts={() => {
                setAdminInitialTab('posts');
                setCurrentView('admin');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />

            {/* Section: Acerca de la Banda & Proyecto Musical */}
            <ArtistBioSection
              tracks={tracks}
              siteContent={siteContent}
              onPlayFeaturedTrack={(track) => {
                playSelectedTrack(track);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />
          </div>
        )}
      </main>

      {/* Sticky Bottom Analog Player Bar */}
      <BottomPlayerBar
        currentTrack={currentTrack}
        isPlaying={isPlaying}
        isMotorOn={isMotorOn}
        currentTime={currentTime}
        duration={duration}
        speed={speed}
        onTogglePlay={handleBottomTogglePlay}
        onPrevTrack={handlePrevTrack}
        onNextTrack={handleNextTrack}
        onSeek={handleSeek}
      />

      {/* Footer with subtle master access link */}
      <Footer
        onOpenAdmin={() => {
          setAdminInitialTab('music');
          setCurrentView('admin');
        }}
        bandName={siteContent.bandName}
      />
    </div>
  );
}
