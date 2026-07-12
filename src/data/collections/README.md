# Collections

One file per collection, e.g. `nosotros-series.js`, exporting an object
matching `collectionShape` from `../schema.js`.

Each collection's `items` array holds the posts/images grouped under it.
Those same images can also appear in `../gallery/` (tagged with this
collection's id) so the Gallery tab can show them too without
duplicating the source files.