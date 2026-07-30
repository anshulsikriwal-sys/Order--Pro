import { Outlet } from "react-router-dom";

function AuthLayout() {
  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-base-200">
      <div
        className="hero-animate hidden lg:flex bg-cover bg-center relative"
        style={{
          backgroundImage:
            "url(https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=1200&q=80)"
        }}
      >
        <div className="absolute inset-0 bg-black/65" />
        <div className="relative z-10 m-auto max-w-lg p-10">
          <div className="text-warning text-4xl font-black mb-5">🍴 OrderPro</div>
          <h1 className="text-5xl font-black text-white mb-4">
            Great food starts with a great order.
          </h1>
          <p className="text-gray-300 text-lg">
            Login or create your account to explore the menu and place your restaurant order.
          </p>
        </div>
      </div>
      <div className="flex items-center justify-center p-6">
        <div className="reveal-in w-full flex justify-center">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default AuthLayout;