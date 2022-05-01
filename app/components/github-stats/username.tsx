export const Username = ({ username = '', name = '' }) => {
  return name ? (
    <h2 className='mb-6 text-4xl'>
      {name} is <span className='font-bold'>{username}</span>
    </h2>
  ) : (
    <h2 className='mb-6 text-4xl font-bold'>{username}</h2>
  )
}
