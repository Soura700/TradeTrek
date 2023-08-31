var express = require("express");
var router = express();
const bcrypt = require("bcrypt");
const { check, validationResult } = require("express-validator");
const connection = require("../connection");
const session = require("express-session");
const MongoStore = require("connect-mongo")(session); // Import the session store
const cookieParser = require("cookie-parser");


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


//   router.post("/register", async (req, res) => {
//     const username = req.body.username;
//     const password = req.body.user_password;
//     const email = req.body.email;

//     const salt = await bcrypt.genSalt(12);
//     const hashedPass = await bcrypt.hash(password, salt);

//     try {

//         //check if the user already exists or not(by email)
//         const userExistsQuery = "SELECT email FROM users WHERE email = ?";
//         connection.query(
//             userExistsQuery,
//             [email],
//             (error, results) => {
//                 if (results.length > 0) {
//                     // User already exists, handle the error
//                     return res.status(400).json({ errors: 'User already registered' });
//                 }
//             }
//         )

//         connection.query(
//             "INSERT INTO users (username, email, user_password) VALUES (?, ?, ?)",
//             [username, email, password],
//             (error, results) => {
//                 if (error) {
//                     res.status(500).json(error);
//                 } else {
//                     res.status(200).json(results);
//                 }
//             }
//         );

//     } catch (error) {
//         res.status(500).json(error);
//     }
// });

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
      // return res.status(422).json({
      //     errors:errors.array()
      // });
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

            // You should securely compare passwords using a library like bcrypt

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

            // const {password , ...other} = user._doc;

            res.status(200).json(user);
          }
        );
      } catch (error) {
        console.log(error);
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

// Change the password
router.post("/reset-password/:id/:token", async (req, res, next) => {
  const { id, token } = req.params;
  console.log(id)
  const user = await User.findOne({ _id: id });
  if (!user) {
    return res.json({ status: "User not exists!!!" });
  }
  const secret = process.env.JWT_SECRET + user.password
  try {
    const payload = jwt.verify(token, secret)
    
    // const salt = await bcrypt.genSalt(12);
    // const hashedPass = await bcrypt.hash(req.body.password, salt);

    const hashedPass = await argon2.hash(req.body.password);
    await User.updateOne(
      {
        _id: id,
      },
      {
        $set: {
          password: hashedPass,
        },
      },
    );
    res.json({ msg: "Password Updated" })
    // }
  } catch (error) {
    console.log(error)
    res.status(500).json(error);
  }
})






// Exporting
module.exports = router;
