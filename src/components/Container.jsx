// Keeps page content centered with generous, consistent side margins.
// Every page wraps its content in this instead of repeating the same
// max-width/padding classes on every page — one place to adjust the
// site's overall whitespace feel later.
export default function Container({ children }) {
  return <div className="max-w-5xl mx-auto px-6 md:px-10">{children}</div>
}