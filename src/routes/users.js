var express = require('express');
var router = express.Router();
require("../models/connection");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { auth } = require("../../middleware/auth");
const User = require('../models/users');
const { checkBody } = require("../modules/checkBody");

const JWT_SECRET = process.env.JWT_SECRET;

// Générer un token JWT
const generateToken = (id) => {
  return jwt.sign({ id }, JWT_SECRET, { expiresIn: "1d" });
};


// route to create a new account
router.post('/signup', async function(req, res, next) {
  if (!checkBody(req.body, ["username", "password"])) {
    res.json({ result: false, error: "Missing or empty fields !" });
    return;
  }

  const { username, password } = req.body;
  // console.log({reqBodySignup: req.body});
  
  try {
     // check if a user already been registered
    const isUser = await User.findOne({
      username: { $regex: new RegExp(req.body.username, "i")},
      // test: console.log({usernameRegex:username})
     });
    // console.log({isUser});
        
    if(isUser !== null) {
      return res.status(400).json({ message: "user already exists" });
    }

    const user = await User.create({ username, password });
    console.log({user});
    const token = generateToken(user._id);
    

    res
    .cookie("jwt", token, 
      { 
        httpOnly: true, 
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 24 * 60 * 60 * 1000,
      })
    .status(201)
    .json({result: user});
    
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
  
  
});

//route to sign in
router.post("/signin", async (req, res) => {
  if (!checkBody(req.body, ["username", "password"])) {
    res.json({ result: false, error: "Missing or empty fields !" });
    return;
  }

  try {
    const { username, password } = req.body;
    // console.log("reqBody", req.body);
    
    const user = await User.findOne({
      username: { $regex: new RegExp(username, "i") },
    });
    console.log({user});
    
    if (!user) return res.status(404).json({ message: "User not found" });

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    console.log({isPasswordMatch});
    if (!isPasswordMatch) return res.status(400).json({ message: "Invalid credentials" });
  
    const token = generateToken(user._id);
    console.log({token});

    res
    .cookie("jwt", token, 
      {
        httpOnly: true, 
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 24 * 60 * 60 * 1000,
      })
    .status(201)
    .json({result: user});
  
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/logout", (_, res) => {
  res.clearCookie("jwt");
  res.json({ result: true });
});

module.exports = router;


// .then((data) => {
//   console.log({data});
//   console.log("compare", bcrypt.compare(req.body.password, data.password));
  
//    console.log(req.body.password, data.password);
//    if (data && bcrypt.compare(req.body.password, data.password)) {
     
//      const token = jwt.sign(
//        {
//          id: data?.id,
//        },
//        JWT_SECRET,
//        {
//          expiresIn: "24h",
//        }
//      );

//      res.cookie("jwt", token, {
//        httpOnly: true,
//        secure: process.env.NODE_ENV === "production",
//        sameSite: "strict",
//        maxAge: 24 * 60 * 60 * 1000,
//      });
//      res.json({ result: true, data });
//    } else {
//      res.json({ result: false, error: "User not found" });
//    }
//  });

// .then((data) => {
//   if(data === null){
//     const hash = bcrypt.hashSync(req.body.username, 10);

//     const newUser = new User({
//       username: req.body.username,
//       password: hash,
//     });

//     newUser.save()
//     .then((data) => {
//       const token = jwt.sign(
//         {
//           id: data.id
//         },
//         JWT_SECRET,
//         {
//           expiresIn: "24h",
//         }
//       );

//       res
//       .cookie("jwt", token, {
//         httpOnly: true,
//         secure: process.NODE_ENV === "production",
//         sameSite: "strict",
//         maxAge: 24 * 60 * 60 * 1000,
//       })
//       .json({ result: true, data });
//     });
//   } else {
//     // User already exists in database
//     res.json({ result: false, error: "User already exists !" });
//   } 
//    });