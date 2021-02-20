// the starting point of our app where we gonna initialize our express server
const express = require('express')
// Now we don't want to actually grab anything from that file by simply calling require,
// that's going to ensure that the file runs and it's going to ensure that Mongoose connects to the database.
require('./db/mongoose')  

const userRouter = require('./routers/user')
const taskRouter = require('./routers/task')

const app = express()

const port = process.env.PORT || 3000

// app.use((req, res, next) => {
//     res.status(503).send('Site is currently down. Check back soon.')
// })


//  when we set up this one line..
// It's going to automatically parse incoming json to an object so we can access it in our request handlers.
app.use(express.json())
app.use(userRouter) // register the router
app.use(taskRouter)

//
// Without middleware: new request -> run route handler
//
// With middleware: new request -> do something -> run route handler
//

app.listen(port, () => {
    console.log('Server is up on port ' + port);
})

const jwt = require('jsonwebtoken')
const myFunction = async () => {
    // mess around with hashing
    // const password = 'red12345!'
    // const hashedPassword = await bcrypt.hash(password, 8)
    // console.log(password);
    // console.log(hashedPassword);

    // const isMatch = await bcrypt.compare('Red12345!', hashedPassword)
    // console.log(isMatch);
    const token = jwt.sign({ _id: "12345" }, "thisismynewtoken", { expiresIn: '7 days' })
    console.log(token);

    const payload = jwt.verify(token, 'thisismynewtoken')
    console.log(payload);
}

myFunction()