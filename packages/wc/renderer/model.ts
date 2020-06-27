import { createModel } from '@captaincodeman/rdx'
import type { CSSResult, CSSResultArray } from 'lit-element'
import { css } from 'lit-element'
import { DefaultStrategy } from './DefaultStrategy'
import * as strategy from '../lib/renderer'
import type { State } from '../store'

export interface RendererState {
  strategy: {
    form: strategy.FormRenderStrategy
    focusNode: strategy.FocusNodeRenderStrategy
    group: strategy.GroupRenderStrategy
    property: strategy.PropertyRenderStrategy
    object: strategy.ObjectRenderStrategy
    initialising: strategy.InitialisationStrategy
  }
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

function combineStyles(strategy: RendererState['strategy']) {
  return Object.values(strategy)
    .map(strat => strat.styles)
    .reduce(styleReducer, css``)
}

export const renderer = createModel({
  state: <RendererState>{
    strategy: DefaultStrategy,
    styles: combineStyles(DefaultStrategy),
    ready: false,
  },
  reducers: {
    ready(state): RendererState {
      return {
        ...state,
        ready: true,
      }
    },
    setStrategy(state, newStrategy: Partial<RendererState['strategy']>): RendererState {
      const strategy = { ...state.strategy, ...newStrategy }

      return {
        ...state,
        strategy,
        ready: false,
        styles: combineStyles(strategy),
      }
    },
  },
  effects: (store) => {
    const dispatch = store.dispatch()

    return {
      async loadDependencies() {
        const state: State = store.getState()

        await Promise.all(
          Object.values(state.renderer.strategy)
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
