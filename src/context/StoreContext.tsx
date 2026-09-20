import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { 
  Product, 
  Category, 
  CartItem, 
  Order, 
  SiteSettings, 
  PaymentSettings, 
  DeliverySettings, 
  ContactSettings, 
  BusinessHours, 
  ThemeSettings, 
  WebsiteContent,
  UserRole,
  PaymentMethod,
  OrderStatus
} from '../types';
import {
  fetchProducts,
  saveProduct as apiSaveProduct,
  deleteProduct as apiDeleteProduct,
  fetchCategories,
  saveCategory as apiSaveCategory,
  deleteCategory as apiDeleteCategory,
  fetchOrders,
  createOrder as apiCreateOrder,
  deleteOrder as apiDeleteOrder,
  updateOrderStatus as apiUpdateOrderStatus,
  fetchSettings,
  saveSettings as apiSaveSettings,
  uploadDeviceImage,
  isFirebaseConfigured
} from '../lib/firebase';
import {
  INITIAL_PRODUCTS,
  INITIAL_CATEGORIES,
  INITIAL_SITE_SETTINGS,
  INITIAL_PAYMENT_SETTINGS,
  INITIAL_DELIVERY_SETTINGS,
  INITIAL_CONTACT_SETTINGS,
  INITIAL_BUSINESS_HOURS,
  INITIAL_THEME_SETTINGS,
  INITIAL_WEBSITE_CONTENT
} from '../data/seedData';

// Recursive helper to ensure no 'undefined' values reach Firestore operations
const cleanPayload = (obj: any): any => {
  if (obj === null || obj === undefined) return '';
  if (typeof obj !== 'object') return obj;
  if (Array.isArray(obj)) return obj.map(cleanPayload);

  const cleaned: Record<string, any> = {};
  for (const key of Object.keys(obj)) {
    const val = obj[key];
    cleaned[key] = val === undefined ? '' : cleanPayload(val);
  }
  return cleaned;
};

interface StoreContextType {
  // Catalog
  products: Product[];
  categories: Category[];
  isLoading: boolean;
  refreshCatalog: () => Promise<void>;
  saveProduct: (product: Partial<Product>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  saveCategory: (category: Partial<Category>) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;

  // Cart
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number, size?: string, color?: string) => { success: boolean; message?: string };
  removeFromCart: (index: number) => void;
  updateCartQuantity: (index: number, quantity: number) => void;
  clearCart: () => void;
  cartSubtotal: number;
  deliveryCharge: number;
  cartGrandTotal: number;
  isCodEligible: (distanceKm?: number) => boolean;

  // Orders
  orders: Order[];
  placeOrder: (orderData: Omit<Order, 'id' | 'orderNumber' | 'createdAt' | 'updatedAt'>) => Promise<Order>;
  updateOrderStatus: (orderId: string, status: OrderStatus, paymentStatusOrNotes?: string) => Promise<void>;
  deleteOrder: (orderId: string) => Promise<void>;
  refreshOrders: () => Promise<void>;

  // Settings
  siteSettings: SiteSettings;
  paymentSettings: PaymentSettings;
  deliverySettings: DeliverySettings;
  contactSettings: ContactSettings;
  businessHours: BusinessHours;
  themeSettings: ThemeSettings;
  visualTheme: ThemeSettings;
  websiteContent: WebsiteContent;
  updateSiteSettings: (data: Partial<SiteSettings>) => Promise<void>;
  updatePaymentSettings: (data: Partial<PaymentSettings>) => Promise<void>;
  updateDeliverySettings: (data: Partial<DeliverySettings>) => Promise<void>;
  updateContactSettings: (data: Partial<ContactSettings>) => Promise<void>;
  updateBusinessHours: (data: BusinessHours) => Promise<void>;
  updateThemeSettings: (data: Partial<ThemeSettings>) => Promise<void>;
  updateVisualTheme: (data: Partial<ThemeSettings>) => Promise<void>;
  updateWebsiteContent: (data: Partial<WebsiteContent>) => Promise<void>;
  resetThemeToDefault: () => Promise<void>;
  resetVisualTheme: () => Promise<void>;

