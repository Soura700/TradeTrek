import React from "react";
import "./footer.css";

import Logo from "../../assets/logo.png";
import {
  InboxIcon,
  PhoneIcon,
  LocationMarkerIcon,
  LoginIcon,
  UsersIcon,
  LinkIcon,
} from "@heroicons/react/outline";

const Footer = () => {
  return (
    <div className="cFooterWrapper">
      <hr />

      <div className="cFooter">
        <div className="logo">
          <img src={Logo} alt="" />
          <span>amazon</span>
        </div>

        <div className="block">
          <div className="detail">
            <span>Contact Us</span>
            <span className="pngLine">
              <LocationMarkerIcon className="icon" />
              <span>111 north avenue Orlando, FL 32801</span>
            </span>

            <span className="pngLine">
              {" "}
              <PhoneIcon className="icon" />
              <a href="tel:352-306-4415">352-306-4415</a>
            </span>

            <span className="pngLine">
              <InboxIcon className="icon" />
              <a href="mailto:support@amazon.com ">support@amazon.com</a>
            </span>
          </div>
        </div>

        <div className="block">
          <div className="detail">
            <span>Account</span>
            <span className="pngLine">
              <LoginIcon className="icon" />
              Sign In
            </span>
          </div>
        </div>

        <div className="block">
          <div className="detail">
            <span>Company</span>
            <span className="pngLine">
              <UsersIcon className="icon" />
              <a href="/about">
                <p>About us</p>
              </a>
            </span>
          </div>
        </div>

        <div className="block forthBlock">
          <div className="detail">
            <span>Resources</span>
            <span className="pngLine">
              <LinkIcon className="icon" />
              <p>Safety Privacy & Terms</p>
            </span>
          </div>
        </div>
      </div>

      <div className="copyRight">
        <span>Copyright ©2022 by Amazon, Inc.</span>
        <span>All rights reserved.</span>
      </div>
    </div>
  );
};

export default Footer;
