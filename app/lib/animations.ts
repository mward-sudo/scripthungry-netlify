import type { Variants } from 'framer-motion'

export const fadeInUp: Variants = {
  initial: {
    opacity: 0,
    y: 200,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.25,
      staggerChildren: 0.05,
    },
  },
}

export const fadeInDown: Variants = {
  initial: {
    ...fadeInUp.initial,
    y: -200,
  },
  animate: {
    ...fadeInUp.animate,
    y: 0,
  },
}

export const fadeInRight: Variants = {
  initial: {
    ...fadeInUp.initial,
    x: -200,
    y: 0,
  },
  animate: {
    ...fadeInUp.animate,
    x: 0,
    y: 0,
  },
}

export const fadeInLeft: Variants = {
  initial: {
    ...fadeInUp.initial,
    x: 200,
    y: 0,
  },
  animate: {
    ...fadeInUp.animate,
    x: 0,
    y: 0,
  },
}
