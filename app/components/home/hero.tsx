import { FullWidthEscape } from '../full-width-escape'

export const Hero = () => {
  return (
    <FullWidthEscape>
      <div className='relative aspect-[16/9] w-full overflow-auto'>
        <div className='hero-content relative z-10 mx-auto h-full w-full max-w-5xl text-center underline-offset-8'>
          <h1
            className='m-0 mb-6 transform-gpu text-5xl font-bold text-green-600 md:text-6xl lg:text-7xl 2xl:text-8xl'
            style={{ perspective: '1000px' }}
          >
            <div className='relative text-6xl font-black italic text-primary/70 md:text-7xl lg:text-8xl 2xl:text-9xl'>
              Super fast
            </div>
            <div>cloud web sites</div>
          </h1>
        </div>
      </div>
      <video
        id='background-video'
        autoPlay
        muted
        loop
        playsInline
        className='absolute top-0 m-0 aspect-[16/9] h-full w-full bg-gradient-to-t from-[#5d7685] via-[#eafdfb] to-[#27578a] object-cover'
      >
        <source
          src='https://res.cloudinary.com/scripthungry-com-prog/video/upload/ac_none,e_accelerate:-10,q_auto,f_auto/vc_auto/v1651437759/mixkit-flight-above-the-cloud-level-loop-video-32991-medium_upevqf.mp4'
          media='(min-width: 768px)'
        />
        <source src='https://res.cloudinary.com/scripthungry-com-prog/video/upload/ac_none,c_scale,e_accelerate:-10,q_auto,vc_auto,f_auto,w_768/v1651437759/mixkit-flight-above-the-cloud-level-loop-video-32991-medium_upevqf.mp4' />
      </video>
    </FullWidthEscape>
  )
}
