import { useState, useEffect, useMemo } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import Container from '../components/Container.jsx'
import Lightbox from '../components/Lightbox.jsx'
import {
  flatImages,
  setCovers,
  allItems,
  shuffle,
  getDocumentPages,
} from '../data/gallery/loadGallery.js'

export default function Library() {
  const shuffledItems = useMemo(() => shuffle(allItems), [])
  const [activeGroup, setActiveGroup] = useState(null)
  const [activePosition, setActivePosition] = useState(0)
  const [searchParams] = useSearchParams()

  useEffect(() => {
    const targetKey = searchParams.get('image')
    if (!targetKey) return

    const targetPhoto = flatImages.find((img) => img.key === targetKey)
    if (targetPhoto) {
      const groupPhotos = flatImages.filter((img) => img.group === targetPhoto.group)
      const pos = groupPhotos.findIndex((s) => s.id === targetPhoto.id)
      setActiveGroup(targetPhoto.group)
      setActivePosition(pos === -1 ? 0 : pos)
      return
    }

    const targetSet = setCovers.find((s) => s.key === targetKey)
    if (targetSet) {
      setActiveGroup(targetSet.group)
      setActivePosition(0)
    }
  }, [searchParams])

  function openItem(item) {
    setActiveGroup(item.group)
    window.history.replaceState(null, '', `?image=${item.key}`)
    if (item.isSet) {
      setActivePosition(0)
    } else {
      const groupPhotos = flatImages.filter((img) => img.group === item.group)
      const pos = groupPhotos.findIndex((s) => s.id === item.id)
      setActivePosition(pos === -1 ? 0 : pos)
    }
  }

  function closeItem() {
    setActiveGroup(null)
    window.history.replaceState(null, '', window.location.pathname)
  }

  const activeMeta = activeGroup
    ? allItems.find((item) => item.group === activeGroup)
    : null

  const siblings = (() => {
    if (!activeGroup) return []
    if (activeMeta?.isSet) {
      return getDocumentPages(activeGroup)
    }
    const groupPhotos = flatImages.filter((img) => img.group === activeGroup)
    if (activeMeta?.isCollectionGroup) {
      // Collections don't scroll in the lightbox — only the photo
      // that was actually clicked shows here; the rest live on the
      // dedicated collection page instead.
      return [groupPhotos[activePosition]].filter(Boolean)
    }
    return groupPhotos
  })()

  // Decoupled from activePosition: for collections, siblings is always
  // a 1-item array regardless of where the clicked photo sits in the
  // full folder, so the index handed to Lightbox must always be 0.
  const lightboxIndex = !activeGroup
    ? -1
    : activeMeta?.isCollectionGroup
    ? 0
    : activePosition

  function handleNavigate(direction) {
    const total = siblings.length
    setActivePosition((prev) => (prev + direction + total) % total)
  }

  return (
    <main>
      <Container>
        <div className="py-16">
          <h1 className="font-mono text-2xl text-ink mb-2">Library</h1>
          <p className="font-cutive text-ink/70 mb-10">
            Every photograph and document in the archive, gathered in one place.
          </p>

          {shuffledItems.length === 0 ? (
            <p className="font-cutive text-ink/60">
              No items yet — add some to src/assets/gallery/.
            </p>
          ) : (
            <div className="columns-2 md:columns-4 gap-4">
              {shuffledItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => openItem(item)}
                  className="block w-full mb-4 break-inside-avoid text-left"
                >
                  <img
                    src={item.src}
                    alt={item.caption}
                    className="w-full rounded-sm"
                  />
                  <p className="font-mono text-xs text-ink/60 mt-2 text-center">
                    {item.caption}
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
        activeIndex={lightboxIndex}
        onClose={closeItem}
        onNavigate={handleNavigate}
        groupTitle={activeMeta?.groupTitle}
        credit={activeMeta?.credit}
        setSlug={activeMeta?.isCollectionGroup ? activeGroup : null}
      />
    </main>
  )
}