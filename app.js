require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const encrypt = require("mongoose-encryption");
const bcrypt = require("bcrypt");
const saltRounds = 10;

const app = express();

mongoose.connect("mongodb://localhost:27017/userDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({
  extended: true,
}));
app.use(express.static("static"));

const userSchema = new mongoose.Schema ({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});



const User = new mongoose.model("User",userSchema);

app.post("/register",function(req,res){
  bcrypt.hash(req.body.password, saltRounds, function(err,hash){
    const newUser = new User(
      {
          email: req.body.username,
          password: hash,
      });
      newUser.save(function(err){
        if(err){
          console.log(err);
        }
        else{
          res.render("secrets");
          }
      });
  });


});

app.post("/login", function(req,res){
  User.findOne({email:req.body.username}, function(err,result){
    if(err){
      console.log(err)
    }
    else{
      if(result){
        if (result.password == req.body.password){
          res.render("secrets");
        }
        else{
          res.send("Paswword is incorrect.");
        }
      }
    }
  });
});


app.get("/", function(req,res){
  res.render("home");
});

app.get("/register",function(req,res){
  res.render("register");
});

app.get("/login",function(req,res){
  res.render("login");
});


app.listen(3000,function(){
  console.log("Listening at port 3000");
});
