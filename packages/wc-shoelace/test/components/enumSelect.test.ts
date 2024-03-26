import $rdf from '@shaperone/testing/env.js'
import { editorTestParams } from '@shaperone/testing'
import { expect, fixture, nextFrame } from '@open-wc/testing'
import { SlSelect } from '@shoelace-style/shoelace'
import { EnumSelect } from '@hydrofoil/shaperone-core/lib/components/enumSelect.js'
import { schema } from '@tpluscode/rdf-ns-builders'
import { enumSelect } from '../../components/enumSelect.js'

describe('wc-shoelace/components/enumSelect', () => {
  let component: EnumSelect

  beforeEach(async () => {
    component = {
      ...enumSelect,
      render: await enumSelect.lazyRender(),
    }
  })

  it('is disabled when dash:readOnly true', async () => {
    // given
    const graph = $rdf.clownface({ dataset: $rdf.dataset() })
    const {
      params,
      actions,
    } = editorTestParams<EnumSelect>({
      property: {
        readOnly: true,
      },
      object: graph.literal(''),
    })

    // when
    const result = await fixture<SlSelect>(component.render(params, actions))

    // then
    expect(result.disabled).to.be.true
  })

  it('uses form settings for display labels', async () => {
    // given
    const graph = $rdf.clownface({ dataset: $rdf.dataset() })
    const {
      params,
      actions,
    } = editorTestParams<EnumSelect>({
      componentState: {
        choices: [
          graph.namedNode('A').addOut(schema.name, 'Ą'),
        ],
      },
      object: graph.namedNode('A'),
    })
    params.form.labelProperties = [schema.name]

    // when
    const result = await fixture<SlSelect>(component.render(params, actions))

    // then
    expect(result.querySelector('sl-option')?.textContent).to.eq('Ą')
  })

  context('property $rdf.ns.sh1:clearable true', () => {
    it('makes select clearable', async () => {
      // given
      const graph = $rdf.clownface({ dataset: $rdf.dataset() })
      const {
        params,
        actions,
      } = editorTestParams<EnumSelect>({
        property: {
          readOnly: true,
          [$rdf.ns.sh1.clearable.value]: true,
        },
        object: graph.literal(''),
      })

      // when
      const result = await fixture<SlSelect>(component.render(params, actions))

      // then
      expect(result.clearable).to.be.true
    })

    it('clears value when cleared', async () => {
      // given
      const graph = $rdf.clownface({ dataset: $rdf.dataset() })
      const {
        params,
        actions,
      } = editorTestParams<EnumSelect>({
        property: {
          [$rdf.ns.sh1.clearable.value]: true,
        },
        object: graph.literal('B'),
        componentState: {
          choices: [
            graph.literal('A'),
            graph.literal('B'),
            graph.literal('C'),
          ],
        },
      })

      // when
      const result = await fixture<SlSelect>(component.render(params, actions))
      result.renderRoot.querySelector<HTMLButtonElement>('.select__clear')?.click()
      await nextFrame()

      // then
      expect(actions.clear).to.have.been.called
    })
  })
})
