// Grouped projects/subtabs (e.g. the Nosotros series). When a :slug
// param is present (/collections/nosotros-series) this should render
// that single collection's detail view instead of the full list.
// Data source: src/data/collections/*.js — see collections/README.md.
import Container from '../components/Container.jsx'

export default function Collections() {
  return (
    <main>
      <Container>
        <div className="pt-24 md:pt-25 pb-16">
          <h1 className="font-mono text-3xl text-ink mb-5 text-center">Collections</h1>
          <p className="font-cutive text-ink/80 text-center max-w-2xl mx-auto leading-relaxed mb-20">
            Grouped series and ongoing projects from the archive. Curated
            sets of photos, documents, and stories organized into one place.
          </p>
        </div>
      </Container>
    </main>
  )
}