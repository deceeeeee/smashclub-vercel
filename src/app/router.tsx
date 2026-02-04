import { createBrowserRouter, RouterProvider } from "react-router-dom"
import MainLayout from "../components/layout/MainLayout"
import Home from "../pages/Home"
import Login from "../features/auth/Login"
import Register from "../features/auth/Register"
import BookingPage from "../features/booking/BookingPage"
import CheckoutPage from "../features/booking/CheckoutPage"
import BookingDetailPage from "../features/booking/BookingDetailPage"
import NotFoundPage from "../pages/NotFoundPage"

const router = createBrowserRouter([
    {
        path: "/",
        element: <MainLayout />,
        errorElement: <NotFoundPage />,
        children: [
            { path: "/", element: <Home /> },
            { path: "booking", element: <BookingPage /> },
            { path: "booking/checkout/:courtId", element: <CheckoutPage /> },
            { path: "booking/success", element: <BookingDetailPage /> }, // Mock success to detail
            { path: "orders/:id", element: <BookingDetailPage /> },
            // Placeholders
            { path: "shop", element: <div className="p-10 text-center">Toko Peralatan (Coming Soon)</div> },
            { path: "community", element: <div className="p-10 text-center">Komunitas (Coming Soon)</div> },
        ]
    },
    {
        path: "/login",
        element: <Login />
    },
    {
        path: "/register",
        element: <Register />
    },
])

export default function AppRouter() {
    return <RouterProvider router={router} />
}
