import cf from 'clownface'
import $rdf from '@rdf-esm/dataset'
import { editorTestParams } from '@shaperone/testing'
import { expect, fixture } from '@open-wc/testing'
import { SlSelect } from '@shoelace-style/shoelace/dist/shoelace'
import { InstancesSelect } from '@hydrofoil/shaperone-core/lib/components/instancesSelect'
import sh1 from '@hydrofoil/shaperone-core/ns'
import { instancesSelect } from '../../components/instancesSelect'

describe('wc-shoelace/components/instancesSelect', () => {
  let component: InstancesSelect

  beforeEach(async () => {
    component = {
      ...instancesSelect,
      render: await instancesSelect.lazyRender(),
    }
  })

  it('is disabled when dash:readOnly true', async () => {
    // given
    const graph = cf({ dataset: $rdf.dataset() })
    const { params, actions } = editorTestParams<InstancesSelect>({
      property: {
        readOnly: true,
      },
      object: graph.namedNode(''),
    })

    // when
    const result = await fixture<SlSelect>(component.render(params, actions))

    // then
    expect(result.disabled).to.be.true
  })

  context('property sh1:clearable true', () => {
    it('makes select clearable', async () => {
      // given
      const graph = cf({ dataset: $rdf.dataset() })
      const { params, actions } = editorTestParams<InstancesSelect>({
        property: {
          [sh1.clearable.value]: true,
        },
        object: graph.namedNode(''),
      })

      // when
      const result = await fixture<SlSelect>(component.render(params, actions))

      // then
      expect(result.clearable).to.be.true
    })

    it('clears value when cleared', async () => {
      // given
      const graph = cf({ dataset: $rdf.dataset() })
      const { params, actions } = editorTestParams<InstancesSelect>({
        property: {
          [sh1.clearable.value]: true,
        },
        object: graph.namedNode('A'),
        componentState: {
          choices: [
            graph.namedNode('A'),
            graph.namedNode('B'),
            graph.namedNode('C'),
          ],
        },
      })

      // when
      const result = await fixture<SlSelect>(component.render(params, actions))
      result.renderRoot.querySelector<HTMLButtonElement>('.select__clear')?.click()

      // then
      expect(actions.clear).to.have.been.called
    })
  })
})
