import { css, LitElement } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { html } from '@hydrofoil/shaperone-wc'
import { repeat } from 'lit/directives/repeat.js'
import { icon } from '@fortawesome/fontawesome-svg-core'
import { faStar } from '@fortawesome/free-solid-svg-icons'
import type { IconDefinition } from '@fortawesome/fontawesome-common-types'

@customElement('ex-star-rating')
export class StarRating extends LitElement {
  @property({ type: Number })
  max = 5

  @property({ type: Number })
  value = 0

  @property({ attribute: false })
  icon?: IconDefinition

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

      .star.full {
        color: var(--star-score-color);
      }

      .star.half div {
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
        color: var(--star-color);
      }

      .star.half div svg {
        position: absolute;
        top: 0;
        left: 0;
      }

      .star.half div svg:nth-child(2) {
        color: var(--star-score-color);
        clip: rect(0%, 50%, 100%, 0%);
        clip-path: inset(0 50% 0 0);
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
      return html`<div part="star" class="star full" @click="${this.updateValue(rating)}">${this.__iconNode}</div>`
    }

    if (diff <= 0.5) {
      return html`<div part="star" class="star half" @click="${this.updateValue(rating)}">
        <div>${this.__iconNode} ${this.__iconNode}</div>
      </div>`
    }

    return html`<div part="star" class="star" @click="${this.updateValue(rating)}">${this.__iconNode}</div>`
  }

  private get __iconNode() {
    return icon(this.icon || faStar).node
  }

  private updateValue(rating: number) {
    return (e: any) => {
      const { x, width } = e.target.getBoundingClientRect()
      const relativeX = e.clientX - x

      let value = rating
      if (relativeX < (width / 2)) {
        value -= 0.5
      }

      this.value = value
      this.dispatchEvent(new CustomEvent('value-changed', {
        detail: {
          value,
        },
      }))
    }
  }
}
