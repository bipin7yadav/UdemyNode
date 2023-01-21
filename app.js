const express = require("express");
const morgan = require("morgan");
const rateLimit = require('express-rate-limit')
const helmet = require("helmet")
const mongoSanitize = require("express-mongo-sanitize")
const xss = require("xss-clean")

const AppError = require('./utils/appError')
const globalErrorHandler = require('./controllers/errorCntroller')
const tourRouter = require("./routes/tourRoute");

const userRouter = require("./routes/userRoute");

const app = express();

//1) Global Middlewares

//set HTTP security headers
app.use(helmet())


// app.use(morgan('dev'))


//Development Logging 
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// limit requests from same api
const limiter = rateLimit({
  max:100,
  windowMs:60*60*1000,
  message:"Too many request from this ip . Try again after in an hour"
})

app.use('/api',limiter)

//Body parser reading date from body into req.body
app.use(express.json({limit: '10kb'}));

//Data sanitization against Nosql query injection
app.use(mongoSanitize())

// Data Sanitization against XSS
app.use(xss())

//Serving static files
app.use(express.static(`${__dirname}/public`));

// app.use((req, res, next) => {
//   // eslint-disable-next-line no-console
//   console.log(" Hello from server ");
//   next();
// });

//Test Middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// app.get('/',(req,res)=>{
//     res
//     .status(200)
//     .json({message:"Hello from the server side!",app:'natours'})
// })

// app.post("/",(req,res)=>{
//     res.
//     send('You can post here')
// })

// let tours= JSON.parse(fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`))

// // Route Handlers

// const getAllTours=(req,res)=>{
//     res.status(200).json({
//         status:"success",
//         result:tours.length,
//         requestedAt:req.requestTime,
//         data:{
//             tours:tours
//         }
//     })
// }
//  const createTour =(req,res)=>{
//     // console.log(req.body)
//     const newId=tours[tours.length-1].id+1
//     const newTour=Object.assign({id:newId},req.body)

//     tours.push(newTour)

//     fs.writeFile(`${__dirname}/dev-data/data/tours-simple.json`,JSON.stringify(tours),err=>{
//         res.status(201).json({
//             status:"success",
//             data:{
//                 tour:newTour
//             }
//         })
//     })
// }

// const getTour =(req,res)=>{
//     console.log(req.params);
//     const id=req.params.id*1
//     const tour=tours.find((a)=>a.id===id)

//     // if(id>tours.length){
//     //     return res.status(404).json({
//     //         status:"failed",
//     //         message:"Invalid Id"
//     //     })
//     // }

//     if(!tour){
//         return res.status(404).json({
//             status:"failed",
//             message:"Invalid Id"
//         })
//     }
//     res.status(200).json({
//         status:"success",
//         data:{
//             tour:tour
//         }
//     })
// }

// let updateTour=(req,res)=>{

//     if(req.params.id*1>tours.length){
//         return res.status(404).json({
//             status:"failed",
//             message:"Invalid Id"
//         })
//     }

//     res.status(200).json({
//         status:"success",
//         data:{
//             tour:"<updated tour here .... />>"
//         }
//     })
// }

// const deleteTour=(req,res)=>{

//     if(req.params.id*1>tours.length){
//         return res.status(404).json({
//             status:"failed",
//             message:"Invalid Id"
//         })
//     }

//     res.status(204).json({
//         status:"success",
//         data:null
//     })
// }

// const getAllUsers =(req,res)=>{
//     res.status(500).json({
//         status:"error",
//         message:"This route is not yet implemented"
//     })
// }

// const getUser =(req,res)=>{
//     res.status(500).json({
//         status:"error",
//         message:"This route is not yet implemented"
//     })
// }

// const createUser=(req,res)=>{
//     res.status(500).json({
//         status:"error",
//         message:"This route is not yet implemented"
//     })
// }

// const updateUser =(req,res)=>{
//     res.status(500).json({
//         status:"error",
//         message:"This route is not yet implemented"
//     })
// }

// const deleteUser =(req,res)=>{
//     res.status(500).json({
//         status:"error",
//         message:"This route is not yet implemented"
//     })
// }
//             Routes

// app.get("/api/v1/tours",getAllTours)

// app.post('/api/v1/tours',createTour)

// app.get("/api/v1/tours/:id",getTour)

// app.patch('/api/v1/tours/:id',updateTour)

// app.delete('/api/v1/tours/:id',deleteTour)

// app.route('/api/v1/tours').get(getAllTours).post(createTour)

// app.route("/api/v1/tours/:id").get(getTour).patch(updateTour).delete(deleteTour)

// app.route('/api/v1/users').get(getAllUsers).post(createUser)

// app.route('/api/vi/users/:id').get(getUser).patch(updateUser).delete(deleteUser)

/// Mounting Routers
// const tourRouter=express.Router()

// const userRouter=express.Router()

// tourRouter.route('/').get(getAllTours).post(createTour)

// tourRouter.route("/:id").get(getTour).patch(updateTour).delete(deleteTour)

// userRouter.route('/').get(getAllUsers).post(createUser)

// userRouter.route('/:id').get(getUser).patch(updateUser).delete(deleteUser)

app.use("/api/v1/tours", tourRouter);
app.use("/api/v1/users", userRouter);


app.use('*',(req,res,next)=>{

  // const err = new Error(`Can't find ${req.originalUrl} on this server!`)
  // err.status = 'fail';
  // err.statusCode = 404

  // next(err);

  next(new AppError(`Can't find ${req.originalUrl} on this server!`,404))
})


app.use(globalErrorHandler)
// Start Server

// const port = 3000
// app.listen(port,()=>{
//     console.log(`App running on port ${port} ...`);
// })

module.exports = app;
