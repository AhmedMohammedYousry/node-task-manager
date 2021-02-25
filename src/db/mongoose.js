const mongoose = require('mongoose')
// const validator = require('validator')

mongoose.connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useCreateIndex: true ,//This is going to make sure that when Mongoose works with MongoDB our indexes
                         //   are created allowing us to quickly access the data we need to access.
    useFindAndModify: false
})



// const me = new User({
//     name: '     Johnny  ',
//     email: '     JohnnY@gmail.com      ',
//     password: 'lkadspasswordjiaosdjidas'
// })
// me.save().then((me) => {
//     console.log(me);
// }).catch((error) => {
//     console.log('Error', error);
// })

// const task1 = new Task({
//      description: '      Eat Lunch',
    
// })
// task1.save().then((result) => {
//     console.log(result);
// }).catch((error) => {
//     console.log('Error', error);
// })
