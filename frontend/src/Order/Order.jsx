import React, { useEffect, useState } from "react";
import "./order.css";
import axios from "axios";
import { io } from "socket.io-client";
import { useNavigate } from "react-router-dom";
import AdminHeader from "../components/AdminHeader/AdminHeader";
import Swal from "sweetalert2";
import { toast } from "react-toastify";

const Order = () => {
  const navigate = useNavigate();
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
          order_details,
        }) => {
          alert(order_details.Address);
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

  const handleConfirmClick = () => {
    // Redirect to the login page
    window.location.href = "/login"; // Change the URL as needed
  };

  const fetchData = async (event) => {
    try {
      const token = localStorage.getItem("token");

      const config = {
        headers: {
          "x-access-token": token,
        },
      };

      const response = await axios.get(
        "http://localhost:5000/api/auth/verify-token",
        {
          headers: {
            "x-access-token": token,
          },
        }
      );
      if(response.status === 200 && response.data.isAdmin){
        toast("Welcome to Admin Page");
      }else if(response.data.isAdmin === 0){
        alert("Not an admin")
      }
      return response.data;
    } catch (error) {
      if (error.response.status === 402) {
        const overlay = document.createElement("div");
        overlay.classList.add("overlay");
        document.body.appendChild(overlay);

        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Something went wrong!",
          footer: '<a href="/login">Return to Login?</a>',
          confirmButtonText: "OK",
        }).then((result) => {
          if (result.isConfirmed) {
            window.location.href = "/login";
          }
        });
      }
      else if(error.response.status === 401){
        const overlay = document.createElement("div");
        overlay.classList.add("overlay");
        document.body.appendChild(overlay);
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "You don't have access!",
          footer: '<a href="#">Why do I have this issue?</a>',
          confirmButtonText: "OK",
        }).then((result) => {
          if (result.isConfirmed) {
            window.location.href = "/";
          }
        });
      }
      // throw error; // Optionally rethrow the error for the caller to handle
    }
  };

  useEffect(() => {
    fetchData();
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
    <>
      <AdminHeader />
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
    </>
  );
};

export default Order;

// import React from "react";
// import Sidebar from "../components/Sidebar";
// import MainDash from "../components/MainDash/MainDash";
// import RightSide from "../components/RigtSide/RightSide";

// const Order = () => {
//   return (
//     <div className="AppGlass">
//       <Sidebar />
//       <MainDash />
//       <RightSide />
//     </div>
//   );
// };

// export default Order;
