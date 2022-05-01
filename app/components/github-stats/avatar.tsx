export const Avatar = ({ avatar: avatarImageUrl }: { avatar?: string }) =>
  avatarImageUrl ? (
    <div className='avatar'>
      <div className='w-52 rounded-xl'>
        <img
          src={avatarImageUrl}
          alt=''
          width={208}
          height={208}
          className='m-0 rounded-lg'
        />
      </div>
    </div>
  ) : null
