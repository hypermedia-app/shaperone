import $rdf from '@rdf-esm/data-model'
import { dash, rdf } from '@tpluscode/rdf-ns-builders'
import sh1 from './ns.js'

export default [
  $rdf.quad(sh1.InstancesMultiSelectEditor, rdf.type, dash.MultiEditor),
]
