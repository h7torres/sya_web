// The "everything" tab: a searchable, scrollable index of every item on
// the site — collection entries, gallery images, neighbor profiles, and
// any library-only posts that don't belong anywhere else.
//
// Once content exists, this page will import every item from
// src/data/**, merge them into one array, and render a search/filter UI
// over the combined list. See src/data/schema.js for the shared fields
// every item type needs so they can all be searched the same way.
import Container from '../components/Container.jsx'

export default function Library() {
  return (
    <main>
      <Container>
        <div className="py-16">
          <h1 className="font-mono text-4xl text-ink">Library</h1>
        </div>
      </Container>
    </main>
  )
}