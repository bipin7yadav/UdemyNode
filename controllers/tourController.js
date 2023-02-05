/* eslint-disable no-console */
// const fs = require("fs");
const Tour = require("./../models/tourModel");

const APIFeatures = require("./../utils/apiFeatures")

const catchAsync = require("./../utils/catchAsync")

const AppError = require("./../utils/appError")

const factory = require('./handleFactory')
// Route Handlers


exports.aliasTopTours = (req,res,next)=>{
  req.query.limit="5";
  req.query.sort="-ratingsAverage,price";
  req.query.fields = "name,price,ratingsAverage,summary,difficulty";
  next();
}

exports.getTour = factory.getOne(Tour, { path: 'reviews' });
exports.getAllTours = factory.getAll(Tour)

exports.createTour = factory.createOne(Tour);
exports.updateTour = factory.updateOne(Tour)

exports.deleteTour = factory.deleteOne(Tour)


 exports.getTourStats = catchAsync(async (req,res,next) => {

    const stats = await Tour.aggregate([
      {
        $match : { ratingsAverage :{ $gte:4.5}}
      },
      {
        $group: {
          // _id : { $toUpper : '$ratingsAverage'},
          _id : { $toUpper : '$difficulty'},
          numTours : { $sum: 1},
          numRatings : { $sum: '$ratingsQuantity'},
          avgRating: {$avg :'$ratingsAverage'},
          avgPrice : { $avg :'$price'},
          minPrice: {$min : '$price'},
          maxPrice : { $max :'$price'}
        }
      },
      {
        $sort : { avgPrice:1}
      },
      {
        $match : {_id: { $ne : "EASY"}}
      }
    ])
    res.status(200).json({
      status: "success",
      body:{stats}
    });
  
 })

 exports.getPlans = catchAsync(async (req,res,next)=>{
    const year= req.params.year *1
    const plan = await Tour.aggregate([
      {
        $unwind:'$startDates'
      },
      {
        $match: {
          startDates: {
            $gte: new Date(`${year}-01-01`),
            $lte: new Date(`${year}-12-31`)
          }
        }
      },
      {
        $group:{
          _id:{ $month :`$startDates`},
          numTourStarts:{$sum: 1},
          tours:{ $push :"$name"}
        }
      },
      {
        $addFields :{month :"$_id"}
      },
      {
        $project:{
          _id: 0 
        }
      },
      {
        $sort : {numTourStarts:-1}
      },
      {
        $limit: 2
      }
    ])
    res.status(200).json({
      status: "success",
      body:{plan}
    });
  
 })