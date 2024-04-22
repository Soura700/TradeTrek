var express = require("express");
var router = express();
const bcrypt = require("bcrypt");
const { check, validationResult } = require("express-validator");
const connection = require("../connection");
const session = require("express-session");
const MongoStore = require("connect-mongo")(session); // Import the session store
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const verifyToken = require("../controllers/adminVerify");
// const sendMail = require("../controllers/sendMail");

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

router.post(
  "/register",
  [
    check("fullname", "Username must be +3 characters long")
      .exists()
      .isLength({ min: 3 }),
    check("email", "Email is not valid")
      .notEmpty()
      .withMessage("Email cannot be empty"),
    check("user_password", "")
      .isLength({ min: 8, max: 32 })
      .withMessage("Password must be in range of 8 to 32")
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
    .map((error) => `${error.msg}`)
    .join("@");

    if (!errors.isEmpty()) {
      return res.status(400).send(errorMessages);
    } else {
      try {
        const email = req.body.email;
        const username = req.body.fullname;
        const password = req.body.user_password;

        const userExistsQuery =
          "SELECT * FROM users WHERE email = ?";

        connection.query(
          userExistsQuery,
          [email],
          async (error, results) => {
            if (error) {
              return res.status(402).json({ errors: error });
            }

            if (results.length > 0) {
              return res.status(409).json({ errors: "User already registered" });
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
                  console.log("Error");
                  console.log(error);
                  return res.status(500).json({ errors: error });
                }

                const user = results.insertId;
                req.session.userId = user;
                const userId = user.toString();
                console.log(userId);
                const customValue = `custom_${userId}`;
                res.cookie('session_token', customValue, { httpOnly: true, expires: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000) });
                res.status(200).json(newUser);
              });
            } catch (error) {
              console.log(error);
              return res.status(500).json(error);
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


router.post(
  "/login",
  [
    check("email", "").notEmpty().withMessage("Email cannot be empty"),
    check("user_password", "")
      .notEmpty()
      .withMessage("Password cannot be empty"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    const errorMessages = errors
    .array()
    .map((error) => `${error.msg}`)
    .join("@");
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
              return res.status(401).json({ error: "User Not Found" });
            }

            const user = result[0];

            var password = req.body.user_password;

            const isPasswordValid = await bcrypt.compare(
              password,
              user.user_password
            );

            if (!isPasswordValid) {
              return res.status(401).json({ error: "Wrong Credentials" });
            }

            // User is authenticated, generate JWT token
            const token = jwt.sign({ userId: user.id, isAdmin: user.isAdmin }, process.env.SECRET_KEY, { expiresIn: "10m" });
            console.log(token);

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

            if(user.isAdmin === 1){
              // res.status(201).json(user)
              res.status(201).json({ token });
            }else{
              res.status(200).json(user);
            }
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


//forgot password
router.post("/password/forgotpassword", async (req, res) => {
  console.log("Called");
  try {
    const { email } = req.body;
    connection.query(
      "SELECT * FROM users WHERE email = ?",
      [email], // Add a comma here to separate the query string from the parameter array
      (error, results) => {
        if (error) {
          console.log(error);
          return res.status(400).json(error);
        } else {
          // if (!results[0].email) {
          if (results.length === 0) {
            console.log("Entered");
            res.status(400).json("User is not registered");
          } else {
            const secret = process.env.SECRET_KEY + results[0].user_password;
            const payload = {
              email: results[0].email,
              id: results[0].id,
            };
            const token = jwt.sign(payload, secret, { expiresIn: "10m" });
            const link = `http://localhost:3000/resetpassword/${results[0].id}/${token}`;
            console.log(token);
            console.log(link);
            let transporter = nodemailer.createTransport({
              service: "gmail",
              // auth: {
              //   user: "sourabose66@gmail.com",
              //   pass: "weelmmnyhsodglmw",
              // },
              auth: {
                user: 'sourabose2004@gmail.com',
                pass: 'uzixjeiuaawureeq'
            }
            });

            let message = {
              from: "sourabose66@gmail.com",
              to: results[0].email,
              subject: "Password Reset",
              text: link,
            };
            transporter.sendMail(message, (error, info) => {
              if (error) {
                console.log("Error");
                console.log(error);
              } else {
                // console.log("Email sent: " + info.response);
                res
                  .status(200)
                  .json({ msg: "Link has been send successfylly" });
              }
            });
            // res.send("Password link has been sent...");
          }
        }
      }
    );
  } catch (error) {
    // console.log(error);
  }
});

//reset password
router.get("/resetpassword/:id/:token", async (req, res) => {
  const { id, token } = req.params;
  connection.query(
    "SELECT * FROM users WHERE id = ?",
    [id], // Add a comma here to separate the query string from the parameter array
    (error, results) => {
      if (error) {
        return res.status(500).json(error);
      } else {
        if (!results[0].id) {
          return res.status(409).json("User is not registered");
        } else {
          try {
            const secret = process.env.SECRET_KEY + user.password;
            const payload = jwt.verify(token, secret);
            res.redirect("/resetpassword/:id/:token");
          } catch (error) {
            res.status(500).json(error);
          }
        }
      }
    }
  );
});

//update password
router.post("/resetpassword/:id/:token", async (req, res, next) => {
  const { id, token } = req.params;

  // Fetch the user from the database based on id
  connection.query(
    "SELECT * FROM users WHERE id = ?",
    id,
    async (error, results, fields) => {
      if (error) {
        console.error("Error fetching user from MySQL database: ", error);
        return res.status(500).json({ error: "Internal Server Error" });
      }
      // Check if the user exists
      if (results.length === 0) {
        return res.json({ status: "User does not exist" });
      }
      const user = results[0];
      const secret = process.env.SECRET_KEY + user.user_password;

      try {
        // Verify the token
        const payload = jwt.verify(token, secret);

        // Hash the new password
        const salt = await bcrypt.genSalt(12);
        const hashedPass = await bcrypt.hash(req.body.user_password, salt);

        // Update the user's password in the database
        connection.query(
          "UPDATE users SET user_password = ? WHERE id = ?",
          [hashedPass, id],
          (updateError, updateResults, updateFields) => {
            if (updateError) {
              console.error(
                "Error updating password in MySQL database: ",
                updateError
              );
              return res.status(500).json({ error: "Internal Server Error" });
            }

            res.json({ msg: "Password Updated" });
          }
        );
      } catch (error) {
        // console.error("Error resetting password: ", error);
        res.status(500).json({ error: "Internal Server Error" });
      }
    }
  );
});

router.use('/verify-token',verifyToken);

router.get('/api/verify-token', (req, res) => {
  // The user's information (including their role) is already attached to req.user by the verifyToken middleware
  res.json({ role: req.user.role });
});

// Exporting
module.exports = router;
