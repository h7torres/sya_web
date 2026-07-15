// Fullscreen overlay for viewing one image at a time, with next/prev
// navigation through a given set of "sibling" images (e.g. every photo
// from the same themed subfolder). Renders nothing if there's no
// active image.
export default function Lightbox({ images, activeIndex, onClose, onNavigate }) {
  if (activeIndex === null || activeIndex === -1 || !images[activeIndex]) {
    return null
  }

  const image = images[activeIndex]
  const hasMultiple = images.length > 1

  return (
    <div
      className="fixed inset-0 z-50 bg-ink/95 flex items-center justify-center p-6"
      onClick={onClose}
    >
      <button
        onClick={onClose}
        className="absolute top-6 right-6 font-mono text-paper text-xs uppercase tracking-widest"
      >
        Close ✕
      </button>

      {hasMultiple && (
        <button
          onClick={(e) => {
            e.stopPropagation()
            onNavigate(-1)
          }}
          className="absolute left-4 md:left-8 text-paper text-4xl font-mono"
          aria-label="Previous image"
        >
          ‹
        </button>
      )}

      <img
        src={image.src}
        alt={image.caption}
        className="max-h-[80vh] max-w-[85vw] object-contain"
        onClick={(e) => e.stopPropagation()}
      />

      {hasMultiple && (
        <button
          onClick={(e) => {
            e.stopPropagation()
            onNavigate(1)
          }}
          className="absolute right-4 md:right-8 text-paper text-4xl font-mono"
          aria-label="Next image"
        >
          ›
        </button>
      )}

      <p className="absolute bottom-6 left-1/2 -translate-x-1/2 font-mono text-paper/70 text-xs text-center px-4">
        {image.caption}
      </p>
    </div>
  )
}