import React from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import FeaturedEvents from '../components/FeaturedEvents';
import HowItWorks from '../components/HowItWorks';
import Footer from '../components/Footer';

const HomePage = () => {
    return (
        <>
            <Navbar />
            <main>
                <Hero />
                <FeaturedEvents />
                <HowItWorks />
            </main>
            <Footer />
        </>
    );
};

export default HomePage;
