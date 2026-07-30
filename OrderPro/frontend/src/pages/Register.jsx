import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { registerUser } from "../utils/auth";

function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "", confirmPassword: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (form.password !== form.confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    if (form.password.length < 6) {
      toast.error("Password must contain at least 6 characters.");
      return;
    }

    setLoading(true);
    const result = await registerUser(form);
    setLoading(false);

    if (!result.success) {
      toast.error(result.message);
      return;
    }

    toast.success("Registration successful!");
    navigate("/", { replace: true });
  };

  return (
    <div className="card w-full max-w-md bg-base-100 shadow-2xl">
      <div className="card-body">
        <div className="text-warning text-3xl font-black mb-2">🍴 OrderPro</div>
        <h1 className="text-3xl font-bold">Create account</h1>
        <p className="text-base-content/60 mb-4">Register once, then order whenever you want.</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="form-control">
            <span className="label-text mb-2">Full Name</span>
            <input
              className="input input-bordered w-full"
              placeholder="Anshul"
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </label>

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
              placeholder="Minimum 6 characters"
              required
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
          </label>

          <label className="form-control">
            <span className="label-text mb-2">Confirm Password</span>
            <input
              type="password"
              className="input input-bordered w-full"
              placeholder="Repeat password"
              required
              value={form.confirmPassword}
              onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
            />
          </label>

          <button className="btn btn-warning w-full btn-press" type="submit" disabled={loading}>
            {loading ? <span className="loading loading-spinner loading-sm" /> : "Create Account"}
          </button>
        </form>

        <p className="text-center mt-4 text-sm">
          Already registered?{" "}
          <Link to="/login" className="link link-warning font-bold">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Register;