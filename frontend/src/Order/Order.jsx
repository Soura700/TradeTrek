// import React from "react";

// const Order = () => {
//   return (
//     <div>
//       <section class="orders light-section">
//         <div class="container mx-auto pt-12">
//           <h1 class="font-bold text-lg mb-4">All orders</h1>
//           <table class="w-full table-auto bg-white">
//             <thead>
//               <tr>
//                 <th class="px-4 py-2 text-left">Orders</th>
//                 <th class="px-4 py-2 text-left">Customer</th>
//                 <th class="px-4 py-2 text-left">Address</th>
//                 <th class="px-4 py-2 text-left">status</th>
//                 <th class="px-4 py-2 text-left">Placed at</th>
//                 <th class="px-4 py-2 text-left">Payment Status</th>
//               </tr>
//             </thead>
//             <tbody id="orderTableBody"></tbody>
//           </table>
//         </div>
//       </section>
//     </div>
//   );
// };

// export default Order;

import React from "react";
import "./order.css"; // Import custom CSS for additional styling

const Order = () => {
  return (
    <div className="bg-gray-100 min-h-screen">
      <section className="order_container mx-auto py-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">All Orders</h1>
        <div className="overflow-x-auto">
          <table className="table-auto bg-white rounded-lg shadow-md">
            <thead className="bg-gray-200">
              <tr>
                <th className="px-4 py-2 text-left">Order</th>
                <th className="px-4 py-2 text-left">Customer</th>
                <th className="px-4 py-2 text-left">Address</th>
                <th className="px-4 py-2 text-left">Status</th>
                <th className="px-4 py-2 text-left">Placed at</th>
                <th className="px-4 py-2 text-left">Payment Status</th>
              </tr>
            </thead>
            <tbody>
              {/* Sample data rows */}
              {/* <tr>
                <td className="border px-4 py-2">Order #1</td>
                <td className="border px-4 py-2">John Doe</td>
                <td className="border px-4 py-2">123 Main St</td>
                <td className="border px-4 py-2">Shipped
                </td>
                <td className="border px-4 py-2">2024-04-10</td>
                <td className="border px-4 py-2">Paid</td>
              </tr> */}
              <tr>
                <td className="border px-4 py-2">Order #1</td>
                <td className="border px-4 py-2">John Doe</td>
                <td className="border px-4 py-2">123 Main St</td>
                <td className="border px-4 py-2">
                  {/* Shipped */}
                  <div class="select-container">
                    <select id="status">
                      <option value="order_placed">Order Placed</option>
                      <option value="confirmed">Order Confirmation</option>
                      <option value="prepared">Preparation</option>
                      <option value="delivered">Out for Delivery</option>
                      <option value="completed">Complete</option>
                    </select>
                  </div>
                </td>
                <td className="border px-4 py-2">2024-04-10</td>
                <td className="border px-4 py-2">Paid</td>
              </tr>

              {/* Additional data rows */}
              {/* Add more rows as needed */}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default Order;
