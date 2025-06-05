"use client"; // This component uses useState and useEffect

import React, { useEffect, useState } from "react";
import Image from "next/image"; // Import Next.js Image component
import { fetchUserOrders } from "../lib/api"; // Adjust path to your api.js
import "../styles/prodstyle.css"; // Adjust path to your CSS file

const IMAGE_BASE_URL =
  "https://orange-wolf-342633.hostingersite.com/uploads/products/";

export default function OrderHistory({ userId }) {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true); // Add loading state
  const [statusFilter, setStatusFilter] = useState("all");
  const [statusOptions, setStatusOptions] = useState(["all"]);

  useEffect(() => {
    if (!userId) {
      setLoading(false); // No user ID, stop loading
      return;
    }

    setLoading(true); // Start loading
    setError(null); // Clear previous errors

    fetchUserOrders(userId)
      .then((data) => {
        if (data.error) {
          setError(data.error);
        } else {
          setOrders(data.orders || []); // Ensure orders is an array
          // Extract unique status_name values for filter options
          const uniqueStatuses = [
            "all",
            ...new Set((data.orders || []).map((order) => order.status_name)),
          ];
          setStatusOptions(uniqueStatuses);
        }
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false)); // End loading regardless of success/failure
  }, [userId]);

  if (loading) {
    return (
      <div className="loading">
        <div className="gen_preloader1"></div>{" "}
        {/* Assuming gen_preloader1 is defined in global CSS */}
      </div>
    );
  }

  if (error)
    return <div style={{ padding: "10px", color: "red" }}>Error: {error}</div>;
  if (!orders.length)
    return <div style={{ padding: "10px" }}>No orders found.</div>;

  // Filter orders based on selected status
  const filteredOrders =
    statusFilter === "all"
      ? orders
      : orders.filter((order) => order.status_name === statusFilter);

  return (
    <div className="order_list_holder">
      {/* Status Filter Dropdown */}
      <div style={{ marginBottom: "20px", textAlign: "left" }}>
        <label htmlFor="statusFilter">Filter by Status: </label>
        <select
          id="statusFilter"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          style={{
            padding: "8px",
            borderRadius: "5px",
            border: "1px solid #ccc",
          }}
        >
          {statusOptions.map((status) => (
            <option key={status} value={status}>
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </option>
          ))}
        </select>
      </div>

      {filteredOrders.length === 0 && statusFilter !== "all" && (
        <div style={{ padding: "10px", color: "gray" }}>
          No orders found for <span>{statusFilter}</span> status.
        </div>
      )}

      {filteredOrders.map((order) => (
        <div key={order.order_id} className="order_list">
          <div className="prod_single_info">
            <h3>
              Order #{order.order_id} - Status: {order.status_name}
            </h3>
            <p>
              Delivery: {order.delivery_date} at {order.delivery_time}
            </p>
            <p>
              Address: {order.shipping_address}, {order.delivery_city} -{" "}
              {order.delivery_pincode}
            </p>
            <p>
              Contact: {order.full_name}, {order.phone_number}, {order.email}
            </p>
            <details style={{ marginTop: "20px" }}>
              <summary style={{ fontWeight: "bold", cursor: "pointer" }}>
                Show Order Items
              </summary>
              <ul
                className="OrderItems"
                style={{ paddingLeft: "20px", marginTop: "10px" }}
              >
                {order.items &&
                  Array.isArray(order.items) &&
                  order.items.map((item) => {
                    let images = [];
                    try {
                      images = item.images ? JSON.parse(item.images) : [];
                    } catch (e) {
                      console.error(
                        "Error parsing images for item:",
                        item.id,
                        e
                      );
                    }

                    return (
                      <li key={item.id} style={{ marginBottom: "10px" }}>
                        <div
                          className="prod_single_card"
                          style={{ display: "flex", alignItems: "center" }}
                        >
                          <div className="prod_single_img">
                            {images.length > 0 ? (
                              <Image
                                src={`${IMAGE_BASE_URL}${images[0]}`} // Use first image for thumbnail
                                alt={item.product_name || "Product"}
                                width={50} // Required by Next/Image
                                height={50} // Required by Next/Image
                                objectFit="cover" // Optional, for styling
                                style={{
                                  marginLeft: "10px",
                                  borderRadius: "4px",
                                }}
                                onError={(e) => {
                                  // Fallback for image error
                                  e.target.onerror = null;
                                  e.target.srcset = ""; // Clear srcset
                                  e.target.src = `${IMAGE_BASE_URL}missing.png`;
                                }}
                              />
                            ) : (
                              <Image
                                src={`${IMAGE_BASE_URL}missing.png`}
                                alt="Missing Product"
                                width={50} // Required
                                height={50} // Required
                                objectFit="cover"
                                style={{
                                  marginLeft: "10px",
                                  borderRadius: "4px",
                                }}
                              />
                            )}
                          </div>
                          <div
                            className="prod_single_info"
                            style={{ marginLeft: "10px" }}
                          >
                            <p>
                              <strong>
                                {item.product_name ||
                                  `Product ${item.product_id}`}
                              </strong>
                              <br />
                              Quantity: {item.quantity}, Price: €
                              {parseFloat(item.price).toFixed(2)}
                            </p>
                          </div>
                        </div>
                      </li>
                    );
                  })}
              </ul>
            </details>
          </div>
          {order.status !== "paid" && order.payment_link_url && (
            <a
              href={order.payment_link_url}
              target="_blank"
              rel="noopener noreferrer"
            >
              <button
                className="btnStyle1"
                aria-label={`Pay for order ${order.order_id}`}
                style={{
                  margin: "10px",
                  padding: "10px 20px",
                  cursor: "pointer",
                  backgroundColor: "#28a745",
                  color: "white",
                  border: "none",
                  borderRadius: "5px",
                }}
              >
                Pay Now €{parseFloat(order.total_price).toFixed(2)}
              </button>
            </a>
          )}
        </div>
      ))}
    </div>
  );
}
