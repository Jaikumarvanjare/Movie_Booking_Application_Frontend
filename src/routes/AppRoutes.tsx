import { Route, Routes } from "react-router-dom";
import AdminProtectedRoute from "../components/admin/AdminProtectedRoute";
import ProtectedRoute from "../components/common/ProtectedRoute";
import MainLayout from "../layouts/MainLayout";
import BookShowPage from "../pages/booking/BookShowPage";
import BookingsPage from "../pages/BookingsPage";
import CreateMoviePage from "../pages/admin/CreateMoviePage";
import CreateShowPage from "../pages/admin/CreateShowPage";
import CreateTheatrePage from "../pages/admin/CreateTheatrePage";
import HomePage from "../pages/HomePage";
import MakePaymentPage from "../pages/booking/MakePaymentPage";
import MovieDetailsPage from "../pages/MovieDetailsPage";
import MoviesPage from "../pages/MoviesPage";
import NotFoundPage from "../pages/NotFoundPage";
import PaymentsPage from "../pages/PaymentsPage";
import ShowsPage from "../pages/ShowsPage";
import SignInPage from "../pages/SignInPage";
import SignUpPage from "../pages/SignUpPage";
import TheatresPage from "../pages/TheatresPage";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        {/* Public Routes */}
        <Route index element={<HomePage />} />
        <Route path="signin" element={<SignInPage />} />
        <Route path="signup" element={<SignUpPage />} />
        <Route path="movies" element={<MoviesPage />} />
        <Route path="movies/:id" element={<MovieDetailsPage />} />
        <Route path="theatres" element={<TheatresPage />} />
        <Route path="shows" element={<ShowsPage />} />

        {/* Protected Customer Routes */}
        <Route
          path="shows/:showId/book"
          element={
            <ProtectedRoute>
              <BookShowPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="payment"
          element={
            <ProtectedRoute>
              <MakePaymentPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="bookings"
          element={
            <ProtectedRoute>
              <BookingsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="payments"
          element={
            <ProtectedRoute>
              <PaymentsPage />
            </ProtectedRoute>
          }
        />

        {/* Admin/Client Only Routes */}
        <Route
          path="admin/movies/create"
          element={
            <AdminProtectedRoute allowedRoles={["ADMIN", "CLIENT"]}>
              <CreateMoviePage />
            </AdminProtectedRoute>
          }
        />
        <Route
          path="admin/theatres/create"
          element={
            <AdminProtectedRoute allowedRoles={["ADMIN", "CLIENT"]}>
              <CreateTheatrePage />
            </AdminProtectedRoute>
          }
        />
        <Route
          path="admin/shows/create"
          element={
            <AdminProtectedRoute allowedRoles={["ADMIN", "CLIENT"]}>
              <CreateShowPage />
            </AdminProtectedRoute>
          }
        />

        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;