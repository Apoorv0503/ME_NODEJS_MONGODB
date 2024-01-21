const mongoose = require("mongoose");

// TODO -TODO list schema
const todoSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    pending: {
      type: Boolean,
      default: true,
    },

  },
);

//created a model out of our schema

// method 1,  you will need to access the model using Todos.Todo wherever you want to use the model
// const Todos= mongoose.model("Todo",todoSchema)
// module.exports = {Todos};

//method 2
module.exports = mongoose.model("Todo", todoSchema);

