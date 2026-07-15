import Container from '../components/Container.jsx'

// One object per Q&A pair — makes it easy to add, remove, or reorder
// questions later without touching the layout/markup below.
const faqs = [
  {
    question: 'What materials can I submit?',
    answer: 'The archive welcomes all media types.',
  },
  {
    question: 'What should I include in my submission?',
    answer:
      "Please include the owner's name, the media's approximate date created, and a description of the media.",
  },
  {
    question: 'How will the media be shared?',
    answer:
      'By emailing your media, the archive has permission to publish the media on all platforms including, but not limited to:',
    list: [
      'San Ysidro Archive Instagram',
      'San Ysidro Archive Website',
      'San Ysidro Archive Zine',
      'San Ysidro Archive Digital Repository',
    ],
  },
]

export default function Contact() {
  return (
    <main>
      <Container>
        <div className="py-16 max-w-2xl">
          <h1 className="font-mono text-2xl uppercase tracking-wide text-ink mb-10">
            Submit to the Archive
          </h1>

          <div className="space-y-10">
            {faqs.map((faq) => (
              <div key={faq.question}>
                <h2 className="font-mono font-bold uppercase tracking-wide text-ink mb-2">
                  {faq.question}
                </h2>
                <p className="font-mono uppercase tracking-wide text-ink/80 leading-relaxed">
                  {faq.answer}
                </p>
                {faq.list && (
                  <ul className="mt-3 space-y-1">
                    {faq.list.map((item) => (
                      <li
                        key={item}
                        className="font-mono uppercase tracking-wide text-ink/80 pl-5 relative before:content-['•'] before:absolute before:left-0"
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>

          <div className="mt-14">
            <h2 className="font-mono font-bold uppercase tracking-wide text-ink mb-2">
              Questions?
            </h2>
            <p className="font-mono uppercase tracking-wide text-ink/80">
              Email{' '}
              <a
                href="mailto:sanysidroarchive@gmail.com"
                className="hover:text-clay"
              >
                sanysidroarchive@gmail.com
              </a>
            </p>
            <p className="font-mono uppercase tracking-wide text-ink/80 mt-4">
              or
            </p>
            <p className="font-mono uppercase tracking-wide text-ink/80 mt-4">
              DM{' '}
              <a
                href="https://instagram.com/sanysidroarchive"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-clay"
              >
                @sanysidroarchive
              </a>{' '}
              on Instagram
            </p>
          </div>
        </div>
      </Container>
    </main>
  )
}