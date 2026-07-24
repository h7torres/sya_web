import { useState, useEffect, useMemo } from 'react'
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

export default function Library() {
  const [activeGroup, setActiveGroup] = useState(null)
  const [activePosition, setActivePosition] = useState(0)
  const [searchParams] = useSearchParams()

  const [searchQuery, setSearchQuery] = useState('')
  const [selectedTags, setSelectedTags] = useState([])
  const [selectedDecade, setSelectedDecade] = useState(null)
  const [sortBy, setSortBy] = useState('random')
  const [filtersOpen, setFiltersOpen] = useState(false)

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
        <div className="py-16">
          <h1 className="font-mono text-3xl text-ink mb-8 text-center">
            Explore The Archive
          </h1>

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

          <p className="font-cutive text-ink/60 text-center mt-4">
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

        {displayedItems.length === 0 ? (
          <p className="font-cutive text-ink/60 text-center pb-24">
            No items match your search or filters.
          </p>
        ) : (
          <div className="columns-2 md:columns-4 gap-4 pb-16">
            {displayedItems.map((item) => (
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
        onClose={closeItem}
        onNavigate={handleNavigate}
        groupTitle={activeMeta?.groupTitle}
        credit={activeMeta?.credit}
        setSlug={activeMeta?.isCollectionGroup ? activeGroup : null}
      />
    </main>
  )
}