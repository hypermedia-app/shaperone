/// <reference types="chai" />

declare namespace Chai {
  interface Assertion {
    matchSnapshot(that: any): void
  }
}
