import React, { useEffect, useState } from "react";
import "./checkout.css";
import axios from "axios";
import { useParams } from "react-router-dom";
import Swal from 'sweetalert2'
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Checkout = () => {
  const { userId } = useParams();

  const [data, setData] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0); // Initialize total price as 0

  const [country, setCountry] = useState("");
  const [address, setAddress] = useState("");
  const [landmark, setLandmark] = useState("");
  const [townCity, setTownCity] = useState("");
  const [state, setState] = useState("");
  const [zip, setZip] = useState("");
  const [userDetailsExist, setUserDetailsExist] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [existingAddresses, setExistingAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [showSelect, setShowSelect] = useState(false);

  useEffect(()=>{
    async function checkCart(){
      try {
        const cookie = await fetch(
          "http://localhost:5000/api/auth/check-cookie",
          {
            method: "GET",
            credentials: "include",
          }
        );
        const cookieData = await cookie.json();
        const res = await axios.get(
          "http://localhost:5000/api/cart/get/cart/" + cookieData
        );

        console.log("Response from the cart");
        console.log(res.data.length);

        if(res.data.length <= 0){
          const overlay = document.createElement("div");
          overlay.classList.add("overlay");
          document.body.appendChild(overlay);
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "No Items for Checkout!",
            footer: '<a href="/">Return to Home?</a>',
            confirmButtonText: "OK",
          }).then((result) => {
            if (result.isConfirmed) {
              window.location.href = "/";
            }
          });
        }
        
      }catch(error){
        console.log("Error");
      }
    }
    checkCart();
  },[])

  useEffect(() => {
    async function fetchCheckoutProducts() {
      try {
        const cookie = await fetch(
          "http://localhost:5000/api/auth/check-cookie",
          {
            method: "GET",
            credentials: "include",
          }
        );
        const cookieData = await cookie.json();

        const res = await axios.get(
          "http://localhost:5000/api/checkout/getDetails/" + cookieData
        );

        const data = res.data;

        let totalPrice = 0;

        for (var i = 0; i < data.length; i++) {
          totalPrice = totalPrice + data[i].total;
        }

        setTotalPrice(totalPrice);

        setData(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    fetchCheckoutProducts();
  }, []);

  useEffect(() => {
    // Check if user details exist and set state accordingly
    // You need to implement the logic to check if user details exist
    async function check(params) {
      const userDetailsExist = await checkUserDetailsExist(); // Implement this function
      setUserDetailsExist(userDetailsExist.success);
      setExistingAddresses(userDetailsExist.data);
    }
    check();
  }, []);




  const handleDeliverToExistingAddress = () => {
    setShowSelect(true);
  };


  const checkUserDetailsExist = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/checkout/get/checkout_order_details/" +
          userId
      );
      return res.data;
    } catch (error) {
      console.error("Error creating shipping details:", error);
      // Handle error, show an error message to the user
    }
  };

  // Handling the cash on delivery
  const handlePayWithCOD = async () => {
    try {
      const cookie = await fetch(
        "http://localhost:5000/api/auth/check-cookie",
        {
          method: "GET",
          credentials: "include",
        }
      );
      const cookieData = await cookie.json();

      const orderDetails = {
        user_id: userId,
        paymentWay: "COD",
        totalPrice: totalPrice,
        OrderDetailsID:selectedAddressId,
        orderItems: data.map((item) => ({
          product_id: item.p_id, // Use the correct field name for product ID
          cart_id: item.cart_id,
          quantity: item.totalCount, // You need to have this field in your data
          price: item.total, // You need to have this field in your data
        })),
      };

      // Make a request to create the order
      await axios.post(
        "http://localhost:5000/api/order/create-order",
        orderDetails
      );

      // Handle success, show a message or navigate to the order confirmation page
      console.log("Order created successfully!");

      data.forEach(async (item, index) => {
        // Fetch the current countInStock value of the product

        const productResponse = await axios.get(
          `http://localhost:5000/api/product/singleProduct/${item.p_id}`
        );

        const product = productResponse.data[0];
        console.log(product);
        const currentCountInStock = product.countInStock;

        const newCountInStock = currentCountInStock - item.totalCount;

        // Update the products table with the new countInStock value
        await axios.put(
          `http://localhost:5000/api/product/update/${item.p_id}`,
          {
            countInStock: newCountInStock,
          }
        );

        await axios.put(
          `http://localhost:5000/api/cart/update_status/${userId}`,
          {
            cart_id: item.cart_id,
            is_active: 0,
          }
        );

        console.log("Updated successfully Successfully");

        Swal.fire({
          title: "Order Done!",
          text: "Thanks for shopping!",
          icon: "success"
        });

      });
    } catch (error) {
      console.error("Error creating order:", error);
      // Handle error, show an error message to the user
    }
  };

  const notify = () => toast("Order has been created successfully"); //Toastify

  const handlePayWithOnline = async () => {

    const orderDetails = {
      user_id: userId,
      paymentWay: "COD",
      totalPrice: totalPrice,
      OrderDetailsID:selectedAddressId,
      orderItems: data.map((item) => ({
        product_id: item.p_id, // Use the correct field name for product ID
        cart_id: item.cart_id,
        quantity: item.totalCount, // You need to have this field in your data
        price: item.total, // You need to have this field in your data
      })),
    };


    try {
      const response = await fetch(
        "http://localhost:5000/api/checkout-session",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(orderDetails), 
          // body: JSON.stringify({ user_id: userId }), // Replace with actual user ID
        }
      );

      const responsedata = await response.json();

      if (responsedata.url) {
        // Redirect to the Stripe session URL (PayPal checkout)
        // window.location.href = data.url;

        console.log("Data");
        console.log(data);

        data.forEach(async (item, index) => {
          // Fetch the current countInStock value of the product

          const productResponse = await axios.get(
            `http://localhost:5000/api/product/singleProduct/${item.p_id}`
          );

          const product = productResponse.data[0];
          const currentCountInStock = product.countInStock;

          const newCountInStock = currentCountInStock - item.totalCount;

          // Update the products table with the new countInStock value
          await axios.put(
            `http://localhost:5000/api/product/update/${item.p_id}`,
            {
              countInStock: newCountInStock,
            }
          );

          await axios.put(
            `http://localhost:5000/api/cart/update_status/${userId}`,
            {
              cart_id: item.cart_id,
              is_active: 0,
            }
          );

          window.location.href = responsedata.url;

          console.log("Updated successfully Successfully");
          Swal.fire({
            icon: 'success',
            title: 'Payment successful!',
            text: 'Your payment has been processed successfully.',
            showConfirmButton: false,
            timer: 2000 // Close the alert after 2 seconds
          });
      
        });
      } else {
        console.log("Error: No session URL found.");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleCreateShippingDetails = async () => {
    try {
      // Make API request to create shipping details
      await axios.post(
        "http://localhost:5000/api/checkout/checkout_order_details",
        {
          userId,
          country,
          address,
          landmark,
          townCity,
          state,
          zip,
        }
      );

      console.log("Done");

      // Notify user about successful creation of shipping details
      notify("Shipping details created successfully");
    } catch (error) {
      console.error("Error creating shipping details:", error);
      // Handle error, show an error message to the user
      notify("Error creating shipping details");
    }
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };
  const handleSelectChange = (event) => {
     setSelectedAddressId(event.target.value);
  };

  return (
    <>
      <div className="ltn__checkout-area mb-105">
        <div className="checkout_container">
          <div className="row">
            <div className="col-lg-12">
              <div className="ltn__checkout-inner">
                <div className="ltn__checkout-single-content ltn__returning-customer-wrap">
                  <h5>
                    Returning customer?{" "}
                    <a
                      className="ltn__secondary-color"
                      href="#ltn__returning-customer-login"
                      data-bs-toggle="collapse"
                    >
                      Click here to login
                    </a>
                  </h5>
                  <div
                    id="ltn__returning-customer-login"
                    className="collapse ltn__checkout-single-content-info"
                  >
                    <div className="ltn_coupon-code-form ltn__form-box">
                      <p>Please login your accont.</p>
                      <form className="checkout_form">
                        <div className="row">
                          <div className="col-md-6">
                            <div className="input-item input-item-name ltn__custom-icon">
                              <input
                                className="input-box"
                                type="text"
                                name="ltn__name"
                                placeholder="Enter your name"
                              />
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="input-item input-item-email ltn__custom-icon">
                              <input
                                type="email"
                                name="ltn__email"
                                placeholder="Enter email address"
                              />
                            </div>
                          </div>
                        </div>
                        <button className="btn theme-btn-1 btn-effect-1 text-uppercase">
                          Login
                        </button>
                        <label className="input-info-save mb-0">
                          <input type="checkbox" name="agree" /> Remember me
                        </label>
                        <p className="mt-30">
                          <a href="register.html">Lost your password?</a>
                        </p>
                      </form>
                    </div>
                  </div>
                </div>
                <div className="ltn__checkout-single-content mt-50">
                  <h4 className="title-2">Billing Details</h4>
                  <div className="ltn__checkout-single-content-info">
                    <div id="errors">
                      <ul className="error"></ul>
                    </div>
                    {!userDetailsExist ? (
                      <form
                        id="shippingForm"
                        // action="/api/bill/createbill"
                        // method="post"
                      >
                        <input
                          type="hidden"
                          name="id"
                          id="userId"
                          defaultValue=""
                        />
                        <h6>Shipping Information</h6>
                        <div className="row" style={{ marginTop: 5 }}></div>
                        <div className="row">
                          <div className="col-lg-4 col-md-6">
                            <h6>Country</h6>
                            <div className="input-item">
                              {/* <select className="nice-select" name="country"> */}
                              <select
                                className="nice-select"
                                name="country"
                                value={country}
                                onChange={(e) => setCountry(e.target.value)}
                              >
                                <option>Select Country</option>
                                <option>India</option>
                                <option>Canada</option>
                                <option>United Kingdom (UK)</option>
                                <option>United States (US)</option>
                              </select>
                            </div>
                          </div>
                          <div className="col-lg-12 col-md-12">
                            <h6>Address</h6>
                            <div className="row">
                              <div className="col-md-6">
                                <div className="input-item">
                                  <input
                                    className="input-box"
                                    type="text"
                                    name="address"
                                    value={address}
                                    onChange={(e) => setAddress(e.target.value)}
                                    placeholder="House number and street name"
                                  />
                                </div>
                              </div>
                              <h6>Landmark</h6>
                              <div className="col-md-6">
                                <div className="input-item">
                                  <input
                                    className="input-box"
                                    type="text"
                                    name="landmark"
                                    value={landmark}
                                    onChange={(e) =>
                                      setLandmark(e.target.value)
                                    }
                                    placeholder="Apartment, suite, unit , landmark etc. (optional)"
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="col-lg-4 col-md-6">
                            <h6>Town / City</h6>
                            <div className="input-item">
                              <input
                                className="input-box"
                                type="text"
                                name="town"
                                value={townCity}
                                onChange={(e) => setTownCity(e.target.value)}
                                placeholder="City"
                              />
                            </div>
                          </div>
                          <div className="col-lg-4 col-md-6">
                            <h6>State </h6>
                            <div className="input-item">
                              <input
                                className="input-box"
                                type="text"
                                name="state"
                                value={state}
                                onChange={(e) => setState(e.target.value)}
                                placeholder="State"
                              />
                            </div>
                          </div>
                          <div className="col-lg-4 col-md-6">
                            <h6>Zip</h6>
                            <div className="input-item">
                              <input
                                className="input-box"
                                type="text"
                                name="zip"
                                value={zip}
                                onChange={(e) => setZip(e.target.value)}
                                placeholder="Zip"
                              />
                            </div>
                          </div>
                        </div>
                        <h6>Order Notes (optional)</h6>
                        <div className="input-item input-item-textarea ltn__custom-icon">
                          <textarea
                            className="input-box"
                            name="ltn__message"
                            placeholder="Notes about your order, e.g. special notes for delivery."
                            defaultValue={""}
                          />
                        </div>
                        <button
                          className="btn theme-btn-1 btn-effect-1 text-uppercase"
                          onClick={handleCreateShippingDetails}
                        >
                          Create Shipping Details
                        </button>
                      </form>
                    ) : (
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <button
                          onClick={handleDeliverToExistingAddress}
                          className="btn theme-btn-1 btn-effect-1 text-uppercase"
                          style={{ marginRight: "10px" }} // Adjust the margin as needed
                        >
                          Deliver to existing address
                        </button>
                        <button
                          onClick={openModal}
                          // onClick={handleDeliverToAddress}
                          className="btn theme-btn-1 btn-effect-1 text-uppercase"
                        >
                          Deliver to new address
                        </button>
                      </div>
                    )}
                    <div
                      style={{
                        marginTop: showSelect ? "10px" : "0",
                        transition: "margin-top 0.3s ease",
                        opacity: showSelect ? 1 : 0,
                        maxHeight: showSelect ? "100%" : "0",
                        overflow: "hidden",
                      }}
                    >
                      {showSelect && (
                        <div style={{ marginTop: "10px" }}>
                          <label htmlFor="existingAddress">
                            Select existing address:
                          </label>
                          <select
                            style={{
                              width: "100%",
                              padding: "5px",
                              borderRadius: "5px",
                              border: "1px solid #ccc",
                              backgroundColor: "#fff",
                              color: "#333",
                              fontSize: "14px",
                            }}
                            id="existingAddress"
                            onChange={handleSelectChange}
                          >
                            <option value="">Select an address</option>
                            {/* Render options here */}
                            {existingAddresses.map((address, index) => (
                              <option key={index} value={address.OrderDetailsID}>
                                {address.Address +
                                  "," +
                                  address.Landmark +
                                  "," +
                                  address.TownCity +
                                  "," +
                                  address.State}
                              </option>
                            ))}
                          </select>
                        </div>
                      )}
                    </div>
                    {isModalOpen && (
                      // <div className="modal">
                      <div className={isModalOpen ? "modal_open" : "modal"}>
                        <div className="modal-content">
                          {/* Modal content */}
                          <span className="close" onClick={closeModal}>
                            &times;
                          </span>
                          <p style={{ textAlign: "center" }}>New Address</p>
                          <form
                            id="shippingForm"
                            // action="/api/bill/createbill"
                            // method="post"
                          >
                            <input
                              type="hidden"
                              name="id"
                              id="userId"
                              defaultValue=""
                            />
                            <h6>Shipping Information</h6>
                            <div className="row" style={{ marginTop: 5 }}></div>
                            <div className="row">
                              <div className="col-lg-4 col-md-6">
                                <h6>Country</h6>
                                <div className="input-item">
                                  {/* <select className="nice-select" name="country"> */}
                                  <select
                                    className="nice-select"
                                    name="country"
                                    value={country}
                                    onChange={(e) => setCountry(e.target.value)}
                                  >
                                    <option>Select Country</option>
                                    <option>India</option>
                                    <option>Canada</option>
                                    <option>United Kingdom (UK)</option>
                                    <option>United States (US)</option>
                                  </select>
                                </div>
                              </div>
                              <div className="col-lg-12 col-md-12">
                                <h6>Address</h6>
                                <div className="row">
                                  <div className="col-md-6">
                                    <div className="input-item">
                                      <input
                                        className="input-box"
                                        type="text"
                                        name="address"
                                        value={address}
                                        onChange={(e) =>
                                          setAddress(e.target.value)
                                        }
                                        placeholder="House number and street name"
                                      />
                                    </div>
                                  </div>
                                  <h6>Landmark</h6>
                                  <div className="col-md-6">
                                    <div className="input-item">
                                      <input
                                        className="input-box"
                                        type="text"
                                        name="landmark"
                                        value={landmark}
                                        onChange={(e) =>
                                          setLandmark(e.target.value)
                                        }
                                        placeholder="Apartment, suite, unit , landmark etc. (optional)"
                                      />
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="col-lg-4 col-md-6">
                                <h6>Town / City</h6>
                                <div className="input-item">
                                  <input
                                    className="input-box"
                                    type="text"
                                    name="town"
                                    value={townCity}
                                    onChange={(e) =>
                                      setTownCity(e.target.value)
                                    }
                                    placeholder="City"
                                  />
                                </div>
                              </div>
                              <div className="col-lg-4 col-md-6">
                                <h6>State </h6>
                                <div className="input-item">
                                  <input
                                    className="input-box"
                                    type="text"
                                    name="state"
                                    value={state}
                                    onChange={(e) => setState(e.target.value)}
                                    placeholder="State"
                                  />
                                </div>
                              </div>
                              <div className="col-lg-4 col-md-6">
                                <h6>Zip</h6>
                                <div className="input-item">
                                  <input
                                    className="input-box"
                                    type="text"
                                    name="zip"
                                    value={zip}
                                    onChange={(e) => setZip(e.target.value)}
                                    placeholder="Zip"
                                  />
                                </div>
                              </div>
                            </div>
                            <h6>Order Notes (optional)</h6>
                            <div className="input-item input-item-textarea ltn__custom-icon">
                              <textarea
                                className="input-box"
                                name="ltn__message"
                                placeholder="Notes about your order, e.g. special notes for delivery."
                                defaultValue={""}
                              />
                            </div>
                            <button
                              className="btn theme-btn-1 btn-effect-1 text-uppercase"
                              onClick={handleCreateShippingDetails}
                            >
                              Create Shipping Details
                            </button>
                          </form>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-6">
              <div
                className="ltn__checkout-payment-method mt-50"
                id="payment_method"
              >
                <h4 className="title-2">Payment Method</h4>
                <div id="checkout_accordion_1">
                  <div className="card">
                    <h5
                      className="collapsed ltn__card-title"
                      data-bs-toggle="collapse"
                      data-bs-target="#faq-item-2-1"
                      aria-expanded="false"
                    >
                      Check payments
                    </h5>
                    <div
                      id="faq-item-2-1"
                      className="collapse"
                      data-bs-parent="#checkout_accordion_1"
                    >
                      <div className="card-body">
                        <p>
                          Please send a check to Store Name, Store Street, Store
                          Town, Store State / County, Store Postcode.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="card">
                    <h5
                      className="ltn__card-title"
                      data-bs-toggle="collapse"
                      data-bs-target="#faq-item-2-2"
                      aria-expanded="true"
                    >
                      Cash on delivery
                    </h5>
                    <div
                      id="faq-item-2-2"
                      className="collapse show"
                      data-bs-parent="#checkout_accordion_1"
                    >
                      <div className="card-body">
                        <p>Pay with cash upon delivery.</p>
                        <button
                          onClick={handlePayWithCOD}
                          className="btn theme-btn-1 btn-effect-1 text-uppercase"
                          id="cod-btn"
                        >
                          Pay with COD
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="card">
                    <h5
                      className="ltn__card-title"
                      data-bs-toggle="collapse"
                      data-bs-target="#faq-item-2-2"
                      aria-expanded="true"
                    >
                      Online delivery
                    </h5>
                    <div
                      id="faq-item-2-2"
                      className="collapse show"
                      data-bs-parent="#checkout_accordion_1"
                    >
                      <div className="card-body">
                        <p>Pay online.</p>
                        <button
                          onClick={handlePayWithOnline}
                          className="btn theme-btn-1 btn-effect-1 text-uppercase"
                          id="cod-btn"
                        >
                          Pay with PayPal
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* <div className="card">
                <h5
                  className="collapsed ltn__card-title"
                  data-bs-toggle="collapse"
                  data-bs-target="#faq-item-2-3"
                  aria-expanded="true"
                >
                  PayPal <img src="./img/icons/payment-4.png" alt="#" />
                </h5>
                <div
                  id="faq-item-2-3"
                  className="collapse"
                  data-bs-parent="#checkout_accordion_1"
                >
                  <div className="card-body">
                    <p>
                      Pay via PayPal; you can pay with your credit card if you
                      don’t have a PayPal account.
                    </p>
                    <button
                      className="btn theme-btn-1 btn-effect-1 text-uppercase"
                      id="pay-with-paypal-btn"
                    >
                      Pay with PayPal
                    </button>
                  </div>
                </div>
              </div> */}
                </div>
                <div className="ltn__payment-note mt-30 mb-30">
                  <p>
                    Your personal data will be used to process your order,
                    support your experience throughout this website, and for
                    other purposes described in our privacy policy.
                  </p>
                </div>
                <button
                  className="btn theme-btn-1 btn-effect-1 text-uppercase"
                  id="place-order-btn"
                  type="submit"
                >
                  Place order
                </button>
              </div>
            </div>
            <div className="col-lg-6">
              <div className="shoping-cart-total mt-50" id="cart-total">
                <h4 className="title-2" id="cart_title">
                  Cart Totals
                </h4>
                <table className="table">
                  <tbody id="cart-total">
                    {data.map((slide, i) => (
                      <>
                        <tr>
                          <td>
                            {slide.productName}{" "}
                            <strong>× {slide.totalCount}:</strong>
                          </td>
                          <td>${slide.total}</td>
                        </tr>
                        {/* <tr>
                          <td>Shipping and Handing</td>
                          <td>$15.00</td>
                        </tr> */}
                        {/* <tr>
                          <td>Vat</td>
                          <td>$00.00</td>
                        </tr> */}
                        <tr>
                          {/* <td>
                            <strong>Order Total</strong>
                          </td> */}
                          {/* <td>
                            <strong>$633.00</strong>
                          </td> */}
                        </tr>
                      </>
                    ))}
                    {/* <tr>
                      <td>
                        Digital Stethoscope <strong>× 2</strong>
                      </td>
                      <td>$298.00</td>
                    </tr> */}
                    <tr>
                      <td>Shipping and Handing</td>
                      <td>$15.00</td>
                    </tr>
                    <tr>
                      <td>Vat</td>
                      <td>$00.00</td>
                    </tr>
                    <tr>
                      <td>
                        <strong>Order Total</strong>
                      </td>
                      <td>
                        <strong>${totalPrice + 15}</strong>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
      {/* WISHLIST AREA START */}
    </>
  );
};

export default Checkout;
