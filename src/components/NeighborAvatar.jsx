// Shared between the Neighbors page and Home's preview section.
// Shows a real photo if one exists, otherwise falls back to a
// bordered initials box so the layout never looks broken while real
// photos are still being added.
export default function NeighborAvatar({ neighbor, className }) {
  if (neighbor.photo) {
    return (
      <img
        src={neighbor.photo}
        alt={neighbor.name}
        className={`${className} object-cover`}
      />
    )
  }
  const initials = neighbor.name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
  return (
    <div
      className={`${className} bg-paper border border-ink flex items-center justify-center`}
    >
      <span className="font-display text-2xl text-ink">{initials}</span>
    </div>
  )
}