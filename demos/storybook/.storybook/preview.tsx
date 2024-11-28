import { SyntaxHighlighter } from '@storybook/components'
import turtle from 'react-syntax-highlighter/dist/esm/languages/prism/turtle.js'
import { withActions } from '@storybook/addon-actions/decorator'
import $rdf from '../lib/env.js'
import stringToStream from 'string-to-stream'
import { Description, Stories, Subtitle, Title } from '@storybook/blocks'
import { setBasePath } from '@shoelace-style/shoelace/dist/utilities/base-path.js';

SyntaxHighlighter.registerLanguage('turtle', turtle)

setBasePath('/shoelace/dist');

const preview = {
  tags: ['autodocs'],
  parameters: {
    controls: {
      disableSaveFromUI: true,
    },
    actions: {
      handles: ['foobar'],
    },
    docs: {
      toc: {
        headingSelector: 'h1, h2, h3',
      },
      page: () => (
        <>
          <Title/>
          <Subtitle/>
          <Description/>
          <Stories/>
        </>
      ),
    },

  },
  decorators: [
    withActions,
  ],
  loaders: [async ({ args }: Record<any, any>) => {
    let shapes = $rdf.clownface()
    if (args.shapes) {
      shapes = $rdf.clownface({
        dataset: await $rdf.dataset()
          .import($rdf.formats.parsers.import('text/turtle', stringToStream(args.shapes))!),
      })

      if(args.shape) {
        shapes = shapes.namedNode(args.shape)
      }
    }

    let data = $rdf.clownface()
    if (args.data) {
      data = $rdf.clownface({
        dataset: await $rdf.dataset()
          .import($rdf.formats.parsers.import('text/turtle', stringToStream(args.data))!),
      })
    }

    return {
      shapes,
      data,
    }
  }],
}

export default preview
