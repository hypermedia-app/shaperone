import type { Meta, StoryObj as Story } from '@storybook/web-components'
import { merge } from 'ts-deepmerge'
import type { InstanceConfigCallback } from '@hydrofoil/shaperone-wc/configure.js'
import { render } from './render.js'
import groups from '../shapes/groups.ttl?raw'
import textEditors from '../shapes/text-editors.ttl?raw'

interface StoryFactory {
  (configure?: InstanceConfigCallback, overrides?: Partial<Omit<Story, 'render' | 'loaders'>>): Story
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
  customPrefixes?: Record<string, string>
  debug?: boolean
}

export function createStory({ name, prefixes, customPrefixes, ...args }: CreateStory) {
  const defaults = {
    name,
    args,
  }

  if (prefixes) {
    defaults.args.prefixes = prefixes.join(',')
  }

  if (customPrefixes) {
    defaults.args.customPrefixes = customPrefixes
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
