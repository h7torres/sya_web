// Maps an image's filename (without the extension) to its caption.
// Gallery.jsx and Home's Featured section both scan every image in
// src/assets/gallery/ automatically — this file just supplies the real
// caption for any photo that has one ready.
//
// To add a caption: find the exact filename in src/assets/gallery/
// (e.g. "beyer-blvd-1978.jpg"), then add a line below using that name
// without its extension as the key:
//
//   'beyer-blvd-1978': 'Storefront on Beyer Boulevard, 1978',
//
// Photos with no entry here yet will fall back to a plain-text guess
// based on their filename, so nothing breaks while captions are still
// being added — just come back and add a line whenever a caption is
// ready for a given photo.
const captions = {
  // 'example-filename': 'Example caption text',
  'sy-map-1958': {
    caption: 'Map of San Ysidro, 1958',
    tags: ['Border', 'Urban Development'],
  },

  'portofentry1920': {
  caption: 'San Ysidro Port of Entry, 1920',
  tags: ['Border', 'Urban Development'],
  },

  'trolley-dev-80s': {
    caption: 'Trolley Development, 1980s',
    tags: ['Urban Development'],
  },

  'sy-wants-university-1978': {
    caption: 'San Ysidro Wants a University, 1978',
    tags: ['Education'],
  },

  'JoeSerranoYSuComboLatino.Undated': {
    caption: 'Joe Serrano Y Su Combo Latino',
    tags: ['Arts and Culture'],
  },

  'sy-school-1955': {
    caption: 'San Ysidro Citizen, 1955',
    tags: ['Education'],
  }

  


}

export default captions