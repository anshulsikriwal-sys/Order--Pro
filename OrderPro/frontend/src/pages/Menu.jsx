import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import FoodCard from "../components/food/FoodCard";
import { categories, menuItems } from "../data/menu";
import useReveal from "../hooks/useReveal";

const SORT_OPTIONS = [
  { id: "default", label: "Sort: Featured" },
  { id: "price-low", label: "Price: Low to High" },
  { id: "price-high", label: "Price: High to Low" },
  { id: "rating", label: "Rating: High to Low" }
];

function Menu() {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeCategory = searchParams.get("category") || "all";
  const mode = searchParams.get("mode");

  const [query, setQuery] = useState("");
  const [maxPrice, setMaxPrice] = useState(500);
  const [minRating, setMinRating] = useState(0);
  const [sort, setSort] = useState("default");
  const [ref, visible] = useReveal();

  useEffect(() => {
    if (mode === "dine-in") toast("Dine-in mode: your order will be served at your table.", { icon: "🍽️" });
    if (mode === "take-away") toast("Take-away mode: your order will be packed to go.", { icon: "🥡" });
    if (mode === "qr") toast("Ordering via QR menu.", { icon: "📱" });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const foods = useMemo(() => {
    let list =
      activeCategory === "all" ? menuItems : menuItems.filter((item) => item.category === activeCategory);

    if (query.trim()) {
      const q = query.trim().toLowerCase();
      list = list.filter(
        (item) =>
          item.name.toLowerCase().includes(q) || item.description.toLowerCase().includes(q)
      );
    }

    list = list.filter((item) => item.price <= maxPrice && item.rating >= minRating);

    if (sort === "price-low") list = [...list].sort((a, b) => a.price - b.price);
    if (sort === "price-high") list = [...list].sort((a, b) => b.price - a.price);
    if (sort === "rating") list = [...list].sort((a, b) => b.rating - a.rating);

    return list;
  }, [activeCategory, query, maxPrice, minRating, sort]);

  return (
    <section className="page-bg py-14">
      <div className="max-w-7xl mx-auto px-5">
        <div className="text-center mb-10">
          <h1 className="section-title">Our Menu</h1>
          <p className="mt-3 text-base-content/60">Fresh food, clear prices and easy ordering.</p>
        </div>

        <div className="flex flex-wrap justify-center gap-2 mb-6">
          <button
            className={`btn btn-sm ${activeCategory === "all" ? "btn-warning" : "btn-outline"}`}
            onClick={() => setSearchParams({})}
          >
            All
          </button>
          {categories.map((category) => (
            <button
              key={category.id}
              className={`btn btn-sm ${activeCategory === category.id ? "btn-warning" : "btn-outline"}`}
              onClick={() => setSearchParams({ category: category.id })}
            >
              {category.icon} {category.name}
            </button>
          ))}
        </div>

        <div className="card bg-base-200 shadow mb-10">
          <div className="card-body p-4 grid md:grid-cols-4 gap-4">
            <label className="form-control md:col-span-2">
              <span className="label-text mb-1 text-xs">Search dishes</span>
              <input
                className="input input-bordered input-sm w-full"
                placeholder="Search by name or ingredient..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </label>

            <label className="form-control">
              <span className="label-text mb-1 text-xs">Max price: ₹{maxPrice}</span>
              <input
                type="range"
                min="99"
                max="500"
                step="10"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="range range-warning range-xs"
              />
            </label>

            <label className="form-control">
              <span className="label-text mb-1 text-xs">Sort</span>
              <select
                className="select select-bordered select-sm w-full"
                value={sort}
                onChange={(e) => setSort(e.target.value)}
              >
                {SORT_OPTIONS.map((opt) => (
                  <option key={opt.id} value={opt.id}>{opt.label}</option>
                ))}
              </select>
            </label>

            <div className="md:col-span-4 flex items-center gap-3">
              <span className="label-text text-xs">Min rating:</span>
              {[0, 4, 4.5, 4.8].map((r) => (
                <button
                  key={r}
                  onClick={() => setMinRating(r)}
                  className={`btn btn-xs ${minRating === r ? "btn-warning" : "btn-outline"}`}
                >
                  {r === 0 ? "Any" : `${r}+ ⭐`}
                </button>
              ))}
            </div>
          </div>
        </div>

        {foods.length === 0 ? (
          <div className="alert">No food items match your filters.</div>
        ) : (
          <div ref={ref} className={`grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 ${visible ? "stagger" : ""}`}>
            {foods.map((food) => (
              <div key={food.id} className={visible ? "" : "reveal-out"}>
                <FoodCard food={food} />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default Menu;
