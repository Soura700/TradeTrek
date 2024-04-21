import axios from "axios";
import React, { useEffect, useState } from "react";
import PieChart from "../../components/PieChart/PieChart"

const Overview = () => {

    const [products, setProducts] = useState([]);
    const [positivePercentage, setPositivePercentage] = useState(0);
    const [negativePercentage, setNegativePercentage] = useState(0);

    useEffect(() => {
      async function fetchProducts() {
        try {
          const response = await axios.get("http://localhost:5000/api/product/getProducts");
  
          const data = response.data;
  
          console.log(response)
  
          // const image
          // console.log(data.images[0])
  
          setProducts(data);
          
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      }
  
      fetchProducts();
    }, []);


  return (
    <div className="bg-gray-100 min-h-screen">
      <section className="order_container mx-auto py-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">All Orders</h1>
        <div className="overflow-x-auto">
          <table className="table-auto bg-white rounded-lg shadow-md">
            <thead className="bg-gray-200">
              <tr>
                <th className="px-4 py-2 text-left">Product Id</th>
                <th className="px-4 py-2 text-left">Product Name</th>
                <th className="px-4 py-2 text-left">Product Category</th>
                <th className="px-4 py-2 text-left">Review</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.p_id}>
                  <td className="border px-4 py-2">{product.p_id}</td>
                  <td className="border px-4 py-2">{product.productName}</td>
                  <td className="border px-4 py-2">{product.categories}</td>
                  <td className="border px-4 py-2"><PieChart product_id={product.p_id}/></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default Overview;
