"use client"

import React from "react";
import Image from 'next/image';
import Link from "next/link";
import { useRef } from "react";

import HeroData from "@/jds/hp/heroprod.json"
import { CaretCircleLeft, CaretCircleRight } from "@phosphor-icons/react";

import { Swiper, SwiperSlide } from "swiper/react";
import { Swiper as SwiperType } from "swiper"; // Import Swiper type
import { Autoplay, Thumbs, Pagination, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/autoplay";
import "swiper/css/thumbs";
import "swiper/css/pagination";
import "swiper/css/navigation";


export default function Hero() {

    const h_slides = HeroData.slides;
    const h_staticSlide = HeroData.static;
    const swiperRef = useRef<SwiperType | null>(null);

    return (
        <section>

            <div className="h-20 bg-black text-white flex items-center justify-center">Header space</div>

            <div className="grid grid-cols-3 py-2 px-4">
                <div className="relative col-span-2">

                    <Swiper
                        loop={true}
                        autoplay={{ delay: 3000 }}
                        modules={[Autoplay, Thumbs, Pagination, Navigation]}
                        className="w-full h-[75vh] rounded-lg"
                        pagination={{
                            clickable: true,
                            type: 'bullets',
                            bulletClass: 'swiper-pagination-bullet', // Custom class for bullets
                            bulletActiveClass: 'swiper-pagination-bullet-active', // Custom active bullet class
                        }}
                        onSwiper={(swiper) => (swiperRef.current = swiper)} // Store swiper instance
                    >
                        {h_slides.map((slide) => (
                            <SwiperSlide key={slide.id}>
                                {/* Main ---------------------------------------------------------------------- */}
                                <div className="h-full relative">
                                    <Image
                                        src={slide.imageUrl}
                                        alt=""
                                        width={1920}
                                        height={slide.id !== 1 ? "800" : "1080"}
                                        className={`object-cover object-center h-full`}
                                    />

                                    <div className={`absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-50 text-white rounded-lg`}>
                                        <h1 className="text-5xl font-bold">{slide.headline}</h1>
                                        <h2 className="my-3 text-xl">{slide.subheadline}</h2>
                                        <Link href={slide.ctaLink}>
                                            <button> {slide.cta} </button>
                                        </Link>
                                    </div>
                                </div>
                            </SwiperSlide>
                        ))}

                    </Swiper>

                    {/* Custom Navigation Buttons */}
                    <div
                        className="absolute left-2 top-1/2 -translate-y-1/2 z-10 cursor-pointer hover:bg-black rounded-full"
                        onClick={() => swiperRef.current?.slidePrev()}
                    >
                        <CaretCircleLeft size={32} color="orange" weight="duotone" />
                    </div>

                    <div
                        className="absolute right-2 top-1/2 -translate-y-1/2 z-10 cursor-pointer hover:bg-black rounded-full"
                        onClick={() => swiperRef.current?.slideNext()}
                    >
                        <CaretCircleRight size={32} color="orange" weight="duotone" />
                    </div>
                </div>

                {/* Static ---------------------------------------------------------------------- */}
                {h_staticSlide !== null && (
                    <div key={h_staticSlide.id} className="p-4 rounded-lg mx-2 h-full bg-bru1 shadow-2xl flex flex-col">
                        <h3 className="font-bold tracking-wider text-xl mb-3">{h_staticSlide.title}</h3>
                        <div className="grid grid-cols-2 gap-2 flex-1">
                            {h_staticSlide.prods.map((prod, index) => (
                                <div key={index} className="p-2 flex flex-col justify-center items-center">
                                    <Image
                                        src={prod.prodImgUrl}
                                        width={1920}
                                        height={900}
                                        alt={prod.prodLabel}
                                        className="shadow-lg border-2 border-bru2 rounded-md hover:shadow-xl"
                                    />
                                    <Link href={prod.prodLink} className="text-xs font-bold tracking-wider hover:underline cursor-pointer mt-2 text-center">
                                        {prod.prodLabel}
                                    </Link>
                                </div>
                            ))}
                        </div>


                    </div>
                )}

            </div>
        </section>
    )
}




// {
//     "id": 1,
//     "imageUrl": "https://ridbizecom.s3.ap-southeast-1.amazonaws.com/buyerpanda.com/hp/hero1.webp",
//     "headline": "Big Winter Sale",
//     "subheadline": "Get up to 50% off on all items",
//     "cta": "Show Now",
//     "ctaLink": "/shop",
//     "staticId": null
// },



// "use client";

// import React from "react";
// import Image from "next/image";
// import Link from "next/link";
// import { CaretRight, CaretLeft} from '@phosphor-icons/react'
// import { Carousel } from "react-responsive-carousel";
// import "react-responsive-carousel/lib/styles/carousel.min.css";


// const Hero = () => {
//     const slides = [
//         {
//             id: 1,
//             imageUrl: "https://ridbizecom.s3.ap-southeast-1.amazonaws.com/buyerpanda.com/hp/hero1.webp",
//             title: "Big Winter Sale!",
//             subtitle: "Get up to 50% off on all items.",
//             cta: "Shop Now",
//             link: "/shop",
//         },
//         {
//             id: 2,
//             imageUrl: "https://ridbizecom.s3.ap-southeast-1.amazonaws.com/buyerpanda.com/hp/hero2.webp",
//             title: "New Arrivals!",
//             subtitle: "Check out the latest trends.",
//             cta: "Explore",
//             link: "/new-arrivals",
//         },
//         {
//             id: 3,
//             imageUrl: "https://ridbizecom.s3.ap-southeast-1.amazonaws.com/buyerpanda.com/hp/hero3.webp",
//             title: "Exclusive Deals",
//             subtitle: "Limited-time offers just for you.",
//             cta: "Grab Now",
//             link: "/deals",
//         },
//     ];

//     return (
//         <section className="relative w-full h-[500px] md:h-[600px] lg:h-[700px]">
//             <Carousel
//                 autoPlay
//                 infiniteLoop
//                 showThumbs={false}
//                 showStatus={false}
//                 interval={5000}
//                 swipeable
//                 emulateTouch
//                 dynamicHeight={false}
//                 centerMode={false}
//                 showArrows={true}

//                 renderArrowPrev={(onClickHandler, hasPrev, label) =>
//                     hasPrev && (
//                         <button
//                             onClick={onClickHandler}
//                             title={label}
//                             className="absolute left-5 top-1/2 z-10 bg-black/50 p-2 rounded-full border-0"
//                         >
//                             <CaretLeft size={20} />
//                         </button>
//                     )
//                 }
//                 renderArrowNext={(onClickHandler, hasNext, label) =>
//                     hasNext && (
//                         <button
//                             onClick={onClickHandler}
//                             title={label}
//                             className="absolute right-5 top-1/2 z-10 bg-black/50 p-2 rounded-full border-0"
//                         >
//                             <CaretRight size={20} />
//                         </button>
//                     )
//                 }

//             >
//                 {slides.map((slide) => (
//                     <div key={slide.id} className="relative w-full md:h-[600px] max-h-screen flex items-center justify-center">
//                         <Image
//                             src={slide.imageUrl}
//                             alt={slide.title}
//                             width={1200}
//                             height={800}
//                             className=""
//                             priority
//                         />
//                         <div className="absolute inset-0 flex flex-col items-center justify-center text-white bg-black bg-opacity-60 p-6 text-center">
//                             <h2 className="text-5xl md:text-7xl font-bold">{slide.title}</h2>
//                             <p className="text-lg md:text-xl mt-2 text-bru1">{slide.subtitle}</p>
//                             <Link href={slide.link}>
//                                 <button className="mt-4 bg-bru5 px-6 text-lg">
//                                     {slide.cta}
//                                 </button>
//                             </Link>
//                         </div>
//                     </div>
//                 ))}
//             </Carousel>
//         </section>
//     );
// };

// export default Hero;
