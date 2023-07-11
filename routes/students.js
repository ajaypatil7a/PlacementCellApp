const express = require("express");
// Getting student controller
const studentController = require("../controllers/studentController");
const router = express.Router();

// Creating the new student
router.post("/create", studentController.create);
// Deleting the new student
router.get("/destroy/:studentId", studentController.destroy);
// Updating the student
router.post("/update/:id", studentController.update);
// Getting add student page
router.get("/add-student", studentController.addStudent);
// Rendering the edit details of the student
router.get("/edit-student/:id", studentController.editStudent);

module.exports = router;
