const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')

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
    }
})

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

const User = mongoose.model('User', userSchema)

module.exports = User