/* eslint-disable no-console */
// const fs = require("fs");
const Tour = require("./../models/tourModel");

// const tours = JSON.parse(
//   fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
// );

// exports.checkID = (req, res, next, val) => {
//   console.log(`Tour id is : ${val}`);

//   if (req.params.id * 1 > tours.length) {
//     return res.status(404).json({
//       status: "failed",
//       message: "Invalid Id"
//     });
//   }
//   next();
// };

// exports.checkBody = (req, res, next) => {
//   if (!req.body.name || !req.body.price) {
//     return res.status(400).json({
//       status: "fail",
//       message: "Missing name or price "
//     });
//   }
//   next();
// };

//Not required was just for checking

// Route Handlers

exports.getAllTours = (req, res) => {
  res.status(200).json({
    status: "success",
    requestedAt: req.requestTime,
    // result: tours.length,
    // data: {
    //   tours: tours
    // }
  });
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
exports.getTour = (req, res) => {
  console.log(req.params);
  const id = req.params.id * 1;
  // const tour = tours.find(a => a.id === id);
  // if (!tour) {
  //   return res.status(404).json({
  //     status: "failed",
  //     message: "Invalid Id"
  //   });
  // }
  // res.status(200).json({
  //   status: "success",
  //   data: {
  //     tour: tour
  //   }
  // });
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
