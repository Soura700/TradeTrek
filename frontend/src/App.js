import './App.css';
import React, { useState } from "react";
import { useEffect} from 'react'
import axios from "axios"
import Header from './components/Header/Header';
import SingleProduct from "./components/SingleProduct/SingleProduct.jsx"
import SignInSignUpForm from './components/SignInSignUpForm/SignInSignUpForm';

import Footer from './components/Footer/Footer';
import { Link , Route , Router , Outlet, createBrowserRouter, RouterProvider } from 'react-router-dom';
import Home from './pages/Home/Home';
import Cart from './components/Cart/Cart';
import { AuthProvider } from './context/authContext';
// import Checkout from './pages/Checkout/Checkout';
import Checkout from './components/Checkout/Checkout';
import {CartProvider} from "./context/cartContext";




function App() {




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


  const Layout = () =>{
    return(
      <div>
        <Header value={cartData}/>
        {/* <div> */}
          <Outlet/>
        {/* </div> */}
        <Footer/>
      </div>
    )
  }

  const router = createBrowserRouter([
    {
      path: "/",
      element: (
        // <ProtectedRoute>
          <Layout />
        // </ProtectedRoute>
      ),
      children: [
        {
          path: "/",
          element: <Home />,
        },
        {
          path: "/singleProduct/:id/:productName",
          element: <SingleProduct />,
        },
        {
          path: "/cart",
          element: <Cart />,
        },
        {
          path: "/checkout/:userId",
          element: <Checkout />,
        },
      ],
    },

    {
      path: "/login",
      element: <SignInSignUpForm />,
    },
  ]);

  return (
    <div className="App">
      <AuthProvider>
        <CartProvider>
        <RouterProvider router={router}/>
        </CartProvider>
      </AuthProvider>  
    </div>
  );
}

export default App;
