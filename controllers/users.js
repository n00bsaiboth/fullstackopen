const usersRouter = require('express').Router()
const User = require('../models/user')

const logger = require('../utils/logger')

const bcrypt = require('bcrypt')

usersRouter.get('/api/users', (request, response) => {
    User.find({})
        .then(users => {
            if (users) {
                logger.info(users)
                response.json(users)
            } else {
                response.status(404).json({
                    error: 'could not find any users. '
                }) 

                logger.error('could not find any users. ')
            }
        })
})

usersRouter.get('/api/users/:id', (request, response, next) => {
    User.findById(request.params.id)
        .then(user => {
            if (user) {
                logger.info(user)
                response.json(user)
            } else {
                response.status(404).json({
                    error: 'could not find user with that ID. '
                })

                logger.error('could not find user with that ID. ')
            }
        })
})

usersRouter.post('/api/users', async (request, response) => {
    const { username, password } = request.body

    if (username === undefined) {
        logger.error('username is missing. ')

        return response.status(404).json({
            error: 'username is missing.'
        })
    }

    const salt = 10
    const passwordHash = await bcrypt.hash(password, salt)

    const user = new User({
        username: username,
        passwordHash: passwordHash
    })

    const saveUser = await user.save()

    response.status(201).json(saveUser)
})

module.exports = usersRouter;