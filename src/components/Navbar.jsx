import { NavLink, Link } from 'react-router-dom'
import Container from './Container.jsx'
import logo from '../assets/sya_one_line.png'

const links = [
  { to: '/library', label: 'Library' },
  { to: '/collections', label: 'Collections' },
  { to: '/gallery', label: 'Gallery' },
  { to: '/neighbors', label: 'Neighbors' },
  { to: '/contact', label: 'Contact' },
]

export default function Navbar() {
  return (
    <header className="border-b border-rule">
      <Container>
        <nav className="flex flex-col items-center gap-4 py-8">
          <Link to="/" className="relative inline-block group overflow-hidden">
            <img src={logo} alt="San Ysidro Archive" className="h-8 w-auto block" />
            <div className="absolute inset-0 bg-paper/0 group-hover:bg-paper/70 transition-colors duration-200 flex items-center justify-center">
              <span className="font-mono text-xs uppercase tracking-widest text-ink opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                Home
              </span>
            </div>
          </Link>
          <ul className="flex flex-wrap justify-center gap-x-6 gap-y-2">
            {links.map((link) => (
              <li key={link.to}>
                <NavLink
                  to={link.to}
                  className={({ isActive }) =>
                    `font-mono text-xs uppercase tracking-widest pb-1 border-b ${
                      isActive
                        ? 'text-ink border-clay'
                        : 'text-stamp border-transparent hover:border-stamp'
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </Container>
    </header>
  )
}