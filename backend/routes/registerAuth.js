var express = require('express');
var router = express();
const bcrypt = require("bcrypt");
const {check,validationResult} = require("express-validator");
const connection = require("../connection")






// Register User
router.post("/register",[
  // Checking the username

    // check('username','The usernme must be +3 characters long')   //Validating the fields by the criterias and password with regex
    //   .exists()
    //   .isLength({min:3}),

    // Checking the email

    check('email','Email is not valid')
      .notEmpty()
      .withMessage('Email cannot be empty'),

      //  Validating the password


    check('user_password','')
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

        const email= req.body.email;
        const username = req.body.fullname; //Taking the datas from body 

        const salt = await bcrypt.genSalt(10); //Encoding the password
        const hashedPass = await bcrypt.hash(req.body.user_password, salt); 


        // Checks the user taht is already exists in the database data 
        
        const userExistsQuery = 'SELECT * FROM users WHERE email = ? OR fullname = ?';

        connection.query(userExistsQuery, [email, username], (error, results) => {
        
          if (error) {
            return res.status(500).json({ errors: error });
          }

          if (results.length > 0) {
            // User already exists, handle the error
            return res.status(400).json({ errors: 'User already registered' });
        }
      })

        // // Checking the data

        // const email_mobile=req.body.email;
        
        // var data = validInput(email_mobile);



        // Checking the user first if the email exists then error other wise if not exists then 
        // Create new user

        const newUser = {

            fullname:data[0],
            email: req.body.EMAIL_MOBILE_TOKEN,
            user_password: hashedPass,
            UNIQUE_KEY:base64String,

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


// Exporting
module.exports = router;