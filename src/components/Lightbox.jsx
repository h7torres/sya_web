import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import neighbors from '../data/neighbors/index.js'

export default function Lightbox({ images, activeIndex, onClose, onNavigate, groupTitle, credit, setSlug }) {
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    setCopied(false)
  }, [activeIndex])

  if (activeIndex === null || activeIndex === -1 || !images[activeIndex]) {
    return null
  }

  const image = images[activeIndex]
  const hasMultiple = images.length > 1

  const photographer = image.photographer
    ? neighbors.find((n) => n.id === image.photographer)
    : null

  function handleShare() {
    navigator.clipboard.writeText(window.location.href).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <div
      className="fixed inset-0 z-50 bg-paper/70 flex items-center justify-center p-4 md:p-10"
      onClick={onClose}
    >
      <div
        className="flex items-center gap-3 md:gap-6 w-full max-w-5xl justify-center"
        onClick={(e) => e.stopPropagation()}
      >
        {hasMultiple && (
          <button
            onClick={(e) => {
              e.stopPropagation()
              onNavigate(-1)
            }}
            className="shrink-0 text-ink text-3xl md:text-4xl font-mono"
            aria-label="Previous image"
          >
            ‹
          </button>
        )}

        <div className="relative bg-paper w-full max-w-4xl max-h-[90vh] flex flex-col md:flex-row shadow-xl">
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

          <div className="w-full md:w-72 py-6 px-6 border-t md:border-t-0 md:border-l border-rule overflow-y-auto flex flex-col justify-center text-center min-h-[200px]">
            <p className="font-mono text-sm text-ink uppercase tracking-widest">
              {groupTitle
                ? `Part of photo series documenting ${groupTitle}`
                : image.caption}
            </p>

            {setSlug && (
              <Link
                to={`/library/${setSlug}`}
                onClick={(e) => e.stopPropagation()}
                className="font-mono text-xs uppercase tracking-widest text-stamp hover:text-clay underline mt-8 inline-block"
              >
                View full set →
              </Link>
            )}

            {credit && (
              <p className="font-mono text-xs text-ink/50 mt-3">{credit}</p>
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

            <button
              onClick={(e) => {
                e.stopPropagation()
                handleShare()
              }}
              className="font-mono text-xs uppercase tracking-widest text-gray-400 hover:text-gray-500 underline mt-6 self-center"
            >
              {copied ? 'Link copied!' : 'Share'}
            </button>
          </div>
        </div>

        {hasMultiple && (
          <button
            onClick={(e) => {
              e.stopPropagation()
              onNavigate(1)
            }}
            className="shrink-0 text-ink text-3xl md:text-4xl font-mono"
            aria-label="Next image"
          >
            ›
          </button>
        )}
      </div>
    </div>
  )
}