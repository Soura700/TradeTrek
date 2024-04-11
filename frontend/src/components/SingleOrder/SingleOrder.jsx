// // import React from "react";
// // import "./singleorder.css"

// // const SingleOrder = () => {
// //   return (
// //     <>
// //       <section class="status">
// //         <div class="single_container">
// //           <div class="status-box w-full lg:w-2/3 mx-auto">
// //             <div class="flex items-center justify-between mb-12">
// //               <h1 class="text-xl font-bold">Track delivery status</h1>
// //               <h6 class="bg-white py-1 rounded-full px-4 text-green-600 text-xs">
// //                 Order Id
// //               </h6>
// //               <input id="hiddenInput" type="hidden" value="" />
// //             </div>
// //             <ul>
// //               <li
// //                 class="status_line text-sm md:text-xl pb-16 step-completed"
// //                 data-status="order_placed"
// //               >
// //                 <span>Order Placed</span>
// //               </li>
// //               <li
// //                 class="status_line text-sm md:text-xl pb-16 current"
// //                 data-status="confirmed"
// //               >
// //                 <span>Order confirmation</span>
// //               </li>
// //               <li
// //                 class="status_line text-sm md:text-xl pb-16"
// //                 data-status="prepared"
// //               >
// //                 <span>Preparation</span>
// //               </li>
// //               <li
// //                 class="status_line text-sm md:text-xl pb-16"
// //                 data-status="delivered"
// //               >
// //                 <span>Out for delivery </span>
// //               </li>
// //               <li
// //                 class="status_line text-sm md:text-xl"
// //                 data-status="completed"
// //               >
// //                 <span>Complete</span>
// //               </li>
// //             </ul>
// //           </div>
// //         </div>
// //       </section>
// //     </>
// //   );
// // };

// // export default SingleOrder;

// import React, { useState, useEffect } from "react";
// import { useParams } from 'react-router-dom';
// import axios from "axios";
// import "./singleorder.css";
// import { io } from "socket.io-client";


// const SingleOrder = () => {
//   const [currentStatus, setCurrentStatus] = useState("");
//   const {id,order_id} = useParams();
//   const [statusSteps, setStatusSteps] = useState([
//     "placed",
//     "confirmed",
//     "prepared",
//     "delivered",
//     "completed",
//   ]);

//   const [socket, setSocket] = useState(null); //For setting the socket connection

//   useEffect(() => {
//     const newSocket = io("http://localhost:8000");
//     setSocket(newSocket);
//     return () => {
//       newSocket.disconnect();
//     };
//   }, []);

//   useEffect(() => {
//     if (socket) {
//       socket.on("change_status", async ({user_id , new_status,order_id})=>{
//         if(id ==  user_id){
//           if(order_id == order_id){
//             alert("Entered");
//             // currentStatus = new_status;
//             setCurrentStatus(new_status);
//           }
//         }
//       })
//       return () => {
//         if (socket) {
//           socket.off("update_cart");
//         }
//       };
//     }
//   }, [socket , id, order_id]);



//   useEffect(() => {
//     const fetchStatus = async () => {
//       try {

//         const cookie = await fetch(
//           "http://localhost:5000/api/auth/check-cookie",
//           {
//             method: "GET",
//             credentials: "include",
//           }
//         );
//         const cookieData = await cookie.json();


//         const response = await axios.get(
//           `http://localhost:5000/api/order/get_status/${cookieData}/${order_id}`
//         );
//         let s = response.data[0].order_status;
//         let ans = s.toLowerCase();
//         setCurrentStatus(ans);
//       } catch (error) {
//         console.log("Error: " + error);
//       }
//     };
//     fetchStatus();
//   }, []);

//   return (
//     <>
//       <section className="status">
//         <div className="single_container">
//           <div className="status-box w-full lg:w-2/3 mx-auto">
//             <div className="flex items-center justify-between mb-12">
//               <h1 className="text-xl font-bold">Track delivery status</h1>
//               <h6 className="bg-white py-1 rounded-full px-4 text-green-600 text-xs">
//                 Order Id : {order_id}
//               </h6>
//               <input id="hiddenInput" type="hidden" value="" />
//             </div>
//             <h6 className="bg-white py-1 rounded-full px-4 text-green-600 text-xs">
//                 User Id : {id}
//               </h6>
//             <ul>
//               {statusSteps.map((step, index) => {
//                 const isCompleted =
//                   currentStatus && statusSteps.indexOf(currentStatus) > index;
//                 const isCurrent = currentStatus && step === currentStatus;
//                 const className = `status_line text-sm md:text-xl pb-16 ${
//                   isCompleted ? "step-completed" : isCurrent ? "current" : ""
//                 }`;

//                 return (
//                   <li key={index} className={className} data-status={step}>
//                     <span>{step.replace("_", " ")}</span>
//                   </li>
//                 );
//               })}
//             </ul>
//           </div>
//         </div>
//       </section>
//     </>
//   );
// };

// export default SingleOrder;


import React, { useState, useEffect } from "react";
import { useParams } from 'react-router-dom';
import axios from "axios";
import "./singleorder.css";
import { io } from "socket.io-client";

const SingleOrder = () => {
  const [currentStatus, setCurrentStatus] = useState("");
  const { id, order_id } = useParams();
  const [statusSteps, setStatusSteps] = useState([
    "placed",
    "confirmed",
    "prepared",
    "delivered",
    "completed",
  ]);

  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const newSocket = io("http://localhost:8000");
    setSocket(newSocket);
    return () => {
      newSocket.disconnect();
    };
  }, []);

  useEffect(() => {
    if (socket) {
      socket.on("change_status", ({ user_id, new_status, order_id }) => {
        if (id == user_id && order_id == order_id) {
          let s = new_status;
          let ans = s.toLowerCase();
          setCurrentStatus(ans);
        }
      });
    }
  }, [socket, id, order_id]);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const cookie = await fetch(
          "http://localhost:5000/api/auth/check-cookie",
          {
            method: "GET",
            credentials: "include",
          }
        );
        const cookieData = await cookie.json();

        const response = await axios.get(
          `http://localhost:5000/api/order/get_status/${cookieData}/${order_id}`
        );
        let s = response.data[0].order_status;
        let ans = s.toLowerCase();
        setCurrentStatus(ans);
      } catch (error) {
        console.log("Error: " + error);
      }
    };
    fetchStatus();
  }, [order_id]);

  return (
    <>
      <section className="status">
        <div className="single_container">
          <div className="status-box w-full lg:w-2/3 mx-auto">
            <div className="flex items-center justify-between mb-12">
              <h1 className="text-xl font-bold">Track delivery status</h1>
              <h6 className="bg-white py-1 rounded-full px-4 text-green-600 text-xs">
                Order Id : {order_id}
              </h6>
              <input id="hiddenInput" type="hidden" value="" />
            </div>
            <h6 className="bg-white py-1 rounded-full px-4 text-green-600 text-xs">
              User Id : {id}
            </h6>
            <ul>
              {statusSteps.map((step, index) => {
                const isCompleted =
                  currentStatus &&
                  statusSteps.indexOf(currentStatus) > index;
                const isCurrent =
                  currentStatus && step === currentStatus;
                const className = `status_line text-sm md:text-xl pb-16 ${
                  isCompleted ? "step-completed" : isCurrent ? "current" : ""
                }`;

                return (
                  <li key={index} className={className} data-status={step}>
                    <span>{step.replace("_", " ")}</span>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </section>
    </>
  );
};

export default SingleOrder;
