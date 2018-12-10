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

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
}