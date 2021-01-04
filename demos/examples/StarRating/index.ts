import type { IconDefinition } from '@fortawesome/fontawesome-common-types'
import type { IconName } from '@fortawesome/fontawesome-svg-core'
import { html, SingleEditor, Lazy, SingleEditorComponent } from '@hydrofoil/shaperone-wc'
import type { UpdateComponentState } from '@hydrofoil/shaperone-core/models/components'
import { literal, namedNode, quad } from '@rdf-esm/data-model'
import { dash, rdf, rdfs, schema, xsd } from '@tpluscode/rdf-ns-builders'
import type { PropertyShape } from '@rdfine/shacl'

export interface StarRating {
  icon?: IconDefinition | null
  loading?: boolean
}

export interface StarRatingComponent extends SingleEditorComponent<StarRating> {
  defaultIcon?: IconDefinition
}

const editor = namedNode('http://example.com/StarRating')

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
  init({ value, updateComponentState, property: { shape } }) {
    if (typeof value.componentState.icon !== 'undefined') {
      return true
    }

    if (value.componentState.loading) {
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

    return function ({ value }, { update }) {
      const rating = value.object ? Number.parseFloat(value.object.value) : 0

      function setRating(e: CustomEvent) {
        update(literal(e.detail.value.toString(), xsd.float))
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
    return shape.getPathProperty()?.equals(schema.ratingValue) ? 50 : 0
  },
}

export function * metadata() {
  yield quad(editor, rdf.type, dash.SingleEditor)
  yield quad(editor, rdfs.label, literal('Star rating'))
}
