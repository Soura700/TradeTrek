import React from "react";
import "./header.css";
import Logo from "../../assets/logo.png";
import { CgShoppingBag } from "react-icons/cg";

const Header = () => {
  return (
    <div className="container">
      <div className="logo">
        <img className="img" src={Logo}></img>
        <span className="name">Amazon</span>
      </div>

      <div className="right-side">
        <div className="menu">
          <ul className="menu">
            <li className="">Collection</li>
            <li className="">Brands</li>
            <li className="">Blogs</li>
            <li className="">Sales</li>
            <li className="menu-items">Contact Us</li>
          </ul>
        </div>

        <input type="text" placeholder="Search" className="search" />
        <CgShoppingBag className="cart" />
      </div>
    </div>
  );
};

export default Header;
