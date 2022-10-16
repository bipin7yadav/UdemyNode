/* eslint-disable no-console */
const fs = require('fs');

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
);

exports.checkID = (req, res, next, val) => {
  console.log(`Tour id is : ${val}`);

  if (req.params.id * 1 > tours.length) {
    return res.status(404).json({
      status: 'failed',
      message: 'Invalid Id'
    });
  }
  next();
};

exports.checkBody = (req, res, next) => {
  if (!req.body.name || !req.body.price) {
    return res.status(400).json({
      status: 'fail',
      message: 'Missing name or price '
    });
  }
  next();
};

// Route Handlers

exports.getAllTours = (req, res) => {
  res.status(200).json({
    status: 'success',
    result: tours.length,
    requestedAt: req.requestTime,
    data: {
      tours: tours
    }
  });
};
exports.createTour = (req, res) => {
  // console.log(req.body)
  const newId = tours[tours.length - 1].id + 1;
  const newTour = Object.assign({ id: newId }, req.body);

  tours.push(newTour);

  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    () => {
      res.status(201).json({
        status: 'success',
        data: {
          tour: newTour
        }
      });
    }
  );
};

exports.getTour = (req, res) => {
  console.log(req.params);
  const id = req.params.id * 1;
  const tour = tours.find(a => a.id === id);

  // if(id>tours.length){
  //     return res.status(404).json({
  //         status:"failed",
  //         message:"Invalid Id"
  //     })
  // }

  if (!tour) {
    return res.status(404).json({
      status: 'failed',
      message: 'Invalid Id'
    });
  }
  res.status(200).json({
    status: 'success',
    data: {
      tour: tour
    }
  });
};

exports.updateTour = (req, res) => {
  // if(req.params.id*1>tours.length){
  //     return res.status(404).json({
  //         status:"failed",
  //         message:"Invalid Id"
  //     })
  // }

  res.status(200).json({
    status: 'success',
    data: {
      tour: '<updated tour here .... />>'
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
    status: 'success',
    data: null
  });
};
