import sinon from 'sinon'

export default class AlcaeusFactory {
  hydra!: {
    loadResource: sinon.SinonStub
  }

  init() {
    this.hydra = {
      loadResource: sinon.stub(),
    }
  }
}
