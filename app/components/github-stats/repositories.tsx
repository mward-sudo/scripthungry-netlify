import { ImStarFull } from 'react-icons/im'

import type { RepoFragment } from '~/generated/graphql.server'

type params = {
  repo: RepoFragment | null
}

export const Repositories = ({ repo }: params) => {
  return repo ? (
    <a
      href={repo.url || ''}
      className='my-4 block bg-base-200 p-4 no-underline hover:outline-dotted hover:outline-2 hover:outline-stone-500 dark:bg-base-200'
    >
      <div className='flex w-full flex-auto items-center justify-between gap-4 text-lg'>
        <div>
          <div className='text-xl font-bold'>{repo.name}</div>
          <div className='text-italic'>{repo.description}</div>
        </div>
        <div className='min-w-fit'>
          <ImStarFull className='mr-2 inline-block align-middle text-yellow-500' />
          <span className='inline-block align-middle'>
            {repo.stargazers.totalCount}
          </span>
        </div>
      </div>
    </a>
  ) : null
}
