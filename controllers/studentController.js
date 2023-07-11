// Getting require module
const Interview = require("../models/interview");
const Student = require("../models/student");

// Rendering add student
module.exports.addStudent = (req, res) => {
    // Firstly check the authenticated user
    if (req.isAuthenticated()) {
        return res.render("add_student", {
            title: "Add Student",
        });
    }
    return res.redirect("/");
};

// Render edit student
module.exports.editStudent = async (req, res) => {
    // Getting student by id
    const student = await Student.findById(req.params.id);
    if (req.isAuthenticated()) {
        return res.render("edit_student", {
            title: "Edit Student",
            student_details: student,
        });
    }
    return res.redirect("/");
};

// Creating new student
module.exports.create = async (req, res) => {
    try {
        // Getting data from the body
        const { name, email, batch, college, placementStatus, dsa_score, react_score, webdev_score } = req.body;

        // Checking if student is already exist 
        Student.findOne({ email }, async (err, student) => {
            if (err) {
                console.log("error in finding student");
                return;
            }
            // if don't get student create student
            if (!student) {
                await Student.create(
                    { name, email, college, batch, dsa_score, react_score, webdev_score, placementStatus },
                    (err, student) => {
                        if (err) {
                            return res.redirect("back");
                        }
                        return res.redirect("back");
                    }
                );
            } else {
                return res.redirect("back");
            }
        });
    } catch (err) {
        console.log(err);
    }
};

// Deleting student from DB
module.exports.destroy = async (req, res) => {
    try {
        // Getting student id from param
        const { studentId } = req.params;
        // Getting student from DB
        const student = await Student.findById(studentId);
        if (!student) {
            return;
        }
        // Getting interview of student
        const interviewsOfStudent = student.interviews;
        // Deleting interview from database
        if (interviewsOfStudent.length > 0) {
            for (let interview of interviewsOfStudent) {
                await Interview.findOneAndUpdate(
                    { company: interview.company },
                    { $pull: { students: { student: studentId } } }
                );
            }
        }
        student.remove();
        return res.redirect("back");
    } catch (err) {
        console.log("error", err);
        return;
    }
};

// Updating student
module.exports.update = async (req, res) => {
    try {
        // Getting student by id in param from database
        const student = await Student.findById(req.params.id);
        // Getting data from the body
        const { name, college, batch, dsa_score, react_score, webdev_score, placementStatus } = req.body;

        if (!student) {
            return res.redirect("back");
        }
        // Updating student db
        student.name = name;
        student.college = college;
        student.batch = batch;
        student.dsa_score = dsa_score;
        student.react_score = react_score;
        student.webdev_score = webdev_score;
        student.placementStatus = placementStatus;
        student.save();
        return res.redirect("/dashboard");
    } catch (err) {
        console.log(err);
        return res.redirect("back");
    }
};
