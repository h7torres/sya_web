# Collections

A collection is a folder of sequential images (like a document set)
browsed on its own dedicated page at `/collections/<slug>`, rather than
mixed into the regular Library grid.

**To add a new collection:**
1. Compress its images: drop originals into
   `archive-master/collections/<slug>/`, then run
   `node scripts/compress-images.js` — they land in
   `src/assets/collections/<slug>/`.
2. Add one entry to `meta.js`, keyed by that same `<slug>`, with a
   `title`, `description`, `tags`, and `date`.

That's it — `loadCollections.js` scans `src/assets/collections/`
automatically, sorts each folder's images by filename, and merges in
the metadata from `meta.js`. No per-collection code needed.