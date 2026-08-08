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
    video: 'https://drive.google.com/file/d/109qSGcZEebyCbYxUFqdgfgYvaWy5YeOI/view?usp=drive_link',
    year: 2024,
    yearRange: [2020,2029],
    tags: ['Arts and Culture']
   },
   'Father-and-Son by-Giavanna-Ortiz-de-Candia, 2024': {
    title: 'Father and Son by Giavanna Ortiz de Candia, 2024',
    description: 'While I was roaming the streets of San Ysidro, I came across a completely motionless child on top of a stack of pallets. The child’s father was nearby holding plastic bags and assured me the kid was just napping. Naturally I didn’t inquire further and asked if I could take their picture.',
    isCollection: true,
    year: 2024,
    yearRange: [2020,2029],
    tags: ['Arts and Culture']
   },
   'Árbol-de-la-Vida-Tree-of-Life-by-Victor-Ochoa, 1995': {
    title: 'Árbol de la Vida/Tree of Life by Victor Ochoa',
    description: 'Commissioned for the Community of San Ysidro and the Citizens of San Diego through the City of San Diego Commission for Arts and Culture. ',
    isCollection: true,
    year: 1995,
    yearRange: [1990,1999],
    tags: ['Arts and Culture']
   },
   'San-Ysidro-Street-Photography, 2020' :{
    title: 'San Ysidro Street Photography by Carlos Luna',
    description: 'Here is a series of photos taken by Carlos Luna (@sanysidrocam) from 2021 - 2026, documenting the streets of San Ysidro.',
    year: 2024,
    isCollection: true,
    yearRange:[2020,2029],
    tags: ['Arts and Culture']
   }
}

export default groupMeta