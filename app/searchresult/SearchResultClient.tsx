"use client";

import { useContext } from "react";
import { useSearchParams } from "next/navigation";
import { CartContext } from "@/components/CartContext";

const SearchResultClient = () => {
  const searchParams = useSearchParams();
  // const q = searchParams.get("q") || "";

  const cartContext = useContext(CartContext);
  if (!cartContext) {
    throw new Error(
      "CartContext is undefined. Make sure your app is wrapped in <CartProvider>"
    );
  }

  // const { addToCart } = cartContext;

  // const [results, setResults] = useState([]);
  // const [loading, setLoading] = useState(true);
  // const [showPopup, setShowPopup] = useState(false);

  return <div>{/* your search result UI */}</div>;
};

export default SearchResultClient;
