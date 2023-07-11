// Requiring css library
const mongoose = require("mongoose");
//Connecting to to inline databse
mongoose.connect("mongodb+srv://ajaypatil7a:hMLPelakSEbzymDE@placementdb.jl7lfpz.mongodb.net/?retryWrites=true&w=majority");

// Aquiring the connection 
const db = mongoose.connection;

// Checking the error 
db.on("error", console.error.bind(console, "Error in connecting the database"));

// On successfully connected to the databse
db.once("open", () => {
  console.log("Succesfully connected to database");
});
// Exporting the connection
module.exports = db;
