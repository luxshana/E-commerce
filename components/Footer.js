"use client";

import Link from "next/link";
import React, { useState } from "react";

export default function Footer() {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
    console.log("Menu toggled, menuOpen:", !menuOpen);
  };
  // const Footer = () => (
  return (
    <>
      <footer className="footer">
        <div className="footerNav">
          <ul>
            <li>
              <button
                className="menu-toggle"
                onClick={toggleMenu}
                aria-label={menuOpen ? "Close menu" : "Open menu"}>
                <img
                  src="https://maboutique.app/godfather/images/foodMenu.png"
                  alt="My Card"
                />
              </button>
              {/* <Link href="/shopcard">
            <img
              src="https://maboutique.app/godfather/images/foodMenu.png"
              alt="My Card"
            />
          </Link> */}
            </li>
            <li>
              <Link href="https://www.google.com/search?hl=en-LK&gl=lk&q=The+Godfather+93,+25+Ave+Marcel+Cachin,+93120+La+Courneuve,+France&ludocid=13094069777680323800&lsig=AB86z5Wu3ANz2IcHxTESSkrcBNBC#lrd=0x47e66df6d600cb49:0xb5b77b1662d054d8,3">
                <img src="/star.png" alt="Favorites" />
              </Link>
            </li>
            <li>
              <Link href="/">
                <img
                  src="https://maboutique.app/godfather/images/capGodFather.svg"
                  alt="Home"
                />
              </Link>
            </li>
            <li>
              <Link href="/cart">
                <img src="/basket.png" alt="Cart" />
              </Link>
            </li>
            <li>
              <Link href="/login">
                <img src="/user.png" alt="Login" />
              </Link>
            </li>
          </ul>
        </div>
      </footer>
      <nav className={`side-menu ${menuOpen ? "open" : ""}`}>
        <button
          className="close-btn"
          onClick={toggleMenu}
          aria-label="Close menu">
          ×
        </button>
        <ul>
          <li>
            <Link href="/" onClick={toggleMenu}>
              Home
            </Link>
          </li>
     
        </ul>
      </nav>
       {menuOpen && <div className="overlay" onClick={toggleMenu}></div>}
    </>
  );
}
