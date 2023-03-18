const path = require("path")
const express = require("express");
const morgan = require("morgan");
const rateLimit = require('express-rate-limit')
const helmet = require("helmet")
const mongoSanitize = require("express-mongo-sanitize")
const xss = require("xss-clean")
const hpp = require("hpp")
const AppError = require('./utils/appError')
const globalErrorHandler = require('./controllers/errorCntroller')
const cookieParser = require('cookie-parser');
const compression = require('compression')
const cors = require('cors');

const tourRouter = require("./routes/tourRoute");
const userRouter = require("./routes/userRoute");
const reviewRouter = require("./routes/reviewRoute")
const viewRouter = require('./routes/viewRoutes');
const bookingRouter = require('./routes/bookingRoutes');
const bookingController = require('./controllers/bookingController');
const app = express();

//1) Global Middlewares
app.enable("trust proxy")

app.set("view engine","pug")
app.set("views",path.join(__dirname,"views"))


// Implement CORS
app.use(cors());
// Access-Control-Allow-Origin *
// api.natours.com, front-end natours.com
// app.use(cors({
//   origin: 'https://www.natours.com'
// }))

app.options('*', cors());
// app.options('/api/v1/tours/:id', cors());

//Serving static files
// app.use(express.static(`${__dirname}/public`));
app.use(express.static(path.join(__dirname,"public")));

//set HTTP security headers
app.use(helmet())
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      baseUri: ["'self'"],
      fontSrc: ["'self'", 'https:', 'data:'],
      scriptSrc: ["'self'", 'https://*.cloudflare.com'],
      objectSrc: ["'none'"],
      styleSrc: ["'self'", 'https:', 'unsafe-inline'],
      upgradeInsecureRequests: [],
      connectSrc:["'self'"]
    },
  })
);

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
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());

//Data sanitization against Nosql query injection
app.use(mongoSanitize())

// Data Sanitization against XSS
app.use(xss())

//Prevent Parameter Pollution
app.use(
  hpp({
    whitelist:[
      "duration"
    ,"ratingsQuantity",
    "ratingsAverage",
    "maxGroupSize",
    "difficulty",
    "price"]
  })
  )



  app.use(compression())
//Test Middleware

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  // console.log(req.cookies);
  next();
});
app.use('/', viewRouter);
app.use("/api/v1/tours", tourRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/reviews",reviewRouter)
app.use('/api/v1/bookings', bookingRouter);


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
