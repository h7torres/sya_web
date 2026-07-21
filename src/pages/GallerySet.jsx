import { useState, useEffect } from 'react'
import { useParams, useSearchParams, Link } from 'react-router-dom'
import Container from '../components/Container.jsx'
import Lightbox from '../components/Lightbox.jsx'
import { flatImages } from '../data/gallery/loadGallery.js'
import groupMeta from '../data/gallery/groups.js'

export default function GallerySet() {
  const { slug } = useParams()
  const photos = flatImages.filter((img) => img.group === slug)
  const meta = groupMeta[slug]
  const title = typeof meta === 'string' ? meta : meta?.title

  const [activeIndex, setActiveIndex] = useState(-1)
  const [searchParams] = useSearchParams()

  useEffect(() => {
    const targetKey = searchParams.get('image')
    if (!targetKey) return
    const pos = photos.findIndex((p) => p.key === targetKey)
    if (pos !== -1) setActiveIndex(pos)
  }, [searchParams, photos])

  function openPhoto(index) {
    setActiveIndex(index)
    window.history.replaceState(null, '', `?image=${photos[index].key}`)
  }

  function closePhoto() {
    setActiveIndex(-1)
    window.history.replaceState(null, '', window.location.pathname)
  }

  function handleNavigate(direction) {
    const total = photos.length
    setActiveIndex((prev) => (prev + direction + total) % total)
  }

  if (photos.length === 0) {
    return (
      <main>
        <Container>
          <div className="py-16">
            <p className="font-cutive text-ink/60 mb-4">Collection not found.</p>
            <Link
              to="/library"
              className="font-mono text-xs uppercase tracking-widest text-stamp hover:text-clay"
            >
              ← Back to Library
            </Link>
          </div>
        </Container>
      </main>
    )
  }

  return (
    <main>
      <Container>
        <div className="py-16">
          <Link
            to="/library"
            className="font-mono text-xs uppercase tracking-widest text-stamp hover:text-clay"
          >
            ← Back to Library
          </Link>
          <h1 className="font-mono text-2xl text-ink mt-4 mb-10">{title}</h1>

          <div className="columns-2 md:columns-3 gap-4">
            {photos.map((photo, index) => (
              <button
                key={photo.id}
                onClick={() => openPhoto(index)}
                className="block w-full mb-4 break-inside-avoid text-left"
              >
                <img
                  src={photo.src}
                  alt={photo.caption}
                  className="w-full rounded-sm"
                />
              </button>
            ))}
          </div>
        </div>
      </Container>

      <Lightbox
        images={photos}
        activeIndex={activeIndex}
        onClose={closePhoto}
        onNavigate={handleNavigate}
        groupTitle={title}
      />
    </main>
  )
}