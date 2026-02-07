import { useState, useEffect } from "react";
import { Star, ChevronLeft, ChevronRight, Quote } from "lucide-react";

const testimonials = [
    {
        id: 1,
        name: "Sarah Mitchell",
        location: "New York, USA",
        rating: 5,
        text: "Absolutely stunning quality! The Midnight Velvet Gown exceeded all my expectations. The fabric is luxurious and the fit is perfect.",
        avatar: "SM",
    },
    {
        id: 2,
        name: "Emma Thompson",
        location: "London, UK",
        rating: 5,
        text: "LUXE has become my go-to for special occasions. Their attention to detail and customer service is unmatched. Highly recommend!",
        avatar: "ET",
    },
    {
        id: 3,
        name: "Isabella Chen",
        location: "Singapore",
        rating: 5,
        text: "The Crystal Evening Clutch is a showstopper! Received so many compliments. Fast shipping and beautiful packaging too.",
        avatar: "IC",
    },
    {
        id: 4,
        name: "Maria Garcia",
        location: "Madrid, Spain",
        rating: 5,
        text: "Premium quality that speaks for itself. The craftsmanship on their pieces is remarkable. A true luxury experience.",
        avatar: "MG",
    },
];

const Testimonials = () => {
    const [activeIndex, setActiveIndex] = useState(0);
    const [isPaused, setIsPaused] = useState(false);

    // Auto-rotate
    useEffect(() => {
        if (isPaused) return;

        const interval = setInterval(() => {
            setActiveIndex((prev) => (prev + 1) % testimonials.length);
        }, 5000);

        return () => clearInterval(interval);
    }, [isPaused]);

    const goTo = (index: number) => {
        setActiveIndex(index);
    };

    const goPrev = () => {
        setActiveIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
    };

    const goNext = () => {
        setActiveIndex((prev) => (prev + 1) % testimonials.length);
    };

    const current = testimonials[activeIndex];

    return (
        <section className="py-16 lg:py-24 bg-cream-dark">
            <div className="container mx-auto px-4 lg:px-8">
                {/* Header */}
                <div className="text-center mb-12">
                    <p className="text-sm tracking-luxury uppercase text-gold mb-3">
                        Customer Love
                    </p>
                    <h2 className="font-display text-3xl lg:text-4xl font-medium">
                        What Our Clients Say
                    </h2>
                </div>

                {/* Testimonial card */}
                <div
                    className="max-w-3xl mx-auto"
                    onMouseEnter={() => setIsPaused(true)}
                    onMouseLeave={() => setIsPaused(false)}
                >
                    <div className="relative bg-background rounded-2xl p-8 lg:p-12 shadow-elegant">
                        {/* Quote icon */}
                        <Quote
                            size={48}
                            className="absolute top-6 right-6 text-gold/20"
                        />

                        {/* Rating */}
                        <div className="flex gap-1 mb-6">
                            {[...Array(5)].map((_, i) => (
                                <Star
                                    key={i}
                                    size={20}
                                    className={i < current.rating ? "text-gold fill-gold" : "text-muted"}
                                />
                            ))}
                        </div>

                        {/* Quote text */}
                        <blockquote className="text-lg lg:text-xl text-foreground/90 mb-8 min-h-[80px]">
                            "{current.text}"
                        </blockquote>

                        {/* Author */}
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-gold/20 rounded-full flex items-center justify-center font-display text-gold font-medium">
                                    {current.avatar}
                                </div>
                                <div>
                                    <p className="font-medium">{current.name}</p>
                                    <p className="text-sm text-muted-foreground">{current.location}</p>
                                </div>
                            </div>

                            {/* Navigation arrows */}
                            <div className="flex gap-2">
                                <button
                                    onClick={goPrev}
                                    className="p-2 border border-border rounded-full hover:border-gold hover:text-gold transition-colors"
                                    aria-label="Previous testimonial"
                                >
                                    <ChevronLeft size={18} />
                                </button>
                                <button
                                    onClick={goNext}
                                    className="p-2 border border-border rounded-full hover:border-gold hover:text-gold transition-colors"
                                    aria-label="Next testimonial"
                                >
                                    <ChevronRight size={18} />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Dots */}
                    <div className="flex justify-center gap-2 mt-6">
                        {testimonials.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => goTo(index)}
                                className={`w-2 h-2 rounded-full transition-all ${index === activeIndex
                                        ? "w-6 bg-gold"
                                        : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
                                    }`}
                                aria-label={`Go to testimonial ${index + 1}`}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Testimonials;
