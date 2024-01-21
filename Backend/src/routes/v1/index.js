const express = require("express");
const todoRoute = require("./todo.route");
const captureDateMiddleware = require("../../middleware/middleware");
const router = express.Router();
const testRoute = require("./test.route");

router.use("/todos",todoRoute);

// router.use(captureDateMiddleware);
router.use("/test", testRoute);

module.exports = router;