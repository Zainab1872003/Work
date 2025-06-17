import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

const Navbar = () => {
    const { currentUser, logout } = useAuth();

    return (
        <nav className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg shadow-lg fixed w-full z-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex-shrink-0">
                        <Link to="/" className="text-white text-2xl font-bold">EventHive</Link>
                    </div>
                    <div className="hidden md:block">
                        <div className="ml-10 flex items-center space-x-4">
                            {currentUser ? (
                                <>
                                    <span className="text-white">Hello, {currentUser.name}</span>
                                    {/* Add Dashboard Link */}
                                    <Link to="/dashboard" className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Dashboard</Link>
                                    <button onClick={logout} className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-md text-sm font-medium">Logout</button>
                                </>
                            ) : (
                                <>
                                    <Link to="/login" className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Login</Link>
                                    <Link to="/signup" className="bg-primary text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-600">Sign Up</Link>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
