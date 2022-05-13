import { GraphQLClient } from 'graphql-request'

import { getSdk } from '~/generated/graphql.server'

export const sdk = getSdk(
  new GraphQLClient(process.env.HASURA_ENDPOINT || '', {
    headers: {
      'content-type': 'application/json',
      'x-hasura-admin-secret': `${process.env.HASURA_TOKEN || ''}`,
    },
  }),
)
