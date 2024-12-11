import type { StoryObj as Story } from '@storybook/web-components'
import { createStory, defaultMeta } from '../../common.js'
import textField from '../../../shapes/editors/matchers/star-rating.ttl?raw'
import starRating from '../../../data/rating.ttl?raw'
import { preferMultiline } from './ExtendingMatchers.js'
import { starRatingMatcher } from './AddingMatchers.js'

const meta = { ...defaultMeta }

export default meta

export const AddingMatchers: Story = createStory({
  shapes: textField,
  data: starRating,
  focusNode: 'http://example.org/rating',
})(({ editors }) => {
  editors.addMatchers({
    starRating: starRatingMatcher,
  })
})

export const ExtendingMatchers: Story = createStory({
  shapes: textField,
  prefixes: ['schema', 'dcterms', 'rdfs'],
})(({ editors }) => {
  editors.decorate(preferMultiline)
})
