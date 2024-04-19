import axios from "axios";
// import img from "../../assets/img.svg";
import img from "../../assets/5738137-removebg.png";

import img2 from "../../assets/9027295_1_-removebg-preview.png";

// import img2 from "../../assets/img1.svg";
import "./sign.css";
// import styles from "./sign.module.css"
import React, { useState } from "react";

// signupform

const SignInSignUpForm = () => {
  const [isSignUp, setIsSignUp] = useState(false);

  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);

  const handleForgotPasswordClick = () => {
    setShowForgotPasswordModal(true);
  };

  const handleSignInClick = () => {
    setIsSignUp(false);
  };

  const handleSignUpClick = () => {
    setIsSignUp(true);
  };

  const handleSubmitSignIn = async (event) => {
    event.preventDefault();

    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData.entries());

    console.log(data);

    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/login",
        data,
        {
          withCredentials: true,
        }
      );
      console.log("Login response:", response.data);
      // Handle success or redirect the user
    } catch (error) {
      console.error("Login error:", error);
      // Handle error
    }
  };

  const handleSubmitSignUp = async (event) => {
    event.preventDefault();

    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData.entries());

    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/register",
        data
      );

      console.log("Register response:", response.data);
      // Handle success or redirect the user
    } catch (error) {
      console.error("Register error:", error);
      // Handle error
    }
  };

  return (
    <div className={`container ${isSignUp ? "sign-up-mode" : ""}`}>
      <div className="forms-container">
        <div className="signin-signup">
          <form
            action="#"
            onSubmit={isSignUp ? handleSubmitSignUp : handleSubmitSignIn}
            method="post"
            className="sign-in-form"
          >
            <h2 class="title">Sign in</h2>
            <div class="input-field">
              <i class="fas fa-user"></i>
              <input type="email" name="email" placeholder="Email" />
            </div>
            <div class="input-field">
              <i class="fas fa-lock"></i>
              <input
                type="password"
                name="user_password"
                placeholder="Password"
              />
            </div>
            <input type="submit" value="Login" class="button solid" />
            <button
              className="button transparent"
              onClick={handleForgotPasswordClick}
            >
              Forgot Password
            </button>

            <p class="social-text">Or Sign in with social platforms</p>
            <div class="social-media">
              <a href="#" class="social-icon">
                <i class="fab fa-facebook-f"></i>
              </a>
              <a href="#" class="social-icon">
                <i class="fab fa-twitter"></i>
              </a>
              <a href="#" class="social-icon">
                <i class="fab fa-google"></i>
              </a>
              <a href="#" class="social-icon">
                <i class="fab fa-linkedin-in"></i>
              </a>
            </div>
          </form>
          <form
            action="#"
            onSubmit={isSignUp ? handleSubmitSignUp : handleSubmitSignIn}
            method="POST"
            className="sign-up-form"
          >
            <h2 class="title">Sign up</h2>
            <div class="input-field">
              <i class="fas fa-user"></i>
              <input type="text" name="fullname" placeholder="Username" />
            </div>
            <div class="input-field">
              <i class="fas fa-envelope"></i>
              <input type="email" name="email" placeholder="Email" />
            </div>
            <div class="input-field">
              <i class="fas fa-lock"></i>
              <input
                type="password"
                name="user_password"
                placeholder="Password"
              />
            </div>
            <input type="submit" class="button" value="Sign up" />
            <p class="social-text">Or Sign up with social platforms</p>
            <div class="social-media">
              <a href="#" class="social-icon">
                <i class="fab fa-facebook-f"></i>
              </a>
              <a href="#" class="social-icon">
                <i class="fab fa-twitter"></i>
              </a>
              <a href="#" class="social-icon">
                <i class="fab fa-google"></i>
              </a>
              <a href="#" class="social-icon">
                <i class="fab fa-linkedin-in"></i>
              </a>
            </div>
          </form>
        </div>
      </div>

      <div className="panels-container">
        <div className="panel left-panel">
          <div class="content">
            <h3>New here ?</h3>
            <p>
              Lorem ipsum, dolor sit amet consectetur adipisicing elit. Debitis,
              ex ratione. Aliquid!
            </p>
            <button
              class="button transparent"
              id="sign-up-btn"
              onClick={handleSignUpClick}
            >
              Sign up
            </button>
          </div>
          <img src={img} class="image" alt="" />
        </div>
        <div className="panel right-panel">
          <div class="content">
            <h3>One of us ?</h3>
            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Nostrum
              laboriosam ad deleniti.
            </p>
            <button
              class="button transparent"
              id="sign-in-btn"
              onClick={handleSignInClick}
            >
              Sign in
            </button>
          </div>
          <img src={img2} class="image" alt="" />
        </div>
      </div>
    </div>
  );
};

export default SignInSignUpForm;

// import axios from 'axios';
// import img from '../../assets/img.svg';
// import img2 from "../../assets/img1.svg";
// import styles from './sign.module.css'; // Import the CSS module
// import React, { useState } from "react";

// const SignInSignUpForm = () => {
//   const [isSignUp, setIsSignUp] = useState(false);

