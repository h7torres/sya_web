// Photo grid of every image on the site — both images that belong to a
// collection and standalone images that don't. Data source:
// src/data/gallery/*.js — see gallery/README.md for the shape.
import Container from '../components/Container.jsx'

export default function Gallery() {
  return (
    <main>
      <Container>
        <div className="py-16">
          <h1 className="font-display text-4xl text-ink">Gallery</h1>
        </div>
      </Container>
    </main>
  )
}