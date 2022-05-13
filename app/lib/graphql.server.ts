import { GraphQLClient } from 'https://deno.land/x/graphql_request/mod.ts'

import { getSdk } from '~/generated/graphql.server'

export const sdk = getSdk(
  new GraphQLClient(Deno.env.get('HASURA_ENDPOINT') || '', {
    headers: {
      'content-type': 'application/json',
      'x-hasura-admin-secret': `${Deno.env.get('HASURA_TOKEN') || ''}`,
    },
  }),
)
