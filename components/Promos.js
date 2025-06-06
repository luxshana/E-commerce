"use client"; // Client component for dynamic fetching and Swiper functionality

import { useEffect, useState } from "react";
import { fetchPromos } from "../lib/api";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules"; // Only Autoplay is needed
import "swiper/css";
import Image from "next/image"; // Import Next.js Image component

export default function PromoSlider() {
  const [promos, setPromos] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true); // loading state
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    fetchPromos(2)
      .then((data) => {
        setPromos(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err);
        setLoading(false);
      });
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (loading)
    return (
      <div className="loading Beds">
        <div className="gen_preloader1"></div>
      </div>
    );
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="w-full transition-all duration-300 bg-green-500 border-2 border-indigo-600 border-b-4xl  relative overflow-hidden ">
      {/* Pseudo-element for semicircle bottom border */}
      <div className="slider-container relative w-full overflow-hidden">
        <Swiper
          modules={[Autoplay]}
          loop={true}
          autoplay={{ delay: 3000, disableOnInteraction: false }}
          spaceBetween={0}
          slidesPerView={1}
        >
          {promos.map((promo) => (
            <SwiperSlide key={promo.id}>
              <a href={promo.link} className="block w-full h-full">
                <div className="pitem w-full h-full">
                  <div className="pimg w-full h-full">
                    {promo.image_web && (
                      <Image
                        src={`https://orange-wolf-342633.hostingersite.com/uploads/promo_images/${promo.image_web}`}
                        alt={promo.title}
                        fill
                        className="object-cover"
                        priority={true}
                      />
                    )}
                  </div>
                </div>
              </a>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
}