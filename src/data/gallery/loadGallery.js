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
  if (typeof rawEntry === 'string') {
    caption = rawEntry
  } else if (rawEntry && typeof rawEntry === 'object') {
    caption = rawEntry.caption || fallback
    photographer = rawEntry.photographer || null
  }

  return {
    id: `photo-${index}`,
    key,
    src: mod.default,
    caption,
    photographer,
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