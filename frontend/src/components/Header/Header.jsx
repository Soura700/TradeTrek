// import React from "react";
// import styles from "./header.module.css";
// import "./header.css"
// import Logo from "../../assets/logo.png";
// import { CgShoppingBag } from "react-icons/cg";

// const Header = () => {
//   return (
//     <div className="container">
//       <div className="logo">
//         <img className="img" src={Logo}></img>
//         <span className="name">Amazon</span>
//       </div>

//       <div className="right-side">
//         <div className="menu">
//           <ul className="menu">
//             <li className="">Collection</li>
//             <li className="">Brands</li>
//             <li className="">Blogs</li>
//             <li className="">Sales</li>
//             <li className="menu-items">Contact Us</li>
//           </ul>
//         </div>

//         <input type="text" placeholder="Search" className="search" />
//         <CgShoppingBag className="cart" />
//       </div>
//     </div>
//   );
// };

// export default Header;


import React from "react";
import styles from  "./header.module.css";
import Logo from "../../assets/logo.png";
import { CgShoppingBag } from "react-icons/cg";


const Header = () => {
  
  return (
    <div className={styles.container}>
      <div className={styles.logo}>
        <img className={styles.img} src={Logo}></img>
        <span className={styles.name}>Amazon</span>
      </div>

      <div className={styles.right_side}>
        <div className={styles.menu}>
          <ul className={styles.menu}>
            <li className={styles.menu_items}>Collection</li>
            <li className={styles.menu_items}>Brands</li>
            <li className={styles.menu_items}>Blogs</li>
            <li className={styles.menu_items}>Sales</li>
            <li className={styles.menu_items}>Contact Us</li>
          </ul>
        </div>

        <input type="text" placeholder="Search" className={styles.search} />
        <CgShoppingBag className={styles.cart} />
      </div>
    </div>
  );
};

export default Header;
