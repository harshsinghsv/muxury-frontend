import React, { useState, useEffect } from 'react';

export interface MuxuryOnboardingProps {
    onComplete?: () => void;
}

const MuxuryOnboarding: React.FC<MuxuryOnboardingProps> = ({ onComplete }) => {
    const [currentScreen, setCurrentScreen] = useState(0);
    const [isVisible, setIsVisible] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        const hasOnboarded = localStorage.getItem('muxury_onboarded');
        if (!hasOnboarded) {
            setIsVisible(true);
        }
    }, []);

    const handleNext = () => {
        if (currentScreen < 2) {
            setCurrentScreen((prev) => prev + 1);
        }
    };

    const handleGetStarted = () => {
        localStorage.setItem('muxury_onboarded', 'true');
        setIsVisible(false);
        if (onComplete) onComplete();
    };

    if (!mounted || !isVisible) return null;

    const screens = [
        {
            image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600",
            headline: "20% Discount",
            subheadline: "New Arrival Product"
        },
        {
            image: "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=600",
            headline: "Take Advantage",
            subheadline: "Of The Offer Shopping"
        },
        {
            image: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=600",
            headline: "All Types Offers",
            subheadline: "Within Your Reach"
        }
    ];

    return (
        <div className="muxury-onboarding">
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500&family=Playfair+Display:wght@700&display=swap');

        .muxury-onboarding {
          position: fixed;
          inset: 0;
          z-index: 9999;
          background: rgba(0, 0, 0, 0.4);
          display: flex;
          justify-content: center;
          align-items: center;
          font-family: 'DM Sans', sans-serif;
        }

        .mo-mobile-frame {
          width: 100%;
          max-width: 430px;
          height: 100vh;
          height: 100dvh;
          background: #ffffff;
          position: relative;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          box-shadow: 0 0 40px rgba(0,0,0,0.15);
        }

        .mo-slider-wrapper {
          flex: 1;
          display: flex;
          flex-direction: column;
          position: relative;
        }

        .mo-slider {
          display: flex;
          width: 300%;
          height: 100%;
          transition: transform 0.5s cubic-bezier(0.25, 1, 0.5, 1);
        }

        .mo-slide {
          width: 33.3333%;
          height: 100%;
          display: flex;
          flex-direction: column;
        }

        .mo-image-container {
          padding: 44px 16px 0 16px;
          width: 100%;
        }

        .mo-image-card {
          width: 100%;
          height: clamp(340px, 55vh, 480px);
          border-radius: 24px;
          overflow: hidden;
          background: #f0f0f0;
          position: relative;
          box-shadow: 0 8px 16px rgba(0,0,0,0.04);
        }

        .mo-image-card img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }

        .mo-text-content {
          padding: 32px 28px 24px 28px;
          display: flex;
          flex-direction: column;
        }

        .mo-headline {
          font-family: 'Playfair Display', serif;
          font-weight: 700;
          font-size: 36px;
          line-height: 1.15;
          color: #1a1a1a;
          margin: 0 0 16px 0;
        }

        .mo-body {
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
          color: #888888;
          line-height: 1.6;
          margin: 0;
          max-width: 280px;
        }

        .mo-fixed-bottom {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 140px;
          pointer-events: none;
        }

        .mo-fixed-bottom * {
          pointer-events: auto;
        }

        .mo-dots-container {
          position: absolute;
          left: 28px;
          bottom: 48px;
          display: flex;
          gap: 6px;
          align-items: center;
          transition: bottom 0.4s cubic-bezier(0.25, 1, 0.5, 1);
        }

        .mo-dots-container.screen3 {
          bottom: 100px;
        }

        .mo-dot {
          width: 8px;
          height: 8px;
          border-radius: 4px;
          background: #d0d0d0;
          transition: all 0.3s ease;
        }

        .mo-dot.active {
          width: 24px;
          background: #e8776a;
        }

        .mo-next-btn {
          position: absolute;
          right: 28px;
          bottom: 24px;
          width: 56px;
          height: 56px;
          border-radius: 50%;
          background: #1a1a1a;
          color: white;
          border: none;
          display: flex;
          justify-content: center;
          align-items: center;
          cursor: pointer;
          box-shadow: 0 4px 12px rgba(26,26,26,0.2);
          transition: all 0.4s cubic-bezier(0.25, 1, 0.5, 1);
          -webkit-tap-highlight-color: transparent;
        }

        .mo-next-btn:active {
          transform: scale(0.95);
        }

        .mo-next-btn.hidden {
          opacity: 0;
          transform: scale(0.8);
          pointer-events: none;
        }

        .mo-gs-btn {
          position: absolute;
          left: 28px;
          right: 28px;
          bottom: 24px;
          height: 56px;
          border-radius: 28px;
          background: #1a1a1a;
          color: white;
          font-family: 'DM Sans', sans-serif;
          font-weight: 600;
          font-size: 16px;
          border: none;
          cursor: pointer;
          box-shadow: 0 4px 12px rgba(26,26,26,0.2);
          transition: all 0.5s cubic-bezier(0.25, 1, 0.5, 1);
          opacity: 0;
          transform: translateY(20px);
          pointer-events: none;
          -webkit-tap-highlight-color: transparent;
        }

        .mo-gs-btn:active {
          transform: translateY(0) scale(0.98) !important;
        }

        .mo-gs-btn.visible {
          opacity: 1;
          transform: translateY(0);
          pointer-events: auto;
        }
      `}</style>

            <div className="mo-mobile-frame">
                <div className="mo-slider-wrapper">
                    <div
                        className="mo-slider"
                        style={{ transform: "translateX(-" + (currentScreen * 33.3333) + "%)" }}
                    >
                        {screens.map((screen, index) => (
                            <div key={index} className="mo-slide">
                                <div className="mo-image-container">
                                    <div className="mo-image-card">
                                        <img src={screen.image} alt={screen.headline} />
                                    </div>
                                </div>
                                <div className="mo-text-content">
                                    <h1 className="mo-headline">
                                        {screen.headline}<br />
                                        {screen.subheadline}
                                    </h1>
                                    <p className="mo-body">
                                        Publish up your selfies to make yourself more beautiful with this app.
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="mo-fixed-bottom">
                    <div className={"mo-dots-container " + (currentScreen === 2 ? "screen3" : "")}>
                        {[0, 1, 2].map((i) => (
                            <div key={i} className={"mo-dot " + (currentScreen === i ? "active" : "")} />
                        ))}
                    </div>

                    <button
                        className={"mo-next-btn " + (currentScreen === 2 ? "hidden" : "")}
                        onClick={handleNext}
                        aria-label="Next screen"
                    >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M5 12h14"></path>
                            <path d="m12 5 7 7-7 7"></path>
                        </svg>
                    </button>

                    <button
                        className={"mo-gs-btn " + (currentScreen === 2 ? "visible" : "")}
                        onClick={handleGetStarted}
                        aria-label="Get Started"
                    >
                        Get Started
                    </button>
                </div>
            </div>
        </div>
    );
};

export default MuxuryOnboarding;
