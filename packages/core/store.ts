import type { Plugins, Plugin } from '@captaincodeman/rdx'

const plugins: Plugins = {}

export function getPlugins() {
  return { ...plugins }
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
