// import logo from './logo.svg';
// import './App.css';
// import Header from './components/Header/Header';
// import Hero from './components/Hero/Hero';
// import Slider from './components/Slider/Slider';
// import Products from "./components/Products/Products"
// import SignInSignUpForm from '../src/components/SignInSignUpForm/SignInSignUpForm.js';
// // import Newsletter from './components/Newsletter/Newsletter';
// // import Countdown from './components/Countdown/Countdown';
// // // import Footer from './components/Footer/Footer';
// // import Testimonial from './components/Testimonials/Testimonials';


// function App() {
//   return (
//     <div className="App">
//       {/* <Header/> */}
//       {/* <Hero/> */}
//       {/* <Slider/> */}
//       {/* <Products/> */}
//       <SignInSignUpForm/>
//       {/* <Testimonial/> */}
//       {/* <Footer/> */}
//       {/* <Newsletter/> */}
//       {/* <Countdown duration={2*24*60*60*1000}/> */}
      
//     </div>
//   );
// }

// export default App;




import './App.css';
import Header from './components/Header/Header';
import SingleProduct from "./components/SingleProduct/SingleProduct.jsx"
import SignInSignUpForm from './components/SignInSignUpForm/SignInSignUpForm';

import Footer from './components/Footer/Footer';
import { Link , Route , Router , Outlet, createBrowserRouter, RouterProvider } from 'react-router-dom';
import Home from './pages/Home/Home';
import { useState } from 'react';
import Cart from './components/Cart/Cart';



function App() {

  const [isLogin , setLogin] = useState(false);


  const Layout = () =>{
    return(
      <div>
        <Header/>
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
          path: "/cart/:id/:productName",
          element: <Cart />,
        },
      ],
    },
    // {
    //   path: "/singleProduct",
    //   element: <SingleProduct/>,
    // },

    {
      path: "/login",
      element: <SignInSignUpForm />,
    },
  ]);

  return (
    <div className="App">
      {/* <AuthContext> */}
        <RouterProvider router={router}/>
      {/* </AuthContext>   */}
    </div>
  );
}

export default App;
