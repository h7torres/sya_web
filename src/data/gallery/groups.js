// groupMeta values can be either:
//   - a plain string: just a title, browsed via lightbox only (default)
//   - an object { title, isCollection: true }: also gets its own
//     dedicated /library/:slug page, e.g. for themed photo sets like
//     the trolley development photos.
const groupMeta = {
  'trolley-dev-80s': {
    title: 'San Ysidro Trolley Development, 1980s',
    isCollection: true,
  },
  'trolley-dev-90s': {
    title: 'San Ysidro Trolley, 1990s',
    isCollection: true,
  },
}

export default groupMeta