import { Link } from "react-router-dom";
import Icon from "./Icon";

const Footer = () => {
    return (
        <footer className="bg-white border-t border-[#EBEBEB] pt-16 pb-24 md:pb-16 mt-auto">
            <div className="px-5 md:px-12 lg:px-24 xl:px-32 max-w-[1440px] mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8 mb-12">
                    
                    {/* Brand Column */}
                    <div className="md:col-span-1">
                        <Link to="/" className="inline-block mb-6">
                            <h2 className="font-['Playfair_Display'] text-2xl font-bold tracking-wider text-[#343434] uppercase">MUXURY</h2>
                        </Link>
                        <p className="font-['DM_Sans'] text-sm text-[#999999] leading-relaxed mb-6">
                            Redefining modern elegance with sustainable, high-quality fashion. Crafted for the contemporary wardrobe.
                        </p>
                        <div className="flex gap-4">
                            {/* Mock Social Links */}
                            <a href="#" className="w-10 h-10 rounded-full border border-[#EBEBEB] flex items-center justify-center text-[#343434] hover:bg-[#CA8385] hover:text-white transition-colors">
                                <span className="font-bold font-['DM_Sans']">In</span>
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full border border-[#EBEBEB] flex items-center justify-center text-[#343434] hover:bg-[#CA8385] hover:text-white transition-colors">
                                <span className="font-bold font-['DM_Sans']">Fb</span>
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full border border-[#EBEBEB] flex items-center justify-center text-[#343434] hover:bg-[#CA8385] hover:text-white transition-colors">
                                <span className="font-bold font-['DM_Sans']">Tw</span>
                            </a>
                        </div>
                    </div>

                    {/* Shop Links */}
                    <div>
                        <h3 className="font-['DM_Sans'] text-sm font-bold tracking-widest uppercase text-[#343434] mb-6">Shop</h3>
                        <ul className="space-y-4">
                            <li><Link to="/shop?category=women's%20fashion" className="font-['DM_Sans'] text-sm text-[#999999] hover:text-[#CA8385] transition-colors">Women's Fashion</Link></li>
                            <li><Link to="/shop?category=men's%20fashion" className="font-['DM_Sans'] text-sm text-[#999999] hover:text-[#CA8385] transition-colors">Men's Fashion</Link></li>
                            <li><Link to="/shop?category=accessories" className="font-['DM_Sans'] text-sm text-[#999999] hover:text-[#CA8385] transition-colors">Accessories</Link></li>
                            <li><Link to="/shop?category=dresses" className="font-['DM_Sans'] text-sm text-[#999999] hover:text-[#CA8385] transition-colors">Dresses</Link></li>
                        </ul>
                    </div>

                    {/* Company Links */}
                    <div>
                        <h3 className="font-['DM_Sans'] text-sm font-bold tracking-widest uppercase text-[#343434] mb-6">Company</h3>
                        <ul className="space-y-4">
                            <li><Link to="/about" className="font-['DM_Sans'] text-sm text-[#999999] hover:text-[#CA8385] transition-colors">About Us</Link></li>
                            <li><Link to="/contact" className="font-['DM_Sans'] text-sm text-[#999999] hover:text-[#CA8385] transition-colors">Contact Us</Link></li>
                            <li><Link to="/contact" className="font-['DM_Sans'] text-sm text-[#999999] hover:text-[#CA8385] transition-colors">Careers</Link></li>
                        </ul>
                    </div>

                    {/* Support Links */}
                    <div>
                        <h3 className="font-['DM_Sans'] text-sm font-bold tracking-widest uppercase text-[#343434] mb-6">Support</h3>
                        <ul className="space-y-4">
                            <li><Link to="/faq" className="font-['DM_Sans'] text-sm text-[#999999] hover:text-[#CA8385] transition-colors">FAQ</Link></li>
                            <li><Link to="/shipping" className="font-['DM_Sans'] text-sm text-[#999999] hover:text-[#CA8385] transition-colors">Shipping Policy</Link></li>
                            <li><Link to="/returns" className="font-['DM_Sans'] text-sm text-[#999999] hover:text-[#CA8385] transition-colors">Returns & Exchanges</Link></li>
                        </ul>
                    </div>

                </div>

                <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-[#EBEBEB] gap-4">
                    <p className="font-['DM_Sans'] text-sm text-[#999999]">
                        &copy; {new Date().getFullYear()} Muxury. All rights reserved.
                    </p>
                    <div className="flex gap-6">
                        <Link to="/privacy" className="font-['DM_Sans'] text-sm text-[#999999] hover:text-[#CA8385] transition-colors">Privacy Policy</Link>
                        <Link to="/terms" className="font-['DM_Sans'] text-sm text-[#999999] hover:text-[#CA8385] transition-colors">Terms of Service</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
