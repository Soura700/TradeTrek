import logo from './logo.svg';
import './App.css';
import Header from './components/Header/Header';
import Hero from './components/Hero/Hero';
import Slider from './components/Slider/Slider';
import Products from "./components/Products/Products"
import SignInSignUpForm from '../src/components/SignInSignUpForm/SignInSignUpForm.js';
// import Newsletter from './components/Newsletter/Newsletter';
// import Countdown from './components/Countdown/Countdown';
// // import Footer from './components/Footer/Footer';
// import Testimonial from './components/Testimonials/Testimonials';


function App() {
  return (
    <div className="App">
      {/* <Header/> */}
      {/* <Hero/> */}
      {/* <Slider/> */}
      {/* <Products/> */}
      <SignInSignUpForm/>
      {/* <Testimonial/> */}
      {/* <Footer/> */}
      {/* <Newsletter/> */}
      {/* <Countdown duration={2*24*60*60*1000}/> */}
      
    </div>
  );
}

export default App;
