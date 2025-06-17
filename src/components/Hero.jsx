import React from 'react';

const Hero = () => {
    return (
        <div className="relative h-screen flex items-center justify-center bg-cover bg-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?q=80&w=2070&auto=format&fit=crop')" }}>
            <div className="absolute inset-0 bg-black opacity-50"></div>
            <div className="relative z-10 text-center text-white px-4">
                <h1 className="text-5xl md:text-7xl font-extrabold mb-4">Discover and Book Amazing Events</h1>
                <p className="text-lg md:text-xl max-w-2xl mx-auto mb-8">Your ultimate platform to find and book tickets for the best events in your city. From concerts to workshops, we have it all.</p>
                <a href="#events" className="bg-primary text-white font-bold py-3 px-8 rounded-full text-lg hover:bg-blue-600 transition duration-300">Explore Events</a>
            </div>
        </div>
    );
};

export default Hero;
