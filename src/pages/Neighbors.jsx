import { useParams, Link } from 'react-router-dom'
import Container from '../components/Container.jsx'
import NeighborAvatar from '../components/NeighborAvatar.jsx'
import neighbors from '../data/neighbors/index.js'
import React from 'react'

const visibleNeighbors = neighbors.filter((n) => n.photo)

function NeighborsList() {
  return (
    <div className="pt-24 md:pt-25  pb-16">
      <h1 className="font-mono text-3xl text-ink mb-5 text-center">
        Neighbors
      </h1>

      <p className="font-cutive text-ink/80 text-center max-w-2xl mx-auto leading-relaxed mb-20">
        These are the people who make San Ysidro what it is, business
        owners, artists, longtime residents, and everyone in between.
        Get to know their stories below.
      </p>


      {visibleNeighbors.length === 0 ? (
        <p className="font-cutive text-ink/60">
          No neighbors added yet — add a file to src/data/neighbors/.
        </p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-10 mt-10">
          {visibleNeighbors.map((neighbor) => (
            <Link
              key={neighbor.id}
              to={`/neighbors/${neighbor.id}`}
              className="group text-center"
            >
              <NeighborAvatar
                neighbor={neighbor}
                className="w-full aspect-square border border-rule group-hover:border-ink transition-colors"
              />
              <p className="font-mono text-base text-ink mt-4 group-hover:text-clay transition-colors">
                {neighbor.name}
              </p>
              {neighbor.role && (
                <p className="font-mono text-[10px] text-stamp/50 uppercase tracking-widest mt-1">
                  {neighbor.role}
                </p>
              )}
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