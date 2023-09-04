import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import "./reset.css"

const Reset = () => {
  const { id, token } = useParams(); // Access the ID and token from the URL
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if passwords match
    if (password !== confirmPassword) {
      setMessage('Passwords do not match');
      return;
    }

    try {
      // Send a POST request to reset the password
      const response = await axios.post(`http://localhost:5000/api/auth/reset-password/${id}/${token}`, { password });
      setMessage(response.data.msg);
    } catch (error) {
      console.error(error);
      setMessage('Error occurred. Please try again later.');
    }
  };

  return (
    <div className="reset-form">
      <h2>Reset Password</h2>
      <form id="form" method="post" onSubmit={handleSubmit}>
        <label htmlFor="newPassword">New Password:</label>
        <input
          type="password"
          id="newPassword"
          name="newPassword"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <label htmlFor="confirmPassword">Confirm Password:</label>
        <input
          type="password"
          id="confirmPassword"
          name="confirmPassword"
          required
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />

        <input type="submit" value="Reset Password" />
      </form>
      <p>{message}</p>
    </div>
  );
};

export default Reset;
