import { html } from 'lit-html'
import './button.css'

export interface ButtonKnobs {
  primary: boolean
  backgroundColor: string
  size: string
  label: string
  onClick: () => void
}

export const Button = ({ primary, backgroundColor, size, label, onClick }: ButtonKnobs) => {
  const mode = primary ? 'storybook-button--primary' : 'storybook-button--secondary'

  return html`
    <button
      type="button"
      class=${['storybook-button', `storybook-button--${size || 'medium'}`, mode].join(' ')}
      style=${backgroundColor && { backgroundColor }}
      @click=${onClick}
    >
      ${label}
    </button>
  `
}
