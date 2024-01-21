const express = require("express");
const router = express.Router();

// importing mongoose model
const Todos = require("../../models/todo.model");

/**
 * Get all TODOS:
 * curl http://localhost:8082/v1/todos
 *
 * Get todos with their "startDate" b/w startDateMin and startDateMax
 * curl http://localhost:8082/v1/todos?startDateMin=2020-11-04&startDateMax=2020-12-30
 *
 */

// function to log req objects metadata
const logMetadata = (req) => {
  // console.log(
  //   `URL:  /v1/todos${req.url == "/" ? "" : req.url}, Method:  ${
  //     req.method
  //   }, Timestamp: ${new Date()}`
  // );
}



router.get("/", async (req, res) => {
  logMetadata(req);

  // console.log("req.query",req.query);  //req.query= { startDateMin: '2023-12-01', startDateMax: '2023-12-31' }

  if(req.query.startDateMax && req.query.startDateMin){
  //converted normal date string to date object in JS
  let startDateMax = new Date(req.query.startDateMax);  //startDateMax: 2023-12-31T00:00:00.000Z, This is a standard format for representing dates in JavaScript using the ISO 8601 date-time format.

  //now convert this "JS date formate" to "MongoDB supported formate", bcz we want to match our date with mongoDB stored date, check DB collections for that.
  startDateMax.setTime(startDateMax.getTime());   //output: ISODate("2021-01-19T00:00:00Z"), MongoDB uses the ISODate() constructor to represent dates in the BSON (Binary JSON) format.

  // but our goal is to use the startDateMax in a MongoDB query, you generally don't need to perform this operation. This operation doesn't change the value; it seems redundant.
  // MongoDB can handle JavaScript Date objects directly when querying. You can use the startDateMax in your queries without any additional conversion.

let startDateMin= new Date(req.query.startDateMin);
startDateMin.setTime(startDateMin.getTime());


    Todos.find(
      //find all those documents where the startDate passes below condition
      {
        startDate:{
        $lte:startDateMax,
        $gte:startDateMin,
      }
    },
      (err,allTodos)=>{
        if (err) {
          console.log(err);
        } else {
          console.log("allTodos",allTodos);
          res.send(allTodos);
        }
      }
    );
    
  }else{
    // The empty object {} as a parameter means that there are no specific conditions for the find operation, so it will retrieve all documents in the collection.
  const allTodos = await Todos.find({}, (err, allTodos) => {
    if (err) {
      console.log(err);

      res.status(500).send();
    } else {
      res.send(allTodos);
    }
  });

  }
    
});


/**
 * Add a TODO to the list
 * curl -X POST http://localhost:8082/v1/todos \
    -d '{"name": "Learn Nodejs by doing","startDate": "2021-01-07","endDate": "2021-01-09"}' \
    -H 'Content-Type: application/json'
*/

//an async function passed as 2nd argument
router.post("/", async (req, res) => {
logMetadata(req);
console.log("req.body", req.body);


  // When the property name is a simple identifier (like name or startDate in your example), you can omit the quotes. It's just a shorthand notation and is commonly used in JavaScript for brevity and readability.
  let obj = {
    name: req.body.name,
    startDate: req.body.startDate,
    endDate: req.body.endDate,
  }

  // using model.create to insert a new document
  // const newObj= await Todos.create(obj);  //without error handling

  Todos.create(obj, (err, newlyCreated) => {
    if (err) {
      console.log(err);
      res.status(500).send();
    } else {
      console.log("New todo item: ", newlyCreated);
      res.status(201).send(newlyCreated);
    }
  });

});

/**
 * Update an existing TODO
 * curl -v -X PUT http://localhost:8082/v1/todos \
    -d '{"_id": "<id-value>", "name": "Play tennis","startDate": "2021-01-07","endDate": "2021-01-09"}' \
    -H 'Content-Type: application/json'
 * 
 * Nb: You'll need to change the "id" value to that of one of your todo items
*/
router.put("/", (req, res) => {
logMetadata(req);


  console.log("req.body", req.body);

  let idToUpdate= req.body._id;
  let updatedTodo = {
    name: req.body.name,
    startDate: req.body.startDate,
    endDate: req.body.endDate,
    pending: req.body.pending
  }

  // findByIdAndUpdate function is a method provided by Mongoose. It is used to find a document by its unique identifier (_id) and update it with the specified data.
  // This function finds a document with the specified _id (idToUpdate) and updates it with the values provided in the updatedTodo object. 
  // The callback function receives an error (err) and the updated document (doc).
  Todos.findByIdAndUpdate(idToUpdate, updatedTodo, (err, doc) => {
    if (err) {
      console.log(err);
      res.status(500).send();
    } else if (doc == null) {
      res.status(400).send({ error: "Resource not found" });
    } else {
      res.status(204).send();
    }
  });

});

/**
 * Delete a TODO from the list
 * curl -v -X "DELETE" http://localhost:8082/v1/todos/<id-value>
 *
 * Nb: You'll need to change "<id-value>" to the "id" value of one of your todo items
 */

router.delete("/:id", (req, res) => {
//need to pass the "_id" in the req parameters from postman
  const IdToDelete = req.params.id;
  logMetadata(req);

  Todos.findByIdAndDelete(IdToDelete, (err, result) => {
    if (err) {
      console.log(err);
      res.status(500).send();
    } else {
      res
        .status(204)
        .send();
    }
  });
});


module.exports = router;




