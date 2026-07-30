import toast from "react-hot-toast";
import Chatbot from "../components/common/Chatbot";
import useReveal from "../hooks/useReveal";

function Contact() {
  const [ref, visible] = useReveal();

  const handleSubmit = (e) => {
    e.preventDefault();
    toast.success("Message sent! Our team will get back to you shortly.");
    e.target.reset();
  };

  return (
    <section className="py-16 min-h-[65vh]">
      <div className="max-w-6xl mx-auto px-5">
        <div className="text-center mb-12 reveal-in">
          <h1 className="section-title">Get In Touch</h1>
          <p className="mt-3 text-base-content/60">
            Have a question? Chat with our AI assistant below or send us a message.
          </p>
        </div>

        <div ref={ref} className={`grid md:grid-cols-3 gap-6 mb-8 ${visible ? "stagger" : ""}`}>
          <div className={`card bg-base-200 shadow-xl card-hover ${visible ? "" : "reveal-out"}`}>
            <div className="card-body items-center text-center">
              <div className="text-4xl">📍</div>
              <h2 className="card-title">Visit Us</h2>
              <p className="text-base-content/60">123 Food Street<br />New Delhi, India</p>
            </div>
          </div>

          <div className={`card bg-base-200 shadow-xl card-hover ${visible ? "" : "reveal-out"}`}>
            <div className="card-body items-center text-center">
              <div className="text-4xl">📞</div>
              <h2 className="card-title">Call Us</h2>
              <p className="text-base-content/60">+91 98765 43210</p>
            </div>
          </div>

          <div className={`card bg-base-200 shadow-xl card-hover ${visible ? "" : "reveal-out"}`}>
            <div className="card-body items-center text-center">
              <div className="text-4xl">🕒</div>
              <h2 className="card-title">Opening Hours</h2>
              <p className="text-base-content/60">Monday - Sunday<br />11:00 AM - 11:00 PM</p>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-[1fr_380px] gap-6">
          <div className="card bg-base-200 shadow-xl reveal-in">
            <div className="card-body">
              <h2 className="card-title">Send us a message</h2>
              <p className="text-sm text-base-content/50 -mt-1 mb-2">
                Table booking requests can also be sent here.
              </p>
              <form className="grid md:grid-cols-2 gap-4" onSubmit={handleSubmit}>
                <input className="input input-bordered w-full" placeholder="Your name" required />
                <input className="input input-bordered w-full" type="email" placeholder="Your email" required />
                <textarea
                  className="textarea textarea-bordered md:col-span-2"
                  placeholder="Your message"
                  rows="5"
                  required
                />
                <button className="btn btn-warning md:col-span-2 btn-press">Send Message</button>
              </form>
            </div>
          </div>

          <div id="booking" className="reveal-in" style={{ animationDelay: "0.15s" }}>
            <Chatbot variant="inline" />
          </div>
        </div>
      </div>
    </section>
  );
}

export default Contact;
