import { useMemo, useState } from 'react'

type TextSection = {
  kind: 'text'
  body: string
}

type FillGapSection = {
  kind: 'fill-gap'
  prompt: string
  sentence: string
  answer: string
}

type MultipleChoiceSection = {
  kind: 'multiple-choice'
  question: string
  options: string[]
  correctIndex: number
}

type Section = TextSection | FillGapSection | MultipleChoiceSection

type Material = {
  id: string
  label: string
  sections: [TextSection, FillGapSection, MultipleChoiceSection]
}

const ORIGINAL: Material = {
  id: 'original',
  label: 'Original',
  sections: [
    {
      kind: 'text',
      body: 'Fractions show parts of a whole. In 3/5, the top number shows how many parts are taken, and the bottom number shows how many equal parts the whole has.',
    },
    {
      kind: 'fill-gap',
      prompt: 'Fill in the gap:',
      sentence: 'The fraction 4/6 means 4 parts out of ____ equal parts.',
      answer: '6',
    },
    {
      kind: 'multiple-choice',
      question: 'Which fraction is equal to one half?',
      options: ['2/4', '2/3', '3/5', '4/5'],
      correctIndex: 0,
    },
  ],
}

const EASIER: Material = {
  id: 'easier',
  label: 'Easier Version',
  sections: [
    {
      kind: 'text',
      body: 'A fraction tells us about equal parts. In 3/5, the 3 means we take 3 parts. The 5 means the whole has 5 equal parts.',
    },
    {
      kind: 'fill-gap',
      prompt: 'Fill in one number:',
      sentence: 'In 2/7, the whole has ____ equal parts.',
      answer: '7',
    },
    {
      kind: 'multiple-choice',
      question: 'Which one is one half?',
      options: ['1/2', '1/3', '1/4'],
      correctIndex: 0,
    },
  ],
}

const PROGRESS = [
  'Reading original worksheet...',
  'Applying easier version prompt...',
  'Building adapted variant...',
]

function renderSection(section: Section) {
  if (section.kind === 'text') {
    return <p className="section-text">{section.body}</p>
  }

  if (section.kind === 'fill-gap') {
    return (
      <div className="exercise">
        <p className="exercise-prompt">{section.prompt}</p>
        <p>{section.sentence}</p>
        <p className="exercise-answer">Answer: {section.answer}</p>
      </div>
    )
  }

  return (
    <div className="exercise">
      <p className="exercise-prompt">{section.question}</p>
      <ol type="A">
        {section.options.map((option, index) => (
          <li
            key={option}
            className={index === section.correctIndex ? 'correct' : ''}
          >
            {option}
          </li>
        ))}
      </ol>
    </div>
  )
}

export default function App() {
  const [materials, setMaterials] = useState<Material[]>([ORIGINAL])
  const [menuOpen, setMenuOpen] = useState(false)
  const [prompt, setPrompt] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [progressIndex, setProgressIndex] = useState(-1)
  const [toast, setToast] = useState('')

  const progressText = useMemo(() => {
    if (progressIndex < 0) return ''
    return PROGRESS[progressIndex] ?? 'Finalizing...'
  }, [progressIndex])

  const showToast = () => {
    setToast('This function is not implemented in this demo.')
    window.setTimeout(() => setToast(''), 2200)
  }

  const generateEasier = () => {
    if (
      isGenerating ||
      materials.some((material) => material.id === EASIER.id)
    ) {
      setMenuOpen(false)
      return
    }

    setIsGenerating(true)
    setProgressIndex(0)
    window.setTimeout(() => setProgressIndex(1), 600)
    window.setTimeout(() => setProgressIndex(2), 1200)
    window.setTimeout(() => {
      setMaterials((current) => [...current, EASIER])
      setIsGenerating(false)
      setProgressIndex(-1)
      setMenuOpen(false)
    }, 1900)
  }

  return (
    <main className="app">
      <header className="header">
        <div>
          <p className="eyebrow">Worksheet Prototype</p>
          <h1>Fractions - Grade 6</h1>
        </div>
        <div className="header-actions">
          <button onClick={showToast} type="button">
            Save
          </button>
        </div>
      </header>

      <section className="workspace">
        <div className="variants-scroll">
          <div className="variants-row">
            {materials.map((material) => (
              <article className="variant" key={material.id}>
                <h2>{material.label}</h2>
                {material.sections.map((section) => (
                  <section
                    className="block"
                    key={`${material.id}-${section.kind}`}
                  >
                    {renderSection(section)}
                  </section>
                ))}
              </article>
            ))}
          </div>
        </div>

        <aside
          className={`right-panel ${menuOpen || isGenerating ? 'active' : ''}`}
        >
          <button
            aria-expanded={menuOpen}
            aria-label="Create variant"
            className="plus"
            onClick={() => setMenuOpen((open) => !open)}
            type="button"
          >
            +
          </button>

          {menuOpen ? (
            <div className="menu">
              <label htmlFor="prompt">Prompt</label>
              <textarea
                id="prompt"
                onChange={(event) => setPrompt(event.target.value)}
                placeholder="Describe how to adapt the worksheet..."
                value={prompt}
              />
              <div className="suggestions">
                <button
                  onClick={() =>
                    setPrompt('Use easy language and short sentences.')
                  }
                  type="button"
                >
                  easy language
                </button>
                <button
                  onClick={() => {
                    setPrompt(
                      'Create an easier version for learners with difficulties.',
                    )
                    generateEasier()
                  }}
                  type="button"
                >
                  easier version
                </button>
              </div>
              <button
                className="generate"
                disabled={isGenerating}
                onClick={generateEasier}
                type="button"
              >
                Generate variant
              </button>
            </div>
          ) : null}

          {isGenerating ? <p className="status">{progressText}</p> : null}
        </aside>
      </section>

      {toast ? <div className="toast">{toast}</div> : null}
    </main>
  )
}
