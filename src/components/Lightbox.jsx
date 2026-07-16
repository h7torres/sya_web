import { Link } from 'react-router-dom'
import neighbors from '../data/neighbors/index.js'

export default function Lightbox({ images, activeIndex, onClose, onNavigate, groupTitle }) {
  if (activeIndex === null || activeIndex === -1 || !images[activeIndex]) {
    return null
  }

  const image = images[activeIndex]
  const hasMultiple = images.length > 1

  const photographer = image.photographer
    ? neighbors.find((n) => n.id === image.photographer)
    : null

  return (
    <div
      className="fixed inset-0 z-50 bg-paper/70 flex items-center justify-center p-4 md:p-10"
      onClick={onClose}
    >
      {/* Arrows now live outside the white box entirely, positioned
          relative to the whole overlay instead of the image side, so
          they sit clearly apart from the photo instead of overlapping it. */}
      {hasMultiple && (
        <button
          onClick={(e) => {
            e.stopPropagation()
            onNavigate(-1)
          }}
          className="absolute left-2 md:left-10 text-ink text-4xl font-mono z-10"
          aria-label="Previous image"
        >
          ‹
        </button>
      )}

      <div
        className="relative bg-paper w-full max-w-4xl max-h-[90vh] flex flex-col md:flex-row shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 font-mono text-ink text-lg"
        >
          ✕
        </button>

        <div className="relative flex-1 flex items-center justify-center min-h-[300px] md:min-h-0">
          <img
            src={image.src}
            alt={image.caption}
            className="max-h-[50vh] md:max-h-[80vh] max-w-full object-contain"
          />
        </div>

        {/* Info side — flex column with justify-center vertically
            centers the caption block within the panel, rather than it
            sitting pinned near the top. */}
        <div className="w-full md:w-72 py-6 px-6 border-t md:border-t-0 md:border-l border-rule overflow-y-auto flex flex-col justify-center text-center min-h-[200px]">
          <p className="font-cutive text-sm text-ink/90 leading-relaxed">
            {image.caption}
          </p>

          {groupTitle && (
            <p className="font-mono text-xs text-stamp uppercase tracking-widest mt-4">
              Part of: {groupTitle}
            </p>
          )}

          {photographer && (
            <p className="font-mono text-xs text-ink/70 mt-4">
              Photo by{' '}
              <Link
                to={`/neighbors/${photographer.id}`}
                className="text-stamp hover:text-clay underline"
              >
                {photographer.name}
              </Link>
            </p>
          )}
        </div>
      </div>

      {hasMultiple && (
        <button
          onClick={(e) => {
            e.stopPropagation()
            onNavigate(1)
          }}
          className="absolute right-2 md:right-10 text-ink text-4xl font-mono z-10"
          aria-label="Next image"
        >
          ›
        </button>
      )}
    </div>
  )
}