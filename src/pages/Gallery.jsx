import { useState } from 'react'
import Container from '../components/Container.jsx'
import Lightbox from '../components/Lightbox.jsx'
import captions from '../data/gallery/captions.js'

// Recursive — picks up images directly in gallery/ AND images nested
// in themed subfolders (like sy-trolley-development-1980s/01-page.jpg).
const imageModules = import.meta.glob('../assets/gallery/**/*.{jpg,jpeg,png,webp}', {
  eager: true,
})

function titleCase(str) {
  const spaced = str.replace(/[-_]/g, ' ')
  return spaced.charAt(0).toUpperCase() + spaced.slice(1)
}

const galleryImages = Object.entries(imageModules).map(([path, mod], index) => {
  const relPath = path.split('gallery/')[1]
  const key = relPath.replace(/\.(jpg|jpeg|png|webp)$/i, '')
  const parts = relPath.split('/')
  const filename = parts[parts.length - 1].replace(/\.(jpg|jpeg|png|webp)$/i, '')
  const folderName = parts.length > 1 ? parts[0] : null

  const hasCaption = Object.prototype.hasOwnProperty.call(captions, key)
  const fallback = folderName ? titleCase(folderName) : titleCase(filename)

  return {
    id: index,
    src: mod.default,
    caption: hasCaption ? captions[key] : fallback,
    // Images sharing a subfolder share a "group" — the lightbox uses
    // this to know which photos count as "the rest" to browse through.
    // Standalone images (no subfolder) get their own group of one.
    group: folderName || `standalone-${index}`,
  }
})

export default function Gallery() {
  const [activeIndex, setActiveIndex] = useState(null)

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
          <p className="font-cutive text-ink/70 mb-10">
            Every photograph in the archive, gathered in one place.
          </p>

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
                  <p className="font-mono text-xs text-ink/60 mt-2">
                    {img.caption}
                  </p>
                </button>
              ))}
            </div>
          )}
        </div>
      </Container>

      <Lightbox
        images={siblings}
        activeIndex={siblingPosition}
        onClose={() => setActiveIndex(null)}
        onNavigate={handleNavigate}
      />
    </main>
  )
}