// Getting express 
const express = require("express");
// Firing up router
const routers = express.Router();
// Routes to the student
routers.use("/student", require("./students"));
// Routes to the interview
routers.use("/interview", require("./interview"));
// Routes to the user
routers.use("/", require("./users"));
// Exporting router
module.exports = routers;
