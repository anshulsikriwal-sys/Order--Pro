import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { money, toggleWishlist, isWishlisted } from "../../utils/storage";
import { isAuthenticated } from "../../utils/auth";
import { addFoodToCart } from "../../utils/cartActions";

function FoodCard({ food }) {
  const navigate = useNavigate();
  const [wishlisted, setWishlisted] = useState(isWishlisted(food.id));
  const [justAdded, setJustAdded] = useState(false);

  const addToCart = async () => {
    if (!isAuthenticated()) {
      toast.error("Please login or register before ordering.");
      navigate("/login", { state: { from: "/menu" } });
      return;
    }

    await addFoodToCart(food, 1);
    toast.success("Added to cart!");
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 400);
  };

  const handleWishlist = () => {
    const added = toggleWishlist(food);
    setWishlisted(added);
    toast.success(added ? "Added to wishlist" : "Removed from wishlist");
  };

  return (
    <div className="food-card mx-auto w-full card bg-base-200 shadow-xl overflow-hidden h-full card-hover relative">
      <button
        onClick={handleWishlist}
        className="absolute top-2 right-2 z-10 btn btn-circle btn-xs bg-base-100/80 border-none btn-press"
        aria-label="Toggle wishlist"
      >
        {wishlisted ? "❤️" : "🤍"}
      </button>
      <img src={food.image} alt={food.name} className="food-image" />
      <div className="card-body">
        <h2 className="card-title">{food.name}</h2>
        <p className="text-base-content/60 text-sm min-h-10">{food.description}</p>

        <div className="flex justify-between items-center mt-2">
          <span className="text-warning font-bold">{money(food.price)}</span>
          <span className="text-sm">⭐ {food.rating}</span>
        </div>

        <button
          onClick={addToCart}
          className={`btn btn-warning btn-sm w-full mt-3 btn-press ${justAdded ? "pulse-once" : ""}`}
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
}

export default FoodCard;
