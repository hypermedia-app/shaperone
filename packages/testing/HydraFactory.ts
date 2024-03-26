import sinon from 'sinon'
import type { HydraClient } from 'alcaeus/alcaeus.js'

export default class AlcaeusFactory {
  hydra!: HydraClient & {
    loadResource: sinon.SinonStub
  }

  init() {
    this.hydra = <any>{
      loadResource: sinon.stub(),
    }
  }
}
