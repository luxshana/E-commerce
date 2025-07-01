"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import "../styles/successpopup.css";

const SuccessPopup = ({ productName, choices, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 1500);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="success_popup ">
      <div className="success_line"></div>
      <button
        onClick={onClose}
        className="success_popup_close"
        aria-label="Close popup"
      >
        &times;
      </button>
      <p>
        <strong>{productName}</strong> was successfully added to your cart!
      </p>

      {choices && Object.keys(choices).length > 0 && (
        <ul>
          {Object.entries(choices).map(([key, value]) => (
            <li key={key}>{value}</li>
          ))}
        </ul>
      )}

      <Link href="/cart" style={{ color: "#fff", textDecoration: "none" }}>
        <button className="btnStyle5">Go to Cart</button>
      </Link>
    </div>

      //  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      //     <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6  mx-2 sm:mx-0">
      //       <div className="flex items-center justify-center mb-4">
      //         <div className="bg-green-100 p-2 sm:p-3 rounded-full">
      //           <svg
      //             xmlns="http://www.w3.org/2000/svg"
      //             className="h-6 w-6 sm:h-8 sm:w-8 text-green-600"
      //             fill="none"
      //             viewBox="0 0 24 24"
      //             stroke="currentColor">
      //             <path
      //               strokeLinecap="round"
      //               strokeLinejoin="round"
      //               strokeWidth={2}
      //               d="M5 13l4 4L19 7"
      //             />
      //           </svg>
      //         </div>
      //       </div>

      //       <h3 className="text-lg sm:text-xl font-bold text-center text-gray-800 mb-2">
      //         Added to Cart!
      //       </h3>

           

           

      //       <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
      //         <button
      //           onClick={() => setShowPopup(false)}
      //           className="flex-1 py-2 px-4 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors text-sm sm:text-base">
      //           Continue Shopping
      //         </button>
      //         <button
      //           onClick={() => {
      //             setShowPopup(false);
      //             router.push("/cart");
      //           }}
      //           className="flex-1 py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm sm:text-base">
      //           View Cart
      //         </button>
      //       </div>
      //     </div>
      //   </div>
  );
};

export default SuccessPopup;
