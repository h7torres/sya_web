import { useState, useEffect, useMemo } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import Container from '../components/Container.jsx'
import Lightbox from '../components/Lightbox.jsx'
import captions from '../data/gallery/captions.js'
import groupMeta from '../data/gallery/groups.js'

const imageModules = import.meta.glob('../assets/gallery/**/*.{jpg,jpeg,png,webp}', {
  eager: true,
})

function titleCase(str) {
  const spaced = str.replace(/[-_]/g, ' ')
  return spaced.charAt(0).toUpperCase() + spaced.slice(1)
}

const allGalleryImages = Object.entries(imageModules).map(([path, mod], index) => {
  const relPath = path.split('gallery/')[1]
  const key = relPath.replace(/\.(jpg|jpeg|png|webp)$/i, '')
  const parts = relPath.split('/')
  const filename = parts[parts.length - 1].replace(/\.(jpg|jpeg|png|webp)$/i, '')
  const folderName = parts.length > 1 ? parts[0] : null

  const rawEntry = Object.prototype.hasOwnProperty.call(captions, key)
    ? captions[key]
    : null
  const fallback = folderName ? titleCase(folderName) : titleCase(filename)

  let caption = fallback
  let photographer = null
  if (typeof rawEntry === 'string') {
    caption = rawEntry
  } else if (rawEntry && typeof rawEntry === 'object') {
    caption = rawEntry.caption || fallback
    photographer = rawEntry.photographer || null
  }

  return {
    id: index,
    key,
    src: mod.default,
    caption,
    photographer,
    group: folderName || `standalone-${index}`,
    groupTitle: folderName ? groupMeta[folderName] || titleCase(folderName) : null,
  }
})

// Fisher-Yates shuffle — same approach used on Home's Featured section.
function shuffle(array) {
  const result = [...array]
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[result[i], result[j]] = [result[j], result[i]]
  }
  return result
}

export default function Gallery() {
  // Shuffled once per page load/visit, not on every re-render —
  // otherwise clicking an image open/closed would reshuffle the grid
  // underneath the lightbox.
  const galleryImages = useMemo(() => shuffle(allGalleryImages), [])

  const [activeIndex, setActiveIndex] = useState(null)
  const [searchParams] = useSearchParams()

  useEffect(() => {
    const targetKey = searchParams.get('image')
    if (!targetKey) return
    const index = galleryImages.findIndex((img) => img.key === targetKey)
    if (index !== -1) {
      setActiveIndex(index)
    }
  }, [searchParams, galleryImages])

  const activeImage = activeIndex !== null ? galleryImages[activeIndex] : null
  const siblings = activeImage
    ? galleryImages.filter((img) => img.group === activeImage.group)
    : []
  const siblingPosition = activeImage
    ? siblings.findIndex((img) => img.id === activeImage.id)
    : -1

  function handleNavigate(direction) {
    const total = siblings.length
    const nextPosition = (siblingPosition + direction + total) % total
    const nextImage = siblings[nextPosition]
    setActiveIndex(galleryImages.findIndex((img) => img.id === nextImage.id))
  }

  return (
    <main>
      <Container>
        <div className="py-16">
          <h1 className="font-mono text-2xl text-ink mb-2">Gallery</h1>
          

          {galleryImages.length === 0 ? (
            <p className="font-cutive text-ink/60">
              No images yet — add some to src/assets/gallery/.
            </p>
          ) : (
            <div className="columns-2 md:columns-3 gap-4">
              {galleryImages.map((img, index) => (
                <button
                  key={img.id}
                  onClick={() => setActiveIndex(index)}
                  className="block w-full mb-4 break-inside-avoid text-left"
                >
                  <img
                    src={img.src}
                    alt={img.caption}
                    className="w-full rounded-sm"
                  />
                  <p className="font-mono text-xs text-ink/60 mt-2 text-center">
                    {img.caption}
                  </p>
                </button>
              ))}
            </div>
          )}
        </div>

        <section className="pb-24 border-t border-rule pt-16 text-center">
          <h2 className="font-mono text-2xl text-ink mb-3">
            Have something to share?
          </h2>
          <p className="font-cutive max-w-xl mx-auto text-ink/80 leading-relaxed mb-6">
            Photos, videos, documents, or objects — if it tells a piece of
            San Ysidro's story, the archive would love to see it!
          </p>
          <Link
            to="/contact"
            className="inline-block font-mono text-xs uppercase tracking-widest border border-ink px-6 py-3 rounded-full hover:bg-ink hover:text-paper transition-colors"
          >
            Submit to the Archive
          </Link>
        </section>
      </Container>

      <Lightbox
        images={siblings}
        activeIndex={siblingPosition}
        onClose={() => setActiveIndex(null)}
        onNavigate={handleNavigate}
        groupTitle={activeImage?.groupTitle}
      />
    </main>
  )
}