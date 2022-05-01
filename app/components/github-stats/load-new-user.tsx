import { Form } from '@remix-run/react'

export const LoadNewUser = ({ login }: { login?: string }) => (
  <Form className='form-control mt-8 items-center lg:mt-0 lg:items-end'>
    <label className='input-group w-auto'>
      <span className='hidden sm:flex'>Github name:</span>
      <input
        type='text'
        placeholder={login}
        name='github'
        className='input input-bordered w-64 text-lg focus:border-none focus:ring-0'
      />
      <button className='btn btn-square' type='submit'>
        <svg
          xmlns='http://www.w3.org/2000/svg'
          className='h-6 w-6'
          fill='none'
          viewBox='0 0 24 24'
          stroke='currentColor'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth='2'
            d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z'
          />
        </svg>
        <span className='sr-only'>Search</span>
      </button>
    </label>
  </Form>
)
