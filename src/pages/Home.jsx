import { useState, useEffect, useMemo, useRef } from 'react'
import { Link } from 'react-router-dom'
import Container from '../components/Container.jsx'
import NeighborAvatar from '../components/NeighborAvatar.jsx'
import Lightbox from '../components/Lightbox.jsx'
import { flatImages, setCovers, allItems, getDocumentPages } from '../data/gallery/loadGallery.js'
import neighbors from '../data/neighbors/index.js'

const EXCLUDED_FROM_FEATURED = ['sy-school-1955']

const featuredCandidates = [...flatImages, ...setCovers].filter(
  (item) => !EXCLUDED_FROM_FEATURED.includes(item.key)
)

function shuffle(array) {
  const result = [...array]
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[result[i], result[j]] = [result[j], result[i]]
  }
  return result
}

function packColumns(images, numCols) {
  const sorted = [...images].sort((a, b) => b.weight - a.weight)
  const columns = Array.from({ length: numCols }, () => ({ items: [], weight: 0 }))
  for (const img of sorted) {
    const shortest = columns.reduce((a, b) => (b.weight < a.weight ? b : a))
    shortest.items.push(img)
    shortest.weight += img.weight
  }
  return columns.map((c) => c.items)
}

const TARGET_WEIGHT = 16
const NEIGHBOR_PREVIEW_COUNT = 4

