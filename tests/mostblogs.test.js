const listHelper = require('../utils/list_helper')
const blogData = require('../testdata/blogs')

describe('most blogs',  () => {

  test('return author with most blog posts', () => {
    const result = listHelper.mostBlogs(blogData.many)

    expect(result).toEqual({
      author: 'Robert C. Martin',
      blogs: 3
    })
  })

})