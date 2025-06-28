// components/Checkout.js
import Link from "next/link";
import Image from "next/image";
export default function Checkout() {
  return (
    <div className="ck-container">
      <div className="bg-white p-6 m-2 rounded-lg ">
        <div className="text-sm text-gray-600 mb-4 text-left">
          {/* <Link href="#" className="underline ">&lt; Back to connect</Link> */}
          <p className="mt-2 text-left">You continue as a guest.</p>
        </div>
        <h2 className="text-2xl font-bold mb-6 text-left">
          Choose your option
        </h2>
        <div className="flex justify-between mb-6 gap-2">
          <button className="bg-white border-black border-2 text-black px-6 py-4 rounded flex-1">
            <Link href="/takeaway">
              <div className="flex items-center justify-center flex-col">
                <div>
                  <Image width={80} height={40} src="/delivery.png" />
                </div>
                <div> Take away</div>
              </div>
            </Link>
          </button>

          <button className="bg-white border-black border-2 text-black  px-6 py-4 rounded flex-1 ">
            <Link href="/delivery">
              <div className="flex items-center justify-center flex-col">
                <div>
                  <Image width={80} height={40} src="/takeaway.png" />
                </div>
                <div> Delivery</div>
              </div>
            </Link>
          </button>
        </div>
        <button className="w-full bg-black text-white p-4 rounded-lg text-center">
          Checkout as guest
        </button>
      </div>
    </div>
  );
}
