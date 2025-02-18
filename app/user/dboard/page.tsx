import React from "react";
import Link from "next/link";
import sections from "@/jds/user/UserCustDboard.json";
import ReturnButton from "@/components/return";

const UserDboard = () => {
    return (
        <div className="relative container px-4 mt-10 px-40">
            <ReturnButton />    {/* Remove relative from above */}
            <h1 className="text-3xl text-white font-bold my-6">Your Account</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {sections.map((section, index) => (
                    // <div key={index} className="border rounded-lg p-4 shadow-sm hover:shadow-md">
                    <div key={index} className="form-bg">
                        <h2 className="text-xl font-semibold mb-3">{section.title}</h2>
                        <ul className="space-y-2">
                            {section.links.map((link, i) => (
                                <li key={i}>
                                    <Link href={link.href} className="text-white hover:underline">
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default UserDboard;
