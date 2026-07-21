// The fixed set of categories images and sets can be tagged with.
// Keeping this as one list (rather than letting tags be freeform)
// means every tag used in captions.js/sets.js is guaranteed to match
// exactly — important once these get used for filtering later, since
// a typo'd tag would just silently never match anything.
const categories = [
  'Arts and Culture',
  'Border',
  'Changing San Ysidro',
  'Community Celebrations',
  'Education',
  'People',
  'Urban Development',
]

export default categories