import React from 'react'
import "./forgot.css"
import { useState } from 'react';
import axios from 'axios';
import "./forgot.css"

const Forgot = () => {

  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:5000/api/auth/forgot-password', { email });
      console.log(response.msg)
      setMessage(response.data.msg);
    } catch (error) {
      console.error(error);
      setMessage('Error occurred. Please try again later.');
    }
  };


  return (
    <div class="reset-form">
    <h2>Forgot Password</h2>
    <form id="form" method="post" action=""  onSubmit={handleSubmit}>
        <label  for="password">Email:</label>
        <input type="email" id="email" required value={email} name="email" onChange={(e) => setEmail(e.target.value)}/>
        <input type="submit" value="Send Link"/>
    </form>
    <p>{message}</p>
</div>
  )
}

export default Forgot;
