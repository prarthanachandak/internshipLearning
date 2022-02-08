const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require("bcrypt");               
var cookieParser = require("cookie-parser");    
const User = require("./models/user");
require("dotenv").config();

var util= require('util');
var encoder = new util.TextEncoder('utf-8');

const app = express();

mongoose.connect("mongodb://localhost:27017/studentLogin", { useUnifiedTopology: true})
.then(() => console.log("connection successful!"))
.catch((err)=>console.log(err));

//middlewares
app.use(express.json()); //use json(send to express), parse it
app.use(cookieParser()); //use cookie parser

app.get("/", (req, res) => {
    res.send("<h1>Hello</h1>");
});

app.post("/api/Login", async (req, res) => {
  //if user is already logged in - return jwt, use it in headers as authorisation, any calls with /api should go through middleware to check jwt
  //check if jwt is wrong or expired
  //
  try {
    const { email, password } = req.body;  //user sends body, take email and pass
        
    if (!(email && password)) {             //if either not present
        res.status(400).send("Field is missing");   //error 400
    }
  
    const user = await User.findOne({ email });     //find email    //using await because it needs to find in database
  
    // if(!user){                                   //comment to use bcrypt
    //   res.status(400).send("You are not registered in our app")
    // }

    //middleware to check the response - this block is between response and request - create middleware folder and import the functions in large projects
  
    if(user && (await bcrypt.compare(password, user.password)))     //if email and passwords and match
    {
        const token = jwt.sign(             //give token, give sign - takes 3 paramaetes , base/reference for token(email,pass), secret key, expiry duration
        {user_id: user._id, email},         //new id created with new entry, assigns current user id  //both unique
          process.env.SECRET_KEY,           //secret key checked //secret key written in env so that it doesnt get exposed
        {
            expiresIn: "2h",                //expiry
        }
        );
  
        user.token = token;                 //assign token to user
        user.password = undefined;          //while testing, dont show password - make undefined to hide before sending response
        // res.status(200).json(user); FIXME:
  
        // if you want to use cookies - store tokens into cookies
        const options = {
          expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
          httpOnly: true,               //*to check
        };
        // coz in auth.js we are expecting req.cookies.token therefore the first args is token
        //save tokens into cookies
        //200 - all okay, cookie parameters - name of token tobe stored, token itself, expiry of cookie
        res.status(200).cookie("token", token, options).json({      //send json response
          success: true,
          token,
          user,
        });
      }
  
      res.send(400).send("email or password is incorrect");
    } catch (error) {
      console.log(error);
    }
});

//middleware to check
const isTeacher = (req, res, next) =>{
  if(user.role===0){
    return res.status(403).json({
      error: "You are not a Teacher, Access Denied!",
    });
  }
  next();
}

app.get("/api/TeachersDashboard", isTeacher, (req, res) => {
  res.send("<h1>Hello Teachers!</h1>");
});


app.listen(3000, ()=>{
  console.log('listening on port 3000');
})
