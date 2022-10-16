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

console.log(app.get("env"));
const port = process.env.PORT || 3000;
// const port = 3000
app.listen(port, () => {
  console.log(`App running on port ${port} ...`);
});
