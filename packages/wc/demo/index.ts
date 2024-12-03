import 'api-viewer-element/lib/api-docs.js'
import { configure } from '../index.js'

(async () => {
  await configure()

  const { default: { tags } } = await import('../custom-elements.json')

  const demoViewer = document.querySelector('api-docs')
  if (demoViewer) {
    demoViewer.elements = tags as any
  }
})()
