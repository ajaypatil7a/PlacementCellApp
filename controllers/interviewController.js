// Getting models 
const Interview = require("../models/interview");
const Student = require("../models/student");

// Renders add interview page
module.exports.addInterview = (req, res) => {
    if (req.isAuthenticated()) {
        return res.render("add_interview", {
            title: "Add Interview",
        });
    }
    return res.redirect("/");
};

// Creating new interview
module.exports.create = async (req, res) => {
    try {
        // Company and date from the interview and creating interview
        const { company, date } = req.body;
        await Interview.create({
            company,
            date,
        }, (err, Interview) => {
            if (err) {
                return res.redirect("back");
            }
            return res.redirect("back");
        }
        );
    } catch (err) {
        console.log(err);
    }
};

// Adding student into the interview
module.exports.enrollInInterview = async (req, res) => {
    try {
        // Getting email and status to add to an interview
        let interview = await Interview.findById(req.params.id);
        const { email, result } = req.body;

        if (interview) {
            let student = await Student.findOne({ email: email });
            console.log(student)
            if (student) {
                // Checking if student is already enrolled
                let alreadyEnrolled = await Interview.findOne({
                    "students.student": student.id,
                });
                // Preventing student from already enrolled company
                if (alreadyEnrolled) {
                    if (alreadyEnrolled.company === interview.company) {
                        req.flash(
                            "error",
                            `${student.name} already enrolled in ${interview.company} interview!`
                        );
                        return res.redirect("back");
                    }
                }
                // Making student object
                let studentObj = {
                    student: student.id,
                    result: result,
                };
                // Adding student to the interview
                await interview.updateOne({
                    $push: { students: studentObj },
                });
                // Making interview object
                let assignedInterview = {
                    company: interview.company,
                    date: interview.date,
                    result: result,
                };
                // Adding interview to the student
                await student.updateOne({
                    $push: { interviews: assignedInterview },
                });
                return res.redirect("back");
            }
            return res.redirect("back");
        }
        return res.redirect("back");
    } catch (err) {
        console.log("error", "Error in enrolling interview!");
    }
};

// Deleting students interview 
module.exports.deallocate = async (req, res) => {
    try {
        // Getting student id and interview id from params
        const { studentId, interviewId } = req.params;
        // Finding interview by id
        const interview = await Interview.findById(interviewId);
        if (interview) {
            // Removing student from interview schema
            await Interview.findOneAndUpdate(
                { _id: interviewId },
                { $pull: { students: { student: studentId } } }
            );

            // Now removing interview from student schema
            await Student.findOneAndUpdate(
                { _id: studentId },
                { $pull: { interviews: { company: interview.company } } }
            );
            return res.redirect("back");
        }
        return res.redirect("back");
    } catch (err) {
        console.log("error", "Couldn't deallocate from interview");
    }
};
