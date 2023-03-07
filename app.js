//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require("mongoose");

const homeStartingContent = "Welcome to Daily Journal!";
const aboutContent = "Do you want to have a perfect alibi of all the activities you have done. Then this the perfect website for you. Click on COMPOSE to add your own story. Have a nice day.😉";
const contactContent = "Do you want to catch me. Not possible!! 😉 Rather try any of the following to contact me.";

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

// Connecting to Mongo DB
mongoose.connect("mongodb+srv://adarisiddhu633:7UiXcWIcUMbmeLGA@cluster0.wbwl4tm.mongodb.net/dailyJournalDB", {useNewUrlParser: true});

let posts = [];

const postSchema = new mongoose.Schema({
    title: String,
    content: String
});

const Post = mongoose.model("Post", postSchema);



app.get("/", function(req,res){
    Post.find()
    .then(function(posts){
      res.render("home", {
        homeStartInfo: homeStartingContent,
        posts: posts
      });
    })
      .catch(function(err){
      console.log(err + ": Error to render home Page");
    });  
    
      
});

app.get("/about", function(req,res){
  res.render("about", {aboutInfo: aboutContent});
});

app.get("/contact", function(req,res){
  res.render("contact", {contactInfo: contactContent});   
});

app.get("/compose", function(req,res){
  res.render("compose");   
}); 

app.post("/compose", function(req,res){
  const post = new Post({
    title: req.body.titleText,
    content: req.body.inputText
  });
  post.save()
    .then(function(){
      res.redirect("/");
    })
    // .catch(function(err){
    //   console.log(err + ": Error in saving the post from compose.");
    // });
  //console.log(post);
  res.redirect("/");

});


app.get('/posts/:postId', function (req, res) {
  const requestedPostId = req.params['postId'];
  //console.log('requestedPostId: ' + requestedPostId);
  Post.findOne({_id: requestedPostId})
    .then(function(post){
      res.render("post", {
        title: post.title,
        content: post.content
      });
    })
    .catch(function(err){
      console.log(err + ": Error in rendering using postId");
    });  
    }); 


app.listen(3000, function() {
  console.log("Server started on port 3000");
});




