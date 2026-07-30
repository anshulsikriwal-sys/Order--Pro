import { Link } from "react-router-dom";

function Hero() {
  return (
    <section
      className="hero min-h-[620px] overflow-hidden relative"
      style={{
        backgroundImage:
          "url(https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1800&q=85)",
        backgroundSize: "cover",
        backgroundPosition: "center"
      }}
    >
      <div className="hero-animate absolute inset-0 bg-cover bg-center" style={{
        backgroundImage:
          "url(https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1800&q=85)"
      }} />
      <div className="hero-overlay relative" />
      <div className="hero-content text-center text-neutral-content relative">
        <div className="max-w-3xl">
          <div className="float-badge badge badge-warning badge-lg mb-5">
            Restaurant Ordering System
          </div>
          <h1
            className="mb-5 text-5xl md:text-7xl font-black reveal-in"
            style={{ animationDelay: "0.15s" }}
          >
            Welcome to OrderPro
          </h1>
          <p
            className="mb-8 text-lg md:text-xl text-gray-200 reveal-in"
            style={{ animationDelay: "0.3s" }}
          >
            Delicious food, quick ordering, and an unforgettable restaurant experience.
          </p>
          <div className="reveal-in" style={{ animationDelay: "0.45s" }}>
            <Link to="/menu" className="btn btn-warning btn-lg btn-press">
              Explore Menu
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
