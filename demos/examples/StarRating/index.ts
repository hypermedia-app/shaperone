import { html, SingleEditorComponent } from '@hydrofoil/shaperone-wc'
import { customElement, LitElement, property, css } from 'lit-element'
import { literal, namedNode, quad } from '@rdf-esm/data-model'
import { repeat } from 'lit-html/directives/repeat'
import { SingleEditor } from '@hydrofoil/shaperone-core'
import { getPathProperty } from '@hydrofoil/shaperone-core/models/resources/lib/property'
import { dash, rdf, rdfs, schema, xsd } from '@tpluscode/rdf-ns-builders'
import { icon } from '@fortawesome/fontawesome-svg-core'
import { faStar, faStarHalf } from '@fortawesome/free-solid-svg-icons'

@customElement('ex-star-rating')
export class StarRating extends LitElement {
  @property({ type: Number })
  max = 5

  @property({ type: Number })
  value = 0

  static get styles() {
    return css`
      :host {
        display: flex;
        --star-color: white;
        --star-score-color: #fc0;
      }

      .star {
        flex: 1;
        color: var(--star-color);
        cursor: pointer;
      }

      .star.full, .star.half {
        color: var(--star-score-color);
      }

      .star.bg {
        position: relative;
        left: -39px;
        z-index: -1;
        margin-right: -39px;
      }`
  }

  protected render(): unknown {
    const radios = new Array(Math.floor(this.max)).fill(null)

    return html`
      ${repeat(radios, (_, idx) => this.__renderStar(idx + 1))}`
  }

  private __renderStar(rating: number) {
    const diff = rating - this.value

    if (diff <= 0) {
      return html`<div class="star full" @click="${this.updateValue(rating)}">${icon(faStar).node}</div>`
    }

    if (diff <= 0.5) {
      return html`<div class="star half" @click="${this.updateValue(rating)}">${icon(faStarHalf).node}</div><div class="star bg">${icon(faStar).node}</div>`
    }

    return html`<div class="star" @click="${this.updateValue(rating)}">${icon(faStar).node}</div>`
  }

  private updateValue(rating: number) {
    return (e: any) => {
      const { x, width } = e.target.getBoundingClientRect()
      const relativeX = e.clientX - x

      let value = rating
      if (relativeX < (width / 2)) {
        value -= 0.5
      }

      this.value = rating
      this.dispatchEvent(new CustomEvent('value-changed', {
        detail: {
          value,
        },
      }))
    }
  }
}

const editor = namedNode('http://example.com/StarRating')

export const component: SingleEditorComponent = {
  editor,
  render({ value }, { update }) {
    const rating = value.object ? Number.parseFloat(value.object.value) : 0

    return html`<ex-star-rating .value="${rating}" @value-changed="${(e: CustomEvent) => update(literal(e.detail.value.toString(), xsd.float))}"></ex-star-rating>`
  },
}

export const matcher: SingleEditor = {
  term: editor,
  match(shape) {
    return getPathProperty(shape)?.equals(schema.ratingValue) ? 50 : 0
  },
}

export function * metadata() {
  yield quad(editor, rdf.type, dash.SingleEditor)
  yield quad(editor, rdfs.label, literal('Star rating'))
}
