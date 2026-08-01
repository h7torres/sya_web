import Container from '../components/Container.jsx'

const terms = [
  {
    heading: 'Respectful use only.',
    body: 'Materials in this archive may be viewed, studied, and shared for educational, personal, and community purposes. They may not be used to mock, defame, or misrepresent the people, places, or events depicted.',
  },
  {
    heading: 'Attribution required.',
    body: 'When referencing or sharing any item from the archive, please credit the San Ysidro Archive and, where known, the original contributor or source (for example, Courtesy of the San Ysidro Archive, donated by Name or Family).',
  },
  {
    heading: 'No commercial use.',
    body: 'Items may not be sold, licensed, or used in commercial products, advertising, or for-profit publications without prior written consent from the Archive and, where applicable, the original donor.',
  },
  {
    heading: 'Personal and family materials require extra care.',
    body: 'Many items were donated by residents and may depict private individuals in non-public moments. These materials may not be reproduced, altered, or redistributed outside the archive without explicit permission.',
  },
  {
    heading: 'No alteration of archival materials.',
    body: 'Items may not be edited, cropped, or manipulated in ways that change their meaning or context when shared publicly.',
  },
  {
    heading: 'Right to request removal.',
    body: 'Contributors or their families may request that an item be removed, restricted, or anonymized at any time. The Archive will honor such requests promptly.',
  },
  {
    heading: 'Good-faith contributions.',
    body: 'By submitting materials, contributors affirm they have the right to share them and understand the mission of documenting activism, joy, and resilience in San Ysidro.',
  },
]

export default function TermsOfUse() {
  return (
    <main>
      <Container>
        <div className="pt-24 md:pt-25 pb-16 max-w-2xl">
          <h1 className="font-mono text-3xl text-ink mb-16 text-center">
            Terms of Use
          </h1>

          <p className="font-cutive text-ink/80 leading-relaxed">
            The San Ysidro Archive was built with the intention of creating
            a central library of San Ysidro from the perspective of its own
            residents and neighbors. Every piece featured in our archive is
            carefully selected with our mission of documenting local
            activism, joy, and resilience in mind. Items that are submitted
            to the archive range from public newspaper clippings, to
            personal home archives donated by San Ysidro residents.
            Consequently, while the archive permits public access to the
            library, we strongly encourage abiding by our terms of use.
          </p>

          <ol className="mt-10 space-y-6">
            {terms.map((term, i) => (
              <li key={term.heading} className="flex gap-3">
                <span className="font-mono text-ink/50 shrink-0">
                  {i + 1}.
                </span>
                <p className="font-cutive text-ink/80 leading-relaxed">
                  <span className="font-bold text-ink">{term.heading}</span>{' '}
                  {term.body}
                </p>
              </li>
            ))}
          </ol>

          <p className="font-cutive text-ink/80 leading-relaxed mt-14">
            This archive exists because San Ysidro residents trusted us
            with their stories. If you have questions about using an item,
            want to request a correction or removal, or want to share
            feedback, please reach out to us at{' '}
            <a href="mailto:sanysidroarchive@gmail.com" className="hover:text-clay underline">sanysidroarchive@gmail.com</a>.
          </p>
        </div>
      </Container>
    </main>
  )
}