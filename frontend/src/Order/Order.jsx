import React, { useEffect, useState } from "react";
import "./order.css";
import axios from "axios";
import { io } from "socket.io-client";

const Order = () => {
  const [orders, setOrders] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState("");
  const [socket, setSocket] = useState(null); //For setting the socket connection

  useEffect(() => {
    const newSocket = io("http://localhost:8000");
    setSocket(newSocket);
    return () => {
      newSocket.disconnect();
    };
  }, []);

  useEffect(() => {
    if (socket) {
      socket.on(
        "create_order",
        async ({
          user_id,
          order_item_ids,
          order_ids,
          product_ids,
          user_names,
          product_names,
          order_details
        }) => {
          alert(order_details.Address)
          setOrders((prevOrders) => [
            {
              user_id,
              order_item_ids,
              order_ids,
              product_ids,
              user_names,
              product_names,
            },
            ...prevOrders,
          ]);
        }
      );
      return () => {
        if (socket) {
          socket.off("update_cart");
        }
      };
    }
  }, [socket]);

  const getOrders = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/order/get_order"
      );
      setOrders(response.data);
    } catch (error) {
      console.log("Error: " + error);
    }
  };
  useEffect(() => {
    getOrders();
  }, []);

  const handleStatusChange = async (userId, newStatus, order_id) => {
    try {
      await axios.put("http://localhost:5000/api/order/change_status", {
        user_id: userId,
        new_status: newStatus,
        order_id: order_id,
      });
      // Refresh orders after status change
      getOrders();
    } catch (error) {
      console.log("Error: " + error);
    }
  };

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
              {orders.map((order) => (
                <tr key={order.user_id}>
                  <td className="border px-4 py-2">
                    <ul>
                      {order.product_names
                        .split(",")
                        .map((productName, index) => (
                          <li key={index}>{productName}</li>
                        ))}
                    </ul>
                  </td>
                  <td className="border px-4 py-2">{order.user_names}</td>
                  <td className="border px-4 py-2">{order.address}</td>
                  <td className="border px-4 py-2">
                    <div className="select-container">
                      <select
                        id={`status-${order.user_id}`}
                        defaultValue={order.order_status}
                        onChange={(e) =>
                          // alert(order.order_status)
                          handleStatusChange(
                            order.user_id,
                            e.target.value,
                            order.order_ids
                          )
                        }
                      >
                        <option value="Placed">Placed</option>
                        <option value="Confirmed">Confirmed</option>
                        <option value="Prepared">Prepared</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Completed">Completed</option>
                      </select>
                    </div>
                  </td>
                  <td className="border px-4 py-2">{order.placed_at}</td>
                  <td className="border px-4 py-2">{order.payment_status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default Order;
