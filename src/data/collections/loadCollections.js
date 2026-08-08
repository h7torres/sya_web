// Scans src/assets/collections/ — each subfolder is one collection,
// its images shown in sequence (like a document set) but browsed via
// its own /collections/:slug page rather than the Library tab.
import collectionMeta from './meta.js'

const collectionModules = import.meta.glob(
  '../../assets/collections/*/*.{jpg,jpeg,png,webp}',
  { eager: true }
)

function filenameFromPath(path) {
  return path.split('/').pop().replace(/\.(jpg|jpeg|png|webp)$/i, '')
}

function titleCase(str) {
  const spaced = str.replace(/[-_]/g, ' ')
  return spaced.charAt(0).toUpperCase() + spaced.slice(1)
}

// Group every image by its parent folder name (the collection's slug).
const grouped = {}
for (const [path, mod] of Object.entries(collectionModules)) {
  const parts = path.split('/')
  const slug = parts[parts.length - 2]
  const filename = filenameFromPath(path)
  if (!grouped[slug]) grouped[slug] = []
  grouped[slug].push({ filename, src: mod.default })
}

export const collectionsList = Object.entries(grouped).map(([slug, images]) => {
  const sorted = [...images].sort((a, b) => a.filename.localeCompare(b.filename))
  const meta = collectionMeta[slug] || {}
  const coverImage = meta.coverFilename
    ? sorted.find((img) => img.filename === meta.coverFilename) || sorted[0]
    : sorted[0]
  return {
    slug,
    title: meta.title || titleCase(slug),
    description: meta.description || null,
    tags: meta.tags || [],
    date: meta.date || null,
    cover: coverImage.src,
    images: sorted,
  }
})

export function getCollection(slug) {
  return collectionsList.find((c) => c.slug === slug) || null
}