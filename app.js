require("dotenv").config();
const express=require("express");
const app=express();

const bodyParser=require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));

const ejs=require("ejs");
app.set("view engine",'ejs');

const mongoose=require("mongoose");
const { error } = require("console");
// mongoose.set('strictQuery', false);
mongoose.connect("mongodb://127.0.0.1:27017/authenticationDB",{useNewUrlParser: true, useUnifiedTopology: true});

const schema=new mongoose.Schema({
  email: String,
  password:String
});
const encrypt=require("mongoose-encryption");

const secret=process.env.SECRET;
schema.plugin(encrypt,{secret: secret, encryptedFields:["password"]});

const User=mongoose.model("User",schema);



app.post("/register",function(req,res){
    const newUser=new User({
        email: req.body.username,
        password: req.body.password
    });
    newUser.save();
    res.render("secrets.ejs");
});

app.post("/login",function(req,res){
    const username=req.body.username;
    const password=req.body.password;
    User.findOne({email: username}).then(function(found){
        if(found.password==password){
            res.render("secrets.ejs");
        }else{
            console.log("invalid user");
        }
    }).catch(error)
});






app.get("/",function(req,res){
    res.render("home.ejs");
});

app.get("/login",function(req,res){
    res.render("login.ejs");
});

app.get("/register",function(req,res){
    res.render("register.ejs");
});

app.listen(3000,function(){
    console.log("listening");
});