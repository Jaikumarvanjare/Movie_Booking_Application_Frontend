import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { createBooking } from "../../api/bookingApi";
import { getShowById } from "../../api/showApi";
import Button from "../../components/common/Button";
import Loader from "../../components/common/Loader";
import { useToast } from "../../context/ToastContext";
import type { Show } from "../../types/show";
import { parseSeatSelection, serializeSeatSelection } from "../../utils/booking";
import { appRoutes } from "../../utils/routes";

const STEPS = ["Select Seats", "Review", "Payment"];
const SEATS_PER_ROW = 10;
const SEAT_GROUPS = [
  [1, 2, 3, 4, 5],
  [6, 7, 8, 9, 10]
];

const getRowLabel = (rowIndex: number) => {
  let value = rowIndex + 1;
  let label = "";

  while (value > 0) {
    value -= 1;
    label = String.fromCharCode(65 + (value % 26)) + label;
    value = Math.floor(value / 26);
  }

  return label;
};

const parseUnavailableSeats = (seatConfiguration?: string) => {
  if (!seatConfiguration) return new Set<string>();

  try {
    const parsed = JSON.parse(seatConfiguration);
    const values = Array.isArray(parsed)
      ? parsed
      : parsed.reservedSeats || parsed.bookedSeats || parsed.unavailableSeats || [];

    if (Array.isArray(values)) {
      return new Set(values.map(String).map((seat) => seat.toUpperCase()));
    }
  } catch {
    return new Set(
      seatConfiguration
        .split(",")
        .map((seat) => seat.trim().toUpperCase())
        .filter(Boolean)
    );
  }

  return new Set<string>();
};

