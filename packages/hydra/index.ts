import type { StoreDispatch } from '@captaincodeman/rdx'
import type { editors } from '@hydrofoil/shaperone-core/models/editors'
import type { components } from '@hydrofoil/shaperone-core/models/components'
import type { HydraClient } from 'alcaeus/alcaeus'
import { autocomplete, instancesSelector } from './components'

interface Config {
  models: {
    editors: typeof editors
    components: typeof components
  }
}

type Dispatch = StoreDispatch<Config>

interface Configuration {
  editors: Dispatch['editors']
  components: Dispatch['components']
}

interface Options {
  client?: HydraClient
}

export default function setup(configuration: Configuration, { client }: Options = {}): void {
  configuration.components.decorate(instancesSelector.decorator(client))
  configuration.components.decorate(autocomplete.decorator(client))
  configuration.editors.decorate(instancesSelector.matcher)
  configuration.editors.decorate(autocomplete.matcher)
}
