import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import api from '../api/axios.js';
import Navbar from '../components/Navbar.jsx';
import Footer from '../components/Footer.jsx';

const DashboardPage = () => {
  const { currentUser } = useAuth();
  
  // State for vendor-specific data
  const [myEvents, setMyEvents] = useState([]);
  const [loadingVendorEvents, setLoadingVendorEvents] = useState(true);
  const [vendorError, setVendorError] = useState(null);

  // State for customer-specific data
  const [myBookings, setMyBookings] = useState([]);
  const [loadingBookings, setLoadingBookings] = useState(true);
  const [bookingError, setBookingError] = useState(null);

  // This single useEffect hook handles data fetching for both roles.
  useEffect(() => {
    // --- VENDOR DATA FETCHING ---
    if (currentUser?.role === 'vendor') {
      const fetchMyEvents = async () => {
        setLoadingVendorEvents(true);
        setVendorError(null);
        try {
          const response = await api.get('/event/my-events');
          setMyEvents(response.data.events);
        } catch (err) {
          setVendorError('Failed to load your events. Please try again.');
          console.error("Error fetching vendor events:", err);
        } finally {
          setLoadingVendorEvents(false);
        }
      };
      fetchMyEvents();
    }

    // --- CUSTOMER DATA FETCHING ---
    if (currentUser?.role === 'customer') {
      const fetchMyBookings = async () => {
        setLoadingBookings(true);
        setBookingError(null);
        try {
          // This calls your `get_my_bookings` controller [2]
          const response = await api.get('/booking/my');
          setMyBookings(response.data.bookings);
        } catch (err) {
          setBookingError('Failed to load your bookings. Please try again.');
          console.error("Error fetching customer bookings:", err);
        } finally {
          setLoadingBookings(false);
        }
      };
      fetchMyBookings();
    }
  }, [currentUser]); // Re-runs when the user logs in.

  // Handles deleting a vendor's event.
  const handleEventDelete = async (eventId) => {
    if (!window.confirm("Are you sure you want to delete this event? This is permanent.")) {
      return;
    }
    try {
      // This calls the standard RESTful DELETE route.
      await api.delete(`/event/${eventId}`);
      setMyEvents(currentEvents => currentEvents.filter(event => event.id !== eventId));
    } catch (err) {
      setVendorError("Failed to delete the event.");
    }
  };
  
  // Handles a customer cancelling their booking.
  const handleBookingCancel = async (bookingId) => {
    if (!window.confirm("Are you sure you want to cancel this booking?")) {
      return;
    }
    try {
      // This calls your `cancel_booking` controller via the route you provided [5].
      await api.delete(`/booking/cancel/${bookingId}`);
      setMyBookings(currentBookings => currentBookings.filter(booking => booking.id !== bookingId));
    } catch (err) {
      setBookingError("Failed to cancel the booking.");
    }
  };

  return (
    <>
      <Navbar />
      <main className="pt-20 bg-secondary text-white min-h-screen">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <header className="mb-10">
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">Dashboard</h1>
            <p className="mt-4 text-xl text-gray-300">Welcome back, {currentUser?.name}!</p>
          </header>
          
          <div className="bg-gray-800 p-8 rounded-lg shadow-lg">
            <div className="mb-8 pb-8 border-b border-gray-700">
              <h2 className="text-2xl font-bold mb-6">Your Profile Information</h2>
              <div className="space-y-4 text-lg">
                <div className="flex items-center"><span className="font-semibold text-gray-400 w-24">Name:</span><span className="ml-2">{currentUser?.name}</span></div>
                <div className="flex items-center"><span className="font-semibold text-gray-400 w-24">Email:</span><span className="ml-2">{currentUser?.email}</span></div>
                <div className="flex items-center"><span className="font-semibold text-gray-400 w-24">Role:</span><span className="ml-2 capitalize bg-primary px-3 py-1 rounded-full text-sm font-semibold">{currentUser?.role}</span></div>
              </div>
            </div>
            
            {/* --- VENDOR DASHBOARD --- */}
            {currentUser?.role === 'vendor' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-2xl font-bold">My Created Events</h3>
                  <Link to="/create-event" className="inline-block bg-primary text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-600 transition">
                    + Create New Event
                  </Link>
                </div>
                {loadingVendorEvents && <p className="text-center text-gray-400">Loading your events...</p>}
                {vendorError && <p className="text-center text-red-500">{vendorError}</p>}
                {!loadingVendorEvents && myEvents.length === 0 && !vendorError && (
                  <div className="text-center py-10 bg-gray-900 rounded-lg"><p className="text-gray-400">You haven't created any events yet.</p><p className="text-gray-500 mt-2">Click "Create New Event" to get started!</p></div>
                )}
                {myEvents.length > 0 && (
                  <div className="space-y-4">
                    {myEvents.map((event) => (
                      <div key={event.id} className="bg-gray-900 p-4 rounded-lg flex justify-between items-center">
                        <div className="flex items-center space-x-4">
                          <img src={event.poster_url || 'https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?q=80&w=2070&auto=format&fit=crop'} alt={event.title} className="h-12 w-12 object-cover rounded-md"/>
                          <div>
                            <h4 className="font-bold text-lg text-white">{event.title}</h4>
                            <p className="text-sm text-gray-400">{new Date(event.date).toLocaleDateString()} - {event.location || `${event.city}, ${event.country}`}</p>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <Link to={`/event-attendees/${event.id}`} className="bg-green-600 hover:bg-green-700 text-white text-xs font-bold py-1 px-3 rounded">Attendees</Link>
                          <Link to={`/edit-event/${event.id}`} className="bg-blue-500 hover:bg-blue-600 text-white text-xs font-bold py-1 px-3 rounded">Edit</Link>
                          <button onClick={() => handleEventDelete(event.id)} className="bg-red-600 hover:bg-red-700 text-white text-xs font-bold py-1 px-3 rounded">Delete</button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* --- CUSTOMER DASHBOARD --- */}
            {currentUser?.role === 'customer' && (
              <div>
                <h3 className="text-2xl font-bold mb-6">My Bookings</h3>
                {loadingBookings && <p className="text-center text-gray-400">Loading your bookings...</p>}
                {bookingError && <p className="text-center text-red-500">{bookingError}</p>}
                {!loadingBookings && myBookings.length === 0 && !bookingError && (
                  <div className="text-center py-10 bg-gray-900 rounded-lg"><p className="text-gray-400">You haven't booked any events yet.</p><Link to="/" className="text-primary hover:underline mt-2 inline-block">Explore Events</Link></div>
                )}
                {myBookings.length > 0 && (
                  <div className="space-y-4">
                    {myBookings.map((booking) => (
                      <div key={booking.id} className="bg-gray-900 p-4 rounded-lg flex justify-between items-center">
                        <div className="flex items-center space-x-4">
                           <img src={booking.event.poster_url || 'https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?q=80&w=2070&auto=format&fit=crop'} alt={booking.event.title} className="h-12 w-12 object-cover rounded-md"/>
                          <div>
                            <h4 className="font-bold text-lg text-white">{booking.event.title}</h4>
                            <p className="text-sm text-gray-400">Booked on: {new Date(booking.booked_at).toLocaleDateString()}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <Link to={`/events/${booking.event.id}`} className="text-sm text-primary hover:underline">View Event</Link>
                          <button onClick={() => handleBookingCancel(booking.id)} className="bg-red-600 hover:bg-red-700 text-white text-xs font-bold py-1 px-3 rounded">Cancel</button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default DashboardPage;





