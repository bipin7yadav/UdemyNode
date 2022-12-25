/* eslint-disable no-console */
// const fs = require("fs");
const Tour = require("./../models/tourModel");

const APIFeatures = require("./../utils/apiFeatures")

const catchAsync = require("./../utils/catchAsync")
// Route Handlers


exports.aliasTopTours = (req,res,next)=>{
  req.query.limit="5";
  req.query.sort="-ratingsAverage,price";
  req.query.fields = "name,price,ratingsAverage,summary,difficulty";
  next();
}


exports.getAllTours = async (req, res) => {

  try {

    // Build Query

    /// 1A) Filtering

    // const queryObj = {...req.query}
    // const excludeFields = ['page', "sort", "limit", "fields"]
    // excludeFields.forEach(element => {
    //   delete queryObj[element]
    // });


    // ////1B) Advanced Filtering

    // let queryStr = JSON.stringify(queryObj)
    // queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`)

    // console.log(queryStr)
    
    // // const query = Tour.find()
    // //   .where('duration')
    // //   .equals(5)
    // //   .where('difficulty')
    // //   .equals('easy')
    // let query = Tour.find(JSON.parse(queryStr))
    
    //// 2) Sorting 

    // if(req.query.sort){
    //   const sortBy = req.query.sort.split(',').join(' ')
    //   console.log(sortBy)
    //   query = query.sort(sortBy)
    // }else{
    //   query = query.sort('--createdAt')
    // }

    /////// 3) Field Limiting
    // if(req.query.fields){
    //   const fields = req.query.fields.split(',').join(' ')
    //   query = query.select(fields)
    // }else{
    //   query = query.select('-__v')
    // }


    /// Pagination
    // const page = req.query.page * 1 || 1;
    // const limit = req.query.limit * 1 || 100
    // const skip =(page-1) * limit 

    // query = query.skip(skip).limit(limit);

    // if(req.query.page){
    //   const numTours = await Tour.countDocuments()
    //   if(skip >= numTours) throw new Error('Thi page does not exist')
    // }


    // Execute Query
    // const tours = await Tour.find()
    
    // const query = Tour.find(queryObj)
    const features = new APIFeatures(Tour.find(),req.query)
      .filter()
      .sort()
      .fieldLimiting()
      .pagination();


    const tours = await features.query
    // const tours = await query
    res.status(200).json({
      status: "success",
      requestedAt: req.requestTime,
      result: tours.length,
      data: {
        tours: tours
      }
    });
    
  } catch (error) {
    res.status(400).json({
      status:"fail",
      message:error
    })
  }
};
exports.createTour = catchAsync(async (req, res, next) => {

  // const newTour = new Tour({})
  // newTour.save()

    const newTour = await Tour.create(req.body)

  res.status(201).json({
    status: "success",
    data: {
      tour: newTour
    }
  });

}) 
exports.getTour = catchAsync(async (req, res, next) => {
  
    const tour = await Tour.findById(req.params.id)
    // Tour.findOne({_id:req.params.id})
    
    res.status(200).json({
      status: "success",
      data: {
        tour: tour
      }
    });
  
});

exports.updateTour = catchAsync(async (req, res, next) => {
  
    const tour = await Tour.findByIdAndUpdate(req.params.id,req.body,{
      new: true,
      runValidators: true
    })
    res.status(200).json({
      status: "success",
      data: {
        tour
      }
    });
  

});

exports.deleteTour = catchAsync(async (req, res, next) => {

    const tour =  await Tour.findByIdAndDelete(req.params.id)
    res.status(204).json({
      status: "success",
      data: tour
    });

});


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