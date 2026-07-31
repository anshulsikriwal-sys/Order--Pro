import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";

import MainLayout from "../layouts/MainLayout";
import AuthLayout from "../layouts/AuthLayout";
import ProtectedRoute from "../components/common/ProtectedRoute";
import GuestRoute from "../components/common/GuestRoute";

import Home from "../pages/Home";
import Menu from "../pages/Menu";
import Orders from "../pages/Orders";
import TrackOrder from "../pages/TrackOrder";
import Contact from "../pages/Contact";
import Profile from "../pages/Profile";
import Cart from "../pages/Cart";
import Checkout from "../pages/Checkout";
import Login from "../pages/Login";
import Register from "../pages/Register";

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <div key={location.pathname} className="page-transition">
      <Routes location={location}>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/contact" element={<Contact />} />


          <Route element={<ProtectedRoute />}>
            <Route path="/orders" element={<Orders />} />
            <Route path="/orders/:orderId/track" element={<TrackOrder />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
          </Route>
        </Route>

        <Route element={<AuthLayout />}>
          <Route element={<GuestRoute />}>
            <Route path="/login" element={<Login />} />
            <Route path="/signIn" element={<Register />} />
          </Route>
        </Route>
      </Routes>
    </div>
  );
}

function AppRoutes() {
  return (
    <BrowserRouter>
      <AnimatedRoutes />
    </BrowserRouter>
  );
}

export default AppRoutes;
