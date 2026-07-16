// Automatically loads every neighbor file in this folder — same
// pattern as the gallery image scanning. Add a new neighbor by
// creating a new file here (e.g. maria-lopez.js) following the shape
// in andres-preciado.js; nothing else needs to change.
const modules = import.meta.glob('./*.js', { eager: true })

const neighbors = Object.entries(modules)
  .filter(([path]) => !path.endsWith('/index.js'))
  .map(([, mod]) => mod.default)

export default neighbors