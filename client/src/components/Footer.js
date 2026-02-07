import React from 'react';

const Footer = () => {
    return (
        <footer className=" bg-gradient-to-r from-teal-600 to-yellow-500 text-white py-4 px-6 md:px-12 text-center">
            <p className="font-medium">
                &copy; {new Date().getFullYear()} SkillsHub. All rights reserved.
            </p>
        </footer>
    );
};

export default Footer;
