import { Fragment, useMemo, useState } from 'react'

type TextSection = {
  kind: 'text'
  body: string
}

type FillGapSection = {
  kind: 'fill-gap'
  prompt: string
  comparisons?: {
    left: string
    right: string
    answer: '<' | '>' | '='
  }[]
  singleChoice?: {
    label: string
    question: string
    options: [string, string]
    correctIndex: number
  }[]
}

type MultipleChoiceSection = {
  kind: 'multiple-choice'
  question: string
  pairs: {
    left: string
    right: string
    correct: 'left' | 'right'
  }[]
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
      body: 'Comparing Fractions: Fractions can have different numerators and denominators. To compare them, think about the size of each piece and how many pieces are taken. Example: 1/2 > 1/4 because halves are larger than quarters.',
    },
    {
      kind: 'fill-gap',
      prompt: 'Exercise 1 - Write <, >, or =.',
      comparisons: [
        { left: '1/2', right: '3/6', answer: '=' },
        { left: '2/3', right: '3/4', answer: '<' },
        { left: '5/8', right: '1/2', answer: '>' },
      ],
    },
    {
      kind: 'multiple-choice',
      question: 'Exercise 2 - Circle the larger fraction in each pair.',
      pairs: [
        { left: '2/5', right: '3/5', correct: 'right' },
        { left: '3/4', right: '5/8', correct: 'left' },
        { left: '1/3', right: '2/7', correct: 'left' },
      ],
    },
  ],
}

const EASIER: Material = {
  id: 'easier',
  label: 'Easier Version',
  sections: [
    {
      kind: 'text',
      body: `Let us compare fractions step by step.

A fraction has a top number and a bottom number.
The bottom number tells us how big each piece is.
The top number tells us how many pieces we have.

If two fractions have the same bottom number, the one with the bigger top number is larger.
If two fractions have the same top number, the one with the smaller bottom number is larger because the pieces are bigger.

Example: 1/2 is bigger than 1/4, because half pieces are bigger than quarter pieces.
Another example: 3/5 is bigger than 2/5, because both use fifths and 3 pieces are more than 2 pieces.`,
    },
    {
      kind: 'fill-gap',
      prompt: '',
      singleChoice: [
        {
          label: 'Exercise 1',
          question: 'Which fraction is bigger?',
          options: ['1/2', '1/4'],
          correctIndex: 0,
        },
        {
          label: 'Exercise 2',
          question: 'Which fraction is bigger?',
          options: ['2/5', '3/5'],
          correctIndex: 1,
        },
      ],
    },
    {
      kind: 'multiple-choice',
      question: 'Exercise 3 - Easy subtasks: choose the bigger fraction.',
      pairs: [
        { left: '1/3', right: '1/2', correct: 'right' },
        { left: '2/6', right: '4/6', correct: 'right' },
        { left: '3/8', right: '2/8', correct: 'left' },
      ],
    },
  ],
}

const PROGRESS = [
  'Reading original worksheet...',
  'Applying easier version prompt...',
  'Building adapted variant...',
]

function renderFraction(value: string) {
  const [numerator, denominator] = value.split('/')
  if (!numerator || !denominator) return <span>{value}</span>

  return (
    <span className="fraction">
      <span>{numerator}</span>
      <span className="fraction-line" />
      <span>{denominator}</span>
    </span>
  )
}