export default function Home() {
  const shuffledCandidates = useMemo(() => shuffle(featuredCandidates), [])
  const [displayedImages, setDisplayedImages] = useState([])
  const [activeGroup, setActiveGroup] = useState(null)
  const [activePosition, setActivePosition] = useState(0)
  const scrollRef = useRef(null)
  const [thumbStyle, setThumbStyle] = useState({ height: '0%', top: '0%' })

  const featuredNeighbors = useMemo(
    () => shuffle(neighbors).slice(0, NEIGHBOR_PREVIEW_COUNT),
    []
  )

  useEffect(() => {
    let cancelled = false

    async function loadAndSelect() {
      const withWeights = await Promise.all(
        shuffledCandidates.map(
          (img) =>
            new Promise((resolve) => {
              const el = new Image()
              el.onload = () => {
                const aspect = el.naturalHeight / el.naturalWidth
                const weight = Math.min(Math.max(aspect, 0.6), 2.5)
                resolve({ ...img, weight })
              }
              el.onerror = () => resolve({ ...img, weight: 1 })
              el.src = img.src
            })
        )
      )

      let runningWeight = 0
      const selected = []
      for (const img of withWeights) {
        if (runningWeight >= TARGET_WEIGHT) break
        selected.push(img)
        runningWeight += img.weight
      }

      if (!cancelled) setDisplayedImages(selected)
    }

    if (shuffledCandidates.length > 0) {
      loadAndSelect()
    }

    return () => {
      cancelled = true
    }
  }, [shuffledCandidates])

  const mobileColumns = useMemo(
    () => packColumns(displayedImages, 2),
    [displayedImages]
  )
  const tabletColumns = useMemo(
    () => packColumns(displayedImages, 3),
    [displayedImages]
  )
  const desktopColumns = useMemo(
    () => packColumns(displayedImages, 3),
    [displayedImages]
  )

  function handleFeaturedScroll() {
    const el = scrollRef.current
    if (!el) return
    const { scrollTop, scrollHeight, clientHeight } = el
    if (scrollHeight <= clientHeight) return
    const thumbHeight = Math.max((clientHeight / scrollHeight) * 100, 5)
    const thumbTop = (scrollTop / (scrollHeight - clientHeight)) * (100 - thumbHeight)
    setThumbStyle({ height: `${thumbHeight}%`, top: `${thumbTop}%` })
  }

  useEffect(() => {
    handleFeaturedScroll()
  }, [displayedImages])

  function openItem(item) {
    setActiveGroup(item.group)
    if (item.isSet) {
      setActivePosition(0)
    } else {
      const groupPhotos = flatImages.filter((img) => img.group === item.group)
      const pos = groupPhotos.findIndex((s) => s.id === item.id)
      setActivePosition(pos === -1 ? 0 : pos)
    }
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
      return [groupPhotos[activePosition]].filter(Boolean)
    }
    return groupPhotos
  })()

  const lightboxIndex = !activeGroup
    ? -1
    : activeMeta?.isCollectionGroup
    ? 0
    : activePosition

  function handleNavigate(direction) {
    const total = siblings.length
    setActivePosition((prev) => (prev + direction + total) % total)
  }

  function renderColumns(columns) {
    return columns.map((col, i) => (
      <div key={i} className="flex flex-col gap-2">
        {col.map((img) => (
          <button
            key={img.id}
            onClick={() => openItem(img)}
            className="relative block w-full group overflow-hidden text-left"
          >
            <img src={img.src} alt={img.caption} className="w-full block" />
            <div className="absolute inset-0 bg-ink/0 group-hover:bg-ink/60 transition-colors duration-200 flex items-center justify-center">
              <p className="font-mono text-xs text-paper text-center px-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                {img.caption}
              </p>
            </div>
          </button>
        ))}
      </div>
    ))
  }

  return (
    <main>
      <Container>
        <div className="pt-8 pb-16">
          <h1 className="sr-only">San Ysidro Archive</h1>

          <h2 className="font-mono text-2xl text-ink mb-2 text-left">
            Our Mission
          </h2>
          <p className="font-cutive text-sm md:text-base max-w-2xl text-left text-ink/80 leading-relaxed">
            The San Ysidro Archive serves as a living repository for the
            countercultural histories of 92173. By documenting local
            activism, joy, and resilience, the archive curates a
            communal memory that thrives independently of the border.
          </p>

          <h2 className="font-mono text-2xl text-ink mt-6 mb-2 max-w-2xl ml-auto text-right">
            Nuestra Misión
          </h2>
          <p className="font-cutive text-sm md:text-base max-w-2xl ml-auto text-right text-ink/80 leading-relaxed">
            El Archivo de San Ysidro es un repositorio de las historias
            contraculturales del área 92173. Al documentar el activismo,
            la alegría y la resiliencia de San Ysidro, el archivo
            cultiva una memoria comunitaria que prospera
            independientemente de la frontera.
          </p>
        </div>

        <div className="pb-16 flex justify-center">
          <Link
            to="/library"
            className="font-mono text-xs uppercase tracking-widest border border-ink px-6 py-3 rounded-full hover:bg-ink hover:text-paper transition-colors"
          >
            Explore the Archive
          </Link>
        </div>
      </Container>

      {displayedImages.length > 0 && (
        <section className="pb-24 w-full px-4 md:px-8">
          <h2 className="font-mono text-lg uppercase tracking-widest text-stamp mb-6 text-center">
            Featured Bits From The Archive
          </h2>

          <div className="relative">
            <div
              ref={scrollRef}
              onScroll={handleFeaturedScroll}
              className="max-h-[70vh] overflow-y-auto pr-2 lg:max-w-[60%] lg:mx-auto no-native-scrollbar"
            >
              <div className="grid grid-cols-2 gap-2 md:hidden">
                {renderColumns(mobileColumns)}
              </div>

              <div className="hidden md:grid lg:hidden md:grid-cols-3 gap-2">
                {renderColumns(tabletColumns)}
              </div>

              <div className="hidden lg:grid lg:grid-cols-3 gap-2">
                {renderColumns(desktopColumns)}
              </div>
            </div>

            <div className="hidden lg:block absolute top-0 bottom-0 w-[2px] bg-ink/10 right-[calc(20%-8px)]">
              <div
                className="absolute w-full bg-ink/30 rounded-full transition-[top] duration-75"
                style={thumbStyle}
              />
            </div>
          </div>

          <div className="mt-10 flex justify-end lg:max-w-[60%] lg:mx-auto">
            <Link
              to="/library"
              className="font-mono text-xs uppercase tracking-widest text-stamp hover:text-stamp/50 underline transition-colors"
            >
              See More! →
            </Link>
          </div>
        </section>
      )}

      <Container>
        {featuredNeighbors.length > 0 && (
          <section className="pb-24 border-t border-rule pt-16">
            <h2 className="font-mono text-xs uppercase tracking-widest text-stamp mb-6">
              Featured Neighbors
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-2xl md:max-w-6xl mx-auto">
              {featuredNeighbors.map((neighbor) => (
                <Link
                  key={neighbor.id}
                  to={`/neighbors/${neighbor.id}`}
                  className="group text-center"
                >
                  <NeighborAvatar
                    neighbor={neighbor}
                    className="w-full aspect-square"
                  />
                  <p className="font-mono text-sm text-ink mt-3 group-hover:text-clay">
                    {neighbor.name}
                  </p>
                  {neighbor.role && (
                    <p className="font-mono text-xs text-stamp uppercase tracking-widest">
                      {neighbor.role}
                    </p>
                  )}
                </Link>
              ))}
            </div>
            <div className="mt-8 flex justify-end max-w-2xl md:max-w-6xl mx-auto">
              <Link
                to="/neighbors"
                className="font-mono text-xs uppercase tracking-widest text-stamp hover:text-stamp/50 underline transition-colors"
              >
                Meet All of Our Neighbors →
              </Link>
            </div>
          </section>
        )}

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
        onClose={() => setActiveGroup(null)}
        onNavigate={handleNavigate}
        groupTitle={activeMeta?.groupTitle}
        credit={activeMeta?.credit}
        setSlug={activeMeta?.isCollectionGroup ? activeGroup : null}
      />
    </main>
  )
}