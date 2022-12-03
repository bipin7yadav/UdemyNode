/* eslint-disable no-console */
// const fs = require("fs");
const Tour = require("./../models/tourModel");

// Route Handlers

exports.getAllTours = async (req, res) => {

  try {

    // Build Query

    /// 1A) Filtering

    const queryObj = {...req.query}
    const excludeFields = ['page', "sort", "limit", "fields"]
    excludeFields.forEach(element => {
      delete queryObj[element]
    });


    ////1B) Advanced Filtering

    let queryStr = JSON.stringify(queryObj)
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`)

    console.log(queryStr)
    
    // const query = Tour.find()
    //   .where('duration')
    //   .equals(5)
    //   .where('difficulty')
    //   .equals('easy')
    let query = Tour.find(JSON.parse(queryStr))
    
    //// 2) Sorting 

    if(req.query.sort){
      const sortBy = req.query.sort.split(',').join(' ')
      console.log(sortBy)
      query = query.sort(sortBy)
    }else{
      query = query.sort('--createdAt')
    }

    /////// 3) Field Limiting
    if(req.query.fields){
      const fields = req.query.fields.split(',').join(' ')
      query = query.select(fields)
    }else{
      query = query.select('-__v')
    }
    // Execute Query
    // const tours = await Tour.find()
    
    // const query = Tour.find(queryObj)
    const tours = await query
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
exports.createTour = async (req, res) => {

  // const newTour = new Tour({})
  // newTour.save()
  try {
    const newTour = await Tour.create(req.body)

  res.status(201).json({
    status: "success",
    data: {
      tour: newTour
    }
  });
}catch (err){
  res.status(400).json({
    status:"fail",
    message:"Invalid data sent"
    // message:err
  })
}
} 
exports.getTour = async (req, res) => {
  
  try {
    const tour = await Tour.findById(req.params.id)
    // Tour.findOne({_id:req.params.id})
    
    res.status(200).json({
      status: "success",
      data: {
        tour: tour
      }
    });
  } catch (error) {
    res.status(400).json({
      status:"fail",
      message:"Invalid data sent"
    })
  }
};

exports.updateTour = async (req, res) => {
  
  try {
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
  } catch (error) {
    res.status(400).json({
      status:"fail",
      message:error
    })
  }

};

exports.deleteTour = async (req, res) => {
  
  try {
    const tour =  await Tour.findByIdAndDelete(req.params.id)
    res.status(204).json({
      status: "success",
      data: tour
    });
  } catch (error) {
    res.status(404).json({
      status:"fail",
      message:error
    })
  }

};
