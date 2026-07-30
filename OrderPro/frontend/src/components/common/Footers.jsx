import { Link } from "react-router-dom";

function Footers() {
  return (
    <footer className="bg-neutral text-neutral-content mt-auto">
      <div className="footer max-w-7xl mx-auto p-10 grid-cols-1 md:grid-cols-3">
        <aside>
          <div className="text-3xl font-extrabold text-warning">🍴 OrderPro</div>
          <p className="max-w-sm text-base-content/70">
            Delicious food, quick ordering, and a memorable restaurant experience.
          </p>
        </aside>

        <nav>
          <h6 className="footer-title">Quick Links</h6>
          <Link to="/" className="link link-hover">Home</Link>
          <Link to="/menu" className="link link-hover">Menu</Link>
          <Link to="/orders" className="link link-hover">Orders</Link>
          <Link to="/contact" className="link link-hover">Contact</Link>
        </nav>

        <nav>
          <h6 className="footer-title">Account</h6>
          <Link to="/profile" className="link link-hover">Profile</Link>
          <Link to="/wishlist" className="link link-hover">Wishlist</Link>
          <Link to="/cart" className="link link-hover">Cart</Link>
          <Link to="/login" className="link link-hover">Sign In</Link>
        </nav>
      </div>

      <div className="border-t border-white/10 text-center p-5 text-sm text-base-content/60">
        © {new Date().getFullYear()} OrderPro. All rights reserved.
      </div>
    </footer>
  );
}

export default Footers;
