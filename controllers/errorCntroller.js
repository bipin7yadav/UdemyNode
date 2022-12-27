const AppError = require("./../utils/appError")

const handleCastErrorDB = err => {
  const message = `Invalid ${err.path}: ${err.value}.`
  console.log("meassage :",message)
  return new AppError(message , 400)
}
const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack
  })
}

const sendErrorProd = (err, res) => {

  //Operatonal, trusted error: send message to client
  if(err.isOperational){
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message
    })

    //Programming or other unknown error : dont`t leak error details 
  }else{
    // 1) Log error
    console.error('Error ***',err)

    // 2)Send generate message
    res.status(500).json({
      status:"error",
      message :"Something went very wrong"
    })
  }
}

module.exports = (err, req, res, next)=>{
    console.log(err.stack);
    err.statusCode = err.statusCode || 500
    err.status = err.status || 'error';
  
    if (process.env.NODE_ENV === "development"){
      sendErrorDev(err ,res)
    }else if (process.env.NODE_ENV === "production"){
      let error = {...err};
      
      if (err.name ==="CastError") {
        console.log(" ---------------------------------------- /n")
        error = handleCastErrorDB(error)
      }

      sendErrorProd(error, res)
      // sendErrorProd(err, res)
    }
  }