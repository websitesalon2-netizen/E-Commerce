import React from 'react';
import { ShoppingBag, Eye, Star, AlertCircle } from 'lucide-react';
import { Product } from '../../types';
import { formatINR } from '../../lib/currency';

interface ProductCardProps {
  product: Product;
  onSelect: (product: Product) => void;
  onQuickAdd: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onSelect,
  onQuickAdd,
}) => {
  const isOutOfStock = product.stock <= 0;
  const isLowStock = product.stock > 0 && product.stock <= 5;
  const primaryImage = product.images?.[0] || 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=600&q=80';

  return (
    <div 
      id={`product-card-${product.id}`}
      className="group bg-white rounded-xl border border-stone-200/90 shadow-2xs hover:shadow-md transition-all duration-300 flex flex-col overflow-hidden"
    >
      {/* Product Image Stage */}
      <div 
        onClick={() => onSelect(product)} 
        className="relative aspect-3/4 bg-stone-100 overflow-hidden cursor-pointer"
      >
        <img
          src={primaryImage}
          alt={product.name}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
          loading="lazy"
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=600&q=80';
          }}
        />

        {/* Badges Overlay */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5 items-start">
          {product.newArrival && (
            <span className="bg-stone-900 text-white text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-sm shadow-xs">
              New
            </span>
          )}
          {product.discount > 0 && (
            <span className="bg-amber-600 text-white text-[11px] font-bold px-2 py-0.5 rounded-sm shadow-xs">
              {product.discount}% OFF
            </span>
          )}
          {product.featured && (
            <span className="bg-amber-100 text-amber-900 border border-amber-300 text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-sm flex items-center gap-1 shadow-xs">
              <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
              Featured
            </span>
          )}
        </div>

        {/* Stock Alert Badge */}
        {isOutOfStock ? (
          <div className="absolute inset-0 bg-stone-950/60 backdrop-blur-2xs flex items-center justify-center p-3">
            <span className="px-3 py-1.5 bg-red-600 text-white text-xs font-bold uppercase tracking-wider rounded-md shadow-md">
              Sold Out
            </span>
          </div>
        ) : isLowStock ? (
          <div className="absolute bottom-2.5 left-2.5">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-amber-50 text-amber-800 border border-amber-300 text-[10px] font-bold rounded-sm shadow-2xs">
              <AlertCircle className="w-3 h-3 text-amber-600" />
              Only {product.stock} left
            </span>
          </div>
        ) : null}

        {/* Hover Quick View Button */}
        {!isOutOfStock && (
          <div className="absolute inset-x-3 bottom-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200 hidden sm:block">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onSelect(product);
              }}
              className="w-full py-2 bg-white/95 hover:bg-white text-stone-900 rounded-lg text-xs font-semibold shadow-md flex items-center justify-center gap-1.5 transition cursor-pointer"
            >
              <Eye className="w-3.5 h-3.5" />
              Quick View
            </button>
          </div>
        )}
      </div>

      {/* Product Information */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <span className="text-[11px] font-medium uppercase tracking-wider text-amber-900 block mb-1">
            {product.category}
          </span>
          <h3 
            onClick={() => onSelect(product)}
            className="text-sm font-semibold text-stone-900 hover:text-amber-900 line-clamp-2 cursor-pointer transition"
          >
            {product.name}
          </h3>

          {/* Available Sizes / Variants */}
          {product.sizes && product.sizes.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {product.sizes.slice(0, 4).map((size) => (
                <span 
                  key={size} 
                  className="text-[10px] font-medium px-1.5 py-0.5 bg-stone-100 text-stone-600 rounded-xs"
                >
                  {size}
                </span>
              ))}
              {product.sizes.length > 4 && (
                <span className="text-[10px] font-medium px-1.5 py-0.5 bg-stone-100 text-stone-500 rounded-xs">
                  +{product.sizes.length - 4}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Pricing and Action */}
        <div className="pt-3 mt-3 border-t border-stone-100 flex items-center justify-between gap-2">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-base font-bold text-stone-900">
                {formatINR(product.price)}
              </span>
              {product.mrp > product.price && (
                <span className="text-xs text-stone-400 line-through">
                  {formatINR(product.mrp)}
                </span>
              )}
            </div>
          </div>

          <button
            type="button"
            disabled={isOutOfStock}
            onClick={() => onQuickAdd(product)}
            title={isOutOfStock ? 'Out of stock' : 'Add to cart'}
            className={`p-2 rounded-lg transition cursor-pointer ${
              isOutOfStock
                ? 'bg-stone-100 text-stone-300 cursor-not-allowed'
                : 'bg-stone-900 hover:bg-amber-900 text-white shadow-2xs hover:scale-105 active:scale-95'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
