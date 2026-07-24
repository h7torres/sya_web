// Optional human-readable titles for gallery/ subfolders — themed
// photo groups browsed via the lightbox (as opposed to gallery-sets/,
// which are sequential documents like newsletters with their own
// dedicated page). If a folder isn't listed here, its name is
// auto-formatted as a fallback, so this is optional polish, not
// required for a group to work.
//
// tags: pull from src/data/gallery/categories.js — every photo in
// this folder shares these tags.
// year / yearRange: use `year` for a single year, `yearRange` as
// [start, end] if the group spans multiple years. Leave both null
// if unknown.
const groupMeta = {
  'trolley-dev-80s': {
    title: 'San Ysidro Trolley Development, 1980s',
    isCollection: true,
    tags: ['Urban Development'],
    year: null,
    yearRange: [1980, 1989],
  },
  'trolley-dev-90s': {
    title: 'San Ysidro Trolley, 1990s',
    isCollection: true,
    tags: ['Urban Development'],
    year: null,
    yearRange: [1990, 1999],
  },
}

export default groupMeta