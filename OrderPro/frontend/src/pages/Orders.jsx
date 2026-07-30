import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { getOrders, money, cancelOrder } from "../utils/storage";
import { getOrderTracking } from "../utils/tracking";
import { getCurrentUser } from "../utils/auth";
import useReveal from "../hooks/useReveal";

function Orders() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [tick, setTick] = useState(0);
  const [ref, visible] = useReveal();

  useEffect(() => {
    setOrders(getOrders().filter((order) => order.userEmail === getCurrentUser()?.email));
    // Re-render periodically so live "Preparing / Out for Delivery" status updates on screen.
    const interval = setInterval(() => setTick((t) => t + 1), 10000);
    return () => clearInterval(interval);
  }, []);

  const handleCancel = async (orderId) => {
    const updated = await cancelOrder(orderId);
    setOrders(updated.filter((order) => order.userEmail === getCurrentUser()?.email));
    toast.success("Order cancelled.");
  };

  const stats = useMemo(() => {
    const totalSpent = orders.reduce((sum, o) => sum + o.total, 0);
    const itemCounts = {};
    orders.forEach((order) =>
      order.items.forEach((item) => {
        itemCounts[item.name] = (itemCounts[item.name] || 0) + item.quantity;
      })
    );
    const topItem = Object.entries(itemCounts).sort((a, b) => b[1] - a[1])[0];
    return {
      count: orders.length,
      totalSpent,
      avg: orders.length ? Math.round(totalSpent / orders.length) : 0,
      topItem: topItem ? topItem[0] : "—"
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orders]);

  if (orders.length === 0) {
    return (
      <section className="py-14 page-bg min-h-[65vh]">
        <div className="max-w-6xl mx-auto px-5">
          <h1 className="section-title mb-8">My Orders</h1>
          <div className="card bg-base-200 shadow-xl reveal-in">
            <div className="card-body text-center items-center py-16">
              <div className="text-6xl">📦</div>
              <h2 className="text-2xl font-bold">No orders yet</h2>
              <p className="text-base-content/60">Your placed orders will appear here.</p>
              <button onClick={() => navigate("/menu")} className="btn btn-warning mt-3 btn-press">
                Order Food
              </button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-14 page-bg min-h-[65vh]">
      <div className="max-w-6xl mx-auto px-5">
        <div className="mb-8">
          <h1 className="section-title">My Orders</h1>
          <p className="text-base-content/60 mt-2">Track your restaurant orders in real time.</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10 stagger">
          <div className="stat bg-base-200 rounded-box shadow">
            <div className="stat-title">Total Orders</div>
            <div className="stat-value text-warning text-2xl">{stats.count}</div>
          </div>
          <div className="stat bg-base-200 rounded-box shadow">
            <div className="stat-title">Total Spent</div>
            <div className="stat-value text-success text-2xl">{money(stats.totalSpent)}</div>
          </div>
          <div className="stat bg-base-200 rounded-box shadow">
            <div className="stat-title">Avg. Order</div>
            <div className="stat-value text-info text-2xl">{money(stats.avg)}</div>
          </div>
          <div className="stat bg-base-200 rounded-box shadow">
            <div className="stat-title">Most Ordered</div>
            <div className="stat-value text-sm">{stats.topItem}</div>
          </div>
        </div>

        <div ref={ref} className={`space-y-5 ${visible ? "stagger" : ""}`}>
          {orders.map((order) => {
            const tracking = getOrderTracking(order);
            const canCancel = !tracking.cancelled && !tracking.delivered && tracking.stageIndex <= 1;

            return (
              <div key={order.id} className={`card bg-base-200 shadow-xl card-hover ${visible ? "" : "reveal-out"}`}>
                <div className="card-body">
                  <div className="flex flex-wrap justify-between gap-3">
                    <div>
                      <h2 className="card-title">{order.id}</h2>
                      <p className="text-sm text-base-content/60">{order.createdAt}</p>
                      {order.deliveryAddress && (
                        <p className="text-xs text-base-content/50 mt-1">📍 {order.deliveryAddress}</p>
                      )}
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <div
                        className={`badge badge-lg gap-1 ${
                          tracking.cancelled
                            ? "badge-error"
                            : tracking.delivered
                            ? "badge-success"
                            : "badge-warning"
                        }`}
                      >
                        {tracking.cancelled ? "Cancelled" : tracking.stage.icon + " " + tracking.stage.label}
                      </div>
                      <div className="flex gap-2">
                        {!tracking.cancelled && (
                          <button
                            onClick={() => navigate(`/orders/${order.id}/track`)}
                            className="btn btn-xs btn-warning btn-press"
                          >
                            Track Order
                          </button>
                        )}
                        {canCancel && (
                          <button
                            onClick={() => handleCancel(order.id)}
                            className="btn btn-xs btn-error btn-outline btn-press"
                          >
                            Cancel Order
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  {!tracking.cancelled && !tracking.delivered && (
                    <div className="mt-3">
                      <div className="h-1.5 bg-base-300 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-warning transition-all duration-1000"
                          style={{ width: `${tracking.progressPercent}%` }}
                        />
                      </div>
                    </div>
                  )}

                  <div className="divider my-1" />

                  {order.items.map((item) => (
                    <div key={item.id || item.name} className="flex justify-between py-1 text-sm">
                      <span>{item.name} × {item.quantity}</span>
                      <span>{money(item.price * item.quantity)}</span>
                    </div>
                  ))}

                  <div className="divider my-1" />
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span className="text-warning">{money(order.total)}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default Orders;
