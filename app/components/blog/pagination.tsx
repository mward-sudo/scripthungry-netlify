import { Link } from '@remix-run/react'

export type PaginationDetails = {
  currentUrl: string
  pageNo: number
  totalPages: number
}

type PaginationProps = {
  pagination: PaginationDetails
}

export const Pagination = ({ pagination }: PaginationProps) => {
  const { currentUrl, pageNo, totalPages } = pagination
  const paginationLinks = generatePageLinksArray(pageNo, totalPages, currentUrl)

  if (totalPages <= 1) {
    return null
  }

  return (
    <div className='btn-group my-20 justify-center'>
      {paginationLinks.map((paginationLink) =>
        paginationLink.disabled ? (
          <button className={`btn btn-disabled`} key={paginationLink.text}>
            {paginationLink.text}
          </button>
        ) : (
          <button
            className={`btn ${paginationLink.currentPage ? 'btn-active' : ''}`}
            key={paginationLink.text}
          >
            <Link
              to={paginationLink.href}
              prefetch='intent'
              className='no-underline'
            >
              {paginationLink.text}
            </Link>
          </button>
        ),
      )}
    </div>
  )
}

type PaginationLink = {
  pageNo: number
  currentPage: boolean
  href: string
  text: string
  disabled: boolean
}

const generatePageLinksArray = (
  currentPage: number,
  totalPages: number,
  currentUrl: string,
): PaginationLink[] => {
  const url = new URL(currentUrl)
  const prevPageNo = currentPage - 1
  const nextPageNo = currentPage + 1

  const getUrl = (pageNo: number) => {
    if (pageNo === 1) {
      if (url.searchParams.has('page')) {
        url.searchParams.delete('page')
      }
    } else {
      url.searchParams.set('page', String(pageNo))
    }
    return `${url.pathname}${url.search}`
  }

  const previousLink: PaginationLink = {
    pageNo: prevPageNo,
    currentPage: false,
    href: getUrl(prevPageNo),
    text: 'Previous',
    disabled: prevPageNo < 1,
  }
  const pageNumberLinks: PaginationLink[] = range(1, totalPages).map(
    (pageNo) => ({
      pageNo,
      currentPage: pageNo === currentPage,
      href: getUrl(pageNo),
      text: pageNo.toString(),
      disabled: false,
    }),
  )
  const nextLink: PaginationLink = {
    pageNo: nextPageNo,
    currentPage: false,
    href: getUrl(nextPageNo),
    text: 'Next',
    disabled: nextPageNo > totalPages,
  }

  return [previousLink, ...pageNumberLinks, nextLink]
}

// Function to generate an array of numbers from min to max
// Example: range(1, 5) => [1, 2, 3, 4, 5]
const range = (min: number, max: number): number[] =>
  Array.from({ length: max - min + 1 }, (_, i) => min + i)
