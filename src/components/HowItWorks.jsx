import React from 'react';
import { FaSearch, FaTicketAlt, FaSmileBeam } from 'react-icons/fa'; // Import icons

const HowItWorks = () => {
    const steps = [
        {
            icon: <FaSearch className="w-12 h-12 text-primary" />,
            title: 'Discover Events',
            description: 'Find concerts, workshops, and festivals happening near you. Our smart search helps you find the perfect event.',
        },
        {
            icon: <FaTicketAlt className="w-12 h-12 text-primary" />,
            title: 'Book Your Ticket',
            description: 'Secure your spot with our easy and secure checkout process. Your tickets are delivered instantly to your account.',
        },
        {
            icon: <FaSmileBeam className="w-12 h-12 text-primary" />,
            title: 'Enjoy the Experience',
            description: 'Attend your event and make unforgettable memories. All you need is your digital ticket on our app.',
        },
    ];

    return (
        <section className="py-20 bg-gray-900">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center">
                    <h2 className="text-4xl font-extrabold text-white sm:text-5xl">How It Works</h2>
                    <p className="mt-4 text-xl text-gray-400">
                        Booking your next event is as easy as 1-2-3.
                    </p>
                </div>
                <div className="mt-16 grid gap-12 md:grid-cols-3">
                    {steps.map((step, index) => (
                        <div key={index} className="text-center">
                            <div className="flex items-center justify-center h-24 w-24 rounded-full bg-gray-800 mx-auto mb-6">
                                {step.icon}
                            </div>
                            <h3 className="text-2xl font-bold text-white">{step.title}</h3>
                            <p className="mt-4 text-gray-400">{step.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default HowItWorks;
