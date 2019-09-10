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
var QuoteSchema = new mongoose.Schema({
  quote: {type: String, required: true, minlength: 10},
  quoter: {type: String, required: true, minlength: 3}
}, {timestamps: true})
mongoose.model('Quote', QuoteSchema);
var Quote = mongoose.model('Quote');
// ========================== 
// Routes
// ========================== 
app.get('/', (req, res) => {
  res.render('index');
})

app.post('/add_quotes', (req, res) => {
  var newQuote = new Quote({
    'quote': req.body.quote, 
    'quoter': req.body.quoter
    }, { 
      timestamps: req.body.createdAt
    });
  newQuote.save(function(err) {
    if(err){
      console.log("We have an error!", err);
      for(var key in err.errors){
        req.flash('quotes', err.errors[key].message);
      }
      res.redirect('/');
    }
    else {
      res.redirect('/quotes');
    }
  });
});

app.get('/quotes', (req, res) => {
  Quote.find({}, (err, quotes) => {
    res.render('quotes', {'quotes': quotes});
    console.log(quotes)
  });
  console.log("Fetching quotes...");
});

