import { useState, useEffect } from "react";
import { Clock, Zap } from "lucide-react";
import { Link } from "react-router-dom";

interface FlashSaleBannerProps {
    endTime?: Date;
    discount?: number;
}

const FlashSaleBanner = ({
    endTime = new Date(Date.now() + 4 * 60 * 60 * 1000), // 4 hours from now
    discount = 25
}: FlashSaleBannerProps) => {
    const [timeLeft, setTimeLeft] = useState({
        hours: 0,
        minutes: 0,
        seconds: 0,
    });

    useEffect(() => {
        const calculateTimeLeft = () => {
            const difference = endTime.getTime() - Date.now();

            if (difference > 0) {
                setTimeLeft({
                    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                    minutes: Math.floor((difference / 1000 / 60) % 60),
                    seconds: Math.floor((difference / 1000) % 60),
                });
            }
        };

        calculateTimeLeft();
        const timer = setInterval(calculateTimeLeft, 1000);
        return () => clearInterval(timer);
    }, [endTime]);

    const pad = (num: number) => String(num).padStart(2, '0');

    return (
        <div className="bg-gradient-to-r from-charcoal via-charcoal-light to-charcoal text-cream">
            <div className="container mx-auto px-4 lg:px-8 py-4">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    {/* Left: Sale info */}
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-gold/20 rounded-full animate-pulse">
                            <Zap size={20} className="text-gold" />
                        </div>
                        <div>
                            <p className="text-sm text-cream/70 uppercase tracking-wider">Flash Sale</p>
                            <p className="font-display text-xl font-medium">
                                <span className="text-gold">{discount}% OFF</span> Selected Items
                            </p>
                        </div>
                    </div>

                    {/* Center: Countdown */}
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1 text-cream/70">
                            <Clock size={16} />
                            <span className="text-xs uppercase tracking-wider">Ends in</span>
                        </div>
                        <div className="flex gap-2">
                            <div className="flex flex-col items-center">
                                <span className="bg-gold text-charcoal font-mono text-lg font-bold px-2 py-1 rounded">
                                    {pad(timeLeft.hours)}
                                </span>
                                <span className="text-[10px] text-cream/50 mt-1">HRS</span>
                            </div>
                            <span className="text-gold text-lg font-bold">:</span>
                            <div className="flex flex-col items-center">
                                <span className="bg-gold text-charcoal font-mono text-lg font-bold px-2 py-1 rounded">
                                    {pad(timeLeft.minutes)}
                                </span>
                                <span className="text-[10px] text-cream/50 mt-1">MIN</span>
                            </div>
                            <span className="text-gold text-lg font-bold">:</span>
                            <div className="flex flex-col items-center">
                                <span className="bg-gold text-charcoal font-mono text-lg font-bold px-2 py-1 rounded animate-pulse">
                                    {pad(timeLeft.seconds)}
                                </span>
                                <span className="text-[10px] text-cream/50 mt-1">SEC</span>
                            </div>
                        </div>
                    </div>

                    {/* Right: CTA */}
                    <Link
                        to="/shop?filter=sale"
                        className="px-5 py-2 bg-gold text-charcoal font-medium text-sm rounded hover:bg-gold-light transition-colors whitespace-nowrap"
                    >
                        Shop the Sale
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default FlashSaleBanner;
