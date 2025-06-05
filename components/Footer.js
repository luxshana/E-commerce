"use client";

import Link from "next/link";

const Footer = () => (
  <footer className="footer">
    <div className="footerNav">
      <ul>
        <li>
          <Link href="/shopcard">
            <img src="/mycard.png" alt="My Card" />
          </Link>
        </li>
        <li>
          <Link href="/myfav">
            <img src="/star.png" alt="Favorites" />
          </Link>
        </li>
        <li>
          <Link href="/">
            <img src="/home.png" alt="Home" />
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
