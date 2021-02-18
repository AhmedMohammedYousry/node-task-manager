// the starting point of our app where we gonna initialize our express server
const express = require('express')
// Now we don't want to actually grab anything from that file by simply calling require,
// that's going to ensure that the file runs and it's going to ensure that Mongoose connects to the database.
require('./db/mongoose')  
const User = require('./models/user')
const Task = require('./models/task')

const app = express()

const port = process.env.PORT || 3000

//  when we set up this one line..
// It's going to automatically parse incoming json to an object so we can access it in our request handlers.
app.use(express.json())

// we will use post instead of get for resource creation
app.post('/users', async (req,res) => {
    const user = new User(req.body)

    try {
    //  await the promise that comes back from calling that save method.
    await user.save()
    res.status(201).send(user)
    } catch (e) {
        res.status(400).send(e)
    }
    
    // user.save().then(() => {
    //     res.status(201).send(user)
    // }).catch((error) => {
    //     res.status(400).send(error)
    // })
})

app.get('/users', async (req, res) => {

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
app.get('/users/:id', async (req, res) => {
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
app.patch('/users/:id', async (req, res) => {
    const updates = Object.keys(req.body) // keys will return an array of strings where each is a property on that object.
    const allowedUpdates = ['name', 'email', 'password', 'age']
    const isValidUpdate = updates.every((update) => allowedUpdates.includes(update))
    if(!isValidUpdate) {
        return res.status(400).send({ error: 'Invalid update!' })
    }
    try {
        const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
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
app.delete('/users/:id', async (req, res) => {
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

// endpoint for task creation
app.post('/tasks', async (req, res) => {
    const task = new Task(req.body)

    try {
        await task.save()
        res.status(201).send(task)
    } catch (e) {
        res.status(400).send(e)
    }
    
    // task.save().then(() => {
    //     res.status(201).send(task);
    // }).catch((e) => {
    //     res.status(400).send(e);
    // })
})
app.get('/tasks', async (req, res) => {

    try {
        const tasks = await Task.find()
        res.send(tasks)
    } catch (e) {
        res.status(500).send()
    }
    // Task.find().then((tasks) => {
    //     res.send(tasks)
    // }).catch((e) => {
    //     res.status(500).send()
    // })
})
app.get('/tasks/:id', async (req, res) => {
    const _id = req.params.id

    try {
        const task = await Task.findById(_id)
        if(!task){
            return res.status(404).send()
        }
        res.send(task)
    } catch (e) {
        res.status(500).send()
    }
    // Task.findById(_id).then((task) => {
    //     if(!task) {
    //         return res.status(404).send()
    //     }
    //     res.send(task)
    // }).catch((e) => {
    //     res.status(500).send()
    // })
})

app.patch('/tasks/:id', async (req, res) => {
    const updates = Object.keys(req.body)
    const validUpdates = ['description', 'completed']
    const isValidUpdate = updates.every((update) => validUpdates.includes(update))

    if(!isValidUpdate) {
        return res.status(400).send({ error: 'Invalid update request!' })
    }

    try {
        const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
        if (!task) {
            return res.status(404).send()
        }
        res.send(task)
    } catch (e) {
        res.status(400).send()
    }
})
app.delete('/tasks/:id', async (req, res) => {
    try {
        const task = await Task.findByIdAndDelete(req.params.id)
        if (!task) {
            res.status(404).send()
        }
        res.send(task)
    } catch (e) {
        res.status(500).send()
    }
})
app.listen(port, () => {
    console.log('Server is up on port ' + port);
})