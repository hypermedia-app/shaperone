import type {
  ComponentDecorator,
  DecoratedComponent, Lazy,
  MultiEditorComponent,
  SingleEditorComponent,
} from '../index'

function decorateRender<TRenderResult>(component: DecoratedComponent<TRenderResult>) {
  const { _decorateRender } = component

  if (!_decorateRender) {
    return component
  }

  delete component._decorateRender
  if ('lazyRender' in component) {
    return {
      ...component,
      async lazyRender() {
        const render = await component.lazyRender()
        return _decorateRender.call(component, render.bind(component))
      },
    }
  }

  return {
    ...component,
    render: _decorateRender.call(component, component.render.bind(component)),
  }
}

type Component = SingleEditorComponent<any> | MultiEditorComponent<any>

export function decorateComponent<T extends Component, TOrLazy extends T | Lazy<T> = T | Lazy<T>>(component: TOrLazy, { decorate }: ComponentDecorator<T | Lazy<T>>): TOrLazy {
  return decorateRender(decorate(component) as any) as any
}
