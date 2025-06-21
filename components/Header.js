"use client"; // Client component for dynamic navigation and state

import React, { useState, useContext } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { CartContext } from "./CartContext";
import LiveSearch from "./LiveSearch";
import CatList from "./CatList";
import Image from "next/image";

export default function Header({ loggedInUser, onLogout }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const context = useContext(CartContext);
  const { totalItems = 0 } = context || {};
  const router = useRouter();
  const pathname = usePathname(); // Get current route

  const toggleMenu = () => setMenuOpen(!menuOpen);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    onLogout(); // Update state in parent component
    toggleMenu(); // Close the menu
    router.push("/login"); // Redirect to login page
  };

  const handleBack = () => {
    router.back(); // Go back to the previous page
  };

  return (
    <>
      <header className="header">
        <div className="flex justify-center items-center">
        
        {/* Conditionally render logo or back button based on route */}
        {pathname === "/" ? (
          <>
           <button
            className="menu-toggle md:hidden pr-2 text-2xl"
            onClick={toggleMenu}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
          >
            ☰
          </button>
          <Link href="/">
            <div className="logo">
              <Image
                src="/logo.png"
                alt="Logo"
                width={100} // specify the width of the image
                height={40} // specify the height of the image
              />{" "}
            </div>
          </Link>
          </>
        ) : (
          <div className="flex gap-1">
        <button
  onClick={handleBack}
  className="bkme flex items-center justify-center rounded-full px-1 font-bold text-lg text-gray-800"
  aria-label="Go back to previous page"
>
  <img src="https://maboutique.app/godfather/images/back.svg" />
 </button>
         <Link href="/">
            <div className="logo">
              <Image
                src="/logo.png"
                alt="Logo"
                width={100} // specify the width of the image
                height={40} // specify the height of the image
              />{" "}
            </div>
          </Link>
          </div>
        )}
        </div>
        <div className="header_btns">
          
          {/* <div className="simpleSearch">
            <LiveSearch />
          </div> */}
           <Link href="tel:0760774934">
            <div className="cart-info" aria-label="Cart summary">
              <img src="https://maboutique.app/godfather/images/callme.png" alt="Cart" width={40} height={40} />
              </div>
            
          </Link>
          <Link href="/cart">
            <div className="cart-info" aria-label="Cart summary">
              <Image src="/basket.png" alt="Cart" width={40} height={40} />
              <span className="absolute -top-2 -right-2 text-white bg-[#a70000] text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center" role="img" aria-label="Cart">
                {totalItems}
              </span>
            </div>
          </Link>

      
        </div>
      </header>

      <nav className={`side-menu ${menuOpen ? "open" : ""}`}>
        <button
          className="close-btn"
          onClick={toggleMenu}
          aria-label="Close menu"
        >
          ×
        </button>
        <ul>
          <li>
            <Link href="/" onClick={toggleMenu}>
              Home
            </Link>
          </li>
          <li>
            <Link href="/categories" onClick={toggleMenu}>
              Categories
            </Link>
          </li>
          <li>
            <details>
              <summary>Categories Menu</summary>
              <div className="spl_cat_list">
                <CatList />
              </div>
            </details>
          </li>
          <li>
            <Link href="/cart" onClick={toggleMenu}>
              Cart
            </Link>
          </li>
          <li>
            <Link href="/checkout" onClick={toggleMenu}>
              Checkout
            </Link>
          </li>
          <li>
            <Link href="/login" onClick={toggleMenu}>
              Login
            </Link>
          </li>
          {/* Conditionally render Register or Profile based on login status */}
          {!loggedInUser ? (
            <li>
              <Link href="/register" onClick={toggleMenu}>
                Register
              </Link>
            </li>
          ) : (
            <>
              <li>
                <Link href="/profile" onClick={toggleMenu}>
                  Profile
                </Link>
              </li>
              <li>
                <button
                  onClick={handleLogout}
                  style={{
                    background: "none",
                    border: "none",
                    color: "inherit",
                    cursor: "pointer",
                  }}
                >
                  Logout
                </button>
              </li>
            </>
          )}
          <li>
            <Link href="/shopcard" onClick={toggleMenu}>
              Mycard
            </Link>
          </li>
          <li>
            <Link href="/myfav" onClick={toggleMenu}>
              My Products
            </Link>
          </li>
        </ul>
      </nav>

      {menuOpen && <div className="overlay" onClick={toggleMenu}></div>}
    </>
  );
}
