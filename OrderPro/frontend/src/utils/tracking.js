// Simulates realistic order progress over time, since this project has no
// live courier/kitchen system pushing real status updates. Each stage kicks
// in after a fixed number of minutes have passed since the order was placed.
export const ORDER_STAGES = [
  { key: "Pending", label: "Order Placed", icon: "🧾" },
  { key: "Confirmed", label: "Confirmed", icon: "✅" },
  { key: "Preparing", label: "Preparing in Kitchen", icon: "👨‍🍳" },
  { key: "Out for Delivery", label: "Out for Delivery", icon: "🛵" },
  { key: "Delivered", label: "Delivered", icon: "🎉" }
];

// Minutes-after-creation at which each stage begins.
const STAGE_START_MIN = [0, 1, 4, 10, 22];

function elapsedMinutes(createdAtMs) {
  return (Date.now() - createdAtMs) / 60000;
}

/**
 * Returns the live tracking state for an order.
 * `createdAtMs` should be a millisecond timestamp (Date.now()-style).
 */
export function getOrderTracking(order) {
  if (order.status === "Cancelled") {
    return { stageIndex: -1, stage: null, cancelled: true, etaMinutes: null, progressPercent: 0 };
  }

  const createdAtMs = order.createdAtMs || Date.now();
  const elapsed = elapsedMinutes(createdAtMs);

  let stageIndex = 0;
  for (let i = STAGE_START_MIN.length - 1; i >= 0; i--) {
    if (elapsed >= STAGE_START_MIN[i]) {
      stageIndex = i;
      break;
    }
  }

  const isDelivered = stageIndex === ORDER_STAGES.length - 1;
  const nextStageStart = STAGE_START_MIN[stageIndex + 1];
  const etaMinutes = isDelivered ? 0 : Math.max(0, Math.ceil(nextStageStart - elapsed));
  const totalEtaMinutes = isDelivered
    ? 0
    : Math.max(0, Math.ceil(STAGE_START_MIN[STAGE_START_MIN.length - 1] - elapsed));

  return {
    stageIndex,
    stage: ORDER_STAGES[stageIndex],
    cancelled: false,
    delivered: isDelivered,
    etaMinutes,
    totalEtaMinutes,
    progressPercent: Math.round((stageIndex / (ORDER_STAGES.length - 1)) * 100)
  };
}

export function isOrderComplete(order) {
  const tracking = getOrderTracking(order);
  return tracking.cancelled || tracking.delivered;
}
