import type { StoryObj as Story } from '@storybook/web-components'
import type { ConfigCallback } from '@hydrofoil/shaperone-wc'
import { merge } from 'ts-deepmerge'
import { render } from './render.js'
import groups from '../shapes/groups.ttl?raw'
import textEditors from '../shapes/text-editors.ttl?raw'

interface StoryFactory {
  (configure: ConfigCallback, overrides?: Partial<Omit<Story, 'render' | 'loaders'>>): Story
}

export const Grouping = createStory({
  name: 'Grouping',
  args: {
    shapes: groups,
  },
})

export const TextEditors = createStory({
  name: 'Text editors',
  args: {
    shapes: textEditors,
  },
})

function createStory(defaults: Story): StoryFactory {
  return (configure, overrides = {}): Story => merge<Story[]>(defaults, overrides, {
    loaders: [
      async () => ({
        configure,
      }),
    ],
    render,
  })
}
