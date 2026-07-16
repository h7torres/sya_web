// Example/placeholder neighbor entry — replace with real bios as they
// come in. Delete this file once real neighbor content exists, or keep
// it as a template for the shape every neighbor file should follow.
//
// photo: optional. If you don't have a photo yet, leave this as null —
// the Neighbors page shows a placeholder initials box instead of
// breaking. Once you have a photo, add it to src/assets/neighbors/ and
// uncomment the import below.
//
// import photo from '../../assets/neighbors/andres-preciado.jpg'

const neighbor = {
  id: 'andres-preciado',
  name: 'Andres Preciado',
  role: 'Photographer',
  bio: 'Photographer documenting everyday life in San Ysidro.',
  photo: null, // or the imported photo above
  interview: '',
  contributions: [
    {
      label: 'Andres Preciado Portfolio',
      type: 'External site',
      url: 'https://h7torres.github.io/andres-portfolio',
    },
  ],
}

export default neighbor