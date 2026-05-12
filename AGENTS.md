# Project Notes

- This repository is a mocked HTML-only prototype for showing how variants of educational material can be created with AI.
- On opening the website there should be an editor with a predefined content open. The predefined material should cover a 6th grade mathematics topic on fractions. This material is the original.
- Start with one initial material set that contains: explanatory text, one fill-in-the-gap exercise, and one multiple-choice exercise.
- One the right is a plus-button for creating a new material -> clicking on it opens a new menu showing a prompt input for creating a new variant with AI. there should be suggestions like "easy language", "easier version" etc -> user clicks on easier version which generates content for pupil with learning difficulties -> new content is generated (short progress is shown in the panel right to the content)
- Variants are shown next to each other, each variant consists of the same secition, shown in a grid, content of the same seciton is in a row (and variants in the column
- Preserve the aligned grid layout where each row is one section and each column is one variant.

style:
- Include an editor similar to `https://kulla.github.io/serlo-editor-prototype/` with predefined educational material.


general:
- Keep all AI and content generation fake, deterministic, and local.
- Keep the interface close to an editorial worksheet and avoid adding backend dependencies.
- Use `bun check` before finishing changes.
- Clicks on buttons not in the user story should result in a toast message that this function is not implemented in this demo.
