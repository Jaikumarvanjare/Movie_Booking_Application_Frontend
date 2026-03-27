import { useEffect, useState } from "react";
import { getPayments } from "../api/paymentApi";
import Loader from "../components/common/Loader";
import { Payment } from "../types/payment";

const PaymentsPage = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const response = await getPayments();
        setPayments(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        console.error("Failed to fetch payments", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, []);

  if (loading) return <Loader />;

  return (
    <div>
      <h1 className="mb-6 text-3xl font-bold text-white">Payment History</h1>
      
      {payments.length === 0 ? (
        <p className="text-slate-400">No payments found.</p>
      ) : (
        <div className="space-y-4">
          {payments.map((payment) => (
            <div
              key={payment.id}
              className="rounded-xl border border-slate-800 bg-slate-900 p-5"
            >
              <div className="flex items-center justify-between">
                <span className="font-semibold text-white">₹{payment.amount}</span>
                <span className={`rounded px-2 py-1 text-xs ${
                  payment.status === 'COMPLETED' 
                    ? 'bg-green-500/20 text-green-400' 
                    : payment.status === 'FAILED'
                    ? 'bg-red-500/20 text-red-400'
                    : 'bg-yellow-500/20 text-yellow-400'
                }`}>
                  {payment.status}
                </span>
              </div>
              <p className="mt-2 text-sm text-slate-400">Booking ID: {payment.bookingId}</p>
              <p className="text-xs text-slate-500 mt-1">
                {new Date(payment.createdAt || "").toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PaymentsPage;