/**
 * Decorator module simplifies extending render templates
 *
 * @packageDocumentation
 * @module @hydrofoil/shaperone-wc/components/decorator
 */

import { css } from 'lit-element'
import type { RenderTemplate } from '../templates'

export interface Decorate<Template extends RenderTemplate> {
  (template: Template): Template
}

function combineInit(base: RenderTemplate, decorated: RenderTemplate) {
  const { loadDependencies } = decorated

  if (!loadDependencies) {
    decorated.loadDependencies = base.loadDependencies
    return
  }

  const baseDependencies = base.loadDependencies
  if (baseDependencies) {
    decorated.loadDependencies = () => [
      ...baseDependencies(),
      ...loadDependencies(),
    ]
  }
}

function combineStyles(base: RenderTemplate, decorated: RenderTemplate) {
  if (!decorated.styles) {
    decorated.styles = base.styles
    return
  }

  if (base.styles) {
    decorated.styles = css`${base.styles as any}\n${decorated.styles as any}`
  }
}

/**
 * Wraps the rendering function of a {@see RenderTemplate}, allowing extending existing templates.
 *
 * @param decorate function to wrap another template
 * @return wrapped template function
 */
export function decorate<Template extends RenderTemplate>(decorate: Decorate<Template>): Decorate<Template> {
  return (baseTemplate: Template) => {
    const decorated = decorate(baseTemplate)

    combineInit(baseTemplate, decorated)
    combineStyles(baseTemplate, decorated)

    return decorated
  }
}
