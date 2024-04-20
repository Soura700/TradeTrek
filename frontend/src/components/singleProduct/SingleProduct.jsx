import React, { useEffect, useState } from "react";

import { Link, useParams } from "react-router-dom";

import { useAuth } from "../../context/authContext";

import axios from "axios";

import "./singleProduct.css";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Review from "../Reviews/Reviews";

const SingleProduct = () => {
  const { isLoggedIn, checkAuthentication } = useAuth();

  const { id, productName } = useParams();

  const [singleProduct, setSingleProduct] = useState([]);
  const [img, setImg] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");
  const [averageRating, setAverageRating] = useState(0);
  const [userId, setUserId] = useState(null);
  const [maxCount,setMaxCount] = useState(null);

  useEffect(() => {
    // Function to call API when component mounts
    async function callApi() {
      await checkAuthentication();
      try {
        const cookie = await fetch(
          "http://localhost:5000/api/auth/check-cookie",
          {
            method: "GET",
            credentials: "include",
          }
        );
        const cookieData = await cookie.json();
        setUserId(cookieData);

        // Make API call to track user visit
        await axios.post("http://localhost:5000/api/interaction/logUserView", {
          user_id: cookieData,
          product_id: id,
        });
      } catch (error) {
        console.error("Error calling API:", error);
      }
    }

    async function averageRatingFunc() {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/rating/average_rating/" + id
        );
        const data = response.data;
        setAverageRating(data.averageRating);
      } catch (error) {
        console.error("Error calling API:", error);
      }
    }

    async function checkCart() {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/cart/get/cart/${userId}/${id}`
        );
        const data = response.data;
        if(data.length >0){
          setMaxCount(data[0].total);
        }else{
          setMaxCount(0)
        }
      } catch (error) {
        console.log("Error in fetching the:" + error);
      }
    }

    callApi(); // Call the function when component mounts
    averageRatingFunc();
    checkCart();
  }, [isLoggedIn, checkAuthentication, id , userId]);

  useEffect(() => {
    async function fetchSliderProducts() {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/product/singleProduct/" + id
        );

        const data = response.data;

        const imagesArray = JSON.parse(data[0].images);

        data[0].images = imagesArray;

        setSingleProduct(data);

        setImg(`http://localhost:5000/${data[0].images[0]}`); //Setting the default image
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    fetchSliderProducts();
  }, []);

  // useEffect(() => {//Calling the function when first render happens of the app...to update the isLoggeid from false to true..by checking the condition.
  //   checkAuthentication(); // Call this when the component mounts

  // }, []);

  const handleImg = (imageUrl) => {
    //On clickng the img in the select image div the image will be set to the clickd image url in the img-showcase section
    setImg(imageUrl);
  };

  const handleCount = () => {
    alert("Hello");
    // if (quantity < singleProduct[0].countInStock) {
    //   setQuantity(quantity + 1);
    // }
    // setQuantity(quantity + 1);
  };

  const handleDecreaseCount = () => {
    alert("Hello 2");
  };

  const handleCart = async (event) => {
    //Adding product to the cart

    try {
      const response = await fetch(
        "http://localhost:5000/api/auth/check-cookie",
        {
          method: "GET",
          credentials: "include",
        }
      );

      const product = await axios.get(
        "http://localhost:5000/api/product/singleProduct/" + id
      );

      const product_data = product.data;

      var product_price = product_data[0].price;

      alert(product_price);

      const data = await response.json();

      const data1 = {
        user_id: data,
        product_id: id,
        cartItemCount: quantity,
        totalPrice: product_price * quantity,
        // is_active:1
      };

      const cartRes = await axios.post(
        "http://localhost:5000/api/cart/add-to-cart",
        data1
      );
    } catch (error) {
      console.error("Cart error:", error);
      // Handle error
    }
  };

  const notify = () => toast("Items are added to the cart"); //Toastify

  const handleRating = (value) => {
    // Toggle the color of the clicked star and stars to its right
    if (value <= rating) {
      // If the clicked star is already selected, deselect it and stars to its right
      setRating(value - 1);
    } else {
      // If the clicked star is not selected, select it and stars to its right
      setRating(value);
    }
  };

  const handleReviewChange = (event) => {
    setReview(event.target.value);
  };

  const handleSubmitReview = async () => {
    alert("Called");
    try {
      const response = await fetch(
        "http://localhost:5000/api/auth/check-cookie",
        {
          method: "GET",
          credentials: "include",
        }
      );

      const data = await response.json();

      const rating_response = await axios.post(
        "http://localhost:5000/api/rating/set_ratings",
        {
          user_id: data,
          product_id: id,
          ratings: rating, // Assuming rating is the variable storing the user's rating
        }
      );
      // Handle success response
      console.log(rating_response); // Assuming the API returns a message
    } catch (error) {
      console.error("Error submitting review:", error);
      // Handle error
      console.log("Error" + error);
    }
  };

  return (
    <>
      <div class="card-wrapper">
        <div class="card_single">
          <div class="product-imgs">
            <div class="img-display">
              <div class="img-showcase">
                {img && <img src={img} alt="Selected shoe image" />}
              </div>
            </div>
            <div class="img-select">
              {singleProduct.map((slide, i) => (
                <>
                  <div class="img-item">
                    <a
                      href="#"
                      className-id={i + 1}
                      onClick={() =>
                        handleImg(`http://localhost:5000/${slide.images[0]}`)
                      }
                    >
                      <img
                        src={`http://localhost:5000/${slide.images[0]}`}
                        alt="shoe image"
                      />
                    </a>
                  </div>
                  <div class="img-item">
                    <a
                      href="#"
                      className-id={i + 1}
                      onClick={() =>
                        handleImg(`http://localhost:5000/${slide.images[1]}`)
                      }
                    >
                      <img
                        src={`http://localhost:5000/${slide.images[1]}`}
                        alt="shoe image"
                      />
                    </a>
                  </div>
                  <div class="img-item">
                    <a
                      href="#"
                      className-id={i + 1}
                      onClick={() =>
                        handleImg(`http://localhost:5000/${slide.images[2]}`)
                      }
                    >
                      <img
                        src={`http://localhost:5000/${slide.images[2]}`}
                        // src="https://fadzrinmadu.github.io/hosted-assets/product-detail-page-design-with-image-slider-html-css-and-javascript/shoe_3.jpg"
                        alt="shoe image"
                      />
                    </a>
                  </div>
                  <div class="img-item">
                    <a
                      href="#"
                      className-id={i + 1}
                      onClick={() =>
                        handleImg(`http://localhost:5000/${slide.images[2]}`)
                      }
                    >
                      <img
                        src={`http://localhost:5000/${slide.images[2]}`}
                        // src="https://fadzrinmadu.github.io/hosted-assets/product-detail-page-design-with-image-slider-html-css-and-javascript/shoe_4.jpg"
                        alt="shoe image"
                      />
                    </a>
                  </div>
                </>
              ))}
            </div>
          </div>

          <div class="product-content">
            {singleProduct.map((slide, i) => (
              <>
                <h2 class="product-title">{slide.productName}</h2>
                <a href="#" class="product-link">
                  visit nike store
                </a>
                {/* <div class="product-rating">
                <i class="fas fa-star"></i>
                <i class="fas fa-star"></i>
                <i class="fas fa-star"></i>
                <i class="fas fa-star"></i>
                <i class="fas fa-star-half-alt"></i>
                <span>4.7(21)</span>
              </div> */}

                <div className="product-rating">
                  {averageRating === null ? (
                    <>
                      <i className="far fa-star"></i>
                      <i className="far fa-star"></i>
                      <i className="far fa-star"></i>
                      <i className="far fa-star"></i>
                      <i className="far fa-star"></i>
                      <span>No ratings yet</span>
                    </>
                  ) : (
                    <>
                      {[...Array(5)].map((_, index) => {
                        if (index < Math.floor(averageRating)) {
                          return <i key={index} className="fas fa-star"></i>; // Full star
                        } else if (
                          index === Math.floor(averageRating) &&
                          averageRating % 1 >= 0.5
                        ) {
                          return (
                            <i key={index} className="fas fa-star-half-alt"></i>
                          ); // Half star
                        } else {
                          return <i key={index} className="far fa-star"></i>; // Empty star
                        }
                      })}
                      <span>
                        {averageRating.toFixed(1)} ({singleProduct.length})
                      </span>
                    </>
                  )}
                </div>

                <div class="product-price">
                  <p class="last-price">
                    Old Price: <span>${slide.price}</span>
                  </p>
                  <p class="new-price">
                    New Price: <span>${slide.price} (5%)</span>
                  </p>
                </div>
                <div class="product-detail">
                  <h2 className="product-detail">about this item: </h2>
                  <p>{slide.product_description}</p>
                  {/* <p>
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Consequatur, perferendis eius. Dignissimos, labore suscipit. Unde.
              </p> */}
                  <ul>
                    <li>
                      Color: <span>Black</span>
                    </li>
                    <li>
                      Available:{" "}
                      <span>
                        {" "}
                        {slide.countInStock ? "In Stock" : "Out Of Stock"}{" "}
                      </span>
                    </li>
                    <li>
                      Category: <span>Shoes</span>
                    </li>
                    <li>
                      Shipping Area: <span>All over the world</span>
                    </li>
                    <li>
                      Shipping Fee: <span>Free</span>
                    </li>
                  </ul>
                </div>
                <div class="purchase-info">
                  <input
                    type="number"
                    min="1"
                    max={singleProduct[0].countInStock - maxCount}
                    value={quantity}
                    onChange={(e) => setQuantity(parseInt(e.target.value))}
                    // value={quantity}
                    // onClick={handleCount}
                  />

                  {/* <button type="button" onClick={handleDecreaseCount}>
                    -
                  </button>
                  <button type="button" onClick={handleCount}>
                    +
                  </button> */}

                  {slide.countInStock > 0 && (
                    <button
                      type="button"
                      className="btn_single"
                      onClick={() => {
                        if (isLoggedIn) {
                          handleCart();
                          notify();
                        } else {
                          // Redirect to login page
                          window.location.href = "/login";
                        }
                      }}
                    >
                      <i className="fas fa-shopping-cart"></i>
                      Add To Cart
                      <ToastContainer />
                      {/* <i className="fas fa-shopping-cart"></i> */}
                    </button>
                  )}

                  <button type="button" class="btn_single">
                    Compare
                  </button>
                </div>
                <div class="social-links">
                  <p>Share At: </p>
                  <a href="#">
                    <i class="fab fa-facebook-f"></i>
                  </a>
                  <a href="#">
                    <i class="fab fa-twitter"></i>
                  </a>
                  <a href="#">
                    <i class="fab fa-instagram"></i>
                  </a>
                  <a href="#">
                    <i class="fab fa-whatsapp"></i>
                  </a>
                  <a href="#">
                    <i class="fab fa-pinterest"></i>
                  </a>
                </div>
              </>
            ))}
          </div>
        </div>
        {/* Review section */}
        <div className="review-section">
          <h3>Give a Review</h3>
          {/* Star rating */}
          <div className="star-rating">
            {[1, 2, 3, 4, 5].map((value) => (
              <i
                key={value}
                className={`fas fa-star ${value <= rating ? "active" : ""}`}
                onClick={() => handleRating(value)}
              ></i>
            ))}
          </div>
          {/* Review text area */}
          <textarea
            placeholder="Write your review here..."
            value={review}
            onChange={handleReviewChange}
          ></textarea>
          {/* Submit button */}
          <button onClick={handleSubmitReview}>Submit Review</button>
        </div>
      </div>
      <Review />
    </>
  );
};

export default SingleProduct;
