var express = require("express");
var router = express();
const bcrypt = require("bcrypt");
const { check, validationResult } = require("express-validator");
const connection = require("../connection");
const session = require("express-session");
const MongoStore = require("connect-mongo")(session); // Import the session store
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const sendMail = require("../controllers/sendMail");

router.use(cookieParser());


router.use(
  session({
    name: "user",
    secret: "soura@700@2004#1234",
    resave: false,
    saveUninitialized: true,
    cookie: {
      httpOnly: true,
      maxAge: 15 * 24 * 60 * 60 * 1000, // 15 days in milliseconds
    },
    store:
    // mongoStore
    new MongoStore({
      // Configure the MongoDB session store
      url: "mongodb+srv://sourabose:al6KdpioGzfcaqOw@cluster0.8h3wpmr.mongodb.net/ecommerce?retryWrites=true&w=majority",
      collection: "sessions",
      autoRemove: "interval",
      autoRemoveInterval: 1, // Remove expired sessions every 1 minute
      // expires: 60,// Interval in minutes (e.g., remove expired sessions every 15 minutes)
      expires: 15 * 24 * 60, // 15 days in minutes
    }),
  })
);

// Register User
// router.post(
//   "/register",
//   [
//     // Checking the username

//     // check('username','The usernme must be +3 characters long')   //Validating the fields by the criterias and password with regex
//     //   .exists()
//     //   .isLength({min:3}),

//     // Checking the email

//     check("email", "Email is not valid")
//       .notEmpty()
//       .withMessage("Email cannot be empty"),

//     //  Validating the password

//     check("user_password", "")
//       .isLength({ min: 8, max: 32 })
//       .withMessage("Passowrd must be in range of 8 to 32")
//       .matches(/[a-z]/)
//       .withMessage("Password must contain at least one lowercase letter")
//       .matches(/[A-Z]/)
//       .withMessage("Password must contain at least one uppercase letter")
//       .matches(/[0-9]/)
//       .withMessage("Password must contain at least one numeric character")
//       .matches(/[!@#$%^&*(),.?":{}|<>]/)
//       .withMessage("Password must contain at least one special character"),
//   ],
//   async (req, res) => {
//     const errors = validationResult(req);
//     const errorMessages = errors
//       .array()
//       .map(
//         (error) =>
//           `<div class="alert alert-warning" role="alert">${error.msg}</div>`
//       )
//       .join("");
//     if (!errors.isEmpty()) {
//       // return res.status(422).json({
//       //     errors:errors.array()
//       // });

//       return res.status(400).send(errorMessages);
//     } else {
//       try {
//         const email = req.body.email;
//         const username = req.body.fullname; //Taking the datas from body

//         const salt = await bcrypt.genSalt(10); //Encoding the password
//         const hashedPass = await bcrypt.hash(req.body.user_password, salt);

//         // Checks the user that is already exists in the database data

//         const userExistsQuery =
//           "SELECT * FROM users WHERE email = ? OR fullname = ?";

//         connection.query(
//           userExistsQuery,
//           [email, username],
//           (error, results) => {
//             if (error) {
//               return res.status(500).json({ errors: error });
//             }

//             if (results.length > 0) {
//               // User already exists, handle the error
//               return res
//                 .status(400)
//                 .json({ errors: "User already registered" });
//             }
//           }
//         );

//         // Checking the user first if the email exists then error other wise if not exists then
//         // Create new user

//         const newUser = {
//           fullname: req.body.fullname,
//           email: req.body.email,
//           user_password: hashedPass,
//         };

//         connection.query(
//           "INSERT INTO users SET ?",
//           newUser,
//           (error, results) => {
//             if (error) {
//               return res.status(500).json({
//                 errors: error,
//               });
//             }

//             newUser.id = results.insertId;
//             res.status(200).json(newUser);
//           }
//         );
//       } catch (error) {
//         console.log(error);
//         return res.status(500).json({
//           errors: error,
//         });
//       }
//     }
//   }
// );