//   const handleSignInClick = () => {
//     setIsSignUp(false);
//   };

//   const handleSignUpClick = () => {
//     setIsSignUp(true);
//   };

//   const handleSubmitSignIn = async (event) => {
//     event.preventDefault();

//     const formData = new FormData(event.target);
//     const data = Object.fromEntries(formData.entries());

//     console.log(data);

//     try {
//       const response = await axios.post("http://localhost:5000/api/auth/login", data , {
//         withCredentials: true
//       });
//       console.log("Login response:", response.data);
//       // Handle success or redirect the user
//     } catch (error) {
//       console.error("Login error:", error);
//       // Handle error
//     }
//   };

//   const handleSubmitSignUp = async (event) => {
//     event.preventDefault();

//     const formData = new FormData(event.target);
//     const data = Object.fromEntries(formData.entries());

//     try {
//       const response = await axios.post("http://localhost:5000/api/auth/register", data);
//       console.log("Register response:", response.data);
//       // Handle success or redirect the user
//     } catch (error) {
//       console.error("Register error:", error);
//       // Handle error
//     }
//   };

//   return (
//     <div className={`${styles.container} ${isSignUp ? styles['sign-up-mode'] : ''}`}>
//       <div className={styles['forms-container']}>
//         <div className={styles['signin-signup']}>
//           <form action="#" onSubmit={isSignUp ? handleSubmitSignUp : handleSubmitSignIn} method='post' className={styles['sign-in-form']}>
//             <h2 className={styles.title}>Sign in</h2>
//             <div className={styles['input-field']}>
//               <i className="fas fa-user"></i>
//               <input type="email" name='email' placeholder="Email" />
//             </div>
//             <div className={styles['input-field']}>
//               <i className="fas fa-lock"></i>
//               <input type="password" name='user_password' placeholder="Password" />
//             </div>
//             <input type="submit" value="Login" className={`${styles.btn} ${styles.solid}`} />
//             <p className={styles['social-text']}>Or Sign in with social platforms</p>
//             <div className={styles['social-media']}>
//               <a href="#" className={styles['social-icon']}>
//                 <i className="fab fa-facebook-f"></i>
//               </a>
//               <a href="#" className={styles['social-icon']}>
//                 <i className="fab fa-twitter"></i>
//               </a>
//               <a href="#" className={styles['social-icon']}>
//                 <i className="fab fa-google"></i>
//               </a>
//               <a href="#" className={styles['social-icon']}>
//                 <i className="fab fa-linkedin-in"></i>
//               </a>
//             </div>
//           </form>
//           <form action="#" onSubmit={isSignUp ? handleSubmitSignUp : handleSubmitSignIn} method="POST" className={styles['sign-up-form']}>
//             <h2 className={styles.title}>Sign up</h2>
//             <div className={styles['input-field']}>
//               <i className="fas fa-user"></i>
//               <input type="text" name='fullname' placeholder="Username" />
//             </div>
//             <div className={styles['input-field']}>
//               <i className="fas fa-envelope"></i>
//               <input type="email" name='email' placeholder="Email" />
//             </div>
//             <div className={styles['input-field']}>
//               <i className="fas fa-lock"></i>
//               <input type="password" name='user_password' placeholder="Password" />
//             </div>
//             <input type="submit" className={styles.btn} value="Sign up" />
//             <p className={styles['social-text']}>Or Sign up with social platforms</p>
//             <div className={styles['social-media']}>
//               <a href="#" className={styles['social-icon']}>
//                 <i className="fab fa-facebook-f"></i>
//               </a>
//               <a href="#" className={styles['social-icon']}>
//                 <i className="fab fa-twitter"></i>
//               </a>
//               <a href="#" className={styles['social-icon']}>
//                 <i className="fab fa-google"></i>
//               </a>
//               <a href="#" className={styles['social-icon']}>
//                 <i className="fab fa-linkedin-in"></i>
//               </a>
//             </div>
//           </form>
//         </div>
//       </div>

//       <div className={styles['panels-container']}>
//         <div className={`${styles.panel} ${styles['left-panel']}`}>
//           <div className={styles.content}>
//             <h3>New here ?</h3>
//             <p>
//               Lorem ipsum, dolor sit amet consectetur adipisicing elit. Debitis,
//               ex ratione. Aliquid!
//             </p>
//             <button className={`${styles.btn} ${styles.transparent}`} id={styles['sign-up-btn']} onClick={handleSignUpClick}>
//               Sign up
//             </button>
//           </div>
//           <img src={img} className={styles.image} alt="" />
//         </div>
//         <div className={`${styles.panel} ${styles['right-panel']}`}>
//           <div className={styles.content}>
//             <h3>One of us ?</h3>
//             <p>
//               Lorem ipsum dolor sit amet consectetur adipisicing elit. Nostrum
//               laboriosam ad deleniti.
//             </p>
//             <button className={`${styles.btn} ${styles.transparent}`} id={styles['sign-in-btn']} onClick={handleSignInClick}>
//               Sign in
//             </button>
//           </div>
//           <img src={img2} className={styles.image} alt="" />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default SignInSignUpForm;
