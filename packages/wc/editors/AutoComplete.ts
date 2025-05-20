import debounce from 'p-debounce'
import { property, state } from 'lit/decorators.js'
import type { GraphPointer } from 'clownface'
import type { PropertyValues } from 'lit'
import InstancesSelect from './InstancesSelect.js'

export default class extends InstancesSelect {
  declare search: (searchText: string) => Promise<void> | void

  @property({ type: Number, attribute: 'debounce-timeout' })
  public debounceTimeout = 350

  @state()
  protected searchText: string = ''

  @state()
  protected filteredChoices: GraphPointer[] = []

  protected updated(_changedProperties: PropertyValues) {
    super.updated(_changedProperties)

    if (_changedProperties.has('debounceTimeout')) {
      this.search = debounce(this.startSearch, this.debounceTimeout)
    }
  }

  startSearch(searchText: string) {
    this.searchText = searchText
    this.filteredChoices = this.choices.filter(choice => choice.out().values.some(value => value.match(new RegExp(searchText, 'i'))))
  }
}
