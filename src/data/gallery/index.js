// Scans src/assets/gallery-sets/ — sequential documents (newsletter
// issues, programs, booklets) where page order matters and there's a
// dedicated page to browse the whole thing in sequence. This is
// separate from src/assets/gallery/, which Gallery.jsx scans directly
// for the freely-browsable lightbox grid.
import setMeta from './sets.js'

const setModules = import.meta.glob('../../assets/gallery-sets/*/*.{jpg,jpeg,png,webp}', {
  eager: true,
})

function filenameFromPath(path) {
  return path.split('/').pop().replace(/\.(jpg|jpeg|png|webp)$/i, '')
}

function titleCase(str) {
  const spaced = str.replace(/[-_]/g, ' ')
  return spaced.charAt(0).toUpperCase() + spaced.slice(1)
}

// Group every image by its parent folder name (the set's slug).
const grouped = {}
for (const [path, mod] of Object.entries(setModules)) {
  const parts = path.split('/')
  const slug = parts[parts.length - 2]
  const filename = filenameFromPath(path)
  if (!grouped[slug]) grouped[slug] = []
  grouped[slug].push({ filename, src: mod.default })
}

export const imageSets = Object.entries(grouped).map(([slug, images]) => {
  const sorted = [...images].sort((a, b) => a.filename.localeCompare(b.filename))
  const meta = setMeta[slug] || {}
  return {
    slug,
    title: meta.title || titleCase(slug),
    credit: meta.credit || null,
    cover: sorted[0].src,
    images: sorted,
  }
})