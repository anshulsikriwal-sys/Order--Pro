import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import useReveal from "../../hooks/useReveal";

const features = [
  {
    icon: "🍽️",
    title: "Dine In",
    text: "Enjoy freshly prepared meals in our comfortable restaurant.",
    action: "dine-in"
  },
  {
    icon: "🥡",
    title: "Take Away",
    text: "Order your favourite dishes and pick them up anytime.",
    action: "take-away"
  },
  {
    icon: "📱",
    title: "QR Menu",
    text: "Scan the QR code and order directly from your table.",
    action: "qr-menu"
  },
  {
    icon: "📅",
    title: "Table Booking",
    text: "Reserve your table online without waiting in line.",
    action: "table-booking"
  }
];

function Features() {
  const navigate = useNavigate();
  const [ref, visible] = useReveal();
  const [qrOpen, setQrOpen] = useState(false);

  const handleClick = (action) => {
    if (action === "dine-in") {
      toast.success("Dine-in selected — browse the menu to start your table order.");
      navigate("/menu?mode=dine-in");
    } else if (action === "take-away") {
      toast.success("Take-away selected — pick your items and we'll pack them fresh.");
      navigate("/menu?mode=take-away");
    } else if (action === "qr-menu") {
      setQrOpen(true);
    } else if (action === "table-booking") {
      navigate("/contact#booking");
      toast("Table booking requests go through Contact Us for now.", { icon: "📅" });
    }
  };

  return (
    <section className="py-20 bg-base-200">
      <div className="max-w-7xl mx-auto px-5">
        <div className="text-center mb-12">
          <h2 className="section-title">Our Services</h2>
          <p className="mt-3 text-base-content/60">Everything you need for an amazing restaurant experience.</p>
        </div>

        <div ref={ref} className={`grid md:grid-cols-2 lg:grid-cols-4 gap-6 ${visible ? "stagger" : ""}`}>
          {features.map((feature) => (
            <button
              key={feature.title}
              onClick={() => handleClick(feature.action)}
              className={`card bg-base-100 shadow-xl card-hover btn-press icon-bounce text-left cursor-pointer ${
                visible ? "" : "reveal-out"
              }`}
            >
              <div className="card-body items-center text-center">
                <div className="feature-icon text-5xl text-warning">{feature.icon}</div>
                <h3 className="card-title mt-3">{feature.title}</h3>
                <p className="text-base-content/60">{feature.text}</p>
                <span className="btn btn-ghost btn-xs mt-2 text-warning">Tap to continue →</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {qrOpen && (
        <div className="modal modal-open">
          <div className="modal-box pop-in text-center">
            <h3 className="font-bold text-xl mb-3">Scan to order from your table</h3>
            <div className="mx-auto w-48 h-48 grid grid-cols-6 grid-rows-6 gap-0.5 bg-white p-3 rounded-lg">
              {Array.from({ length: 36 }).map((_, i) => (
                <div key={i} className={`${(i * 7) % 3 === 0 ? "bg-black" : "bg-white"}`} />
              ))}
            </div>
            <p className="text-base-content/60 mt-4 text-sm">
              This is a demo QR code. Scanning it (or tapping below) opens the digital menu instantly.
            </p>
            <div className="modal-action justify-center">
              <button className="btn btn-ghost" onClick={() => setQrOpen(false)}>Close</button>
              <button
                className="btn btn-warning"
                onClick={() => {
                  setQrOpen(false);
                  navigate("/menu?mode=qr");
                }}
              >
                Open Menu
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default Features;
