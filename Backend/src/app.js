const express = require("express");
const routes = require("./routes/v1");
const mongoose = require("mongoose");
const captureDateMiddleware = require("./middleware/middleware");
const cors = require("cors");
require('dotenv').config();
const config = require("./config/config");

const app = express();

app.use(cors());

// This below middleware reads the request body data from the input stream and parses it as JSON for us. This is how we were able to access fields in the request body using `req.body.<field-name>`. 
// Without the middleware, we’ll have to listen explicitly for the “data” event and read in the data as chunks.
app.use(express.json());

// NOTE - Uncomment in Milestone 5
// Middleware to log API request metadata on any route
// app.use(captureDateMiddleware);

// routing
app.use("/v1", routes);

// TODO - Create a MongoDB connection using Mongoose

// here config.mongoose.url = mongodb://127.0.0.1:27017/todoapp and 
// mongoose.connect(config.mongoose.url) will be returning a promise that is why we used then()

console.log("mongoDB",config.mongoose.url);
console.log()
mongoose
  .connect(`${config.mongoose.url}`)
  .then(() => console.log("Connected to DB at", config.mongoose.url))
  .catch((e) => console.log("Failed to connect to DB", e));



// Start the express server
app.listen(config.port, () => {
  console.log(`App is running on port ${config.port}`);
});
