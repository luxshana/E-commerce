/* app/checkout/page.js */
"use client"; // Mark as Client Component for useState, useEffect, and navigation
import Head from "next/head";
import React, { useState, useEffect } from "react";
import Link from "next/link";
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


  return (
    <div className="ck-container">
      <div className="bg-yellow-400 p-6 m-2 rounded-lg shadow-lg text-center">
        <h2 className="text-2xl font-bold mb-6 text-left">Identifiez-vous ?</h2>
        <div className="flex space-x-4 mb-6">
          
          <button className="bg-white border-black border-2 text-black px-6 py-4 rounded flex-1">
            <Link href="/login">
            <div className="flex items-center justify-center flex-col">
              <div>
                <img src="/user.png" alt="Login" width={50} height={50} />
              </div>
              <div>Me connecter</div>
            </div>
              </Link>
          </button>
        
           
          <button className="bg-white border-black border-2 text-black  px-6 py-4 rounded flex-1 ">
            <Link href="/choose">
            <div className="flex items-center justify-center flex-col">
              <div>
                <img src="/user.png" alt="Login" width={50} height={50} />
              </div>
              <div>Continuer sans compte</div>
            </div>
            </Link>
          </button>
        
        </div>
        <hr />
        <div className="text-left">
          <button className=" mt-2 bg-white text-black px-4 py-2 rounded">
            ou Créez un compte rapide
          </button>
        </div>
      </div>
    </div>
    
  );
}
