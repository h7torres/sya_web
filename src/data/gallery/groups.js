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

   'san-ysidro-video-project-2': {
    title: 'San Ysidro Video Project by Carlos Luna, 2024',
    description:'What started as a test of my new 10mm lens, led to an impromptu video project. In the video I combine videos and photos I took around San Ysidro BLVD on January 2024. I sketched a couple of mysterious creatures and added them to some of the shots and photos in an attempt to add something interesting and eye-catching - Carlos Luna @sanysidrocam',
    isCollection: true,
    year: 2024,
    yearRange: [2020,2029],
    tags: ['Arts and Culture']
  }
}

export default groupMeta