import type { Plugins, Plugin } from '@captaincodeman/rdx'
import { EffectsPlugin } from './state/effectsPlugin.js'

export { createModel, createStore, devtools } from '@captaincodeman/rdx'

const plugins: Plugins = {}

export function getPlugins() {
  return {
    ...plugins,
    effectsPlugin: new EffectsPlugin(), // replace built-in effects plugin
  }
}

export function addPlugin(newPlugins: Record<string, Plugin | undefined>) {
  for (const [name, plugin] of Object.entries(newPlugins)) {
    if (!plugin) {
      delete plugins[name]
    } else {
      plugins[name] = plugin
    }
  }
}
