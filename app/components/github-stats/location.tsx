export const Location = ({ location = '' }: { location?: string | null }) =>
  location ? <p className='text-center text-sm'>Located in {location}</p> : null
