import { useState } from 'react'
import { NavLink, Link } from 'react-router-dom'
import logo from '../assets/sya_one_line.png'

const leftLinks = [
  { to: '/library', label: 'Library' },
  { to: '/collections', label: 'Collections' },
]

const rightLinks = [
  { to: '/neighbors', label: 'Neighbors' },
  { to: '/community', label: 'Community' },
]

const allLinks = [...leftLinks, ...rightLinks]

function NavItem({ to, label, onClick }) {
  return (
    <NavLink
      to={to}
      onClick={onClick}
      className={({ isActive }) =>
        `font-mono text-xs uppercase tracking-widest pb-1 border-b ${
          isActive
            ? 'text-ink border-clay'
            : 'text-stamp border-transparent hover:border-stamp'
        }`
      }
    >
      {label}
    </NavLink>
  )
}

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="sticky top-4 z-40 px-4 md:px-8">
      <div className="max-w-6xl mx-auto border border-ink bg-paper/90 backdrop-blur-sm shadow-sm">
        <div className="px-4 md:px-6">
          {/* Mobile: logo left, single Menu toggle right */}
          <nav className="relative flex lg:hidden items-center justify-between py-4">
            <Link to="/" className="relative inline-block group overflow-hidden shrink-0 min-w-0">
              <img src={logo} alt="San Ysidro Archive" className="h-6 w-auto block" />
            </Link>

            <button
              onClick={() => setMenuOpen((prev) => !prev)}
              className="font-mono text-xs uppercase tracking-widest text-ink shrink-0"
            >
              {menuOpen ? 'Close' : 'Menu'}
            </button>

            {menuOpen && (
              <div className="absolute top-full right-0 mt-2 w-56 bg-paper/95 backdrop-blur-sm border border-ink py-6 px-6 flex flex-col items-end gap-4 shadow-lg">                {allLinks.map((link) => (
                  <NavItem
                    key={link.to}
                    to={link.to}
                    label={link.label}
                    onClick={() => setMenuOpen(false)}
                  />
                ))}
                <Link
                  to="/contact"
                  onClick={() => setMenuOpen(false)}
                  className="font-mono text-xs uppercase tracking-widest border border-ink px-3 py-1.5 hover:bg-ink hover:text-paper transition-colors"
                >
                  Contact
                </Link>
              </div>
            )}
          </nav>

          {/* Desktop: single tight row */}
          <nav className="hidden lg:flex items-center justify-center gap-8 py-4">
            {leftLinks.map((link) => (
              <NavItem key={link.to} to={link.to} label={link.label} />
            ))}

            <Link to="/" className="relative inline-block group overflow-hidden mx-4 shrink-0">
              <img src={logo} alt="San Ysidro Archive" className="h-8 w-auto block" />
              <div className="absolute inset-0 bg-paper/0 group-hover:bg-paper/70 transition-colors duration-200 flex items-center justify-center">
                <span className="font-mono text-xs uppercase tracking-widest text-ink opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  Home
                </span>
              </div>
            </Link>

            {rightLinks.map((link) => (
              <NavItem key={link.to} to={link.to} label={link.label} />
            ))}

            <Link
              to="/contact"
              className="font-mono text-xs uppercase tracking-widest border border-ink px-4 py-2 ml-6 hover:bg-ink hover:text-paper transition-colors whitespace-nowrap shrink-0"
            >
              Contact
            </Link>
          </nav>
        </div>
      </div>
    </header>
  )
}