router.post(
  "/register",
  [
    // Checking the username

    // check('username','The usernme must be +3 characters long')   //Validating the fields by the criterias and password with regex
    //   .exists()
    //   .isLength({min:3}),

    // Checking the email

    check("email", "Email is not valid")
      .notEmpty()
      .withMessage("Email cannot be empty"),

    //  Validating the password

    check("user_password", "")
      .isLength({ min: 8, max: 32 })
      .withMessage("Passowrd must be in range of 8 to 32")
      .matches(/[a-z]/)
      .withMessage("Password must contain at least one lowercase letter")
      .matches(/[A-Z]/)
      .withMessage("Password must contain at least one uppercase letter")
      .matches(/[0-9]/)
      .withMessage("Password must contain at least one numeric character")
      .matches(/[!@#$%^&*(),.?":{}|<>]/)
      .withMessage("Password must contain at least one special character"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    const errorMessages = errors
      .array()
      .map(
        (error) =>
          `<div class="alert alert-warning" role="alert">${error.msg}</div>`
      )
      .join("");

    if (!errors.isEmpty()) {
      return res.status(400).send(errorMessages);
    } else {
      try {
        const email = req.body.email;
        const username = req.body.fullname;

        const userExistsQuery =
          "SELECT * FROM users WHERE email = ? OR fullname = ?";

        connection.query(
          userExistsQuery,
          [email, username],
          async (error, results) => {
            if (error) {
              return res.status(500).json({ errors: error });
            }

            if (results.length > 0) {
              return res.status(400).json({ errors: "User already registered" });
            }

            try {
              const salt = await bcrypt.genSalt(10);
              const hashedPass = await bcrypt.hash(req.body.user_password, salt);

              const newUser = {
                fullname: req.body.fullname,
                email: req.body.email,
                user_password: hashedPass,
              };

              connection.query("INSERT INTO users SET ?", newUser, (error, results) => {
                if (error) {
                  return res.status(500).json({ errors: error });
                }

                newUser.id = results.insertId;
                res.status(200).json(newUser);
              });
            } catch (error) {
              console.log(error);
              return res.status(500).json({ errors: error });
            }
          }
        );
      } catch (error) {
        console.log(error);
        return res.status(500).json({ errors: error });
      }
    }
  }
);


// router.post(
//   "/login",
//   [
//     check("email", "").notEmpty().withMessage("Email cannot be empty"),
//     check("user_password", "")
//       .notEmpty()
//       .withMessage("Password No. cannot be empty"),
//   ],
//   async (req, res) => {
//     const errors = validationResult(req);
//     const errorMessages = errors
//       .array()
//       .map(
//         (error) =>
//           `<div class="alert alert-warning" role="alert">${error.msg}</div>`
//       )
//       .join("");
//     if (!errors.isEmpty()) {
//       // return res.status(422).json({
//       //     errors:errors.array()
//       // });
//       return res.status(400).send(errorMessages);
//     } else {
//       try {
//         const email = req.body.email;

//         connection.query(
//           "SELECT * FROM users WHERE email = ?",
//           [email],
//           async (err, result) => {
//             if (err) {
//               return res.status(500).json({ error: "Internal Server Error" });
//             }

//             if (result.length === 0) {
//               return res.status(400).json({ error: "User Not Found" });
//             }

//             const user = result[0];

//             // You should securely compare passwords using a library like bcrypt

//             var password = req.body.user_password;

//             const isPasswordValid = await bcrypt.compare(
//               password,
//               user.user_password
//             );

//             if (!isPasswordValid) {
//               return res.status(400).json({ error: "Wrong Credentials" });
//             }

//             req.session.userId = user.id;

//             const userId = user.id.toString();
//             const customValue = `custom_${userId}`;
//             res.cookie('session_token', customValue, { httpOnly: true, expires: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000) });

//             // const {password , ...other} = user._doc;

//             res.status(200).json(user);
//           }
//         );
//       } catch (error) {
//         console.log(error);
//         res.status(500).json({ error: "Internal Server Error" });
//       }
//     }
//   }
// );

router.post(
  "/login",
  [
    check("email", "").notEmpty().withMessage("Email cannot be empty"),
    check("user_password", "")
      .notEmpty()
      .withMessage("Password No. cannot be empty"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    const errorMessages = errors
      .array()
      .map(
        (error) =>
          `<div class="alert alert-warning" role="alert">${error.msg}</div>`
      )
      .join("");
    if (!errors.isEmpty()) {
      return res.status(400).send(errorMessages);
    } else {
      try {
        const email = req.body.email;

        connection.query(
          "SELECT * FROM users WHERE email = ?",
          [email],
          async (err, result) => {
            if (err) {
              return res.status(500).json({ error: "Internal Server Error" });
            }

            if (result.length === 0) {
              return res.status(400).json({ error: "User Not Found" });
            }

            const user = result[0];

            var password = req.body.user_password;

            const isPasswordValid = await bcrypt.compare(
              password,
              user.user_password
            );

            if (!isPasswordValid) {
              return res.status(400).json({ error: "Wrong Credentials" });
            }

            req.session.userId = user.id;

            const userId = user.id.toString();
            const customValue = `custom_${userId}`;
            res.cookie('session_token', customValue, { httpOnly: true, expires: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000) });

            // Get the current date and time
            const currentLoginTime = new Date();

            // Update current_login_time
            connection.query(
              "UPDATE users SET current_login_time = ? WHERE id = ?",
              [currentLoginTime, user.id],
              (updateError) => {
                if (updateError) {
                  console.error("Error updating current login time:", updateError);
                }

                // Before updating lastLoginTime, check if it's null
                if (user.lastLoginTime === null) {
                  // Set lastLoginTime to the same value as current_login_time
                  connection.query(
                    "UPDATE users SET lastLoginTime = ? WHERE id = ?",
                    [currentLoginTime, user.id],
                    (lastLoginError) => {
                      if (lastLoginError) {
                        console.error("Error updating last login time:", lastLoginError);
                      }
                    }
                  );
                } else {
                  // Update lastLoginTime with the previous value of current_login_time
                  connection.query(
                    "UPDATE users SET lastLoginTime = ? WHERE id = ?",
                    [user.current_login_time, user.id],
                    (lastLoginError) => {
                      if (lastLoginError) {
                        console.error("Error updating last login time:", lastLoginError);
                      }
                    }
                  );
                }
              }
            );

            res.status(200).json(user);
          }
        );
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
      }
    }
  }
);



router.get("/getSession", (req, res) => {
  console.log(req.session.userId);

  if (req.session.userId) {
    const id = req.session.userId;

    try {
      connection.query(
        "SELECT * FROM users WHERE id = ? ",
        id,
        (err, result) => {
          if (err) {
            res.status(200).json(err);
          } else {
            if (result.length > 0) res.status(200).json(result);
          }
        }
      );
    } catch (error) {
      res.status(500).json(error);
    }
  } else {
    res.status(400).json("User Not found");
  }
});

// Fetch Cookie
// router.get("/check-cookie", (req, res) => {
//   // Check if the session_token cookie exists
//   if (req.cookies.user) {
//     const cookies = req.cookies.user;
//     const c= req.cookies.session_token
//     console.log(c);
//     // res.send("Cookie exists: " + req.cookies.user);
//     res.status(200).json({ message: "Cookie exists" });
//   } else {
//     res.status(400).json({ message: "Cookie does not exist or has expired" });
//   }
// });


router.get("/check-cookie", (req, res) => {
  // Check if the session_token cookie exists
  if (req.cookies.user) {

    if(req.cookies.session_token){

    
      const session_cookie = req.cookies.session_token;
      const [customPart , userId] = session_cookie.split('_');

      if(customPart === 'custom' && userId ){

        res.status(200).json(userId);
        
        // res.status(200).json({ message: "Cookie exists" + " " +  userId  });
      }

      else{

        res.status(400).json({ message: "Cookie does not exist or has expired" });

      }
        
    }
  } else {
    res.status(400).json({ message: "Cookie does not exist or has expired" });
  }
});


// Forgot password
router.post("/forgot-password", async (req, res) => {
  try {
    const email = req.body.email;

    // Fetch user from MySQL

    connection.query('SELECT * FROM users WHERE email = ?', email,async (err,result)=>{
        if(err){
          return res.status(500).json(err)
        }else{
          if(result.length > 0){
            console.log(result)
            console.log(result[0].user_password)
            const secret = process.env.JWT_SECRET + result[0].user_password;
            const payload = {
              email: result.email,
              id: result.id
            }
            const jwtToken = jwt.sign(payload, secret, { expiresIn: '15m' });

            const emailContent = `Hello, Please click the link to reset your password http://localhost:3000/reset-password/${result[0].id}/${jwtToken}`;

            await sendMail(email,emailContent)
      
            // Send the email using your preferred method (not shown here)
            console.log(emailContent)
      
            res.json({ msg: 'Password reset link sent successfully!' });
          }
        }
    })
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error occurred", error });
  }
});


router.get("/reset-password/:id/:token", async (req, res) => {
  const { id, token } = req.params;

  try {
    // Fetch user from MySQL

    connection.query('SELECT * FROM users WHERE id = ?', id, async (err,result)=>{
      if(err){
        return res.status(500).json(err)
      }else{
        const secret = process.env.JWT_SECRET + user.user_password;
        const payload = jwt.verify(token, secret);

        res.render('/reset-password', { userId: user.id });
      }
    })


  } catch (error) {
    res.status(500).json(error);
  }
});



// Change the password
router.post("/reset-password/:id/:token", async (req, res, next) => {
  const { id } = req.params;

  try {
    // Fetch user from MySQL


    connection.query('SELECT * FROM users WHERE id = ?', id , async (err,result)=>{
      if(err){
        returnmres.status(500).json(err)
      }else{
        const hashedPass = await bcrypt.hash(req.body.password, 12); // Use a salt factor of 12

        // Update user's password in MySQL
         connection.query('UPDATE users SET user_password = ? WHERE id = ?', [hashedPass, id] , (error,result)=>{
          if(error){
            return res.status(500).json(error)
          }else{
            res.json({ msg: "Password Updated" });
          }
         });
   
      }
    });

  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});


// Exporting
module.exports = router;
