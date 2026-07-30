import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { loginUser } from "../utils/auth";

function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    const result = await loginUser(form.email, form.password);
    setLoading(false);

    if (!result.success) {
      toast.error(result.message);
      return;
    }

    toast.success(`Welcome back, ${result.user.name}!`);
    navigate(location.state?.from || "/", { replace: true });
  };

  return (
    <div className="card w-full max-w-md bg-base-100 shadow-2xl">
      <div className="card-body">
        <div className="text-warning text-3xl font-black mb-2">🍴 OrderPro</div>
        <h1 className="text-3xl font-bold">Welcome back</h1>
        <p className="text-base-content/60 mb-4">Login to continue ordering.</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="form-control">
            <span className="label-text mb-2">Email</span>
            <input
              type="email"
              className="input input-bordered w-full"
              placeholder="you@example.com"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </label>

          <label className="form-control">
            <span className="label-text mb-2">Password</span>
            <input
              type="password"
              className="input input-bordered w-full"
              placeholder="••••••••"
              required
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
          </label>

          <button className="btn btn-warning w-full btn-press" type="submit" disabled={loading}>
            {loading ? <span className="loading loading-spinner loading-sm" /> : "Sign In"}
          </button>
        </form>

        <p className="text-center mt-4 text-sm">
          Don't have an account?{" "}
          <Link to="/register" className="link link-warning font-bold">
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;