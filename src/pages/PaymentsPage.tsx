import { useEffect, useState } from "react";
import { getPayments } from "../api/paymentApi";
import Badge from "../components/common/Badge";
import Loader from "../components/common/Loader";
import type { Payment } from "../types/payment";

const PaymentsPage = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const response = await getPayments();
        setPayments(Array.isArray(response.data) ? response.data : []);
      } catch {
        console.error("Failed to fetch payments");
      } finally {
        setLoading(false);
      }
    };
    fetchPayments();
  }, []);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "COMPLETED":
      case "SUCCESS":
        return <Badge variant="success">Paid</Badge>;
      case "FAILED":
        return <Badge variant="error">Failed</Badge>;
      case "PENDING":
        return <Badge variant="warning">Pending</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "COMPLETED":
      case "SUCCESS":
        return "✅";
      case "FAILED":
        return "❌";
      default:
        return "⏳";
    }
  };

  if (loading) return <Loader text="Loading payments..." />;

  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold text-white">Payment History</h1>
        <p className="text-slate-400">View all your payment transactions</p>
      </div>

      {payments.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <p className="mb-2 text-5xl">💳</p>
          <h3 className="mb-2 text-xl font-semibold text-white">No payments yet</h3>
          <p className="text-slate-400">Your payment history will appear here</p>
        </div>
      ) : (
        <div className="space-y-3">
          {payments.map((payment) => (
            <div
              key={payment.id}
              className="rounded-2xl border border-slate-800/50 bg-slate-900/50 p-5 transition-all hover:border-slate-700/50"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand/10 text-xl">
                    {getStatusIcon(payment.status)}
                  </div>
                  <div>
                    <p className="font-semibold text-white">₹{payment.amount}</p>
                    <p className="text-xs text-slate-500">Booking: {payment.bookingId.slice(-8)}</p>
                  </div>
                </div>

                <div className="text-right">
                  {getStatusBadge(payment.status)}
                  <p className="mt-1 text-xs text-slate-500">
                    {new Date(payment.createdAt || "").toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric"
                    })}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PaymentsPage;
