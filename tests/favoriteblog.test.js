const listHelper = require('../utils/list_helper')
const blogData = require('../testdata/blogs')

describe('favorite blog',  () => {

  test('return blogpost with most likes', () => {
    const result = listHelper.favoriteBlog(blogData.many)

    expect(result).toEqual({
      title: 'Canonical string reduction',
      author: 'Edsger W. Dijkstra',
      likes: 12,
    })
  })

})