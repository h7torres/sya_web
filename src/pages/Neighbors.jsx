import { useParams, Link } from 'react-router-dom'
import Container from '../components/Container.jsx'
import NeighborAvatar from '../components/NeighborAvatar.jsx'
import neighbors from '../data/neighbors/index.js'
import React from 'react'

const visibleNeighbors = neighbors.filter((n) => n.photo)

function NeighborsList() {
  return (
    <div className="py-16">
      <h1 className="font-mono text-2xl text-ink mb-2"> Meet The People of San Ysidro!</h1>

      {visibleNeighbors.length === 0 ? (
        <p className="font-cutive text-ink/60">
          No neighbors added yet — add a file to src/data/neighbors/.
        </p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-10">
          {visibleNeighbors.map((neighbor) => (
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

function getYoutubeEmbedUrl(url) {
  if (!url) return null

  let videoId = null

  try {
    const parsed = new URL(url)
    if (parsed.hostname.includes('youtu.be')) {
      videoId = parsed.pathname.slice(1)
    } else if (parsed.hostname.includes('youtube.com')) {
      videoId = parsed.searchParams.get('v')
    }
  } catch {
    return null
  }

  return videoId ? `https://www.youtube.com/embed/${videoId}` : null
}

function ContributionLink({ contribution }) {
  const isExternal = contribution.url.startsWith('http')
  return (
    <div>
      {React.createElement(
        'a',
        {
          href: contribution.url,
          target: isExternal ? '_blank' : undefined,
          rel: isExternal ? 'noopener noreferrer' : undefined,
          className: 'font-mono text-sm text-stamp hover:text-clay underline',
        },
        contribution.label
      )}
      <span className="font-mono text-xs text-ink/50 ml-2">
        {contribution.type}
      </span>
    </div>
  )
}

function NeighborProfile({ neighbor }) {
  const embedUrl = getYoutubeEmbedUrl(neighbor.interview)

  return (
    <div className="py-16 max-w-5xl">
      <Link
        to="/neighbors"
        className="font-mono text-xs uppercase tracking-widest text-stamp hover:text-clay"
      >
        ← Back to Neighbors
      </Link>

      <div className="mt-6 flex flex-col md:flex-row gap-8 items-start">
        <NeighborAvatar neighbor={neighbor} className="w-full md:w-96 md:h-96 shrink-0" />
        <div>
          <h1 className="font-mono text-2xl text-ink">{neighbor.name}</h1>
          <p className="font-mono text-xs text-stamp uppercase tracking-widest mt-1">
            {neighbor.role}
          </p>
          <p className="font-cutive text-ink/80 leading-relaxed mt-4">
            {neighbor.bio}
          </p>

          {neighbor.contributions?.length > 0 && (
            <div className="mt-8 space-y-2">
              {neighbor.contributions.map((c) => (
                <ContributionLink key={c.url} contribution={c} />
              ))}
            </div>
          )}
        </div>
      </div>

      <hr className="border-rule my-12" />

      <div>
        <h2 className="font-mono text-xl text-ink mb-1">Hear From Them!</h2>
        <p className="font-cutive text-ink/60 text-sm mb-6">
          {embedUrl
            ? `Watch ${neighbor.name}'s interview below.`
            : 'Interview coming soon.'}
        </p>

        {embedUrl ? (
          <div className="w-full aspect-video">
            <iframe
              src={embedUrl}
              title={`${neighbor.name} interview`}
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        ) : (
          <div className="w-full aspect-video bg-paper border border-rule flex items-center justify-center">
            <p className="font-mono text-xs text-ink/40 uppercase tracking-widest">
              Video not yet available
            </p>
          </div>
        )}
      </div>

      <hr className="border-rule my-12" />

      <p className="font-mono text-xs text-ink/50 text-center">
        {neighbor.name}'s contributions to the archive will appear here.
      </p>
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
  const isVisible = neighbor && neighbor.photo

  return (
    <main>
      <Container>
        {isVisible ? (
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