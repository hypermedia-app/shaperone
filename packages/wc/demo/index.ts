import 'api-viewer-element/lib/api-docs.js'
import '../shaperone-form.js'

import('../custom-elements.json').then((data: any) => {
  const demoViewer = document.querySelector('api-docs')
  if (demoViewer) {
    demoViewer.elements = data.tags
  }
})
