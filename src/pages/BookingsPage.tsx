import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { cancelBooking, getBookings } from "../api/bookingApi";
import Button from "../components/common/Button";
import Loader from "../components/common/Loader";
import { Booking } from "../types/booking";

const BookingsPage = () => {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchBookings = async () => {
    try {
      const response = await getBookings();
      setBookings(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("Failed to fetch bookings", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleCancel = async (id: string) => {
    if (!confirm("Are you sure you want to cancel this booking?")) return;
    
    try {
      await cancelBooking(id);
      fetchBookings();
    } catch (error) {
      console.error("Failed to cancel booking", error);
      alert("Failed to cancel booking");
    }
  };

  const handlePayNow = (booking: Booking) => {
    navigate("/payment", {
      state: {
        bookingId: booking.id,
        amount: booking.totalCost,
        showDetails: {
          timing: booking.timing,
          price: booking.totalCost / booking.noOfSeats
        }
      }
    });
  };

  if (loading) return <Loader />;

  return (
    <div>
      <h1 className="mb-6 text-3xl font-bold text-white">My Bookings</h1>
      
      {bookings.length === 0 ? (
        <p className="text-slate-400">No bookings found.</p>
      ) : (
        <div className="space-y-4">
          {bookings.map((booking) => (
            <div
              key={booking.id}
              className="flex flex-col justify-between rounded-xl border border-slate-800 bg-slate-900 p-5 md:flex-row md:items-center"
            >
              <div className="mb-4 md:mb-0">
                <p className="font-semibold text-white">Show Time: {new Date(booking.timing).toLocaleString()}</p>
                <p className="text-sm text-slate-400">
                  Seats: {booking.noOfSeats} | Total: ₹{booking.totalCost}
                </p>
                <p className="text-sm text-slate-500 mt-1">
                  Status: 
                  <span className={`ml-1 ${booking.status === 'CANCELLED' ? 'text-red-400' : booking.status === 'COMPLETED' ? 'text-green-400' : 'text-yellow-400'}`}>
                    {booking.status}
                  </span>
                </p>
              </div>
              
              <div className="flex gap-2">
                {booking.status === 'PENDING' || booking.status === 'PROCESSING' ? (
                  <>
                    <Button 
                      variant="primary" 
                      onClick={() => handlePayNow(booking)}
                    >
                      Pay Now
                    </Button>
                    <Button 
                      variant="danger" 
                      onClick={() => handleCancel(booking.id)}
                    >
                      Cancel
                    </Button>
                  </>
                ) : booking.status === 'CANCELLED' ? (
                  <span className="text-sm text-slate-500">Cancelled</span>
                ) : (
                  <span className="text-sm text-green-400">Paid</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BookingsPage;