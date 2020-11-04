import { createModel } from '@captaincodeman/rdx'
import type { Store } from '../store'
import { ComponentsState } from './components'
import { RendererState } from './renderer'

export interface State {
  sharePopup: boolean
  sharingLink: string
}

interface SharingParam {
  key: 'shapes' | 'shapesFormat' | 'resource' | 'resourceFormat' | 'resourcePrefixes' | keyof ComponentsState | keyof RendererState
  value: string
}

export const playground = createModel({
  state: <State>{
    sharePopup: false,
    sharingLink: document.location.href,
  },
  reducers: {
    hideSharingDialog(state, hide: boolean) {
      return {
        ...state,
        sharePopup: !hide,
      }
    },
    showSharingDialog(state) {
      return {
        ...state,
        sharePopup: true,
      }
    },
    setSharingLink(state, sharingLink: string) {
      return {
        ...state,
        sharingLink,
      }
    },
  },
  effects(store: Store) {
    const dispatch = store.getDispatch()

    return {
      'resource/setSerialized': function (value: string) {
        dispatch.playground.updateSharingParams({ key: 'resource', value })
      },
      'resource/setPrefixes': function (value: string) {
        dispatch.playground.updateSharingParams({ key: 'resourcePrefixes', value })
      },
      'resource/format': function (value: string) {
        dispatch.playground.updateSharingParams({ key: 'resourceFormat', value })
      },
      'shape/serialized': function (value: string) {
        dispatch.playground.updateSharingParams({ key: 'shapes', value })
      },
      'shape/format': function (value: string) {
        dispatch.playground.updateSharingParams({ key: 'shapesFormat', value })
      },
      'componentsSettings/switchComponents': function (value: string) {
        dispatch.playground.updateSharingParams({ key: 'components', value })
      },
      'componentsSettings/setEditorChoice': function (value: boolean) {
        dispatch.playground.updateSharingParams({ key: 'disableEditorChoice', value: value.toString() })
      },
      'rendererSettings/switchNesting': function (value: string) {
        dispatch.playground.updateSharingParams({ key: 'nesting', value })
      },
      'rendererSettings/switchLayout': function (value: string) {
        dispatch.playground.updateSharingParams({ key: 'grouping', value })
      },
      updateSharingParams({ key, value }: SharingParam) {
        const { playground: state } = store.getState()

        const sharingLink = new URL(state.sharingLink)
        sharingLink.searchParams.set(key, value)

        dispatch.playground.setSharingLink(sharingLink.toString())
      },
      restoreState() {
        const sharedState: Map<SharingParam['key'], string> = new URLSearchParams(document.location.search) as any
        const shapes = sharedState.get('shapes')
        const shapesFormat = sharedState.get('shapesFormat')
        const resource = sharedState.get('resource')
        const resourceFormat = sharedState.get('resourceFormat')
        const resourcePrefixes = sharedState.get('resourcePrefixes')
        const layout = sharedState.get('grouping')
        const nesting = sharedState.get('nesting')
        const disableEditorChoice = sharedState.get('disableEditorChoice')
        const components = sharedState.get('components')

        if (shapes && shapesFormat) {
          dispatch.shape.format(shapesFormat)
          dispatch.shape.serialized(shapes)
        }
        if (resource && resourceFormat) {
          dispatch.resource.format(resourceFormat)
          dispatch.resource.setSerialized(resource)
          if (resourcePrefixes) {
            dispatch.resource.setPrefixes(resourcePrefixes.split(','))
          }
        }
        if (layout) {
          dispatch.rendererSettings.switchLayout(layout as any)
        }
        if (nesting) {
          dispatch.rendererSettings.switchNesting(nesting as any)
        }
        if (disableEditorChoice) {
          dispatch.componentsSettings.setEditorChoice(disableEditorChoice === 'true')
        }
        if (components) {
          dispatch.componentsSettings.switchComponents(components as any)
        }
      },
    }
  },
})
