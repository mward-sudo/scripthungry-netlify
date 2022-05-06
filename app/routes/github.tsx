import type {
  HeadersFunction,
  LoaderFunction,
  MetaFunction,
} from '@remix-run/node'
import { json } from '@remix-run/node'
import { useCatch, useLoaderData } from '@remix-run/react'
import type { CatchBoundaryComponent } from '@remix-run/react/routeModules'
import invariant from 'tiny-invariant'

import { LoadNewUser } from '~/components/github-stats/load-new-user'
import { UserCard } from '~/components/github-stats/user-card'
import { site } from '~/config'
import type {
  GithubUserFragment,
  GitHubUserQuery,
} from '~/generated/graphql.server'
import { GitHubUser } from '~/generated/graphql.server'
import { graphQlClient } from '~/lib/graphql.server'

export const headers: HeadersFunction = () => ({
  'Cache-Control': 's-maxage=360, stale-while-revalidate=3600',
  Link: '<https://avatars.githubusercontent.com>; rel="preconnect"',
})

export const meta: MetaFunction = ({ data }: { data: LoaderData }) => ({
  title: getPageTitle(data),
  description: data?.githubUserData?.github?.user?.bio,
})

type GitHubErrorResponse = {
  response: {
    errors: Array<{
      type: string
      message: string
    }>
  }
}

type LoaderData = {
  githubUserData: GitHubUserQuery
}

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url)
  const username = url.searchParams.get('github') ?? 'mward-sudo'
  const githubUserData = await graphQlClient
    .request<GitHubUserQuery>(GitHubUser, { username })
    .catch((e: GitHubErrorResponse) => {
      throw new Response(`${e.response.errors[0].message}`, { status: 404 })
    })

  const data: LoaderData = {
    githubUserData,
  }

  return json(data)
}

const Github = () => {
  const { githubUserData } = useLoaderData<LoaderData>()
  invariant(githubUserData.github?.user, 'Github user not found')
  const user: GithubUserFragment = githubUserData.github.user

  return (
    <>
      <LoadNewUser login={user.login} />
      <UserCard user={user} />
    </>
  )
}

export const CatchBoundary: CatchBoundaryComponent = () => {
  const caught = useCatch()

  return (
    <div className='error-container'>
      <LoadNewUser />

      <div className='alert alert-error mt-8 justify-center text-2xl shadow-lg'>
        <div>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            className='h-6 w-6 flex-shrink-0 stroke-current'
            fill='none'
            viewBox='0 0 24 24'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth='2'
              d='M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z'
            />
          </svg>
          <p className='m-4 my-0'>{caught.data}</p>
        </div>
      </div>
    </div>
  )
}

const getPageTitle = (data: LoaderData) => {
  try {
    const title: Record<number, string>[] = []
    if (data.githubUserData.github?.user?.name) {
      title.push(data.githubUserData.github.user.name)
    }
    if (data.githubUserData.github?.user?.login) {
      title.push(data.githubUserData.github.user.login)
    }
    title.push(`Github Profile | ${site.name}`)

    return title.join(' | ')
  } catch (error) {
    return `Github User Not Found | Github Profile | ${site.name}`
  }
}

export default Github
