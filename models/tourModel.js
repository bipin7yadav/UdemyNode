const mongoose = require("mongoose");

const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "A Tour must have a name"],
    unique: true
  },
  duration :{
    type : Number ,
    required: [true , "A Tour must have a duration"]

  },
  maxGroupSize: {
    type: Number ,
    required: [true , "A tour must have a group size"]
  },
  difficulty: {
    type: String ,
    required : [true , "A tour must have a difficulty"]
  },
  ratingsAverage: {
    type: Number ,
    default: 4.5
  },
  raingsQuantity: {
    type: Number ,
    default:0
  },
  rating: {
    type: Number,
    default: 4.5
  },
  price: {
    type: Number,
    required: [true, "A tour must have a price"]
  },
  priceDiscount : Number ,
  summary:{
    type: String,
    trim : true,
    required : [true , "A tour must have a description"]
  },
  description : {
    type : String ,
    trim :true,
  },
  imageCover: {
    type: String ,
    required :[true ,"A tour must have image cover"]
  },
  images:[String],
  createdAt: {
    type: Date ,
    default : Date.now()
  },
  startDates:[Date]
});

const Tour = mongoose.model("Tour", tourSchema);

module.exports = Tour;
