import type { TextFieldElement } from '@vaadin/vaadin-text-field'
import type { State } from '../state/models/shape'

const fetchShapeMenu = (() => {
  import('@vaadin/vaadin-button/vaadin-button.js')
  import('@vaadin/vaadin-checkbox/vaadin-checkbox.js')

  const fetchShapeInput = document.createElement('vaadin-text-field') as TextFieldElement
  fetchShapeInput.placeholder = 'Shapes URL'

  const authHeaderInput = document.createElement('vaadin-text-field') as TextFieldElement
  authHeaderInput.placeholder = '(Optional) Authorization header'

  const clearResource = document.createElement('vaadin-checkbox')
  clearResource.innerText = 'Clear resource graph'

  const fetchShapeButton = document.createElement('vaadin-button')
  fetchShapeButton.innerText = 'Fetch shape'
  fetchShapeButton.addEventListener('click', (e) => {
    const authHeader = authHeaderInput.value || ''

    e.target?.dispatchEvent(new CustomEvent('shape-load', {
      detail: {
        shape: fetchShapeInput.value,
        authHeader,
        clearResource: clearResource.checked,
      },
      bubbles: true,
      composed: true,
    }))
  })

  return (state: State) => {
    clearResource.checked = state.options.clearResource
    if (state.options.loadedShapeUri) {
      fetchShapeInput.value = state.options.loadedShapeUri
    }
    if (state.options.authHeader) {
      authHeaderInput.value = state.options.authHeader
    }

    return [{
      component: fetchShapeInput,
    }, {
      component: authHeaderInput,
    }, {
      component: clearResource,
    }, {
      component: fetchShapeButton,
    }]
  }
})()

const toolsMenu = (() => {
  import('@vaadin/vaadin-button/vaadin-button.js')

  const generateInstancesButton = document.createElement('vaadin-button')
  generateInstancesButton.addEventListener('click', (e) => {
    generateInstancesButton.dispatchEvent(new CustomEvent('generate-instances', {
      composed: true,
      bubbles: true,
    }))
  })

  return () => {
    generateInstancesButton.innerText = 'Generate dummy instances'

    return [{
      component: generateInstancesButton,
    }]
  }
})()

const rootShapeMenu = (state: State) => {
  const shapeChoices = state.shapes.map(shape => ({
    text: shape.value,
    checked: shape.term.equals(state.pointer?.term),
    pointer: shape,
    type: 'root shape',
  }))

  return [
    { text: 'Autoselect', checked: !state.pointer?.term, type: 'root shape' },
    ...shapeChoices,
  ]
}

export function shapeMenu(state: State) {
  return [{
    text: 'Format',
    children: [{
      type: 'format',
      text: 'application/ld+json',
      checked: state.format === 'application/ld+json',
    }, {
      type: 'format',
      text: 'text/turtle',
      checked: state.format === 'text/turtle',
    }],
  }, {
    text: 'Fetch shape',
    children: fetchShapeMenu(state),
  }, {
    text: 'Root shape',
    children: rootShapeMenu(state),
  }, {
    text: 'Tools',
    children: toolsMenu(),
  }]
}
