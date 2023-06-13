import createDOMPurify from 'dompurify'
import { JSDOM } from 'jsdom'
import { marked } from 'marked'

const renderer = new marked.Renderer()
renderer.paragraph = (text) => text
renderer.strong = (text) => `<b>${text}</b>`
renderer.em = (text) => `<i>${text}</i>`
renderer.codespan = (text) => `<code>${text}</code>`
renderer.blockquote = (text) => `<blockquote>${text}</blockquote>`
marked.use({ renderer })

const window = new JSDOM('').window
const DOMPurify = createDOMPurify(window)
const DOMPurifyConfig = {
  ALLOWED_TAGS: ['b', 'i', 'code', 'blockquote'],
  ALLOWED_ATTR: [],
}
DOMPurify.setConfig(DOMPurifyConfig)

export default function parseMessage(message: string) {
  const slightlyPurified = message.replace(/</g, '&lt;').replace(/>/g, '&gt;')
  const markdown = marked(slightlyPurified)
  const purified = DOMPurify.sanitize(markdown)
  return purified
}
