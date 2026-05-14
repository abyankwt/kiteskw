import { useState } from 'react';
import { X, Calendar, Images, ZoomIn } from 'lucide-react';
import { SEO } from '@/components/common/SEO';
import { usePublishedGalleries, useGallery, type Gallery as GalleryType } from '@/hooks/useGallery';

function Lightbox({ urls, startIndex, onClose }: { urls: string[]; startIndex: number; onClose: () => void }) {
  const [current, setCurrent] = useState(startIndex);

  const prev = () => setCurrent(i => (i - 1 + urls.length) % urls.length);
  const next = () => setCurrent(i => (i + 1) % urls.length);

  return (
    <div
      className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center"
      onClick={onClose}
    >
      <button
        onClick={onClose}
        className="absolute top-4 right-4 p-2 text-white hover:text-gray-300 transition-colors"
      >
        <X size={24} />
      </button>
      <button
        onClick={e => { e.stopPropagation(); prev(); }}
        className="absolute left-4 p-3 text-white hover:text-gray-300 text-xl font-light transition-colors"
      >
        &#8249;
      </button>
      <img
        src={urls[current]}
        alt=""
        className="max-h-[85vh] max-w-[85vw] object-contain"
        onClick={e => e.stopPropagation()}
      />
      <button
        onClick={e => { e.stopPropagation(); next(); }}
        className="absolute right-4 p-3 text-white hover:text-gray-300 text-xl font-light transition-colors"
      >
        &#8250;
      </button>
      <p className="absolute bottom-4 text-white/50 text-sm">{current + 1} / {urls.length}</p>
    </div>
  );
}

function AlbumDetail({ gallery, onBack }: { gallery: GalleryType; onBack: () => void }) {
  const { data: detail, isLoading } = useGallery(gallery.id);
  const [lightbox, setLightbox] = useState<{ open: boolean; index: number }>({ open: false, index: 0 });

  const items = detail?.items ?? [];
  const photoUrls = items.map(i => i.url);

  return (
    <>
      <SEO title={`${gallery.title} | Gallery | KITES`} description={gallery.description ?? ''} />

      <section className="bg-gray-900 pt-32 pb-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 text-gray-400 hover:text-white text-sm mb-8 transition-colors"
          >
            &#8592; All Albums
          </button>
          <p className="text-blue-400 text-sm font-semibold uppercase tracking-widest mb-4">Gallery</p>
          <h1 className="text-3xl lg:text-4xl font-bold text-white">{gallery.title}</h1>
          {gallery.eventDate && (
            <div className="flex items-center gap-2 text-gray-400 mt-3 text-sm">
              <Calendar size={14} />
              {new Date(gallery.eventDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })}
            </div>
          )}
          {gallery.description && (
            <p className="text-gray-400 mt-3 max-w-xl">{gallery.description}</p>
          )}
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          {isLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="aspect-square bg-gray-200 animate-pulse" />
              ))}
            </div>
          ) : items.length === 0 ? (
            <div className="text-center py-24 text-gray-400">
              <Images size={40} className="mx-auto mb-4 text-gray-300" />
              <p>No photos in this album yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {items.map((item, idx) => (
                <button
                  key={item.id}
                  onClick={() => setLightbox({ open: true, index: idx })}
                  className="group relative aspect-square overflow-hidden bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <img
                    src={item.url}
                    alt={item.caption ?? ''}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                    <ZoomIn size={24} className="text-white opacity-0 group-hover:opacity-100 transition-opacity drop-shadow" />
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      {lightbox.open && (
        <Lightbox urls={photoUrls} startIndex={lightbox.index} onClose={() => setLightbox({ open: false, index: 0 })} />
      )}
    </>
  );
}

function AlbumCard({ gallery, onClick }: { gallery: GalleryType; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="group text-left bg-white border border-gray-100 hover:border-gray-200 hover:shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
    >
      <div className="aspect-video overflow-hidden bg-gray-100">
        {gallery.coverImageUrl ? (
          <img
            src={gallery.coverImageUrl}
            alt={gallery.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Images size={32} className="text-gray-300" />
          </div>
        )}
      </div>
      <div className="p-5">
        <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">{gallery.title}</h3>
        {gallery.eventDate && (
          <div className="flex items-center gap-1.5 text-gray-400 text-xs mt-1.5">
            <Calendar size={12} />
            {new Date(gallery.eventDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
          </div>
        )}
        {gallery.description && (
          <p className="text-sm text-gray-500 mt-2 line-clamp-2">{gallery.description}</p>
        )}
      </div>
    </button>
  );
}

export default function Gallery() {
  const { data: galleries = [], isLoading } = usePublishedGalleries();
  const [selected, setSelected] = useState<GalleryType | null>(null);

  if (selected) {
    return <AlbumDetail gallery={selected} onBack={() => setSelected(null)} />;
  }

  return (
    <>
      <SEO title="Gallery | KITES" description="Photo galleries from KITES training events and engineering simulations." />

      {/* Hero */}
      <section className="bg-gray-900 pt-32 pb-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <p className="text-blue-400 text-sm font-semibold uppercase tracking-widest mb-4">Gallery</p>
          <h1 className="text-4xl lg:text-5xl font-bold text-white">Event Gallery</h1>
          <p className="text-gray-400 mt-4 max-w-xl text-lg">
            Photos from our training sessions, events, and successful engineering projects.
          </p>
        </div>
      </section>

      {/* Albums grid */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white border border-gray-100 animate-pulse">
                  <div className="aspect-video bg-gray-100" />
                  <div className="p-5 space-y-2">
                    <div className="h-5 bg-gray-100 rounded w-3/4" />
                    <div className="h-3 bg-gray-100 rounded w-1/3" />
                  </div>
                </div>
              ))}
            </div>
          ) : galleries.length === 0 ? (
            <div className="text-center py-24 text-gray-400">
              <Images size={40} className="mx-auto mb-4 text-gray-300" />
              <p className="text-lg">No albums published yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {galleries.map(g => (
                <AlbumCard key={g.id} gallery={g} onClick={() => setSelected(g)} />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
