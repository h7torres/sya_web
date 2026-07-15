import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import Container from '../components/Container.jsx'

// import.meta.glob scans a folder at build time and imports every
// matching file automatically — so dropping a new photo into
// src/assets/gallery/ is enough to make it eligible for Featured,
// with no manual list to update.
// eager: true means the images are imported immediately (rather than
// lazily, which would require await and is meant for code-splitting
// large apps — unnecessary for a handful of images).
const imageModules = import.meta.glob('../assets/gallery/*.{jpg,jpeg,png,webp}', {
  eager: true,
})

// Each entry's key is the file path (e.g. '../assets/gallery/beyer-blvd-78.jpg')
// and its value is the module, whose .default is the actual usable image
// path/URL. We also turn the filename into a rough alt text as a fallback —
// replacing dashes/underscores with spaces and capitalizing — until real
// captions exist per-image (at that point this could switch to reading
// from src/data/gallery/*.js instead, matched by filename).
const featuredImages = Object.entries(imageModules).map(([path, mod], index) => {
  const filename = path.split('/').pop().replace(/\.(jpg|jpeg|png|webp)$/i, '')
  const altGuess = filename.replace(/[-_]/g, ' ')
  return {
    id: index,
    src: mod.default,
    alt: altGuess.charAt(0).toUpperCase() + altGuess.slice(1),
  }
})

// Fisher-Yates shuffle — picks a random remaining item for each slot,
// swapping as it goes, so every ordering is equally likely.
function shuffle(array) {
  const result = [...array]
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[result[i], result[j]] = [result[j], result[i]]
  }
  return result
}

export default function Home() {
  const shuffledImages = useMemo(() => shuffle(featuredImages), [])

  return (
    <main>
      <Container>
        <div className="pt-16 pb-8 flex justify-center">
          <Link
            to="/library"
            className="font-mono text-xs uppercase tracking-widest border border-ink px-6 py-3 hover:bg-ink hover:text-paper transition-colors"
          >
            Explore the Archive
          </Link>
        </div>

        <div className="pb-16">
          <h1 className="sr-only">San Ysidro Archive</h1>

          <h2 className="font-mono text-2xl text-ink mb-2 text-left">
            Our Mission
          </h2>
          <p className="font-cutive max-w-2xl text-left text-ink/80 leading-relaxed">
            The San Ysidro Archive serves as a living repository for the
            countercultural histories of 92173. By documenting local
            activism, joy, and resilience, the archive curates a
            communal memory that thrives independently of the border.
          </p>

          <h2 className="font-mono text-2xl text-ink mt-6 mb-2 max-w-2xl ml-auto text-right">
            Nuestra Misión
          </h2>
          <p className="font-cutive max-w-2xl ml-auto text-right text-ink/80 leading-relaxed">
            El Archivo de San Ysidro es un repositorio de las historias
            contraculturales del área 92173. Al documentar el activismo,
            la alegría y la resiliencia de San Ysidro, el archivo
            cultiva una memoria comunitaria que prospera
            independientemente de la frontera.
          </p>
        </div>

        {shuffledImages.length > 0 && (
          <section className="pb-24">
            <h2 className="font-mono text-xs uppercase tracking-widest text-stamp mb-6">
              Featured
            </h2>
            <div className="columns-2 md:columns-3 gap-4">
              {shuffledImages.map((img) => (
                <img
                  key={img.id}
                  src={img.src}
                  alt={img.alt}
                  className="w-full mb-4 break-inside-avoid rounded-sm"
                />
              ))}
            </div>
          </section>
        )}

        <section className="pb-24 border-t border-rule pt-16 text-center">
          <h2 className="font-mono text-2xl text-ink mb-3">
            Have something to share?
          </h2>
          <p className="font-cutive max-w-xl mx-auto text-ink/80 leading-relaxed mb-6">
            Photos, videos, documents, or objects — if it tells a piece of
            San Ysidro's story, the archive wants it.
          </p>
          <Link
            to="/contact"
            className="inline-block font-mono text-xs uppercase tracking-widest border border-ink px-6 py-3 hover:bg-ink hover:text-paper transition-colors"
          >
            Submit to the Archive
          </Link>
        </section>
      </Container>
    </main>
  )
}