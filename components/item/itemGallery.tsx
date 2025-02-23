/* eslint-disable @next/next/no-img-element */
"use client"

// A. Imports
import React, { useEffect, useState, Suspense } from "react"
import { useParams } from "next/navigation"
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Thumbs } from "swiper/modules";
import "swiper/css";
import "swiper/css/autoplay";
import "swiper/css/thumbs";
import { CaretCircleLeft, CaretCircleRight } from "@phosphor-icons/react";


// B. Interface & Props
// interface smth {}
const v_TEMPrcdItemSkuImgs = [
    "https://images.unsplash.com/photo-1519681393784-d120267933ba",
    "https://images.unsplash.com/photo-1516912481808-3406841bd33c",
    "https://images.unsplash.com/photo-1521747116042-5a810fda9664",
    "https://images.unsplash.com/photo-1481349518771-20055b2a7b24",
    "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df",
    "https://images.unsplash.com/photo-1444090542259-0af8fa96557e",
    "https://images.unsplash.com/photo-1504439468489-c8920d796a29",
    "https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0"
];


export default function ItemGallerySuspense() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <ItemGallery />
        </Suspense>
    )
}

// C. Main function
const ItemGallery = () => {

    // C1. State Variable
    const [v_loading, setLoading] = useState<boolean>(true);
    const [v_error, setError] = useState<string | null>('');
    // const [v_rcdItemSkuImgs, setItemSkuImgs] = useState();
    const [selectedImage, setSelectedImage] = useState<string>(v_TEMPrcdItemSkuImgs[0]);
    const [isImageFullOpen, setIsImageFullOpen] = useState<boolean>(false);




    //Nav R1: Read Value from URL {Dynamic Route Parameters}
    const params = useParams();
    const v_itemmid = params.id ? Number(params.id) : null; // Convert to number if needed


    //Nav R2: useEffect + C2. Define useEffect
    useEffect(() => {
        const fetchItemReg = async () => {
            if (!v_itemmid) return;
            setLoading(true);
            setError(null);
            try {
                // C.1: Prepare ASKFOR and CONDITION.
                const v_askfor = 'ITEMSKU';
                const v_cnd = `itemmid=${v_itemmid}`;
                const v_epRt = `/api/item/?askfor=${v_askfor}&cnd=${v_cnd}`;

                // C.2: Call Route
                const v_resRt = await fetch(v_epRt, {
                    method: "GET",
                    headers: { "Content-Type": "application/json" },
                });

                // C.3: Extract JSON-Object.
                const v_resRtWrap = await v_resRt.json();        // Route Return-Build Full Part
                const v_resRtStr = v_resRtWrap.data;             // Route Return-Build Data Part in JSON-String Format
                const v_resRtData = v_resRtStr.map(JSON.parse);  // Route Return-Build Data Part in JSON-ObjectFormat

                // C.4: Load to State Variable.
                console.log(v_resRtData);
                // setItemSkuImgs(v_resRtData);
            } catch (err) {
                console.error("❌ Fetch Error:", err);
                setError((err as Error).message);
            } finally {
                setLoading(false);
            }
        };

        fetchItemReg();
    }, [v_itemmid]);

    useEffect(() => {   //for image sliding
        const interval = setInterval(() => {
            setSelectedImage((prev) => {
                const currentIndex = v_TEMPrcdItemSkuImgs.findIndex((img) => img === prev);
                const nextIndex = (currentIndex + 1) % v_TEMPrcdItemSkuImgs.length;
                return v_TEMPrcdItemSkuImgs[nextIndex];
            });
        }, 3000); // Auto-switch every 3 seconds

        return () => clearInterval(interval);
    }, []);

    const handleImageArrowClick = (dir: string) => {
        setSelectedImage((prev) => {
            const currentIndex = v_TEMPrcdItemSkuImgs.findIndex((img) => img === prev);
            let index = currentIndex;

            if (dir === "prev") {
                index = (currentIndex - 1 + v_TEMPrcdItemSkuImgs.length) % v_TEMPrcdItemSkuImgs.length;
            } else if (dir === "next") {
                index = (currentIndex + 1) % v_TEMPrcdItemSkuImgs.length;
            }

            return v_TEMPrcdItemSkuImgs[index];
        });
    };



    return (
        <div>
            {v_loading && "Loading..."}
            {v_error ? v_error : "Failed to display images"}

            {/* Nav R3? */}
            {v_TEMPrcdItemSkuImgs ? (

                <div className="flex gap-4 p-4">

                    {/* Left Side: Image Thumbnails */}
                    <div>
                        <Swiper
                            direction="vertical"
                            spaceBetween={10}
                            slidesPerView="auto"
                            loop={false}
                            autoplay={{ delay: 3000 }}
                            modules={[Autoplay]}
                            className="max-h-[60vh]"
                        >
                            {v_TEMPrcdItemSkuImgs.map((img, index) => (
                                <SwiperSlide key={index}>
                                    <img
                                        src={img}
                                        alt="Thumbnail"
                                        className={`w-14 h-14 object-cover rounded cursor-pointer hover:scale-110 duration-300 ${selectedImage === img ? "border-2 border-blue-500" : ""
                                            }`}
                                        onClick={() => setSelectedImage(img)}
                                    />
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    </div>

                    {/* Right Side: Large Displayed Image + Arrows*/}
                    <div className="flex items-center relative">
                        <img src={selectedImage} alt="Selected" className="w-[450px] h-[60vh] object-cover rounded-lg shadow-lg cursor-pointer" onClick={() => setIsImageFullOpen(true)} />
                        <CaretCircleLeft size={32} weight="duotone" color="white" className="absolute top-[50%] left-0 z-2 cursor-pointer" onClick={() => handleImageArrowClick('prev')} />
                        <CaretCircleRight size={32} weight="duotone" color="white" className="absolute top-[50%] right-0 z-2 cursor-pointer" onClick={() => handleImageArrowClick('next')} />
                    </div>

                </div>

            ) : (
                <>No Image available</>
            )}

            {isImageFullOpen && (
                <div className="bg-black bg-opacity-80 fixed top-0 h-full w-full cursor-pointer" onClick={() => setIsImageFullOpen(false)}>
                    <CaretCircleLeft size={50} weight="bold" color="white" className="fixed top-[40%] left-[25%] z-10 cursor-pointer" onClick={(e) => { handleImageArrowClick('next'); e.stopPropagation(); }} />
                    <CaretCircleRight size={50} weight="bold" color="white" className="fixed top-[40%] right-[25%] z-10 cursor-pointer" onClick={(e) => { handleImageArrowClick('next'); e.stopPropagation(); }} />
                    <div className="flex flex-col items-center justify-center w-full h-full relative" >
                        {/* <img src={selectedImage} alt="Selected" className="h-[60vh] object-cover rounded-lg shadow-lg" /> */}
                        <Swiper
                            spaceBetween={10}
                            slidesPerView={1}
                            loop={false}
                            autoplay={{ delay: 3000 }}
                            modules={[Autoplay, Thumbs]}
                            className="!w-auto"
                        >
                            <SwiperSlide className="flex items-center justify-center !w-auto" onClick={(e) => e.stopPropagation()}>
                                <img
                                    src={selectedImage} alt="Thumbnail"
                                    className="h-[60vh] object-cover rounded-lg"
                                />

                            </SwiperSlide>
                        </Swiper>

                        <div onClick={(e) => e.stopPropagation()}>
                            <Swiper
                                spaceBetween={10}
                                slidesPerView="auto"
                                autoplay={{ delay: 3000 }}
                                watchSlidesProgress
                                modules={[Autoplay, Thumbs]}
                                className="max-w-[40vw] mt-10"
                            >
                                {v_TEMPrcdItemSkuImgs.map((img, index) => (
                                    <SwiperSlide key={index} className={`!w-auto flex flex-shrink-0 `}
                                    >
                                        <img
                                            src={img} alt="Thumbnail"
                                            className={`w-14 h-14 object-cover rounded hover:scale-110 transition-transform cursor-pointer ${selectedImage === img ? "border-2 border-blue-500" : ""}`}
                                            onClick={() => setSelectedImage(img)}
                                        />
                                    </SwiperSlide>
                                ))}
                            </Swiper>
                        </div>
                    </div>
                </div>
            )}


        </div>

    )
}















// /* eslint-disable @next/next/no-img-element */
// "use client"

// // A. Imports
// import React, { useEffect, useState } from 'react';
// import Head from 'next/head';
// // import Image from 'next/image';
// // import { useRouter } from "next/navigation";
// // import { useSearchParams } from "next/navigation";


// // B. Interface & Props
// // interface name {}
// // interface Props {}
// interface TempItems {
//     itemmid: number;
//     name: string;
//     price: number;
//     image: string;
//     inStock: boolean;
//     category: string;
//     rating: number; // Rating out of 5
// }

// const v_tempProducts: TempItems[] = [
//     {
//         itemmid: 1,
//         name: "Wireless Headphones",
//         price: 59.99,
//         image: "https://images.unsplash.com/photo-1516321497487-e288fb19713f",
//         inStock: true,
//         category: "Electronics",
//         rating: 4.5,
//     },
//     {
//         itemmid: 2,
//         name: "Smartwatch",
//         price: 129.99,
//         image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3",
//         inStock: false,
//         category: "Wearables",
//         rating: 4.7,
//     },
//     {
//         itemmid: 3,
//         name: "Gaming Mouse",
//         price: 39.99,
//         image: "https://images.unsplash.com/photo-1629429408708-3a59f51979c5?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
//         inStock: true,
//         category: "Accessories",
//         rating: 4.3,
//     },
//     {
//         itemmid: 4,
//         name: "Mechanical Keyboard",
//         price: 89.99,
//         image: "https://images.unsplash.com/photo-1625130694338-4110ba634e59?q=80&w=1935&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
//         inStock: true,
//         category: "Accessories",
//         rating: 4.8,
//     },
//     {
//         itemmid: 5,
//         name: "Smartphone",
//         price: 699.99,
//         image: "https://images.unsplash.com/photo-1498049794561-7780e7231661",
//         inStock: false,
//         category: "Electronics",
//         rating: 4.6,
//     },
// ];





// // export const getStaticProps = async () => {
// // const v_resRt = await fetch('/api/item/gallery') //?
// // const v_resRtWrap = await v_resRt.json()
// // const v_restRtData = v_resRtWrap.data;

// // return {
// //     props: { v_resRtData }, revalidate: 86400 //rebui1d every day
// // }
// // }


// // C. Main function
// export default function ItemGallery() {

//     // C1. State Variable
//     const [v_loading, setLoading] = useState<boolean>(true);
//     // const [error, setError] = useState('');

//     //Nav R1: Params

//     //Nav R2: useEffect + C2. Define useEffect
//     useEffect(() => {
//         // const v_resRt = await fetch('/api/item/gallery') //?
//         // const v_resRtWrap = await v_resRt.json()
//         // const v_restRtData = v_resRtWrap.data;

//         // C2.1: Prepare ASKFOR and CONDITION.
//         // C2.2: Call Route
//         // C2.3: Extract JSON-Object.
//         // C2.4: Load to State Variable.
//         setLoading(false);

//     }, [])

//     if (v_loading) return;

//     return (
//         <div className='min-h-screen bg-bru5 rounded-lg'>
//             <Head>
//                 <title>Item Product Gallery</title>
//                 <meta name='description' content='A statement describing. This section helps SEO' />
//             </Head>

//             {/* <Header /> */}

//             {/* Nav R3? */}
//             <div className='grid grid-cols-3 gap-4 p-4'>
//                 {v_tempProducts.map((item) => (
//                     <div key={item.itemmid} className="bg-bru2 rounded-lg p-4 flex flex-col gap-1 items-center justify-between
//                                                         hover:bg-bru1 cursor-pointer duration-300 hover:scale-105">
//                         <img
//                             src={item.image}
//                             alt={item.name}
//                             className='w-full h-fit rounded-lg border-2 border-bru4 !h-40 object-cover'
//                         />
//                         <div className='text-center'>
//                             <p className='text-sm font-bold text-bru4 mt-2'>{item.name}</p>
//                             <p className='text-xs text-bru3'> {item.inStock} left in stock</p>
//                         </div>
//                     </div>
//                 ))}
//             </div>


//             {/* <Footer /> */}
//         </div>
//     )
// }