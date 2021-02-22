const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Task = require('./task')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true

    },
    age: {
        type: Number,
        default: 0,
        validate(value) {
            if (value < 0) {
                throw new Error('Age must be a positive number!')
            }
        }
    },
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Email is invalid!')
            }
        }
    },
    password: {
        type: String,
        trim: true,
        required: true,
        validate(value) {
            if (value.length <= 6) {
                throw new Error('Password must be more than 6 characters.')
            } else if(validator.contains(value,'password')) {
                throw new Error('You cannot use password keyword in your password!')
            }
        }
    },
    tokens: [{ 
        token: {
            type: String,
            required: true
        }
     }]
})

// foreign field is the name of the field on the other thing (on the task) that's going to create this relationship
//  and we set that up to be the owner. The local field is that is where that local data is stored.

// So we have the owner object id on the task and that is associated with the id of the user here.
// So the local field the users id is a relationship between that and the task owner field which is also a user I.D..
userSchema.virtual('tasks', {
    ref: 'Task',
    localField: '_id',
    foreignField: 'owner'
})

userSchema.methods.toJSON = function() {
    const user = this
    const userObject = user.toObject()

    delete userObject.password
    delete userObject.tokens
    return userObject
}

// so static methods are accessible on the model sometimes called Model methods 
// and our methods are accessible on the instances sometimes called instance methods
userSchema.methods.generateAuthToken = async function() {
    const user = this
    // provide a payload that uniquely identifies the user and here we're just going to use their id
    const token = jwt.sign({ _id: user._id.toString() }, 'thisismynewtoken')

    user.tokens = user.tokens.concat({ token })
    await user.save()
    return token
}

// by setting up a value on userSchema.statics we're setting that up as something we can access
// directly on the model once we actually have access to it.

userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({ email })
    if (!user) {
        throw new Error('Unable to login.')
    }
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
        throw new Error('Unable to login.')
    }
    return user
}


// hash the plaintext password before saving
// The second argument needs to be a standard function not an arrow function because the this binding plays an important
// role and as we know arrow functions don't bind this.
userSchema.pre('save', async function(next) {
    const user = this
    //console.log('Just before saving');
    if(user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8)
    }

    next()
})

// delete all tasks associated with a user when he is removed
userSchema.pre('remove', async function(next) {
    const user = this
    await Task.deleteMany({ owner: user._id })
    next()
})

const User = mongoose.model('User', userSchema)

module.exports = User