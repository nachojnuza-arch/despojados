import React, { useState, useRef, useEffect } from 'react';
import { Track, Post, SiteContent } from '../types';
import {
  getAdminToken,
  loginAdmin,
  clearAdminToken,
  uploadTrackToServer,
  deleteTrackFromServer,
  resetArchiveOnServer,
  saveSiteContent,
  savePost,
  deletePost,
  uploadCustomImage,
} from '../services/storageService';
import {
  UploadCloud,
  Disc,
  Play,
  Pause,
  Trash2,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  FileAudio,
  Download,
  RotateCcw,
  Lock,
  Unlock,
  KeyRound,
  ShieldCheck,
  Radio,
  Eye,
  EyeOff,
  Newspaper,
  Type,
  Image as ImageIcon,
  Save,
  Plus,
  Edit3,
  HelpCircle,
  Sparkles,
  Info,
} from 'lucide-react';

interface AdminPanelProps {
  tracks: Track[];
  posts?: Post[];
  siteContent?: SiteContent;
  initialTab?: 'music' | 'posts' | 'content';
  onBackToTurntable: () => void;
  onTrackAdded: (track: Track) => void;
  onTrackDeleted: (trackId: string) => void;
  onTrackUpdated: (track: Track) => void;
  onResetArchive: () => void;
  onLoadTrackToTurntable: (track: Track) => void;
  onPostAdded?: (post: Post) => void;
  onPostUpdated?: (post: Post) => void;
  onPostDeleted?: (postId: string) => void;
  onSiteContentUpdated?: (content: SiteContent) => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  tracks,
  posts = [],
  siteContent,
  initialTab = 'music',
  onBackToTurntable,
  onTrackAdded,
  onTrackDeleted,
  onTrackUpdated,
  onResetArchive,
  onLoadTrackToTurntable,
  onPostAdded,
  onPostUpdated,
  onPostDeleted,
  onSiteContentUpdated,
}) => {
  // Authentication state
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [passwordInput, setPasswordInput] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState<boolean>(false);

  // Active Tab
  const [activeTab, setActiveTab] = useState<'music' | 'posts' | 'content'>(initialTab);

  // Messages
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // ==========================================
  // TAB 1: MUSIC UPLOAD STATE
  // ==========================================
  const [title, setTitle] = useState('');
  const [artist, setArtist] = useState(siteContent?.bandName || 'Despojados');
  const [album, setAlbum] = useState(siteContent?.bandName || 'Despojados');
  const [side, setSide] = useState<'LADO A' | 'LADO B'>('LADO A');
  const [speed, setSpeed] = useState<'33 RPM' | '45 RPM'>('33 RPM');
  const [format, setFormat] = useState('VINILO 180g');
  const [venueOrStudio, setVenueOrStudio] = useState('LA PLATA // MÁSTER DIRECTO');
  const [recordingNotes, setRecordingNotes] = useState('CANCIÓN DE ESTUDIO');
  const [year, setYear] = useState('2024');
  const [chordsInput, setChordsInput] = useState('Am7, D9, Fmaj7, E7(#9)');

  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreviewUrl, setCoverPreviewUrl] = useState<string | null>(null);
  const [audioPreviewUrl, setAudioPreviewUrl] = useState<string | null>(null);
  const [isPreviewPlaying, setIsPreviewPlaying] = useState(false);
  const [isProcessingMusic, setIsProcessingMusic] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);
  const audioPreviewElementRef = useRef<HTMLAudioElement | null>(null);

  // ==========================================
  // TAB 2: POSTS STATE
  // ==========================================
  const [editingPostId, setEditingPostId] = useState<string | null>(null);
  const [postTitle, setPostTitle] = useState('');
  const [postCategory, setPostCategory] = useState('Novedad');
  const [postDate, setPostDate] = useState(
    new Date().toLocaleDateString('es-AR', { day: 'numeric', month: 'long', year: 'numeric' })
  );
  const [postContent, setPostContent] = useState('');
  const [postImageFile, setPostImageFile] = useState<File | null>(null);
  const [postImageUrl, setPostImageUrl] = useState('');
  const [postImagePreview, setPostImagePreview] = useState<string | null>(null);
  const [isProcessingPost, setIsProcessingPost] = useState(false);
  const postImageInputRef = useRef<HTMLInputElement>(null);

  // ==========================================
  // TAB 3: SITE CONTENT STATE
  // ==========================================
  const [contentForm, setContentForm] = useState<SiteContent>({
    bandName: siteContent?.bandName || 'Despojados',
    heroBadge: siteContent?.heroBadge || 'BANDA OFICIAL // ROCK & CANCIÓN RIOPLATENSE',
    heroTitle: siteContent?.heroTitle || 'DESPOJADOS',
    heroSubtitle: siteContent?.heroSubtitle || 'Música de Autor & Sonido Analógico',
    heroDescription:
      siteContent?.heroDescription ||
      'Bienvenidos a nuestro archivo musical: escuchá cada canción en el tocadiscos, recorré nuestro catálogo y descubrí la historia de cada tema.',
    bioTitle: siteContent?.bioTitle || 'CANCIONES QUE CUENTAN HISTORIAS CON CALIDEZ ANALÓGICA',
    bioText1:
      siteContent?.bioText1 ||
      'Este espacio fue creado para compartir y difundir la música de Despojados tal como fue concebida: con la pausa, la textura y el respeto por cada canción que evoca escuchar un disco de vinilo.',
    bioText2:
      siteContent?.bioText2 ||
      'Cada tema reúne arreglos de guitarras criollas, bajos marcados, órganos vintage y relatos urbanos nacidos en las tardes rioplatenses. Podés elegir cualquier canción de la lista, colocar la aguja virtual sobre el surco y disfrutar de la experiencia completa.',
    origin: siteContent?.origin || 'LA PLATA, BUENOS AIRES',
    productionNotes: siteContent?.productionNotes || 'Edición Autogestionada',
  });
  const [isProcessingContent, setIsProcessingContent] = useState(false);

  // Sync content form when siteContent changes
  useEffect(() => {
    if (siteContent) {
      setContentForm(siteContent);
      if (siteContent.bandName && !artist) {
        setArtist(siteContent.bandName);
        setAlbum(siteContent.bandName);
      }
    }
  }, [siteContent]);

  // Check token on mount
  useEffect(() => {
    const token = getAdminToken();
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  // Handle Admin Login
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passwordInput.trim()) {
      setAuthError('Ingresá la clave maestra de acceso.');
      return;
    }

    setIsLoggingIn(true);
    setAuthError(null);

    const res = await loginAdmin(passwordInput.trim());
    setIsLoggingIn(false);

    if (res.success) {
      setIsAuthenticated(true);
      setPasswordInput('');
      setSuccessMessage('¡Sesión de administración iniciada con éxito!');
      setTimeout(() => setSuccessMessage(null), 4000);
    } else {
      setAuthError(res.error || 'Clave de administración incorrecta');
    }
  };

  const handleLogout = () => {
    clearAdminToken();
    setIsAuthenticated(false);
    setSuccessMessage('Sesión cerrada correctamente.');
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  // ==========================================
  // TAB 1 HANDLERS (MUSIC)
  // ==========================================
  const handleAudioFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('audio/') && !file.name.match(/\.(mp3|wav|ogg|m4a|aac|flac)$/i)) {
      setErrorMessage('Por favor seleccioná un archivo de audio válido (.mp3, .wav, etc.)');
      return;
    }

    setAudioFile(file);
    const objectUrl = URL.createObjectURL(file);
    setAudioPreviewUrl(objectUrl);

    // Auto-fill title from filename if empty
    if (!title) {
      const cleanTitle = file.name
        .replace(/\.[^/.]+$/, '')
        .replace(/[_-]/g, ' ')
        .replace(/^\d+[\s.]*/, '')
        .trim();
      setTitle(cleanTitle.charAt(0).toUpperCase() + cleanTitle.slice(1));
    }
  };

  const handleCoverFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrorMessage('Por favor seleccioná una imagen válida para la portada (.jpg, .png, etc.)');
      return;
    }

    setCoverFile(file);
    const objectUrl = URL.createObjectURL(file);
    setCoverPreviewUrl(objectUrl);
  };

  const handleMusicSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setErrorMessage('Ingresá el título de la canción');
      return;
    }

    setIsProcessingMusic(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    const formData = new FormData();
    formData.append('title', title.trim());
    formData.append('artist', artist.trim() || siteContent?.bandName || 'Despojados');
    formData.append('album', album.trim() || siteContent?.bandName || 'Despojados');
    formData.append('side', side);
    formData.append('speed', speed);
    formData.append('format', format);
    formData.append('venueOrStudio', venueOrStudio);
    formData.append('recordingNotes', recordingNotes);
    formData.append('year', year);
    formData.append('chords', chordsInput);

    if (audioFile) {
      formData.append('audio', audioFile);
    }
    if (coverFile) {
      formData.append('cover', coverFile);
    }

    const result = await uploadTrackToServer(formData);
    setIsProcessingMusic(false);

    if (result.success && result.track) {
      onTrackAdded(result.track);
      setSuccessMessage(`¡"${result.track.title}" se subió y publicó exitosamente en el tocadiscos!`);
      // Reset form
      setTitle('');
      setAudioFile(null);
      setCoverFile(null);
      setCoverPreviewUrl(null);
      setAudioPreviewUrl(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
      if (coverInputRef.current) coverInputRef.current.value = '';
    } else {
      setErrorMessage(result.error || 'Error al subir la canción');
    }
  };

  const handleDeleteTrack = async (trackId: string, trackTitle: string) => {
    if (!window.confirm(`¿Estás seguro de que querés eliminar la canción "${trackTitle}"?`)) {
      return;
    }

    const res = await deleteTrackFromServer(trackId);
    if (res.success) {
      onTrackDeleted(trackId);
      setSuccessMessage(`Pista "${trackTitle}" eliminada del catálogo.`);
      setTimeout(() => setSuccessMessage(null), 3000);
    } else {
      setErrorMessage(res.error || 'Error al eliminar pista');
    }
  };

  // ==========================================
  // TAB 2 HANDLERS (POSTS)
  // ==========================================
  const handlePostImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrorMessage('Por favor seleccioná un archivo de imagen (.jpg, .png, etc.)');
      return;
    }

    setPostImageFile(file);
    const objectUrl = URL.createObjectURL(file);
    setPostImagePreview(objectUrl);
  };

  const handleEditPost = (post: Post) => {
    setEditingPostId(post.id);
    setPostTitle(post.title);
    setPostCategory(post.category);
    setPostDate(post.date);
    setPostContent(post.content);
    setPostImageUrl(post.imageUrl || '');
    setPostImagePreview(post.imageUrl || null);
    setPostImageFile(null);
    window.scrollTo({ top: 300, behavior: 'smooth' });
  };

  const handleCancelEditPost = () => {
    setEditingPostId(null);
    setPostTitle('');
    setPostCategory('Novedad');
    setPostDate(new Date().toLocaleDateString('es-AR', { day: 'numeric', month: 'long', year: 'numeric' }));
    setPostContent('');
    setPostImageUrl('');
    setPostImagePreview(null);
    setPostImageFile(null);
    if (postImageInputRef.current) postImageInputRef.current.value = '';
  };

  const handlePostSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!postTitle.trim() || !postContent.trim()) {
      setErrorMessage('El título y el contenido son obligatorios para publicar.');
      return;
    }

    setIsProcessingPost(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    const formData = new FormData();
    formData.append('title', postTitle.trim());
    formData.append('category', postCategory.trim());
    formData.append('date', postDate.trim());
    formData.append('content', postContent.trim());
    if (postImageUrl && !postImageFile) {
      formData.append('imageUrl', postImageUrl.trim());
    }
    if (postImageFile) {
      formData.append('image', postImageFile);
    }

    const res = await savePost(formData, editingPostId || undefined);
    setIsProcessingPost(false);

    if (res.success && res.post) {
      if (editingPostId) {
        onPostUpdated?.(res.post);
        setSuccessMessage('¡Publicación actualizada correctamente!');
      } else {
        onPostAdded?.(res.post);
        setSuccessMessage('¡Publicación creada y visible para todos los visitantes!');
      }
      handleCancelEditPost();
      setTimeout(() => setSuccessMessage(null), 4000);
    } else {
      setErrorMessage(res.error || 'Error al guardar publicación');
    }
  };

  const handleDeletePost = async (postId: string, postTitleStr: string) => {
    if (!window.confirm(`¿Estás seguro de que querés eliminar la publicación "${postTitleStr}"?`)) {
      return;
    }

    const res = await deletePost(postId);
    if (res.success) {
      onPostDeleted?.(postId);
      setSuccessMessage('Publicación eliminada.');
      setTimeout(() => setSuccessMessage(null), 3000);
    } else {
      setErrorMessage(res.error || 'Error al eliminar publicación');
    }
  };

  // ==========================================
  // TAB 3 HANDLERS (CONTENT)
  // ==========================================
  const handleContentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessingContent(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    const res = await saveSiteContent(contentForm);
    setIsProcessingContent(false);

    if (res.success && res.content) {
      onSiteContentUpdated?.(res.content);
      setSuccessMessage('¡Todos los textos y títulos de la página fueron guardados y actualizados!');
      setTimeout(() => setSuccessMessage(null), 4000);
    } else {
      setErrorMessage(res.error || 'Error al guardar textos');
    }
  };

  // ==========================================
  // LOGIN SCREEN (IF NOT AUTHENTICATED)
  // ==========================================
  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto my-12 bg-[#f5efe4] paper-kraft border-4 border-[#181816] shadow-[8px_8px_0px_#181816] p-6 sm:p-8 relative">
        {/* Masking tape on top */}
        <div className="absolute -top-3.5 left-10 bg-[#eedfa8] text-[#181816] px-4 py-0.5 border border-[#181816]/40 font-fanzine text-[10px] uppercase font-bold rotate-[-2deg] shadow-xs">
          ★ ACCESO EXCLUSIVO // COLECTIVO
        </div>

        <div className="flex items-center gap-3 mb-6 pb-4 border-b-2 border-[#181816]">
          <div className="w-12 h-12 bg-[#b91c1c] border-2 border-[#181816] flex items-center justify-center text-[#facc15] shadow-[2px_2px_0px_#181816]">
            <Lock className="w-6 h-6" />
          </div>
          <div>
            <span className="stamp-red text-[10px] px-2 py-0.2 font-bold inline-block mb-0.5">
              SALA DE EDICIÓN
            </span>
            <h2 className="font-poster text-3xl uppercase font-black text-[#181816] leading-none">
              Taller de Administración
            </h2>
            <p className="font-fanzine text-xs uppercase font-bold text-[#b91c1c]">
              Gestión Comunitaria // {contentForm.bandName.toUpperCase()}
            </p>
          </div>
        </div>

        <p className="font-fanzine text-xs text-[#2e261f] mb-4 leading-relaxed font-bold">
          Ingresá con tu clave para subir canciones a la bandeja, publicar crónicas con tus fotos propias y cambiar los textos y títulos de la página.
        </p>

        {authError && (
          <div className="mb-4 p-3 bg-red-100 border-2 border-[#b91c1c] text-red-900 font-fanzine text-xs font-bold flex items-center gap-2 shadow-[2px_2px_0px_#181816]">
            <AlertCircle className="w-4 h-4 shrink-0 text-[#b91c1c]" />
            <span>{authError}</span>
          </div>
        )}

        <form onSubmit={handleLoginSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block font-fanzine text-xs uppercase font-bold text-[#181816] mb-1">
              Clave de Acceso al Taller
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder="Ingresá la contraseña..."
                className="w-full bg-[#ece4d4] border-2 border-[#181816] px-3 py-2.5 font-mono text-sm text-[#181816] focus:bg-white focus:outline-none pr-10 shadow-[2px_2px_0px_#181816]"
                autoFocus
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2.5 top-2.5 text-[#58423d] hover:text-[#181816]"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            <p className="text-[11px] font-fanzine text-[#605447] mt-1 font-bold">
              Tip: Podés ingresar con <code className="bg-[#e2d8c5] px-1 py-0.5 font-mono text-[#181816] border border-black/20">despojados</code> o <code className="bg-[#e2d8c5] px-1 py-0.5 font-mono text-[#181816] border border-black/20">diagonal_master_2024</code>.
            </p>
          </div>

          <div className="flex items-center gap-2 mt-2">
            <button
              type="submit"
              disabled={isLoggingIn}
              className="flex-1 bg-[#b91c1c] hover:bg-[#991b1b] text-[#facc15] font-poster text-lg uppercase font-bold py-2.5 border-2 border-[#181816] shadow-[3px_3px_0px_#181816] active:translate-x-[1px] active:translate-y-[1px] flex items-center justify-center gap-2 cursor-pointer transition-all disabled:opacity-50"
            >
              <KeyRound className="w-4 h-4 text-[#facc15]" />
              <span>{isLoggingIn ? 'Verificando...' : 'Entrar al Taller'}</span>
            </button>

            <button
              type="button"
              onClick={onBackToTurntable}
              className="bg-[#e2d8c5] hover:bg-[#d5cbb8] text-[#181816] font-poster text-lg uppercase font-bold px-4 py-2.5 border-2 border-[#181816] shadow-[2px_2px_0px_#181816] cursor-pointer"
            >
              Volver
            </button>
          </div>
        </form>
      </div>
    );
  }

  // ==========================================
  // AUTHENTICATED ADMIN PANEL
  // ==========================================
  return (
    <div className="bg-[#f5efe4] paper-kraft border-4 border-[#181816] shadow-[8px_8px_0px_#181816] p-4 sm:p-8 flex flex-col gap-6">
      {/* Top Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b-4 border-[#181816]">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-[#b91c1c] border-2 border-[#181816] shadow-[3px_3px_0px_#181816] flex items-center justify-center text-[#facc15]">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="stamp-red text-[10px] px-2 py-0.5 font-bold uppercase">
                TALLER HABILITADO
              </span>
              <span className="font-fanzine text-xs text-[#181816] uppercase font-bold">
                • {contentForm.bandName.toUpperCase()}
              </span>
            </div>
            <h1 className="font-poster text-3xl sm:text-4xl uppercase font-black tracking-tight text-[#181816] leading-none">
              MESA DE CONTROL &amp; EDICIÓN COLECTIVA
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onBackToTurntable}
            className="bg-[#181816] hover:bg-[#b91c1c] text-[#facc15] hover:text-white font-poster text-base uppercase font-bold px-4 py-2 border-2 border-[#181816] shadow-[2px_2px_0px_#181816] flex items-center gap-1.5 cursor-pointer transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Ver Sitio Público</span>
          </button>

          <button
            type="button"
            onClick={handleLogout}
            className="bg-[#e2d8c5] hover:bg-[#d5cbb8] text-[#b91c1c] font-poster text-base uppercase font-bold px-3 py-2 border-2 border-[#181816] shadow-[2px_2px_0px_#181816] cursor-pointer"
          >
            Salir
          </button>
        </div>
      </div>

      {/* Global Notifications */}
      {successMessage && (
        <div className="p-3.5 bg-emerald-100 border-2 border-[#181816] text-emerald-950 font-fanzine text-xs sm:text-sm font-bold flex items-center gap-2 shadow-[3px_3px_0px_#181816] animate-fadeIn">
          <CheckCircle2 className="w-5 h-5 text-emerald-800 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {errorMessage && (
        <div className="p-3.5 bg-red-100 border-2 border-[#b91c1c] text-red-950 font-fanzine text-xs sm:text-sm font-bold flex items-center gap-2 shadow-[3px_3px_0px_#181816] animate-fadeIn">
          <AlertCircle className="w-5 h-5 text-[#b91c1c] shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Main Tabs Navigation */}
      <div className="flex flex-wrap gap-2 border-b-2 border-[#181816] pb-2 font-poster text-lg uppercase font-bold">
        <button
          type="button"
          onClick={() => setActiveTab('music')}
          className={`px-4 py-2 border-2 border-[#181816] shadow-[2px_2px_0px_#181816] cursor-pointer flex items-center gap-2 transition-all ${
            activeTab === 'music'
              ? 'bg-[#181816] text-[#facc15]'
              : 'bg-[#e2d8c5] text-[#181816] hover:bg-[#f6efe2]'
          }`}
        >
          <Disc className="w-4 h-4 text-[#facc15]" />
          <span>1. Subir Música ({tracks.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('posts')}
          className={`px-4 py-2 border-2 border-[#181816] shadow-[2px_2px_0px_#181816] cursor-pointer flex items-center gap-2 transition-all ${
            activeTab === 'posts'
              ? 'bg-[#181816] text-[#facc15]'
              : 'bg-[#e2d8c5] text-[#181816] hover:bg-[#f6efe2]'
          }`}
        >
          <Newspaper className="w-4 h-4 text-[#b91c1c]" />
          <span>2. Publicaciones &amp; Crónicas ({posts.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('content')}
          className={`px-4 py-2 border-2 border-[#181816] shadow-[2px_2px_0px_#181816] cursor-pointer flex items-center gap-2 transition-all ${
            activeTab === 'content'
              ? 'bg-[#181816] text-[#facc15]'
              : 'bg-[#e2d8c5] text-[#181816] hover:bg-[#f6efe2]'
          }`}
        >
          <Type className="w-4 h-4" />
          <span>3. Textos y Títulos de la Página</span>
        </button>
      </div>

      {/* ============================================================== */}
      {/* TAB 1: SUBIR Y GESTIONAR MÚSICA                                 */}
      {/* ============================================================== */}
      {activeTab === 'music' && (
        <div className="flex flex-col gap-6">
          {/* Explanation Banner: How to upload music & Database answer */}
          <div className="p-5 bg-[#fff8e7] border-3 border-[#181816] shadow-[4px_4px_0px_#181816] relative flex flex-col md:flex-row items-start gap-4">
            <div className="absolute -top-3 right-6 bg-[#eedfa8] text-[#181816] px-3 py-0.5 border border-black/40 font-fanzine text-[11px] font-bold rotate-[1.5deg] shadow-xs">
              GUÍA DE CARGA &amp; ALMACENAMIENTO
            </div>

            <div className="p-2.5 bg-[#b91c1c] text-[#facc15] border-2 border-[#181816] shrink-0 shadow-[2px_2px_0px_#181816]">
              <HelpCircle className="w-7 h-7" />
            </div>
            <div className="flex flex-col gap-2 font-fanzine text-xs sm:text-sm text-[#181816]">
              <h3 className="font-poster text-2xl uppercase font-black text-[#181816] leading-none">
                ¿Cómo subir tu música y qué pasa con la base de datos?
              </h3>
              <p className="leading-relaxed font-bold">
                <span className="text-[#b91c1c] uppercase font-black">1. NO NECESITÁS CONFIGURAR NINGUNA BASE DE DATOS:</span> La página ya funciona con su propio sistema de archivo permanente y servidor de almacenamiento local en disco. Cada archivo MP3 o WAV y cada foto que subas queda guardada automáticamente para siempre y lista para sonar en la bandeja tocadiscos de cualquier visitante.
              </p>
              <p className="leading-relaxed font-bold">
                <span className="text-[#b91c1c] uppercase font-black">2. PASOS SIMPLES PARA SUBIR UN TEMA:</span>
              </p>
              <ul className="list-disc pl-5 space-y-1 font-bold">
                <li>Hacé clic en <strong>"Seleccionar archivo de audio"</strong> y elegí la canción desde tu computadora o celular (.mp3 o .wav).</li>
                <li>Escribí el <strong>Título del tema</strong>, y si querés agregá el álbum o año.</li>
                <li>Elegí si va en el <strong>LADO A</strong> o <strong>LADO B</strong> del vinilo.</li>
                <li>Hacé clic en el botón rojo <strong>"GRABAR Y PUBLICAR EN LA BANDEJA"</strong>. ¡Se sube al instante y ya lo podés hacer girar!</li>
              </ul>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Form Column */}
            <div className="lg:col-span-6 bg-[#ece4d4] paper-kraft p-5 sm:p-6 border-3 border-[#181816] shadow-[6px_6px_0px_#181816] relative">
              <div className="flex items-center gap-2 pb-3 mb-4 border-b-2 border-[#181816]">
                <UploadCloud className="w-6 h-6 text-[#b91c1c]" />
                <h2 className="font-poster text-2xl sm:text-3xl uppercase font-black text-[#181816] leading-none">
                  Subir Nueva Canción
                </h2>
              </div>

              <form onSubmit={handleMusicSubmit} className="flex flex-col gap-4 font-fanzine text-xs">
                {/* Audio File Input */}
                <div>
                  <label className="block uppercase font-bold text-[#181816] mb-1">
                    Archivo de Audio (.mp3, .wav) *
                  </label>
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="audio/*,.mp3,.wav,.ogg,.m4a"
                    onChange={handleAudioFileChange}
                    className="w-full bg-[#fbf8f2] border-2 border-[#181816] p-2 text-xs font-mono file:mr-3 file:py-1 file:px-3 file:border-2 file:border-[#181816] file:bg-[#b91c1c] file:text-[#facc15] file:font-poster file:uppercase file:font-bold file:cursor-pointer shadow-[2px_2px_0px_#181816]"
                  />
                  {audioFile && (
                    <div className="mt-1 text-[11px] text-emerald-900 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                      <span>{audioFile.name} ({(audioFile.size / (1024 * 1024)).toFixed(2)} MB)</span>
                    </div>
                  )}
                </div>

                {/* Track Title */}
                <div>
                  <label className="block uppercase font-bold text-[#181816] mb-1">
                    Título de la Canción *
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Ej: Fuego en la Diagonal"
                    className="w-full bg-[#fbf8f2] border-2 border-[#181816] p-2 font-fanzine text-sm font-bold text-[#181816] focus:bg-white focus:outline-none shadow-[2px_2px_0px_#181816]"
                    required
                  />
                </div>

                {/* Artist & Album */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block uppercase font-bold text-[#181816] mb-1">
                      Intérprete / Banda
                    </label>
                    <input
                      type="text"
                      value={artist}
                      onChange={(e) => setArtist(e.target.value)}
                      placeholder="Despojados"
                      className="w-full bg-[#fbf8f2] border-2 border-[#181816] p-2 text-xs text-[#181816] font-bold shadow-[2px_2px_0px_#181816]"
                    />
                  </div>

                  <div>
                    <label className="block uppercase font-bold text-[#181816] mb-1">
                      Disco / Registro
                    </label>
                    <input
                      type="text"
                      value={album}
                      onChange={(e) => setAlbum(e.target.value)}
                      placeholder="Despojados"
                      className="w-full bg-[#fbf8f2] border-2 border-[#181816] p-2 text-xs text-[#181816] font-bold shadow-[2px_2px_0px_#181816]"
                    />
                  </div>
                </div>

                {/* Side & Speed */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block uppercase font-bold text-[#181816] mb-1">
                      Lado del Disco
                    </label>
                    <select
                      value={side}
                      onChange={(e) => setSide(e.target.value as 'LADO A' | 'LADO B')}
                      className="w-full bg-[#fbf8f2] border-2 border-[#181816] p-2 text-xs font-bold text-[#181816] shadow-[2px_2px_0px_#181816]"
                    >
                      <option value="LADO A">LADO A (Primeros surcos)</option>
                      <option value="LADO B">LADO B (Segunda cara)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block uppercase font-bold text-[#181816] mb-1">
                      Velocidad
                    </label>
                    <select
                      value={speed}
                      onChange={(e) => setSpeed(e.target.value as '33 RPM' | '45 RPM')}
                      className="w-full bg-[#fbf8f2] border-2 border-[#181816] p-2 text-xs font-bold text-[#181816] shadow-[2px_2px_0px_#181816]"
                    >
                      <option value="33 RPM">33 RPM (Estándar LP)</option>
                      <option value="45 RPM">45 RPM (Sencillo)</option>
                    </select>
                  </div>
                </div>

                {/* Format & Year */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block uppercase font-bold text-[#181816] mb-1">
                      Formato
                    </label>
                    <input
                      type="text"
                      value={format}
                      onChange={(e) => setFormat(e.target.value)}
                      placeholder="VINILO 180g"
                      className="w-full bg-[#fbf8f2] border-2 border-[#181816] p-2 text-xs text-[#181816] font-bold shadow-[2px_2px_0px_#181816]"
                    />
                  </div>

                  <div>
                    <label className="block uppercase font-bold text-[#181816] mb-1">
                      Año
                    </label>
                    <input
                      type="text"
                      value={year}
                      onChange={(e) => setYear(e.target.value)}
                      placeholder="2024"
                      className="w-full bg-[#fbf8f2] border-2 border-[#181816] p-2 text-xs text-[#181816] font-bold shadow-[2px_2px_0px_#181816]"
                    />
                  </div>
                </div>

                {/* Cover Image File */}
                <div>
                  <label className="block uppercase font-bold text-[#181816] mb-1">
                    Imagen de Portada (Opcional)
                  </label>
                  <input
                    type="file"
                    ref={coverInputRef}
                    accept="image/*"
                    onChange={handleCoverFileChange}
                    className="w-full bg-[#fbf8f2] border-2 border-[#181816] p-2 text-xs font-mono file:mr-3 file:py-1 file:px-3 file:border-2 file:border-[#181816] file:bg-[#181816] file:text-[#facc15] file:font-poster file:uppercase file:font-bold file:cursor-pointer shadow-[2px_2px_0px_#181816]"
                  />
                  {coverPreviewUrl && (
                    <div className="mt-2 w-20 h-20 border-2 border-[#181816] overflow-hidden shadow-[2px_2px_0px_#181816]">
                      <img src={coverPreviewUrl} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>

                {/* Notes & Venue */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block uppercase font-bold text-[#181816] mb-1">
                      Lugar o Estudio
                    </label>
                    <input
                      type="text"
                      value={venueOrStudio}
                      onChange={(e) => setVenueOrStudio(e.target.value)}
                      placeholder="LA PLATA // MÁSTER DIRECTO"
                      className="w-full bg-[#fbf8f2] border-2 border-[#181816] p-2 text-xs text-[#181816] font-bold shadow-[2px_2px_0px_#181816]"
                    />
                  </div>

                  <div>
                    <label className="block uppercase font-bold text-[#181816] mb-1">
                      Notas de Grabación
                    </label>
                    <input
                      type="text"
                      value={recordingNotes}
                      onChange={(e) => setRecordingNotes(e.target.value)}
                      placeholder="CANCIÓN DE ESTUDIO"
                      className="w-full bg-[#fbf8f2] border-2 border-[#181816] p-2 text-xs text-[#181816] font-bold shadow-[2px_2px_0px_#181816]"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isProcessingMusic}
                  className="mt-2 bg-[#b91c1c] hover:bg-[#991b1b] text-[#facc15] font-poster text-xl uppercase font-bold py-3 border-2 border-[#181816] shadow-[4px_4px_0px_#181816] active:translate-x-[1px] active:translate-y-[1px] flex items-center justify-center gap-2 cursor-pointer transition-all disabled:opacity-50"
                >
                  <UploadCloud className="w-5 h-5 text-[#facc15]" />
                  <span>{isProcessingMusic ? 'Subiendo y procesando audio...' : 'GRABAR Y PUBLICAR EN LA BANDEJA'}</span>
                </button>
              </form>
            </div>

            {/* Existing Tracks List */}
            <div className="lg:col-span-6 bg-[#ece4d4] paper-kraft p-5 sm:p-6 border-3 border-[#181816] shadow-[6px_6px_0px_#181816]">
              <div className="flex items-center justify-between pb-3 mb-4 border-b-2 border-[#181816]">
                <div className="flex items-center gap-2">
                  <Disc className="w-6 h-6 text-[#b91c1c]" />
                  <h2 className="font-poster text-2xl sm:text-3xl uppercase font-black text-[#181816] leading-none">
                    Canciones en el Catálogo ({tracks.length})
                  </h2>
                </div>
              </div>

              <div className="flex flex-col gap-3 max-h-[600px] overflow-y-auto pr-1">
                {tracks.map((track) => (
                  <div
                    key={track.id}
                    className="p-3 bg-[#fbf8f2] border-2 border-[#181816] shadow-[3px_3px_0px_#181816] flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3 overflow-hidden">
                      <div className="w-12 h-12 shrink-0 border border-[#181816] bg-[#181816] overflow-hidden">
                        {track.coverUrl ? (
                          <img src={track.coverUrl} alt={track.title} className="w-full h-full object-cover" />
                        ) : (
                          <Disc className="w-full h-full text-[#facc15] p-2" />
                        )}
                      </div>

                      <div className="overflow-hidden font-fanzine">
                        <div className="flex items-center gap-1.5">
                          <span className="font-poster text-xs bg-[#b91c1c] text-[#facc15] px-1.5 py-0.2 font-bold uppercase">
                            {track.side}
                          </span>
                          <span className="text-[11px] text-[#181816] font-bold">
                            {track.speed}
                          </span>
                          {track.hasCustomAudio && (
                            <span className="text-[10px] bg-emerald-800 text-white px-1.5 py-0.2 font-bold">
                              AUDIO SUBIDO
                            </span>
                          )}
                        </div>
                        <h4 className="font-poster text-lg uppercase font-bold text-[#181816] truncate leading-tight mt-0.5">
                          {track.title}
                        </h4>
                        <span className="text-[11px] text-[#58423d] truncate block font-bold">
                          {track.artist} // {track.album} ({track.duration})
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        type="button"
                        onClick={() => onLoadTrackToTurntable(track)}
                        title="Cargar y escuchar en el tocadiscos"
                        className="p-2.5 bg-[#181816] hover:bg-[#b91c1c] text-[#facc15] border border-[#181816] shadow-[1px_1px_0px_#000] cursor-pointer"
                      >
                        <Play className="w-4 h-4 fill-[#facc15]" />
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDeleteTrack(track.id, track.title)}
                        title="Eliminar canción"
                        className="p-2.5 bg-[#fbf8f2] hover:bg-red-700 hover:text-white text-red-700 border border-[#181816] shadow-[1px_1px_0px_#000] cursor-pointer transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 2: PUBLICACIONES Y NOTICIAS                                 */}
      {/* ============================================================== */}
      {activeTab === 'posts' && (
        <div className="flex flex-col gap-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Create/Edit Post Form */}
            <div className="lg:col-span-6 bg-[#ece4d4] paper-kraft p-5 sm:p-6 border-3 border-[#181816] shadow-[6px_6px_0px_#181816] relative">
              <div className="flex items-center justify-between pb-3 mb-4 border-b-2 border-[#181816]">
                <div className="flex items-center gap-2">
                  <Newspaper className="w-6 h-6 text-[#b91c1c]" />
                  <h2 className="font-poster text-2xl sm:text-3xl uppercase font-black text-[#181816] leading-none">
                    {editingPostId ? 'Editar Publicación' : 'Nueva Publicación / Noticia'}
                  </h2>
                </div>
                {editingPostId && (
                  <button
                    type="button"
                    onClick={handleCancelEditPost}
                    className="text-xs font-fanzine text-[#b91c1c] underline font-bold cursor-pointer"
                  >
                    Cancelar edición
                  </button>
                )}
              </div>

              <form onSubmit={handlePostSubmit} className="flex flex-col gap-4 font-fanzine text-xs">
                {/* Title */}
                <div>
                  <label className="block uppercase font-bold text-[#181816] mb-1">
                    Título de la Publicación *
                  </label>
                  <input
                    type="text"
                    value={postTitle}
                    onChange={(e) => setPostTitle(e.target.value)}
                    placeholder="Ej: Nuevo show en vivo este viernes en el galpón..."
                    className="w-full bg-[#fbf8f2] border-2 border-[#181816] p-2 font-fanzine text-sm font-bold text-[#181816] focus:bg-white focus:outline-none shadow-[2px_2px_0px_#181816]"
                    required
                  />
                </div>

                {/* Category & Date */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block uppercase font-bold text-[#181816] mb-1">
                      Categoría
                    </label>
                    <select
                      value={postCategory}
                      onChange={(e) => setPostCategory(e.target.value)}
                      className="w-full bg-[#fbf8f2] border-2 border-[#181816] p-2 text-xs font-bold text-[#181816] shadow-[2px_2px_0px_#181816]"
                    >
                      <option value="Novedad">Novedad</option>
                      <option value="Lanzamiento">Lanzamiento</option>
                      <option value="Próximo Show">Próximo Show / Concierto</option>
                      <option value="Ensayo">Ensayo en Galpón</option>
                      <option value="Reflexión">Reflexión / Letras</option>
                    </select>
                  </div>

                  <div>
                    <label className="block uppercase font-bold text-[#181816] mb-1">
                      Fecha
                    </label>
                    <input
                      type="text"
                      value={postDate}
                      onChange={(e) => setPostDate(e.target.value)}
                      placeholder="Ej: 20 de Octubre, 2024"
                      className="w-full bg-[#fbf8f2] border-2 border-[#181816] p-2 text-xs text-[#181816] font-bold shadow-[2px_2px_0px_#181816]"
                    />
                  </div>
                </div>

                {/* Post Content */}
                <div>
                  <label className="block uppercase font-bold text-[#181816] mb-1">
                    Cuerpo del Texto / Comunicado *
                  </label>
                  <textarea
                    value={postContent}
                    onChange={(e) => setPostContent(e.target.value)}
                    rows={6}
                    placeholder="Escribí aquí las novedades, fecha y hora del recital, anécdotas de grabación, coordenadas del galpón..."
                    className="w-full bg-[#fbf8f2] border-2 border-[#181816] p-2.5 font-fanzine text-sm text-[#181816] focus:bg-white focus:outline-none leading-relaxed shadow-[2px_2px_0px_#181816]"
                    required
                  />
                </div>

                {/* Custom Image Upload for Post */}
                <div className="p-3.5 bg-[#fbf8f2] border-2 border-[#181816] shadow-[3px_3px_0px_#181816] flex flex-col gap-2">
                  <div className="flex items-center gap-1.5 font-poster text-lg text-[#181816] uppercase">
                    <ImageIcon className="w-5 h-5 text-[#b91c1c]" />
                    <span>Foto Propia de la Publicación (Opcional)</span>
                  </div>
                  <p className="text-[11px] text-[#2e261f] font-bold">
                    Podés seleccionar una foto de tu celular o computadora para que aparezca como afiche en la publicación.
                  </p>

                  <input
                    type="file"
                    ref={postImageInputRef}
                    accept="image/*"
                    onChange={handlePostImageChange}
                    className="w-full bg-white border-2 border-[#181816] p-1.5 text-xs font-mono file:mr-2 file:py-1 file:px-2.5 file:border-2 file:border-[#181816] file:bg-[#b91c1c] file:text-[#facc15] file:font-poster file:uppercase file:font-bold file:cursor-pointer shadow-[2px_2px_0px_#181816]"
                  />

                  {postImagePreview && (
                    <div className="relative mt-2 border-2 border-[#181816] h-40 w-full overflow-hidden shadow-[2px_2px_0px_#181816]">
                      <img
                        src={postImagePreview}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setPostImagePreview(null);
                          setPostImageFile(null);
                          setPostImageUrl('');
                          if (postImageInputRef.current) postImageInputRef.current.value = '';
                        }}
                        className="absolute top-2 right-2 bg-[#b91c1c] text-[#facc15] px-2.5 py-1 text-xs font-poster font-bold uppercase border-2 border-[#181816] shadow-sm cursor-pointer"
                      >
                        Quitar Foto
                      </button>
                    </div>
                  )}

                  {/* Optional Image URL */}
                  <div className="mt-1">
                    <label className="block text-[11px] uppercase font-bold text-[#605447] mb-0.5">
                      O ingresar enlace directo de imagen (URL pública):
                    </label>
                    <input
                      type="url"
                      value={postImageUrl}
                      onChange={(e) => {
                        setPostImageUrl(e.target.value);
                        if (e.target.value) setPostImagePreview(e.target.value);
                      }}
                      placeholder="https://ejemplo.com/afiche.jpg"
                      className="w-full bg-white border border-[#181816] p-1.5 text-xs text-[#181816] shadow-xs"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isProcessingPost}
                  className="bg-[#b91c1c] hover:bg-[#991b1b] text-[#facc15] font-poster text-xl uppercase font-bold py-3 border-2 border-[#181816] shadow-[4px_4px_0px_#181816] active:translate-x-[1px] active:translate-y-[1px] flex items-center justify-center gap-2 cursor-pointer transition-all disabled:opacity-50"
                >
                  <Save className="w-5 h-5 text-[#facc15]" />
                  <span>
                    {isProcessingPost
                      ? 'Guardando publicación...'
                      : editingPostId
                      ? 'Actualizar Afiche'
                      : 'Pegar en Cartelera'}
                  </span>
                </button>
              </form>
            </div>

            {/* Existing Posts List */}
            <div className="lg:col-span-6 bg-[#ece4d4] paper-kraft p-5 sm:p-6 border-3 border-[#181816] shadow-[6px_6px_0px_#181816]">
              <div className="flex items-center justify-between pb-3 mb-4 border-b-2 border-[#181816]">
                <div className="flex items-center gap-2">
                  <Newspaper className="w-6 h-6 text-[#b91c1c]" />
                  <h2 className="font-poster text-2xl sm:text-3xl uppercase font-black text-[#181816] leading-none">
                    Publicaciones Activas ({posts.length})
                  </h2>
                </div>
              </div>

              {posts.length === 0 ? (
                <div className="p-6 text-center bg-[#fbf8f2] border-2 border-[#181816]">
                  <p className="font-fanzine text-xs text-[#58423d] font-bold">
                    Todavía no creaste ninguna publicación. Completá el formulario de la izquierda para publicar tu primer anuncio o crónica.
                  </p>
                </div>
              ) : (
                <div className="flex flex-col gap-3 max-h-[600px] overflow-y-auto pr-1">
                  {posts.map((post) => (
                    <div
                      key={post.id}
                      className="p-3 bg-[#fbf8f2] border-2 border-[#181816] shadow-[3px_3px_0px_#181816] flex items-start justify-between gap-3"
                    >
                      <div className="flex items-start gap-3 overflow-hidden">
                        {post.imageUrl ? (
                          <img
                            src={post.imageUrl}
                            alt={post.title}
                            className="w-16 h-16 object-cover border-2 border-[#181816] shrink-0 shadow-sm"
                          />
                        ) : (
                          <div className="w-16 h-16 bg-[#e2d8c5] border-2 border-[#181816] flex items-center justify-center shrink-0">
                            <Newspaper className="w-6 h-6 text-[#181816]" />
                          </div>
                        )}

                        <div className="overflow-hidden">
                          <div className="flex items-center gap-2 font-fanzine">
                            <span className="bg-[#b91c1c] text-[#facc15] font-poster text-xs uppercase font-bold px-1.5 py-0.2">
                              {post.category}
                            </span>
                            <span className="text-[11px] text-[#181816] font-bold">
                              {post.date}
                            </span>
                          </div>
                          <h4 className="font-poster text-lg uppercase font-bold text-[#181816] truncate mt-0.5 leading-tight">
                            {post.title}
                          </h4>
                          <p className="font-fanzine text-xs text-[#2e261f] line-clamp-2 mt-0.5 font-bold">
                            {post.content}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          type="button"
                          onClick={() => handleEditPost(post)}
                          title="Editar publicación"
                          className="p-2.5 bg-[#fbf8f2] hover:bg-[#181816] hover:text-[#facc15] text-[#181816] border border-[#181816] shadow-xs cursor-pointer transition-colors"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDeletePost(post.id, post.title)}
                          title="Eliminar publicación"
                          className="p-2.5 bg-[#fbf8f2] hover:bg-red-700 hover:text-white text-red-700 border border-[#181816] shadow-xs cursor-pointer transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 3: TEXTOS Y TÍTULOS DE LA PÁGINA                             */}
      {/* ============================================================== */}
      {activeTab === 'content' && (
        <div className="bg-[#ece4d4] paper-kraft p-5 sm:p-8 border-3 border-[#181816] shadow-[6px_6px_0px_#181816]">
          <div className="flex items-center justify-between pb-3 mb-6 border-b-2 border-[#181816]">
            <div>
              <div className="flex items-center gap-2">
                <Type className="w-6 h-6 text-[#b91c1c]" />
                <h2 className="font-poster text-3xl sm:text-4xl uppercase font-black text-[#181816] leading-none">
                  Personalizar Todos los Textos del Sitio
                </h2>
              </div>
              <p className="font-fanzine text-xs text-[#2e261f] font-bold mt-1.5">
                Cambiá los títulos, subtítulos, nombre de la banda y párrafos de la biografía. Todo se actualiza de inmediato para toda la comunidad y visitantes del sitio.
              </p>
            </div>
          </div>

          <form onSubmit={handleContentSubmit} className="flex flex-col gap-6 font-fanzine text-xs">
            {/* Section 1: Band identity */}
            <div className="p-4 sm:p-5 bg-[#fbf8f2] border-2 border-[#181816] shadow-[3px_3px_0px_#181816] flex flex-col gap-4">
              <span className="font-poster text-xl sm:text-2xl uppercase font-black text-[#b91c1c] border-b-2 border-[#181816] pb-1">
                1. Identidad de la Banda y Origen
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block uppercase font-bold text-[#181816] mb-1">
                    Nombre de la Banda *
                  </label>
                  <input
                    type="text"
                    value={contentForm.bandName}
                    onChange={(e) => setContentForm({ ...contentForm, bandName: e.target.value })}
                    className="w-full bg-white border-2 border-[#181816] p-2 font-poster text-base font-black text-[#181816] shadow-[2px_2px_0px_#181816]"
                    required
                  />
                </div>

                <div>
                  <label className="block uppercase font-bold text-[#181816] mb-1">
                    Ciudad / Origen
                  </label>
                  <input
                    type="text"
                    value={contentForm.origin}
                    onChange={(e) => setContentForm({ ...contentForm, origin: e.target.value })}
                    className="w-full bg-white border-2 border-[#181816] p-2 text-xs font-bold text-[#181816] shadow-[2px_2px_0px_#181816]"
                  />
                </div>

                <div>
                  <label className="block uppercase font-bold text-[#181816] mb-1">
                    Notas de Producción
                  </label>
                  <input
                    type="text"
                    value={contentForm.productionNotes}
                    onChange={(e) => setContentForm({ ...contentForm, productionNotes: e.target.value })}
                    className="w-full bg-white border-2 border-[#181816] p-2 text-xs font-bold text-[#181816] shadow-[2px_2px_0px_#181816]"
                  />
                </div>
              </div>
            </div>

            {/* Section 2: Hero Header */}
            <div className="p-4 sm:p-5 bg-[#fbf8f2] border-2 border-[#181816] shadow-[3px_3px_0px_#181816] flex flex-col gap-4">
              <span className="font-poster text-xl sm:text-2xl uppercase font-black text-[#b91c1c] border-b-2 border-[#181816] pb-1">
                2. Portada Principal (Encabezado)
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block uppercase font-bold text-[#181816] mb-1">
                    Distintivo Superior (Badge / Sello)
                  </label>
                  <input
                    type="text"
                    value={contentForm.heroBadge}
                    onChange={(e) => setContentForm({ ...contentForm, heroBadge: e.target.value })}
                    className="w-full bg-white border-2 border-[#181816] p-2 text-xs font-bold text-[#181816] shadow-[2px_2px_0px_#181816]"
                  />
                </div>

                <div>
                  <label className="block uppercase font-bold text-[#181816] mb-1">
                    Título Principal
                  </label>
                  <input
                    type="text"
                    value={contentForm.heroTitle}
                    onChange={(e) => setContentForm({ ...contentForm, heroTitle: e.target.value })}
                    className="w-full bg-white border-2 border-[#181816] p-2 font-poster text-base font-black text-[#181816] shadow-[2px_2px_0px_#181816]"
                  />
                </div>
              </div>

              <div>
                <label className="block uppercase font-bold text-[#181816] mb-1">
                  Subtítulo Destacado
                </label>
                <input
                  type="text"
                  value={contentForm.heroSubtitle}
                  onChange={(e) => setContentForm({ ...contentForm, heroSubtitle: e.target.value })}
                  className="w-full bg-white border-2 border-[#181816] p-2 text-xs font-bold text-[#181816] shadow-[2px_2px_0px_#181816]"
                />
              </div>

              <div>
                <label className="block uppercase font-bold text-[#181816] mb-1">
                  Texto de Bienvenida / Manifiesto
                </label>
                <textarea
                  value={contentForm.heroDescription}
                  onChange={(e) => setContentForm({ ...contentForm, heroDescription: e.target.value })}
                  rows={3}
                  className="w-full bg-white border-2 border-[#181816] p-2 font-fanzine text-xs text-[#181816] font-bold shadow-[2px_2px_0px_#181816] leading-relaxed"
                />
              </div>
            </div>

            {/* Section 3: Biography */}
            <div className="p-4 sm:p-5 bg-[#fbf8f2] border-2 border-[#181816] shadow-[3px_3px_0px_#181816] flex flex-col gap-4">
              <span className="font-poster text-xl sm:text-2xl uppercase font-black text-[#b91c1c] border-b-2 border-[#181816] pb-1">
                3. Sección Biografía y Crónica
              </span>

              <div>
                <label className="block uppercase font-bold text-[#181816] mb-1">
                  Título de la Biografía
                </label>
                <input
                  type="text"
                  value={contentForm.bioTitle}
                  onChange={(e) => setContentForm({ ...contentForm, bioTitle: e.target.value })}
                  className="w-full bg-white border-2 border-[#181816] p-2 font-poster text-base font-black text-[#181816] shadow-[2px_2px_0px_#181816]"
                />
              </div>

              <div>
                <label className="block uppercase font-bold text-[#181816] mb-1">
                  Primer Párrafo de la Biografía
                </label>
                <textarea
                  value={contentForm.bioText1}
                  onChange={(e) => setContentForm({ ...contentForm, bioText1: e.target.value })}
                  rows={3}
                  className="w-full bg-white border-2 border-[#181816] p-2.5 font-fanzine text-xs text-[#181816] leading-relaxed shadow-[2px_2px_0px_#181816] font-bold"
                />
              </div>

              <div>
                <label className="block uppercase font-bold text-[#181816] mb-1">
                  Segundo Párrafo de la Biografía
                </label>
                <textarea
                  value={contentForm.bioText2}
                  onChange={(e) => setContentForm({ ...contentForm, bioText2: e.target.value })}
                  rows={3}
                  className="w-full bg-white border-2 border-[#181816] p-2.5 font-fanzine text-xs text-[#181816] leading-relaxed shadow-[2px_2px_0px_#181816] font-bold"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="submit"
                disabled={isProcessingContent}
                className="bg-[#b91c1c] hover:bg-[#991b1b] text-[#facc15] font-poster text-xl uppercase font-bold px-8 py-3.5 border-2 border-[#181816] shadow-[4px_4px_0px_#181816] active:translate-x-[1px] active:translate-y-[1px] flex items-center gap-2 cursor-pointer transition-all disabled:opacity-50"
              >
                <Save className="w-5 h-5 text-[#facc15]" />
                <span>{isProcessingContent ? 'Guardando cambios...' : 'Guardar Todos los Textos'}</span>
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
