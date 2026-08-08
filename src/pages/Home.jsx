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

// Row heights in px, matching the ROW_HEIGHT Tailwind classes below
// (h-40 = 160px, h-56 = 224px) — needed as real numbers so we can tell
// when a row's content has actually reached the container's width.
const ROW_HEIGHT_PX = { mobile: 160, desktop: 224 }
const GAP_PX = 8 // gap-2
// A row is "full" once it's hit the container width AND has at least
// MIN_PER_ROW images — a few wide photos shouldn't be allowed to call
// a row done after just one or two. It also stops at MAX_PER_ROW even
// if there's technically still width left, so a run of narrow photos
// can't cram in an unreasonable number.
const MIN_PER_ROW = 4
const MAX_PER_ROW = 24
const NEIGHBOR_PREVIEW_COUNT = 4
const MEASURE_BATCH_SIZE = 10
// Safety cap so a very wide screen (or a run of unusually tall photos)
// can't send this into pulling in the whole archive.
const MAX_CANDIDATES = 160

function measureImage(img) {
  return new Promise((resolve) => {
    const el = new Image()
    el.onload = () => {
      const aspect = el.naturalHeight / el.naturalWidth
      resolve({ ...img, aspect })
    }
    el.onerror = () => resolve({ ...img, aspect: 1 })
    el.src = img.src
  })
}

function makeRowTrackers(numRows) {
  return Array.from({ length: numRows }, () => ({ items: [], width: 0 }))
}

function rowIsFull(row, containerWidth) {
  if (row.items.length >= MAX_PER_ROW) return true
  return row.width >= containerWidth && row.items.length >= MIN_PER_ROW
}

function rowsFilled(rows, containerWidth) {
  return containerWidth > 0 && rows.every((r) => rowIsFull(r, containerWidth))
}

function placeInShortestRow(img, rows, rowHeightPx, containerWidth) {
  // Real aspect ratio, not clamped — has to match what <img className="h-full
  // w-auto" /> will actually render, or the fill math drifts from reality.
  const pixelWidth = rowHeightPx / img.aspect
  const openRows = rows.filter((r) => !rowIsFull(r, containerWidth))
  if (openRows.length === 0) return
  const shortest = openRows.reduce((a, b) => (b.width < a.width ? b : a))
  shortest.items.push(img)
  shortest.width += pixelWidth + GAP_PX
}

