// import React, { useState } from "react";
// import css from "./Products.module.css";
// import Plane from "../../assets/plane.png";
// import { ProductsData } from "../../data/products";
// import {useAutoAnimate} from '@formkit/auto-animate/react'
// const Products = () => {
//   const [parent] = useAutoAnimate(/* optional config */)

//   const [MenuProducts, setMenuProducts] = useState(ProductsData)

//   const filter = (type)=> {
//     setMenuProducts(ProductsData.filter((product)=>product.type === type))
//   }


//   return (
//     <div className={css.container}>
//       <img src={Plane} alt="" />
//       <h1>Our Feature Products</h1>
//       <div className={css.products}>
//         <ul className={css.menu}>
//           <li onClick={()=>setMenuProducts(ProductsData)}>All</li>
//           <li onClick={()=>filter('skin care')}>Skin Care</li>
//           <li onClick={()=>filter('conditioner')}>Conditioner</li>
//           <li onClick={()=>filter('foundation')}>Foundation</li>
//         </ul>
//         <div className={css.list} ref={parent}>
//           {MenuProducts.map((product, i) => (
//             <div className={css.product}>
//               <div className="left-s">
//                 <div className="name">
//                   <span>{product.name}</span>
//                   <span>{product.detail}</span>
//                 </div>
//                 <span>{product.price}$</span>
//                 <div>Shop Now</div>
//               </div>

//               <img src={product.img} alt=""className="img-p" />
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Products;




import React, { useEffect, useState } from "react";
import css from "./Products.module.css";
import Plane from "../../assets/plane.png";
import { useAutoAnimate } from '@formkit/auto-animate/react';
import axios from "axios";

const Products = () => {
  const [parent] = useAutoAnimate(/* optional config */);
  const [originalProducts, setOriginalProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [MenuProducts, setMenuProducts] = useState([]);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const response = await axios.get("http://localhost:5000/api/product/getProducts");
        const data = response.data;
        setOriginalProducts(data);
        setMenuProducts(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    fetchProducts();
  }, []);

  useEffect(() => {
    // Apply filtering based on the selected category
    if (selectedCategory === "") {
      setMenuProducts(originalProducts); // Show all products
    } else {
      setMenuProducts(originalProducts.filter((product) => product.categories === selectedCategory));
    }
  }, [selectedCategory, originalProducts]);

  const filter = (category) => {
    setSelectedCategory(category);
  };

  const addToCart = async(id)=>{
    
    try {

      const response = await fetch(
        "http://localhost:5000/api/auth/check-cookie",
        {
          method: "GET",
          credentials: "include",
        }
      );


        const product = await axios.get(
          "http://localhost:5000/api/product/singleProduct/" + id
        );

        const product_data = product.data;

         var product_price = product_data[0].price;

         alert(product_price)

      const data = await response.json();


      const data1 = {
        user_id: data,
        product_id: id,
        cartItemCount: 1,
        totalPrice: product_price * 1 ,
        // is_active:1
      }


      const cartRes =  await axios.post("http://localhost:5000/api/cart/add-to-cart", data1 );
      
    } catch (error) {
      console.error("Cart error:", error);
      // Handle error
    }
  }

  return (
    <div className={css.container}>
      <img src={Plane} alt="" />
      <h1>Our Feature Products</h1>
      <div className={css.products}>
        <ul className={css.menu}>
          <li onClick={() => filter("")}>All</li>
          <li onClick={() => filter('Headphone')}>Headphones</li>
          <li onClick={() => filter('SmartWatch')}>Smartwatches</li>
          <li onClick={() => filter('Earbuds')}>Earbuds</li>
        </ul>
        <div className={css.list} ref={parent}>
          {MenuProducts.map((product, i) => (
            <div className={css.product} key={i}>
              <div className="left-s">
                <div className="name">
                  <span>{product.productName}</span>
                  <span>{product.product_description}</span>
                </div>
                <span>{product.price}$</span>
                <button style={{background:"none"}} onClick={() => addToCart(product.p_id)}>
                <div>
                      Add To Cart
                </div>
                </button>
              </div>
              <img src={`http://localhost:5000/${product.images[0]}`} alt="" className="img-p" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Products;
