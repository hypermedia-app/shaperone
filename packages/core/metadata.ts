import { dash, rdf, xsd } from '@tpluscode/rdf-ns-builders'
import { ShaperoneEnvironment } from './env.js'

export default ($rdf: ShaperoneEnvironment) => ([
  $rdf.quad($rdf.ns.sh1.InstancesMultiSelectEditor, rdf.type, dash.MultiEditor),
  $rdf.quad(dash.DetailsEditor, $rdf.ns.sh1.implicitDefaultValue, $rdf.literal('true', xsd.boolean)),
])
