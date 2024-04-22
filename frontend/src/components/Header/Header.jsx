import React, { useState, useEffect , useRef } from "react";
import css from "./header.module.css";
import Logo from "../../assets/logo.png";
import { CgEnter, CgShoppingBag } from "react-icons/cg";
import { GoArrowDownRight } from "react-icons/go";
import { Link } from "react-router-dom";
import { io } from "socket.io-client";
import axios from "axios";
import { toast } from "react-toastify";

const Header = ({ value  , isSidebarOpen }) => {
  var count = 0;
  // var totalPrice = 0;
  const activeCartProduct = value.filter(
    (slide) => slide.is_active === 1 && (count = count + 1)
  );

  const [ShowMenu, setShowMenu] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [cookie, setCookie] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [activeProducts, setActiveProducts] = useState([]);
  var [totalPrice, setTotalPrice] = useState(0);

  const [showSuggestions, setShowSuggestions] = useState(false);
  const [socket, setSocket] = useState(null); //For setting the socket connection
  const [orders, setOrders] = useState([]);
  const [showOrders, setShowOrders] = useState(false);
  

  const toggleMenu = () => {
    setShowMenu((ShowMenu) => !ShowMenu);
  };

  const toggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };

  

  useEffect(() => {
    const newSocket = io("http://localhost:8000");
    setSocket(newSocket);
    return () => {
      newSocket.disconnect();
    };
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
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    const fetchOrders = async () => {
      try {
        console.log(cookie);
        const response = await axios.get(
          "http://localhost:5000/api/order/get_order/" + cookie
        );
        const data = response.data;
        setOrders(data);
      } catch (error) {
        console.log("error:" + error);
      }
    };

    fetchCartProducts();
    fetchOrders();
    setActiveProducts(activeCartProduct);
  }, [cookie]);

  useEffect(() => {
    if (socket) {
      socket.on(
        "create_cart",
        async ({ product_id, cartItemCount, user_id, total_Price }) => {
          alert("Called The create socket part");
          // Fetch the product details based on product_id
          const existingProductIndex = activeProducts.findIndex(
            (product) => product.p_id === product_id
          );
          if (existingProductIndex !== -1) {
            const updatedActiveProducts = [...activeProducts];
            updatedActiveProducts[existingProductIndex].total += cartItemCount;
            updatedActiveProducts[existingProductIndex].totalPrice =
              (updatedActiveProducts[existingProductIndex].totalPrice *
                updatedActiveProducts[existingProductIndex].total +
                total_Price * cartItemCount) /
              updatedActiveProducts[existingProductIndex].total;
            setActiveProducts(updatedActiveProducts);
          } else {
            try {
              const response = await fetch(
                `http://localhost:5000/api/product/singleProduct/${product_id}`
              );
              const productDetails = await response.json();
              const imagesArray = JSON.parse(productDetails[0].images);
              const newProduct = {
                p_id: product_id,
                productName: productDetails[0].productName,
                price: productDetails[0].price,
                images: imagesArray,
                total: cartItemCount,
                totalPrice: productDetails[0].price * cartItemCount,
              };
              console.log("New Product");
              console.log(newProduct);
              // Update the state to include the new product
              setActiveProducts([newProduct, ...activeProducts]);
            } catch (error) {
              console.error("Error fetching product details:", error);
            }
          }
        }
      );

      socket.on(
        "update_cart",
        async ({ product_id, cartItemCount, user_id, total_Price }) => {
          alert("Called the Update Socket part");
          alert(product_id);
          console.log("Active Products");
          console.log(activeProducts);
          // Fetch the product details based on product_id
          const existingProductIndex = activeProducts.findIndex(
            (product) => parseInt(product.p_id) === parseInt(product_id)
          );
          alert(existingProductIndex);
          if (existingProductIndex !== -1) {
            alert("Exist");
            // let newTotalPrice = 0;
            const updatedActiveProducts = [...activeProducts];
            updatedActiveProducts[existingProductIndex].total += cartItemCount;
            setActiveProducts(updatedActiveProducts);
          } else {
            try {
              const response = await fetch(
                `http://localhost:5000/api/product/singleProduct/${product_id}`
              );
              const productDetails = await response.json();

              const imagesArray = JSON.parse(productDetails[0].images);

              const newProduct = {
                p_id: product_id,
                productName: productDetails[0].productName,
                // totalPrice: productDetails[0].price,
                price: productDetails[0].price,
                images: imagesArray,
                total: cartItemCount,
                totalPrice: productDetails[0].price * cartItemCount,
              };
              // Update the state to include the new product
              setActiveProducts([newProduct, ...activeProducts]);
            } catch (error) {
              console.error("Error fetching product details:", error);
            }
          }
        }
      );

      socket.on("delete_cart", async ({ user_id, product_id }) => {
        const cookie = await fetch(
          "http://localhost:5000/api/auth/check-cookie",
          {
            method: "GET",
            credentials: "include",
          }
        );
        const cookieData = await cookie.json();
        if (cookieData == user_id) {
          const productIndex = activeCartProduct.findIndex(
            (product) => product.p_id == product_id
          );
          if (productIndex !== -1) {
            // Create a copy of the cartData array
            const updatedCartData = [...activeProducts];
            // Remove the product from the array
            updatedCartData.splice(productIndex, 1);
            // Update the cartData state with the updated array
            setActiveProducts(updatedCartData);
          }
        }
      });
    }

    return () => {
      if (socket) {
        socket.off("create_cart");
        socket.off("update_cart");
      }
    };
  }, [socket, activeProducts]);

  useEffect(() => {
    // Calculate the total price whenever activeProducts changes
    let totalPrice = 0;
    activeProducts.forEach((product) => {
      totalPrice += parseFloat(product.price * product.total);
    });
    setTotalPrice(totalPrice);
  }, [activeProducts]);

  const handleInputChange = (event) => {
    setSearchTerm(event.target.value);
  };

  // Define a function to fetch product details by ID
  const fetchProductDetails = async (user_id) => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/cart/get/cart/" + user_id
      );
      const productDetails = await response.json();

      const newData = productDetails.map((product) => {
        const imagesArray = JSON.parse(product.images);
        return {
          ...product,
          images: imagesArray,
        };
      });
      return newData;
    } catch (error) {
      console.log(error);
      throw new Error("Error fetching product details");
    }
  };

  const handleKeyPress = async (event) => {
    if (event.key === "Enter") {
      try {
        const response = await fetch(
          `http://localhost:5000/api/product/search/${searchTerm}`
        );
        const suggestionsData = await response.json();
        setSuggestions(suggestionsData);
        setShowSuggestions(true);
      } catch (error) {
        console.log("ERROR FETCHING DATA" + error);
      }
      // handleSearch();
    }
  };

  const handleSearch = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/product/search/${searchTerm}`
      );
      const searchData = await response.json();
      // Process the searchData as needed
      console.log(searchData);
    } catch (error) {
      console.error("Error searching:", error);
    }
  };

  const handleSuggestionClick = async () => {
    setShowSuggestions(false);
    setSearchTerm("");
  };

  // Display orders on click
  const handleTrackClick = () => {
    if(orders.length <=0){
      toast.error("No Orders to track")
    }else{
      setShowOrders(!showOrders);
    }
    // setShowOrders(!showOrders);
  };


  // Hide orders on clicking anywhere
  const handleClickOutside = (event) => {
    if (ref.current && !ref.current.contains(event.target)) {
      setShowOrders(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const ref = useRef(null);


  var totalCartItem = 0;
  // var totalPrice = 0;

  // Calculating the total cart item
  for (var i = 0; i < value.length; i++) {
    totalCartItem = totalCartItem + value[i].total;
  }

  // Calculating the total
  // for (var i = 0; i < value.length; i++) {
  //   console.log(typeof value[i].totalPrice);
  //   totalPrice = totalPrice + +value[i].totalPrice;
  // }

  return (
    <div className={css.container}>
      <div className={css.logo}>
        <img src={Logo} alt="" />
        <span>amazon</span>
      </div>

      <div className={css.right}>
        <div className={css.bars} onClick={toggleMenu}>
          <GoArrowDownRight />
        </div>
        <ul
          className={css.menu}
          style={{ display: ShowMenu ? "inherit" : "none" }}
        >
          <li>Collections</li>
          {/* <li>Brands</li> */}
          <li>New</li>
          <li>Sales</li>
          <li>ENG</li>

          {/* <li onClick={handleTrackClick}>
            Track
            {showOrders && (
              <div className={css.suggestion_box} ref={ref}>
                <h5 className={css.ordersHeading} style={{marginTop:'1px', marginLeft:"1px"}}>Track Orders</h5>

                <div className={css.orderList}>
                  {orders.map(
                    (order) => (
                      (
                        <Link
                          key={order.order_id}
                          to={`/singleOrder/${cookie}/${order.order_id}`} // Replace with your order details page
                          className={css.orderItem}
                          style={{marginTop:'1px', marginLeft:"1px"}}
                        >
                          {order.productName}
                        </Link>
                      )
                    )
                  )}
                </div>
              </div>
            )}
          </li> */}
        </ul>

        <div onClick={handleTrackClick} style={{marginTop:"15px"}}>
            Track
            {showOrders && (
              <div className={css.suggestion_box} ref={ref}>
                <h5 className={css.ordersHeading} style={{marginTop:'1px', marginLeft:"1px"}}>Track Orders</h5>

                <div className={css.orderList}>
                  {orders.map(
                    (order) => (
                      (
                        <Link
                          key={order.order_id}
                          to={`/singleOrder/${cookie}/${order.order_id}`} // Replace with your order details page
                          className={css.orderItem}
                          style={{marginTop:'1px', marginLeft:"1px"}}
                        >
                          {order.productName}
                        </Link>
                      )
                    )
                  )}
                </div>
              </div>
            )}
          </div>

        <div className={css.searchContainer}>
          <input
            type="text"
            placeholder="Search"
            value={searchTerm}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            className={css.search}
          ></input>

          {suggestions.length > 0 && (
            <div
              className={css.suggestion_box}
              style={{ display: showSuggestions ? "block" : "none" }}
            >
              {suggestions.map((suggestion) => (
                <Link
                  key={suggestion.id}
                  onClick={handleSuggestionClick}
                  to={`/singleProduct/${suggestion.p_id}/${suggestion.productName}`}
                >
                  <div key={suggestion.id}>{suggestion.productName}</div>
                </Link>
              ))}
            </div>
          )}
        </div>

        <CgShoppingBag className={css.cart} onClick={toggleSidebar} />
      </div>
      <div className={`${css.sidebar} ${sidebarOpen || isSidebarOpen ? css.sidebarOpen : ""}`}>
        <div className={css.miniCart}>
          <div className={css.miniCartHead}>
            <span className={css.miniCartTitle}>Cart</span>
            <button className={css.miniCartClose} onClick={toggleSidebar}>
              <span>&times;</span>
            </button>
          </div>

          <div className={`${css.miniCartProductArea} ${css.ltn__scrollbar}`}>
            {activeProducts.length > 0 ? (
              activeProducts.map((slide, index) => {
                return (
                  <div className={`${css.miniCartItem} clearfix`}>
                    <div className={css.miniCartImg}>
                      <a href="#">
                        <img
                          src={`http://localhost:5000/${slide.images[0]}`}
                          alt="Image"
                        />
                      </a>
                      <span className={css.miniCartItemDelete}>
                        <i className={css.iconCancel}></i>
                      </span>
                    </div>
                    <div className={css.miniCartInfo}>
                      <h6>
                        <a href="#">{slide.productName}</a>
                      </h6>
                      <span className={css.miniCartQuantity}>
                        {slide.total} x ${slide.price}
                      </span>
                    </div>
                  </div>
                );
              })
            ) : (
              <h5 style={{ textAlign: "center" }}>Cart Is Empty</h5>
            )}
          </div>

          {activeProducts.length > 0 ? (
            <div className={css.miniCartFooter}>
              <div className={css.miniCartSubTotal}>
                <h5>
                  Subtotal: <span>${totalPrice}</span>
                </h5>
              </div>
              <div className={css.btnWrapper}>
                <a
                  href="/cart"
                  className={`${css.themeBtn1} ${css.btn} ${css.btnEffect1}`}
                >
                  View Cart
                </a>
                <a
                  href={`checkout/${cookie}`}
                  className={`${css.themeBtn2} ${css.btn} ${css.btnEffect2}`}
                >
                  Checkout
                </a>
              </div>
              <p>Free Shipping on All Orders Over $100!</p>
            </div>
          ) : (
            ""
          )}
        </div>
      </div>
    </div>
  );
};

export default Header;
