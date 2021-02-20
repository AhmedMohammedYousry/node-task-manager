const express = require('express')
const User = require('../models/user')

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

router.get('/users', async (req, res) => {

    try {
        const users = await User.find()
        res.send(users)
    } catch (e) {
        res.status(500).send()
    }
    // User.find().then((users) => {
    //     res.send(users)
    // }).catch((e) =>{
    //     res.status(500).send()
    // })
})
router.get('/users/:id', async (req, res) => {
    const _id = req.params.id
    try {
        const user = await User.findById(_id)
        if(!user){
            return res.status(404).send()
        }
        res.send(user)
    } catch (e) {
        res.status(500).send()
    }
    
    // User.findById(_id).then((user) => {
    //     if(!user){
    //         return res.status(404).send()
    //     }
    //     res.send(user)
    // }).catch((e) => {
    //     res.status(500).send()
    // })
})
// patch HTTP method is designed for updating an existing resource
router.patch('/users/:id', async (req, res) => {
    const updates = Object.keys(req.body) // keys will return an array of strings where each is a property on that object.
    const allowedUpdates = ['name', 'email', 'password', 'age']
    const isValidUpdate = updates.every((update) => allowedUpdates.includes(update))
    if(!isValidUpdate) {
        return res.status(400).send({ error: 'Invalid update!' })
    }
    try {
        const user = await User.findById(req.params.id)
        updates.forEach((update) => {
            user[update] = req.body[update]
        })
        await user.save()
        // const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
        if(!user){
            return res.status(404).send()
        }
        res.send(user)
    } catch (e) {
        res.status(400).send(e)
    }
})
// EXPRESS provides us with a delete method allowing us to set up an HTTP end point that uses the delete HTTP method.
// So far we've used post to create, get to read, patch to update. And here we used delete to delete.
router.delete('/users/:id', async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id)
        if(!user){
            return res.status(404).send()
        }
        res.send(user)
    } catch (e) {
        res.status(500).send()
    }
})

module.exports = router