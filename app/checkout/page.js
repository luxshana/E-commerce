/* app/checkout/page.js */
"use client"; // Mark as Client Component for useState, useEffect, and navigation
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { checkout, fetchDeliverySlots } from "../../lib/api"; // Adjust path as needed
import ShippingAddressAutocomplete from "../../components/ShippingAddressAutocomplete"; // Adjust path as needed

const IMAGE_BASE_URL =
  "https://orange-wolf-342633.hostingersite.com/uploads/products/";

export default function CheckoutPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    email: "",
    full_name: "",
    address: "",
    phone_number: "",
    password: "",
    shipping_address: "",
    payment_method: "cash",
    delivery_method: "1",
    delivery_date: "",
    delivery_time: "",
    table_number: "",
    delivery_pincode: "",
    delivery_city: "",
    distance_value: 0,
    use_points: 0,
    street_number: "",
    road: "",
  });

  const [cart, setCart] = useState([]);
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [deliverySlots, setDeliverySlots] = useState({});
  const [deliveryFee, setDeliveryFee] = useState(0);
  const [subTotal, setSubTotal] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [error, setError] = useState(null);

  // Load cart
  useEffect(() => {
    try {
      const data = sessionStorage.getItem("cart");
      if (data) {
        const cartData = JSON.parse(data);
        setCart(cartData);
        calculateTotalPrice(
          cartData,
          formData.use_points,
          formData.distance_value
        );
      }
    } catch {
      setCart([]);
    }
  }, []);

  // Load logged-in user
  useEffect(() => {
    const userData = sessionStorage.getItem("user");
    if (userData) {
      const user = JSON.parse(userData);
      console.log("Parsed user from sessionStorage:", user);
      setLoggedInUser(user);
      setFormData((prev) => ({
        ...prev,
        email: user.email || "",
        full_name: user.full_name || user.username || "",
        phone_number: user.phone_number || "",
        address: user.address || "",
      }));
    }
  }, []);

  // Fetch delivery slots
  useEffect(() => {
    const fetchSlots = async () => {
      try {
        console.log(
          "Fetching slots for delivery_method:",
          formData.delivery_method
        );
        const slots = await fetchDeliverySlots(formData.delivery_method);
        setDeliverySlots(slots);
        setError(null);
        if (!slots[formData.delivery_date]) {
          setFormData((prev) => ({
            ...prev,
            delivery_date: "",
            delivery_time: "",
          }));
        }
      } catch (error) {
        console.error("Error fetching delivery slots:", error);
        setError("Failed to load delivery slots. Please try again.");
        setDeliverySlots({});
      }
    };
    if (formData.delivery_method === "1" || formData.delivery_method === "2") {
      fetchSlots();
    } else {
      setDeliverySlots({});
    }
  }, [formData.delivery_method]);

  // Calculate delivery fee and total price
  const calculateDeliveryFee = (distance) => {
    console.log(`Calculating delivery fee for distance: ${distance} km`);
    if (!distance || distance <= 0) return 0;
    if (distance <= 1.999) return 4;
    if (distance <= 4.999) return 6;
    if (distance <= 10) return 10;
    return 100;
  };

  const calculateTotalPrice = (
    cartItems,
    usePointsFlag,
    distance,
    pointsDiscountValue = loggedInUser
      ? Number(loggedInUser.user_points) || 0
      : 0
  ) => {
    console.log(
      `Calculating total price: cartItems=${cartItems.length}, usePointsFlag=${usePointsFlag}, distance=${distance}, points=${pointsDiscountValue}`
    );
    let subTotal = 0;
    cartItems.forEach((item) => {
      let itemTotal = item.quantity * item.price;
      if (item.choices) {
        Object.entries(item.choices).forEach(([choiceName, optionValue]) => {
          itemTotal +=
            (item.choicePrices?.[choiceName]?.[optionValue] || 0) *
            item.quantity;
        });
      }
      subTotal += itemTotal;
    });

    const fee =
      formData.delivery_method === "1"
        ? calculateDeliveryFee(Number(distance) || 0)
        : 0;
    const discount = usePointsFlag === 1 ? pointsDiscountValue : 0;

    console.log(
      `Subtotal: €${subTotal}, Delivery Fee: €${fee}, Points Discount: €${discount}`
    );
    setSubTotal(subTotal);
    setDeliveryFee(fee);
    setTotalPrice(subTotal + fee - discount);
  };

  useEffect(() => {
    calculateTotalPrice(cart, formData.use_points, formData.distance_value);
  }, [
    cart,
    formData.use_points,
    formData.distance_value,
    formData.delivery_method,
    loggedInUser,
  ]);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    const val = type === "number" ? (value === "" ? 0 : Number(value)) : value;
    console.log(`Checkout input change: ${name}=${val}`);
    setFormData((prev) => ({
      ...prev,
      [name]: val,
      ...(name === "delivery_date" ? { delivery_time: "" } : {}),
    }));
    if (name === "distance_value" || name === "use_points") {
      calculateTotalPrice(
        cart,
        name === "use_points" ? Number(value) : formData.use_points,
        name === "distance_value" ? Number(value) : formData.distance_value
      );
    }
  };

  const handleCheckout = async (e) => {
    e.preventDefault();
    console.log("Initiating checkout with formData:", formData);
    if (!cart.length) {
      alert("Your cart is empty. Please add items before checkout.");
      return;
    }

    const payload = { ...formData, cart };
    console.log("Checkout payload:", payload);

    try {
      const data = await checkout(payload);
      if (data.success) {
        alert("Order placed! Order ID: " + data.order_id);
        sessionStorage.setItem(
          "orderDetails",
          JSON.stringify({
            order_id: data.order_id,
            formData,
            payment_link_url: data.payment_link_url,
          })
        );
        sessionStorage.setItem("orderCart", JSON.stringify(cart));
        sessionStorage.removeItem("cart");
        setCart([]);

        setTimeout(() => {
          if (formData.payment_method === "card" && data.payment_link_url) {
            window.location.href = data.payment_link_url;
          } else {
            router.push("/order-confirmation");
          }
        }, 100);
      } else {
        alert("Checkout failed: " + (data.error || "Unknown error"));
      }
    } catch (error) {
      alert("Checkout error: " + error.message);
    }
  };

  const isDelivery = formData.delivery_method === "1";
  const isDineIn = formData.delivery_method === "3";
  const isTakeaway = formData.delivery_method === "2";

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        {cart.length === 0 ? (
          <div></div>
        ) : (
          <div className="flex-1 p-6 bg-gray-100 rounded-2xl">
            <h2 className="text-base font-medium mb-4">Order Summary:</h2>
            <div className="p-4 mb-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {cart.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white rounded-lg shadow-md flex items-center gap-4 p-4 cursor-pointer hover:shadow-lg transition"
                  >
                    <div className="flex-shrink-0">
                      <img
                        src={`${IMAGE_BASE_URL}${item.images?.[0] || "missing.png"}`}
                        alt={item.product_name}
                        className="w-24 h-24 object-cover rounded-md"
                      />
                    </div>
                    <div className="text-sm">
                      <p className="font-medium">{item.product_name}</p>
                      <p>Quantity: {item.quantity}</p>
                      <p>Price: €{(item.price * item.quantity).toFixed(2)}</p>
                      {item.choices && (
                        <p>
                          Choices:{" "}
                          {Object.entries(item.choices)
                            .map(([key, value]) => `${key}: ${value}`)
                            .join(", ")}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="text-sm">
              <p className="mb-2">Subtotal: €{subTotal.toFixed(2)}</p>
              <p className="mb-2">Delivery Fee: €{deliveryFee.toFixed(2)}</p>
              {formData.use_points === 1 && loggedInUser && (
                <p className="mb-2">
                  Points Discount: -€
                  {(Number(loggedInUser?.user_points) || 0).toFixed(2)}
                </p>
              )}
              <h2 className="text-lg font-semibold">
                Total: €{totalPrice.toFixed(2)}
              </h2>
            </div>
          </div>
        )}
        <div className="flex-1">
          {loggedInUser && (
            <div className="mb-5 p-4 bg-gray-100 rounded-lg">
              <p className="text-sm">
                You are logged in as <strong>{loggedInUser.username}</strong>.
              </p>
            </div>
          )}
          {error && (
            <div className="text-red-600 mb-4 text-sm">{error}</div>
          )}
          <div className="flex gap-2 mb-6">

            <button
              type="button"
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                isDelivery
                  ? "bg-black text-white"
                  : "bg-gray-100 text-gray-900 hover:bg-gray-200"
              }`}
              onClick={() =>
                setFormData((prev) => ({ ...prev, delivery_method: "1" }))
              }
            >
              Delivery
            </button>
            <button
              type="button"
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                isTakeaway
                  ? "bg-black text-white"
                  : "bg-gray-100 text-gray-900 hover:bg-gray-200"
              }`}
              onClick={() =>
                setFormData((prev) => ({ ...prev, delivery_method: "2" }))
              }
            >
              Takeaway
            </button>
            <button
              type="button"
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                isDineIn
                  ? "bg-black text-white"
                  : "bg-gray-100 text-gray-900 hover:bg-gray-200"
              }`}
              onClick={() =>
                setFormData((prev) => ({ ...prev, delivery_method: "3" }))
              }
            >
              Dine-In
            </button>
          </div>
          {cart.length === 0 ? (
            <div className="mt-6 p-6 border border-gray-200 rounded-lg text-center text-gray-700 text-lg">
              Your cart is empty. Please add items before checkout.
            </div>
          ) : (
            <div>
              {!loggedInUser && (
                <div className="space-y-4 mb-6">
                  <input
                    name="email"
                    type="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    readOnly={!!loggedInUser}
                    className="w-full p-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    name="full_name"
                    placeholder="Full Name"
                    value={formData.full_name}
                    onChange={handleChange}
                    required
                    readOnly={!!loggedInUser}
                    className="w-full p-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    name="address"
                    placeholder="Address"
                    value={formData.address}
                    onChange={handleChange}
                    required={isDelivery}
                    readOnly={!!loggedInUser}
                    className={`w-full p-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      isDelivery ? "block" : "hidden"
                    }`}
                  />
                  <input
                    name="phone_number"
                    placeholder="Phone Number"
                    value={formData.phone_number}
                    onChange={handleChange}
                    required
                    readOnly={!!loggedInUser}
                    className="hidden w-full p-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    name="password"
                    type="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="w-full p-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              )}
              {isDelivery && (
                <ShippingAddressAutocomplete
                  formData={formData}
                  setFormData={setFormData}
                  setError={setError}
                  calculateDeliveryFee={calculateDeliveryFee}
                  calculateTotalPrice={calculateTotalPrice}
                  cart={cart}
                />
              )}
              {(isDelivery || isTakeaway) && (
                <div className={`space-y-4 mb-6 ${isDelivery || isTakeaway ? "block" : "hidden"}`}>
                  <select
                    name="delivery_date"
                    value={formData.delivery_date}
                    onChange={handleChange}
                    required={isDelivery || isTakeaway}
                    className="w-full p-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Date</option>
                    {Object.keys(deliverySlots).map((date) => (
                      <option key={date} value={date}>
                        {date}
                      </option>
                    ))}
                  </select>
                  <select
                    name="delivery_time"
                    value={formData.delivery_time}
                    onChange={handleChange}
                    required={isDelivery || isTakeaway}
                    className="w-full p-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Time</option>
                    {formData.delivery_date &&
                      deliverySlots[formData.delivery_date]?.map((time) => (
                        <option key={time} value={time}>
                          {time}
                        </option>
                      ))}
                  </select>
                </div>
              )}
              {isDineIn && (
                <input
                  name="table_number"
                  placeholder="Table Number"
                  value={formData.table_number}
                  onChange={handleChange}
                  required={isDineIn}
                  className="w-full p-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
                />
              )}
              {loggedInUser && (
                <div className="mb-6">
                  <div className="flex items-center gap-2">
                    <label className="text-sm font-medium">Use Points?</label>
                    <button
                      type="button"
                      className={`px-4 py-2 rounded-md text-sm font-medium border border-gray-300 transition-colors ${
                        formData.use_points === 1
                          ? "bg-black text-white"
                          : "bg-gray-100 text-gray-900 hover:bg-gray-200"
                      }`}
                      onClick={() =>
                        setFormData((prev) => ({ ...prev, use_points: 1 }))
                      }
                    >
                      Yes {(Number(loggedInUser?.user_points) || 0).toFixed(2)}
                    </button>
                    <button
                      type="button"
                      className={`px-4 py-2 rounded-md text-sm font-medium border border-gray-300 transition-colors ${
                        formData.use_points === 0
                          ? "bg-black text-white"
                          : "bg-gray-100 text-gray-900 hover:bg-gray-200"
                      }`}
                      onClick={() =>
                        setFormData((prev) => ({ ...prev, use_points: 0 }))
                      }
                    >
                      No
                    </button>
                  </div>
                </div>
              )}
              <div className="mb-6">
                <div className="flex gap-2">
                  <label
                    className={`px-4 py-2 rounded-md text-sm font-medium cursor-pointer transition-colors ${
                      formData.payment_method === "cash"
                        ? "bg-black text-white"
                        : "bg-gray-100 text-gray-900 hover:bg-gray-200"
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment_method"
                      value="cash"
                      checked={formData.payment_method === "cash"}
                      onChange={handleChange}
                      className="hidden"
                    />
                    Cash
                  </label>
                  <label
                    className={`px-4 py-2 rounded-md text-sm font-medium cursor-pointer transition-colors ${
                      formData.payment_method === "card"
                        ? "bg-black text-white"
                        : "bg-gray-100 text-gray-900 hover:bg-gray-200"
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment_method"
                      value="card"
                      checked={formData.payment_method === "card"}
                      onChange={handleChange}
                      className="hidden"
                    />
                    Card
                  </label>
                </div>
              </div>
              <div>
                <button
                  className="w-full bg-blue-600 text-white py-3 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
                  onClick={handleCheckout}
                >
                  Place Order
                </button>
              </div>
            </div>
          )}
        </div>
        
      </div>
    </div>
  );
}