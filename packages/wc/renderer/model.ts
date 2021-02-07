import { createModel } from '@captaincodeman/rdx'
import type { CSSResult, CSSResultArray } from 'lit-element'
import { css } from 'lit-element'
import { templates, RenderTemplates } from '../templates'
import type { State } from '../store'

export interface RendererState {
  templates: RenderTemplates
  styles: CSSResult
  ready: boolean
}

function styleReducer(reduced: CSSResult, styles: CSSResult | CSSResultArray | undefined): CSSResult {
  if (!styles) return reduced

  if (Array.isArray(styles)) {
    return styles.reduce(styleReducer, reduced)
  }

  return css`${reduced}${styles}`
}

function combineStyles(strategy: RenderTemplates) {
  return Object.values(strategy)
    .map(strat => strat.styles)
    .reduce(styleReducer, css``)
}

export const renderer = createModel({
  state: <RendererState>{
    templates,
    styles: combineStyles(templates),
  },
  reducers: {
    ready(state): RendererState {
      return {
        ...state,
        ready: true,
      }
    },
    setStrategy(state, newTemplates: Partial<RenderTemplates>): RendererState {
      const templates = { ...state.templates, ...newTemplates }

      return {
        ...state,
        templates,
        ready: false,
        styles: combineStyles(templates),
      }
    },
  },
  effects: (store) => {
    const dispatch = store.getDispatch()

    return {
      async loadDependencies() {
        const state: State = store.getState()

        await Promise.all(
          Object.values(state.renderer.templates)
            .reduce<Promise<unknown>[]>((promises, strat) => {
            if (!strat.loadDependencies) {
              return promises
            }

            return [...promises, ...strat.loadDependencies()]
          }, []),
        )

        dispatch.renderer.ready()
      },
    }
  },
})
