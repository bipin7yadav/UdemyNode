const fs = require('fs')
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Tour = require('./../../models/tourModel')
const User = require('./../../models/userModel')
const Review = require('./../../models/reviewModel')

dotenv.config({ path: "./config.env" });
const DB = process.env.DATABASE.replace("<PASSWORD>", process.env.DBPASSWORD);

mongoose.connect(DB).then(() => {
  console.log("DB Connection Successful !!");
});



// Read JSON FILE
const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours.json`,'utf-8'))
const users = JSON.parse(fs.readFileSync(`${__dirname}/users.json`,'utf-8'))
const reviews = JSON.parse(fs.readFileSync(`${__dirname}/reviews.json`,'utf-8'))

const importData = async () => {
    try {
        await Tour.create(tours)
        await User.create(users,{validateBeforeSave:false})
        await Review.create(reviews)
        console.log("Data Successfully Loaded!")
    } catch (error) {
        console.log(error)
    }
    process.exit()
}


/// Delete All Data From DB

const deleteData = async () => {
    try {
        await Tour.deleteMany()
        await User.deleteMany()
        await Review.deleteMany()
        console.log("Data Successfully Deleted!")
    } catch (error) {
        console.log(error)
    }
    process.exit()
}

if(process.argv[2]==="--import"){
    importData()
}else if(process.argv[2]==="--delete"){
    deleteData()
}

console.log(process.argv);