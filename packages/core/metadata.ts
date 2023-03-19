import $rdf from 'rdf-ext'
import { dash, rdf, xsd } from '@tpluscode/rdf-ns-builders'
import sh1 from './ns.js'

export default [
  $rdf.quad(sh1.InstancesMultiSelectEditor, rdf.type, dash.MultiEditor),
  $rdf.quad(dash.DetailsEditor, sh1.implicitDefaultValue, $rdf.literal('true', xsd.boolean)),
]
