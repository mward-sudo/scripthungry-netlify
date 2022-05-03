export const blog = {
  postsPerPage: process.env.NODE_ENV === 'production' ? 5 : 2,
}

export const site = {
  url: 'https://scripthungry.com',
  name: 'scriptHungry',
  description:
    'Fast web sites convert better. Boost your sales, increase your conversions, and grow your business faster.',
}
