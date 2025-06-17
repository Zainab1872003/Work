import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios'; // Use our custom axios instance

const FeaturedEvents = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                // Correctly use the /event/filter endpoint without any query parameters
                // to fetch all events, as designed in your backend.
                const response = await api.get('/event/filter');

                // Ensure the response data has an 'events' property which is an array
                if (response.data && Array.isArray(response.data.events)) {
                    setEvents(response.data.events);
                } else {
                    console.error("API response is not in the expected format:", response.data);
                    setEvents([]);
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchEvents();
    }, []); // The empty array ensures this effect runs only once

    if (loading) {
        return (
            <section id="events" className="py-20 bg-secondary">
                <div className="text-center">
                    <h2 className="text-4xl font-extrabold text-white sm:text-5xl">Loading Events...</h2>
                </div>
            </section>
        );
    }

    if (error) {
        return (
            <section id="events" className="py-20 bg-secondary">
                <div className="text-center">
                    <h2 className="text-4xl font-extrabold text-red-500 sm:text-5xl">Error Fetching Events</h2>
                    <p className="mt-4 text-xl text-gray-400">{error}</p>
                </div>
            </section>
        );
    }

    return (
        <section id="events" className="py-20 bg-secondary">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center">
                    <h2 className="text-4xl font-extrabold text-white sm:text-5xl">Featured Events</h2>
                    <p className="mt-4 text-xl text-gray-400">
                        Check out some of the most popular events happening soon.
                    </p>
                </div>
                <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {events.map((event) => (
                        <div key={event.id} className="bg-gray-800 rounded-lg shadow-lg overflow-hidden transform hover:scale-105 transition-transform duration-300">
                            <img
                                className="h-56 w-full object-cover"
                                // This logic is correct: use poster_url if it exists, otherwise use the fallback.
                                src={event.poster_url || 'https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?q=80&w=2070&auto=format&fit=crop'}
                                alt={event.title}
                            />
                            <div className="p-6">
                                <p className="text-sm font-semibold text-primary">{new Date(event.date).toLocaleDateString()}</p>
                                <h3 className="mt-2 text-xl font-bold text-white">{event.title}</h3>
                                {/* Your backend provides 'city' and 'country', so we combine them here */}
                                <p className="mt-2 text-gray-400">{event.location || `${event.city}, ${event.country}`}</p>
                                <div className="mt-4">
                                    <Link to={`/events/${event.id}`} className="text-white bg-primary hover:bg-blue-600 font-medium rounded-lg text-sm px-5 py-2.5 text-center">
                                        View Details
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default FeaturedEvents;



