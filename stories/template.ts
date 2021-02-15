import { TemplateResult } from 'lit-html'

export interface Template<T> {
  (...args: any[]): TemplateResult
  args?: Partial<T>
}

export function template<T>(component: (args: T) => TemplateResult): Template<T> {
  return (args: any) => component(args)
}
