/* eslint-disable import/no-extraneous-dependencies,import/no-relative-packages */
import topLevelAwait from 'vite-plugin-top-level-await'
import { defineConfig, mergeConfig } from 'vite'
import config from '../../vite.config.js'

export default defineConfig(({ command }) => {
  if (command === 'build') {
    return mergeConfig(config, {
      base: '/playground/',
      plugins: [topLevelAwait()],
    })
  }

  return mergeConfig(config, {
    plugins: [topLevelAwait()],
  })
})
