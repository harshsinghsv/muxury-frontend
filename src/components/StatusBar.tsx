import { useEffect, useState } from 'react';

export default function StatusBar() {
    const [time, setTime] = useState('');

    useEffect(() => {
        const updateTime = () => {
            const now = new Date();
            let hours = now.getHours();
            let minutes = now.getMinutes().toString().padStart(2, '0');
            setTime(`${hours}:${minutes}`);
        };

        updateTime();
        const interval = setInterval(updateTime, 60000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="flex items-center justify-between px-6 pt-3 pb-1 h-11 bg-transparent shrink-0 md:hidden">
            <span className="text-[13px] font-semibold font-['DM_Sans'] text-[#343434]">{time}</span>
            <div className="flex items-center gap-1.5 text-[#343434]">
                {/* Signal SVG */}
                <svg width="18" height="12" viewBox="0 0 18 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-[18px] h-[12px]">
                    <path d="M2.5 12v-2"></path>
                    <path d="M7.5 12V8"></path>
                    <path d="M12.5 12V4"></path>
                    <path d="M17.5 12V0"></path>
                </svg>
                {/* WiFi SVG */}
                <svg width="16" height="12" viewBox="0 0 16 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-[16px] h-[12px] -mt-0.5">
                    <path d="M1 9.5a12.5 12.5 0 0 1 14 0"></path>
                    <path d="M4 6.5a8.5 8.5 0 0 1 8 0"></path>
                    <path d="M7 3.5a4.5 4.5 0 0 1 2 0"></path>
                    <circle cx="8" cy="1" r="1" fill="currentColor"></circle>
                </svg>
                {/* Battery SVG */}
                <svg width="26" height="14" viewBox="0 0 26 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-[26px] h-[14px]">
                    <rect x="1" y="2" width="20" height="10" rx="2"></rect>
                    <path d="M25 5v4"></path>
                    <rect x="3" y="4" width="16" height="6" fill="currentColor" stroke="none"></rect>
                </svg>
            </div>
        </div>
    );
}
