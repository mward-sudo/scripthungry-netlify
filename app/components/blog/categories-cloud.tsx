import { Link } from '@remix-run/react'

import type { CategoriesQuery } from '~/generated/graphql.server'

export const CategoriesCloud = ({
  categories,
}: {
  categories: CategoriesQuery
}) => {
  const categoryCloud = categories.graphcms?.blogCategories
  return categoryCloud ? (
    <>
      <h2 className='mt-0'>Categories</h2>
      {categories &&
        categoryCloud.map((category) => (
          <Link
            to={`/blog?category=${category.slug}`}
            prefetch='intent'
            key={category.slug}
            className='btn btn-ghost btn-sm'
          >
            {category.name}
          </Link>
        ))}
    </>
  ) : null
}
