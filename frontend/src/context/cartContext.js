import { useEffect , useState  } from "react";
import { createContext, useContext } from "react";
import axios from "axios"

const CartContext = createContext();

export const useCart = () => {
  return useContext(CartContext);
};

export const CartProvider = ({ children }) => {
  const [cartData, setCartData] = useState([]);
  const [cookie, setCookie] = useState(null);

  // Function to check authentication status and set isLoggedIn
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

  return (
  <CartContext.Provider value={{cartData , cookie}}>
    {children}
  </CartContext.Provider>
  );

};
