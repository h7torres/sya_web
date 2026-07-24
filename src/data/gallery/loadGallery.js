import captions from './captions.js'
import groupMeta from './groups.js'
import { imageSets } from './index.js'

const imageModules = import.meta.glob('../../assets/gallery/**/*.{jpg,jpeg,png,webp}', {
  eager: true,
})

function titleCase(str) {
  const spaced = str.replace(/[-_]/g, ' ')
  return spaced.charAt(0).toUpperCase() + spaced.slice(1)
}

function getGroupTitle(folderName) {
  const meta = groupMeta[folderName]
  if (!meta) return titleCase(folderName)
  return typeof meta === 'string' ? meta : meta.title
}

function isGroupCollection(folderName) {
  const meta = groupMeta[folderName]
  return typeof meta === 'object' && meta.isCollection === true
}

function getGroupTags(folderName) {
  const meta = groupMeta[folderName]
  if (!meta || typeof meta === 'string') return []
  return meta.tags || []
}

// Finds the first 4-digit year (19xx or 20xx) anywhere in a string and
// rounds it down to its decade, e.g. "San Ysidro, 1958" -> 1950.
function extractDecade(text) {
  if (!text) return null
  const match = text.match(/(19|20)\d{2}/)
  if (!match) return null
  const year = parseInt(match[0], 10)
  return Math.floor(year / 10) * 10
}

// Resolves a decade for an item: an explicit `decade` field always
// wins (for genuinely undated items you've researched by hand);
// otherwise, tries to auto-detect a year from whatever text is
// available, in order, and falls back to null if nothing's found.
function resolveDecade(explicitDecade, ...fallbackTexts) {
  if (explicitDecade) return explicitDecade
  for (const text of fallbackTexts) {
    const found = extractDecade(text)
    if (found) return found
  }
  return null
}

function getGroupDecade(folderName) {
  const meta = groupMeta[folderName]
  const explicit = typeof meta === 'object' ? meta.decade : null
  const title = getGroupTitle(folderName)
  return resolveDecade(explicit, title, folderName)
}

export const flatImages = Object.entries(imageModules).map(([path, mod], index) => {
  const relPath = path.split('gallery/')[1]
  const key = relPath.replace(/\.(jpg|jpeg|png|webp)$/i, '')
  const parts = relPath.split('/')
  const filename = parts[parts.length - 1].replace(/\.(jpg|jpeg|png|webp)$/i, '')
  const folderName = parts.length > 1 ? parts[0] : null

  const rawEntry = Object.prototype.hasOwnProperty.call(captions, key)
    ? captions[key]
    : null
  const fallback = folderName ? getGroupTitle(folderName) : titleCase(filename)

  let caption = fallback
  let photographer = null
  let tags = []
  let explicitDecade = null
  if (typeof rawEntry === 'string') {
    caption = rawEntry
  } else if (rawEntry && typeof rawEntry === 'object') {
    caption = rawEntry.caption || fallback
    photographer = rawEntry.photographer || null
    tags = rawEntry.tags || []
    explicitDecade = rawEntry.decade || null
  }

  // Standalone photos with no captions.js entry of their own inherit
  // their folder's tags, if they belong to one.
  if (folderName && tags.length === 0) {
    tags = getGroupTags(folderName)
  }

  // Try the photo's own caption/key first; only fall back to the
  // folder's decade if the individual photo didn't yield one itself.
  const decade = folderName
    ? resolveDecade(explicitDecade, caption, key) || getGroupDecade(folderName)
    : resolveDecade(explicitDecade, caption, key)

  return {
    id: `photo-${index}`,
    key,
    src: mod.default,
    caption,
    photographer,
    tags,
    decade,
    group: folderName || `standalone-${index}`,
    groupTitle: folderName ? getGroupTitle(folderName) : null,
    isCollectionGroup: folderName ? isGroupCollection(folderName) : false,
    credit: null,
    isSet: false,
  }
})

export const setCovers = imageSets.map((set) => ({
  id: `set-${set.slug}`,
  key: `set-${set.slug}`,
  src: set.cover,
  caption: set.title,
  photographer: null,
  tags: set.tags || [],
  decade: resolveDecade(set.decade, set.title, set.credit, set.slug),
  group: `set-${set.slug}`,
  groupTitle: set.title,
  credit: set.credit,
  isSet: true,
  isCollectionGroup: false,
  images: set.images,
}))

export const allItems = [...flatImages, ...setCovers]

export function shuffle(array) {
  const result = [...array]
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[result[i], result[j]] = [result[j], result[i]]
  }
  return result
}

export function getDocumentPages(groupKey) {
  const set = setCovers.find((s) => s.group === groupKey)
  if (!set) return []
  return set.images.map((img, i) => ({
    id: `${groupKey}-${i}`,
    src: img.src,
    caption: set.caption,
  }))
}