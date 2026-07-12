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
          <Link to="/">
            <img src={logo} alt="San Ysidro Archive" className="h-6 w-auto" />
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