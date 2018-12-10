const listHelper = require('../utils/list_helper')
const blogData = require('../testdata/blogs')

describe('total likes', () => {

  test('when list has only one blog equals the likes of that', () => {
    const result = listHelper.totalLikes(blogData.one)
    expect(result).toBe(5)
  })

  test('sum of likes when there are multiple blogposts', () => {
    const result = listHelper.totalLikes(blogData.many)
    expect(result).toBe(36)
  })
})


