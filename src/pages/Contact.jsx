import Container from '../components/Container.jsx'

export default function Contact() {
  return (
    <main>
      <Container>
        <div className="py-16">
          <h1 className="font-mono text-4xl text-ink mb-4">Contact</h1>
          <a
            href="mailto:sanysidroarchive@gmail.com"
            className="font-mono text-sm text-stamp hover:text-clay"
          >
            sanysidroarchive@gmail.com
          </a>
        </div>
      </Container>
    </main>
  )
}