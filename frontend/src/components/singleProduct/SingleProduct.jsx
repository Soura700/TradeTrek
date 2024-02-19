import React, { useEffect, useState } from "react";

import { Link, useParams } from "react-router-dom";

import { useAuth } from "../../context/authContext";

import axios from "axios";

import "./singleProduct.css";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const SingleProduct = () => {
  const { isLoggedIn, checkAuthentication } = useAuth();

  const { id, productName } = useParams();

  const [singleProduct, setSingleProduct] = useState([]);
  const [img, setImg] = useState(null);
  const [quantity, setQuantity] = useState(1);

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
    // alert("Hello");
    if (quantity < singleProduct[0].countInStock) {
      setQuantity(quantity + 1);
    }
    // setQuantity(quantity + 1);
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

  return (
    <div class="card-wrapper">
      <div class="card_single">
        <div class="product-imgs">
          <div class="img-display">
            <div class="img-showcase">
              {img && <img src={img} alt="Selected shoe image" />}
              {/* {singleProduct.map((slide, i) => (
                <>
                  <img
                    src={`http://localhost:5000/${slide.images[0]}`}
                    alt="shoe image"
                  />
                  <img
                    src={`http://localhost:5000/${slide.images[1]}`}
                    alt="shoe image"
                  />
                  <img
                    src={`http://localhost:5000/${slide.images[2]}`}
                    alt="shoe image"
                  />
                  <img
                    src={`http://localhost:5000/${slide.images[2]}`}
                    alt="shoe image"
                  />
                </>
              ))} */}
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
              <div class="product-rating">
                <i class="fas fa-star"></i>
                <i class="fas fa-star"></i>
                <i class="fas fa-star"></i>
                <i class="fas fa-star"></i>
                <i class="fas fa-star-half-alt"></i>
                <span>4.7(21)</span>
              </div>
              <div class="product-price">
                <p class="last-price">
                  Old Price: <span>${slide.price}</span>
                </p>
                <p class="new-price">
                  New Price: <span>$249.00 (5%)</span>
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
                  value={quantity}
                  onClick={handleCount}
                />
                {/* {slide.countInStock ? (
                  // <button type="button" class="btn" onClick={{handleCart,notify}} >Add To Cart 
                  <button type="button" className="btn_single" onClick={()=>{ handleCart() ;  notify() ;} }>Add To Cart 

                    {isLoggedIn ? (
                      <>
                        <ToastContainer/>
                        <i class="fas fa-shopping-cart"></i>
                      </>
                    ) : (
                      <>
                        
                        <Link to="/login">Add to Cart</Link>
                      </>
                      // console.log("Done")
                    )
                    }
                  </button>
                ) : (
                  " "
                )} */}

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
    </div>
  );
};

export default SingleProduct;
