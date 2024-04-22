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
import Checkout from './components/Checkout/Checkout';
import {CartProvider} from "./context/cartContext";
import SingleOrder from "./components/SingleOrder/SingleOrder.jsx";
import Admin from './pages/Admin/Admin.jsx';
import ForgotPasswordForm from './components/SignInSignUpForm/ForgotPasswordForm.js';
import ResetPasswordForm from './components/SignInSignUpForm/ResetPasswordForm.js';
import Overview from './pages/Overviews/Overview.jsx';
import Error from './pages/Error/404.jsx';




function App() {

  const [cartData, setCartData] = useState([]);
  const [cookie , setCookie] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };


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
        <Header value={cartData} isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar}/>
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
          element: <Home toggleSidebar={toggleSidebar}/>,
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
        {
          path:"/singleOrder/:id/:order_id",
          element:<SingleOrder/>
        },
      ],
    },

    {
      path: "/login",
      element: <SignInSignUpForm />,
    },
    {
      path: "/forgot-password",
      element: <ForgotPasswordForm />,
    },
    {
      path: "/resetpassword/:id/:token",
      element: <ResetPasswordForm />,
    },
    {
      path: "/admin",
      element: <Admin />,
    },
    {
      path:"/overview",
      element:<Overview/>
    },
    {
      path:"/404",
      element:<Error/>
    }
    
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
