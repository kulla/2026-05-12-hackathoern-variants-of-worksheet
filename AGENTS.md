# Project Notes

## Goal
- Build a mocked HTML-only prototype that shows how AI can create worksheet variants.

## Main Flow
- Open with one predefined original material in an editor similar to `https://kulla.github.io/serlo-editor-prototype/`.
- The topic is 6th grade math: fractions.
- The initial material has three sections: explanatory text, one fill-in-the-gap exercise, and one multiple-choice exercise.
- A plus button on the right creates a new variant.
- Clicking it opens a menu with a prompt input and suggestions like "easy language" or "easier version".
- Selecting "easier version" generates a variant for learners with difficulties and shows short progress feedback in the right panel.

## Layout
- Show variants side by side in a grid.
- Keep sections aligned: each row is one section, each column is one variant.

## Constraints
- Keep AI and content generation fake, deterministic, and local.
- Keep the UI close to an editorial worksheet.
- Avoid backend dependencies.
- For buttons outside the user story, show a toast: "This function is not implemented in this demo."
- Run `bun check` before finishing changes.
