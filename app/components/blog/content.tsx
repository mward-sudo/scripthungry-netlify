import { RichText } from '@graphcms/rich-text-react-renderer'

import type { PostContentFragment } from '~/generated/graphql.server'

import { UnknownLink } from '../unknown-link'

export const Content = ({ content }: { content: PostContentFragment }) => (
  <RichText
    content={content.raw}
    renderers={{
      code_block: ({ children }) => (
        <pre>
          <code>{children}</code>
        </pre>
      ),
      a: ({ children, href }) => (
        <UnknownLink to={href ?? ''}>{children}</UnknownLink>
      ),
    }}
  />
)
