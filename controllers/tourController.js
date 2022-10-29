/* eslint-disable no-console */
// const fs = require("fs");
const Tour = require("./../models/tourModel");

// Route Handlers

exports.getAllTours = async (req, res) => {

  try {
    const tours = await Tour.find()
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

exports.updateTour = (req, res) => {
  // if(req.params.id*1>tours.length){
  //     return res.status(404).json({
  //         status:"failed",
  //         message:"Invalid Id"
  //     })
  // }

  res.status(200).json({
    status: "success",
    data: {
      tour: "<updated tour here .... />>"
    }
  });
};

exports.deleteTour = (req, res) => {
  // if(req.params.id*1>tours.length){
  //     return res.status(404).json({
  //         status:"failed",
  //         message:"Invalid Id"
  //     })
  // }

  res.status(204).json({
    status: "success",
    data: null
  });
};
