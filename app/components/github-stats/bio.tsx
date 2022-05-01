export const Bio = ({ bio = '' }) =>
  bio ? <p className='bold mb-8 text-xl italic'>{bio}</p> : null
