const express = require("express");
const passport = require("passport");
// Getting dashboard controller
const  dashBoardController  = require("../controllers/dashBoardController");
const reportController = require("../controllers/reportController");
// Getting user controller
const userController =require("../controllers/userController");
const router = express.Router();
// Router for checking the profile
router.get("/profile", passport.checkAuthentication, userController.profile);
//  Updating the user profile
router.post("/update", passport.checkAuthentication, userController.updateUser);
// Dashboard router
router.get("/dashboard", dashBoardController.dashboard);
// Sign in page router
router.get("/", userController.signIn);
// Sign up page router
router.get("/sign-up", userController.signUp);
// Route for creating new user
router.post("/create", userController.create);

// Middleware which will authenticate user
router.post(
  "/create-session",
  passport.authenticate("local", { failureRedirect: "/" }),
  userController.createSession
);
// Log out button router
router.get("/sign-out", userController.destroySession);
// CSV router
router.get("/download", reportController.downloadCSVReport);

module.exports = router;
