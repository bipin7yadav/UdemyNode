/* eslint-disable no-console */
// const app=require("./app")
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const app = require("./app");

dotenv.config({ path: "./config.env" });
const DB = process.env.DATABASE.replace("<PASSWORD>", process.env.DBPASSWORD);

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
app.listen(port, () => {
  console.log(`App running on port ${port} ...`);
});
