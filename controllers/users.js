const userRouter = require('express').Router()
const User = require('../models/user')
const bcrypt = require('bcrypt')

userRouter.get('/', async (request, response) => {
  try {
    const users = await User
      .find({})
      .populate('blogs', {title: 1, author: 1, likes: 1, url: 1})
    response.json(users.map(User.format))
  } catch (exception) {
    console.log(exception)
    response.status(500).end()
  }
})

userRouter.post('/', async (request, response) => {
  try {
    const {username, name, password, adult} = request.body
    
    if (!password || password.length <= 3) return response.status(400).json({error: 'invalid password'})
    if (!name) return response.status(400).json({error: 'missing name'})
    if (!username) return response.status(400).json({error: 'missing username'})
    
    const namesake = await User.findOne({username})
    if (namesake) return response.status(400).json({error: 'username must be unique'}) 
    
    const saltRounds = 10
    const passwordHash = await bcrypt.hash(password, saltRounds)

    const newUser = new User({
      username,
      name,
      passwordHash,
      adult: (adult === undefined) ? true : adult
    })

    const savedUser = await newUser.save()

    response.status(201).json(User.format(savedUser))  
  } catch (exception) {
    console.log(exception)
    response.status(500).end()
  }
})

module.exports = userRouter