import { GraphQLClient } from 'graphql-request'

export const graphQlClient = new GraphQLClient(
  process.env.HASURA_ENDPOINT || '',
  {
    headers: {
      'content-type': 'application/json',
      'x-hasura-admin-secret': `${process.env.HASURA_TOKEN || ''}`,
    },
  },
)
