import { html, TemplateResult } from 'lit'
import { PropertyTemplate, ObjectTemplate, FocusNodeTemplate } from '@hydrofoil/shaperone-wc/templates'
import { repeat } from 'lit/directives/repeat.js'
import { localizedLabel } from '@rdfjs-elements/lit-helpers/localizedLabel.js'
import { sh } from '@tpluscode/rdf-ns-builders'
import { PropertyState } from '@hydrofoil/shaperone-core/models/forms'

declare module '@hydrofoil/shaperone-wc/templates' {
  interface RenderTemplates {
    shoelace?: {
      addObject?(property: PropertyState): TemplateResult
    }
  }
}

interface ShoelacePropertyTemplate extends PropertyTemplate {
  addObjectIcon?: string
}

export const property: ShoelacePropertyTemplate = (renderer, { property: state }) => {
  const editors = state.selectedEditor
    ? renderer.renderMultiEditor()
    : html`${repeat(state.objects, object => html`${renderer.renderObject({ object })}`)}`

  let customAddObject: TemplateResult | undefined
  if (renderer.context.templates.shoelace?.addObject) {
    customAddObject = renderer.context.templates.shoelace.addObject(state)
  }

  function onAdd(e: CustomEvent) {
    renderer.actions.addObject(e.detail)
    e.stopPropagation()
  }

  return html`
    <sh-sl-property .label="${localizedLabel(state.shape, { property: sh.name })}"
                    .helpText="${localizedLabel(state.shape, { property: sh.description })}"
                    .canAddValue="${state.canAdd && !state.selectedEditor}"
                    .addIcon="${property.addObjectIcon}"
                    @added="${onAdd}"
    >
      ${editors}
      ${customAddObject ? html`<section slot="add-object">${customAddObject}</section>` : ''}
    </sh-sl-property>
  `
}

property.loadDependencies = () => [
  import('./elements/sh-sl-property'),
]

interface ShoelaceObjectTemplate extends ObjectTemplate {
  removeIcon?: string
}

export const object: ShoelaceObjectTemplate = renderer => html`
  <sh-sl-object .canBeRemoved="${renderer.property.canRemove}"
                @removed="${renderer.actions.remove}"
                .removeIcon="${object.removeIcon}"
  >
    ${renderer.renderEditor()}
  </sh-sl-object>
`

object.loadDependencies = () => [
  import('./elements/sh-sl-object'),
]

export const focusNode: FocusNodeTemplate = (renderer, { focusNode: { groups } }) => {
  if (groups.length === 1) {
    return renderer.renderGroup({ group: groups[0] })
  }

  return html`<sl-tab-group>
      ${repeat(groups, (group) => {
    const groupName = group.group?.id.value || 'default'

    return html`
          <sl-tab slot="nav" panel="${groupName}" ?active="${group.selected}">${localizedLabel(group.group)}</sl-tab>
          <sl-tab-panel name="${groupName}" ?active="${group.selected}">
            ${renderer.renderGroup({ group })}
          </sl-tab-panel>
        `
  })}
    </sl-tab-group>`
}

focusNode.loadDependencies = () => [
  import('@shoelace-style/shoelace/dist/components/tab-group/tab-group.js'),
  import('@shoelace-style/shoelace/dist/components/tab/tab.js'),
  import('@shoelace-style/shoelace/dist/components/tab-panel/tab-panel.js'),
]
