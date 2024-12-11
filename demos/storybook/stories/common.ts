import type { Meta, StoryObj as Story } from '@storybook/web-components'
import type { ConfigCallback } from '@hydrofoil/shaperone-wc'
import { merge } from 'ts-deepmerge'
import { render } from './render.js'
import groups from '../shapes/groups.ttl?raw'
import textEditors from '../shapes/text-editors.ttl?raw'

interface StoryFactory {
  (configure: ConfigCallback, overrides?: Partial<Omit<Story, 'render' | 'loaders'>>): Story
}

export const defaultMeta: Meta = {
  component: 'shaperone-form',
  argTypes: {
    focusNode: {
      control: 'text',
    },
    shape: {
      control: 'text',
    },
    prefixes: {
      control: 'text',
    },
    debug: {
      control: 'boolean',
    },
  },
  args: {
    prefixes: 'schema',
  },
}

export const Grouping = createStoryObj({
  name: 'Grouping',
  args: {
    shapes: groups,
  },
})

export const TextEditors = createStoryObj({
  name: 'Text editors',
  args: {
    shapes: textEditors,
  },
})

interface CreateStory {
  name?: string
  shapes?: string
  data?: string
  focusNode?: string
  prefixes?: string[]
}

export function createStory({ name, prefixes, ...args }: CreateStory) {
  const defaults = {
    name,
    args,
  }

  if (prefixes) {
    defaults.args.prefixes = prefixes.join(',')
  }

  return createStoryObj(defaults)
}

function createStoryObj(defaults: Story): StoryFactory {
  return (configure, overrides = {}): Story => merge<Story[]>(defaults, overrides, {
    loaders: [
      async () => ({
        configure,
      }),
    ],
    render,
  })
}
