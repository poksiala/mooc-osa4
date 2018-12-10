const listHelper = require('../utils/list_helper')
const blogData = require('../testdata/blogs')

describe('most likes',  () => {

  test('return author with most likes', () => {
    const result = listHelper.mostLikes(blogData.many)

    expect(result).toEqual({
      author: 'Edsger W. Dijkstra',
      likes: 17
    })
  })

})