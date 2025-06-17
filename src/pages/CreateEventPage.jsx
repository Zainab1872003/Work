import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const CreateEventPage = () => {
    // We'll store the file object from the input in state
    const [posterFile, setPosterFile] = useState(null);
    const [eventData, setEventData] = useState({
        title: '',
        description: '',
        date: '',
        time: '',
        city: '',
        country: '',
        location: '',
        seats_available: 1,
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEventData({ ...eventData, [name]: value });
    };

    const handleFileChange = (e) => {
        setPosterFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        // FormData is required for sending files along with text data
        const formData = new FormData();

        // Format the date into the "YYYY-MM-DD HH:MM" string your backend expects
        const formattedDate = `${eventData.date} ${eventData.time}`;

        // Append all the text fields to the FormData object
        formData.append('title', eventData.title);
        formData.append('description', eventData.description);
        formData.append('date', formattedDate);
        formData.append('country', eventData.country);
        formData.append('city', eventData.city);
        formData.append('location', eventData.location);
        formData.append('seats_available', eventData.seats_available);

        // --- CRITICAL FIX ---
        // Append the file with the key "poster" to match the backend
        if (posterFile) {
            formData.append('poster', posterFile);
        }

        try {
            // Axios will automatically set the 'multipart/form-data' header
            await api.post('/event/create', formData);
            navigate('/dashboard');
        } catch (err) {
            const errorMessage = err.response?.data?.error || 'Failed to create event. Please check all fields.';
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Navbar />
            <main className="pt-20 bg-secondary text-white min-h-screen">
                <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                    <h1 className="text-4xl font-extrabold mb-8 text-center">Create a New Event</h1>
                    <form onSubmit={handleSubmit} className="bg-gray-800 p-8 rounded-lg shadow-lg space-y-6">

                        {/* Event Title */}
                        <div>
                            <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-2">Event Title</label>
                            <input id="title" type="text" name="title" value={eventData.title} onChange={handleChange} required className="w-full bg-gray-900 text-white p-3 rounded-md border border-gray-700" />
                        </div>

                        {/* Event Description */}
                        <div>
                            <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-2">Event Description</label>
                            <textarea id="description" name="description" value={eventData.description} onChange={handleChange} required rows="4" className="w-full bg-gray-900 text-white p-3 rounded-md border border-gray-700"></textarea>
                        </div>

                        {/* Date and Time */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label htmlFor="date" className="block text-sm font-medium text-gray-300 mb-2">Event Date</label>
                                <input id="date" type="date" name="date" value={eventData.date} onChange={handleChange} required className="w-full bg-gray-900 text-white p-3 rounded-md border border-gray-700" />
                            </div>
                            <div>
                                <label htmlFor="time" className="block text-sm font-medium text-gray-300 mb-2">Event Time</label>
                                <input id="time" type="time" name="time" value={eventData.time} onChange={handleChange} required className="w-full bg-gray-900 text-white p-3 rounded-md border border-gray-700" />
                            </div>
                        </div>

                        {/* City and Country */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label htmlFor="city" className="block text-sm font-medium text-gray-300 mb-2">City</label>
                                <input id="city" type="text" name="city" value={eventData.city} onChange={handleChange} required className="w-full bg-gray-900 text-white p-3 rounded-md border border-gray-700" />
                            </div>
                            <div>
                                <label htmlFor="country" className="block text-sm font-medium text-gray-300 mb-2">Country</label>
                                <input id="country" type="text" name="country" value={eventData.country} onChange={handleChange} required className="w-full bg-gray-900 text-white p-3 rounded-md border border-gray-700" />
                            </div>
                        </div>

                        {/* Venue and Seats */}
                        <div>
                            <label htmlFor="location" className="block text-sm font-medium text-gray-300 mb-2">Venue (Optional)</label>
                            <input id="location" type="text" name="location" value={eventData.location} onChange={handleChange} className="w-full bg-gray-900 text-white p-3 rounded-md border border-gray-700" />
                        </div>
                        <div>
                            <label htmlFor="seats_available" className="block text-sm font-medium text-gray-300 mb-2">Seats Available</label>
                            <input id="seats_available" type="number" name="seats_available" value={eventData.seats_available} onChange={handleChange} required min="1" className="w-full bg-gray-900 text-white p-3 rounded-md border border-gray-700" />
                        </div>

                        {/* Poster File Input */}
                        <div>
                            <label htmlFor="poster" className="block text-sm font-medium text-gray-300 mb-2">Event Poster (Optional)</label>
                            <input
                                id="poster"
                                type="file"
                                name="poster" /* This name now matches the backend */
                                onChange={handleFileChange}
                                accept="image/*"
                                className="w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-blue-600"
                            />
                        </div>

                        {error && <p className="text-red-500 text-sm text-center">{error}</p>}

                        <button type="submit" disabled={loading} className="w-full bg-primary text-white font-bold py-3 px-6 rounded-lg hover:bg-blue-600 transition duration-300 disabled:opacity-50">
                            {loading ? 'Creating Event...' : 'Create Event'}
                        </button>
                    </form>
                </div>
            </main>
            <Footer />
        </>
    );
};

export default CreateEventPage;



