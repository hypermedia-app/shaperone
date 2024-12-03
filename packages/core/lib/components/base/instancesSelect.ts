import { rdf } from '@tpluscode/rdf-ns-builders'
import type { GraphPointer } from 'clownface'
import type { PropertyShape } from '@rdfine/shacl'
import type {
  ComponentInstance,
  SingleEditorComponent,
  SingleEditorRenderParams,
} from '../../../models/components/index.js'
import type { ShaperoneEnvironment } from '../../../env.js'

export interface State extends ComponentInstance {
  instances?: GraphPointer[]
  loading?: boolean
}

export interface Editor<S extends State> extends SingleEditorComponent<S> {
  /**
   * Asynchronously loads an instance selected in the editor
   *
   * Implementors may choose to implement and call it if the local state does not have full representation of the resource
   * @param params
   */
  loadInstance(params: {
    env: ShaperoneEnvironment
    property: PropertyShape
    value: GraphPointer
  }): Promise<GraphPointer | null>

  /**
   * Asynchronously load the values for the component
   * @param params
   */
  loadChoices(params: SingleEditorRenderParams<State>): Promise<GraphPointer[]>

  /**
   * Returns a logical value to determine if the component should fetch fresh collection of instances
   * @param params
   */
  shouldLoad(params: SingleEditorRenderParams<State>): boolean

  sort(shape: PropertyShape, env: ShaperoneEnvironment): (left: GraphPointer, right: GraphPointer) => number
}

export function shouldLoad({ componentState }: SingleEditorRenderParams<State>): boolean {
  return !componentState.instances
}

export async function loadInstance({ property, value }: {
  property: PropertyShape
  value: GraphPointer
}): Promise<GraphPointer | null> {
  return property.pointer.node(value)
}

export async function loadChoices({ property }: SingleEditorRenderParams<State>): Promise<GraphPointer[]> {
  if (property.shape.class) {
    return property.shape.pointer.any()
      .has(rdf.type, property.shape.class.id)
      .toArray()
  }

  return []
}

export const init: SingleEditorComponent<State>['init'] = function (this: Editor<State>, params) {
  const { componentState, updateComponentState, env } = params
  if (this.shouldLoad(params) && !componentState.loading) {
    updateComponentState({
      loading: true,
    });
    (async () => {
      const pointers = await this.loadChoices(params)
      const instances = pointers.sort(this.sort(params.property.shape, env))

      updateComponentState({
        instances,
        ready: true,
        loading: false,
      })
    })()

    return false
  }
  return !componentState.loading
}
