"use client";

import { useEffect, useState } from "react";
import { fetchPromos } from "../lib/api";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import Image from "next/image";

export default function PromoSlider() {
  const [promos, setPromos] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
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
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (loading)
    return (
      <div className="loading Beds">
        <div className="gen_preloader1"></div>
      </div>
    );
  if (error) return <div>Error: {error.message}</div>;
  return (
    <div className="w-full relative">
      <div className="relative w-full h-[400px] md:h-[500px] bg-transparent">
        <div
          className="absolute inset-0 overflow-hidden"
          style={{
            clipPath: "ellipse(100% 100% at 50% 0%)",
            backgroundColor: "transparent",
          }}>
          <iframe
            
            className="w-full h-full"
            src="https://www.youtube.com/embed/VZU-EyQfUXQ?si=g7xO5KZp3IVEbQX7"
            title="YouTube video"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      </div>
    </div>
    // <div className="w-full relative">
    //     <div className="relative w-full h-[400px] md:h-[500px] bg-transparent">
    //         <div className="absolute inset-0 overflow-hidden" style={{
    //             clipPath: 'ellipse(100% 100% at 50% 0%)',
    //             backgroundColor: 'transparent'
    //         }}>
    //             <Swiper
    //                 modules={[Autoplay]}
    //                 loop={true}
    //                 autoplay={{ delay: 3000, disableOnInteraction: false }}
    //                 spaceBetween={0}
    //                 slidesPerView={1}
    //                 className="h-full"
    //             >
    //                 {promos.map((promo) => (
    //                     <SwiperSlide key={promo.id}>
    //                         <a href={promo.link} className="block w-full h-full">
    //                             <div className="relative w-full h-full">
    //                                 {promo.image_web && (
    //                                     <Image
    //                                         src={`https://orange-wolf-342633.hostingersite.com/uploads/promo_images/${promo.image_web}`}
    //                                         alt={promo.title}
    //                                         fill
    //                                         className="object-cover"
    //                                         priority={true}
    //                                     />
    //                                 )}
    //                             </div>
    //                         </a>
    //                     </SwiperSlide>
    //                 ))}
    //             </Swiper>
    //         </div>
    //     </div>
    // </div>
  );
}
