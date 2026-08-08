// Collections are folders of sequential images (like a document set)
// browsed on their own dedicated page, separate from the Library grid.
// Data source: src/data/collections/ — see collections/README.md.
import { useState, useEffect } from 'react'
import { useParams, useSearchParams, Link } from 'react-router-dom'
import Container from '../components/Container.jsx'
import Lightbox from '../components/Lightbox.jsx'
import { collectionsList, getCollection } from '../data/collections/loadCollections.js'

function CollectionsList() {
  return (
    <div className="pt-24 md:pt-25 pb-16">
      <h1 className="font-mono text-3xl text-ink mb-6 text-center">Collections</h1>
      <p className="font-cutive text-ink/80 text-center max-w-2xl mx-auto leading-relaxed mb-20">
        Grouped series and ongoing projects from the archive — curated
        sets of photos, documents, and stories organized around a
        single theme.
      </p>

      {collectionsList.length === 0 ? (
        <p className="font-cutive text-ink/60 text-center">
          No collections added yet.
        </p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-10 max-w-5xl mx-auto">
          {collectionsList.map((collection) => (
            <Link
              key={collection.slug}
              to={`/collections/${collection.slug}`}
              className="group text-center"
            >
              <div className="w-full aspect-[3/4] overflow-hidden border border-rule group-hover:border-ink transition-colors">
                <img
                  src={collection.cover}
                  alt={collection.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <p className="font-mono text-base text-ink mt-4 group-hover:text-clay transition-colors">
                {collection.title}
              </p>
              <p className="font-mono text-xs text-stamp uppercase tracking-widest mt-1">
                {collection.images.length} {collection.images.length === 1 ? 'page' : 'pages'}
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

function CollectionDetail({ slug }) {
  const collection = getCollection(slug)
  const [activeIndex, setActiveIndex] = useState(-1)
  const [searchParams] = useSearchParams()

  useEffect(() => {
    if (!collection) return
    const targetKey = searchParams.get('image')
    if (!targetKey) return
    const pos = collection.images.findIndex((img) => img.filename === targetKey)
    if (pos !== -1) setActiveIndex(pos)
  }, [searchParams, collection])

  if (!collection) {
    return (
      <div className="pt-24 md:pt-25 pb-16">
        <p className="font-cutive text-ink/60 mb-4">Collection not found.</p>
        <Link
          to="/collections"
          className="font-mono text-xs uppercase tracking-widest text-stamp hover:text-clay"
        >
          ← Back to Collections
        </Link>
      </div>
    )
  }

  function openImage(index) {
    setActiveIndex(index)
    window.history.replaceState(
      null,
      '',
      `?image=${collection.images[index].filename}`
    )
  }

  function closeImage() {
    setActiveIndex(-1)
    window.history.replaceState(null, '', window.location.pathname)
  }

  function handleNavigate(direction) {
    const total = collection.images.length
    setActiveIndex((prev) => (prev + direction + total) % total)
  }

  return (
    <div className="pt-24 md:pt-25 pb-16">
      <Link
        to="/collections"
        className="font-mono text-xs uppercase tracking-widest text-stamp hover:text-clay"
      >
        ← Back to Collections
      </Link>

      <h1
        className={`font-mono text-2xl text-ink mt-4 text-center ${
          collection.description ? 'mb-2' : 'mb-10'
        }`}
      >
        {collection.title}
      </h1>
      {collection.description && (
        <p className="font-cutive text-ink/80 max-w-2xl mx-auto text-center leading-relaxed mb-10">
          {collection.description}
        </p>
      )}

      <div className="max-w-2xl mx-auto mb-10">
        <img
          src={collection.cover}
          alt={collection.title}
          className="w-full rounded-sm"
        />
      </div>

      <div className="columns-2 md:columns-3 gap-4">
        {collection.images.map((img, index) => (
          <button
            key={img.filename}
            onClick={() => openImage(index)}
            className="block w-full mb-4 break-inside-avoid text-left"
          >
            <img src={img.src} alt={collection.title} className="w-full rounded-sm" />
          </button>
        ))}
      </div>

      <Lightbox
        images={collection.images.map((img) => ({ src: img.src, caption: collection.title }))}
        activeIndex={activeIndex}
        onClose={closeImage}
        onNavigate={handleNavigate}
        groupTitle={collection.title}
      />
    </div>
  )
}

export default function Collections() {
  const { slug } = useParams()

  return (
    <main>
      <Container>
        {slug ? <CollectionDetail slug={slug} /> : <CollectionsList />}
      </Container>
    </main>
  )
}