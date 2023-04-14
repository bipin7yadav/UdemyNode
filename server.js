/* eslint-disable no-console */
// const app=require("./app")
const mongoose = require("mongoose");
const dotenv = require("dotenv");

process.on('uncaughtException', err => {
  console.log('UNCAUGHT EXCEPTION! 💥 Shutting down...');
  console.log(err.name, err.message);
  process.exit(1);
});

dotenv.config({ path: "./config.env" });
const app = require("./app");
// console.log(x);
const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DBPASSWORD
);
mongoose.set("strictQuery", false);
mongoose.connect(DB).then(() => {
  console.log("DB Connection Successful !!");
});

///Locally

// mongoose.connect(process.env.DATABASE_LOCAL).then(con => {
//   console.log(con.connections);
//   console.log("DB Connection Successful !!");
// });

// const tourSchema = new mongoose.Schema({
//   name: {
//     type: String,
//     required: [true, "A Tour must have a name"],
//     unique: true
//   },
//   rating: {
//     type: Number,
//     default: 4.5
//   },
//   price: {
//     type: Number,
//     required: [true, "A tour must have a price"]
//   }
// });

// const Tour = mongoose.model("Tour", tourSchema);

/// For Testing

// const testTour = new Tour({
//   name: "The Part Campor  34",
//   rating: 4.7,
//   price: 307
// });

// testTour
//   .save()
//   .then(doc => {
//     console.log("doc: ", doc);
//   })
//   .catch(err => {
//     console.log("error123: ", err);
//   });

console.log(app.get("env"));
const port = process.env.PORT || 3000;
// const port = 3000
const server = app.listen(port, () => {
  console.log(`App running on port ${port} ...`);
});

process.on('unhandledRejection', err => {
  console.log('UNHANDLED REJECTION! 💥 Shutting down...');
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});

process.on('SIGTERM', () => {
  console.log('👋 SIGTERM RECEIVED. Shutting down gracefully');
  server.close(() => {
    console.log('💥 Process terminated!');
  });
});

