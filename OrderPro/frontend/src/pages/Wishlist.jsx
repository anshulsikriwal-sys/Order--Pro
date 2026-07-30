import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { getWishlist, toggleWishlist, money } from "../utils/storage";
import { addFoodToCart } from "../utils/cartActions";
import useReveal from "../hooks/useReveal";

function Wishlist() {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [ref, visible] = useReveal();

  useEffect(() => {
    const sync = () => setItems(getWishlist());
    sync();
    window.addEventListener("orderpro:wishlist", sync);
    window.addEventListener("orderpro:auth", sync);
    return () => {
      window.removeEventListener("orderpro:wishlist", sync);
      window.removeEventListener("orderpro:auth", sync);
    };
  }, []);

  const remove = (food) => {
    toggleWishlist(food);
    setItems((prev) => prev.filter((item) => item.id !== food.id));
    toast.success("Removed from wishlist");
  };

  const addToCart = async (food) => {
    await addFoodToCart(food, 1);
    toast.success(`${food.name} added to cart`);
  };

  if (items.length === 0) {
    return (
      <section className="min-h-[65vh] grid place-items-center p-6">
        <div className="text-center reveal-in">
          <div className="text-7xl mb-5">🤍</div>
          <h1 className="text-3xl font-bold">Your wishlist is empty</h1>
          <p className="text-base-content/60 mt-2 mb-6">Tap the heart on any dish to save it here.</p>
          <button onClick={() => navigate("/menu")} className="btn btn-warning">Browse Menu</button>
        </div>
      </section>
    );
  }

  return (
    <section className="py-14 page-bg">
      <div className="max-w-6xl mx-auto px-5">
        <h1 className="section-title mb-8">Your Wishlist</h1>

        <div ref={ref} className={`grid sm:grid-cols-2 lg:grid-cols-3 gap-5 ${visible ? "stagger" : ""}`}>
          {items.map((food) => (
            <div key={food.id} className={`food-card mx-auto w-full card bg-base-200 shadow-xl overflow-hidden card-hover ${visible ? "" : "reveal-out"}`}>
              <img src={food.image} alt={food.name} className="food-image" />
              <div className="card-body">
                <h2 className="card-title">{food.name}</h2>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-warning font-bold">{money(food.price)}</span>
                  <span className="text-sm">⭐ {food.rating}</span>
                </div>
                <div className="flex gap-2 mt-3">
                  <button onClick={() => addToCart(food)} className="btn btn-warning btn-sm flex-1 btn-press">
                    Add to Cart
                  </button>
                  <button onClick={() => remove(food)} className="btn btn-error btn-sm btn-outline btn-press">
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-10">
          <Link to="/menu" className="link link-warning">Continue browsing the menu →</Link>
        </div>
      </div>
    </section>
  );
}

export default Wishlist;
