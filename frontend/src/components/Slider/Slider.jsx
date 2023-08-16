// import React from "react";
// // Import Swiper React components
// import {Swiper,SwiperSlide} from "swiper/react"
// import { Navigation, Pagination } from 'swiper/modules';
// // Import Swiper styles
// import "swiper/css";
// import "swiper/css/pagination";
// import "swiper/css/navigation";

// import "./slider.css";

// import { SliderProducts } from "../../data/products";

// const Slider = () => {
//   return (
//     <div className="s-container">
//       <Swiper
//         slidesPerView={3}
//         spaceBetween={40}
//         slidesPerGroup={1}
//         loop={true}
//         loopFillGroupWithBlank={true}
//         navigation={true}
//         modules={[Pagination, Navigation]}
//         className="mySwiper"
//         breakpoints={{
//           640:{
//             slidesPerView: 3
//           },
//           0: {
//             slidesPerView: 1
//           }
//         }}
//       >
//         {SliderProducts.map((slide, i) => (
//           <SwiperSlide>
//             <div className="left-s">
//               <div className="name">
//                 <span>{slide.name}</span>
//                 <span>{slide.detail}</span>
//               </div>
//               <span>{slide.price}$</span>
//               <div>Shop Now</div>
//             </div>

//             <img src={slide.img} alt="" className="img-p" />
//           </SwiperSlide>
//         ))}
//       </Swiper>
//     </div>
//   );
// };

// export default Slider;



import React, { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import { Link } from "react-router-dom";
import axios from "axios";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

import "./slider.css";

const Slider = () => {
  const [sliderProducts, setSliderProducts] = useState([]);

  useEffect(() => {
    async function fetchSliderProducts() {
      try {
        const response = await axios.get("http://localhost:5000/api/product/getProducts");

        const data = response.data;

        console.log(data)

        // const image
        // console.log(data.images[0])

        setSliderProducts(data);
        
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
            slidesPerView: 3
          },
          0: {
            slidesPerView: 1
          }
        }}
      >
        {sliderProducts.map((slide, i) => (
          console.log(slide.images[0]),
          console.log(sliderProducts),
          <SwiperSlide key={i}>
            <div className="left-s">
              <div className="name">
                <span>{slide.productName}</span>
                {/* <span>{slide.detail}</span> */}
              </div>
              <span>{slide.price}$</span>
              <div>Shop Now</div>
              <Link to={`/singleProduct/${slide.p_id}`}>View Now</Link>
            </div>
            <img src={`http://localhost:5000/${slide.images[0]}`} alt="" className="img-p" />
            {/* <img src={`../../../../backend/upload/slide.images[0]`} alt="" className="img-p" /> */}
            {/* <img src={"http://localhost:5000/'+slide.images[0]+'"} alt="" className="img-p" /> */}
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default Slider;

