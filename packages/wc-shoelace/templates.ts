import type { TemplateResult } from 'lit'
import { html } from 'lit'
import type { PropertyTemplate, ObjectTemplate, FocusNodeTemplate } from '@hydrofoil/shaperone-wc/templates.js'
import { repeat } from 'lit/directives/repeat.js'
import { localizedLabel } from '@rdfjs-elements/lit-helpers/localizedLabel.js'
import { sh } from '@tpluscode/rdf-ns-builders'
import type { PropertyState } from '@hydrofoil/shaperone-core/models/forms'
import { settings } from './settings.js'

interface AddObject {
  (property: PropertyState): TemplateResult | ''
}

declare module '@hydrofoil/shaperone-wc/templates.js' {
  interface RenderTemplates {
    shoelace?: {
      addObject?: AddObject
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

  const customAddObject = renderer.context.templates.shoelace?.addObject?.(state)

  function onAdd(e: CustomEvent<Parameters<typeof renderer.actions.addObject>[0]>) {
    const detail = e.detail ? { ...e.detail } : {}
    if (!detail.componentState) {
      detail.componentState = {}
    }

    Object.entries(settings.newFieldDefaults)
      .forEach(([key, value]) => {
        if (!(key in detail.componentState!)) {
          detail.componentState![key] = value
        }
      })

    renderer.actions.addObject(detail)
    e.stopPropagation()
  }

  return html`
    <sh-sl-property .label="${localizedLabel(state.shape, { property: sh.name }) as any}"
                    .helpText="${localizedLabel(state.shape, { property: sh.description }) as any}"
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
  import('./elements/sh-sl-property.js'),
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
  import('./elements/sh-sl-object.js'),
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
