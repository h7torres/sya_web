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
}

export default captions