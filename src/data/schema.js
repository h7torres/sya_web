// This file is documentation, not code that runs — it describes the
// shared shape every content item should follow, so the Library page
// can search/display items from completely different folders the same
// way. When real content gets added, each item is a plain JS object
// matching one of these shapes.

// Fields every item shares, regardless of type. This is what powers
// the Library tab's search: it can search `title`, `tags`, and
// `description` across all item types without caring what the rest
// of the object looks like.
export const baseItemFields = {
  id: 'string — unique, used in URLs (e.g. "nosotros-series")',
  type: 'string — one of: "collection", "image", "neighbor", "post"',
  title: 'string',
  description: 'string — short, one or two sentences',
  tags: 'string[] — for search/filter',
  date: 'string — ISO date, for sorting',
}

// src/data/collections/*.js
export const collectionShape = {
  ...baseItemFields, // type: 'collection'
  coverImage: 'string — path to a representative image',
  items: 'array — the posts/images that belong to this collection',
}

// src/data/gallery/*.js
export const imageShape = {
  ...baseItemFields, // type: 'image'
  src: 'string — path to the image file',
  alt: 'string — accessibility text',
  collection: 'string | null — id of the collection this belongs to, or null if standalone',
}

// src/data/neighbors/*.js
export const neighborShape = {
  ...baseItemFields, // type: 'neighbor'
  photo: 'string — path to a portrait/profile image',
  bio: 'string',
  contributions: 'array — { type: "collection" | "image", id: string } references to their work, resolved and linked to on the neighbor page rather than duplicated',
}

// src/data/posts/*.js — for anything library-only, with no home in
// Collections, Gallery, or Neighbors.
export const postShape = {
  ...baseItemFields, // type: 'post'
  body: 'string — the post content',
}