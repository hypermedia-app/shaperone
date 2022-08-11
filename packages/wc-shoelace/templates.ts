import { html } from '@hydrofoil/shaperone-wc'
import { PropertyTemplate, ObjectTemplate, FocusNodeTemplate } from '@hydrofoil/shaperone-wc/templates'
import { repeat } from 'lit/directives/repeat.js'
import { localizedLabel } from '@rdfjs-elements/lit-helpers/localizedLabel.js'
import { sh } from '@tpluscode/rdf-ns-builders'

interface ShoelacePropertyTemplate extends PropertyTemplate {
  addObjectIcon?: string
}

export const property: ShoelacePropertyTemplate = (renderer, { property: state }) => {
  const editors = state.selectedEditor
    ? renderer.renderMultiEditor()
    : html`${repeat(state.objects, object => html`${renderer.renderObject({ object })}`)}`

  return html`
    <sh-sl-property .label="${localizedLabel(state.shape, { property: sh.name })}"
                    .helpText="${localizedLabel(state.shape, { property: sh.description })}"
                    .canAddValue="${state.canAdd && !state.selectedEditor}"
                    .addIcon="${property.addObjectIcon}"
                    @added="${renderer.actions.addObject}"
    >
      ${editors}
    </sh-sl-property>
  `
}

property.loadDependencies = () => [
  import('./components/sh-sl-property'),
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
  import('./components/sh-sl-object'),
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
