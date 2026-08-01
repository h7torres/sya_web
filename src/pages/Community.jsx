import Container from '../components/Container.jsx'

export default function Community() {
  return (
    <main>
      <Container>
        <div className="pt-24 md:pt-25 pb-16">
          <h1 className="font-mono text-3xl text-ink mb-5 text-center">Community</h1>
          <p className="font-cutive text-ink/80 text-center max-w-2xl mx-auto leading-relaxed mb-20">
            Stay up to date with what is going on in the neighborhood through 
            upcoming events, recent happenings, or ways to get involved.
          </p>
        </div>
      </Container>
    </main>
  )
}