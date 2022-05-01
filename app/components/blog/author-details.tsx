import type { PostAuthorFragment } from '~/generated/graphql.server'

type props = {
  author: PostAuthorFragment
  date: string
}

export const AuthorDetails = ({ author, date }: props) => {
  return (
    <div className='flex items-center justify-center gap-4 text-lg'>
      <div className='avatar'>
        <div className='w-12 rounded-xl'>
          <img src={author?.picture?.url} alt='' className='m-0' />
        </div>
      </div>
      <div className='text-base-content/60'>
        Published {date} by <span className='font-bold'>{author.name}</span>
      </div>
    </div>
  )
}
