// import React from 'react'

// const Reset = () => {
//   return (
//         <div class="reset-form">
//         <h2>Reset Password</h2>
//         <form id="form" method="post" action="">
//             <label  for="password">New Password:</label>
//             <input type="password" id="newPassword" name="password" required>

//             <label for="password2">Confirm Password:</label>
//             <input type="password" id="confirmPassword" name="password2" required>

//             <input type="submit" value="Reset Password">
//         </form>
//     </div>
//   )
// }

// export default Reset;


import React from 'react'

const Reset = () => {
  return (
    <div class="reset-form">
    <h2>Reset Password</h2>
    <form id="form" method="post" action="">
        <label  for="password">New Password:</label>
        <input type="password" id="newPassword" name="password" required/>

        <label for="password2">Confirm Password:</label>
        <input type="password" id="confirmPassword" name="password2" required/>

        <input type="submit" value="Reset Password"/>
    </form>
</div>
  )
}

export default Reset
