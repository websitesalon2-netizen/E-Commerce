import React, { useState, useMemo } from 'react';
import { 
  Filter, 
  Search, 
  X, 
  SlidersHorizontal, 
  ArrowUpDown, 
  Check, 
  ShoppingBag,
  Sparkles
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { ProductCard } from '../storefront/ProductCard';
import { Product } from '../../types';
import { formatINR } from '../../lib/currency';

interface ShopPageProps {
  initialCategory?: string;
  initialQuery?: string;
  initialFilter?: string;
  onSelectProduct: (product: Product) => void;
  onQuickAdd: (product: Product) => void;
}

export const ShopPage: React.FC<ShopPageProps> = ({
  initialCategory,
  initialQuery = '',
  initialFilter,
  onSelectProduct,
  onQuickAdd,
}) => {
  const { products, categories } = useStore();

  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory || 'all');
  const [searchQuery, setSearchQuery] = useState<string>(initialQuery);
  const [sortBy, setSortBy] = useState<string>('newest');
  const [selectedSize, setSelectedSize] = useState<string>('all');
  const [selectedColor, setSelectedColor] = useState<string>('all');
  const [onlyInStock, setOnlyInStock] = useState<boolean>(false);
  const [priceRange, setPriceRange] = useState<number>(10000);
  const [mobileFilterOpen, setMobileFilterOpen] = useState<boolean>(false);

  // Extract all available sizes and colors from products catalog
  const allSizes = useMemo(() => {
    const set = new Set<string>();
    products.forEach(p => p.sizes?.forEach(s => set.add(s)));
    return Array.from(set);
  }, [products]);

  const allColors = useMemo(() => {
    const set = new Set<string>();
    products.forEach(p => p.colors?.forEach(c => set.add(c)));
    return Array.from(set);
  }, [products]);

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      // Category match
      if (selectedCategory !== 'all' && product.category.toLowerCase() !== selectedCategory.toLowerCase()) {
        return false;
      }

      // Predefined quick filters
      if (initialFilter === 'featured' && !product.featured) return false;
      if (initialFilter === 'newArrival' && !product.newArrival) return false;

      // Search match (name, description, tags, category, SKU)
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = product.name.toLowerCase().includes(q);
        const matchesDesc = product.description.toLowerCase().includes(q);
        const matchesCat = product.category.toLowerCase().includes(q);
        const matchesSku = product.sku?.toLowerCase().includes(q);
        const matchesTags = product.tags?.some(t => t.toLowerCase().includes(q));
        if (!matchesName && !matchesDesc && !matchesCat && !matchesSku && !matchesTags) {
          return false;
        }
      }

      // Size match
      if (selectedSize !== 'all' && !product.sizes?.includes(selectedSize)) {
        return false;
      }

      // Color match
      if (selectedColor !== 'all' && !product.colors?.includes(selectedColor)) {
        return false;
      }

      // In stock match
      if (onlyInStock && product.stock <= 0) {
        return false;
      }

      // Max price
      if (product.price > priceRange) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-low') return a.price - b.price;
      if (sortBy === 'price-high') return b.price - a.price;
      if (sortBy === 'featured') return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
      // default: newest
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }, [
    products, 
    selectedCategory, 
    searchQuery, 
    sortBy, 
    selectedSize, 
    selectedColor, 
    onlyInStock, 
    priceRange, 
    initialFilter
  ]);

  const resetFilters = () => {
    setSelectedCategory('all');
    setSearchQuery('');
    setSelectedSize('all');
    setSelectedColor('all');
    setOnlyInStock(false);
    setPriceRange(10000);
    setSortBy('newest');
  };

  const hasActiveFilters = selectedCategory !== 'all' || 
    searchQuery !== '' || 
    selectedSize !== 'all' || 
    selectedColor !== 'all' || 
    onlyInStock || 
    priceRange < 10000;

  return (
    <div id="shop-catalog-page" className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-stone-200">
        <div>
          <span className="text-xs uppercase tracking-widest text-amber-900 font-bold block mb-1">
            Pioneer Clothing House
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900">
            {selectedCategory === 'all' ? 'All Apparel Collections' : selectedCategory}
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            Showing {filteredProducts.length} of {products.length} clothing items
          </p>
        </div>

        {/* Controls: Search, Sort & Mobile Filter Toggle */}
        <div className="flex flex-wrap items-center gap-3">
          
          {/* Search Field */}
          <div className="relative min-w-[220px]">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search catalog..."
              className="w-full pl-9 pr-3 py-2 bg-white border border-stone-300 rounded-lg text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-700"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Sort Selector */}
          <div className="flex items-center gap-1.5 bg-white border border-stone-300 rounded-lg px-3 py-2 text-xs">
            <ArrowUpDown className="w-3.5 h-3.5 text-stone-500" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-transparent text-stone-800 font-medium focus:outline-none cursor-pointer"
            >
              <option value="newest">Newest Arrivals</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="featured">Featured First</option>
            </select>
          </div>

          {/* Mobile Filter Button */}
          <button
            onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
            className="lg:hidden flex items-center gap-1.5 px-3 py-2 bg-stone-900 text-white rounded-lg text-xs font-semibold cursor-pointer"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Filters</span>
            {hasActiveFilters && (
              <span className="w-2 h-2 rounded-full bg-amber-400" />
            )}
          </button>

        </div>
      </div>

      {/* Main Layout: Sidebar Filters + Products Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Desktop Sidebar Filters */}
        <aside className="hidden lg:block lg:col-span-3 bg-white rounded-xl p-5 border border-stone-200/90 shadow-2xs space-y-6 sticky top-24">
          <div className="flex items-center justify-between pb-3 border-b border-stone-200">
            <h3 className="text-sm font-bold text-stone-900 flex items-center gap-2">
              <Filter className="w-4 h-4 text-amber-800" />
              <span>Filter Catalog</span>
            </h3>
            {hasActiveFilters && (
              <button
                onClick={resetFilters}
                className="text-xs text-amber-800 hover:underline font-semibold cursor-pointer"
              >
                Reset All
              </button>
            )}
          </div>

          {/* Categories Filter */}
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-stone-500 block">
              Categories
            </span>
            <div className="space-y-1 text-xs">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`w-full text-left px-2.5 py-1.5 rounded-md transition cursor-pointer flex items-center justify-between ${
                  selectedCategory === 'all'
                    ? 'bg-stone-900 text-white font-semibold'
                    : 'text-stone-700 hover:bg-stone-100'
                }`}
              >
                <span>All Categories</span>
                <span>{products.length}</span>
              </button>
              {categories.filter(c => c.isActive).map((cat) => {
                const count = products.filter(p => p.category.toLowerCase() === cat.name.toLowerCase()).length;
                const isSelected = selectedCategory.toLowerCase() === cat.name.toLowerCase();
                return (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.name)}
                    className={`w-full text-left px-2.5 py-1.5 rounded-md transition cursor-pointer flex items-center justify-between ${
                      isSelected
                        ? 'bg-amber-900 text-white font-semibold'
                        : 'text-stone-700 hover:bg-stone-100'
                    }`}
                  >
                    <span className="truncate pr-2">{cat.name}</span>
                    <span className="text-[11px] opacity-75">{count}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Price Range Filter */}
          <div className="space-y-2 pt-2 border-t border-stone-100">
            <div className="flex justify-between text-xs font-semibold text-stone-700">
              <span>Max Price:</span>
              <span className="text-amber-900">{formatINR(priceRange)}</span>
            </div>
            <input
              type="range"
              min="500"
              max="15000"
              step="250"
              value={priceRange}
              onChange={(e) => setPriceRange(Number(e.target.value))}
              className="w-full accent-amber-800 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-stone-400">
              <span>₹500</span>
              <span>₹15,000</span>
            </div>
          </div>

          {/* Size Filter */}
          {allSizes.length > 0 && (
            <div className="space-y-2 pt-2 border-t border-stone-100">
              <span className="text-xs font-bold uppercase tracking-wider text-stone-500 block">
                Size
              </span>
              <div className="flex flex-wrap gap-1.5">
                <button
                  onClick={() => setSelectedSize('all')}
                  className={`px-2.5 py-1 text-xs rounded-md border transition cursor-pointer ${
                    selectedSize === 'all'
                      ? 'border-stone-900 bg-stone-900 text-white font-semibold'
                      : 'border-stone-200 text-stone-700 hover:bg-stone-50'
                  }`}
                >
                  All
                </button>
                {allSizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-2.5 py-1 text-xs rounded-md border transition cursor-pointer ${
                      selectedSize === size
                        ? 'border-amber-800 bg-amber-900 text-white font-semibold'
                        : 'border-stone-200 text-stone-700 hover:bg-stone-50'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Color Filter */}
          {allColors.length > 0 && (
            <div className="space-y-2 pt-2 border-t border-stone-100">
              <span className="text-xs font-bold uppercase tracking-wider text-stone-500 block">
                Color
              </span>
              <div className="flex flex-wrap gap-1.5">
                <button
                  onClick={() => setSelectedColor('all')}
                  className={`px-2 py-1 text-xs rounded-md border transition cursor-pointer ${
                    selectedColor === 'all'
                      ? 'border-stone-900 bg-stone-900 text-white font-semibold'
                      : 'border-stone-200 text-stone-700 hover:bg-stone-50'
                  }`}
                >
                  All
                </button>
                {allColors.slice(0, 10).map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`px-2 py-1 text-xs rounded-md border transition cursor-pointer ${
                      selectedColor === color
                        ? 'border-amber-800 bg-amber-50 text-amber-900 font-semibold'
                        : 'border-stone-200 text-stone-700 hover:bg-stone-50'
                    }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* In Stock Only Toggle */}
          <div className="pt-2 border-t border-stone-100">
            <label className="flex items-center gap-2.5 text-xs font-medium text-stone-800 cursor-pointer">
              <input
                type="checkbox"
                checked={onlyInStock}
                onChange={(e) => setOnlyInStock(e.target.checked)}
                className="w-4 h-4 rounded-sm text-amber-800 focus:ring-amber-700 cursor-pointer"
              />
              <span>In Stock Only</span>
            </label>
          </div>

        </aside>

        {/* Mobile Filter Drawer */}
        {mobileFilterOpen && (
          <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex justify-end lg:hidden">
            <div className="w-4/5 max-w-sm bg-white h-full shadow-2xl p-6 overflow-y-auto space-y-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-4 border-b border-stone-200">
                  <h3 className="font-serif text-lg font-bold text-stone-900">Filters</h3>
                  <button 
                    onClick={() => setMobileFilterOpen(false)}
                    className="p-1 text-stone-500 hover:text-stone-800"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Mobile Categories */}
                <div className="py-4 space-y-2 border-b border-stone-100">
                  <span className="text-xs font-bold uppercase text-stone-500">Category</span>
                  <div className="space-y-1">
                    <button
                      onClick={() => setSelectedCategory('all')}
                      className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium ${
                        selectedCategory === 'all' ? 'bg-stone-900 text-white' : 'text-stone-700'
                      }`}
                    >
                      All Categories
                    </button>
                    {categories.filter(c => c.isActive).map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => setSelectedCategory(cat.name)}
                        className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium ${
                          selectedCategory.toLowerCase() === cat.name.toLowerCase() 
                            ? 'bg-amber-900 text-white font-semibold' 
                            : 'text-stone-700'
                        }`}
                      >
                        {cat.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Price Range */}
                <div className="py-4 space-y-2 border-b border-stone-100">
                  <div className="flex justify-between text-xs font-semibold text-stone-800">
                    <span>Max Price:</span>
                    <span>{formatINR(priceRange)}</span>
                  </div>
                  <input
                    type="range"
                    min="500"
                    max="15000"
                    step="250"
                    value={priceRange}
                    onChange={(e) => setPriceRange(Number(e.target.value))}
                    className="w-full accent-amber-800"
                  />
                </div>

                {/* In Stock */}
                <div className="py-4">
                  <label className="flex items-center gap-2 text-xs font-semibold text-stone-800">
                    <input
                      type="checkbox"
                      checked={onlyInStock}
                      onChange={(e) => setOnlyInStock(e.target.checked)}
                      className="w-4 h-4 rounded-sm text-amber-800"
                    />
                    <span>In Stock Only</span>
                  </label>
                </div>
              </div>

              <div className="pt-4 border-t border-stone-200 flex gap-2">
                <button
                  onClick={resetFilters}
                  className="flex-1 py-2.5 border border-stone-300 text-stone-700 rounded-lg text-xs font-semibold"
                >
                  Reset
                </button>
                <button
                  onClick={() => setMobileFilterOpen(false)}
                  className="flex-1 py-2.5 bg-stone-900 text-white rounded-lg text-xs font-semibold"
                >
                  Apply Filters
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Product Grid Stage */}
        <main className="lg:col-span-9 space-y-6">
          {filteredProducts.length === 0 ? (
            <div className="bg-white rounded-xl border border-stone-200 p-12 text-center space-y-4 shadow-2xs">
              <div className="w-16 h-16 rounded-full bg-stone-100 text-stone-400 mx-auto flex items-center justify-center">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <h3 className="font-serif text-xl font-bold text-stone-900">
                No clothing items matched your filter
              </h3>
              <p className="text-xs text-stone-500 max-w-sm mx-auto">
                Try searching for other apparel, adjusting price limits, or clearing the selected category filters.
              </p>
              <button
                onClick={resetFilters}
                className="px-6 py-2.5 bg-stone-900 text-white rounded-lg text-xs font-semibold hover:bg-amber-900 transition cursor-pointer"
              >
                Clear All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onSelect={onSelectProduct}
                  onQuickAdd={onQuickAdd}
                />
              ))}
            </div>
          )}
        </main>

      </div>

    </div>
  );
};
