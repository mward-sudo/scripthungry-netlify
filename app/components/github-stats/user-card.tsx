import { motion } from 'framer-motion'

import type {
  GithubUserFragment,
  ReposFragment,
} from '~/generated/graphql.server'
import { fadeInLeft, fadeInRight, fadeInUp } from '~/lib/animations'

import { Avatar } from './avatar'
import { Repositories } from './repositories'
import { Stats } from './stats'

function sortRepos(repositories: ReposFragment) {
  return repositories.nodes?.slice().sort((a, b) => {
    // Sort by stars descending first, then by name descending
    if (a !== null && b !== null) {
      if (a?.stargazers.totalCount > b?.stargazers.totalCount) return -1
      if (a?.stargazers.totalCount < b?.stargazers.totalCount) return 1

      if (a?.name > b?.name) return 1
      if (a?.name < b?.name) return -1
    }
    // If both are null, they are equal
    return 0
  })
}

export const UserCard = ({ user }: { user: GithubUserFragment }) => {
  const { repositories, contributionsCollection, following, followers } = user

  const repos = sortRepos(repositories)

  // Calculate the total number of stars in the array user?.repositories?.nodes
  // using user?.repositories?.nodes?.stargazers?.totalCount
  const starsCount = repositories.nodes?.reduce(
    (total, node) => total + (node?.stargazers.totalCount || 0),
    0,
  )

  const stats = [
    { label: 'Repositories', value: repositories.totalCount },
    {
      label: 'Contributions',
      value: contributionsCollection.contributionCalendar.totalContributions,
    },
    {
      label: 'Commits',
      value: contributionsCollection.totalCommitContributions,
    },
    { label: 'Issues', value: contributionsCollection.totalIssueContributions },
    {
      label: 'PRs',
      value: contributionsCollection.totalPullRequestContributions,
    },
    { label: 'Following', value: following.totalCount },
    { label: 'Followers', value: followers.totalCount },
    { label: 'Stars', value: starsCount },
  ]

  return (
    <>
      <div className='full-width-escape my-12'>
        <div className='hero bg-base-200 p-4 text-center lg:p-16 lg:text-left'>
          <div className='hero-content max-w-[50rem] flex-col gap-12 lg:flex-row'>
            <motion.div variants={fadeInRight}>
              <Avatar avatar={user.avatarUrl} />
            </motion.div>
            <motion.div variants={fadeInLeft}>
              <h1 className='m-0 text-4xl font-bold sm:text-5xl'>
                Hello there, I am {user.name || user.login}
              </h1>
              {user.bio && <p className='m-0 py-6'>{user.bio}</p>}
            </motion.div>
          </div>
        </div>
      </div>

      <Stats stats={stats} />

      <motion.div variants={fadeInUp} className='mx-auto mt-16 max-w-4xl'>
        <h2 className='text-center text-3xl font-bold'>User Repositories</h2>
        {repos &&
          repos.map((repo) => <Repositories key={repo?.url} repo={repo} />)}
      </motion.div>
    </>
  )
}
