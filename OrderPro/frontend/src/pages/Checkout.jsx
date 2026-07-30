import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { getCart, saveCart, money, hasActiveOrder, placeOrder } from "../utils/storage";
import { getCurrentUser } from "../utils/auth";

const PAYMENT_METHODS = [
  { id: "card", label: "Credit / Debit Card", icon: "💳" },
  { id: "upi", label: "UPI", icon: "📲" },
  { id: "cod", label: "Cash on Delivery", icon: "💵" }
];

function Checkout() {
  const navigate = useNavigate();
  const user = getCurrentUser();
  const [cart, setCart] = useState([]);
  const [method, setMethod] = useState("upi");
  const [address, setAddress] = useState("");
  const [processing, setProcessing] = useState(false);
  const [step, setStep] = useState("review"); // review -> paying -> done

  useEffect(() => {
    const items = getCart();
    if (items.length === 0) {
      navigate("/cart");
      return;
    }
    if (hasActiveOrder()) {
      toast.error("You already have an active order. Complete it before placing a new one.");
      navigate("/orders");
      return;
    }
    setCart(items);
  }, [navigate]);

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = Math.round(subtotal * 0.05);
  const total = subtotal + tax;

  const payAndPlaceOrder = async (event) => {
    event.preventDefault();

    if (hasActiveOrder()) {
      toast.error("You already have an active order in progress.");
      navigate("/orders");
      return;
    }
    if (!address.trim()) {
      toast.error("Please add a delivery / table address.");
      return;
    }

    setProcessing(true);
    setStep("paying");

    // Simulated payment gateway step.
    await new Promise((resolve) => setTimeout(resolve, 1200));

    const result = await placeOrder({
      cart,
      total,
      deliveryAddress: address.trim(),
      paymentMethod: method
    });

    if (!result.success) {
      toast.error("Payment failed. Please try again.");
      setProcessing(false);
      setStep("review");
      return;
    }

    saveCart([]);
    setStep("done");
    toast.success("Payment successful — order placed!");
    setTimeout(() => navigate("/orders", { replace: true }), 900);
  };

  if (step === "done") {
    return (
      <section className="min-h-[65vh] grid place-items-center p-6">
        <div className="text-center pop-in">
          <div className="text-7xl mb-4">✅</div>
          <h1 className="text-3xl font-bold">Payment Successful!</h1>
          <p className="text-base-content/60 mt-2">Redirecting you to your order...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-14 page-bg">
      <div className="max-w-4xl mx-auto px-5">
        <h1 className="section-title mb-8">Checkout &amp; Payment</h1>

        <form onSubmit={payAndPlaceOrder} className="grid md:grid-cols-[1fr_320px] gap-8">
          <div className="space-y-6">
            <div className="card bg-base-200 shadow-xl reveal-in">
              <div className="card-body">
                <h2 className="card-title">Delivery / Table Details</h2>
                <label className="form-control">
                  <span className="label-text mb-2">Address or table number</span>
                  <textarea
                    className="textarea textarea-bordered w-full"
                    placeholder="e.g. Flat 302, Green Residency, Gurugram — or Table 12"
                    rows="3"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    required
                  />
                </label>
                <p className="text-xs text-base-content/50">Signed in as {user?.name} ({user?.email})</p>
              </div>
            </div>

            <div className="card bg-base-200 shadow-xl reveal-in" style={{ animationDelay: "0.1s" }}>
              <div className="card-body">
                <h2 className="card-title">Payment Method</h2>
                <div className="grid sm:grid-cols-3 gap-3 mt-2">
                  {PAYMENT_METHODS.map((option) => (
                    <button
                      type="button"
                      key={option.id}
                      onClick={() => setMethod(option.id)}
                      className={`btn btn-press h-20 flex-col ${
                        method === option.id ? "btn-warning" : "btn-outline"
                      }`}
                    >
                      <span className="text-2xl">{option.icon}</span>
                      <span className="text-xs">{option.label}</span>
                    </button>
                  ))}
                </div>

                {method === "card" && (
                  <div className="grid sm:grid-cols-2 gap-3 mt-4 reveal-in">
                    <input className="input input-bordered sm:col-span-2" placeholder="Card number (demo)" maxLength={19} />
                    <input className="input input-bordered" placeholder="MM/YY" maxLength={5} />
                    <input className="input input-bordered" placeholder="CVV" maxLength={3} />
                  </div>
                )}
                {method === "upi" && (
                  <div className="mt-4 reveal-in">
                    <input className="input input-bordered w-full" placeholder="yourname@upi (demo)" />
                  </div>
                )}
                {method === "cod" && (
                  <p className="mt-4 text-sm text-base-content/60 reveal-in">
                    Pay with cash when your order arrives.
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="card bg-base-200 shadow-xl h-fit reveal-in" style={{ animationDelay: "0.2s" }}>
            <div className="card-body">
              <h2 className="card-title mb-3">Order Summary</h2>
              <div className="space-y-1 max-h-48 overflow-auto pr-1">
                {cart.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span>{item.name} × {item.quantity}</span>
                    <span>{money(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>
              <div className="divider my-2" />
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>{money(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>GST (5%)</span>
                <span>{money(tax)}</span>
              </div>
              <div className="divider my-2" />
              <div className="flex justify-between text-xl font-bold">
                <span>Total</span>
                <span className="text-warning">{money(total)}</span>
              </div>

              <button type="submit" disabled={processing} className="btn btn-warning w-full mt-5 btn-press">
                {processing ? (
                  <span className="flex items-center gap-2">
                    <span className="loading loading-spinner loading-sm" /> Processing payment...
                  </span>
                ) : (
                  `Pay ${money(total)} & Confirm Order`
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </section>
  );
}

export default Checkout;
