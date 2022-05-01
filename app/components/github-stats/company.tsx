export const Company = ({ company }: { company?: string | null }) =>
  company ? <p className='textext-lg mb-8'>Working for {company}</p> : null
