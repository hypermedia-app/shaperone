import { createModel } from '@captaincodeman/rdx'
import { setLanguages } from '@rdfjs-elements/lit-helpers/taggedLiteral.js'
import type { Store } from '../store'
import { ComponentsState } from './components'
import { RendererState } from './renderer'

export interface State {
  sharePopup: boolean
  sharingLink: string
  sharingParams: string
  shareFormSettings: boolean
  hasError: boolean
  language: string
}

interface SharingParam {
  key: 'shapes' | 'shapesFormat' | 'resource' | 'resourceFormat' | 'resourcePrefixes' | 'selectedResource' | keyof ComponentsState | keyof RendererState
  value: string
}

export const playground = createModel({
  state: <State>{
    sharePopup: false,
    sharingLink: document.location.href,
    sharingParams: '',
    shareFormSettings: false,
    hasError: false,
    language: 'en',
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
      const sharingParams = new URLSearchParams(state.sharingParams)
      sharingParams.set(key, value)

      return {
        ...state,
        sharingParams: sharingParams.toString(),
      }
    },
    shareFormSettings(state, shareFormSettings: boolean) {
      return {
        ...state,
        shareFormSettings,
      }
    },
    setSharingLink(state, sharingLink: string) {
      return {
        ...state,
        sharingLink,
      }
    },
    switchLanguage(state, language: string) {
      return { ...state, language }
    },
    error(state, hasError: boolean) {
      return { ...state, hasError }
    },
  },
  effects(store: Store) {
    const dispatch = store.getDispatch()

    function updateSharingLink() {
      const { playground } = store.getState()
      const searchParams = new URLSearchParams(playground.sharingParams)

      if (!playground.shareFormSettings) {
        searchParams.delete('components')
        searchParams.delete('disableEditorChoice')
        searchParams.delete('grouping')
        searchParams.delete('nesting')
      }

      const sharingLink = new URL(document.location.href)
      sharingLink.hash = searchParams.toString()

      dispatch.playground.setSharingLink(sharingLink.toString())
    }

    return {
      'resource/setSerialized': function (value: string) {
        dispatch.playground.updateSharingParams({ key: 'resource', value })
        const { selectedResource } = store.getState().resource
        if (selectedResource) dispatch.playground.updateSharingParams({ key: 'selectedResource', value: selectedResource })
      },
      'resource/setPrefixes': function (value: string) {
        dispatch.playground.updateSharingParams({ key: 'resourcePrefixes', value })
      },
      'resource/format': function (value: string) {
        dispatch.playground.updateSharingParams({ key: 'resourceFormat', value })
      },
      'resource/selectResource': function () {
        const { selectedResource: value } = store.getState().resource
        if (value) dispatch.playground.updateSharingParams({ key: 'selectedResource', value })
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
      'rendererSettings/toggleLab': function () {
        const { labs } = store.getState().rendererSettings
        dispatch.playground.updateSharingParams({ key: 'labs', value: JSON.stringify(labs) })
      },
      'shape/error': function (error: Error | undefined) {
        dispatch.playground.error(typeof error !== 'undefined')
      },
      'resource/error': function (error: Error | undefined) {
        dispatch.playground.error(typeof error !== 'undefined')
      },
      shareFormSettings: updateSharingLink,
      updateSharingParams: updateSharingLink,
      restoreOrInitSharing() {
        const url = new URL(document.location.toString())
        const sharedState = url.hash ? new URLSearchParams(url.hash.substr(1)) : url.searchParams
        if (![...sharedState.keys()].length) {
          const state = store.getState()
          dispatch.playground.updateSharingParams({ key: 'shapes', value: state.shape.serialized })
          dispatch.playground.updateSharingParams({ key: 'shapesFormat', value: state.shape.format })
          dispatch.playground.updateSharingParams({ key: 'resource', value: state.resource.serialized || '' })
          dispatch.playground.updateSharingParams({ key: 'resourceFormat', value: state.resource.format })
          dispatch.playground.updateSharingParams({ key: 'resourcePrefixes', value: state.resource.prefixes.join(',') })
          dispatch.playground.updateSharingParams({ key: 'selectedResource', value: state.resource.selectedResource || '' })
          dispatch.playground.updateSharingParams({ key: 'components', value: state.componentsSettings.components })
          dispatch.playground.updateSharingParams({ key: 'disableEditorChoice', value: state.componentsSettings.disableEditorChoice.toString() })
          dispatch.playground.updateSharingParams({ key: 'nesting', value: state.rendererSettings.nesting })
          dispatch.playground.updateSharingParams({ key: 'grouping', value: state.rendererSettings.grouping })
          dispatch.playground.updateSharingParams({ key: 'labs', value: JSON.stringify(state.rendererSettings.labs) })
        }

        const shapes = sharedState.get('shapes')
        const shapesFormat = sharedState.get('shapesFormat')
        const resource = sharedState.get('resource')
        const resourceFormat = sharedState.get('resourceFormat')
        const resourcePrefixes = sharedState.get('resourcePrefixes')
        const layout = sharedState.get('grouping')
        const nesting = sharedState.get('nesting')
        const disableEditorChoice = sharedState.get('disableEditorChoice')
        const components = sharedState.get('components')
        const selectedResource = sharedState.get('selectedResource')
        const labs = sharedState.get('labs')

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
        if (selectedResource) {
          dispatch.resource.selectResource({ id: selectedResource })
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
        if (labs) {
          for (const [lab, value] of Object.entries(JSON.parse(labs)) as any) {
            dispatch.rendererSettings.toggleLab({ lab, value })
          }
        }

        url.search = ''
        url.hash = ''
        window.history.replaceState(null, '', url.toString())
      },
      switchLanguage(value) {
        setLanguages(value)
      },
    }
  },
})
