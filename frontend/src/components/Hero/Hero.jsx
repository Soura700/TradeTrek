import React from "react";
// import css from "./hero.css";
import css from "./Hero.module.css"
// import HeroImg from "../../assets/hero.png";
// import HeroImg from "../../assets/mainImage.png";
import HeroImg from "../../assets/demo woman.png";
import { RiShoppingBagFill } from "react-icons/ri";
import { BsArrowRight } from "react-icons/bs";
import { motion } from "framer-motion";

const Hero = ({value}) => {



  var totalCartItem = 0;
  for(var i = 0 ; i<value.length ; i++){
    totalCartItem = totalCartItem + value[i].total;
  }


  const transition = { duration: 3, type: "spring" };
  const mobile = window.innerWidth<=768? true:false;
  return (
    <div className={css.container}>

      <div className={css.h_sides}>
        <span className={css.text1}>Smart Electronic Gadget</span>

        <div className={css.text2}>
          <span>Trendy Collection</span>
          <span>
            Seedily say has suitable disposal and boy. Exercise joy man children
            rejoiced.
          </span>
        </div>
      </div>

      {/* main image with cirlce back */}
      <div className={css.wrapper}>
        <motion.div
          initial={{ bottom: !mobile && "2rem" }}
          whileInView={{ bottom: "-1rem" }}
          transition={transition}
          className={css.blueCircle}
        ></motion.div>
        <motion.img
          initial={{ bottom: !mobile && "-2rem" }}
          whileInView={{ bottom: "0rem" }}
          transition={transition}
          src={HeroImg}
          alt=""
          height={650}
          width={600}
        />
        <motion.div
          initial={{ right: !mobile && "4%" }}
          whileInView={{ right: !mobile && "2%" }}
          transition={transition}
          className={css.cart2}
        >
          <RiShoppingBagFill className="signup_offers"/>
          <div className={css.valueContainer}>
          {/* Value placed here */}
          <span className={css.value}>{totalCartItem}</span>
        </div>
          <div className={css.signup}>
            <span >Best Signup Offers</span>
            <div>
              <BsArrowRight />
            </div>
          </div>
        </motion.div>
      </div>

      {/* right side */}
      <div className={css.h_sides}>
        <div className={css.traffic}>
          <span>1.5m</span>
          <span>Monthly traffic</span>
        </div>

        <div className={css.customers}>
          <span>100k</span>
          <span>Happy Customers</span>
        </div>
      </div>
    </div>
  );
};

export default Hero;
