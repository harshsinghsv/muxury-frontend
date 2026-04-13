import { TagPrice } from "@solar-icons/react"; // TagPrice serves as the discount tag icon

const AvailableOffers = () => {
    return (
        <div className="bg-white border border-[#E0E0E0] rounded-xl p-4 mb-8">
            <div className="flex items-start gap-3 mb-4">
                <TagPrice className="text-[#A94042] mt-0.5 shrink-0" size={18} weight="Outline" />
                <div>
                    <p className="font-sans text-sm font-bold text-[#212121] mb-0.5">Bank Offer</p>
                    <p className="font-sans text-[13px] text-[#757575]">10% off on ICICI Credit Cards, up to ₹1,500.</p>
                </div>
            </div>
            <div className="flex items-start gap-3">
                <TagPrice className="text-[#A94042] mt-0.5 shrink-0" size={18} weight="Outline" />
                <div>
                    <p className="font-sans text-sm font-bold text-[#212121] mb-0.5">Special Price</p>
                    <p className="font-sans text-[13px] text-[#757575]">Get extra 5% off (price inclusive of cashback/coupon)</p>
                </div>
            </div>
        </div>
    );
};

export default AvailableOffers;
