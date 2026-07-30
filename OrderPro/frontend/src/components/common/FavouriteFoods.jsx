import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { menuItems } from "../../data/menu";
import { money, toggleWishlist, isWishlisted } from "../../utils/storage";
import { isAuthenticated } from "../../utils/auth";
import { addFoodToCart } from "../../utils/cartActions";
import useReveal from "../../hooks/useReveal";

function FavouriteFoods() {
  const navigate = useNavigate();
  const [ref, visible] = useReveal();
  const favourites = menuItems.slice().sort((a, b) => b.rating - a.rating).slice(0, 4);

  const addToCart = async (food) => {
    if (!isAuthenticated()) {
      toast.error("Please login before ordering.");
      navigate("/login", { state: { from: "/menu" } });
      return;
    }
    await addFoodToCart(food, 1);
    toast.success(`${food.name} added to cart`);
  };

  const handleWishlist = (food) => {
    const added = toggleWishlist(food);
    toast.success(added ? `${food.name} added to wishlist` : `${food.name} removed from wishlist`);
  };

  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-5">
        <div className="text-center mb-12">
          <h2 className="section-title">Customer Favourites</h2>
          <p className="mt-3 text-base-content/60">Popular dishes our guests love.</p>
        </div>

        <div ref={ref} className={`grid sm:grid-cols-2 lg:grid-cols-4`}>
          {favourites.map((food) => (
            <div
              key={food.id}
              className={`food-card mx-auto w-full card bg-base-200 shadow-xl overflow-hidden card-hover relative`}
            >
              <button
                onClick={() => handleWishlist(food)}
                className="absolute top-2 right-2 z-10 btn btn-circle btn-xs bg-base-100/80 border-none btn-press"
                aria-label="Toggle wishlist"
              >
                {isWishlisted(food.id) ? "❤️" : "🤍"}
              </button>
              <img src={food.image} alt={food.name} className="food-image" />
              <div className="card-body">
                <h3 className="card-title">{food.name}</h3>
                <p className="text-base-content/60 text-sm">{food.description}</p>

                <div className="flex justify-between items-center mt-3">
                  <span className="font-bold text-warning">{money(food.price)}</span>
                  <span>⭐ {food.rating}</span>
                </div>

                <button
                  onClick={() => addToCart(food)}
                  className="btn btn-warning btn-sm w-full mt-3 btn-press"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default FavouriteFoods;
