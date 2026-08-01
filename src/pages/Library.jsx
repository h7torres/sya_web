import { useState, useEffect, useMemo, useRef } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import Container from '../components/Container.jsx'
import Lightbox from '../components/Lightbox.jsx'
import categories from '../data/gallery/categories.js'
import {
  flatImages,
  setCovers,
  allItems,
  shuffle,
  getDocumentPages,
} from '../data/gallery/loadGallery.js'

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

const PAGE_SIZE = 24

// Only used to pick which column a photo goes in, so one extreme photo
// can't wildly unbalance a column — the photo itself still renders at
// its true, unclamped aspect ratio (see loadAspect below), never cropped.
const PACK_WEIGHT_MIN = 0.5
const PACK_WEIGHT_MAX = 3

function loadAspect(src) {
  return new Promise((resolve) => {
    const el = new Image()
    el.onload = () => resolve(el.naturalHeight / el.naturalWidth)
    el.onerror = () => resolve(1)
    el.src = src
  })
}

// Pinterest-style: each photo keeps its real proportions (no cropping to
// a uniform box), items are placed one at a time as their own aspect
// ratio resolves rather than waiting on the whole batch (so the grid
// fills in progressively instead of popping in all at once), and once a
// photo is placed in a column it's never moved — so "Load more" only
// ever appends after what's already there.
function MasonryColumns({ items, numCols, onItemClick, className }) {
  const columnsRef = useRef(
    Array.from({ length: numCols }, () => ({ items: [], weight: 0 }))
  )
  const processedRef = useRef(new Set())
  const [, forceRender] = useState(0)

  useEffect(() => {
    const newItems = items.filter((item) => !processedRef.current.has(item.id))
    if (newItems.length === 0) return
    let cancelled = false

    newItems.forEach((item) => {
      loadAspect(item.src).then((aspect) => {
        if (cancelled || processedRef.current.has(item.id)) return
        processedRef.current.add(item.id)
        const packWeight = Math.min(
          Math.max(aspect, PACK_WEIGHT_MIN),
          PACK_WEIGHT_MAX
        )
        const shortest = columnsRef.current.reduce((a, b) =>
          b.weight < a.weight ? b : a
        )
        shortest.items.push({ ...item, aspect })
        shortest.weight += packWeight
        forceRender((n) => n + 1)
      })
    })

    return () => {
      cancelled = true
    }
  }, [items])

  return (
    <div className={className}>
      {columnsRef.current.map((col, i) => (
        <div key={i} className="flex flex-col gap-2">
          {col.items.map((item) => (
            <button
              key={item.id}
              onClick={() => onItemClick(item)}
              className="relative block w-full group overflow-hidden rounded-sm bg-ink/5 text-left"
              style={{ aspectRatio: `1 / ${item.aspect}` }}
            >
              <img
                src={item.src}
                alt={item.caption}
                loading="lazy"
                className="w-full h-full object-cover block"
              />
              <div className="absolute inset-0 bg-ink/0 group-hover:bg-ink/60 transition-colors duration-200 flex items-center justify-center">
                <p className="font-mono text-xs text-paper text-center px-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  {item.caption}
                </p>
              </div>
            </button>
          ))}
        </div>
      ))}
    </div>
  )
}

