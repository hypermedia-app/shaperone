declare module 'concat-merge' {
  type RecursivePartial<T> = {
    [P in keyof T]?:
    T[P] extends (infer U)[] ? RecursivePartial<U>[] :
      T[P] extends object ? RecursivePartial<T[P]> :
        T[P];
  }


  declare function merge<T>(a: T, b: RecursivePartial<T>): T

  export default merge
}
