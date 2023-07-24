var express = require('express');
var router = express();
const axios = require("axios");
const bcrypt = require("bcrypt");
const session = require("express-session");
const {check,validationResult} = require("express-validator");
const connection = require("../connection")



router.post("/register",[
    // Checking the username
  
      // check('username','The usernme must be +3 characters long')   //Validating the fields by the criterias and password with regex
      //   .exists()
      //   .isLength({min:3}),
  
      // Checking the email
  
      check('EMAIL_MOBILE_TOKEN','Email is not valid')
        .notEmpty()
        .withMessage('Email cannot be empty'),
  
        //  Validating the password
  
  
      check('PASS_WORD','')
       .isLength({min:8,max:32})
       .withMessage('Passowrd must be in range of 8 to 32') 
       .matches(/[a-z]/)
       .withMessage('Password must contain at least one lowercase letter')  
       .matches(/[A-Z]/)
       .withMessage('Password must contain at least one uppercase letter')
       .matches(/[0-9]/)
       .withMessage('Password must contain at least one numeric character')
       .matches(/[!@#$%^&*(),.?":{}|<>]/)
       .withMessage('Password must contain at least one special character')
  
  
    ]
     ,async (req, res) => {
  
  
      const errors = validationResult(req)
      const errorMessages = errors.array().map(error => `<div class="alert alert-warning" role="alert">${error.msg}</div>`).join('');
      if(!errors.isEmpty()){
        // return res.status(422).json({
        //     errors:errors.array()
        // });
  
        return res.status(400).send(errorMessages);
      }
  
  
      else{
  
  
        try {
  
          const emailMobile= req.body.EMAIL_MOBILE_TOKEN;
          const username = req.body.USERNAME;
          const salt = await bcrypt.genSalt(10);
          const hashedPass = await bcrypt.hash(req.body.PASS_WORD, salt);
  
  
          // Checks the user taht is already exists in the database data 
          
          const userExistsQuery = 'SELECT * FROM users WHERE EMAIL_MOBILE_TOKEN = ? OR USERNAME = ?';
  
          connection.query(userExistsQuery, [emailMobile, username], (error, results) => {
          
            if (error) {
              return res.status(500).json({ errors: error });
            }
            if (results.length > 0) {
              // User already exists, handle the error
              return res.status(400).json({ errors: 'User already registered' });
          }
        })
  
          // Checking the data
  
          const email_mobile=req.body.EMAIL_MOBILE_TOKEN;
          
          var data = validInput(email_mobile);
  
          const DATE_TIME  = dateTime();
          // console.log("Data->0",data[0]);
          // console.log("Data->1",data[1])
          
   
            var time=Date.now();
            
            var timeStamp = time.toString();
            // console.log("Type    "+typeof(timeStamp))
  
            // Create buffer object, specifying utf8 as encoding
            let bufferObj = Buffer.from(timeStamp, "utf8");
    
            // Encode the Buffer as a base64 string
            let base64String = bufferObj.toString("base64");
            console.log("Bae-64",base64String);
  
  
          const newUser = {
  
              USERNAME:data[0],
              PRIMARY_KEY_TYPE:data[1],
              EMAIL_MOBILE_TOKEN: req.body.EMAIL_MOBILE_TOKEN,
              PASS_WORD: hashedPass,
              // DATE_TIME:DATE_TIME, //Current timestamp
              UNIQUE_KEY:base64String,
              SALTED_KEY:alphaNumericString()
            };
  
            
  
          connection.query('INSERT INTO users SET ?', newUser, (error, results) => {
              if (error) {
                return res.status(500).json({
                  errors: error
                });
              }
  
  
          newUser.id = results.insertId;
          res.status(200).json(newUser);
          });
  
  
        } catch (error) {
  
  
          console.log(error)
          return res.status(500).json({
            errors:error
          })
        }
      }
    });
  

    // Exposting
    module.exports = router;