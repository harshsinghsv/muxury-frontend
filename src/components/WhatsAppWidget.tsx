import { COPY } from "@/config/constants";

const WhatsAppWidget = () => {
    // Standard WhatsApp wa.me link with pre-filled message
    // You would replace this with your actual business number
    const whatsappUrl = `https://wa.me/919876543210?text=${encodeURIComponent("Hi Muxury team, I have a question about my order.")}`;

    return (
        <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="fixed bottom-24 md:bottom-8 left-5 md:left-8 z-[90] w-12 h-12 bg-[#25D366] text-white shadow-lg rounded-full flex items-center justify-center hover:scale-110 transition-transform animate-fade-in group"
            aria-label="Chat with us on WhatsApp"
        >
            <svg 
                className="w-7 h-7" 
                viewBox="0 0 24 24" 
                fill="currentColor"
            >
                <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.711.927 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86s.274.072.376-.043c.101-.116.433-.506.549-.68.116-.173.231-.145.39-.087s1.011.477 1.184.564.289.13.332.202c.045.072.045.419-.099.824zm-3.423-14.416c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm.082 20.612c-1.536 0-3.04-.403-4.356-1.164l-.311-.18-3.235.848.865-3.155-.198-.315c-.836-1.332-1.276-2.868-1.275-4.449.006-4.636 3.784-8.411 8.428-8.412 2.247 0 4.356.877 5.943 2.467s2.461 3.699 2.459 5.944c-.004 4.636-3.782 8.416-8.319 8.416z" />
            </svg>
            <div className="absolute left-14 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap bg-white text-[#343434] font-['DM_Sans'] text-xs font-bold px-3 py-1.5 border border-[#EBEBEB] rounded shadow-sm pointer-events-none">
                Chat with us
            </div>
        </a>
    );
};

export default WhatsAppWidget;
