import type { ReactNode } from 'react'

type props = {
  children: ReactNode
}

export const FullWidthEscape = ({ children }: props) => (
  <div className='relative left-[50%] right-[50vw] -mx-[50vw] w-[100vw]'>
    {children}
  </div>
)
