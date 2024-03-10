import React, { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import { Link } from "react-router-dom";
import axios from "axios";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

import "./recommendationSlider.css";

const Slider = () => {
  const [sliderProducts, setSliderProducts] = useState([]);

  useEffect(() => {
    async function fetchSliderProducts() {
      const cookie = await fetch(
        "http://localhost:5000/api/auth/check-cookie",
        {
          method: "GET",
          credentials: "include",
        }
      );
      const cookieData = await cookie.json();
      let user_id = parseInt(cookieData);

      try {
        const response = await axios.post(
          "http://localhost:5000/api/recommendations",
          {
            user_id: user_id,
          }
        );

        const data = response.data;

        const productIds = data.recommendations.recommendations;

        console.log("Recommendation Product's ids");
        console.log(productIds);

        const fetchedProducts = [];

        for (const productId of productIds) {
          const productResponse = await axios.get(
            `http://localhost:5000/api/product/singleProduct/${productId}`
          );
          fetchedProducts.push(productResponse.data);
        }

        console.log("fetchedProducts");
        console.log(fetchedProducts);

        setSliderProducts(fetchedProducts);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    fetchSliderProducts();
  }, []);

  return (
    <div className="s-container">
      <Swiper
        slidesPerView={3}
        spaceBetween={40}
        slidesPerGroup={1}
        loop={true}
        loopFillGroupWithBlank={true}
        navigation={true}
        modules={[Pagination, Navigation]}
        className="mySwiper"
        breakpoints={{
          640: {
            slidesPerView: 3,
          },
          0: {
            slidesPerView: 1,
          },
        }}
      >
        {sliderProducts.map((slide, i) => {
          // Parse the images string into an array
          const imagesArray = JSON.parse(slide[0].images);

          // Render the JSX elements
          return (
            <SwiperSlide key={i}>
              <div className="left-s">
                <div className="name">
                  <span>{slide[0].productName}</span>{" "}
                  {/* Display product name */}
                </div>
                <span>{slide[0].price}$</span> {/* Display product price */}
                <div>Shop Now</div>
                <Link
                  to={`/singleProduct/${slide[0].p_id}/${slide[0].productName}`}
                >
                  View Now
                </Link>{" "}
                {/* Link to view single product */}
              </div>
              {/* Loop through the images array and render each image */}
              <img
                  key={i}
                  src={`http://localhost:5000/${imagesArray[0]}`}
                  alt=""
                  className="img-p"
                />
              {/* {imagesArray.map((image, index) => (
                <img
                  key={index}
                  src={`http://localhost:5000/${image}`}
                  alt=""
                  className="img-p"
                />
              ))} */}
            </SwiperSlide>
          );
        })}
      </Swiper>
    </div>
  );
};

export default Slider;
