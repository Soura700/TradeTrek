import React, { useEffect, useState } from "react";

import { useParams } from "react-router-dom";

import axios from "axios";

import "./singleProduct.css";

const SingleProduct = () => {
  const { id } = useParams();

  const [singleProduct, setSingleProduct] = useState([]);
  const [img, setImg] = useState(null);
  const [ quantity , setQuantity ] = useState(1);

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

  const handleImg = (imageUrl) => { //On clickng the img in the select image div the image will be set to the clickd image url in the img-showcase section
    
    setImg(imageUrl);
  };


  const handleCount = () => { //On clickng the img in the select image div the image will be set to the clickd image url in the img-showcase section
    
    alert("Hello")
    setQuantity(quantity + 1);
  };

  return (
    <div class="card-wrapper">
      <div class="card">
        <div class="product-imgs">
          <div class="img-display">
            <div class="img-showcase">
              {img && (
              <img src={img} alt="Selected shoe image" />
            )}
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
          {singleProduct.map(
            (slide, i) => (
   
              (
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
                    <h2>about this item: </h2>
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
                          {slide.countInStock
                            ? "In Stock"
                            : "Out Of Stock"}{" "}
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
                    <input type="number" min="1" value={quantity}  onClick={handleCount}/>
                    {slide.countInStock ? (
                      <button type="button" class="btn">
                        Add to Cart
                        <i class="fas fa-shopping-cart"></i>
                      </button>
                    ) : (
                      " "
                    )}
                    {/* <button type="button" class="btn">

                Add to Cart
                 <i class="fas fa-shopping-cart"></i>
              </button> */}
                    <button type="button" class="btn">
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
              )
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default SingleProduct;
