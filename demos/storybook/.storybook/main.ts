import { join, dirname } from 'node:path'
import { StorybookConfig } from '@storybook/web-components-vite'
import remarkGfm from 'remark-gfm';

/**
 * This function is used to resolve the absolute path of a package.
 * It is needed in projects that use Yarn PnP or are set up within a monorepo.
 */
const getAbsolutePath = (value: string) => {
  return dirname(require.resolve(join(value, 'package.json')))
}

const config: StorybookConfig = {
  stories: ['../stories/**/*.mdx', '../stories/**/*.stories.@(js|jsx|mjs|ts|tsx)'],

  addons: [
    getAbsolutePath('@storybook/addon-links'),
    getAbsolutePath('@storybook/addon-essentials'),
    {
      name: '@storybook/addon-docs',
      options: {
        mdxPluginOptions: {
          mdxCompileOptions: {
            remarkPlugins: [remarkGfm],
          },
        },
      },
    },
  ],

  framework: {
    name: getAbsolutePath('@storybook/web-components-vite'),
    options: {},
  },

  staticDirs: [
    '../shapes',
    '../../../node_modules/@shoelace-style/',
    '../../../dist/_media'
  ],

  docs: {},
}
export default config
