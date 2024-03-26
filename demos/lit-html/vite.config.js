// eslint-disable-next-line import/no-extraneous-dependencies
import { mergeConfig } from 'vite'
// eslint-disable-next-line import/no-relative-packages
import config from '../../vite.config.js'

export default mergeConfig(config, {
  base: '/playground/',
})
