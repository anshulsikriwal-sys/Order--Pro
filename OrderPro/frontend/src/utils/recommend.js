import { menuItems, categories } from "../data/menu";

const VEG_ITEMS = new Set(["salads", "dessert", "drinks"]);
const CATEGORY_WORDS = categories.reduce((map, c) => {
  map[c.id] = [c.id, c.name.toLowerCase()];
  return map;
}, {});

function extractBudget(text) {
  const match = text.match(/(?:under|below|less than|within|budget of)?\s*₹?\s*(\d{2,5})/i);
  return match ? Number(match[1]) : null;
}

function matchCategory(text) {
  for (const [id, words] of Object.entries(CATEGORY_WORDS)) {
    if (words.some((w) => text.includes(w))) return id;
  }
  if (/pizza/.test(text)) return "pizza";
  if (/burger/.test(text)) return "burger";
  if (/pasta|noodle|italian/.test(text)) return "pasta";
  if (/sweet|dessert|cake|brownie|ice ?cream/.test(text)) return "dessert";
  if (/drink|beverage|juice|soda|mocktail/.test(text)) return "drinks";
  if (/salad|healthy|light/.test(text)) return "salads";
  return null;
}

/**
 * Returns { reply, items } for a given free-text user message.
 * This is a deterministic, local recommendation engine (no external
 * API key is configured in this project) — it reasons over the menu
 * catalogue using budget, category, mood and rating signals.
 */
export function getRecommendation(message) {
  const text = message.toLowerCase();

  if (/hi|hello|hey|help/.test(text) && text.length < 20) {
    return {
      reply: "Hey! I'm the OrderPro assistant. Tell me a craving, a budget, or a mood (e.g. \"something spicy under ₹300\") and I'll pick dishes for you. I can also help with delivery, timings, or your order status.",
      items: menuItems.slice().sort((a, b) => b.rating - a.rating).slice(0, 3)
    };
  }

  if (/order status|track|where is my order|delivery time/.test(text)) {
    return {
      reply: "You can track every order you've placed on the Orders page — it shows live status and lets you cancel while it's still pending. Typical delivery is 30-45 minutes.",
      items: []
    };
  }

  if (/timing|open|close|hours/.test(text)) {
    return {
      reply: "We're open every day from 11:00 AM to 11:00 PM. Dine-in, takeaway and QR table ordering are all available during those hours.",
      items: []
    };
  }

  if (/refund|cancel/.test(text)) {
    return {
      reply: "You can cancel an order from the Orders page as long as it hasn't moved past 'Pending'. Refunds for prepaid orders are processed within 3-5 business days.",
      items: []
    };
  }

  const budget = extractBudget(text);
  const categoryId = matchCategory(text);
  const wantsVeg = /veg\b|vegetarian/.test(text) && !/non.?veg/.test(text);
  const wantsTopRated = /best|top rated|popular|recommend/.test(text);

  let pool = menuItems.slice();
  if (categoryId) pool = pool.filter((item) => item.category === categoryId);
  if (budget) pool = pool.filter((item) => item.price <= budget);
  if (wantsVeg) pool = pool.filter((item) => VEG_ITEMS.has(item.category) || item.category !== "burger");

  pool.sort((a, b) => b.rating - a.rating);

  if (pool.length === 0) {
    return {
      reply: "I couldn't find a close match for that — try a different budget or category, or browse the full menu.",
      items: menuItems.slice().sort((a, b) => b.rating - a.rating).slice(0, 3)
    };
  }

  const picks = pool.slice(0, 3);
  const bits = [];
  if (categoryId) bits.push(categories.find((c) => c.id === categoryId)?.name.toLowerCase());
  if (budget) bits.push(`under ₹${budget}`);
  const descriptor = bits.length ? ` ${bits.join(" ")}` : wantsTopRated ? " top-rated" : "";

  return {
    reply: `Here${picks.length > 1 ? "'s a few" : "'s one"}${descriptor} option${picks.length > 1 ? "s" : ""} I think you'll like:`,
    items: picks
  };
}
