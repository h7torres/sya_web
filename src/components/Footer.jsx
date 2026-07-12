import Container from './Container.jsx'

export default function Footer() {
  return (
    <footer className="border-t border-rule mt-40">
      <Container>
        <div className="py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-2">
          <p className="font-mono text-xs text-ink/60">
            © {new Date().getFullYear()} San Ysidro Archive
          </p>
          <div className="flex gap-6">
            <a
              href="https://instagram.com/sanysidroarchive"
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-xs uppercase tracking-widest text-ink/60 text-stamp hover:text-clay"
            >
              Instagram
            </a>
            <a
              href="mailto:sanysidroarchive@gmail.com"
              className="font-mono text-xs uppercase tracking-widest text-ink/60 text-stamp hover:text-clay"
            >
              Email
            </a>
          </div>
        </div>
      </Container>
    </footer>
  )
}