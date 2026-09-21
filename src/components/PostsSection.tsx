import React, { useState } from 'react';
import { Newspaper, Calendar, Tag, ChevronRight, Image as ImageIcon, ExternalLink, Wrench, Megaphone } from 'lucide-react';
import { Post, SiteContent } from '../types';

interface PostsSectionProps {
  posts: Post[];
  siteContent?: SiteContent;
  onOpenAdminPosts?: () => void;
}

export const PostsSection: React.FC<PostsSectionProps> = ({
  posts,
  siteContent,
  onOpenAdminPosts,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('todos');
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);

  const bandName = siteContent?.bandName || 'Despojados';

  // Extract unique categories
  const categories = ['todos', ...Array.from(new Set(posts.map((p) => p.category.toLowerCase())))];

  const filteredPosts =
    selectedCategory === 'todos'
      ? posts
      : posts.filter((p) => p.category.toLowerCase() === selectedCategory);

  return (
    <section
      id="publicaciones"
      className="bg-[#f5efe4] paper-kraft p-6 sm:p-8 shadow-[5px_5px_0px_#181816] relative flex flex-col gap-6 border-2 border-[#181816] scroll-mt-28"
    >
      {/* Top Banner Tag */}
      <div className="absolute -top-3.5 left-6 sm:left-10 bg-[#b91c1c] text-[#facc15] font-poster text-lg uppercase px-4 py-0.5 rotate-[-1deg] shadow-[3px_3px_0px_#181816] font-black border-2 border-[#181816] flex items-center gap-1.5">
        <Megaphone className="w-4 h-4" />
        <span>FANZINE BARRIAL // NOTICIAS &amp; FECHAS DE {bandName.toUpperCase()}</span>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pt-3 border-b-2 border-[#181816] pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="stamp-red text-xs px-2 py-0.5 font-bold">
              COMUNICADO LIBRE
            </span>
            <span className="font-fanzine text-xs text-[#b91c1c] font-bold uppercase">
              ACTUALIZADO POR EL COLECTIVO
            </span>
          </div>
          <h2 className="font-poster text-4xl sm:text-5xl uppercase tracking-tight text-[#181816] font-black leading-none">
            CRÓNICAS, FECHAS &amp; NOVEDADES
          </h2>
          <p className="font-fanzine text-sm sm:text-base text-[#3d3429] max-w-xl font-bold mt-1">
            Seguí el camino de {bandName}: ensayos abiertos, próximas fechas en galpones y plazas, lanzamientos a pulmón y crónicas del colectivo.
          </p>
        </div>

        {onOpenAdminPosts && (
          <button
            type="button"
            onClick={onOpenAdminPosts}
            className="self-start sm:self-auto bg-[#facc15] hover:bg-[#fde047] text-[#181816] font-poster text-lg uppercase px-4 py-1.5 font-bold border-2 border-[#181816] shadow-[2px_2px_0px_#181816] active:translate-x-[1px] active:translate-y-[1px] flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <Wrench className="w-4 h-4" />
            <span>Editar en el Taller</span>
          </button>
        )}
      </div>

      {/* Category Filter Pills */}
      {categories.length > 2 && (
        <div className="flex flex-wrap items-center gap-2 font-fanzine text-xs uppercase font-bold">
          <span className="text-[#181816] mr-1">Filtrar:</span>
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 border-2 border-[#181816] shadow-[2px_2px_0px_#181816] transition-all cursor-pointer font-poster text-base ${
                selectedCategory === cat
                  ? 'bg-[#181816] text-[#facc15]'
                  : 'bg-[#ece3d1] text-[#181816] hover:bg-[#f6efe2]'
              }`}
            >
              {cat === 'todos' ? 'TODAS' : cat.toUpperCase()}
            </button>
          ))}
        </div>
      )}

      {/* Posts Grid */}
      {filteredPosts.length === 0 ? (
        <div className="p-8 text-center bg-[#e8decb] border-2 border-[#181816] shadow-[3px_3px_0px_#181816]">
          <Newspaper className="w-10 h-10 text-[#6d6153] mx-auto mb-2" />
          <h3 className="font-poster text-2xl uppercase font-bold text-[#181816]">
            No hay publicaciones en esta sección
          </h3>
          <p className="font-fanzine text-xs text-[#3d3429] mt-1 font-bold">
            Desde el Taller de Edición podés sumar nuevas crónicas con tus fotos y textos.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPosts.map((post) => (
            <article
              key={post.id}
              className="bg-[#f2ece0] border-2 border-[#181816] shadow-[4px_4px_0px_#181816] flex flex-col justify-between overflow-hidden group hover:translate-y-[-2px] transition-all"
            >
              <div>
                {/* Image frame if present */}
                {post.imageUrl ? (
                  <div className="relative h-48 w-full overflow-hidden border-b-2 border-[#181816] bg-[#181816]">
                    <img
                      src={post.imageUrl}
                      alt={post.title}
                      className="w-full h-full object-cover filter grayscale contrast-125 group-hover:grayscale-0 group-hover:scale-105 transition-all duration-500 opacity-90 group-hover:opacity-100"
                    />
                    <div className="absolute top-2 left-2 bg-[#b91c1c] text-white font-poster text-xs uppercase px-2.5 py-0.5 border border-[#181816] shadow-sm">
                      {post.category}
                    </div>
                  </div>
                ) : (
                  <div className="p-3 bg-[#e8decb] border-b-2 border-[#181816] flex items-center justify-between">
                    <span className="bg-[#b91c1c] text-white font-poster text-sm uppercase px-2 py-0.5 border border-[#181816]">
                      {post.category}
                    </span>
                    <span className="font-fanzine text-xs text-[#181816] flex items-center gap-1 font-bold">
                      <Calendar className="w-3.5 h-3.5 text-[#b91c1c]" />
                      {post.date}
                    </span>
                  </div>
                )}

                {/* Content Container */}
                <div className="p-4 sm:p-5 flex flex-col gap-2">
                  {post.imageUrl && (
                    <div className="flex items-center gap-1 font-fanzine text-xs text-[#b91c1c] font-bold">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{post.date}</span>
                    </div>
                  )}

                  <h3 className="font-poster text-2xl uppercase font-black tracking-tight text-[#181816] group-hover:text-[#b91c1c] transition-colors leading-tight">
                    {post.title}
                  </h3>

                  <p className="font-fanzine text-xs sm:text-sm text-[#2b241c] line-clamp-4 leading-relaxed font-bold">
                    {post.content}
                  </p>
                </div>
              </div>

              {/* Card Footer */}
              <div className="p-4 pt-0">
                <button
                  type="button"
                  onClick={() => setSelectedPost(post)}
                  className="w-full bg-[#181816] hover:bg-[#b91c1c] text-[#facc15] hover:text-white font-poster text-base uppercase font-bold py-2 border-2 border-[#181816] shadow-[2px_2px_0px_#181816] active:translate-x-[1px] active:translate-y-[1px] flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                >
                  <span>Leer Crónica Completa</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </article>
          ))}
        </div>
      )}

      {/* Post Detail Modal */}
      {selectedPost && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-fadeIn">
          <div className="bg-[#f5efe4] paper-kraft border-4 border-[#181816] shadow-[8px_8px_0px_#181816] max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 flex flex-col gap-4 relative">
            <button
              type="button"
              onClick={() => setSelectedPost(null)}
              className="absolute top-4 right-4 bg-[#b91c1c] text-white font-poster text-lg uppercase font-bold w-8 h-8 flex items-center justify-center border-2 border-[#181816] shadow-[2px_2px_0px_#181816] cursor-pointer hover:bg-[#991b1b]"
            >
              ✕
            </button>

            <div className="flex items-center gap-2">
              <span className="stamp-red text-xs px-2.5 py-0.5 font-bold">
                {selectedPost.category}
              </span>
              <span className="font-fanzine text-xs text-[#181816] font-bold flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-[#b91c1c]" />
                {selectedPost.date}
              </span>
            </div>

            <h2 className="font-poster text-3xl sm:text-4xl uppercase font-black tracking-tight text-[#181816] leading-none">
              {selectedPost.title}
            </h2>

            {selectedPost.imageUrl && (
              <div className="border-2 border-[#181816] overflow-hidden shadow-[3px_3px_0px_#181816] max-h-80 bg-[#181816]">
                <img
                  src={selectedPost.imageUrl}
                  alt={selectedPost.title}
                  className="w-full h-full object-cover filter contrast-110"
                />
              </div>
            )}

            <div className="font-fanzine text-sm sm:text-base text-[#181816] whitespace-pre-line leading-relaxed border-t-2 border-[#181816] pt-4 font-bold bg-[#ece4d4]/70 p-4 border-l-4 border-[#b91c1c]">
              {selectedPost.content}
            </div>

            <div className="pt-4 border-t-2 border-[#181816] flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedPost(null)}
                className="bg-[#181816] text-[#facc15] hover:bg-[#b91c1c] hover:text-white font-poster text-lg uppercase font-bold px-6 py-2 border-2 border-[#181816] shadow-[3px_3px_0px_#181816] cursor-pointer"
              >
                Cerrar Crónica
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
