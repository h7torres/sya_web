import { useParams, Link } from 'react-router-dom'
import Container from '../components/Container.jsx'
import { imageSets } from '../data/gallery/index.js'

export default function GallerySet() {
  const { slug } = useParams()
  const set = imageSets.find((s) => s.slug === slug)

  if (!set) {
    return (
      <main>
        <Container>
          <div className="py-16">
            <p className="font-cutive text-ink/60 mb-4">Set not found.</p>
            <Link
              to="/gallery"
              className="font-mono text-xs uppercase tracking-widest text-stamp hover:text-clay"
            >
              ← Back to Gallery
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
            to="/gallery"
            className="font-mono text-xs uppercase tracking-widest text-stamp hover:text-clay"
          >
            ← Back to Gallery
          </Link>
          <h1 className="font-mono text-2xl text-ink mt-4 mb-1">
            {set.title}
          </h1>
          {set.credit && (
            <p className="font-mono text-xs text-ink/50 mb-10">{set.credit}</p>
          )}
          {!set.credit && <div className="mb-10" />}

          <div className="columns-2 md:columns-3 gap-4">
            {set.images.map((img) => (
              <div key={img.filename} className="mb-4 break-inside-avoid">
                <img src={img.src} alt={set.title} className="w-full rounded-sm" />
              </div>
            ))}
          </div>
        </div>
      </Container>
    </main>
  )
}