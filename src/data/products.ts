import productDress1 from "@/assets/product-dress-1.jpg";
import productSuit1 from "@/assets/product-suit-1.jpg";
import productDress2 from "@/assets/product-dress-2.jpg";
import productBag from "@/assets/product-bag.jpg";
import productDress3 from "@/assets/product-dress-3.jpg";
import productSuit2 from "@/assets/product-suit-2.jpg";
import productSunglasses from "@/assets/product-sunglasses.jpg";

export interface Product {
    id: string;
    name: string;
    price: number;
    originalPrice?: number;
    images: string[];
    category: string;
    sizes: string[];
    stock: number;
    rating: number;
    reviewsCount: number;
    description: string;
    isNew?: boolean;
    isFeatured?: boolean;
}

export interface Review {
    id: string;
    productId: string;
    userName: string;
    rating: number;
    comment: string;
    date: string;
}

export const categories = [
    { id: "women", name: "Women", slug: "women" },
    { id: "men", name: "Men", slug: "men" },
    { id: "accessories", name: "Accessories", slug: "accessories" },
    { id: "dresses", name: "Dresses", slug: "dresses" },
    { id: "suits", name: "Suits", slug: "suits" },
];

export const products: Product[] = [
    {
        id: "1",
        name: "Silk Evening Gown",
        price: 2450,
        originalPrice: 2950,
        images: [productDress1],
        category: "dresses",
        sizes: ["XS", "S", "M", "L", "XL"],
        stock: 15,
        rating: 4.8,
        reviewsCount: 124,
        description: "Luxurious silk evening gown with elegant draping and a flattering silhouette. Perfect for formal occasions and special events. Features a subtle shimmer that catches the light beautifully.",
        isNew: true,
        isFeatured: true,
    },
    {
        id: "2",
        name: "Tailored Navy Suit",
        price: 1890,
        images: [productSuit1],
        category: "suits",
        sizes: ["S", "M", "L", "XL", "XXL"],
        stock: 22,
        rating: 4.9,
        reviewsCount: 89,
        description: "Impeccably tailored navy suit crafted from premium Italian wool. Features a modern slim fit with functional button cuffs and hand-stitched details.",
        isNew: true,
        isFeatured: true,
    },
    {
        id: "3",
        name: "Golden Wrap Dress",
        price: 1650,
        originalPrice: 1850,
        images: [productDress2],
        category: "dresses",
        sizes: ["XS", "S", "M", "L"],
        stock: 8,
        rating: 4.7,
        reviewsCount: 56,
        description: "Stunning golden wrap dress with a flattering crossover neckline and adjustable tie waist. Made from premium satin fabric with a subtle sheen.",
        isNew: false,
        isFeatured: true,
    },
    {
        id: "4",
        name: "Designer Leather Tote",
        price: 980,
        images: [productBag],
        category: "accessories",
        sizes: ["One Size"],
        stock: 30,
        rating: 4.6,
        reviewsCount: 203,
        description: "Versatile designer tote bag crafted from premium Italian leather. Features multiple interior compartments, gold-tone hardware, and detachable shoulder strap.",
        isNew: true,
        isFeatured: true,
    },
    {
        id: "5",
        name: "Velvet Evening Gown",
        price: 2890,
        images: [productDress3],
        category: "dresses",
        sizes: ["XS", "S", "M", "L", "XL"],
        stock: 12,
        rating: 4.9,
        reviewsCount: 78,
        description: "Exquisite velvet evening gown with a deep V-neckline and flowing train. The rich fabric drapes beautifully and is perfect for black-tie events.",
        isNew: true,
        isFeatured: false,
    },
    {
        id: "6",
        name: "Classic Black Tuxedo",
        price: 2250,
        originalPrice: 2650,
        images: [productSuit2],
        category: "suits",
        sizes: ["S", "M", "L", "XL", "XXL"],
        stock: 18,
        rating: 4.8,
        reviewsCount: 145,
        description: "Timeless black tuxedo with satin peak lapels and a single-button closure. Crafted from premium wool blend for the perfect formal look.",
        isNew: true,
        isFeatured: false,
    },
    {
        id: "7",
        name: "Aviator Sunglasses",
        price: 450,
        images: [productSunglasses],
        category: "accessories",
        sizes: ["One Size"],
        stock: 50,
        rating: 4.5,
        reviewsCount: 312,
        description: "Classic aviator sunglasses with polarized lenses and a lightweight titanium frame. Provides 100% UV protection while maintaining a timeless aesthetic.",
        isNew: true,
        isFeatured: false,
    },
    {
        id: "8",
        name: "Cashmere Blend Blazer",
        price: 1450,
        images: [productSuit1],
        category: "suits",
        sizes: ["S", "M", "L", "XL"],
        stock: 25,
        rating: 4.7,
        reviewsCount: 67,
        description: "Luxuriously soft cashmere blend blazer with a relaxed fit. Perfect for smart-casual occasions with its versatile styling options.",
        isNew: false,
        isFeatured: false,
    },
    {
        id: "9",
        name: "Emerald Cocktail Dress",
        price: 1280,
        originalPrice: 1580,
        images: [productDress2],
        category: "dresses",
        sizes: ["XS", "S", "M", "L"],
        stock: 14,
        rating: 4.6,
        reviewsCount: 92,
        description: "Elegant emerald cocktail dress with a flattering A-line silhouette. Features delicate beading at the neckline and a flowing skirt.",
        isNew: false,
        isFeatured: false,
    },
    {
        id: "10",
        name: "Leather Crossbody Bag",
        price: 680,
        images: [productBag],
        category: "accessories",
        sizes: ["One Size"],
        stock: 35,
        rating: 4.4,
        reviewsCount: 178,
        description: "Compact leather crossbody bag with an adjustable strap and secure magnetic closure. Features multiple card slots and a zip pocket.",
        isNew: false,
        isFeatured: false,
    },
    {
        id: "11",
        name: "Navy Pinstripe Suit",
        price: 2100,
        images: [productSuit2],
        category: "suits",
        sizes: ["S", "M", "L", "XL", "XXL"],
        stock: 10,
        rating: 4.8,
        reviewsCount: 54,
        description: "Sophisticated navy pinstripe suit with a modern two-button design. Made from premium wool with a subtle pinstripe pattern for a distinguished look.",
        isNew: false,
        isFeatured: false,
    },
    {
        id: "12",
        name: "Lace Evening Dress",
        price: 1950,
        images: [productDress3],
        category: "dresses",
        sizes: ["XS", "S", "M", "L"],
        stock: 9,
        rating: 4.9,
        reviewsCount: 41,
        description: "Romantic lace evening dress with intricate floral detailing and a sweetheart neckline. Features a fitted bodice and flowing full-length skirt.",
        isNew: false,
        isFeatured: false,
    },
    {
        id: "13",
        name: "Luxury Watch",
        price: 3500,
        originalPrice: 4200,
        images: [productSunglasses],
        category: "accessories",
        sizes: ["One Size"],
        stock: 8,
        rating: 4.9,
        reviewsCount: 89,
        description: "Premium luxury timepiece with Swiss movement and sapphire crystal face. Features a stainless steel case and genuine leather strap.",
        isNew: true,
        isFeatured: false,
    },
    {
        id: "14",
        name: "Charcoal Wool Suit",
        price: 1780,
        images: [productSuit1],
        category: "suits",
        sizes: ["S", "M", "L", "XL"],
        stock: 20,
        rating: 4.6,
        reviewsCount: 73,
        description: "Versatile charcoal wool suit with a classic fit. Perfect for both professional and formal settings with its timeless design.",
        isNew: false,
        isFeatured: false,
    },
    {
        id: "15",
        name: "Burgundy Maxi Dress",
        price: 1380,
        images: [productDress1],
        category: "dresses",
        sizes: ["XS", "S", "M", "L", "XL"],
        stock: 16,
        rating: 4.5,
        reviewsCount: 62,
        description: "Elegant burgundy maxi dress with flowing sleeves and a cinched waist. Made from lightweight chiffon for comfortable all-day wear.",
        isNew: false,
        isFeatured: false,
    },
    {
        id: "16",
        name: "Silk Pocket Square Set",
        price: 180,
        images: [productSunglasses],
        category: "accessories",
        sizes: ["One Size"],
        stock: 100,
        rating: 4.3,
        reviewsCount: 156,
        description: "Elegant set of three silk pocket squares in complementary colors. Hand-rolled edges and premium silk for a refined finish.",
        isNew: false,
        isFeatured: false,
    },
];

