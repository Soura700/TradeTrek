import React from 'react'

import Hero from "../../components/Hero/Hero"

import Slider from "../../components/Slider/Slider"

import Testimonial from "../../components/Testimonials/Testimonials"

import Products from "../../components/Products/Products"

const Home = () => {
  return (
    <div>
      <Hero/>
      <Slider/>
      <Products/> 
      <Testimonial/>
    </div>
  )
}

export default Home