export default function Home() {
  const shuffledCandidates = useMemo(() => shuffle(featuredCandidates), [])
  const [mobileRows, setMobileRows] = useState([])
  const [desktopRows, setDesktopRows] = useState([])
  const [loadingFeatured, setLoadingFeatured] = useState(true)
  const [containerWidth, setContainerWidth] = useState(0)
  const [activeGroup, setActiveGroup] = useState(null)
  const [activePosition, setActivePosition] = useState(0)
  const scrollRef = useRef(null)
  const [thumbStyle, setThumbStyle] = useState({ width: '0%', left: '0%' })

  const featuredNeighbors = useMemo(
    () => shuffle(neighbors.filter((n) => n.photo)).slice(0, NEIGHBOR_PREVIEW_COUNT),
    []
  )

  // Measure the actual rendered width of the row container so we know
  // exactly how much content is needed to fill it — this varies by
  // screen size/zoom, so a fixed number can't get it right everywhere.
  useEffect(() => {
    const el = scrollRef.current
    if (!el || typeof ResizeObserver === 'undefined') return
    const observer = new ResizeObserver((entries) => {
      setContainerWidth(entries[0].contentRect.width)
    })
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (containerWidth === 0) return
    let cancelled = false

    async function loadAndFill() {
      const mobile = makeRowTrackers(2)
      const desktop = makeRowTrackers(3)

      for (
        let start = 0;
        start < shuffledCandidates.length && start < MAX_CANDIDATES;
        start += MEASURE_BATCH_SIZE
      ) {
        if (rowsFilled(mobile, containerWidth) && rowsFilled(desktop, containerWidth)) {
          break
        }

        const batch = shuffledCandidates.slice(start, start + MEASURE_BATCH_SIZE)
        const measured = await Promise.all(batch.map(measureImage))
        if (cancelled) return

        for (const img of measured) {
          const mobileNeedsMore = !rowsFilled(mobile, containerWidth)
          const desktopNeedsMore = !rowsFilled(desktop, containerWidth)
          if (!mobileNeedsMore && !desktopNeedsMore) break

          if (mobileNeedsMore) placeInShortestRow(img, mobile, ROW_HEIGHT_PX.mobile, containerWidth)
          if (desktopNeedsMore) placeInShortestRow(img, desktop, ROW_HEIGHT_PX.desktop, containerWidth)
        }
      }

      if (!cancelled) {
        setMobileRows(mobile.map((r) => r.items))
        setDesktopRows(desktop.map((r) => r.items))
        setLoadingFeatured(false)
      }
    }

    if (shuffledCandidates.length > 0) {
      loadAndFill()
    }

    return () => {
      cancelled = true
    }
  }, [shuffledCandidates, containerWidth])

  function handleFeaturedScroll() {
    const el = scrollRef.current
    if (!el) return
    const { scrollLeft, scrollWidth, clientWidth } = el
    if (scrollWidth <= clientWidth) return
    const thumbWidth = Math.max((clientWidth / scrollWidth) * 100, 5)
    const thumbLeft = (scrollLeft / (scrollWidth - clientWidth)) * (100 - thumbWidth)
    setThumbStyle({ width: `${thumbWidth}%`, left: `${thumbLeft}%` })
  }

  useEffect(() => {
    handleFeaturedScroll()
  }, [mobileRows, desktopRows])

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

  const ROW_HEIGHT = 'h-40 md:h-56'

  function renderRows(rows) {
    let index = 0
    return rows.map((row, i) => (
      <div key={i} className={`flex ${ROW_HEIGHT} gap-2`}>
        {row.map((img) => {
          const delay = index++ * 40
          return (
            <button
              key={img.id}
              onClick={() => openItem(img)}
              className="relative shrink-0 h-full group overflow-hidden text-left animate-fade-in-up"
              style={{ animationDelay: `${delay}ms` }}
            >
              <img
                src={img.src}
                alt={img.caption}
                className="h-full w-auto block"
              />
              <div className="absolute inset-0 bg-ink/0 group-hover:bg-ink/60 transition-colors duration-200 flex items-center justify-center">
                <p className="font-mono text-xs text-paper text-center px-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  {img.caption}
                </p>
              </div>
            </button>
          )
        })}
      </div>
    ))
  }

  // Fixed-width placeholder tiles shown while the real images are still
  // being measured/selected, so the section's shape is visible right
  // away instead of the whole thing just being blank.
  function renderSkeletonRows(numRows, perRow) {
    const widths = ['w-32', 'w-44', 'w-56', 'w-40']
    return Array.from({ length: numRows }, (_, rowIndex) => (
      <div key={rowIndex} className={`flex ${ROW_HEIGHT} gap-2`}>
        {Array.from({ length: perRow }, (_, itemIndex) => (
          <div
            key={itemIndex}
            className={`h-full shrink-0 bg-ink/10 animate-pulse ${
              widths[(rowIndex + itemIndex) % widths.length]
            }`}
          />
        ))}
      </div>
    ))
  }

  return (
    <main>
      <Container>
        <div className="pt-16 md:pt-32 pb-16">
          <h1 className="sr-only">San Ysidro Archive</h1>

          <h2 className="font-mono text-xl text-ink mb-2 text-left">
            Our Mission
          </h2>
          <p className="font-cutive text-sm md:text-base max-w-2xl text-left text-ink/80 leading-relaxed">
            The San Ysidro Archive serves as a living repository for the
            countercultural histories of 92173. By documenting local
            activism, joy, and resilience, the archive curates a
            communal memory that thrives independently of the border.
          </p>

          <h2 className="font-mono text-xl text-ink mt-6 mb-2 max-w-2xl ml-auto text-right">
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

      <section className="pb-24 w-full px-4 md:px-8">
        <h2 className="font-mono text-lg uppercase tracking-widest text-stamp mb-6 text-center">
          Featured Bits From The Archive
        </h2>

        <div className="relative max-w-6xl mx-auto">
          <div
            ref={scrollRef}
            onScroll={handleFeaturedScroll}
            className="flex flex-col gap-2 overflow-x-auto pb-2 no-native-scrollbar"
          >
            <div className="md:hidden contents">
              {loadingFeatured
                ? renderSkeletonRows(2, 6)
                : renderRows(mobileRows)}
            </div>

            <div className="hidden md:contents">
              {loadingFeatured
                ? renderSkeletonRows(3, 8)
                : renderRows(desktopRows)}
            </div>
          </div>

          <div className="absolute left-0 right-0 bottom-0 h-[2px] bg-ink/10">
            <div
              className="absolute h-full bg-ink/30 rounded-full transition-[left] duration-75"
              style={thumbStyle}
            />
          </div>
        </div>

        <div className="mt-10 flex justify-end max-w-6xl mx-auto">
          <Link
            to="/library"
            className="font-mono text-xs uppercase tracking-widest text-stamp hover:text-stamp/50 underline transition-colors"
          >
            See More! →
          </Link>
        </div>
      </section>

      <Container>
        {featuredNeighbors.length > 0 && (
          <section className="pb-24 border-t border-rule pt-16">
            <h2 className="font-mono text-lg uppercase tracking-widest text-stamp mb-6 text-center">
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
            className="inline-block font-mono text-xs uppercase tracking-widest border border-ink px-6 py-3 hover:bg-ink hover:text-paper transition-colors"
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