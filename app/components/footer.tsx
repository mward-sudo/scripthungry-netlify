export const Footer = () => {
  const today = new Date()
  const firstYear = 2021
  const currentYear = today.getFullYear()

  return (
    <footer className='p-4 pt-24 pb-8 text-center'>
      Copyright © {firstYear}
      {currentYear > firstYear ? `-${currentYear}` : ``} Michael Ward
    </footer>
  )
}
