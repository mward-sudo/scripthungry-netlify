import { motion } from 'framer-motion'

import { fadeInUp } from '~/lib/animations'

type props = {
  stats: {
    label: string
    value?: number
  }[]
}

export const Stats = ({ stats }: props) => {
  return (
    <div className='mt-8 flex flex-row flex-wrap justify-center gap-8'>
      {stats.map(({ label, value }, i) => (
        <motion.div
          variants={fadeInUp}
          className='min-w-[9.5rem] border-t-2 border-neutral-content p-2 py-4'
          key={`stat-${i}`}
        >
          <div className='stat-title text-accent-content'>{label}</div>
          <div className='stat-value text-accent-content'>{value}</div>
        </motion.div>
      ))}
    </div>
  )
}
