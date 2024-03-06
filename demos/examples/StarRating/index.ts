import type { IconDefinition } from '@fortawesome/fontawesome-common-types'
import type { IconName } from '@fortawesome/fontawesome-svg-core'
import { html, SingleEditor, Lazy, SingleEditorComponent } from '@hydrofoil/shaperone-wc'
import type { UpdateComponentState } from '@hydrofoil/shaperone-core/models/components'
import { schema, xsd } from '@tpluscode/rdf-ns-builders'
import { dash } from '@tpluscode/rdf-ns-builders/loose'
import type { PropertyShape } from '@rdfine/shacl'
import { ShaperoneEnvironment } from '@hydrofoil/shaperone-core/env'
import rdf from '@zazuko/env'

export interface StarRating {
  icon?: IconDefinition | null
  loading?: boolean
}

export interface StarRatingComponent extends SingleEditorComponent<StarRating> {
  defaultIcon?: IconDefinition
}

const editor = rdf.namedNode('http://example.com/StarRating')

interface LoadIcon {
  defaultIcon: IconDefinition | undefined
  shape: PropertyShape
  updateComponentState: UpdateComponentState<StarRating>
}

async function loadIcon({ defaultIcon, shape, updateComponentState }: LoadIcon) {
  let icon: IconDefinition | null = defaultIcon || null
  const iconName: IconName | undefined = shape.pointer.out(dash.icon).value as IconName
  if (iconName) {
    try {
      ({ definition: icon } = await import(`@fortawesome/free-solid-svg-icons/${iconName}.js`))
    } catch (e) {
      icon = null
    }
  }
  updateComponentState({
    icon,
    loading: false,
  })
}

export const component: Lazy<StarRatingComponent> = {
  editor,
  init({ componentState, updateComponentState, property: { shape } }) {
    if (typeof componentState.icon !== 'undefined') {
      return true
    }

    if (componentState.loading) {
      return false
    }

    loadIcon({
      updateComponentState,
      shape,
      defaultIcon: this.defaultIcon,
    })

    updateComponentState({
      loading: true,
    })

    return false
  },
  async lazyRender() {
    await import('./star-rating')

    return function ({ env, value }, { update }) {
      const rating = value.object ? Number.parseFloat(value.object.value) : 0

      function setRating(e: CustomEvent) {
        update(env.literal(e.detail.value.toString(), xsd.float))
      }

      return html`<ex-star-rating .value="${rating}"
                                  .icon="${value.componentState.icon}"
                                  @value-changed="${setRating}"></ex-star-rating>`
    }
  },
}

export const matcher: SingleEditor = {
  term: editor,
  match(shape) {
    return shape.pathEquals(schema.ratingValue) ? 50 : 0
  },
}

export function * metadata(env: ShaperoneEnvironment) {
  yield env.quad(editor, env.ns.rdf.type, env.ns.dash.SingleEditor)
  yield env.quad(editor, env.ns.rdfs.label, env.literal('Star rating'))
}
