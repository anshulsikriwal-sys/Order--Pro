import { Link } from "react-router-dom";
import { categories } from "../../data/menu";
import useReveal from "../../hooks/useReveal";

function Categories() {
  const [ref, visible] = useReveal();

  return (
    <section className="py-20 bg-base-300">
      <div className="max-w-7xl mx-auto px-5">
        <div className="text-center mb-12">
          <h2 className="section-title">Browse by Category</h2>
          <p className="mt-3 text-base-content/60">Choose your favourite meal.</p>
        </div>

        <div ref={ref} className={`grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-5 ${visible ? "stagger" : ""}`}>
          {categories.map((category) => (
            <Link
              key={category.id}
              to={`/menu?category=${category.id}`}
              className={`card bg-base-100 shadow-xl card-hover btn-press ${visible ? "" : "reveal-out"}`}
            >
              <div className="card-body items-center text-center p-6">
                <div className="text-5xl">{category.icon}</div>
                <h3 className="font-bold text-lg">{category.name}</h3>
                <span className="btn btn-warning btn-sm mt-2">View Menu</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Categories;
