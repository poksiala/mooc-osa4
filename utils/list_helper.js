const dummy = blogs => {
  return 1
}

const totalLikes = blogs => {
  return blogs.reduce((acc, b) => acc + b.likes, 0)
}

const favoriteBlog = blogs => {
  const reducer = (bestThisFar, current) => {
    return bestThisFar.likes < current.likes ? current : bestThisFar
  }

  const {likes, title, author} = blogs.reduce(reducer)
  return {likes, title, author}
}

const mostBlogs = blogs => {
  const authorMap = new Map()
  const authorSet = new Set()
  blogs.forEach(blog => {
    const author = blog.author
    if (!authorSet.has(author)) {
      authorSet.add(author)
      authorMap.set(author, 0)
    }
    authorMap.set(author, authorMap.get(author) + 1)
  })

  const author = [...authorSet].reduce((best, current) => {
    return authorMap.get(best) < authorMap.get(current) ? current : best
  })

  return {
    author, 
    blogs: authorMap.get(author)
  }
}

const mostLikes = blogs => {

  const authorMap = new Map()
  const authorSet = new Set()

  blogs.forEach(blog => {
    const author = blog.author
    if (!authorSet.has(author)) {
      authorSet.add(author)
      authorMap.set(author, 0)
    }
    authorMap.set(author, authorMap.get(author) + blog.likes)
  })

  const author = [...authorSet].reduce((best, current) => {
    return authorMap.get(best) < authorMap.get(current) ? current : best
  })

  return {
    author, 
    likes: authorMap.get(author)
  }
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
}