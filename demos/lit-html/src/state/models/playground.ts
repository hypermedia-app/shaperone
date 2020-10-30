import { createModel } from '@captaincodeman/rdx'
import type { Store } from '../store'

export interface State {
  sharePopup: boolean
  sharingLink: string
}

interface SharingParam {
  key: 'shapes' | 'shapesFormat' | 'resource' | 'resourceFormat' | 'resourcePrefixes'
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
      updateSharingParams({ key, value }: SharingParam) {
        const { playground: state } = store.getState()

        const sharingLink = new URL(state.sharingLink)
        sharingLink.searchParams.set(key, value)

        dispatch.playground.setSharingLink(sharingLink.toString())
      },
      restoreState() {
        const sharedState = new URLSearchParams(document.location.search)
        const shapes = sharedState.get('shapes')
        const shapesFormat = sharedState.get('shapesFormat')
        const resource = sharedState.get('resource')
        const resourceFormat = sharedState.get('resourceFormat')
        const resourcePrefixes = sharedState.get('resourcePrefixes')

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
      },
    }
  },
})
