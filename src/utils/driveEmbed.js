// Shared by ExternalVideo and ExternalDocument — Google Drive's
// /preview embed format works for video, PDFs, and most other file
// types it can render a viewer for. Accepts either a full Drive share
// URL (https://drive.google.com/file/d/FILE_ID/view?usp=sharing) or a
// bare file ID.
export function getDriveEmbedUrl(source) {
  if (!source) return null

  // Bare file ID (no slashes/protocol) — used as-is.
  if (!/[:/]/.test(source)) {
    return `https://drive.google.com/file/d/${source}/preview`
  }

  try {
    const parsed = new URL(source)
    if (!parsed.hostname.includes('drive.google.com')) return null

    // .../file/d/FILE_ID/view or /preview
    const fileMatch = parsed.pathname.match(/\/file\/d\/([^/]+)/)
    if (fileMatch) return `https://drive.google.com/file/d/${fileMatch[1]}/preview`

    // .../open?id=FILE_ID or .../uc?id=FILE_ID
    const idParam = parsed.searchParams.get('id')
    if (idParam) return `https://drive.google.com/file/d/${idParam}/preview`
  } catch {
    return null
  }

  return null
}