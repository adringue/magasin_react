const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../../config/keys"); //Bringing in Secret Key
const passport = require("passport");

// Load Input Validation:
const validateRegisterInput = require("../../validations/register");
const validateLoginInput = require("../../validations/login");

// Load User model
const User = require("../../models/User")

// @route   GET api/users/test
// @desc    Test Users ROute
// @access  Public
router.get("/test", (req, res) => res.json({ msg: "Users works!" }));

// @route   POST api/users/register
// @desc    Register user
// @access  Public
router.post("/register", (req, res) => {
  const { errors, isValid } = validateRegisterInput(req.body);
  const { name, email, password, code } = req.body;

  // Check admin code:
  if(code !== keys.adminCode){
    return res.status(400).json({ message: "Error", "error": "ACCESS CODE DENIED!" });
  }

  // Check Validation:
  if(!isValid) {
    return res.status(400).json({message: "Error", "error: ": errors});
  }

  User.findOne({ email: req.body.email }).then(user => {
    if (user) {
      return res.status(400).json({ message: "Error", "error: ": "Email Already exists" });
    } else {

    const newUser = new User({
        name,
        email,
        password
      });

      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;
          newUser.password = hash;
          newUser.save().then(user => res.status(200).json({message: "success", data: user}))
          .catch(err => res.json({message: "Error", "Failed To Save: ": err}));
        });
      });
    }
  });
});

// @route   GET api/users/login
// @desc    Login User/ Returning JWT Token
// @access  Public
router.post("/login", (req, res) => {
  const { errors, isValid } = validateLoginInput(req.body);
  // Check Validation:
  if(!isValid) {
    return res.status(400).json({message: "Error", "error: ": errors});
  }
  const { email, password } = req.body;
  //find user by email:
  User.findOne({ email }).then(user => {
    // check for user
    if (!user) {
      errors.email= "User Not Found";
      return res.status(404).json({message: "Error", "error: ": errors});
    }
    // Check Password
    bcrypt.compare(password, user.password).then(isMatch => {
      if (isMatch) {

        // If User matched
        const payload = { id: user.id, name: user.name} // create JWT Payload

        //Sign Token: Encrypt into json web token:
        jwt.sign(payload, keys.secretOrKey, { expiresIn: 3600 }, (err, token) => {
          res.status(200).json({
              message: "Success",
              token: "Bearer " + token
          });
        });

      } else {
        errors.password = "Password Incorrect";
        return res.status(400).json({message: "Error", "error: ": errors});
      }
    })
  });
});

// @route   GET api/users/authenticated    -  Admin Item list
// @desc    Check if current admin is logged in and returns current admin user.
// @access  Private
router.get("/authenticated", passport.authenticate("jwt", { session: false }), (req, res) => {
  res.status(200).json({
    id: req.user.id,
    name: req.user.name,
    email: req.user.email
  });
  }
);

module.exports = router;