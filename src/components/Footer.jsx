import React from 'react';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';

const Footer = () => {
    return (
        <footer className="bg-gray-900 text-white">
            <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">

                    {/* Brand Section */}
                    <div className="col-span-2 md:col-span-1">
                        <h2 className="text-2xl font-bold">EventHive</h2>
                        <p className="mt-4 text-gray-400">Your ultimate platform for discovering and booking events.</p>
                    </div>

                    {/* Quick Links Section */}
                    <div>
                        <h3 className="text-lg font-semibold tracking-wider uppercase">Quick Links</h3>
                        <ul className="mt-4 space-y-2">
                            <li><a href="/" className="hover:text-primary transition-colors duration-300">Home</a></li>
                            <li><a href="#events" className="hover:text-primary transition-colors duration-300">Events</a></li>
                            <li><a href="/about" className="hover:text-primary transition-colors duration-300">About Us</a></li>
                            <li><a href="/contact" className="hover:text-primary transition-colors duration-300">Contact</a></li>
                        </ul>
                    </div>

                    {/* Legal Section */}
                    <div>
                        <h3 className="text-lg font-semibold tracking-wider uppercase">Legal</h3>
                        <ul className="mt-4 space-y-2">
                            <li><a href="/privacy" className="hover:text-primary transition-colors duration-300">Privacy Policy</a></li>
                            <li><a href="/terms" className="hover:text-primary transition-colors duration-300">Terms of Service</a></li>
                        </ul>
                    </div>

                    {/* Social Media Section */}
                    <div className="col-span-2 md:col-span-1">
                        <h3 className="text-lg font-semibold tracking-wider uppercase">Follow Us</h3>
                        <div className="flex mt-4 space-x-6">
                            <a href="#" className="text-gray-400 hover:text-primary transition-colors duration-300"><FaFacebook size={24} /></a>
                            <a href="#" className="text-gray-400 hover:text-primary transition-colors duration-300"><FaTwitter size={24} /></a>
                            <a href="#" className="text-gray-400 hover:text-primary transition-colors duration-300"><FaInstagram size={24} /></a>
                            <a href="#" className="text-gray-400 hover:text-primary transition-colors duration-300"><FaLinkedin size={24} /></a>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="mt-12 border-t border-gray-800 pt-8 text-center">
                    <p className="text-gray-500">&copy; {new Date().getFullYear()} EventHive. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
