import { useState } from "react";
import { ArrowRight } from "lucide-react";

const Newsletter = () => {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setIsSubmitted(true);
      setEmail("");
      setTimeout(() => setIsSubmitted(false), 3000);
    }
  };

  return (
    <section className="py-16 lg:py-20 bg-primary">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="max-w-2xl mx-auto text-center">
          <p className="font-body text-sm tracking-luxury uppercase text-gold mb-4">
            Stay Connected
          </p>
          <h2 className="font-display text-3xl md:text-4xl font-medium text-primary-foreground mb-4">
            Join Our World
          </h2>
          <p className="font-body text-primary-foreground/70 mb-8">
            Subscribe to receive exclusive access to new collections, private events, and curated style insights.
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 px-4 py-3 bg-transparent border border-primary-foreground/30 text-primary-foreground placeholder:text-primary-foreground/50 font-body text-sm focus:outline-none focus:border-gold transition-colors"
              required
            />
            <button
              type="submit"
              className="px-6 py-3 bg-gold text-accent-foreground font-body text-sm font-medium tracking-luxury uppercase hover:bg-gold-light transition-colors flex items-center justify-center gap-2"
            >
              Subscribe
              <ArrowRight size={16} />
            </button>
          </form>

          {isSubmitted && (
            <p className="mt-4 text-gold font-body text-sm">
              Thank you for subscribing!
            </p>
          )}
        </div>
      </div>
    </section>
  );
};

export default Newsletter;
