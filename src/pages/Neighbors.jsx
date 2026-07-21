import { useParams, Link } from 'react-router-dom'
import Container from '../components/Container.jsx'
import NeighborAvatar from '../components/NeighborAvatar.jsx'
import neighbors from '../data/neighbors/index.js'

function NeighborsList() {
  return (
    <div className="py-16">
      <h1 className="font-mono text-2xl text-ink mb-2">The people of San Ysidro</h1>
      

      {neighbors.length === 0 ? (
        <p className="font-cutive text-ink/60">
          No neighbors added yet — add a file to src/data/neighbors/.
        </p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-10">
          {neighbors.map((neighbor) => (
            <Link key={neighbor.id} to={`/neighbors/${neighbor.id}`} className="group">
              <NeighborAvatar neighbor={neighbor} className="w-full aspect-square" />
              <p className="font-mono text-sm text-ink mt-3 group-hover:text-clay">
                {neighbor.name}
              </p>
              <p className="font-mono text-xs text-stamp uppercase tracking-widest">
                {neighbor.role}
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

function NeighborProfile({ neighbor }) {
  return (
    <div className="py-16 max-w-2xl">
      <Link
        to="/neighbors"
        className="font-mono text-xs uppercase tracking-widest text-stamp hover:text-clay"
      >
        ← Back to Neighbors
      </Link>

      <div className="mt-6 flex flex-col md:flex-row gap-8 items-start">
        <NeighborAvatar neighbor={neighbor} className="w-40 h-40 shrink-0" />
        <div>
          <h1 className="font-mono text-2xl text-ink">{neighbor.name}</h1>
          <p className="font-mono text-xs text-stamp uppercase tracking-widest mt-1">
            {neighbor.role}
          </p>
          <p className="font-cutive text-ink/80 leading-relaxed mt-4">
            {neighbor.bio}
          </p>
        </div>
      </div>

      {neighbor.interview && (
        <div className="mt-12">
          <h2 className="font-mono text-xs uppercase tracking-widest text-stamp mb-3">
            Interview
          </h2>
          <p className="font-cutive text-ink/80 leading-relaxed whitespace-pre-line">
            {neighbor.interview}
          </p>
        </div>
      )}

      {neighbor.contributions?.length > 0 && (
        <div className="mt-12">
          <h2 className="font-mono text-xs uppercase tracking-widest text-stamp mb-3">
            Contributions
          </h2>
          <ul className="space-y-2">
            {neighbor.contributions.map((c) => (
              <li key={c.url}>
                <a
                  href={c.url}
                  target={c.url.startsWith('http') ? '_blank' : undefined}
                  rel={c.url.startsWith('http') ? 'noopener noreferrer' : undefined}
                  className="font-mono text-sm text-stamp hover:text-clay"
                >
                  {c.label}
                </a>
                <span className="font-mono text-xs text-ink/50 ml-2">
                  {c.type}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

export default function Neighbors() {
  const { slug } = useParams()

  if (!slug) {
    return (
      <main>
        <Container>
          <NeighborsList />
        </Container>
      </main>
    )
  }

  const neighbor = neighbors.find((n) => n.id === slug)

  return (
    <main>
      <Container>
        {neighbor ? (
          <NeighborProfile neighbor={neighbor} />
        ) : (
          <div className="py-16">
            <p className="font-cutive text-ink/60 mb-4">Neighbor not found.</p>
            <Link
              to="/neighbors"
              className="font-mono text-xs uppercase tracking-widest text-stamp hover:text-clay"
            >
              ← Back to Neighbors
            </Link>
          </div>
        )}
      </Container>
    </main>
  )
}