// eslint-disable-next-line import/no-extraneous-dependencies
import { defineConfig, mergeConfig } from 'vite'
// eslint-disable-next-line import/no-relative-packages
import config from '../../vite.config.js'

export default defineConfig(({ command }) => {
  if (command === 'build') {
    return mergeConfig(config, {
      base: '/playground/',
    })
  }

  return config
})
