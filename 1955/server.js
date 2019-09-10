// ========================== 
// Require the Express Module
// ========================== 
var express = require('express');
var app = express();
// ========================== 
// Require the Session Module
// ========================== 
var session = require('express-session');
app.use(session({
  secret: 'keyboardkitteh',
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 60000 }
}))
// ========================== 
// Require body-parser (to receive post data from clients)copy
// ========================== 
var bodyParser = require('body-parser');
app.use(bodyParser.json());
// ========================== 
// Require mongoose
// ========================== 
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/basic_mongoose');
// ==========================
// Require Flash
// ==========================
var flash = require('express-flash');
app.use(flash());
// ========================== 
// Require path
// ========================== 
var path = require('path');
app.use(express.static(path.join(__dirname, './static')));
app.set('views', path.join(__dirname, './views'));
app.set('view engine', 'ejs');
// ========================== 
// Setting our Server to Listen on Port: 8000
// ========================== 
app.listen(8000, function() {
  console.log("listening on port 8000")
});
// ========================== 
// Schemas
// ========================== 
var PersonSchema = new mongoose.Schema({
  name: {type: String, required: true}
}, {timestamps:true});
mongoose.model('Person', PersonSchema);
var People = mongoose.model('Person');
// ========================== 
// Routes
// ========================== 

app.get('/', (req, res) => {
  People.find({}, (err, people) => {
    if(err) {
      console.log("Error!", err);
      res.json({message: "Error"}, { errors : err });
    } else {
      res.json({message: "Success", data : people})
    }
  })
  console.log('Looking for People, please hold');
})

app.get('/:name', (req, res) => {
  var name = req.params.name
  People.find({name: name}, (err, person) => {
    if(err) {
      console.log("Error!", err);
      res.json({message: "Error"}, { errors : err });
    } else {
      res.json({message: "Success", data : person})
    }
  })
  console.log('Looking for Person, please hold');
})

app.get('/new/:name', (req, res) => {
  console.log(req.params.name)
  var newPerson = new People({
    'name': req.params.name
    }, {timestamps : req.params.createdAt});
  newPerson.save(function(err) {
    if(err) {
      console.log("Error!", err);
      res.json({message:"Error"}, {errors : err})
    } else {
      res.json({message: "Success", data : newPerson})
    }
    console.log("Adding person, please hold")
  })
});

app.get('/remove/:name', (req, res) => {
  console.log(req.params.name)
  People.remove({name: req.params.name}, (err, person) => {
    if(err) {
      console.log("Issue destroying this name");
      res.json({message:"Error"}, {errors : err})
    } else {
      res.json({message: "Success", data : person})
    }
  });
});