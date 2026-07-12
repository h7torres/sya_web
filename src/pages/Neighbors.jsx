// Contributor profiles. Each neighbor's page links out to their actual
// contributions wherever those live (a collection, gallery images, or
// both) rather than duplicating that content here. When a :slug param
// is present, render that one contributor's profile instead of the
// full list. Data source: src/data/neighbors/*.js.
import Container from '../components/Container.jsx'

export default function Neighbors() {
  return (
    <main>
      <Container>
        <div className="py-16">
          <h1 className="font-mono text-4xl text-ink">Featured Neighbors</h1>
        </div>
      </Container>
    </main>
  )
}