export const mockReviews: Review[] = [
    {
        id: "r1",
        productId: "1",
        userName: "Sarah M.",
        rating: 5,
        comment: "Absolutely stunning dress! The silk quality is exceptional and the fit is perfect. Received so many compliments at my event.",
        date: "2024-01-15",
    },
    {
        id: "r2",
        productId: "1",
        userName: "Emily R.",
        rating: 5,
        comment: "The most beautiful gown I've ever owned. Worth every penny!",
        date: "2024-01-10",
    },
    {
        id: "r3",
        productId: "1",
        userName: "Jessica L.",
        rating: 4,
        comment: "Beautiful dress, runs slightly small so consider sizing up.",
        date: "2024-01-05",
    },
    {
        id: "r4",
        productId: "2",
        userName: "Michael T.",
        rating: 5,
        comment: "Impeccable tailoring and fit. This suit makes me feel like a million bucks.",
        date: "2024-01-12",
    },
    {
        id: "r5",
        productId: "2",
        userName: "James W.",
        rating: 5,
        comment: "The quality of the fabric and construction is outstanding. Highly recommend!",
        date: "2024-01-08",
    },
    {
        id: "r6",
        productId: "4",
        userName: "Amanda K.",
        rating: 4,
        comment: "Great bag with lots of room. The leather is soft and the color is rich.",
        date: "2024-01-14",
    },
];

export const getProductById = (id: string): Product | undefined => {
    return products.find((product) => product.id === id);
};

export const getProductsByCategory = (category: string): Product[] => {
    return products.filter((product) => product.category === category);
};

export const getFeaturedProducts = (): Product[] => {
    return products.filter((product) => product.isFeatured);
};

export const getNewArrivals = (): Product[] => {
    return products.filter((product) => product.isNew);
};

export const getProductReviews = (productId: string): Review[] => {
    return mockReviews.filter((review) => review.productId === productId);
};
