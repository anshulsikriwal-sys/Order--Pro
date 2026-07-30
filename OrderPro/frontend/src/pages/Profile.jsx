import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { getCurrentUser, logoutUser } from "../utils/auth";
import { getOrders, getWishlist } from "../utils/storage";

function Profile() {
  const navigate = useNavigate();
  const user = getCurrentUser();
  const orderCount = getOrders().filter((o) => o.userEmail === user?.email).length;
  const wishlistCount = getWishlist().length;

  const handleLogout = () => {
    logoutUser();
    toast.success("Logged out successfully");
    // Per requirement: after logout, send the user to sign-up first.
    navigate("/register", { replace: true });
  };

  return (
    <section className="py-16 min-h-[65vh]">
      <div className="max-w-3xl mx-auto px-5">
        <div className="card bg-base-200 shadow-xl reveal-in">
          <div className="card-body">
            <div className="avatar placeholder mx-auto pop-in">
              <div className="bg-warning text-neutral rounded-full w-24">
                <span className="text-3xl font-bold">{user?.name?.charAt(0)?.toUpperCase()}</span>
              </div>
            </div>

            <h1 className="text-3xl font-bold text-center mt-4">{user?.name}</h1>
            <p className="text-center text-base-content/60">{user?.email}</p>
            {user?.source && (
              <p className="text-center text-xs text-base-content/40">
                Account synced with {user.source === "backend" ? "OrderPro server" : "this device (offline mode)"}
              </p>
            )}

            <div className="divider" />

            <div className="grid md:grid-cols-3 gap-4 stagger">
              <div className="stat bg-base-100 rounded-box">
                <div className="stat-title">Orders Placed</div>
                <div className="stat-value text-warning text-2xl">{orderCount}</div>
              </div>

              <div className="stat bg-base-100 rounded-box">
                <div className="stat-title">Wishlist Items</div>
                <div className="stat-value text-info text-2xl">{wishlistCount}</div>
              </div>

              <div className="stat bg-base-100 rounded-box">
                <div className="stat-title">Ordering</div>
                <div className="stat-value text-success text-2xl">Enabled</div>
              </div>
            </div>

            <button onClick={handleLogout} className="btn btn-error mt-6 btn-press">
              Logout
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Profile;
