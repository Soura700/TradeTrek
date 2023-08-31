import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/authContext";
import styles from "./cart.module.css";
import axios from "axios";
import { Link } from "react-router-dom";

const Cart = () => {
  const { isLoggedIn, checkAuthentication } = useAuth();

  const [cartData, setCartData] = useState([]);

  const [cookie, setCookie] = useState(null);

  console.log(cartData);

  var count = 0;

  const activeProducts = cartData.filter(
    (slide) => slide.is_active === 1 && (count = count + 1)
  );

  console.log("Count" + count);
  console.log(activeProducts);

  const handleQuantityChange = (index, newQuantity) => {
    const updatedCartData = [...cartData];
    updatedCartData[index].total = newQuantity;
    setCartData(updatedCartData);
  };

  useEffect(() => {
    //Calling the function when first render happens of the app...to update the isLoggeid from false to true..by checking the condition.
    checkAuthentication(); // Call this when the component mounts
  }, []);

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

        const newData = data.map((product) => {
          const imagesArray = JSON.parse(product.images);
          return {
            ...product,
            images: imagesArray,
          };
        });

        setCartData(newData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    fetchCartProducts();
  }, []);

  const checkProduct = async (id) => {
    const product = await axios.get(
      "http://localhost:5000/api/product/singleProduct/" + id
    );

    const data = product.data;

    const countProduct = data[0].countInStock;

    return countProduct;
  };

  const updateCartItem = async (productId, newQuantity) => {
    alert("Clled 1111");
    const cookie = await fetch("http://localhost:5000/api/auth/check-cookie", {
      method: "GET",
      credentials: "include",
    });
    const cookieData = await cookie.json();

    // const userId = /* Get the user ID */; // You need to replace this with the actual user ID

    try {
      const response = await axios.put(
        "http://localhost:5000/api/cart/update_cart/" + cookieData,
        {
          product_id: productId,
          quantity: newQuantity,
        }
      );

      // Handle the response as needed
    } catch (error) {
      console.error("Error updating cart item:", error);
      // Handle error
    }
  };

  return (
    <>
      <div className="heading" style={{ marginLeft: "10px" }}>
        <h1>Checkout</h1>
      </div>

      <div className={styles["liton__shoping-cart-area"]}>
        <div className={styles["container"]}>
          <div className={styles["row"]}>
            <div className={styles["col-lg-12"]}>
              <div className={styles["shoping-cart-inner"]}>
                <div className={styles["shoping-cart-table"]}>
                  <table className={styles["table"]}>
                    <tbody>
                      {count > 0 ? (
                        activeProducts.map((slide, i) => (
                          // quantity = slide.total,
                          <tr>
                            <td className={styles["cart-product-remove"]}>
                              <a href="#">x</a>
                            </td>
                            <td className={styles["cart-product-image"]}>
                              <a
                                href={`/singleProduct/${slide.p_id}/${slide.productName}`}
                              >
                                <img
                                  src={`http://localhost:5000/${slide.images[0]}`}
                                  alt=""
                                  key={i}
                                />
                              </a>
                            </td>
                            <td className={styles["cart-product-info"]}>
                              <h4>
                                <a href="product-details.html">
                                  {slide.productName}
                                </a>
                              </h4>
                            </td>
                            <td className={styles["cart-product-price"]}>
                              ${slide.totalPrice}
                            </td>
                            <td className={styles["cart-product-quantity"]}>
                              <div className={styles["cart-plus-minus"]}>
                                <button
                                  onClick={
                                    async () => {
                                      const isProductAvailable =
                                        await checkProduct(slide.p_id);
                                      if (isProductAvailable > slide.total) {
                                        const newQuantity = slide.total + 1;

                                        handleQuantityChange(
                                          i,
                                          slide.total + 1
                                        );
                                        updateCartItem(slide.p_id, newQuantity);
                                      } else {
                                        alert("No More Product Available");
                                      }
                                    }

                                    // handleQuantityChange( i , slide.total + 1)}
                                  }
                                  type="button"
                                  className={styles["cart-plus"]}
                                  data-product-id="1"
                                >
                                  +
                                </button>
                                <input
                                  type="text"
                                  value={slide.total}
                                  name="qtybutton"
                                  className={styles["cart-plus-minus-box"]}
                                />
                                <button
                                  onClick={() =>
                                    handleQuantityChange(
                                      i,
                                      Math.max(0, slide.total - 1),
                                      updateCartItem(
                                        slide.p_id,
                                        slide.total - 1
                                      )
                                    )
                                  }
                                  type="button"
                                  className={styles["cart-minus"]}
                                  data-product-id="1"
                                >
                                  -
                                </button>
                              </div>
                            </td>
                            <td className={styles["cart-product-subtotal"]}>
                              $200.00
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="6" style={{ textAlign: "center" }}>
                            Cart Is Empty
                          </td>
                        </tr>
                      )}
                      {/* {cartData.map((slide, i) => (
                        // quantity = slide.total,
                        <tr>
                          <td className={styles["cart-product-remove"]}>
                            <a href="#">x</a>
                          </td>
                          <td className={styles["cart-product-image"]}>
                            <a href={`/singleProduct/${slide.p_id}/${slide.productName}`}>
                              <img src={`http://localhost:5000/${slide.images[0]}`} alt="" key={i} />
                            </a>
                          </td>
                          <td className={styles["cart-product-info"]}>
                            <h4>
                              <a href="product-details.html">{slide.productName}</a>
                            </h4>
                          </td>
                          <td className={styles["cart-product-price"]}>${slide.totalPrice}</td>
                          <td className={styles["cart-product-quantity"]}>
                            <div className={styles["cart-plus-minus"]}>

                              <button onClick={ async () => {

                                  const isProductAvailable= await checkProduct(slide.p_id);
                                  if(isProductAvailable > slide.total){

                                    const newQuantity = slide.total + 1;
                                    
                                    handleQuantityChange( i , slide.total + 1);
                                    updateCartItem(slide.p_id , newQuantity )
                                  }
                                    
                                    else{
                                      alert("No More Product Available")
                                    }

                                  }

                                  // handleQuantityChange( i , slide.total + 1)}
                              }
                                type="button"
                                className={styles["cart-plus"]}
                                data-product-id="1"
                              >
                                +
                              </button>
                              <input
                                type="text"
                                value={slide.total}
                                name="qtybutton"
                                className={styles["cart-plus-minus-box"]}
                              />
                              <button onClick={() => handleQuantityChange(i, Math.max(0, slide.total - 1),updateCartItem(slide.p_id , slide.total - 1 ))}
                                type="button"
                                className={styles["cart-minus"]}
                                data-product-id="1"
                              > 
                                -
                              </button>
                            </div>
                          </td>
                          <td className={styles["cart-product-subtotal"]}>
                            $200.00
                          </td>
                        </tr>
                      ))} */}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
          <div className={styles["row"]}>
            <div className={styles["col-lg-12"]}>
              <div className={styles["cart-subtotal-table"]}>
                <h4>Cart Subtotal</h4>
                <table className={styles["table"]}>
                  <tbody>
                    {count > 0 ? (
                      cartData.map((slide, i) => (
                        // alert(typeof (slide.totalPrice));
                        <>
                          <tr>
                            <td>Cart Subtotal</td>
                            <td>${slide.totalPrice}</td>
                          </tr>
                          <tr>
                            <td>Shipping and Handling</td>
                            <td>$15.00</td>
                          </tr>
                          <tr>
                            <td>VAT</td>
                            <td>$00.00</td>
                          </tr>
                          <tr>
                            <td>
                              <strong>Order Total</strong>
                            </td>
                            <td>
                              <strong>${15 + +slide.totalPrice}</strong>
                            </td>
                          </tr>
                        </>
                      ))
                    ) : (
                      // )}
                      <tr>
                        <td colSpan="6" style={{ textAlign: "center" }}>
                          Cart Is Empty
                        </td>
                      </tr>
                    )}
                    {/* {cartData.map((slide, i) => (
                      // alert(typeof (slide.totalPrice));
                      <>
                        <tr>
                          <td>Cart Subtotal</td>
                          <td>${slide.totalPrice}</td>
                        </tr>
                        <tr>
                          <td>Shipping and Handling</td>
                          <td>$15.00</td>
                        </tr>
                        <tr>
                          <td>VAT</td>
                          <td>$00.00</td>
                        </tr>
                        <tr>
                          <td>
                            <strong>Order Total</strong>
                          </td>
                          <td>
                            <strong>${15 + +slide.totalPrice}</strong>
                          </td>
                        </tr>
                      </>
                    ))} */}
                  </tbody>
                </table>

                <div className={styles["btn-wrapper"]}>
                  {count > 0 ? (
                      <Link
                      // href="/checkout/${}"/singleProduct/${slide.p_id}/${slide.productName}
                      to={`/checkout/${cookie}`}
                      className={styles["theme-btn-1 btn btn-effect-1"]}
                    >
                      Proceed to checkout
                    </Link>
                  ):(
                    <Link
                    // href="/checkout/${}"/singleProduct/${slide.p_id}/${slide.productName}
                    to={"/"}
                    className={styles["theme-btn-1 btn btn-effect-1"]}
                  >
                    Proceed to checkout
                  </Link>
                  )}
                  {/* // <Link
                  //   // href="/checkout/${}"/singleProduct/${slide.p_id}/${slide.productName}
                  //   to={`/checkout/${cookie}`}
                  //   className={styles["theme-btn-1 btn btn-effect-1"]}
                  // >
                  //   Proceed to checkout
                  // </Link> */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Cart;
