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
    <div className={`w-full transition-all duration-300 bg-green-500 ${isScrolled ? 'fixed top-0 left-0 z-50 bg-white shadow-md' : 'h-[50vh]'}`}>
      <div className="slider-container relative w-full overflow-hidden">
      <Swiper
        modules={[Autoplay]}
        loop={true}
        autoplay={{ delay: 3000, disableOnInteraction: false }}
        spaceBetween={20}
        slidesPerView={1}
      >
        {promos.map((promo) => (
          <SwiperSlide key={promo.id}>
            <a href={promo.link}>
              <div className="pitem">
                <div className="pcont">
                  <div className="inme">
                    {/* <h4>{promo.title}</h4>
                    <p>{promo.texts}</p> */}
                  </div>
                </div>
                <div className="pimg">
                  {promo.image_web && (
                    <Image
                      src={`https://orange-wolf-342633.hostingersite.com/uploads/promo_images/${promo.image_web}`}
                      alt={promo.title}
                      width={3600} // Set a reasonable width based on your design
                      height={400} // Set a reasonable height based on your design
                      priority={true} // Optional: prioritize loading for promos
                      style={{ width: "100%", height: "auto" }} // Maintain responsiveness
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
