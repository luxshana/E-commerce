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
    <div className="success_popup">
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
  );
};

export default SuccessPopup;
