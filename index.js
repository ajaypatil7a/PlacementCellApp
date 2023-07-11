// Getting required modules
const express = require("express");
const port = 8000;
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const app = express();
const expressLayouts = require('express-ejs-layouts');
const db = require("./config/mongoose");
// Decodes url
app.use(
    bodyParser.urlencoded({
        extended: false,
    })
);
// Modules for suthentication
const session = require("express-session");
const passport = require("passport");
const passportLocal = require("./config/passport");
const MongoStore = require("connect-mongo");

// Middleware setups
app.use(cookieParser());
app.use(expressLayouts);
// Static file access
app.use(express.static('./assets'));
// Extract script and styles from static files
app.set('layout extractStyles', true);
app.set('layout extractScripts', true);

// Setting up ejs view engine
app.set("view engine", "ejs");
app.set("views", "./views");

// Mongo store stores session coockie in the database
app.use(
    session({
        name: "placement-cell",
        secret: "asewe",
        saveUninitialized: false,
        resave: false,
        cookie: {
            maxAge: 1000 * 60 * 100,
        },
        store: MongoStore.create({
            mongoUrl:
                "mongodb+srv://ajaypatil7a:hMLPelakSEbzymDE@placementdb.jl7lfpz.mongodb.net/?retryWrites=true&w=majority",
            autoRemove: "disabled",
        }),
        function(err) {
            console.log(err || "Connect-mongodb setup ok");
        },
    })
);

app.use(passport.initialize());
app.use(passport.session());

// Sets the authenticated user
app.use(passport.setAuthenticatedUser);

// Adding router files
app.use(require("./routes"));

// Using bodyparser
app.use(bodyParser.json());

// Fring up app and listening on port 8000
app.listen(port, (err) => {
    if (err) {
        console.log("Error in starting the server", err);
        return;
    }
    console.log("Server is succesfully running on port 8000");
});
