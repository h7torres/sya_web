// Embeds a video that's hosted elsewhere (Google Drive, and easy to
// extend to other hosts later) — the file itself is never stored in
// this repo. See src/utils/driveEmbed.js for the URL parsing, which
// is shared with ExternalDocument.
import { getDriveEmbedUrl } from '../utils/driveEmbed.js'

export default function ExternalVideo({ src, title, className = '' }) {
  const embedUrl = getDriveEmbedUrl(src)

  if (!embedUrl) return null

  return (
    <div className={`w-full aspect-video ${className}`}>
      <iframe
        src={embedUrl}
        title={title || 'Video'}
        className="w-full h-full border border-rule"
        allow="autoplay"
        allowFullScreen
      />
    </div>
  )
}