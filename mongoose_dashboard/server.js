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
app.use(bodyParser.urlencoded({ extended: true }));
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
var CrowSchema = new mongoose.Schema({
  name: {type: String, required: [true, "Please enter a name!"], minlength: [4, "Name must be at least 4 characters!"]},
  about: {type: String, required: [true, "Tell us a bout about this bird!"], minlength: [10, "Please include discription of at least 10 characters!"]}
}, {timestamps: true})
mongoose.model('Crow', CrowSchema);
var Crow = mongoose.model('Crow');
// ========================== 
// Routes
// ========================== 
app.get('/', (req, res) => {
  Crow.find({}, (err, crows) => {
    res.render('index', {'crows': crows});
    console.log(crows)
  });
  console.log("Fetching crows...");
});

app.post('/crows', (req, res) => {
  var newCrow = new Crow({
    'name': req.body.name, 
    'about': req.body.about
    }, { 
      timestamps: req.body.createdAt
    });
  newCrow.save(function(err) {
    if(err){
      console.log("We have an error!", err);
      for(var key in err.errors){
        req.flash(key, err.errors[key].message);
      }
      res.redirect('/crows/new');
    }
    else {
      res.redirect('/');
    }
  });
});

app.get('/crows/new', (req, res) => {
  console.log("Let's get a new crow!");
  res.render('new');
});

app.get('/crows/:id', (req, res) => {
  var id = req.params.id;
  Crow.find({_id: id}, (err, crow) => {
    res.render('info', {'crow': crow});
  });
  console.log("Fetching crow info...");
});

app.get('/crows/edit/:id', (req, res) => {
  var id = req.params.id;
  Crow.find({_id: id}, (err, crow) => {
    res.render('edit', {'crow': crow});
  });
  console.log("Fetching crow info...");
});

app.post('/crows/:id', (req, res) => {
  var id = req.params.id;
  var updateCrow = {
    'name': req.body.name, 
    'about': req.body.about
  }
  Crow.findByIdAndUpdate(id, updateCrow, (err, crow) => {
    if(err){
      console.log("We have an error!", err);
      for(var key in err.errors){
        req.flash(key, err.errors[key].message);
      }
      res.redirect('/crows/edit' + id);
    }
    else {
      console.log("Successful update!")
      res.redirect('/crows/' + id);
    }
  });
});

app.get('/crows/destroy/:id', (req, res) => {
  var id = req.params.id;
  Crow.findByIdAndRemove(id, (err) => {
    if(err) {
      console.log("Issue destroying this crow");
      res.redirect('/crows/' + id);
    } else {
      res.redirect('/')
    }
  });
});

