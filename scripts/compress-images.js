// scripts/compress-images.js
//
// Reads from archive-master/ (full-res originals, gitignored) and
// writes compressed, web-ready copies into src/assets/, routed
// based on which subfolder they came from:
//
//   archive-master/standalone/*.jpg        -> src/assets/gallery/*.jpg
//   archive-master/groups/<name>/*.jpg     -> src/assets/gallery/<name>/*.jpg
//   archive-master/documents/<name>/*.jpg  -> src/assets/gallery-sets/<name>/*.jpg
//   archive-master/covers/<neighbor-id>.jpg -> src/assets/neighbors/<neighbor-id>.jpg
//
// Run: node scripts/compress-images.js

import sharp from 'sharp'
import fs from 'fs'
import path from 'path'

const ROOT = process.cwd()
const MASTER_DIR = path.join(ROOT, 'archive-master')
const GALLERY_DIR = path.join(ROOT, 'src/assets/gallery')
const GALLERY_SETS_DIR = path.join(ROOT, 'src/assets/gallery-sets')
const NEIGHBORS_DIR = path.join(ROOT, 'src/assets/neighbors')

const MAX_DIMENSION = 1800
const QUALITY = 78
const VALID_EXT = /\.(jpe?g|png)$/i

let processedCount = 0
let skippedCount = 0

async function compressFile(inputPath, outputPath) {
  fs.mkdirSync(path.dirname(outputPath), { recursive: true })

  await sharp(inputPath)
    .rotate() // auto-orient from EXIF, then strips metadata
    .resize({
      width: MAX_DIMENSION,
      height: MAX_DIMENSION,
      fit: 'inside',
      withoutEnlargement: true,
    })
    .jpeg({ quality: QUALITY, mozjpeg: true })
    .toFile(outputPath)

  processedCount++
  console.log(`  ✓ ${path.basename(inputPath)} -> ${path.relative(ROOT, outputPath)}`)
}

function outputNameFor(filename) {
  return filename.replace(VALID_EXT, '.jpg')
}

async function processStandalone() {
  const dir = path.join(MASTER_DIR, 'standalone')
  if (!fs.existsSync(dir)) return

  console.log('\nStandalone photos:')
  const files = fs.readdirSync(dir).filter((f) => VALID_EXT.test(f))

  for (const file of files) {
    const inputPath = path.join(dir, file)
    const outputPath = path.join(GALLERY_DIR, outputNameFor(file))
    if (fs.existsSync(outputPath)) {
      skippedCount++
      continue
    }
    await compressFile(inputPath, outputPath)
  }
}

async function processGroups() {
  const dir = path.join(MASTER_DIR, 'groups')
  if (!fs.existsSync(dir)) return

  const groupFolders = fs.readdirSync(dir).filter((f) =>
    fs.statSync(path.join(dir, f)).isDirectory()
  )

  for (const groupName of groupFolders) {
    console.log(`\nGroup: ${groupName}`)
    const groupDir = path.join(dir, groupName)
    const files = fs.readdirSync(groupDir).filter((f) => VALID_EXT.test(f))

    for (const file of files) {
      const inputPath = path.join(groupDir, file)
      const outputPath = path.join(GALLERY_DIR, groupName, outputNameFor(file))
      if (fs.existsSync(outputPath)) {
        skippedCount++
        continue
      }
      await compressFile(inputPath, outputPath)
    }
  }
}

async function processDocuments() {
  const dir = path.join(MASTER_DIR, 'documents')
  if (!fs.existsSync(dir)) return

  const setFolders = fs.readdirSync(dir).filter((f) =>
    fs.statSync(path.join(dir, f)).isDirectory()
  )

  for (const setName of setFolders) {
    console.log(`\nDocument set: ${setName}`)
    const setDir = path.join(dir, setName)
    const files = fs.readdirSync(setDir).filter((f) => VALID_EXT.test(f))

    for (const file of files) {
      const inputPath = path.join(setDir, file)
      const outputPath = path.join(GALLERY_SETS_DIR, setName, outputNameFor(file))
      if (fs.existsSync(outputPath)) {
        skippedCount++
        continue
      }
      await compressFile(inputPath, outputPath)
    }
  }
}

async function processCovers() {
  const dir = path.join(MASTER_DIR, 'covers')
  if (!fs.existsSync(dir)) return

  console.log('\nNeighbor covers:')
  const files = fs.readdirSync(dir).filter((f) => VALID_EXT.test(f))

  for (const file of files) {
    const inputPath = path.join(dir, file)
    const outputPath = path.join(NEIGHBORS_DIR, outputNameFor(file))
    if (fs.existsSync(outputPath)) {
      skippedCount++
      continue
    }
    await compressFile(inputPath, outputPath)
  }
}

async function main() {
  if (!fs.existsSync(MASTER_DIR)) {
    console.error(`No archive-master/ folder found at ${MASTER_DIR}`)
    process.exit(1)
  }

  console.log('Compressing images from archive-master/ ...')

  await processStandalone()
  await processGroups()
  await processDocuments()
  await processCovers()

  console.log(`\nDone. ${processedCount} compressed, ${skippedCount} already existed and were skipped.`)
  if (processedCount > 0) {
    console.log('Remember: new documents need an entry in sets.js, new groups need one in groups.js, new covers need photo imports wired into their neighbor files, and captions.js can be updated for any of these.')
  }
}

main()