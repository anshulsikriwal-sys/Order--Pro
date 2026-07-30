import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getOrders, money } from "../utils/storage";
import { getOrderTracking, ORDER_STAGES } from "../utils/tracking";
import { getCurrentUser } from "../utils/auth";
import { orderApi, isBackendUp } from "../services/api";

function TrackOrder() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [tracking, setTracking] = useState(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const user = getCurrentUser();

    const loadLocal = () => {
      const found = getOrders().find(
        (o) => o.id === orderId && o.userEmail === user?.email
      );
      if (found) {
        setOrder(found);
        return true;
      }
      return false;
    };

    const loadBackendIfNeeded = async () => {
      if (loadLocal()) return;
      if (user?.source === "backend" && (await isBackendUp())) {
        try {
          const res = await orderApi.getById(orderId);
          const o = res.data.order;
          setOrder({
            id: o._id,
            items: (o.items || []).map((i) => ({
              id: i.foodId?._id || i.foodId,
              name: i.foodId?.name || "Item",
              price: i.price,
              quantity: i.quantity
            })),
            total: o.totalAmount,
            status: o.orderStatus,
            deliveryAddress: o.deliveryAddress,
            createdAtMs: new Date(o.createdAt).getTime(),
            createdAt: new Date(o.createdAt).toLocaleString("en-IN")
          });
          return;
        } catch {
          // fall through to not-found
        }
      }
      setNotFound(true);
    };

    loadBackendIfNeeded();
  }, [orderId]);

  useEffect(() => {
    if (!order) return;
    const update = () => setTracking(getOrderTracking(order));
    update();
    const interval = setInterval(update, 5000);
    return () => clearInterval(interval);
  }, [order]);

  if (notFound) {
    return (
      <section className="min-h-[65vh] grid place-items-center p-6">
        <div className="text-center reveal-in">
          <div className="text-6xl mb-4">🔍</div>
          <h1 className="text-2xl font-bold">Order not found</h1>
          <button onClick={() => navigate("/orders")} className="btn btn-warning mt-5">
            Back to Orders
          </button>
        </div>
      </section>
    );
  }

  if (!order || !tracking) {
    return (
      <section className="min-h-[65vh] grid place-items-center p-6">
        <span className="loading loading-spinner loading-lg text-warning" />
      </section>
    );
  }

  return (
    <section className="py-14 page-bg min-h-[65vh]">
      <div className="max-w-3xl mx-auto px-5">
        <div className="flex items-center justify-between mb-8">
          <h1 className="section-title">Track Order</h1>
          <Link to="/orders" className="btn btn-ghost btn-sm">← All Orders</Link>
        </div>

        <div className="card bg-base-200 shadow-xl reveal-in">
          <div className="card-body">
            <div className="flex flex-wrap justify-between gap-3 mb-2">
              <div>
                <h2 className="text-xl font-bold">{order.id}</h2>
                <p className="text-sm text-base-content/60">{order.createdAt}</p>
              </div>
              {tracking.cancelled ? (
                <div className="badge badge-error badge-lg">Cancelled</div>
              ) : (
                <div className="badge badge-warning badge-lg">
                  {tracking.delivered
                    ? "Delivered"
                    : `ETA ${tracking.etaMinutes} min to next step`}
                </div>
              )}
            </div>

            {tracking.cancelled ? (
              <div className="alert alert-error mt-4">
                <span>This order was cancelled.</span>
              </div>
            ) : (
              <>
                <div className="my-8">
                  {/* Progress bar with moving courier */}
                  <div className="relative h-2 bg-base-300 rounded-full overflow-hidden">
                    <div
                      className="absolute inset-y-0 left-0 bg-warning rounded-full transition-all duration-1000 ease-out"
                      style={{ width: `${tracking.progressPercent}%` }}
                    />
                    <div
                      className="absolute -top-3 text-xl transition-all duration-1000 ease-out"
                      style={{ left: `calc(${tracking.progressPercent}% - 12px)` }}
                    >
                      🛵
                    </div>
                  </div>

                  <div className="grid grid-cols-5 mt-6 text-center">
                    {ORDER_STAGES.map((stage, i) => (
                      <div key={stage.key} className={i <= tracking.stageIndex ? "pop-in" : "opacity-30"}>
                        <div
                          className={`text-2xl mx-auto ${
                            i === tracking.stageIndex ? "float-badge" : ""
                          }`}
                        >
                          {stage.icon}
                        </div>
                        <p className="text-[11px] mt-1 leading-tight">{stage.label}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {!tracking.delivered && (
                  <p className="text-center text-sm text-base-content/60">
                    Estimated total delivery time remaining:{" "}
                    <span className="font-bold text-warning">{tracking.totalEtaMinutes} min</span>
                  </p>
                )}
                {tracking.delivered && (
                  <p className="text-center text-success font-bold pop-in">
                    🎉 Your order has been delivered. Enjoy your meal!
                  </p>
                )}
              </>
            )}

            <div className="divider" />

            {order.deliveryAddress && (
              <p className="text-sm text-base-content/60 mb-3">📍 {order.deliveryAddress}</p>
            )}

            <div className="space-y-1">
              {order.items?.map((item) => (
                <div key={item.id || item.name} className="flex justify-between text-sm">
                  <span>{item.name} × {item.quantity}</span>
                  <span>{money(item.price * item.quantity)}</span>
                </div>
              ))}
            </div>
            <div className="divider my-2" />
            <div className="flex justify-between font-bold text-lg">
              <span>Total</span>
              <span className="text-warning">{money(order.total)}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default TrackOrder;
