import React, { useEffect, useState } from 'react'

import axios from "axios"

import Hero from "../../components/Hero/Hero"

import Slider from "../../components/Slider/Slider"

import Testimonial from "../../components/Testimonials/Testimonials"

import Products from "../../components/Products/Products"
import Recommendation from '../../components/Recommendation/Recommendation'

const Home = ({toggleSidebar}) => {

  const [cartData, setCartData] = useState([]);
  const [cookie , setCookie] = useState(null);

  useEffect(() => {
    async function fetchCartProducts() {
      try {
        const cookie = await fetch(
          "http://localhost:5000/api/auth/check-cookie",
          {
            method: "GET",
            credentials: "include",
          }
        );
        const cookieData = await cookie.json();

        setCookie(cookieData);

        const cookieRes = await axios.get(
          "http://localhost:5000/api/cart/get/cart/" + cookieData
        );

        const data = cookieRes.data;

        const newData = data.map(product => {
          const imagesArray = JSON.parse(product.images);
          return {
            ...product,
            images: imagesArray
          };
        });



        setCartData(newData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    fetchCartProducts();
  }, []);



  return (
    <div>
      <Hero value={cartData} toggleSidebar={toggleSidebar} />
      <Slider/>
      <Products/> 
      <Recommendation/>
      <Testimonial/>
    </div>
  )
}

export default Home
