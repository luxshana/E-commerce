// components/SliderMenu.js
"use client"; // <--- Add this line at the very top

import Link from "next/link";
import styles from "../styles/SliderMenu.module.css"; // Create this CSS module

const SliderMenu = ({ isOpen, onClose }) => {
  return (
    <div className={`${styles.sliderMenu} ${isOpen ? styles.open : ""}`}>
      <button className={styles.closeButton} onClick={onClose}>
        &times; {/* HTML entity for 'x' */}
      </button>
      <nav className={styles.menuNav}>
        <ul>
          <li>
            <Link href="/">
              <p onClick={onClose}>Home</p> {/* Close menu on link click */}
            </Link>
          </li>
          <li>
            <Link href="/about">
              <p onClick={onClose}>About</p>
            </Link>
          </li>
          <li>
            <Link href="/services">
              <p onClick={onClose}>Services</p>
            </Link>
          </li>
          <li>
            <Link href="/contact">
              <p onClick={onClose}>Contact</p>
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default SliderMenu;
