// the starting point of our app where we gonna initialize our express server
const express = require('express')
// Now we don't want to actually grab anything from that file by simply calling require,
// that's going to ensure that the file runs and it's going to ensure that Mongoose connects to the database.
require('./db/mongoose')  

const userRouter = require('./routers/user')
const taskRouter = require('./routers/task')

const app = express()

const port = process.env.PORT || 3000

//  when we set up this one line..
// It's going to automatically parse incoming json to an object so we can access it in our request handlers.
app.use(express.json())
app.use(userRouter) // register the router
app.use(taskRouter)



app.listen(port, () => {
    console.log('Server is up on port ' + port);
})