import { createBrowserRouter, RouterProvider } from "react-router-dom"
import MainLayout from "../components/layout/MainLayout"
import Home from "../pages/Home"
import Login from "../features/auth/Login"
import Register from "../features/auth/Register"
import VerifyAccount from "../features/auth/VerifyAccount"
import ForgotPasswordPage from "../features/auth/ForgotPasswordPage"
import BookingPage from "../features/booking/BookingPage"
import BookingSchedulePage from "../features/booking/BookingSchedulePage"
import CheckoutPage from "../features/booking/CheckoutPage"
import BookingDetailPage from "../features/booking/BookingDetailPage"
import BookingCancelPage from "../features/booking/BookingCancelPage"
import StorePage from "../features/shop/StorePage"
import ProductDetailPage from "../features/shop/ProductDetailPage"
import ShopCheckoutPage from "../features/shop/ShopCheckoutPage"
import ShopOrderDetailPage from "../features/shop/ShopOrderDetailPage"
import ShopOrderHistoryPage from "../features/shop/ShopOrderHistoryPage"
import ShopOrderCancelPage from "../features/shop/ShopOrderCancelPage"
import BookingHistoryPage from "../features/booking/BookingHistoryPage"
import BookingRefundPage from "../features/booking/BookingRefundPage"
import BookingRefundDetailPage from "../features/booking/BookingRefundDetailPage"
import ShopOrderRefundPage from "../features/shop/ShopOrderRefundPage"
import ShopRefundDetailPage from "../features/shop/ShopRefundDetailPage"
import EditProfilePage from "../features/auth/EditPicturePage"
import SettingsPage from "../features/auth/SettingsPage"
import ChangePasswordPage from "../features/auth/ChangePasswordPage"
import ChangeEmailPage from "../features/auth/ChangeEmailPage"
import ResetPasswordPage from "../features/auth/ResetPasswordPage"
import ResendActivationPage from "../features/auth/ResendActivationPage"
import NotFoundPage from "../pages/NotFoundPage"

const router = createBrowserRouter([
    {
        path: "/",
        element: <MainLayout />,
        errorElement: <NotFoundPage />,
        children: [
            { path: "/", element: <Home /> },
            { path: "profile", element: <EditProfilePage /> },
            { path: "settings", element: <SettingsPage /> },
            { path: "settings/change-password", element: <ChangePasswordPage /> },
            { path: "settings/change-email", element: <ChangeEmailPage /> },
            { path: "booking", element: <BookingPage /> },
            { path: "booking/schedule/:courtId", element: <BookingSchedulePage /> },
            { path: "booking/checkout/:courtId", element: <CheckoutPage /> },
            { path: "booking/success", element: <BookingDetailPage /> }, // Mock success to detail
            { path: "booking/:id", element: <BookingDetailPage /> },
            { path: "booking/:id/cancel", element: <BookingCancelPage /> },
            { path: "booking/:id/refund", element: <BookingRefundPage /> },
            { path: "booking/:id/refund-details", element: <BookingRefundDetailPage /> },
            { path: "booking-history", element: <BookingHistoryPage /> },
            { path: "orders/:id", element: <BookingDetailPage /> },
            // Shop
            { path: "shop", element: <StorePage /> },
            { path: "shop/:productId", element: <ProductDetailPage /> },
            { path: "shop/checkout", element: <ShopCheckoutPage /> },
            { path: "shop/order/:id", element: <ShopOrderDetailPage /> },
            { path: "shop/order/:id/cancel", element: <ShopOrderCancelPage /> },
            { path: "shop/order/:id/refund", element: <ShopOrderRefundPage /> },
            { path: "shop/order/:id/refund-details", element: <ShopRefundDetailPage /> },
            { path: "shop/orders", element: <ShopOrderHistoryPage /> },
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
    {
        path: "/verify",
        element: <VerifyAccount />
    },
    {
        path: "/forgot-password",
        element: <ForgotPasswordPage />
    },
    {
        path: "/resend-verification",
        element: <ResendActivationPage />
    },
    {
        path: "/reset-password",
        element: <ResetPasswordPage />
    },
])



export default function AppRouter() {
    return <RouterProvider router={router} />
}
