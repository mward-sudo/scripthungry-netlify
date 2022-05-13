import { GraphQLClient } from 'https://deno.land/x/graphql_request@v4.1.0/mod.ts'

import { getSdk } from '../generated/graphql.server.ts'

export const sdk = getSdk(
  new GraphQLClient(Deno.env.get('HASURA_ENDPOINT') || '', {
    headers: {
      'content-type': 'application/json',
      'x-hasura-admin-secret': `${Deno.env.get('HASURA_TOKEN') || ''}`,
    },
  }),
)
