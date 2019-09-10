// ========================== 
// Require the Express Module
// ========================== 
var express = require('express');
// Create an Express App
var app = express();
// ========================== 
// Require body-parser (to receive post data from clients)copy
// ========================== 
var bodyParser = require('body-parser');
// Integrate body-parser with our App
app.use(bodyParser.urlencoded({ extended: true }));
// ========================== 
// Require mongoose
// ========================== 
var mongoose = require('mongoose');
// This is how we connect to the mongodb database using mongoose -- "basic_mongoose" is the name of
// our db in mongodb -- this should match the name of the db you are going to use for your project.
mongoose.connect('mongodb://localhost/basic_mongoose');
// ========================== 
// Require path
// ========================== 
var path = require('path');
// Setting our Static Folder Directory
app.use(express.static(path.join(__dirname, './static')));
// Setting our Views Folder Directory
app.set('views', path.join(__dirname, './views'));
// Setting our View Engine set to EJS
app.set('view engine', 'ejs');
// ========================== 
// Setting our Server to Listen on Port: 8000
// ========================== 
app.listen(8000, function() {
  console.log("listening on port 8000");
// ========================== 
// Routes
// ========================== 
// Root Request
app.get('/', function(req, res) {
    // This is where we will retrieve the users from the database and include them in the view page we will be rendering.
    res.render('index');
})
// Add User Request 
// This is the route that we already have in our server.js
// When the user presses the submit button on index.ejs it should send a post request to '/users'.  In
// this route we should add the user to the database and then redirect to the root route (index view).
app.post('/users', function(req, res) {
    console.log("POST DATA", req.body);
    // This is where we would add the user from req.body to the database.
    res.redirect('/');
})



app.get("/mittens", function(request, response){
  sleeping = [
    "Under the bed",
    "In the sun",
    "Next to the fire"
  ]
  response.render('mittens');
})