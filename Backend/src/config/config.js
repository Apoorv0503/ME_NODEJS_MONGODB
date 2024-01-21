const dotenv = require("dotenv");
const path = require("path");

dotenv.config({ path: path.join(__dirname, "../../.env") });

module.exports = {
  port: 8082,
  mongoose: {
    url: "mongodb://127.0.0.1:27017/todoapp",
    options: {
      useCreateIndex: true,
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
    },
  },
};

//hardcoded the .env variables here, becuase those were comming undefined in app.js. We need to check in future
//-----------------------------------actual code--------------------------------
// module.exports = {
//   port: process.env.PORT,
//   mongoose: {
//     url: process.env.MONGODB_URL,
//     options: {
//       useCreateIndex: true,
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//       useFindAndModify: false,
//     },
//   },
// };

//also deatils about .env and dotenv.config are here: https://docs.google.com/document/d/11m2kFlUa4sCQQ9MvK3NM7LmUMDAk7oqPw3-UBSHK3-U/edit