const BookShowPage = () => {
  const { showId } = useParams<{ showId: string }>();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [show, setShow] = useState<Show | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [step, setStep] = useState(0);

  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);

  useEffect(() => {
    const fetchShow = async () => {
      if (!showId) return;

      try {
        const response = await getShowById(showId);
        setShow(response.data);
      } catch {
        setError("Failed to load show details");
      } finally {
        setLoading(false);
      }
    };

    fetchShow();
  }, [showId]);

  const handleSubmit = async () => {
    if (!show) return;

    setSubmitting(true);
    setError("");

    try {
      const payload: {
        theatreId: string;
        movieId: string;
        timing: string;
        noOfSeats: number;
        seat?: string;
      } = {
        theatreId: show.theatreId,
        movieId: show.movieId,
        timing: show.timing,
        noOfSeats: selectedSeats.length
      };

      if (!selectedSeats.length) {
        throw new Error("Please select at least one seat.");
      }

      payload.seat = serializeSeatSelection(parseSeatSelection(selectedSeats.join(", ")));

      const response = await createBooking(payload);
      const bookingId = response.data?.id;

      if (!bookingId) {
        throw new Error("Booking was created without an id.");
      }

      showToast("Booking created! Redirecting to payment...", "success");
      navigate(appRoutes.bookingPayment(bookingId));
    } catch (err: any) {
      const errorData = err?.response?.data;
      const errMsg = errorData?.err || errorData?.message || err?.message || "Failed to create booking";
      setError(typeof errMsg === 'string' ? errMsg : JSON.stringify(errMsg));
      showToast("Booking failed", "error");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Loader text="Loading show..." />;
  if (!show) return <div className="text-center text-red-400">Show not found</div>;

  const unavailableSeats = parseUnavailableSeats(show.seatConfiguration);
  const rowCount = Math.ceil(show.noOfSeats / SEATS_PER_ROW);
  const totalPrice = show.price * selectedSeats.length;

  const toggleSeat = (seatLabel: string) => {
    setSelectedSeats((currentSeats) =>
      currentSeats.includes(seatLabel)
        ? currentSeats.filter((seat) => seat !== seatLabel)
        : [...currentSeats, seatLabel]
    );
  };

  return (
    <div className="mx-auto max-w-2xl animate-fade-in-up">
      <div className="mb-8 flex items-center justify-center gap-2">
        {STEPS.map((label, i) => (
          <div key={label} className="flex items-center gap-2">
            <div className="flex items-center gap-2">
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold transition-all ${
                  i <= step
                    ? "bg-brand text-white shadow-lg shadow-brand/30"
                    : "bg-slate-800 text-slate-500"
                }`}
              >
                {i < step ? "✓" : i + 1}
              </div>
              <span
                className={`hidden text-sm sm:block ${
                  i <= step ? "font-medium text-white" : "text-slate-500"
                }`}
              >
                {label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div
                className={`mx-2 h-0.5 w-8 rounded ${
                  i < step ? "bg-brand" : "bg-slate-800"
                }`}
              />
            )}
          </div>
        ))}
      </div>

      <div className="glass rounded-2xl p-6 shadow-2xl">
        <div className="mb-6 rounded-xl bg-slate-800/50 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400">Show Time</p>
              <p className="text-lg font-bold text-white">
                {new Date(show.timing).toLocaleString("en-IN", {
                  weekday: "short",
                  day: "numeric",
                  month: "short",
                  hour: "2-digit",
                  minute: "2-digit"
                })}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-slate-400">Format</p>
              <p className="text-lg font-bold text-brand">{show.format || "Standard"}</p>
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-4 rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-400">
            {error}
          </div>
        )}

        {step === 0 && (
          <div className="space-y-5">
            <div>
              <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h3 className="text-lg font-bold text-white">Choose your seats</h3>
                  <p className="text-sm text-slate-400">
                    {selectedSeats.length
                      ? `${selectedSeats.length} selected: ${selectedSeats.join(", ")}`
                      : "Tap any available seat in the seating plan."}
                  </p>
                </div>
                <div className="rounded-full border border-brand/30 bg-brand/10 px-4 py-1.5 text-sm font-semibold text-brand">
                  ₹{show.price} / seat
                </div>
              </div>

              <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-950 p-4">
                <div className="mx-auto min-w-[460px] max-w-2xl">
                  <div className="mx-auto mb-9 w-4/5 rounded-b-2xl bg-brand py-3 text-center text-sm font-semibold text-white shadow-lg shadow-brand/20">
                    Screen is this way
                  </div>

                  <div className="space-y-2">
                    {Array.from({ length: rowCount }).map((_, rowIndex) => {
                      const rowLabel = getRowLabel(rowIndex);

                      return (
                        <div key={rowLabel} className="flex items-center justify-center gap-3">
                          <span className="w-6 text-right text-xs font-semibold text-slate-500">
                            {rowLabel}
                          </span>

                          <div className="flex gap-9">
                            {SEAT_GROUPS.map((group) => (
                              <div key={group.join("-")} className="grid grid-cols-5 gap-2">
                                {group.map((seatNumber) => {
                                  const seatIndex = rowIndex * SEATS_PER_ROW + seatNumber;
                                  const seatLabel = `${rowLabel}${seatNumber}`;
                                  const isSelected = selectedSeats.includes(seatLabel);
                                  const isUnavailable =
                                    seatIndex > show.noOfSeats || unavailableSeats.has(seatLabel);

                                  if (seatIndex > show.noOfSeats) {
                                    return <span key={seatLabel} className="h-7 w-7" />;
                                  }

                                  return (
                                    <button
                                      key={seatLabel}
                                      type="button"
                                      aria-label={`${seatLabel} ${
                                        isUnavailable
                                          ? "reserved"
                                          : isSelected
                                            ? "selected"
                                            : "available"
                                      }`}
                                      title={seatLabel}
                                      disabled={isUnavailable}
                                      onClick={() => toggleSeat(seatLabel)}
                                      className={`h-7 w-7 rounded-b-lg border-[5px] border-t-0 text-[0px] transition-all focus:outline-none focus:ring-2 focus:ring-brand focus:ring-offset-2 focus:ring-offset-slate-950 ${
                                        isUnavailable
                                          ? "cursor-not-allowed border-slate-800 bg-slate-950"
                                          : isSelected
                                            ? "border-red-600 bg-red-900 shadow-[0_0_0_3px_rgba(220,38,38,0.18)]"
                                            : "border-slate-500 bg-slate-900 hover:border-slate-300"
                                      }`}
                                    >
                                      {seatLabel}
                                    </button>
                                  );
                                })}
                              </div>
                            ))}
                          </div>

                          <span className="w-6" />
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-5 text-sm text-slate-300">
                <span className="flex items-center gap-2">
                  <span className="h-7 w-7 rounded-b-lg border-[5px] border-t-0 border-slate-500 bg-slate-900" />
                  Available seat
                </span>
                <span className="flex items-center gap-2">
                  <span className="h-7 w-7 rounded-b-lg border-[5px] border-t-0 border-slate-800 bg-slate-950" />
                  Reserved seat
                </span>
                <span className="flex items-center gap-2">
                  <span className="h-7 w-7 rounded-b-lg border-[5px] border-t-0 border-red-600 bg-red-900" />
                  Selected seat
                </span>
              </div>
            </div>

            <Button
              className="w-full"
              size="lg"
              onClick={() => setStep(1)}
              disabled={!selectedSeats.length}
            >
              Continue to Review
            </Button>
          </div>
        )}

        {step === 1 && (
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-white">Booking Summary</h3>

            <div className="space-y-3 rounded-xl bg-slate-800/50 p-4">
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Price per seat</span>
                <span className="font-medium text-white">₹{show.price}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Number of seats</span>
                <span className="font-medium text-white">{selectedSeats.length}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Available seats</span>
                <span className="font-medium text-white">{show.noOfSeats}</span>
              </div>
              {selectedSeats.length > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Seats</span>
                  <span className="font-medium text-white">{selectedSeats.join(", ")}</span>
                </div>
              )}
              <div className="flex justify-between border-t border-slate-700 pt-3">
                <span className="font-semibold text-white">Total</span>
                <span className="text-xl font-bold text-brand">₹{totalPrice}</span>
              </div>
            </div>

            <div className="flex gap-3">
              <Button variant="ghost" className="flex-1" onClick={() => setStep(0)}>
                Back
              </Button>
              <Button className="flex-1" size="lg" onClick={handleSubmit} disabled={submitting}>
                {submitting ? "Processing..." : "Confirm & Pay"}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookShowPage;
