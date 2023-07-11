const express = require("express");
// Getting interview controller
const interviewController = require("../controllers/interviewController");
const router = express.Router();

// Rendering add interview page
router.get("/add-interview", interviewController.addInterview);
// Deleting student from the interview
router.get("/deallocate/:studentId/:interviewId", interviewController.deallocate);
// Creating new intwerview
router.post("/create", interviewController.create);
// Adding student to the interview
router.post("/enroll-in-interview/:id", interviewController.enrollInInterview);

// Exporting router
module.exports = router;
