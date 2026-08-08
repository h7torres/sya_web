// Metadata for each collection, keyed by folder slug under
// src/assets/collections/<slug>/. Mirrors src/data/gallery/sets.js —
// one central file for titles/descriptions/tags rather than a
// hand-written file per collection, so adding a new collection is
// just: compress its images into archive-master/collections/<slug>/,
// run the compress script, and add one entry here.
//
// coverFilename: optional — the filename (no extension) of the image
// to use as this collection's header/thumbnail. Defaults to whichever
// image sorts first alphabetically if left out.
const collectionMeta = {
  'bernardos-legacy': {
    title: "Bernardo's Legacy",
    description:
      'November 1970: the creation of the Larsen Field Sports Complex — proposals, meeting minutes, and correspondence documenting the effort to build San Ysidro\u2019s sports park.',
    tags: ['Urban Development'],
    date: '1970-11-01',
    coverFilename: '5.jpg',
  },
}

export default collectionMeta