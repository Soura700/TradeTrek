import axios from "axios";
// import img from "../../assets/img.svg";
import img from "../../assets/5738137-removebg.png";

import img2 from "../../assets/9027295_1_-removebg-preview.png";

// import img2 from "../../assets/img1.svg";
import "./sign.css";
// import styles from "./sign.module.css"
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";

// signupform

const SignInSignUpForm = () => {
  const navigate = useNavigate();

  const [isSignUp, setIsSignUp] = useState(false);

  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);
  const [errorMessages, setErrorMessages] = useState([]);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState([]);
  const [signInemailError, setSignInEmailError] = useState("");
  const [signInPasswordError, setSignInPasswordError] = useState([]);

  const [showPassword, setShowPassword] = useState(false);


  const handleForgotPasswordClick = () => {
    setShowForgotPasswordModal(true);
  };

  const handleSignInClick = () => {
    setIsSignUp(false);
  };

  const handleSignUpClick = () => {
    setIsSignUp(true);
  };

  const clearSignInEmailError = () => {
    setSignInEmailError("");
  };

  const clearSignInPasswordError = () => {
    setSignInPasswordError([]);
  };

  const clearEmailError = () => {
    setEmailError("");
  };

  const clearPasswordError = () => {
    setPasswordError([]);
  };

  const handleSubmitSignIn = async (event) => {
    event.preventDefault();

    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData.entries());

    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/login",
        data,
        {
          withCredentials: true,
        }
      );
      if(response.status === 200){
        navigate("/")
      }
      if(response.status === 201){
        localStorage.setItem('token',response.data.token);
        navigate("/admin");
      }
      console.log("Login response:", response.data);
      // Handle success or redirect the user
    } catch (error) {
      console.error("Login error:", error);
      if (error.response.status === 401) {
        // Show a popup or alert indicating that the user already exists
        toast.error("Wrong Credentials");
      }else if (error.response.status === 404) {
        toast.error("User not found!!!");
      }else {
        if (error.response && error.response.data) {
          const messagesArray = error.response.data.split("@");

          // Display a toast for each error message
          messagesArray.forEach((message) => {
            if (message.includes("Email") || message.includes("Password")) {
              toast.error(message);
            }
          });

          // Find the specific error messages for email and password
          const emailError = messagesArray.find((message) =>
            message.includes("Email")
          );
          const passwordError = messagesArray.filter((message) =>
            message.includes("Password")
          );
          setSignInEmailError(emailError || "");
          setSignInPasswordError(passwordError || "");
        }
      }
      // Handle error
    }
  };

  const handleSubmitSignUp = async (event) => {
    event.preventDefault();

    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData.entries());
    console.log(data);

    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/register",
        data,
        {
          withCredentials: true,
        }
      );

      if (response.status === 200) {
        localStorage.setItem("isNewUser", "true");
        navigate("/");
      }
      console.log("Register response:", response.data);
      // Handle success or redirect the user
    } catch (error) {
      console.error("Register error:", error);
      // Handle error
      if (error.response.status === 409) {
        // Show a popup or alert indicating that the user already exists
        toast.error(
          "User Already Registered ... Try differenet mail or username"
        );
      } else {
        if (error.response && error.response.data) {
          const messagesArray = error.response.data.split("@");

          // Display a toast for each error message
          messagesArray.forEach((message) => {
            if (
              message.includes("Email") ||
              message.includes("Password") ||
              message.includes("Username")
            ) {
              toast.error(message);
            }
          });

          // Find the specific error messages for email and password
          const emailError = messagesArray.find((message) =>
            message.includes("Email")
          );
          const passwordError = messagesArray.filter((message) =>
            message.includes("Password")
          );
          setErrorMessages(messagesArray);
          setEmailError(emailError || "");
          setPasswordError(passwordError || "");
        }
      }
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
              <input type="email" name="email" placeholder="Email" onChange={clearEmailError} />
            </div>
            <div class="input-field">
              <i class="fas fa-lock"></i>
              <input
                type="password"
                name="user_password"
                placeholder="Password" onChange={clearSignInPasswordError}
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
              <input type="email" name="email" onChange={clearEmailError} placeholder="Email" />
            </div>
            <div class="input-field">
              <i class="fas fa-lock"></i>
              <input
                type="password"
                onChange={clearPasswordError}
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
      <ToastContainer />
    </div>
  );
};

export default SignInSignUpForm;