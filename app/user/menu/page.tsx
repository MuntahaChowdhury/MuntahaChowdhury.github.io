// /components/user/UserMenu.tsx

'use client'; // Ensure the component is rendered on the client-side

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import menuItemsData from '@/jds/user/UserMenu.json'; // Ensure this path is correct
import ReturnButton from '@/components/return';

const UserMenu: React.FC = () => {
    const [v_isMenuOpen, setIsMenuOpen] = useState(false);
    const v_menuRef = useRef<HTMLDivElement>(null);
    const v_router = useRouter(); // For client-side navigation

    const toggleMenu = () => {
        setIsMenuOpen((prev) => !prev);
    };

    const handleNavigation = (path: string) => {
        setIsMenuOpen(false); // Close menu
        v_router.push(path); // Navigate to the specified path
    };

    const handleClickOutside = (event: MouseEvent) => {
        if (v_menuRef.current && !v_menuRef.current.contains(event.target as Node)) {
            setIsMenuOpen(false);
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <>
            <ReturnButton />
            <div className="relative mt-20 mx-60">      {/* Remove m's in actual code */}
                {/* User Icon */}
                <button
                    onClick={toggleMenu}
                    className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 focus:outline-none"
                    aria-expanded={v_isMenuOpen}
                    aria-controls="user-menu"
                >
                    <Image src="/icons/user-icon.svg" alt="User Icon" width="48" height="48" />

                </button>

                {/* Pop-up Menu */}
                {v_isMenuOpen && (
                    <div
                        id="user-menu"
                        ref={v_menuRef}
                        className="absolute left-0 mt-2 w-48 bg-white rounded-lg shadow-lg z-50 transition-transform duration-200"
                    >
                        <ul className="py-2 text-gray-700">
                            {menuItemsData.map((item, index) => (
                                <li
                                    key={index}
                                    className={`px-4 py-2 hover:bg-gray-100 cursor-pointer ${item.className || ''}`}
                                    onClick={() => handleNavigation(item.path)}
                                >
                                    {item.label}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </>
    );
};

export default UserMenu;
