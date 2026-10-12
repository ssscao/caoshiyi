import { Manrope } from 'next/font/google'

const sansFont = Manrope({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-sans',
  display: 'swap',
})

export { sansFont }
