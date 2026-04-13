import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { products } from "@/data/products";
import Icon from "@/components/Icon";

export default function SearchBox() {
    const [query, setQuery] = useState("");
    const [isFocused, setIsFocused] = useState(false);
    const [suggestions, setSuggestions] = useState<typeof products>([]);
    const [history, setHistory] = useState<string[]>([]);
    const navigate = useNavigate();
    const containerRef = useRef<HTMLDivElement>(null);
    const timeoutRef = useRef<NodeJS.Timeout>();

    useEffect(() => {
        const stored = localStorage.getItem("search_history");
        if (stored) {
            setHistory(JSON.parse(stored));
        }
    }, []);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsFocused(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Debounce search
    useEffect(() => {
        if (!query.trim()) {
            setSuggestions([]);
            return;
        }

        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(() => {
            const lowerQuery = query.toLowerCase();
            const results = products.filter(p => 
                p.name.toLowerCase().includes(lowerQuery) || 
                p.category.toLowerCase().includes(lowerQuery) ||
                p.description.toLowerCase().includes(lowerQuery)
            ).slice(0, 5); // 5 suggestions max
            setSuggestions(results);
        }, 300); // 300ms debounce
    }, [query]);

    const handleSearch = (searchTerm: string) => {
        if (!searchTerm.trim()) return;
        
        // Save to history
        const newHistory = [searchTerm, ...history.filter(h => h !== searchTerm)].slice(0, 5);
        setHistory(newHistory);
        localStorage.setItem("search_history", JSON.stringify(newHistory));
        
        setIsFocused(false);
        navigate(`/shop?search=${encodeURIComponent(searchTerm)}`);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            handleSearch(query);
        }
    };

    const clearHistory = () => {
        setHistory([]);
        localStorage.removeItem("search_history");
    };

    return (
        <div ref={containerRef} className="relative w-full max-w-[400px]">
            <div className={`flex items-center w-full h-10 px-4 rounded-full border transition-colors ${isFocused ? 'border-[#343434] bg-white' : 'border-[#EBEBEB] bg-[#FAF8F7]'}`}>
                <svg className="w-4 h-4 text-[#999999]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onFocus={() => setIsFocused(true)}
                    onKeyDown={handleKeyDown}
                    placeholder="Search for products, brands..."
                    className="flex-1 bg-transparent border-none focus:outline-none px-3 font-['DM_Sans'] text-sm text-[#343434] placeholder:text-[#999999]"
                />
                {query && (
                    <button onClick={() => setQuery("")} className="text-[#999999] hover:text-[#343434]">
                        <Icon name="close" size="w-4 h-4" />
                    </button>
                )}
            </div>

            {/* Dropdown UI */}
            {isFocused && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl border border-[#EBEBEB] shadow-xl overflow-hidden z-50 animate-fade-in">
                    
                    {/* Live Suggestions */}
                    {query.trim() ? (
                        <>
                            {suggestions.length > 0 ? (
                                <div className="p-2">
                                    <h4 className="font-['DM_Sans'] text-xs font-bold text-[#999999] uppercase tracking-widest px-3 pt-2 pb-2">Products</h4>
                                    {suggestions.map(p => (
                                        <div key={p.id} onClick={() => { setQuery(p.name); handleSearch(p.name); }} className="flex items-center gap-3 p-2 hover:bg-[#FAF8F7] cursor-pointer rounded-lg transition-colors">
                                            <div className="w-10 h-10 rounded bg-[#EBEBEB] overflow-hidden shrink-0">
                                                <img src={p.images[0]} alt={p.name} className="w-full h-full object-cover" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="font-['DM_Sans'] text-sm font-medium text-[#343434] truncate">{p.name}</p>
                                                <p className="font-['DM_Sans'] text-xs text-[#999999] truncate">{p.category}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="p-6 text-center">
                                    <p className="font-['DM_Sans'] text-sm text-[#999999]">No results found for "{query}"</p>
                                </div>
                            )}
                        </>
                    ) : (
                        /* History & Trending */
                        <div className="p-4">
                            {history.length > 0 && (
                                <div className="mb-4">
                                    <div className="flex items-center justify-between mb-2">
                                        <h4 className="font-['DM_Sans'] text-xs font-bold text-[#343434] uppercase tracking-widest">Recent Searches</h4>
                                        <button onClick={clearHistory} className="font-['DM_Sans'] text-xs text-[#CA8385] hover:underline">Clear</button>
                                    </div>
                                    <div className="flex flex-wrap gap-2 mt-3">
                                        {history.map((h, i) => (
                                            <button 
                                                key={i} 
                                                onClick={() => { setQuery(h); handleSearch(h); }}
                                                className="bg-[#FAF8F7] border border-[#EBEBEB] px-3 py-1.5 rounded-full font-['DM_Sans'] text-sm text-[#343434] hover:border-[#CA8385] transition-colors"
                                                >
                                                {h}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                            <div>
                                <h4 className="font-['DM_Sans'] text-xs font-bold text-[#343434] uppercase tracking-widest mb-3">Trending</h4>
                                <div className="space-y-1">
                                    {["Outerwear", "Silk Dress", "Leather Bags", "Summer Collection"].map(trend => (
                                        <button 
                                            key={trend} 
                                            onClick={() => { setQuery(trend); handleSearch(trend); }}
                                            className="w-full text-left font-['DM_Sans'] text-sm text-[#999999] hover:text-[#CA8385] py-1.5 transition-colors flex items-center gap-2"
                                        >
                                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                            </svg>
                                            {trend}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
