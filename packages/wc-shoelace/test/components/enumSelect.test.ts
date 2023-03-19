import cf from 'clownface'
import $rdf from '@rdfjs/dataset'
import { editorTestParams } from '@shaperone/testing'
import { expect, fixture, nextFrame } from '@open-wc/testing'
import { SlSelect } from '@shoelace-style/shoelace/dist/shoelace'
import { EnumSelect } from '@hydrofoil/shaperone-core/lib/components/enumSelect'
import sh1 from '@hydrofoil/shaperone-core/ns.js'
import { schema } from '@tpluscode/rdf-ns-builders'
import { enumSelect } from '../../components/enumSelect'

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
    const graph = cf({ dataset: $rdf.dataset() })
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
    const graph = cf({ dataset: $rdf.dataset() })
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
    expect(result.querySelector('sl-menu-item')?.textContent).to.eq('Ą')
  })

  context('property sh1:clearable true', () => {
    it('makes select clearable', async () => {
      // given
      const graph = cf({ dataset: $rdf.dataset() })
      const {
        params,
        actions,
      } = editorTestParams<EnumSelect>({
        property: {
          readOnly: true,
          [sh1.clearable.value]: true,
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
      const graph = cf({ dataset: $rdf.dataset() })
      const {
        params,
        actions,
      } = editorTestParams<EnumSelect>({
        property: {
          [sh1.clearable.value]: true,
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
