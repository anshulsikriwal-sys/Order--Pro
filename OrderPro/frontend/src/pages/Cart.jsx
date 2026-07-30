import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { getCart, saveCart, money, hasActiveOrder, getActiveOrder } from "../utils/storage";

function Cart() {
  const navigate = useNavigate();
  const [cart, setCart] = useState([]);
  const [activeOrder, setActiveOrder] = useState(null);

  useEffect(() => {
    setCart(getCart());
    setActiveOrder(getActiveOrder());
  }, []);

  const updateQuantity = (id, change) => {
    const updated = cart
      .map((item) =>
        item.id === id ? { ...item, quantity: item.quantity + change } : item
      )
      .filter((item) => item.quantity > 0);

    setCart(updated);
    saveCart(updated);
  };

  const removeItem = (id) => {
    const updated = cart.filter((item) => item.id !== id);
    setCart(updated);
    saveCart(updated);
    toast.success("Item removed");
  };

  const clearCart = () => {
    setCart([]);
    saveCart([]);
    toast.success("Cart cleared");
  };

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = Math.round(subtotal * 0.05);
  const total = subtotal + tax;

  if (cart.length === 0) {
    return (
      <section className="min-h-[65vh] grid place-items-center p-6">
        <div className="text-center reveal-in">
          <div className="text-7xl mb-5">🛒</div>
          <h1 className="text-3xl font-bold">Your cart is empty</h1>
          <p className="text-base-content/60 mt-2 mb-6">Add something delicious from our menu.</p>
          <Link to="/menu" className="btn btn-warning">Browse Menu</Link>
        </div>
      </section>
    );
  }

  const goToCheckout = () => {
    if (hasActiveOrder()) {
      toast.error("You already have an active order. Finish or wait for it before placing another.");
      navigate("/orders");
      return;
    }
    navigate("/checkout");
  };

  return (
    <section className="py-14 page-bg">
      <div className="max-w-6xl mx-auto px-5">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-8">
          <h1 className="section-title">Your Cart</h1>
          <button onClick={clearCart} className="btn btn-ghost btn-sm text-error">
            Clear Cart
          </button>
        </div>

        {activeOrder && (
          <div className="alert alert-warning mb-6 reveal-in">
            <span>
              You have an active order ({activeOrder.id}) in progress. You can browse and edit your
              cart, but you'll need to wait for it to complete before placing a new one.
            </span>
          </div>
        )}

        <div className="grid lg:grid-cols-[1fr_360px] gap-8">
          <div className="space-y-4 stagger">
            {cart.map((item) => (
              <div key={item.id} className="card card-side bg-base-200 shadow-xl card-hover">
                <img src={item.image} alt={item.name} className="w-28 md:w-36 object-cover" />
                <div className="card-body p-4">
                  <h2 className="card-title text-base">{item.name}</h2>
                  <p className="text-warning font-bold">{money(item.price)}</p>

                  <div className="flex flex-wrap items-center gap-2 mt-2">
                    <button className="btn btn-sm btn-press" onClick={() => updateQuantity(item.id, -1)}>−</button>
                    <span className="font-bold px-2">{item.quantity}</span>
                    <button className="btn btn-sm btn-press" onClick={() => updateQuantity(item.id, 1)}>+</button>
                    <button
                      className="btn btn-sm btn-error btn-outline ml-auto btn-press"
                      onClick={() => removeItem(item.id)}
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="card bg-base-200 shadow-xl h-fit reveal-in">
            <div className="card-body">
              <h2 className="card-title mb-4">Order Summary</h2>
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
              <button onClick={goToCheckout} className="btn btn-warning w-full mt-5 btn-press">
                Proceed to Payment
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Cart;
