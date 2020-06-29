import { ResourceMixin } from '@rdfine/rdfs'
import RdfResource from '@tpluscode/rdfine/RdfResource'

export class EditorMeta extends ResourceMixin(RdfResource) {
  get label() {
    return super.label || this.id.value
  }
}