export default function Library() {
  const [activeGroup, setActiveGroup] = useState(null)
  const [activePosition, setActivePosition] = useState(0)
  const [searchParams] = useSearchParams()

  const [searchQuery, setSearchQuery] = useState('')
  const [selectedTags, setSelectedTags] = useState([])
  const [selectedDecade, setSelectedDecade] = useState(null)
  const [sortBy, setSortBy] = useState('random')
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE)

  const availableDecades = useMemo(() => {
    const decades = new Set(allItems.map((i) => i.decade).filter(Boolean))
    return [...decades].sort((a, b) => a - b)
  }, [])

  const filteredItems = useMemo(() => {
    let items = allItems

    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase()
      items = items.filter(
        (item) =>
          item.caption.toLowerCase().includes(q) ||
          (item.groupTitle || '').toLowerCase().includes(q) ||
          item.tags.some((t) => t.toLowerCase().includes(q))
      )
    }

    if (selectedTags.length > 0) {
      items = items.filter((item) =>
        selectedTags.every((tag) => item.tags.includes(tag))
      )
    }

    if (selectedDecade) {
      items = items.filter((item) => item.decade === selectedDecade)
    }

    return items
  }, [searchQuery, selectedTags, selectedDecade])

  const displayedItems = useMemo(() => {
    if (sortBy === 'az') {
      return [...filteredItems].sort((a, b) => a.caption.localeCompare(b.caption))
    }
    if (sortBy === 'newest') {
      return [...filteredItems].sort((a, b) => (b.decade || 0) - (a.decade || 0))
    }
    if (sortBy === 'oldest') {
      return [...filteredItems].sort(
        (a, b) => (a.decade || 9999) - (b.decade || 9999)
      )
    }
    return shuffle(filteredItems)
  }, [filteredItems, sortBy])

  useEffect(() => {
    setVisibleCount(PAGE_SIZE)
  }, [searchQuery, selectedTags, selectedDecade, sortBy])

  const visibleItems = displayedItems.slice(0, visibleCount)
  const hasMore = visibleCount < displayedItems.length
  const filterKey = `${searchQuery}|${selectedTags.join(',')}|${selectedDecade}|${sortBy}`

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
    window.history.replaceState(null, '', `?image=${item.key}`)
    if (item.isSet) {
      setActivePosition(0)
    } else {
      const sibs = getSiblings(item.group)
      const pos = sibs.findIndex((s) => s.id === item.id)
      setActivePosition(pos === -1 ? 0 : pos)
    }
  }

  function closeItem() {
    setActiveGroup(null)
    window.history.replaceState(null, '', window.location.pathname)
  }

  const siblings = activeGroup ? getSiblings(activeGroup) : []
  const activeMeta = activeGroup
    ? allItems.find((item) => item.group === activeGroup)
    : null

  function handleNavigate(direction) {
    const total = siblings.length
    setActivePosition((prev) => (prev + direction + total) % total)
  }

  function toggleTag(tag) {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    )
  }

  function clearFilters() {
    setSelectedTags([])
    setSelectedDecade(null)
  }

  const activeFilterCount = selectedTags.length + (selectedDecade ? 1 : 0)

  return (
    <main>
      <Container>
        <div className="pt-24 md:pt-25 pb-16">
          <h1 className="font-mono text-3xl text-ink mb-5 text-center">
            Explore The Archive
          </h1>

          <p className="font-cutive text-ink/80 text-center max-w-2xl mx-auto leading-relaxed mb-10">
            Search, filter, and browse through decades of San Ysidro's
            photos, documents, and stories
          </p>

          <div className="flex items-center gap-3 max-w-2xl mx-auto">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search the archive..."
              className="flex-1 font-mono text-sm border border-rule bg-paper px-4 py-3 focus:outline-none focus:border-ink"
            />
            <button
              onClick={() => setFiltersOpen((prev) => !prev)}
              className="font-mono text-xs uppercase tracking-widest border border-ink px-4 py-3 hover:bg-ink hover:text-paper transition-colors whitespace-nowrap"
            >
              Filters{activeFilterCount > 0 ? ` (${activeFilterCount})` : ''}
            </button>
          </div>

          {filtersOpen && (
            <div className="max-w-2xl mx-auto mt-4 border border-rule p-6">
              <div className="mb-6">
                <p className="font-mono text-xs uppercase tracking-widest text-stamp mb-3">
                  Category
                </p>
                <div className="flex flex-wrap gap-2">
                  {categories.map((tag) => (
                    <button
                      key={tag}
                      onClick={() => toggleTag(tag)}
                      className={`font-mono text-xs px-3 py-1.5 border ${
                        selectedTags.includes(tag)
                          ? 'bg-ink text-paper border-ink'
                          : 'border-rule text-ink/70 hover:border-ink'
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <p className="font-mono text-xs uppercase tracking-widest text-stamp mb-3">
                  Decade
                </p>
                <div className="flex flex-wrap gap-2">
                  {availableDecades.map((decade) => (
                    <button
                      key={decade}
                      onClick={() =>
                        setSelectedDecade((prev) => (prev === decade ? null : decade))
                      }
                      className={`font-mono text-xs px-3 py-1.5 border ${
                        selectedDecade === decade
                          ? 'bg-ink text-paper border-ink'
                          : 'border-rule text-ink/70 hover:border-ink'
                      }`}
                    >
                      {decade}s
                    </button>
                  ))}
                </div>
              </div>

              {activeFilterCount > 0 && (
                <button
                  onClick={clearFilters}
                  className="font-mono text-xs uppercase tracking-widest text-stamp hover:text-clay underline mt-6"
                >
                  Clear filters
                </button>
              )}
            </div>
          )}

          <p className="font-cutive text-ink/60 text-center mt-10">
            or explore freely!
          </p>

          <div className="flex items-center justify-center gap-3 mt-8 mb-2">
            <label className="font-mono text-xs uppercase tracking-widest text-stamp">
              Sort by
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="font-mono text-xs border border-rule bg-paper px-3 py-2 focus:outline-none focus:border-ink"
            >
              <option value="random">Random</option>
              <option value="newest">Newest first</option>
              <option value="oldest">Oldest first</option>
              <option value="az">A–Z</option>
            </select>
          </div>
        </div>
      </Container>

      {displayedItems.length === 0 ? (
        <Container>
          <p className="font-cutive text-ink/60 text-center pb-24">
            No items match your search or filters.
          </p>
        </Container>
      ) : (
        <div className="w-full px-4 md:px-8">
          <div className="max-w-7xl mx-auto pb-8">
            <MasonryColumns
              key={`${filterKey}-mobile`}
              items={visibleItems}
              numCols={2}
              onItemClick={openItem}
              className="grid grid-cols-2 gap-2 md:hidden"
            />
            <MasonryColumns
              key={`${filterKey}-desktop`}
              items={visibleItems}
              numCols={4}
              onItemClick={openItem}
              className="hidden md:grid md:grid-cols-4 gap-2"
            />
          </div>

          {hasMore && (
            <div className="text-center pb-16">
              <button
                onClick={() => setVisibleCount((prev) => prev + PAGE_SIZE)}
                className="font-mono text-xs uppercase tracking-widest border border-ink px-6 py-3 hover:bg-ink hover:text-paper transition-colors"
              >
                Load more
              </button>
              <p className="font-mono text-xs text-ink/40 mt-3">
                Showing {visibleItems.length} of {displayedItems.length}
              </p>
            </div>
          )}
        </div>
      )}

      <Container>
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
        activeIndex={activeGroup ? activePosition : -1}
        onClose={closeItem}
        onNavigate={handleNavigate}
        groupTitle={activeMeta?.groupTitle}
        credit={activeMeta?.credit}
        setSlug={activeMeta?.isCollectionGroup ? activeGroup : null}
      />
    </main>
  )
}