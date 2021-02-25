const express = require('express')
const multer = require('multer')

const User = require('../models/user')
const auth = require('../middleware/auth')
const router = new express.Router()

// with the new router in place we can setup all over the routes we want to support
// we will use post instead of get for resource creation
router.post('/users', async (req,res) => {
    const user = new User(req.body)

    try {
    //  await the promise that comes back from calling that save method.
    await user.save()
    const token = await user.generateAuthToken()
    res.status(201).send({ user, token })
    } catch (e) {
        res.status(400).send(e)
    }
    
    // user.save().then(() => {
    //     res.status(201).send(user)
    // }).catch((error) => {
    //     res.status(400).send(error)
    // })
})

// this is the endpoint you use to login with an existing account
router.post('/users/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()
        res.send({ user, token })
    } catch (e) {
        res.status(400).send()
    }
})

// new route for logout
router.post('/users/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token
        })
        await req.user.save()
        res.send()
    } catch (e) {
        res.status(500).send()
    }
})
// route for logging out from all sessions
router.post('/users/logoutALL', auth, async (req, res) => {
    try {
        req.user.tokens = []
        await req.user.save()
        res.send()
    } catch (e) {
        res.status(500).send()
    }
})

router.get('/users/me', auth, async (req, res) => {
    res.send(req.user)
})

// patch HTTP method is designed for updating an existing resource
router.patch('/users/me', auth,  async (req, res) => {
    const updates = Object.keys(req.body) // keys will return an array of strings where each is a property on that object.
    const allowedUpdates = ['name', 'email', 'password', 'age']
    const isValidUpdate = updates.every((update) => allowedUpdates.includes(update))
    if(!isValidUpdate) {
        return res.status(400).send({ error: 'Invalid update!' })
    }
    try {
        updates.forEach((update) => {
            req.user[update] = req.body[update]
        })
        await req.user.save()
        // const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
     
        res.send(req.user)
    } catch (e) {
        res.status(400).send(e)
    }
})
// EXPRESS provides us with a delete method allowing us to set up an HTTP end point that uses the delete HTTP method.
// So far we've used post to create, get to read, patch to update. And here we used delete to delete.
router.delete('/users/me', auth, async (req, res) => {
    try {
        await req.user.remove()
        res.send(req.user)
    } catch (e) {
        res.status(500).send()
    }
})

// configure multer
const upload = multer({
    dest: 'avatars/',
    limits: {
        fileSize: 1000000
    },
    fileFilter(req, file, cb){
        if(!file.originalname.match(/\.(jpg|jpeg|png)$/)){
            return cb(new Error('Please upload an image file.'))
        }
        cb(undefined, true)
    }
})

// add a new endpoint for the users to upolad their profile picture
router.post('/users/me/avatar', upload.single('avatar'), (req, res) => {
    res.send()
}, (error, req, res, next) => {
    res.status(400).send({ error: error.message })
})


module.exports = router