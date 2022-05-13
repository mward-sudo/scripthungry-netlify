
import { useCatch, useLoaderData } from '@remix-run/react'
import type { CatchBoundaryComponent } from '@remix-run/react/routeModules'
import type { HeadersFunction, LoaderFunction, MetaFunction } from '@remix-run/server-runtime';
import { json } from '@remix-run/server-runtime'
import { motion } from 'framer-motion'

import { LoadNewUser } from '~/components/github-stats/load-new-user'
import { UserCard } from '~/components/github-stats/user-card'
import type { GithubUserFragment } from '~/generated/graphql.server'
import { fadeInLeft } from '~/lib/animations'
import { getGithubPageTitle, getGithubUser } from '~/lib/github.server'

export const headers: HeadersFunction = () => ({
  'Cache-Control': 's-maxage=360, stale-while-revalidate=3600',
  Link: '<https://avatars.githubusercontent.com>; rel="preconnect"',
})

export const meta: MetaFunction = ({ data }: { data: LoaderData }) => ({
  title: data.title,
  description: data.description,
})

type LoaderData = {
  githubUser: GithubUserFragment
  title: string
  description: string
}

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url)
  const username = url.searchParams.get('github') ?? 'mward-sudo'
  const githubUser = await getGithubUser(username)

  const title = getGithubPageTitle({ user: githubUser })
  const description = githubUser.bio ?? ''

  const data: LoaderData = {
    githubUser,
    title,
    description,
  }

  return json(data)
}

const Github = () => {
  const { githubUser } = useLoaderData<LoaderData>()

  return (
    <>
      <motion.div variants={fadeInLeft}>
        <LoadNewUser login={githubUser.login} />
      </motion.div>
      <UserCard user={githubUser} />
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

export default Github
