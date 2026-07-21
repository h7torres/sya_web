import { useState, useEffect, useMemo } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import Container from '../components/Container.jsx'
import Lightbox from '../components/Lightbox.jsx'
import captions from '../data/gallery/captions.js'
import groupMeta from '../data/gallery/groups.js'
import { imageSets } from '../data/gallery/index.js'

const imageModules = import.meta.glob('../assets/gallery/**/*.{jpg,jpeg,png,webp}', {
  eager: true,
})

function titleCase(str) {
  const spaced = str.replace(/[-_]/g, ' ')
  return spaced.charAt(0).toUpperCase() + spaced.slice(1)
}

const flatImages = Object.entries(imageModules).map(([path, mod], index) => {
  const relPath = path.split('gallery/')[1]
  const key = relPath.replace(/\.(jpg|jpeg|png|webp)$/i, '')
  const parts = relPath.split('/')
  const filename = parts[parts.length - 1].replace(/\.(jpg|jpeg|png|webp)$/i, '')
  const folderName = parts.length > 1 ? parts[0] : null

  const rawEntry = Object.prototype.hasOwnProperty.call(captions, key)
    ? captions[key]
    : null
  const fallback = folderName
    ? groupMeta[folderName] || titleCase(folderName)
    : titleCase(filename)

  let caption = fallback
  let photographer = null
  if (typeof rawEntry === 'string') {
    caption = rawEntry
  } else if (rawEntry && typeof rawEntry === 'object') {
    caption = rawEntry.caption || fallback
    photographer = rawEntry.photographer || null
  }

  return {
    id: `photo-${index}`,
    key,
    src: mod.default,
    caption,
    photographer,
    group: folderName || `standalone-${index}`,
    groupTitle: folderName ? groupMeta[folderName] || titleCase(folderName) : null,
    credit: null,
    isSet: false,
  }
})

const setCovers = imageSets.map((set) => ({
  id: `set-${set.slug}`,
  key: `set-${set.slug}`,
  src: set.cover,
  caption: set.title,
  photographer: null,
  group: `set-${set.slug}`,
  groupTitle: set.title,
  credit: set.credit,
  isSet: true,
  images: set.images,
}))

const allItems = [...flatImages, ...setCovers]

function shuffle(array) {
  const result = [...array]
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[result[i], result[j]] = [result[j], result[i]]
  }
  return result
}

function getSiblings(groupKey) {
  const set = setCovers.find((s) => s.group === groupKey)
  if (set) {
    return set.images.map((img, i) => ({
      id: `${groupKey}-${i}`,
      src: img.src,
      caption: set.caption,
    }))
  }
  return flatImages.filter((img) => img.group === groupKey)
}

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
      const sibs = getSiblings(targetPhoto.group)
      const pos = sibs.findIndex((s) => s.id === targetPhoto.id)
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
    if (item.isSet) {
      setActivePosition(0)
    } else {
      const sibs = getSiblings(item.group)
      const pos = sibs.findIndex((s) => s.id === item.id)
      setActivePosition(pos === -1 ? 0 : pos)
    }
  }

  const siblings = activeGroup ? getSiblings(activeGroup) : []
  const activeMeta = activeGroup
    ? allItems.find((item) => item.group === activeGroup)
    : null

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
        activeIndex={activeGroup ? activePosition : -1}
        onClose={() => setActiveGroup(null)}
        onNavigate={handleNavigate}
        groupTitle={activeMeta?.groupTitle}
        credit={activeMeta?.credit}
      />
    </main>
  )
}