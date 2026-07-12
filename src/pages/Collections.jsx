// Grouped projects/subtabs (e.g. the Nosotros series). When a :slug
// param is present (/collections/nosotros-series) this should render
// that single collection's detail view instead of the full list.
// Data source: src/data/collections/*.js — see collections/README.md.
import Container from '../components/Container.jsx'

export default function Collections() {
  return (
    <main>
      <Container>
        <div className="py-16">
          <h1 className="font-mono text-4xl text-ink">Collections</h1>
        </div>
      </Container>
    </main>
  )
}