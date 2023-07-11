// Requiring the modules
const passport = require("passport");
const User = require("../models/user");
const LocalStratergy = require("passport-local").Strategy;

// Setting middleware for authenticatin
passport.use(
  new LocalStratergy(
    {
      usernameField: "email",
      passReqToCallback: true,
    },
    function (req, email, password, done) {
      // Finfing the user
      User.findOne({ email: email }, async function (err, user) {
        if (err) {
          console.log("error in finding the user", err);
          return done(err);
        }
        if (!user) {
          console.log("Invalid UserName or Password");
          return done(null, false);
        }
        // Check the password
        const isPassword = await user.isValidatePassword(password);
        if (!isPassword) {
          console.log("Invalid Username or Password");
          return done(null, false);
        }
        return done(null, user);
      });
    }
  )
);

// Serilizing the user 
passport.serializeUser(function (user, done) {
  return done(null, user.id);
});

// Deserializing the user form the key in the cookies
passport.deserializeUser(function (id, done) {
  User.findById(id, function (err, user) {
    if (err) {
      console.log("Error in finding user ---> Passport");
      return done(err);
    }

    return done(null, user);
  });
});

// Checking is user authenticated
passport.checkAuthentication = function (req, res, next) {
  // if the user is signed in, then pass on the request to the next function
  if (req.isAuthenticated()) {
    return next();
  }

  // If not return back
  return res.redirect("/");
};

passport.setAuthenticatedUser = function (req, res, next) {
  // Check authentiacted user
  if (req.isAuthenticated()) {
    res.locals.user = req.user;
  }
  next();
};

module.exports = passport;
