import React from 'react';
import { 
  X, 
  ShoppingBag, 
  Trash2, 
  Plus, 
  Minus, 
  ArrowRight, 
  Truck, 
  ShieldCheck,
  AlertTriangle 
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { formatINR } from '../../lib/currency';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateToCheckout: () => void;
  onContinueShopping: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  onNavigateToCheckout,
  onContinueShopping,
}) => {
  const { 
    cart, 
    removeFromCart, 
    updateCartQuantity, 
    clearCart, 
    cartSubtotal, 
    deliveryCharge, 
    cartGrandTotal,
    deliverySettings
  } = useStore();

  if (!isOpen) return null;

  const freeDeliveryThreshold = deliverySettings.freeDeliveryThreshold;
  const differenceForFreeDelivery = freeDeliveryThreshold - cartSubtotal;
  const freeDeliveryProgress = Math.min(100, Math.round((cartSubtotal / freeDeliveryThreshold) * 100));

  return (
    <div 
      id="cart-drawer-backdrop" 
      className="fixed inset-0 z-50 bg-stone-950/60 backdrop-blur-xs flex justify-end"
    >
      <div 
        id="cart-drawer-panel"
        className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between overflow-hidden"
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-stone-200 flex items-center justify-between bg-stone-50">
          <div className="flex items-center gap-2.5">
            <ShoppingBag className="w-5 h-5 text-amber-800" />
            <h2 className="font-serif text-lg font-bold text-stone-900">
              Your Shopping Cart ({cart.reduce((s, i) => s + i.quantity, 0)})
            </h2>
          </div>
          <button
            id="cart-drawer-close-btn"
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-200 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free Delivery Banner Progress */}
        {freeDeliveryThreshold > 0 && cart.length > 0 && (
          <div className="px-5 py-3 bg-amber-50/70 border-b border-amber-200/60 text-xs text-amber-900 space-y-1.5">
            <div className="flex items-center justify-between font-medium">
              <span className="flex items-center gap-1.5">
                <Truck className="w-4 h-4 text-amber-700" />
                {differenceForFreeDelivery > 0 ? (
                  <span>
                    Add <strong>{formatINR(differenceForFreeDelivery)}</strong> more for <strong>FREE Delivery</strong>
                  </span>
                ) : (
                  <span className="text-emerald-700 font-semibold">
                    🎉 You qualify for FREE Delivery!
                  </span>
                )}
              </span>
              <span>{freeDeliveryProgress}%</span>
            </div>
            <div className="w-full bg-amber-200/60 h-1.5 rounded-full overflow-hidden">
              <div 
                className="bg-amber-700 h-1.5 rounded-full transition-all duration-300"
                style={{ width: `${freeDeliveryProgress}%` }}
              />
            </div>
          </div>
        )}

        {/* Cart Item List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 divide-y divide-stone-100">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
              <div className="w-16 h-16 rounded-full bg-stone-100 flex items-center justify-center text-stone-400">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <h3 className="font-serif text-lg font-bold text-stone-900">Your cart is empty</h3>
                <p className="text-xs text-stone-500 max-w-xs">
                  Explore our authentic Kashmiri pherans, suits, shawls, and shirts.
                </p>
              </div>
              <button
                onClick={() => {
                  onClose();
                  onContinueShopping();
                }}
                className="px-6 py-2.5 bg-stone-900 hover:bg-amber-900 text-white rounded-lg text-xs font-semibold shadow-xs transition cursor-pointer"
              >
                Browse Shop Catalog
              </button>
            </div>
          ) : (
            cart.map((item, idx) => {
              const product = item.product;
              const isOverStock = item.quantity > product.stock;

              return (
                <div key={idx} className="py-4 first:pt-0 last:pb-0 flex gap-3.5 items-start">
                  {/* Thumbnail */}
                  <img
                    src={product.images?.[0] || 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=150&q=80'}
                    alt={product.name}
                    className="w-18 h-22 object-cover rounded-lg bg-stone-100 shrink-0 border border-stone-200"
                  />

                  {/* Info */}
                  <div className="flex-1 min-w-0 flex flex-col justify-between h-22">
                    <div>
                      <div className="flex justify-between items-start gap-2">
                        <h4 className="text-xs font-semibold text-stone-900 truncate">
                          {product.name}
                        </h4>
                        <button
                          onClick={() => removeFromCart(idx)}
                          className="text-stone-400 hover:text-red-600 transition p-1 cursor-pointer"
                          title="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Specs */}
                      <div className="flex gap-2 text-[11px] text-stone-500 mt-0.5">
                        {item.selectedSize && <span>Size: {item.selectedSize}</span>}
                        {item.selectedColor && <span>Color: {item.selectedColor}</span>}
                      </div>

                      {isOverStock && (
                        <p className="text-[10px] text-red-600 font-semibold flex items-center gap-1 mt-1">
                          <AlertTriangle className="w-3 h-3" />
                          Only {product.stock} left in stock
                        </p>
                      )}
                    </div>

                    {/* Stepper & Price */}
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center border border-stone-200 rounded-md bg-stone-50">
                        <button
                          type="button"
                          onClick={() => updateCartQuantity(idx, item.quantity - 1)}
                          className="p-1 text-stone-600 hover:text-stone-900 cursor-pointer"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2 text-xs font-semibold text-stone-900">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateCartQuantity(idx, item.quantity + 1)}
                          disabled={item.quantity >= product.stock}
                          className="p-1 text-stone-600 hover:text-stone-900 disabled:opacity-30 cursor-pointer"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <div className="text-right">
                        <span className="text-xs font-bold text-stone-900">
                          {formatINR(product.price * item.quantity)}
                        </span>
                      </div>
                    </div>

                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer Summary & Checkout */}
        {cart.length > 0 && (
          <div className="p-4 sm:p-5 border-t border-stone-200 bg-stone-50 space-y-3">
            <div className="space-y-1.5 text-xs text-stone-600">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-semibold text-stone-900">{formatINR(cartSubtotal)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Estimated Delivery</span>
                <span className="font-semibold text-stone-900">
                  {deliveryCharge === 0 ? (
                    <span className="text-emerald-700 font-bold uppercase">FREE</span>
                  ) : (
                    formatINR(deliveryCharge)
                  )}
                </span>
              </div>
              <div className="flex justify-between text-sm font-bold text-stone-900 pt-2 border-t border-stone-200">
                <span>Grand Total</span>
                <span className="text-base text-amber-900">{formatINR(cartGrandTotal)}</span>
              </div>
            </div>

            <button
              id="cart-checkout-proceed-btn"
              onClick={() => {
                onClose();
                onNavigateToCheckout();
              }}
              className="w-full py-3 px-4 bg-stone-900 hover:bg-amber-900 text-white rounded-xl text-sm font-semibold shadow-md transition flex items-center justify-center gap-2 cursor-pointer group"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            <div className="flex items-center justify-between text-[11px] text-stone-500 pt-1">
              <button
                onClick={clearCart}
                className="hover:text-red-700 underline cursor-pointer"
              >
                Clear Cart
              </button>
              <button
                onClick={() => {
                  onClose();
                  onContinueShopping();
                }}
                className="hover:text-stone-900 underline cursor-pointer"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
