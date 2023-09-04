import React from "react";
import "./modal.css"; // Create a CSS file for styling the modal

const Modal = ({ isOpen, onClose }) => {
  if (!isOpen) {
    return null;
  }

  console.log(isOpen);
  alert(isOpen);

  return (
    // <div className="modal-overlay">
    //   <div className="modal">
    //     <h2>Forgot Password</h2>
    //     <p>Enter your email to reset your password.</p>
    //     <input type="email" placeholder="Email" />
    //     <button className="btn" onClick={onClose}>
    //       Close
    //     </button>
    //   </div>
    // </div>

    <div id="passwordModal" class="modal">
      <div class="modal-content">
        <span class="close">&times;</span>
        <h2>Forgot Password</h2>
        <form id="sendMailForm">
          {/* <!-- Your form fields here --> */}
          <label for="email">Email:</label>
          <input type="email" id="email" name="email" required />
          <input type="submit" value="Submit" />
          <button className="btn" onClick={onClose}>
            Close
          </button>
        </form>
      </div>
    </div>
  );
};

export default Modal;