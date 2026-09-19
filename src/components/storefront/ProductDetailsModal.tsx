import React, { useState } from 'react';
import { 
  X, 
  ShoppingBag, 
  Check, 
  Truck, 
  ShieldCheck, 
  RotateCcw, 
  AlertCircle,
  Plus,
  Minus
} from 'lucide-react';
import { Product } from '../../types';
import { useStore } from '../../context/StoreContext';
import { formatINR } from '../../lib/currency';

interface ProductDetailsModalProps {
  product: Product | null;
  onClose: () => void;
  onOpenCart: () => void;
}

export const ProductDetailsModal: React.FC<ProductDetailsModalProps> = ({
  product,
  onClose,
  onOpenCart,
}) => {
  const { addToCart, deliverySettings } = useStore();

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [addedMessage, setAddedMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!product) return null;

  // Initialize variant defaults if available
  const images = product.images && product.images.length > 0
    ? product.images
    : ['https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=800&q=80'];

  const currentSize = selectedSize || (product.sizes?.[0] || '');
  const currentColor = selectedColor || (product.colors?.[0] || '');

  const handleAddToCart = () => {
    setErrorMessage(null);
    setAddedMessage(null);

    const res = addToCart(product, quantity, currentSize, currentColor);
    if (res.success) {
      setAddedMessage(`Added ${quantity} item${quantity > 1 ? 's' : ''} to your cart!`);
      setTimeout(() => setAddedMessage(null), 3500);
    } else {
      setErrorMessage(res.message || 'Could not add to cart.');
    }
  };

  const isOutOfStock = product.stock <= 0;

  return (
    <div 
      id="product-details-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-stone-950/70 backdrop-blur-xs overflow-y-auto"
    >
      <div 
        id="product-details-modal-content"
        className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col md:flex-row"
      >
        {/* Close Button */}
        <button
          id="product-details-close-btn"
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-white/80 hover:bg-white text-stone-700 shadow-md backdrop-blur-xs transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left Side: Images Gallery (up to 5 images) */}
        <div className="w-full md:w-1/2 p-4 sm:p-6 bg-stone-50 flex flex-col justify-between border-b md:border-b-0 md:border-r border-stone-200">
          {/* Main Selected Image */}
          <div className="relative aspect-3/4 rounded-xl overflow-hidden bg-white shadow-2xs border border-stone-200/80">
            <img
              src={images[activeImageIndex] || images[0]}
              alt={product.name}
              className="w-full h-full object-cover object-center"
            />
            {product.discount > 0 && (
              <span className="absolute top-3 left-3 bg-amber-600 text-white text-xs font-bold px-2.5 py-1 rounded-md shadow-xs">
                {product.discount}% OFF
              </span>
            )}
          </div>

          {/* Thumbnails Row (if multiple images up to 5) */}
          {images.length > 1 && (
            <div className="flex gap-2 mt-4 overflow-x-auto pb-1">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`w-14 h-18 rounded-lg overflow-hidden border-2 shrink-0 transition cursor-pointer ${
                    activeImageIndex === idx ? 'border-amber-800 scale-105 shadow-xs' : 'border-stone-200 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt={`thumb ${idx + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Side: Product Details & Controls */}
        <div className="w-full md:w-1/2 p-6 sm:p-8 flex flex-col justify-between overflow-y-auto">
          <div className="space-y-4">
            
            {/* Category & SKU */}
            <div className="flex items-center justify-between text-xs text-stone-500">
              <span className="font-semibold text-amber-900 uppercase tracking-wider">
                {product.category}
              </span>
              <span>SKU: {product.sku || 'PION-AUTO'}</span>
            </div>

            {/* Product Title */}
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 leading-snug">
              {product.name}
            </h1>

            {/* Pricing Section (INR strictly) */}
            <div className="flex items-baseline gap-3 pt-1">
              <span className="text-2xl sm:text-3xl font-bold text-stone-900">
                {formatINR(product.price)}
              </span>
              {product.mrp > product.price && (
                <span className="text-base text-stone-400 line-through">
                  MRP {formatINR(product.mrp)}
                </span>
              )}
              {product.discount > 0 && (
                <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-sm">
                  Save {formatINR(product.mrp - product.price)}
                </span>
              )}
            </div>

            {/* Stock Availability */}
            <div>
              {isOutOfStock ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-red-100 text-red-700 text-xs font-bold rounded-md">
                  <AlertCircle className="w-4 h-4" />
                  Currently Out of Stock
                </span>
              ) : product.stock <= 5 ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-100 text-amber-800 text-xs font-bold rounded-md">
                  <AlertCircle className="w-4 h-4" />
                  Hurry! Only {product.stock} units left in Shalina store
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-medium rounded-md">
                  <Check className="w-4 h-4" />
                  In Stock ({product.stock} available)
                </span>
              )}
            </div>

            {/* Description */}
            <p className="text-sm text-stone-600 leading-relaxed border-t border-b border-stone-100 py-3">
              {product.description}
            </p>

            {/* Size Variants */}
            {product.sizes && product.sizes.length > 0 && (
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-semibold text-stone-800">
                  <span>Select Size:</span>
                  <span className="text-amber-900">{currentSize}</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => setSelectedSize(size)}
                      className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg border transition cursor-pointer ${
                        currentSize === size
                          ? 'border-stone-900 bg-stone-900 text-white shadow-xs'
                          : 'border-stone-300 text-stone-700 hover:border-stone-500 bg-white'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Color Variants */}
            {product.colors && product.colors.length > 0 && (
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-semibold text-stone-800">
                  <span>Select Color:</span>
                  <span className="text-amber-900">{currentColor}</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {product.colors.map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setSelectedColor(color)}
                      className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition cursor-pointer ${
                        currentColor === color
                          ? 'border-amber-800 bg-amber-50 text-amber-900 font-semibold shadow-xs'
                          : 'border-stone-200 text-stone-700 hover:border-stone-400 bg-white'
                      }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity Stepper & Add to Cart Controls */}
            {!isOutOfStock && (
              <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <div className="flex items-center justify-between border border-stone-300 rounded-lg p-1 bg-stone-50 w-full sm:w-32">
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                    className="p-1.5 text-stone-600 hover:text-stone-900 disabled:opacity-30 cursor-pointer"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="font-semibold text-sm text-stone-900 px-3">{quantity}</span>
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    disabled={quantity >= product.stock}
                    className="p-1.5 text-stone-600 hover:text-stone-900 disabled:opacity-30 cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                <button
                  type="button"
                  id="modal-add-to-cart-btn"
                  onClick={handleAddToCart}
                  className="flex-1 py-3 px-6 bg-stone-900 hover:bg-amber-900 text-white rounded-lg font-semibold text-sm shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Add to Cart ({formatINR(product.price * quantity)})</span>
                </button>
              </div>
            )}

            {/* Alert Messages */}
            {addedMessage && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center justify-between gap-2 text-xs text-emerald-800">
                <span className="flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-emerald-600" />
                  {addedMessage}
                </span>
                <button
                  onClick={onOpenCart}
                  className="underline font-bold hover:text-emerald-950 cursor-pointer"
                >
                  View Cart
                </button>
              </div>
            )}

            {errorMessage && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-xs text-red-700">
                <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Trust Badges */}
            <div className="grid grid-cols-2 gap-2 pt-4 border-t border-stone-100 text-xs text-stone-600">
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-amber-700 shrink-0" />
                <span>Delivery across India</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-amber-700 shrink-0" />
                <span>100% Authentic Quality</span>
              </div>
              <div className="flex items-center gap-2">
                <RotateCcw className="w-4 h-4 text-amber-700 shrink-0" />
                <span>7-Day Easy Exchange</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-amber-800">₹</span>
                <span>COD in Shalina ({deliverySettings.codRadiusKm}km)</span>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};
