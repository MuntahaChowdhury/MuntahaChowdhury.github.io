
// app/user/profile/page.tsx
//==============================================================================================================================

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ReturnButton from '@/component/return';
// import Image from 'next/image';

export default function UpdateUserProfile() {
    const v_router = useRouter();
    const [v_formData, setFormData] = useState({
        usrid: '',
        fname: '',
        lname: '',
        email: '',
        mobile: '',
        imgloc: '',
        cdomain: '',
        tempcode: '',
        username: '',
    });

    const [v_imageFile, setImageFile] = useState<File | null>(null);
    const [v_message, setMessage] = useState('');

    useEffect(() => {
        const getCookie = (name: string) => {
            const v_cookieString = document.cookie || '';
            const v_cookies = v_cookieString.split('; ').reduce((acc, current) => {
                const [key, value] = current.split('=');
                acc[key] = decodeURIComponent(value || '');
                return acc;
            }, {} as Record<string, string>);
            return v_cookies[name] || '';
        };

        setFormData({
            usrid: getCookie('usrid'),
            fname: getCookie('fname'),
            lname: getCookie('lname'),
            email: getCookie('email'),
            mobile: getCookie('mobile'),
            cdomain: getCookie('cdomain'),
            tempcode: getCookie('tempcode'),
            username: getCookie('username'),
            imgloc: getCookie('imgloc'),
        });
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData({ ...v_formData, [name]: value });
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setImageFile(e.target.files[0]);
        }
    };


    // -- Upload Profile Picture --------------------------
    const handleImageUpload = async () => {
        if (!v_imageFile) { setMessage('Please select a file to upload.'); return; }

        const v_fileExtension = v_imageFile.name.split('.').pop(); // Get the file extension
        const v_fileName = `${v_formData.fname}_${v_formData.lname}_pp_${v_formData.usrid}.${v_fileExtension}`; // Construct v_fileName

        try {
            const v_payloadImg = new FormData();
            v_payloadImg.append('cdomain', v_formData.cdomain);
            v_payloadImg.append('folderName', 'general');
            v_payloadImg.append('fileName', v_fileName);
            v_payloadImg.append('file', v_imageFile);

            const v_resS3Rt = await fetch('/api/s3', {
                method: 'POST',
                body: v_payloadImg,
            });


            const v_resS3RtWrap = await v_resS3Rt.json();
            //console.log("S3-Route Result:",v_resS3RtWrap.result);

            if (v_resS3RtWrap.result === 'success') {
                setFormData((prev) => ({ ...prev, imgloc: v_resS3RtWrap.fileUrl }));
                const v_payloadImgloc = {
                    operation: 'APPUSRIMG',
                    username: v_formData.username,
                    imgloc: v_resS3RtWrap.fileUrl,
                };

                const v_resRtImgloc = await fetch('/api/user/profile', {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(v_payloadImgloc),
                });

                const v_resRtImglocWrap = await v_resRtImgloc.json();
                console.log("Profile-Route Result:", v_resRtImglocWrap.result);
                if (v_resRtImglocWrap.result === 'success') {
                    document.cookie = `imgloc=${encodeURIComponent(v_resS3RtWrap.fileUrl)}; path=/; max-age=86400`;
                    alert('Profile Picture updated successfully!');
                    v_router.push('/user/profile'); // Redirect to profile page
                } else {
                    throw new Error('Profile Route: Failed to update profile');
                }

            } else {
                throw new Error('S3: Failed to upload image');
            }


        } catch (error) {
            setMessage('Profile Page: Error uploading image.');
            console.error(error);
        }
    };


    //--- Update profile Data ---------------------------------------
    const handleProfileUpdate = async () => {
        try {
            const v_payloadProf = {
                operation: 'APPUSRU',
                username: v_formData.username,
                fname: v_formData.fname,
                lname: v_formData.lname,
                email: v_formData.email,
                mobile: v_formData.mobile,
                imgloc: v_formData.imgloc,
            };

            const v_resRtProf = await fetch('/api/user/profile', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(v_payloadProf),
            });

            if (!v_resRtProf.ok) {
                const v_resRtProfWrap = await v_resRtProf.json();
                throw new Error(v_resRtProfWrap.v_message || 'Failed to update profile');
            }

            document.cookie = `fname=${encodeURIComponent(v_formData.fname)}; path=/; max-age=86400`;
            document.cookie = `lname=${encodeURIComponent(v_formData.lname)}; path=/; max-age=86400`;
            document.cookie = `email=${encodeURIComponent(v_formData.email)}; path=/; max-age=86400`;
            document.cookie = `mobile=${encodeURIComponent(v_formData.mobile)}; path=/; max-age=86400`;
            document.cookie = `imgloc=${encodeURIComponent(v_formData.imgloc)}; path=/; max-age=86400`;

            alert('Profile updated successfully!');
            v_router.push('/user/profile'); // Redirect to profile page
        } catch (error) {
            alert('Error updating profile.');
            console.error(error);
        }
    };

    return (
        <div className="relative flex items-center justify-center text-white px-4 mt-10">
            <ReturnButton />    {/* Remove relative from above */}
            <div className="shadow-lg rounded-xl p-8 max-w-4xl w-full bg-slate-800 bg-opacity-40">


                <div className="flex items-start justify-center space-x-6">
                    <div className="w-1/4">
                        <div className="flex flex-col items-center space-y-4">
                            <div className="w-32 h-32 bg-gray-200 rounded-full overflow-hidden">
                                {v_formData.imgloc ? (
                                    // <></>
                                    <img src={v_formData.imgloc} alt="Profile Picture" className="w-full h-full object-cover" />
                                    // <Image src={v_formData.imgloc} alt="Profile Picture" width={100} height={100} className="w-full h-full object-cover" />
                                ) : (
                                    <span className="text-gray-500 text-sm flex items-center justify-center h-full">
                                        No Image
                                    </span>
                                )}
                            </div>
                            <input
                                type="file"
                                onChange={handleImageChange}
                                accept="image/*"
                                className="text-sm text-gray-600"
                            />
                            <button
                                onClick={handleImageUpload}
                            >
                                Upload Image
                            </button>
                        </div>
                    </div>
                    <div className="w-3/4">
                        <h1 className="text-3xl font-bold my-4 text-white">Update Profile</h1>
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="fname" className="">First Name</label>
                                    <input
                                        type="text"
                                        id="fname"
                                        name="fname"
                                        value={v_formData.fname}
                                        onChange={handleChange}
                                        placeholder="First Name"
                                        required
                                    />
                                    <label htmlFor="lname" className=" mt-4">Last Name</label>
                                    <input
                                        type="text"
                                        id="lname"
                                        name="lname"
                                        value={v_formData.lname}
                                        onChange={handleChange}
                                        placeholder="Last Name"
                                        required
                                    />
                                    <label htmlFor="email" className=" mt-4">Email</label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={v_formData.email}
                                        onChange={handleChange}
                                        placeholder="Email"
                                        required
                                    />
                                    <label htmlFor="mobile" className=" mt-4">Mobile Number</label>
                                    <input
                                        type="text"
                                        id="mobile"
                                        name="mobile"
                                        value={v_formData.mobile}
                                        onChange={handleChange}
                                        placeholder="Mobile Number"
                                        required
                                    />
                                </div>
                                <div>
                                    <label htmlFor="usrid" className="">User ID</label>
                                    <input
                                        type="text"
                                        id="usrid"
                                        name="usrid"
                                        value={v_formData.usrid}
                                        disabled
                                        placeholder="User ID"
                                        className="text-gray-400 bg-gray-800"
                                    />
                                    <label htmlFor="cdomain" className=" mt-4">Company Domain</label>
                                    <input
                                        type="text"
                                        id="cdomain"
                                        name="cdomain"
                                        value={v_formData.cdomain}
                                        disabled
                                        placeholder="Company Domain"
                                        className="text-gray-400 bg-gray-800"
                                    />
                                    <label htmlFor="tempcode" className=" mt-4">Template</label>
                                    <input
                                        type="text"
                                        id="tempcode"
                                        name="tempcode"
                                        value={v_formData.tempcode}
                                        disabled
                                        placeholder="Template"
                                        className="text-gray-400 bg-gray-800"
                                    />
                                    <label htmlFor="username" className=" mt-4">Username</label>
                                    <input
                                        type="text"
                                        id="username"
                                        name="username"
                                        value={v_formData.username}
                                        disabled
                                        placeholder="Username"
                                        className="text-gray-400 bg-gray-800"
                                    />
                                </div>
                            </div>
                            <button
                                onClick={handleProfileUpdate}
                                // className="w-full p-3 bg-green-500 text-white rounded hover:bg-green-600"
                            >
                                Update Profile
                            </button>
                        </div>
                    </div>
                </div>
                {v_message && <p className="mt-4 text-center text-red-500">{v_message}</p>}
            </div>
        </div>
    );
}

//==============================================================================================================================

