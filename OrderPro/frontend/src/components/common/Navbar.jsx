import { useEffect, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { getCurrentUser, logoutUser } from "../../utils/auth";
import { getCart } from "../../utils/storage";
import { getTheme, toggleTheme } from "../../utils/theme";

function Navbar() {
  const navigate = useNavigate();
  const [user, setUser] = useState(getCurrentUser());
  const [cartCount, setCartCount] = useState(
    getCart().reduce((sum, item) => sum + item.quantity, 0)
  );
  const [pulse, setPulse] = useState(false);
  const [theme, setTheme] = useState(getTheme());

  useEffect(() => {
    const sync = () => {
      setCartCount(getCart().reduce((sum, item) => sum + item.quantity, 0));
      setPulse(true);
      setTimeout(() => setPulse(false), 350);
    };
    const syncAuth = () => setUser(getCurrentUser());
    window.addEventListener("orderpro:cart", sync);
    window.addEventListener("orderpro:auth", syncAuth);
    return () => {
      window.removeEventListener("orderpro:cart", sync);
      window.removeEventListener("orderpro:auth", syncAuth);
    };
  }, []);

  const handleLogout = () => {
    logoutUser();
    toast.success("Logged out successfully");
    // Per requirement: after logout, send the user to the sign-up route first.
    navigate("/register", { replace: true });
  };

  const handleThemeToggle = () => setTheme(toggleTheme());

  const linkClass = ({ isActive }) =>
    `btn btn-ghost btn-sm ${isActive ? "text-warning" : ""}`;

  return (
    <nav className="navbar sticky top-0 z-50 bg-neutral text-neutral-content shadow-lg px-4 md:px-8">
      <div className="navbar-start">
        <div className="dropdown">
          <button tabIndex={0} className="btn btn-ghost lg:hidden text-xl">☰</button>
          <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[60] w-52 rounded-box bg-neutral p-2 shadow">
            <li><NavLink to="/" className={linkClass}>Home</NavLink></li>
            <li><NavLink to="/menu" className={linkClass}>Menu</NavLink></li>
            <li><NavLink to="/orders" className={linkClass}>Orders</NavLink></li>
            {/* <li><NavLink to="/wishlist" className={linkClass}>Wishlist</NavLink></li> */}
            <li><NavLink to="/contact" className={linkClass}>Contact</NavLink></li>
          </ul>
        </div>

        <Link to="/" className="text-2xl font-extrabold text-warning">
          🍴 OrderPro
        </Link>
      </div>

      <div className="navbar-center hidden lg:flex">
        <div className="flex gap-1">
          <NavLink to="/" className={linkClass}>Home</NavLink>
          <NavLink to="/menu" className={linkClass}>Menu</NavLink>
          <NavLink to="/orders" className={linkClass}>Orders</NavLink>
          {/* <NavLink to="/wishlist" className={linkClass}>Wishlist</NavLink> */}
          <NavLink to="/contact" className={linkClass}>Contact</NavLink>
        </div>
      </div>

      <div className="navbar-end gap-2">
        <button
          onClick={handleThemeToggle}
          className="btn btn-ghost btn-sm btn-circle btn-press"
          aria-label="Toggle theme"
          title="Toggle light / dark mode"
        >
          {theme === "dark" ? "☀️" : "🌙"}
        </button>

        {user ? (
          <>
            <Link to="/cart" className="btn btn-warning btn-sm btn-press">
              🛒 <span className="hidden sm:inline">Cart</span>
              {cartCount > 0 && (
                <span className={`badge badge-neutral ${pulse ? "pulse-once" : ""}`}>{cartCount}</span>
              )}
            </Link>

            <Link to="/profile" className="btn btn-ghost btn-sm hidden sm:flex">
              {user.name}
            </Link>

            <button onClick={handleLogout} className="btn btn-error btn-sm btn-press">
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="btn btn-ghost btn-sm">Sign In</Link>
            <Link to="/register" className="btn btn-warning btn-sm">Sign Up</Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
