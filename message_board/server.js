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
var CommentSchema = new mongoose.Schema({
  name: {type: String, required: [true, "Please enter a name!"], minlength: [2, "Name must be at least 2 characters!"]},
  comment: {type: String, required: [true, "Please input your comment before submitting!"]},
}, {timestamps:true});
mongoose.model('Comment', CommentSchema);
var Comment = mongoose.model('Comment');

var PostSchema = new mongoose.Schema({
  name: {type: String, required: [true, "Please enter a name!"], minlength: [2, "Name must be at least 2 characters!"]},
  post: {type: String, required: [true, "Please input your message before submitting!"]},
  comments: [CommentSchema]
}, {timestamps:true});
mongoose.model('Post', PostSchema);
var Post = mongoose.model('Post');

// ========================== 
// Routes
// ========================== 


app.get('/', (req, res) => {
  var allPosts = Post.find({}, (err, posts) => {
    console.log(posts)
    res.render('index', { 'posts' : posts });
  })
  console.log('Looking for Posts, please hold');
})

app.post('/add_post', (req, res) => {
  var newPost = new Post({
    'name': req.body.name, 
    'post': req.body.post
    }, { 
      timestamps: req.body.createdAt
    });
    newPost.save(function(err) {
    if(err){
      console.log("We have an error!", err);
      for(var key in err.errors){
        req.flash(key, err.errors[key].message);
      }
      res.redirect('/');
    }
    else {
      res.redirect('/');
    }
  });
});

app.post('/add_comment/:id', (req, res) => {
  var postId = req.params.id;
  var newComment = new Comment({
    'name': req.body.name, 
    'comment': req.body.comment
    }, { 
      timestamps: req.body.createdAt
    });
    newComment.save(function(err, comment) {
    if(err){
      console.log("We have an error!", err);
      for(var key in err.errors){
        req.flash(key, err.errors[key].message);
      }
      res.redirect('/');
    }
    else {
      Post.findOneAndUpdate({_id: postId}, {$push: {comments: comment}}, function(err, comment) {
        if(err){
          console.log("We have an error!", err);
          for(var key in err.errors){
            req.flash(key, err.errors[key].message);
          }
          res.redirect('/');
        } else {
          res.redirect('/');
        }
      });
    };
  });
});
