const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require("bcryptjs")


const userSchema =  new mongoose.Schema({
    name:{
        type:String,
        required:[true, "Please tell us your name"]
    },
    email:{
        type:String,
        required:[true, "Please provide your email"],
        unique:true,
        lowercase:true,
        validate:[validator.isEmail,'Please provide a valid email']
    },
    photo:String,
    password:{
        type:String,
        required:[true, "Please provide a pasword"],
        minlength:8
    },
    passwordConfirm: {
        type : String,
        required:[true,"Please confirm your password"],
        validate: {
            // This only works on Create and SAve
            validator: function(el){
                return el=== this.password
            },
        message:"Passwords are not the same"
        }
    }

})

userSchema.pre('save',async function(next){

    // Only run this function if paword was actually modified
    if(!this.isModified('password')) return next();

    // Hash the password with the cost of 12 

    this.password = await bcrypt.hash(this.password,12)

    // deleting confirm password field
    this.passwordConfirm = undefined
})
const User = mongoose.model('User',userSchema)

module.exports = User