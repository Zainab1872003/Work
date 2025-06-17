import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import api from '../api/axios';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { FaCalendarAlt, FaMapMarkerAlt, FaUsers, FaCheckCircle } from 'react-icons/fa';

const EventDetailPage = () => {
  const { eventId } = useParams();
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // State variables for the booking process
  const [isBooking, setIsBooking] = useState(false);
  const [bookingError, setBookingError] = useState(null);
  const [isAlreadyBooked, setIsAlreadyBooked] = useState(false);

  // This effect hook fetches both the event details and the user's booking status.
  useEffect(() => {
    const fetchEventAndBookingStatus = async () => {
      try {
        setLoading(true);
        // 1. Fetch the main event details
        const eventResponse = await api.get(`/event/${eventId}`);
        setEvent(eventResponse.data.event);

        // 2. If a customer is logged in, check if they have already booked this event.
        // This calls your `get_my_bookings` controller.
        if (currentUser?.role === 'customer') {
          const bookingsResponse = await api.get('/booking/my');
          const myBookings = bookingsResponse.data.bookings;
          // Check if any of the user's bookings match the current event's ID.
          // Your booking_model.to_json() includes the full event object, so this works. [3]
          const alreadyBooked = myBookings.some(booking => booking.event.id === eventId);
          setIsAlreadyBooked(alreadyBooked);
        }
      } catch (err) {
        setError('Could not load event details. The event may not exist.');
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchEventAndBookingStatus();
  }, [eventId, currentUser]); // Re-run if the event or user changes

  // This function handles the booking process when the button is clicked.
  const handleBooking = async () => {
    // Redirect non-logged-in users to the login page
    if (!currentUser) {
      navigate('/login', { state: { from: window.location.pathname } });
      return;
    }

    // Your `book_event` controller is protected by `@customer_required`, so we check here too. [2]
    if (currentUser.role !== 'customer') {
      setBookingError("Only customers can book tickets.");
      return;
    }

    setIsBooking(true);
    setBookingError(null);

    try {
      // This calls the POST /api/booking/<event_id> route, which matches your backend. [5]
      // Your `book_event` controller doesn't need a request body, just the event ID. [2]
      await api.post(`/booking/${eventId}`);
      
      setIsAlreadyBooked(true); // Update the UI to show the "booked" state
      // Visually decrement the seat count for immediate user feedback
      setEvent(prevEvent => ({...prevEvent, seats_available: prevEvent.seats_available - 1}));
    } catch (err) {
      setBookingError(err.response?.data?.error || "Booking failed. Please try again.");
    } finally {
      setIsBooking(false);
    }
  };

  if (loading) return <div className="text-center text-white py-40 bg-secondary min-h-screen">Loading event...</div>;
  if (error) return <div className="text-center text-red-500 py-40 bg-secondary min-h-screen">{error}</div>;
  if (!event) return <div className="text-center text-white py-40 bg-secondary min-h-screen">Event not found.</div>;

  const formattedDate = new Date(event.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  const formattedTime = new Date(event.date).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="bg-secondary">
      <Navbar />
      <main className="pt-16 text-white">
        <div className="relative h-96">
          <img src={event.poster_url || 'https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?q=80&w=2070&auto=format&fit=crop'} alt={event.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <h1 className="text-5xl md:text-7xl font-extrabold text-center drop-shadow-lg">{event.title}</h1>
          </div>
        </div>
        
        <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="bg-gray-800 p-8 rounded-lg shadow-xl -mt-32 relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center border-b border-gray-700 pb-6 mb-6">
              <div className="flex flex-col items-center"><FaCalendarAlt className="text-primary text-3xl mb-2" /><span className="font-bold">{formattedDate}</span><span className="text-gray-400">{formattedTime}</span></div>
              <div className="flex flex-col items-center"><FaMapMarkerAlt className="text-primary text-3xl mb-2" /><span className="font-bold">{event.location || event.city}</span><span className="text-gray-400">{event.country}</span></div>
              <div className="flex flex-col items-center"><FaUsers className="text-primary text-3xl mb-2" /><span className="font-bold">{event.seats_available} Seats Left</span><span className="text-gray-400">of Total Capacity</span></div>
            </div>

            <div className="mb-8">
              <h2 className="text-3xl font-bold mb-4">About The Event</h2>
              <p className="text-gray-300 leading-relaxed">{event.description}</p>
            </div>
            <div className="mb-8 p-4 bg-gray-900 rounded-lg">
                <h3 className="text-xl font-semibold mb-2">Organized By:</h3>
                <p className="text-gray-400">{event.organizer_name || 'An esteemed organizer'}</p>
            </div>

            {/* This section dynamically shows the correct booking status */}
            <div className="text-center">
              {isAlreadyBooked ? (
                <div className="flex flex-col items-center justify-center text-green-400">
                  <FaCheckCircle className="text-4xl mb-2" />
                  <span className="font-bold text-xl">You have booked this event!</span>
                  <Link to="/dashboard" className="text-primary hover:underline mt-2">View My Bookings</Link>
                </div>
              ) : (
                <button 
                  onClick={handleBooking}
                  disabled={isBooking || event.seats_available === 0}
                  className="bg-primary hover:bg-blue-600 text-white font-bold py-4 px-10 rounded-lg text-xl transition duration-300 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isBooking ? 'Processing...' : (event.seats_available === 0 ? 'Sold Out' : 'Book Your Ticket')}
                </button>
              )}
              {bookingError && <p className="text-red-500 mt-4">{bookingError}</p>}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default EventDetailPage;