function renderSection(section: Section) {
  if (section.kind === 'text') {
    return <p className="section-text">{section.body}</p>
  }

  if (section.kind === 'fill-gap') {
    if (section.singleChoice) {
      return (
        <div className="exercise">
          <p className="exercise-prompt">{section.prompt}</p>
          <ol className="choice-pairs grouped-choices" type="A">
            {section.singleChoice.map((item) => (
              <li key={`${item.question}-${item.options.join('-')}`}>
                <span className="exercise-subtitle">{item.label}</span>
                <span>{item.question}</span>
                <span className={item.correctIndex === 0 ? 'correct' : ''}>
                  {renderFraction(item.options[0])}
                </span>
                <span className="or-text">or</span>
                <span className={item.correctIndex === 1 ? 'correct' : ''}>
                  {renderFraction(item.options[1])}
                </span>
              </li>
            ))}
          </ol>
        </div>
      )
    }

    return (
      <div className="exercise">
        <p className="exercise-prompt">{section.prompt}</p>
        <ol className="comparison-list">
          {section.comparisons?.map((item) => (
            <li key={`${item.left}-${item.right}`}>
              {renderFraction(item.left)}
              <span className="answer-box" aria-hidden="true">
                □
              </span>
              {renderFraction(item.right)}
            </li>
          ))}
        </ol>
      </div>
    )
  }

  return (
    <div className="exercise">
      <p className="exercise-prompt">{section.question}</p>
      <ol className="choice-pairs" type="A">
        {section.pairs.map((pair) => (
          <li key={`${pair.left}-${pair.right}`}>
            <span className={pair.correct === 'left' ? 'correct' : ''}>
              {renderFraction(pair.left)}
            </span>
            <span className="or-text">or</span>
            <span className={pair.correct === 'right' ? 'correct' : ''}>
              {renderFraction(pair.right)}
            </span>
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

  const generatedMaterial = materials.find(
    (material) => material.id !== ORIGINAL.id,
  )
  const hasGeneratedMaterial = Boolean(generatedMaterial)
  const sectionRows = generatedMaterial
    ? ORIGINAL.sections.map((section, index) => ({
        key: section.kind,
        original: section,
        generated: generatedMaterial.sections[index] ?? section,
      }))
    : []

  const progressText = useMemo(() => {
    if (progressIndex < 0) return ''
    return PROGRESS[progressIndex] ?? 'Finalizing...'
  }, [progressIndex])

  const showSavedToast = () => {
    setToast('Material is saved.')
    window.setTimeout(() => setToast(''), 2000)
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
          <div className="title-with-preview">
            <h1>Fractions - Grade 6</h1>
          </div>
        </div>
        <div className="header-actions">
          <button
            className="save-button"
            onClick={showSavedToast}
            type="button"
          >
            <span aria-hidden="true">💾</span>
            <span>Save</span>
          </button>
        </div>
      </header>

      <section className="workspace">
        <div className="variants-scroll">
          {generatedMaterial ? (
            <div className="sections-grid" role="presentation">
              <div className="title-with-preview">
                <h2 className="variant-title">{ORIGINAL.label}</h2>
                <button className="preview-button" type="button">
                  Preview
                </button>
              </div>
              <div className="title-with-preview">
                <h2 className="variant-title">{generatedMaterial.label}</h2>
                <button className="preview-button" type="button">
                  Preview
                </button>
              </div>
              <div className="add-rail" />

              {sectionRows.map((row, index) => (
                <Fragment key={`row-${row.key}`}>
                  <section
                    className="block"
                    contentEditable
                    suppressContentEditableWarning
                    key={`${ORIGINAL.id}-${row.key}`}
                  >
                    {renderSection(row.original)}
                  </section>
                  <section
                    className="block"
                    contentEditable
                    suppressContentEditableWarning
                    key={`${generatedMaterial.id}-${row.key}`}
                  >
                    {renderSection(row.generated)}
                  </section>
                  {index === 0 ? (
                    <div className="add-rail" key="add-rail-main">
                      <button
                        aria-expanded={menuOpen}
                        aria-label="Create variant"
                        className="plus"
                        onClick={() => setMenuOpen((open) => !open)}
                        type="button"
                      >
                        +
                      </button>
                    </div>
                  ) : (
                    <div
                      className="add-rail spacer"
                      key={`add-rail-spacer-${row.key}`}
                    />
                  )}
                </Fragment>
              ))}
            </div>
          ) : (
            <div className="variants-row">
              <article className="variant" key={ORIGINAL.id}>
                <div className="title-with-preview">
                  <h2>{ORIGINAL.label}</h2>
                  <button className="preview-button" type="button">
                    Preview
                  </button>
                </div>
                {ORIGINAL.sections.map((section) => (
                  <section
                    className="block"
                    contentEditable
                    suppressContentEditableWarning
                    key={`${ORIGINAL.id}-${section.kind}`}
                  >
                    {renderSection(section)}
                  </section>
                ))}
              </article>

              <div className="variant-slot empty">
                <article
                  className={`variant ghost ${menuOpen || isGenerating ? 'active' : ''}`}
                  aria-label="Generated variant placeholder"
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
                  <div className="title-with-preview">
                    <h2>Generated Variant</h2>
                  </div>
                  <p className="ghost-note">Variant will appear here.</p>

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

                  {isGenerating ? (
                    <p className="status">{progressText}</p>
                  ) : null}
                </article>
              </div>
            </div>
          )}

          {hasGeneratedMaterial && (menuOpen || isGenerating) ? (
            <div
              className={`controls-tray ${menuOpen || isGenerating ? 'active' : ''}`}
            >
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
            </div>
          ) : null}
        </div>
      </section>

      {toast ? <div className="toast">{toast}</div> : null}
    </main>
  )
}
