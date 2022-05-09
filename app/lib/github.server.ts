import invariant from 'tiny-invariant'

import { site } from '~/config'
import type { GithubUserFragment } from '~/generated/graphql.server'

import { sdk } from './graphql.server'

type GitHubErrorResponse = {
  response: {
    errors: Array<{
      type: string
      message: string
    }>
  }
}

export const getGithubPageTitle = ({ user }: { user: GithubUserFragment }) => {
  const title: Record<number, string>[] = []
  title.push(user.name ?? user.login)
  title.push(`Github Profile | ${site.name}`)

  return title.join(' | ')
}

export const getGithubUser = async (username: string) => {
  const githubUser = await sdk
    .gitHubUser({ username })
    .catch((e: GitHubErrorResponse) => {
      throw new Response(`${e.response.errors[0].message}`, { status: 404 })
    })
  invariant(githubUser?.github?.user, 'githubUser.data.user is undefined')

  return githubUser.github.user
}
