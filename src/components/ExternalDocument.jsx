// Embeds a PDF (or other viewable document) hosted elsewhere — same
// idea as ExternalVideo, but with a taller, document-shaped aspect
// ratio instead of widescreen. See src/utils/driveEmbed.js for the URL
// parsing, shared between the two.
import { getDriveEmbedUrl } from '../utils/driveEmbed.js'

export default function ExternalDocument({ src, title, className = '' }) {
  const embedUrl = getDriveEmbedUrl(src)

  if (!embedUrl) return null

  return (
    <div className={`w-full aspect-[3/4] ${className}`}>
      <iframe
        src={embedUrl}
        title={title || 'Document'}
        className="w-full h-full border border-rule"
      />
    </div>
  )
}