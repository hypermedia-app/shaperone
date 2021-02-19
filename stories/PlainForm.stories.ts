import { schema } from '@tpluscode/rdf-ns-builders'
import clownface from 'clownface'
import { dataset } from '@rdf-esm/dataset'
import { ShaperoneForm } from './ShaperoneForm'
import { template } from './template'
import { simplePerson } from './lib/shapes'

export default {
  title: 'shaperone-form',
  argTypes: {
    shapes: {
      table: {
        disable: true,
      },
    },
    resource: {
      table: {
        disable: true,
      },
    },
  },
}

const Template = template(ShaperoneForm)
const resource = clownface({ dataset: dataset() }).blankNode()

resource.addOut(schema.name, 'John Doe')

export const Foo = Template.bind({})
Foo.args = {
  shapes: simplePerson.pointer,
  resource,
}