  // Image Upload
  uploadImage: (file: File, folder: string, onProgress?: (p: number) => void) => Promise<string>;

  // Authentication
  currentUserRole: UserRole;
  loginManager: (password: string) => boolean;
  loginAsManager: (password: string) => boolean;
  loginDeveloper: (password: string) => boolean;
  loginAsDeveloper: (password: string) => boolean;
  logout: () => void;
  logoutRole: () => void;
  changeManagerPassword: (oldPass: string, newPass: string) => { success: boolean; message: string };
  changeDeveloperPassword: (oldPass: string, newPass: string) => { success: boolean; message: string };

  // Status
  isFirebaseLive: boolean;
}

const StoreContext = createContext<StoreContextType | null>(null);

const LS_CART = 'Zenith_Apparel_Footwear_cart';
const LS_MGR_PASS = 'Zenith_Apparel_Footwear_mgr_pass_hash';
const LS_DEV_PASS = 'Zenith_Apparel_Footwear_dev_pass_hash';

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [categories, setCategories] = useState<Category[]>(INITIAL_CATEGORIES);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Settings States with baseline fallbacks
  const [siteSettings, setSiteSettings] = useState<SiteSettings>(INITIAL_SITE_SETTINGS);
  const [paymentSettings, setPaymentSettings] = useState<PaymentSettings>(INITIAL_PAYMENT_SETTINGS);
  const [deliverySettings, setDeliverySettings] = useState<DeliverySettings>(INITIAL_DELIVERY_SETTINGS);
  const [contactSettings, setContactSettings] = useState<ContactSettings>(INITIAL_CONTACT_SETTINGS);
  const [businessHours, setBusinessHours] = useState<BusinessHours>(INITIAL_BUSINESS_HOURS);
  const [themeSettings, setThemeSettings] = useState<ThemeSettings>(INITIAL_THEME_SETTINGS);
  const [websiteContent, setWebsiteContent] = useState<WebsiteContent>(INITIAL_WEBSITE_CONTENT);

  // Auth State
  const [currentUserRole, setCurrentUserRole] = useState<UserRole>('guest');

  // Cart State
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(LS_CART);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Apply theme settings to CSS custom properties
  useEffect(() => {
    const root = document.documentElement;
    if (themeSettings) {
      root.style.setProperty('--color-primary', themeSettings.primaryColor || '#800020');
      root.style.setProperty('--color-secondary', themeSettings.secondaryColor || '#D4AF37');
      root.style.setProperty('--color-accent', themeSettings.accentColor || '#F5F5DC');
      root.style.setProperty('--color-btn', themeSettings.buttonColor || '#800020');
      root.style.setProperty('--radius-brand', themeSettings.borderRadius || '8px');
    }
  }, [themeSettings]);

  // Persist cart
  useEffect(() => {
    try {
      localStorage.setItem(LS_CART, JSON.stringify(cart));
    } catch (err) {
      console.error('Failed to save cart to localStorage', err);
    }
  }, [cart]);

  // Initial Data Load
  const loadAllData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [prods, cats, ords, site, payment, delivery, contact, hours, theme, content] = await Promise.all([
        fetchProducts(),
        fetchCategories(),
        fetchOrders(),
        fetchSettings<SiteSettings>('site', INITIAL_SITE_SETTINGS),
        fetchSettings<PaymentSettings>('payment', INITIAL_PAYMENT_SETTINGS),
        fetchSettings<DeliverySettings>('delivery', INITIAL_DELIVERY_SETTINGS),
        fetchSettings<ContactSettings>('contact', INITIAL_CONTACT_SETTINGS),
        fetchSettings<BusinessHours>('businessHours', INITIAL_BUSINESS_HOURS),
        fetchSettings<ThemeSettings>('theme', INITIAL_THEME_SETTINGS),
        fetchSettings<WebsiteContent>('content', INITIAL_WEBSITE_CONTENT),
      ]);

      if (Array.isArray(prods) && prods.length > 0) setProducts(prods);
      if (Array.isArray(cats) && cats.length > 0) setCategories(cats);
      if (Array.isArray(ords)) setOrders(ords);

      // Safe deep merges to eliminate undefined access crash
      setSiteSettings({ ...INITIAL_SITE_SETTINGS, ...(site || {}) });
      setPaymentSettings({ ...INITIAL_PAYMENT_SETTINGS, ...(payment || {}) });
      setDeliverySettings({ ...INITIAL_DELIVERY_SETTINGS, ...(delivery || {}) });
      setContactSettings({ ...INITIAL_CONTACT_SETTINGS, ...(contact || {}) });
      setBusinessHours({ ...INITIAL_BUSINESS_HOURS, ...(hours || {}) });
      setThemeSettings({ ...INITIAL_THEME_SETTINGS, ...(theme || {}) });
      setWebsiteContent({ ...INITIAL_WEBSITE_CONTENT, ...(content || {}) });
    } catch (error) {
      console.error('Failed to load store data:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAllData();

    const handleStorageUpdate = (e: Event) => {
      const customEvent = e as CustomEvent<{ key?: string }>;
      if (customEvent.detail?.key) {
        loadAllData();
      }
    };
    window.addEventListener('Zenith_Apparel_Footwear_storage_update', handleStorageUpdate);
    window.addEventListener('storage', loadAllData);

    return () => {
      window.removeEventListener('Zenith_Apparel_Footwear_storage_update', handleStorageUpdate);
      window.removeEventListener('storage', loadAllData);
    };
  }, [loadAllData]);

  // Catalog Methods
  const refreshCatalog = async () => {
    const [prods, cats] = await Promise.all([fetchProducts(), fetchCategories()]);
    if (Array.isArray(prods) && prods.length > 0) setProducts(prods);
    if (Array.isArray(cats) && cats.length > 0) setCategories(cats);
  };

  const handleSaveProduct = async (productData: Partial<Product>) => {
    const fullProduct: Product = {
      id: productData.id || `prod_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      name: productData.name || 'Untitled Clothing Item',
      description: productData.description || '',
      category: productData.category || categories[0]?.name || 'Kashmiri Pherans & Traditional',
      subcategory: productData.subcategory || '',
      price: Number(productData.price) || 0,
      mrp: Number(productData.mrp) || Number(productData.price) || 0,
      discount: Number(productData.discount) || 0,
      stock: Number(productData.stock ?? 10),
      sku: productData.sku || `SKU-${Date.now()}`,
      sizes: productData.sizes || ['M', 'L', 'XL'],
      colors: productData.colors || ['Black'],
      tags: productData.tags || [],
      featured: Boolean(productData.featured),
      newArrival: Boolean(productData.newArrival),
      isAvailable: productData.isAvailable !== false,
      images: productData.images || [],
      createdAt: productData.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    await apiSaveProduct(cleanPayload(fullProduct));
    await refreshCatalog();
  };

  const handleDeleteProduct = async (id: string) => {
    await apiDeleteProduct(id);
    await refreshCatalog();
  };

  const handleSaveCategory = async (categoryData: Partial<Category>) => {
    const fullCategory: Category = {
      id: categoryData.id || `cat_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      name: categoryData.name || 'New Category',
      slug: categoryData.slug || (categoryData.name ? categoryData.name.toLowerCase().replace(/\s+/g, '-') : `cat-${Date.now()}`),
      description: categoryData.description || '',
      image: categoryData.image || '',
      order: categoryData.order ?? (categories.length + 1),
      isActive: categoryData.isActive !== false,
    };
    await apiSaveCategory(cleanPayload(fullCategory));
    await refreshCatalog();
  };

  const handleDeleteCategory = async (id: string) => {
    await apiDeleteCategory(id);
    await refreshCatalog();
  };

  // Cart Methods
  const addToCart = (product: Product, quantity = 1, size?: string, color?: string) => {
    if (product.stock <= 0) {
      return { success: false, message: 'Sorry, this product is currently out of stock.' };
    }

    const existingIndex = cart.findIndex(
      item => item.product.id === product.id &&
              item.selectedSize === size &&
              item.selectedColor === color
    );

    const currentQtyInCart = existingIndex >= 0 ? cart[existingIndex].quantity : 0;
    if (currentQtyInCart + quantity > product.stock) {
      return { 
        success: false, 
        message: `Only ${product.stock} units available in stock. You already have ${currentQtyInCart} in your cart.` 
      };
    }

    if (existingIndex >= 0) {
      const updated = [...cart];
      updated[existingIndex].quantity += quantity;
      setCart(updated);
    } else {
      setCart([...cart, { product, quantity, selectedSize: size, selectedColor: color }]);
    }

    return { success: true };
  };

  const removeFromCart = (index: number) => {
    setCart(cart.filter((_, i) => i !== index));
  };

  const updateCartQuantity = (index: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(index);
      return;
    }
    const item = cart[index];
    if (item && quantity > item.product.stock) {
      quantity = item.product.stock;
    }
    const updated = [...cart];
    updated[index].quantity = quantity;
    setCart(updated);
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartSubtotal = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);

  const deliveryCharge = cart.length === 0 ? 0 : (
    (deliverySettings?.freeDeliveryThreshold ?? 0) > 0 && cartSubtotal >= (deliverySettings?.freeDeliveryThreshold ?? 0)
      ? 0
      : (deliverySettings?.deliveryCharge ?? 0)
  );

  const cartGrandTotal = cartSubtotal + deliveryCharge;

  const isCodEligible = (distanceKm?: number): boolean => {
    if (!paymentSettings?.codEnabled) return false;
    if (distanceKm === undefined || distanceKm === null) {
      return true;
    }
    return distanceKm <= (deliverySettings?.codRadiusKm ?? 10);
  };

  const placeOrder = async (orderData: Omit<Order, 'id' | 'orderNumber' | 'createdAt' | 'updatedAt'>): Promise<Order> => {
    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const randomSuffix = Math.random().toString(36).substring(2, 6).toUpperCase();
    const orderNumber = `PION-${dateStr}-${randomSuffix}`;
    const now = new Date().toISOString();

    const newOrder: Order = {
      ...orderData,
      id: `ord_${Date.now()}_${randomSuffix}`,
      orderNumber,
      createdAt: now,
      updatedAt: now,
    };

    await apiCreateOrder(cleanPayload(newOrder));

    for (const item of newOrder.items) {
      const product = products.find(p => p.id === item.productId);
      if (product) {
        const newStock = Math.max(0, product.stock - item.quantity);
        await apiSaveProduct(cleanPayload({
          ...product,
          stock: newStock,
          isAvailable: newStock > 0,
          updatedAt: now,
        }));
      }
    }

    await Promise.all([refreshOrders(), refreshCatalog()]);
    clearCart();

    return newOrder;
  };

  const refreshOrders = async () => {
    const ords = await fetchOrders();
    if (Array.isArray(ords)) setOrders(ords);
  };

  const updateOrderStatus = async (orderId: string, status: OrderStatus, internalNotes?: string) => {
    await apiUpdateOrderStatus(orderId, status, internalNotes);
    await refreshOrders();
  };

  const deleteOrder = async (orderId: string) => {
    await apiDeleteOrder(orderId);
    await refreshOrders();
  };

  // Safe Settings Updaters using cleanPayload
  const updateSiteSettings = async (data: Partial<SiteSettings>) => {
    const updated = { ...siteSettings, ...data };
    setSiteSettings(updated);
    await apiSaveSettings('site', cleanPayload(updated));
  };

  const updatePaymentSettings = async (data: Partial<PaymentSettings>) => {
    const updated = { ...paymentSettings, ...data };
    setPaymentSettings(updated);
    await apiSaveSettings('payment', cleanPayload(updated));
  };

  const updateDeliverySettings = async (data: Partial<DeliverySettings>) => {
    const updated = { ...deliverySettings, ...data };
    setDeliverySettings(updated);
    await apiSaveSettings('delivery', cleanPayload(updated));
  };

  const updateContactSettings = async (data: Partial<ContactSettings>) => {
    const updated = { ...contactSettings, ...data };
    setContactSettings(updated);
    await apiSaveSettings('contact', cleanPayload(updated));
  };

  const updateBusinessHours = async (data: BusinessHours) => {
    const updated = { ...businessHours, ...data };
    setBusinessHours(updated);
    await apiSaveSettings('businessHours', cleanPayload(updated));
  };

  const updateThemeSettings = async (data: Partial<ThemeSettings>) => {
    const updated = { ...themeSettings, ...data };
    setThemeSettings(updated);
    await apiSaveSettings('theme', cleanPayload(updated));
  };

  const resetThemeToDefault = async () => {
    setThemeSettings(INITIAL_THEME_SETTINGS);
    await apiSaveSettings('theme', cleanPayload(INITIAL_THEME_SETTINGS));
  };

  const updateWebsiteContent = async (data: Partial<WebsiteContent>) => {
    const updated = { ...websiteContent, ...data };
    setWebsiteContent(updated);
    await apiSaveSettings('content', cleanPayload(updated));
  };

  const uploadImage = async (file: File, folder: string, onProgress?: (p: number) => void): Promise<string> => {
    return await uploadDeviceImage(file, folder, onProgress);
  };

  const getStoredPassword = (key: string, fallback: string): string => {
    try {
      return localStorage.getItem(key) || fallback;
    } catch {
      return fallback;
    }
  };

  const loginManager = (password: string): boolean => {
    const stored = getStoredPassword(LS_MGR_PASS, 'zenith123');
    if (password === stored) {
      setCurrentUserRole('manager');
      return true;
    }
    return false;
  };

  const loginDeveloper = (password: string): boolean => {
    const stored = getStoredPassword(LS_DEV_PASS, 'developer123');
    if (password === stored) {
      setCurrentUserRole('developer');
      return true;
    }
    return false;
  };

  const logout = () => {
    setCurrentUserRole('guest');
  };

  const changeManagerPassword = (oldPass: string, newPass: string) => {
    const stored = getStoredPassword(LS_MGR_PASS, 'zenith123');
    if (oldPass !== stored) {
      return { success: false, message: 'Current manager password is incorrect.' };
    }
    if (!newPass || newPass.length < 6) {
      return { success: false, message: 'New password must be at least 6 characters.' };
    }
    localStorage.setItem(LS_MGR_PASS, newPass);
    return { success: true, message: 'Manager password changed successfully.' };
  };

  const changeDeveloperPassword = (oldPass: string, newPass: string) => {
    const stored = getStoredPassword(LS_DEV_PASS, 'developer123');
    if (oldPass !== stored) {
      return { success: false, message: 'Current developer password is incorrect.' };
    }
    if (!newPass || newPass.length < 6) {
      return { success: false, message: 'New password must be at least 6 characters.' };
    }
    localStorage.setItem(LS_DEV_PASS, newPass);
    return { success: true, message: 'Developer password changed successfully.' };
  };

  return (
    <StoreContext.Provider
      value={{
        products,
        categories,
        isLoading,
        refreshCatalog,
        saveProduct: handleSaveProduct,
        deleteProduct: handleDeleteProduct,
        saveCategory: handleSaveCategory,
        deleteCategory: handleDeleteCategory,

        cart,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        cartSubtotal,
        deliveryCharge,
        cartGrandTotal,
        isCodEligible,

        orders,
        placeOrder,
        updateOrderStatus,
        deleteOrder,
        refreshOrders,

        siteSettings,
        paymentSettings,
        deliverySettings,
        contactSettings,
        businessHours,
        themeSettings,
        visualTheme: themeSettings,
        websiteContent,
        updateSiteSettings,
        updatePaymentSettings,
        updateDeliverySettings,
        updateContactSettings,
        updateBusinessHours,
        updateThemeSettings,
        updateVisualTheme: updateThemeSettings,
        updateWebsiteContent,
        resetThemeToDefault,
        resetVisualTheme: resetThemeToDefault,

        uploadImage,

        currentUserRole,
        loginManager,
        loginAsManager: loginManager,
        loginDeveloper,
        loginAsDeveloper: loginDeveloper,
        logout,
        logoutRole: logout,
        changeManagerPassword,
        changeDeveloperPassword,

        isFirebaseLive: isFirebaseConfigured,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
