import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/axios';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const EventAttendeesPage = () => {
  const { eventId } = useParams(); // Get the event ID from the URL
  const [event, setEvent] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAttendees = async () => {
      try {
        setLoading(true);
        // This calls your `get_event_bookings` controller on the backend [2]
        const response = await api.get(`/booking/event/${eventId}`);
        setEvent(response.data.event);
        setBookings(response.data.bookings);
      } catch (err) {
        setError("Failed to load attendee list. You may not have permission to view this.");
        console.error("Error fetching attendees:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAttendees();
  }, [eventId]);

  if (loading) {
    return <div className="text-center text-white py-40 bg-secondary min-h-screen">Loading attendees...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500 py-40 bg-secondary min-h-screen">{error}</div>;
  }

  return (
    <>
      <Navbar />
      <main className="pt-20 bg-secondary text-white min-h-screen">
        <div className="max-w-5xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <Link to="/dashboard" className="text-primary hover:underline mb-6 inline-block">&larr; Back to Dashboard</Link>
          <header className="mb-8">
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">{event?.title}</h1>
            <p className="mt-2 text-xl text-gray-400">Attendee List ({bookings.length} / {event?.seats_available + bookings.length} Booked)</p>
          </header>

          <div className="bg-gray-800 shadow-lg rounded-lg overflow-hidden">
            <table className="min-w-full">
              <thead className="bg-gray-900">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Attendee Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Booking Date</th>
                </tr>
              </thead>
              <tbody className="bg-gray-800 divide-y divide-gray-700">
                {bookings.length > 0 ? (
                  bookings.map((booking) => (
                    <tr key={booking.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">{booking.customer.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">{booking.customer.email}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">{new Date(booking.booked_at).toLocaleString()}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" className="text-center py-10 text-gray-400">No bookings for this event yet.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default EventAttendeesPage;
