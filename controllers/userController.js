// Getting user route
const User = require("../models/user");
// Rendering profile of the user
module.exports.profile = function (req, res) {
    return res.render("user_profile", {
        title: "User Profile",
        profile_user: req.user,
    });
};

// Update detals of the user like username and password
module.exports.updateUser = async function (req, res) {
    try {
        // Getting user detals from the DB
        const user = await User.findById(req.user.id);
        const { username, password, confirm_password } = req.body;
        if (password != confirm_password) {
            return res.redirect("back");
        }
        if (!user) {
            return res.redirect("back");
        }
        user.username = username;
        user.password = password;
        user.save();
        return res.redirect("back");
    } catch (err) {
        console.log(err);
        return res.redirect("back");
    }
};

// Rendering the sign in page
module.exports.signIn = (req, res) => {
    if (req.isAuthenticated()) {
        return res.redirect("/profile");
    }
    return res.render("signin.ejs", {
        title: "SignIn"
    });
};

// Rendering the signup page
module.exports.signUp = (req, res) => {
    if (req.isAuthenticated()) {
        return res.redirect("/profile");
    }
    return res.render("signup.ejs", {
        title: "SignUp"
    });
};

// Creating the user
module.exports.create = async (req, res) => {
    try {
        // Getting details of the user from the req
        const { username, email, password, confirm_password } = req.body;

        // Redirecting back if password doesn't match
        if (password != confirm_password) {
            return res.redirect("back");
        }
        // Check if user is already exist in the database
        User.findOne({ email }, async (err, user) => {
            if (err) {
                console.log("Error in finding user in signing up");
                return;
            }
            if (!user) {
                // Does't user create a user
                await User.create({ email, password, username }, (err, user) => {
                        if (err) {
                            console.log("error", "Couldn't sign Up");
                        }
                        return res.redirect("/");
                    }
                );
            } else {
                console.log("error", "Email already registed!");
                return res.redirect("back");
            }
        });
    } catch (err) {
        console.log(err);
    }
};

// Sign in and create session for the user
module.exports.createSession = (req, res) => {
    return res.redirect("/dashboard");
};

// After click on signout destroy the coockies and signout user
module.exports.destroySession = (req, res) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        return res.redirect("/");
    });
};
