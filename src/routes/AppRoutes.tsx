import { Route, Routes } from "react-router-dom";
import AdminProtectedRoute from "../components/admin/AdminProtectedRoute";
import ProtectedRoute from "../components/common/ProtectedRoute";
import MainLayout from "../layouts/MainLayout";
import EditMoviePage from "../pages/admin/EditMoviePage";
import EditShowPage from "../pages/admin/EditShowPage";
import EditTheatrePage from "../pages/admin/EditTheatrePage";
import AdminMoviesPage from "../pages/admin/AdminMoviesPage";
import AdminShowsPage from "../pages/admin/AdminShowsPage";
import AdminTheatresPage from "../pages/admin/AdminTheatresPage";
import AdminUsersPage from "../pages/admin/AdminUsersPage";
import BookShowPage from "../pages/booking/BookShowPage";
import MakePaymentPage from "../pages/booking/MakePaymentPage";
import BookingsPage from "../pages/BookingsPage";
import CreateMoviePage from "../pages/admin/CreateMoviePage";
import CreateShowPage from "../pages/admin/CreateShowPage";
import CreateTheatrePage from "../pages/admin/CreateTheatrePage";
import HomePage from "../pages/HomePage";
import MovieDetailsPage from "../pages/MovieDetailsPage";
import MoviesPage from "../pages/MoviesPage";
import NotFoundPage from "../pages/NotFoundPage";
import PaymentsPage from "../pages/PaymentsPage";
import ResetPasswordPage from "../pages/ResetPasswordPage";
import ShowsPage from "../pages/ShowsPage";
import SignInPage from "../pages/SignInPage";
import SignUpPage from "../pages/SignUpPage";
import TheatresPage from "../pages/TheatresPage";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<HomePage />} />
        <Route path="signin" element={<SignInPage />} />
        <Route path="signup" element={<SignUpPage />} />
        <Route path="movies" element={<MoviesPage />} />
        <Route path="movies/:id" element={<MovieDetailsPage />} />
        <Route path="theatres" element={<TheatresPage />} />
        <Route path="shows" element={<ShowsPage />} />

        <Route
          path="shows/:showId/book"
          element={
            <ProtectedRoute>
              <BookShowPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="bookings/:bookingId/payment"
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
        <Route
          path="reset-password"
          element={
            <ProtectedRoute>
              <ResetPasswordPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="admin/movies"
          element={
            <AdminProtectedRoute allowedRoles={["ADMIN", "CLIENT"]}>
              <AdminMoviesPage />
            </AdminProtectedRoute>
          }
        />
        <Route
          path="admin/movies/create"
          element={
            <AdminProtectedRoute allowedRoles={["ADMIN", "CLIENT"]}>
              <CreateMoviePage />
            </AdminProtectedRoute>
          }
        />
        <Route
          path="admin/movies/:id/edit"
          element={
            <AdminProtectedRoute allowedRoles={["ADMIN", "CLIENT"]}>
              <EditMoviePage />
            </AdminProtectedRoute>
          }
        />
        <Route
          path="admin/theatres"
          element={
            <AdminProtectedRoute allowedRoles={["ADMIN", "CLIENT"]}>
              <AdminTheatresPage />
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
          path="admin/theatres/:id/edit"
          element={
            <AdminProtectedRoute allowedRoles={["ADMIN", "CLIENT"]}>
              <EditTheatrePage />
            </AdminProtectedRoute>
          }
        />
        <Route
          path="admin/shows"
          element={
            <AdminProtectedRoute allowedRoles={["ADMIN", "CLIENT"]}>
              <AdminShowsPage />
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
        <Route
          path="admin/shows/:id/edit"
          element={
            <AdminProtectedRoute allowedRoles={["ADMIN", "CLIENT"]}>
              <EditShowPage />
            </AdminProtectedRoute>
          }
        />
        <Route
          path="admin/users"
          element={
            <AdminProtectedRoute allowedRoles={["ADMIN"]}>
              <AdminUsersPage />
            </AdminProtectedRoute>
          }
        />

        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
