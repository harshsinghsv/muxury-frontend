const brands = [
    { name: "Nike", logo: "https://upload.wikimedia.org/wikipedia/commons/a/a6/Logo_NIKE.svg" },
    { name: "Adidas", logo: "https://upload.wikimedia.org/wikipedia/commons/2/20/Adidas_Logo.svg" },
    { name: "Puma", logo: "https://upload.wikimedia.org/wikipedia/en/d/da/Puma_complete_logo.svg" },
    { name: "Zara", logo: "https://upload.wikimedia.org/wikipedia/commons/f/fd/Zara_Logo.svg" },
    { name: "H&M", logo: "https://upload.wikimedia.org/wikipedia/commons/5/53/H%26M-Logo.svg" },
    { name: "Levi's", logo: "https://upload.wikimedia.org/wikipedia/commons/6/62/Levi%27s_logo.svg" },
    { name: "Calvin Klein", logo: "https://upload.wikimedia.org/wikipedia/commons/8/87/Calvin_Klein_logo.svg" },
    { name: "Tommy Hilfiger", logo: "https://upload.wikimedia.org/wikipedia/commons/1/15/Tommy_Hilfiger_logo.svg" },
];

const BrandShowcase = () => {
    return (
        <section className="py-8 bg-white">
            <div className="container mx-auto px-4 lg:px-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Shop by Brand</h2>

                <div className="grid grid-cols-4 md:grid-cols-8 gap-4">
                    {brands.map((brand) => (
                        <a
                            key={brand.name}
                            href={`/shop?brand=${brand.name.toLowerCase()}`}
                            className="aspect-square border border-gray-200 hover:border-[#FFB700] bg-white flex items-center justify-center p-4 transition-colors"
                        >
                            <img
                                src={brand.logo}
                                alt={brand.name}
                                className="w-full h-full object-contain grayscale hover:grayscale-0 transition-all"
                            />
                        </a>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default BrandShowcase;
