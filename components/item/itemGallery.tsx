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
import { CaretCircleLeft, CaretCircleRight, Plus, MinusCircle } from "@phosphor-icons/react";


// B. Interface & Props
interface TypeItemAdd {
    itemmid: number | null;
    skuImages: File[];
    tempSkuImageUrls: string[];
}

interface TypeItemDlt {
    itemmid: number | null;
    skuImages: string[];
}

const v_TEMPUPrcdItemSkuImgs = [
    "https://images.unsplash.com/photo-1519681393784-d120267933ba",
    "https://images.unsplash.com/photo-1516912481808-3406841bd33c",
    "https://images.unsplash.com/photo-1521747116042-5a810fda9664",
    "https://images.unsplash.com/photo-1481349518771-20055b2a7b24",
    "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df"
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
    const [selectedImage, setSelectedImage] = useState<string>(v_TEMPUPrcdItemSkuImgs[0]);
    const [isImageFullOpen, setIsImageFullOpen] = useState<boolean>(false);
    const [v_TEMPrcdItemSkuImgs, setImages] = useState(v_TEMPUPrcdItemSkuImgs);
    const [v_formDataToAdd, setFormDataAdd] = useState<TypeItemAdd>({
        itemmid: null,
        skuImages: [],
        tempSkuImageUrls: [],
    })
    const [v_formDataToDlt, setFormDataDlt] = useState<TypeItemDlt>({
        itemmid: null,
        skuImages: [],
    })




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
                // setImages(v_resRtData);
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
    }, [v_TEMPrcdItemSkuImgs]);


    // ✅ C3: Handle Functions
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

    const handleUpdate = () => {
        // sending to api via POST
        // Handle uploaded images
        // and deleted images
    }

    const handleCancel = () => {
        //revert all changes
        window.location.reload();
    }

    const handleAddImage = (event: React.ChangeEvent<HTMLInputElement>) => {
        const v_files = event.target.files;

        if (v_files && v_files[0]) {
            const v_imgFile = v_files[0];
            const v_tempImgUrl = URL.createObjectURL(v_imgFile)

            // Update formData's skuImages array
            setFormDataAdd((prevFormData) => ({
                ...prevFormData,
                skuImages: [...prevFormData.skuImages, v_imgFile], // Add the new file to the array
                tempSkuImageUrls: [...prevFormData.tempSkuImageUrls, v_tempImgUrl]
            }));

            setImages((prevURLs) => [...prevURLs, v_tempImgUrl]);
        }
    }

    const handleRemoveImage = (index: number) => {
        const v_imgUrlToDlt = v_TEMPrcdItemSkuImgs[index];

        
        if (v_formDataToAdd.tempSkuImageUrls.some((url) => url === v_imgUrlToDlt)) {   // If the image is newly added, remove it from formDataAdd

            const v_dltSkuImgIndex = v_formDataToAdd.tempSkuImageUrls.indexOf(v_imgUrlToDlt);
            const v_imgToDlt = v_formDataToAdd.skuImages[v_dltSkuImgIndex];

            setFormDataAdd((prevFormData) => ({
                ...prevFormData,
                skuImages: prevFormData.skuImages.filter((file) => file !== v_imgToDlt),  // Compare object URL
                tempSkuImageUrls: prevFormData.tempSkuImageUrls.filter((url) => url !== v_imgUrlToDlt),  // Remove URL from tempSkuImageUrls
            }));
        }
        
        else {                                                                          // If not newly added, put it in the queue to delete
            setFormDataDlt((prevFormData) => ({
                ...prevFormData,
                skuImages: [...prevFormData.skuImages, v_imgUrlToDlt]
            }));
        }

        // Make a copy of the array and remove the image at the specified index
        const v_updatedSkuImages = [...v_TEMPrcdItemSkuImgs];
        v_updatedSkuImages.splice(index, 1); // Remove image from the temporary array

        // Update state to reflect the removed image
        setImages(v_updatedSkuImages); // Update the temporary state array (for rendering or internal use)
    };





    //✅ D: Display Data on HTML from State Variable.
    return (
        <div className="p-6">
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
                                    <div className="relative">
                                        <img
                                            src={img}
                                            alt="Thumbnail"
                                            className={`w-14 h-14 object-cover rounded cursor-alias hover:scale-110 duration-300 ${selectedImage === img ? "border-2 border-blue-500" : ""}`}
                                            onClick={() => setSelectedImage(img)}
                                        />
                                        <MinusCircle size={18} color="red" weight="duotone" className="absolute top-0 right-0 bg-black rounded-2xl cursor-pointer" onClick={() => handleRemoveImage(index)} />
                                        {v_formDataToAdd.tempSkuImageUrls.some((url) => url === img) && (
                                            <div className="absolute top-0 left-0 bg-bru5 text-bru1 rounded-tl shadow-md text-xs p-1">New</div>
                                        )}
                                    </div>

                                </SwiperSlide>
                            ))}
                        </Swiper>
                    </div>

                    {/* Right Side: Large Displayed Image + Arrows*/}
                    <div className="flex items-center relative">
                        <img src={selectedImage} alt="Selected" className="w-[450px] h-[60vh] object-cover rounded-lg shadow-lg cursor-zoom-in" onClick={() => setIsImageFullOpen(true)} />
                        <CaretCircleLeft size={32} weight="duotone" color="white" className="absolute top-[50%] left-0 z-2 cursor-pointer" onClick={() => handleImageArrowClick('prev')} />
                        <CaretCircleRight size={32} weight="duotone" color="white" className="absolute top-[50%] right-0 z-2 cursor-pointer" onClick={() => handleImageArrowClick('next')} />
                    </div>

                    {v_formDataToDlt && (
                        <div>
                            <h2 className="text-2xl font-semibold text-bru1 mb-2">Removed images</h2>
                            <div className="flex gap-4">
                                {v_formDataToDlt.skuImages.map((img, index) => (
                                    <img
                                        key={index}
                                        src={img}
                                        alt="Thumbnail"
                                        className={`w-14 h-14 object-cover rounded cursor-alias hover:scale-110 duration-300 ${selectedImage === img ? "border-2 border-blue-500" : ""
                                            }`}
                                        onClick={() => setSelectedImage(img)}
                                    />

                                ))}
                            </div>
                            <button onClick={handleCancel} className="bg-red-700 border-red-900 hover:bg-red-600 hover:border-red-900 w-full mt-4">
                                Confirm Delete
                            </button>
                        </div>
                    )}

                </div>

            ) : (
                <>No Image available</>
            )}

            {/* Form Actions */}
            <div className="flex justify-start space-x-4 px-4">
                <button className="w-20 h-14 rounded bg-bru5 flex items-center justify-center" onClick={() => document.getElementById("file-input")?.click()}> {/* Trigger file input when clicking the button */}
                    <Plus
                        size={18}
                        weight="bold"
                        className="cursor-pointer"
                    />
                    <input
                        type="file"
                        id="file-input"
                        className="hidden" // Hide the default file input
                        onChange={handleAddImage}
                    />
                </button>

                {/* {formData.itemid !== null && ( */}
                <button onClick={handleUpdate} className="bg-bru5 w-full">
                    Update
                </button>
                {/* )} */}

                <button onClick={handleCancel} className="bg-gray-500 border-gray-800 hover:bg-gray-600 hover:border-gray-900 w-full">
                    Cancel
                </button>
            </div>

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