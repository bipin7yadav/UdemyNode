const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const APIFeatures = require("./../utils/apiFeatures")

exports.deleteOne = Model =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);

    if (!doc) {
      return next(new AppError('No document found with that ID', 404));
    }

    res.status(204).json({
      status: 'success',
      data: null
    });
  });


  exports.updateOne = Model =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!doc) {
      return next(new AppError('No document found with that ID', 404));
    }

    res.status(200).json({
      status: 'success',
      data: {
        data: doc
      }
    });
  });

exports.createOne = Model =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.create(req.body);

    res.status(201).json({
      status: 'success',
      data: {
        data: doc
      }
    });
  });

  exports.getOne = (Model, popOptions) =>
  catchAsync(async (req, res, next) => {
    let query = Model.findById(req.params.id);
    if (popOptions) query = query.populate(popOptions);
    const doc = await query;

    if (!doc) {
      return next(new AppError('No document found with that ID', 404));
    }

    res.status(200).json({
      status: 'success',
      data: {
        data: doc
      }
    });
  })
  

  exports.getAll= Model =>
  catchAsync(async (req, res) => {

    // To allow for nested get reviews on tour
    let filter ={}
  
    if(req.params.tourId) filter={ tours : req.params.tourId}

    // try {
  
      const features = new APIFeatures(Model.find(filter),req.query)
        .filter()
        .sort()
        .fieldLimiting()
        .pagination();
  
      // const tours = await features.query.explain()
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
      
    // } catch (error) {
    //   res.status(400).json({
    //     status:"fail",
    //     message:error
    //   })
    // }
  });
