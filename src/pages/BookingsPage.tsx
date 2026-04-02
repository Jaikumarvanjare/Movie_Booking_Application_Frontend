import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { cancelBooking, getBookings } from "../api/bookingApi";
import Badge from "../components/common/Badge";
import Button from "../components/common/Button";
import Loader from "../components/common/Loader";
import Modal from "../components/common/Modal";
import { useToast } from "../context/ToastContext";
import type { Booking } from "../types/booking";
import { appRoutes } from "../utils/routes";

const isBookingAwaitingPayment = (status: string) => {
  return status === "PENDING" || status === "PROCESSING";
};

const BookingsPage = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [cancelId, setCancelId] = useState<string | null>(null);
  const [cancelling, setCancelling] = useState(false);

  const fetchBookings = async () => {
    try {
      const response = await getBookings();
      setBookings(Array.isArray(response.data) ? response.data : []);
    } catch {
      showToast("Failed to fetch bookings", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleCancel = async () => {
    if (!cancelId) return;

    setCancelling(true);
    try {
      await cancelBooking(cancelId);
      showToast("Booking cancelled successfully", "success");
      setCancelId(null);
      fetchBookings();
    } catch {
      showToast("Failed to cancel booking", "error");
    } finally {
      setCancelling(false);
    }
  };

  const handlePayNow = (booking: Booking) => {
    navigate(appRoutes.bookingPayment(booking.id));
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "COMPLETED":
      case "SUCCESSFULL":
        return <Badge variant="success">Confirmed</Badge>;
      case "CANCELLED":
        return <Badge variant="error">Cancelled</Badge>;
      case "PROCESSING":
        return <Badge variant="warning">Processing</Badge>;
      case "PENDING":
        return <Badge variant="info">Pending Payment</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  if (loading) return <Loader text="Loading bookings..." />;

  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold text-white">My Bookings</h1>
        <p className="text-slate-400">View and manage your bookings</p>
      </div>

      {bookings.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <p className="mb-2 text-5xl">🎫</p>
          <h3 className="mb-2 text-xl font-semibold text-white">No bookings yet</h3>
          <p className="text-slate-400">Browse shows and book your first movie!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {bookings.map((booking) => (
            <div
              key={booking.id}
              className="group rounded-2xl border border-slate-800/50 bg-slate-900/50 p-5 transition-all hover:border-slate-700/50"
            >
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    {getStatusBadge(booking.status)}
                    <span className="text-xs text-slate-500">ID: {booking.id.slice(-8)}</span>
                  </div>
                  <p className="font-semibold text-white">
                    {new Date(booking.timing).toLocaleString("en-IN", {
                      weekday: "short",
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit"
                    })}
                  </p>
                  <div className="flex items-center gap-4 text-sm text-slate-400">
                    <span>🎫 {booking.noOfSeats} seat{booking.noOfSeats > 1 ? "s" : ""}</span>
                    <span>💰 ₹{booking.totalCost}</span>
                    {booking.seat && <span>💺 {booking.seat}</span>}
                  </div>
                </div>

                <div className="flex gap-2">
                  {isBookingAwaitingPayment(booking.status) && (
                    <>
                      <Button size="sm" onClick={() => handlePayNow(booking)}>
                        Pay ₹{booking.totalCost}
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => setCancelId(booking.id)}>
                        Cancel
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal isOpen={!!cancelId} onClose={() => setCancelId(null)} title="Cancel Booking" size="sm">
        <p className="mb-6 text-slate-400">
          Are you sure you want to cancel this booking? This action cannot be undone.
        </p>
        <div className="flex justify-end gap-3">
          <Button variant="ghost" onClick={() => setCancelId(null)}>
            Keep Booking
          </Button>
          <Button variant="danger" onClick={handleCancel} disabled={cancelling}>
            {cancelling ? "Cancelling..." : "Cancel Booking"}
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default BookingsPage;
