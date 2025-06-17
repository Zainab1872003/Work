import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const EditEventPage = () => {
  const { eventId } = useParams(); // Get the event ID from the URL
  const navigate = useNavigate();

  const [posterImage, setPosterImage] = useState(null);
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch the current event data when the page loads
  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await api.get(`/event/${eventId}`);
        const event = response.data.event;

        // Split the ISO date string from the backend into date and time parts for the form
        const eventDate = new Date(event.date);
        const datePart = eventDate.toISOString().split('T')[0]; // YYYY-MM-DD
        const timePart = eventDate.toTimeString().split(' ')[0].substring(0, 5); // HH:MM

        setEventData({
          title: event.title,
          description: event.description,
          date: datePart,
          time: timePart,
          city: event.city,
          country: event.country,
          location: event.location,
          seats_available: event.seats_available,
        });
      } catch (err) {
        setError('Failed to load event data.');
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [eventId]);

  const handleChange = (e) => {
    setEventData({ ...eventData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setPosterImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData();
    const formattedDate = `${eventData.date} ${eventData.time}`;

    // Append all fields to FormData
    formData.append('title', eventData.title);
    formData.append('description', eventData.description);
    formData.append('date', formattedDate);
    formData.append('city', eventData.city);
    formData.append('country', eventData.country);
    formData.append('location', eventData.location);
    formData.append('seats_available', eventData.seats_available);

    if (posterImage) {
      formData.append('poster', posterImage);
    }

    try {
      // Use the PUT method to update the event
      await api.put(`/event/${eventId}`, formData);
      navigate('/dashboard');
    } catch (err) {
      setError('Failed to update event.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="text-center text-white py-40">Loading event details...</div>;

  return (
    <>
      <Navbar />
      <main className="pt-20 bg-secondary text-white min-h-screen">
        <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-extrabold mb-8 text-center">Edit Your Event</h1>
          <form onSubmit={handleSubmit} className="bg-gray-800 p-8 rounded-lg shadow-lg space-y-6">
            {/* The form structure is identical to the Create Event page */}
            {/* All input fields are pre-filled with the existing event data */}
            {/* ... (All your labeled input fields for title, description, date, etc. go here) ... */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-2">Event Title</label>
              <input id="title" type="text" name="title" value={eventData.title} onChange={handleChange} required className="w-full bg-gray-900 text-white p-3 rounded-md border border-gray-700" />
            </div>
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-2">Event Description</label>
              <textarea id="description" name="description" value={eventData.description} onChange={handleChange} required rows="4" className="w-full bg-gray-900 text-white p-3 rounded-md border border-gray-700"></textarea>
            </div>
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
            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-300 mb-2">Venue (Optional)</label>
              <input id="location" type="text" name="location" value={eventData.location} onChange={handleChange} className="w-full bg-gray-900 text-white p-3 rounded-md border border-gray-700" />
            </div>
            <div>
              <label htmlFor="seats_available" className="block text-sm font-medium text-gray-300 mb-2">Seats Available</label>
              <input id="seats_available" type="number" name="seats_available" value={eventData.seats_available} onChange={handleChange} required min="1" className="w-full bg-gray-900 text-white p-3 rounded-md border border-gray-700" />
            </div>
            <div>
              <label htmlFor="poster" className="block text-sm font-medium text-gray-300 mb-2">Change Poster (Optional)</label>
              <input id="poster" type="file" name="poster" onChange={handleFileChange} accept="image/*" className="w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-blue-600" />
            </div>
            {error && <p className="text-red-500 text-sm text-center">{error}</p>}
            <button type="submit" disabled={loading} className="w-full bg-primary text-white font-bold py-3 px-6 rounded-lg hover:bg-blue-600 transition duration-300 disabled:opacity-50">
              {loading ? 'Saving Changes...' : 'Save Changes'}
            </button>
          </form>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default EditEventPage;
