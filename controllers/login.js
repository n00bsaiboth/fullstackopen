const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

const logger = require('../utils/logger')

const loginRouter = require('express').Router()

const User = require('../models/user')

loginRouter.get('/api/login', (request, response) => {
    response.send('Login')
})

loginRouter.post('/api/login', async (request, response) => {
    const { username, password } = request.body

    const user = await User.findOne( { username } )

    const verify = user === null ? false : await bcrypt.compare(password, user.passwordHash)

    if (!(user && verify)) {
        logger.error('invalid username or password. ')
        return response.status(401).json({
            error: 'invalid username or password. '
        })
    }

    const userForToken = {
        username: user.username,
        id: user._id
    }

    const token = jwt.sign(userForToken, process.env.SECRET)

    logger.info(`${token}: username:${user.username}. `)

    response.status(200).send({ token, username: user.username })

})

module.exports = loginRouter