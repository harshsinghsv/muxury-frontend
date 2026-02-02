import { Link } from "react-router-dom";

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  image: string;
  category?: string;
  isNew?: boolean;
}

const ProductCard = ({ id, name, price, image, category, isNew }: ProductCardProps) => {
  return (
    <Link to={`/product/${id}`} className="product-card block group">
      <div className="relative overflow-hidden bg-cream-dark">
        {isNew && (
          <span className="absolute top-3 left-3 z-10 px-3 py-1 bg-gold text-accent-foreground text-xs font-medium tracking-luxury uppercase">
            New
          </span>
        )}
        <img
          src={image}
          alt={name}
          className="product-card-image"
        />
        {/* Quick view overlay */}
        <div className="absolute inset-0 bg-charcoal/0 group-hover:bg-charcoal/20 transition-colors duration-500 flex items-center justify-center">
          <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 px-6 py-2 bg-primary text-primary-foreground text-sm font-medium tracking-luxury uppercase">
            Quick View
          </span>
        </div>
      </div>
      <div className="p-4 bg-card">
        {category && (
          <p className="text-xs text-muted-foreground tracking-luxury uppercase mb-1">
            {category}
          </p>
        )}
        <h3 className="font-display text-lg font-medium text-card-foreground mb-1">
          {name}
        </h3>
        <p className="font-body text-sm text-gold font-medium">
          ${price.toLocaleString()}
        </p>
      </div>
    </Link>
  );
};

export default ProductCard;
