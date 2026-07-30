import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { getRecommendation } from "../../utils/recommend";
import { money } from "../../utils/storage";
import { isAuthenticated } from "../../utils/auth";
import { addFoodToCart } from "../../utils/cartActions";

const QUICK_PROMPTS = [
  "Something spicy under ₹300",
  "Best rated desserts",
  "Vegetarian options",
  "Track my order"
];

function ChatBubbles({ messages, onAdd }) {
  const navigate = useNavigate();

  const handleAdd = async (food) => {
    if (!isAuthenticated()) {
      toast.error("Please login to add items to cart.");
      navigate("/login");
      return;
    }
    await addFoodToCart(food, 1);
    toast.success(`${food.name} added to cart`);
    onAdd?.();
  };

  return (
    <>
      {messages.map((msg, i) => (
        <div key={i} className={`chat-bubble-in chat ${msg.from === "user" ? "chat-end" : "chat-start"}`}>
          <div
            className={`chat-bubble ${
              msg.from === "user" ? "chat-bubble-warning" : "chat-bubble"
            }`}
          >
            {msg.text}
          </div>
          {msg.items?.length > 0 && (
            <div className="flex flex-col gap-2 mt-2 max-w-xs">
              {msg.items.map((food) => (
                <div key={food.id} className="card card-side bg-base-100 shadow chat-bubble-in">
                  <img src={food.image} alt={food.name} className="w-16 h-16 object-cover" />
                  <div className="card-body p-2">
                    <p className="font-bold text-sm">{food.name}</p>
                    <p className="text-xs text-base-content/60">{money(food.price)} · ⭐ {food.rating}</p>
                    <button
                      onClick={() => handleAdd(food)}
                      className="btn btn-warning btn-xs mt-1 w-fit btn-press"
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </>
  );
}

function Chatbot({ variant = "floating" }) {
  const [open, setOpen] = useState(variant === "inline");
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [messages, setMessages] = useState([
    {
      from: "bot",
      text: "Hi! I'm the OrderPro AI assistant. Ask me for recommendations, or use me as your quick Contact Us — I can help with orders, timings, and more.",
      items: []
    }
  ]);
  const scrollRef = useRef(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, typing]);

  const send = (text) => {
    const value = (text ?? input).trim();
    if (!value) return;

    setMessages((prev) => [...prev, { from: "user", text: value, items: [] }]);
    setInput("");
    setTyping(true);

    setTimeout(() => {
      const { reply, items } = getRecommendation(value);
      setMessages((prev) => [...prev, { from: "bot", text: reply, items }]);
      setTyping(false);
    }, 550);
  };

  const panel = (
    <div className={`${variant === "floating" ? "chat-panel w-80 sm:w-96" : "w-full"} card bg-base-200 shadow-2xl`}>
      <div className="card-body p-0">
        <div className="flex items-center justify-between px-4 py-3 bg-neutral text-neutral-content rounded-t-2xl">
          <span className="font-bold">🤖 OrderPro Assistant</span>
          {variant === "floating" && (
            <button onClick={() => setOpen(false)} className="btn btn-xs btn-circle btn-ghost">✕</button>
          )}
        </div>

        <div ref={scrollRef} className="chat p-3 space-y-2 h-80 overflow-y-auto">
          <ChatBubbles messages={messages} />
          {typing && (
            <div className="chat chat-start">
              <div className="chat-bubble flex gap-1 items-center">
                <span className="typing-dot">●</span>
                <span className="typing-dot">●</span>
                <span className="typing-dot">●</span>
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-wrap gap-1 px-3 pb-2">
          {QUICK_PROMPTS.map((prompt) => (
            <button
              key={prompt}
              onClick={() => send(prompt)}
              className="btn btn-xs btn-outline btn-press"
            >
              {prompt}
            </button>
          ))}
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            send();
          }}
          className="flex gap-2 p-3 pt-0"
        >
          <input
            className="input input-bordered input-sm flex-1"
            placeholder="Ask for a recommendation..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button className="btn btn-warning btn-sm btn-press" type="submit">Send</button>
        </form>
      </div>
    </div>
  );

  if (variant === "inline") return panel;

  return (
    <div className="chat-fab">
      {open ? (
        panel
      ) : (
        <button
          onClick={() => setOpen(true)}
          className="btn btn-warning btn-circle btn-lg shadow-xl btn-press"
          aria-label="Open AI assistant"
        >
          🤖
        </button>
      )}
    </div>
  );
}

export default Chatbot;
