/* app/cart/page.js */
import Link from "next/link";
import Cart from "../../components/Cart";

// Note: This is a Server Component by default
export default function CartPage() {
  return (
    <div className="ck-container">
     
      <Cart />
      <div className="go_checkout">
        <Link href="/checkout">
          <button className="btnStyle1">Proceed to Checkout</button>
        </Link>
      </div> 
    </div>
  );
}
