import { createModel } from '@captaincodeman/rdx'
import type { Store } from '../store'
import { ComponentsState } from './components'
import { RendererState } from './renderer'

export interface State {
  sharePopup: boolean
  sharingLink: string
  linkWithAllParams: string
  shareFormSettings: boolean
}

interface SharingParam {
  key: 'shapes' | 'shapesFormat' | 'resource' | 'resourceFormat' | 'resourcePrefixes' | keyof ComponentsState | keyof RendererState
  value: string
}

function removeFormParams(fullLink: string, shareFormSettings: boolean): string {
  if (shareFormSettings) {
    return fullLink
  }

  const sharingLink = new URL(fullLink)
  sharingLink.searchParams.delete('components')
  sharingLink.searchParams.delete('disableEditorChoice')
  sharingLink.searchParams.delete('grouping')
  sharingLink.searchParams.delete('nesting')

  return sharingLink.toString()
}

export const playground = createModel({
  state: <State>{
    sharePopup: false,
    sharingLink: document.location.href,
    linkWithAllParams: document.location.href,
    shareFormSettings: false,
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
    updateSharingParams(state, { key, value }: SharingParam) {
      const linkWithAllParams = new URL(state.linkWithAllParams)
      linkWithAllParams.searchParams.set(key, value)

      return {
        ...state,
        linkWithAllParams: linkWithAllParams.toString(),
        sharingLink: removeFormParams(linkWithAllParams.toString(), state.shareFormSettings),
      }
    },
    shareFormSettings(state, shareFormSettings: boolean) {
      return {
        ...state,
        shareFormSettings,
        sharingLink: removeFormParams(state.linkWithAllParams, shareFormSettings),
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
      restoreState() {
        const url = new URL(document.location.toString())
        const sharedState: Map<SharingParam['key'], string> = url.searchParams as any
        const shapes = sharedState.get('shapes')
        const shapesFormat = sharedState.get('shapesFormat')
        const resource = sharedState.get('resource')
        const resourceFormat = sharedState.get('resourceFormat')
        const resourcePrefixes = sharedState.get('resourcePrefixes')
        const layout = sharedState.get('grouping')
        const nesting = sharedState.get('nesting')
        const disableEditorChoice = sharedState.get('disableEditorChoice')
        const components = sharedState.get('components')

        if (shapesFormat) {
          dispatch.shape.format(shapesFormat)
        }
        if (shapes) {
          dispatch.shape.serialized(shapes)
        }
        if (resourceFormat) {
          dispatch.resource.format(resourceFormat)
        }
        if (resource) {
          dispatch.resource.setSerialized(resource)
        }
        if (resourcePrefixes) {
          dispatch.resource.setPrefixes(resourcePrefixes.split(','))
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

        [...url.searchParams.keys()].forEach(key => url.searchParams.delete(key))
        window.history.replaceState(null, '', url.toString())
      },
    }
  },
})
