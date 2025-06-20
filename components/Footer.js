"use client";

import Link from "next/link";

const Footer = () => (
  <footer className="footer">
    <div className="footerNav">
      <ul>
        <li>
           <button
            className="menu-toggle"
            // onClick={toggleMenu}
            // aria-label={menuOpen ? "Close menu" : "Open menu"}
          >
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
          <Link href="/myfav">
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
);

export default Footer;
