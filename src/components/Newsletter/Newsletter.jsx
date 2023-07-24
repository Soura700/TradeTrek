import React from 'react'
import "./newsletter.css"

const Newsletter = () => {
  return (
    <div className='newsletter'>
      <div>
        <h1 className=''>Get Newletter</h1>
        <hr />
        <p>Enter your email in the box below to receive latest news and information about our activities</p>
        <form action='' className='form' >
            <input type='email' placeholder='Email' required></input>
            <br /> 
            <button className='btn' type='submit'>Submit Now</button>
        </form>
      </div>


    </div>
  )
}

export default Newsletter
