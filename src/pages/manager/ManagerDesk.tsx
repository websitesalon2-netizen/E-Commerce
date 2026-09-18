import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Package, 
  ShoppingBag, 
  Boxes, 
  CreditCard, 
  Truck, 
  Phone, 
  Clock, 
  Lock, 
  LogOut, 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  CheckCircle, 
  AlertTriangle, 
  Search, 
  Save, 
  ExternalLink,
  MessageCircle,
  QrCode
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { formatINR } from '../../lib/currency';
import { ImageUploadPicker } from '../../components/common/ImageUploadPicker';
import { ConfirmationModal } from '../../components/common/ConfirmationModal';
import { Product, Order, Category, OrderStatus, PaymentStatus } from '../../types';

export const ManagerDesk: React.FC = () => {
  const { 
    currentUserRole, 
    loginAsManager, 
    logoutRole,
    products,
    categories,
    orders,
    paymentSettings,
    deliverySettings,
    contactSettings,
    businessHours,
    saveProduct,
    deleteProduct,
    saveCategory,
    deleteCategory,
    updateOrderStatus,
    deleteOrder,
    updatePaymentSettings,
    updateDeliverySettings,
    updateContactSettings,
    updateBusinessHours,
    changeManagerPassword,
    uploadImage
  } = useStore();

  // Login Form State
  const [passwordInput, setPasswordInput] = useState('');
  const [loginError, setLoginError] = useState<string | null>(null);

  // Active Tab State
  const [activeTab, setActiveTab] = useState<'dashboard' | 'products' | 'categories' | 'orders' | 'inventory' | 'payment' | 'delivery' | 'contact' | 'security'>('dashboard');

  // Product Edit / Modal State
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Partial<Product> | null>(null);
  const [productSearch, setProductSearch] = useState('');
  const [productFilterCat, setProductFilterCat] = useState('all');

  // Confirmation Modal
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {},
  });

  // Order Details Modal
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [orderFilterStatus, setOrderFilterStatus] = useState<string>('all');

  // Settings Forms State
  const [tempPayment, setTempPayment] = useState(paymentSettings);
  const [tempDelivery, setTempDelivery] = useState(deliverySettings);
  const [tempContact, setTempContact] = useState(contactSettings);
  const [tempHours, setTempHours] = useState(businessHours);
  const [settingsFeedback, setSettingsFeedback] = useState<string | null>(null);

  // Security Form State
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [passwordMsg, setPasswordMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Category Edit State
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Partial<Category> | null>(null);

  // Check login authentication
  const isAuthenticated = currentUserRole === 'manager' || currentUserRole === 'developer';

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    const success = loginAsManager(passwordInput);
    if (!success) {
      setLoginError('Invalid Manager Password. Please try again.');
    } else {
      setPasswordInput('');
    }
  };

  // KPI Calculations
  const totalStockUnits = products.reduce((acc, p) => acc + (p.stock || 0), 0);
  const lowStockCount = products.filter(p => p.stock <= 5).length;
  const newOrdersCount = orders.filter(o => o.orderStatus === 'New').length;
  const pendingPaymentOrders = orders.filter(o => o.paymentStatus.includes('Pending') || o.paymentStatus.includes('Verification')).length;
  const deliveredOrdersCount = orders.filter(o => o.orderStatus === 'Delivered').length;
  const totalRevenue = orders
    .filter(o => o.orderStatus !== 'Cancelled')
    .reduce((acc, o) => acc + o.grandTotal, 0);

  // Product CRUD
  const handleOpenAddProduct = () => {
    setEditingProduct({
      name: '',
      category: categories[0]?.name || 'Kashmiri Pherans & Traditional',
      description: '',
      price: 1999,
      mrp: 2999,
      discount: 33,
      stock: 10,
      images: [],
      sizes: ['M', 'L', 'XL'],
      colors: ['Burgundy', 'Black', 'Navy'],
      featured: false,
      newArrival: true,
      isAvailable: true,
      sku: `PION-${Math.floor(1000 + Math.random() * 9000)}`,
      tags: ['Winter', 'Kashmiri', 'Embroidery'],
    });
    setIsProductModalOpen(true);
  };

  const handleOpenEditProduct = (prod: Product) => {
    setEditingProduct({ ...prod });
    setIsProductModalOpen(true);
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct?.name || !editingProduct?.price) {
      alert('Product name and price are required.');
      return;
    }
    await saveProduct(editingProduct);
    setIsProductModalOpen(false);
    setEditingProduct(null);
  };

  const handleDeleteProduct = (productId: string, name: string) => {
    setConfirmModal({
      isOpen: true,
      title: 'Delete Product',
      message: `Are you sure you want to permanently delete "${name}" from the store catalog?`,
      onConfirm: async () => {
        await deleteProduct(productId);
        setConfirmModal(prev => ({ ...prev, isOpen: false }));
      },
    });
  };

  // Stock Quick Adjustment
  const handleAdjustStock = async (prod: Product, delta: number) => {
    const newStock = Math.max(0, prod.stock + delta);
    await saveProduct({ ...prod, stock: newStock });
  };

  // Save Settings Handlers
  const handleSavePayment = async () => {
    await updatePaymentSettings(tempPayment);
    showFeedback('Payment settings updated successfully!');
  };

  const handleSaveDelivery = async () => {
    await updateDeliverySettings(tempDelivery);
    showFeedback('Delivery & COD settings updated successfully!');
  };

  const handleSaveContact = async () => {
    await updateContactSettings(tempContact);
    showFeedback('Store contact details updated successfully!');
  };

  const handleSaveHours = async () => {
    await updateBusinessHours(tempHours);
    showFeedback('Store operating hours updated successfully!');
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordMsg(null);
    const res = changeManagerPassword(oldPassword, newPassword);
    if (res.success) {
      setPasswordMsg({ type: 'success', text: 'Manager password changed successfully!' });
      setOldPassword('');
      setNewPassword('');
    } else {
      setPasswordMsg({ type: 'error', text: res.message || 'Password update failed.' });
    }
  };

  const showFeedback = (text: string) => {
    setSettingsFeedback(text);
    setTimeout(() => setSettingsFeedback(null), 3500);
  };

  // If not logged in as manager
  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto my-16 px-4">
        <div className="bg-white rounded-3xl p-8 border border-stone-200 shadow-xl space-y-6 text-center">
          <div className="w-14 h-14 rounded-2xl bg-amber-900 text-white flex items-center justify-center mx-auto shadow-md">
            <ShieldCheck className="w-8 h-8" />
          </div>

          <div>
            <h2 className="font-serif text-2xl font-bold text-stone-900">
              Manager Desk Login
            </h2>
            <p className="text-xs text-stone-500 mt-1">
              Authorized access for Pioneer Clothing House management
            </p>
          </div>

          {loginError && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700">
              {loginError}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4 text-left">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Manager Access Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  required
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  placeholder="Enter manager password..."
                  className="w-full px-4 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-sm text-stone-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-700"
                />
              </div>
              <p className="text-[11px] text-stone-400 mt-1">
                Default: <code className="bg-stone-100 px-1 py-0.5 rounded text-stone-700 font-mono">pioneer123</code>
              </p>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-stone-900 hover:bg-amber-900 text-white rounded-xl text-sm font-semibold shadow-md transition cursor-pointer"
            >
              Sign In to Manager Desk
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Filtered lists
  const filteredProducts = products.filter(p => {
    if (productFilterCat !== 'all' && p.category !== productFilterCat) return false;
    if (productSearch.trim()) {
      const q = productSearch.toLowerCase();
      return p.name.toLowerCase().includes(q) || p.sku?.toLowerCase().includes(q);
    }
    return true;
  });

  const filteredOrders = orders.filter(o => {
    if (orderFilterStatus !== 'all' && o.orderStatus !== orderFilterStatus) return false;
    return true;
  });

  return (
    <div id="manager-desk-container" className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-stone-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 text-[11px] font-bold uppercase tracking-wider">
              Management Portal
            </span>
            <span className="text-xs text-stone-500">Pulwama Circular Road</span>
          </div>
          <h1 className="font-serif text-3xl font-bold text-stone-900 mt-1">
            Store Manager Desk
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={logoutRole}
            className="inline-flex items-center gap-1.5 px-4 py-2 border border-stone-300 text-stone-700 hover:bg-stone-50 rounded-xl text-xs font-semibold transition cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex border-b border-stone-200 overflow-x-auto gap-2 pb-1">
        {[
          { id: 'dashboard', label: 'Dashboard KPI', icon: ShieldCheck },
          { id: 'products', label: `Products (${products.length})`, icon: Package },
          { id: 'categories', label: `Categories (${categories.length})`, icon: Boxes },
          { id: 'orders', label: `Orders (${orders.length})`, icon: ShoppingBag },
          { id: 'inventory', label: 'Inventory Control', icon: Boxes },
          { id: 'payment', label: 'Payment & QR', icon: CreditCard },
          { id: 'delivery', label: 'Delivery & COD', icon: Truck },
          { id: 'contact', label: 'Contact & Hours', icon: Phone },
          { id: 'security', label: 'Security Password', icon: Lock },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                isActive
                  ? 'bg-stone-900 text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Settings Feedback Toast */}
      {settingsFeedback && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2 text-xs text-emerald-800 animate-fade-in">
          <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{settingsFeedback}</span>
        </div>
      )}

      {/* TAB 1: DASHBOARD KPI */}
      {activeTab === 'dashboard' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 bg-white rounded-2xl border border-stone-200 shadow-2xs space-y-1">
              <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">Catalog Products</span>
              <div className="text-2xl font-bold text-stone-900">{products.length}</div>
              <span className="text-[11px] text-stone-400">{totalStockUnits} total stock units</span>
            </div>

            <div className="p-5 bg-white rounded-2xl border border-stone-200 shadow-2xs space-y-1">
              <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">New Orders</span>
              <div className="text-2xl font-bold text-amber-900">{newOrdersCount}</div>
              <span className="text-[11px] text-amber-700 font-medium">{pendingPaymentOrders} pending payment check</span>
            </div>

            <div className="p-5 bg-white rounded-2xl border border-stone-200 shadow-2xs space-y-1">
              <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">Low Stock Alert</span>
              <div className="text-2xl font-bold text-red-600">{lowStockCount}</div>
              <span className="text-[11px] text-stone-400">Products with ≤ 5 units</span>
            </div>

            <div className="p-5 bg-white rounded-2xl border border-stone-200 shadow-2xs space-y-1">
              <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">Gross Orders Value</span>
              <div className="text-2xl font-bold text-emerald-700">{formatINR(totalRevenue)}</div>
              <span className="text-[11px] text-stone-400">{deliveredOrdersCount} delivered orders</span>
            </div>
          </div>

          {/* Quick Actions Bar */}
          <div className="p-6 bg-white rounded-2xl border border-stone-200 shadow-2xs space-y-4">
            <h3 className="font-serif text-lg font-bold text-stone-900">Manager Quick Actions</h3>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={handleOpenAddProduct}
                className="px-4 py-2 bg-stone-900 hover:bg-amber-900 text-white rounded-xl text-xs font-semibold transition flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Product (Up to 5 Images)</span>
              </button>
              <button
                onClick={() => setActiveTab('orders')}
                className="px-4 py-2 bg-amber-50 hover:bg-amber-100 text-amber-900 rounded-xl text-xs font-semibold transition flex items-center gap-1.5 cursor-pointer"
              >
                <ShoppingBag className="w-4 h-4 text-amber-800" />
                <span>View Recent Customer Orders</span>
              </button>
              <button
                onClick={() => setActiveTab('payment')}
                className="px-4 py-2 border border-stone-300 hover:bg-stone-50 text-stone-800 rounded-xl text-xs font-semibold transition flex items-center gap-1.5 cursor-pointer"
              >
                <QrCode className="w-4 h-4" />
                <span>Update UPI / Upload QR Code</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: PRODUCT MANAGEMENT */}
      {activeTab === 'products' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-3 flex-1">
              <div className="relative min-w-[220px]">
                <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={productSearch}
                  onChange={(e) => setProductSearch(e.target.value)}
                  placeholder="Search products by title or SKU..."
                  className="w-full pl-9 pr-3 py-2 bg-white border border-stone-300 rounded-xl text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-700"
                />
              </div>

              <select
                value={productFilterCat}
                onChange={(e) => setProductFilterCat(e.target.value)}
                className="px-3 py-2 bg-white border border-stone-300 rounded-xl text-xs font-medium text-stone-800 focus:outline-none cursor-pointer"
              >
                <option value="all">All Categories</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.name}>{c.name}</option>
                ))}
              </select>
            </div>

            <button
              onClick={handleOpenAddProduct}
              className="px-4 py-2 bg-stone-900 hover:bg-amber-900 text-white rounded-xl text-xs font-semibold shadow-xs transition flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Clothing Product</span>
            </button>
          </div>

          {/* Products Table */}
          <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-2xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-stone-600 divide-y divide-stone-200">
                <thead className="bg-stone-50 text-[11px] font-bold uppercase tracking-wider text-stone-500">
                  <tr>
                    <th className="px-4 py-3">Product</th>
                    <th className="px-4 py-3">Category</th>
                    <th className="px-4 py-3">Price (INR)</th>
                    <th className="px-4 py-3">Stock</th>
                    <th className="px-4 py-3">Badges</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {filteredProducts.map((prod) => (
                    <tr key={prod.id} className="hover:bg-stone-50/80 transition">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <img
                            src={prod.images?.[0] || 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=100&q=80'}
                            alt={prod.name}
                            className="w-10 h-12 object-cover rounded-md bg-stone-100 shrink-0 border border-stone-200"
                          />
                          <div>
                            <span className="font-semibold text-stone-900 block max-w-xs truncate">
                              {prod.name}
                            </span>
                            <span className="text-[10px] text-stone-400">SKU: {prod.sku}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 font-medium text-stone-700">{prod.category}</td>
                      <td className="px-4 py-3">
                        <span className="font-bold text-stone-900">{formatINR(prod.price)}</span>
                        {prod.mrp > prod.price && (
                          <span className="text-[10px] text-stone-400 line-through block">
                            {formatINR(prod.mrp)}
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        {prod.stock <= 5 ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-100 text-red-700 font-bold text-[10px]">
                            {prod.stock} left (Low)
                          </span>
                        ) : (
                          <span className="font-medium text-stone-800">{prod.stock} units</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-1 flex-wrap">
                          {prod.featured && (
                            <span className="px-1.5 py-0.5 bg-amber-100 text-amber-800 rounded text-[10px] font-semibold">
                              Featured
                            </span>
                          )}
                          {prod.newArrival && (
                            <span className="px-1.5 py-0.5 bg-stone-100 text-stone-800 rounded text-[10px] font-semibold">
                              New
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleOpenEditProduct(prod)}
                            className="p-1.5 text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-lg transition cursor-pointer"
                            title="Edit Product"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(prod.id, prod.name)}
                            className="p-1.5 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition cursor-pointer"
                            title="Delete Product"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: CATEGORY MANAGEMENT */}
      {activeTab === 'categories' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-serif text-lg font-bold text-stone-900">Apparel Categories</h3>
            <button
              onClick={() => {
                setEditingCategory({
                  name: '',
                  slug: '',
                  description: '',
                  image: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=400&q=80',
                  order: categories.length + 1,
                  isActive: true,
                });
                setIsCategoryModalOpen(true);
              }}
              className="px-4 py-2 bg-stone-900 hover:bg-amber-900 text-white rounded-xl text-xs font-semibold transition flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Category</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map((cat) => (
              <div key={cat.id} className="bg-white rounded-2xl p-4 border border-stone-200 shadow-2xs flex gap-3">
                <img
                  src={cat.image || 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=200&q=80'}
                  alt={cat.name}
                  className="w-16 h-16 rounded-xl object-cover bg-stone-100 shrink-0 border border-stone-200"
                />
                <div className="flex-1 min-w-0 flex flex-col justify-between">
                  <div>
                    <h4 className="font-serif text-sm font-bold text-stone-900 truncate">{cat.name}</h4>
                    <p className="text-[11px] text-stone-500 line-clamp-1">{cat.description || 'Pioneer Clothing Category'}</p>
                  </div>
                  <div className="flex items-center justify-between text-xs pt-2 border-t border-stone-100">
                    <span className="text-[10px] text-stone-400">Order #{cat.order}</span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setEditingCategory({ ...cat });
                          setIsCategoryModalOpen(true);
                        }}
                        className="text-stone-600 hover:text-stone-900 cursor-pointer"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => deleteCategory(cat.id)}
                        className="text-stone-400 hover:text-red-600 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: ORDERS MANAGEMENT */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-stone-600">Filter Order Status:</span>
              <select
                value={orderFilterStatus}
                onChange={(e) => setOrderFilterStatus(e.target.value)}
                className="px-3 py-1.5 bg-white border border-stone-300 rounded-lg text-xs font-semibold text-stone-800 cursor-pointer"
              >
                <option value="all">All Orders ({orders.length})</option>
                <option value="New">New</option>
                <option value="Payment Verification Required">Payment Verification</option>
                <option value="Confirmed">Confirmed</option>
                <option value="Preparing">Preparing</option>
                <option value="Out for Delivery">Out for Delivery</option>
                <option value="Delivered">Delivered</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-2xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-stone-600 divide-y divide-stone-200">
                <thead className="bg-stone-50 text-[11px] font-bold uppercase tracking-wider text-stone-500">
                  <tr>
                    <th className="px-4 py-3">Order Number</th>
                    <th className="px-4 py-3">Customer</th>
                    <th className="px-4 py-3">Items</th>
                    <th className="px-4 py-3">Total (INR)</th>
                    <th className="px-4 py-3">Payment</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3 text-right">View</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {filteredOrders.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-4 py-8 text-center text-stone-400">
                        No orders currently match the filter.
                      </td>
                    </tr>
                  ) : (
                    filteredOrders.map((order) => (
                      <tr key={order.id} className="hover:bg-stone-50/80 transition">
                        <td className="px-4 py-3 font-mono font-bold text-stone-900">
                          {order.orderNumber}
                        </td>
                        <td className="px-4 py-3">
                          <span className="font-semibold text-stone-800 block">{order.customerName}</span>
                          <span className="text-[10px] text-stone-500">+91 {order.mobile}</span>
                        </td>
                        <td className="px-4 py-3">
                          <span className="font-medium text-stone-700">
                            {order.items.reduce((sum, item) => sum + item.quantity, 0)} items
                          </span>
                        </td>
                        <td className="px-4 py-3 font-bold text-amber-900">
                          {formatINR(order.grandTotal)}
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-[11px] font-semibold block">{order.paymentMethod}</span>
                          <span className="text-[10px] text-stone-500">{order.paymentStatus}</span>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                            order.orderStatus === 'Delivered'
                              ? 'bg-emerald-100 text-emerald-800'
                              : order.orderStatus === 'New'
                              ? 'bg-amber-100 text-amber-900'
                              : order.orderStatus === 'Cancelled'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-stone-100 text-stone-800'
                          }`}>
                            {order.orderStatus}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <button
                            onClick={() => setSelectedOrder(order)}
                            className="px-2.5 py-1 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-md font-semibold text-[11px] transition cursor-pointer"
                          >
                            Details
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: INVENTORY & STOCK QUICK CONTROLS */}
      {activeTab === 'inventory' && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-2xs space-y-4">
            <h3 className="font-serif text-lg font-bold text-stone-900">
              Quick Stock Adjustment & Thresholds
            </h3>
            <p className="text-xs text-stone-600">
              Instantly increment or decrement inventory units as shipments arrive at Circular Road, Pulwama.
            </p>

            <div className="divide-y divide-stone-100">
              {products.map((prod) => (
                <div key={prod.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-3">
                    <img
                      src={prod.images?.[0] || 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=100&q=80'}
                      alt={prod.name}
                      className="w-10 h-12 object-cover rounded-md shrink-0 border"
                    />
                    <div>
                      <span className="font-bold text-stone-900 block">{prod.name}</span>
                      <span className="text-[10px] text-stone-500">Category: {prod.category} • SKU: {prod.sku}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <span className={`font-bold text-sm ${prod.stock <= 5 ? 'text-red-600' : 'text-stone-900'}`}>
                        {prod.stock} units
                      </span>
                      {prod.stock <= 5 && <span className="text-[10px] text-red-500 block font-semibold">Low Stock</span>}
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleAdjustStock(prod, -5)}
                        disabled={prod.stock <= 0}
                        className="px-2 py-1 bg-stone-100 hover:bg-stone-200 rounded text-stone-700 font-bold disabled:opacity-30 cursor-pointer"
                      >
                        -5
                      </button>
                      <button
                        onClick={() => handleAdjustStock(prod, -1)}
                        disabled={prod.stock <= 0}
                        className="px-2 py-1 bg-stone-100 hover:bg-stone-200 rounded text-stone-700 font-bold disabled:opacity-30 cursor-pointer"
                      >
                        -1
                      </button>
                      <button
                        onClick={() => handleAdjustStock(prod, 1)}
                        className="px-2 py-1 bg-stone-100 hover:bg-stone-200 rounded text-stone-700 font-bold cursor-pointer"
                      >
                        +1
                      </button>
                      <button
                        onClick={() => handleAdjustStock(prod, 5)}
                        className="px-2 py-1 bg-stone-100 hover:bg-stone-200 rounded text-stone-700 font-bold cursor-pointer"
                      >
                        +5
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 6: PAYMENT SETTINGS & DIRECT QR UPLOAD */}
      {activeTab === 'payment' && (
        <div className="max-w-2xl bg-white rounded-2xl p-6 sm:p-8 border border-stone-200 shadow-2xs space-y-6">
          <div className="pb-4 border-b border-stone-100">
            <h3 className="font-serif text-xl font-bold text-stone-900">
              Payment Configuration & Store QR Code
            </h3>
            <p className="text-xs text-stone-500 mt-1">
              Configure UPI payment identity and upload high-resolution QR codes directly from your smartphone or PC.
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Store UPI ID (VPA) <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={tempPayment.upiId}
                onChange={(e) => setTempPayment({ ...tempPayment, upiId: e.target.value })}
                placeholder="pioneerclothing@upi"
                className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs text-stone-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-700"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                UPI Payee Display Name
              </label>
              <input
                type="text"
                value={tempPayment.upiDisplayName}
                onChange={(e) => setTempPayment({ ...tempPayment, upiDisplayName: e.target.value })}
                placeholder="Pioneer Clothing House"
                className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs text-stone-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-700"
              />
            </div>

            {/* Direct Device Upload for Store QR Code */}
            <div className="pt-2 border-t border-stone-100">
              <ImageUploadPicker
                label="Store UPI QR Code Image"
                helperText="Upload official QR code image (GPay, PhonePe, Paytm, BHIM). Max 2 MB."
                maxImages={1}
                folder="payment"
                currentImages={tempPayment.qrCodeUrl ? [tempPayment.qrCodeUrl] : []}
                onChange={(imgs) => setTempPayment({ ...tempPayment, qrCodeUrl: imgs[0] || '' })}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Customer Payment Instructions
              </label>
              <textarea
                rows={3}
                value={tempPayment.upiInstructions}
                onChange={(e) => setTempPayment({ ...tempPayment, upiInstructions: e.target.value })}
                placeholder="Instructions shown to customers during UPI checkout..."
                className="w-full px-3.5 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs text-stone-900"
              />
            </div>

            <div>
              <label className="flex items-center gap-2 text-xs font-semibold text-stone-800 cursor-pointer">
                <input
                  type="checkbox"
                  checked={tempPayment.codEnabled}
                  onChange={(e) => setTempPayment({ ...tempPayment, codEnabled: e.target.checked })}
                  className="rounded text-amber-800"
                />
                <span>Enable Cash on Delivery (subject to Pulwama delivery radius)</span>
              </label>
            </div>

            <button
              onClick={handleSavePayment}
              className="px-6 py-2.5 bg-stone-900 hover:bg-amber-900 text-white rounded-xl text-xs font-semibold shadow-xs transition flex items-center gap-2 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Save Payment Settings</span>
            </button>
          </div>
        </div>
      )}

      {/* TAB 7: DELIVERY SETTINGS & COD RADIUS */}
      {activeTab === 'delivery' && (
        <div className="max-w-2xl bg-white rounded-2xl p-6 sm:p-8 border border-stone-200 shadow-2xs space-y-6">
          <div className="pb-4 border-b border-stone-100">
            <h3 className="font-serif text-xl font-bold text-stone-900">
              Delivery Rates, Free Delivery & COD Radius
            </h3>
            <p className="text-xs text-stone-500 mt-1">
              Configure online order availability, delivery thresholds, and Cash on Delivery distance constraints from Pulwama.
            </p>
          </div>

          <div className="space-y-4">
            <div className="p-4 bg-stone-50 rounded-xl border border-stone-200">
              <label className="flex items-center justify-between text-xs font-bold text-stone-900 cursor-pointer">
                <span>Online Store Orders Status</span>
                <input
                  type="checkbox"
                  checked={tempDelivery.onlineOrdersOpen}
                  onChange={(e) => setTempDelivery({ ...tempDelivery, onlineOrdersOpen: e.target.checked })}
                  className="w-5 h-5 rounded text-amber-800 accent-amber-800"
                />
              </label>
              <p className="text-[11px] text-stone-500 mt-1">
                Toggle to instantly open or close incoming online orders (e.g. during heavy snowfall or inventory audits).
              </p>
            </div>

            {!tempDelivery.onlineOrdersOpen && (
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Message Shown to Customers When Closed
                </label>
                <input
                  type="text"
                  value={tempDelivery.orderClosedMessage}
                  onChange={(e) => setTempDelivery({ ...tempDelivery, orderClosedMessage: e.target.value })}
                  placeholder="Online orders are currently closed..."
                  className="w-full px-3.5 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs text-stone-900"
                />
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Standard Delivery Fee (INR ₹)
                </label>
                <input
                  type="number"
                  min="0"
                  value={tempDelivery.deliveryCharge}
                  onChange={(e) => setTempDelivery({ ...tempDelivery, deliveryCharge: Number(e.target.value) })}
                  className="w-full px-3.5 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs text-stone-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Free Delivery Threshold (INR ₹)
                </label>
                <input
                  type="number"
                  min="0"
                  value={tempDelivery.freeDeliveryThreshold}
                  onChange={(e) => setTempDelivery({ ...tempDelivery, freeDeliveryThreshold: Number(e.target.value) })}
                  className="w-full px-3.5 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs text-stone-900"
                />
              </div>
            </div>

            {/* COD Radius Section */}
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Cash on Delivery (COD) Radius from Store (km)
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  min="0"
                  max="50"
                  value={tempDelivery.codRadiusKm}
                  onChange={(e) => setTempDelivery({ ...tempDelivery, codRadiusKm: Number(e.target.value) })}
                  className="w-32 px-3.5 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs text-stone-900"
                />
                <span className="text-xs text-stone-500">
                  Customers beyond {tempDelivery.codRadiusKm} km from Pulwama Circular Road cannot select COD.
                </span>
              </div>
            </div>

            <button
              onClick={handleSaveDelivery}
              className="px-6 py-2.5 bg-stone-900 hover:bg-amber-900 text-white rounded-xl text-xs font-semibold shadow-xs transition flex items-center gap-2 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Save Delivery Settings</span>
            </button>
          </div>
        </div>
      )}

      {/* TAB 8: CONTACT DETAILS & OPERATING HOURS */}
      {activeTab === 'contact' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-stone-200 shadow-2xs space-y-4">
            <h3 className="font-serif text-lg font-bold text-stone-900">Store Contact Information</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Calling Phone Number</label>
                <input
                  type="text"
                  value={tempContact.phone}
                  onChange={(e) => setTempContact({ ...tempContact, phone: e.target.value })}
                  className="w-full px-3.5 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs text-stone-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Store WhatsApp Number</label>
                <input
                  type="text"
                  value={tempContact.whatsapp}
                  onChange={(e) => setTempContact({ ...tempContact, whatsapp: e.target.value })}
                  className="w-full px-3.5 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs text-stone-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Store Physical Address</label>
                <input
                  type="text"
                  value={tempContact.address}
                  onChange={(e) => setTempContact({ ...tempContact, address: e.target.value })}
                  className="w-full px-3.5 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs text-stone-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">PIN Code</label>
                <input
                  type="text"
                  value={tempContact.pinCode}
                  onChange={(e) => setTempContact({ ...tempContact, pinCode: e.target.value })}
                  className="w-full px-3.5 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs text-stone-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Google Maps Directions Link</label>
                <input
                  type="text"
                  value={tempContact.googleMapsUrl}
                  onChange={(e) => setTempContact({ ...tempContact, googleMapsUrl: e.target.value })}
                  className="w-full px-3.5 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs text-stone-900"
                />
              </div>

              <button
                onClick={handleSaveContact}
                className="px-6 py-2.5 bg-stone-900 hover:bg-amber-900 text-white rounded-xl text-xs font-semibold transition flex items-center gap-2 cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>Save Contact Details</span>
              </button>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-stone-200 shadow-2xs space-y-4">
            <h3 className="font-serif text-lg font-bold text-stone-900">7-Day Operating Hours</h3>
            <div className="space-y-2 text-xs">
              {(['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'] as const).map((day) => (
                <div key={day} className="flex items-center justify-between py-1.5 border-b border-stone-100">
                  <span className="capitalize font-semibold text-stone-800 w-24">{day}</span>
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={tempHours[day].open}
                      onChange={(e) => setTempHours({
                        ...tempHours,
                        [day]: { ...tempHours[day], open: e.target.checked }
                      })}
                      className="rounded text-amber-800"
                    />
                    <span>{tempHours[day].open ? 'Open' : 'Closed'}</span>
                  </label>
                  {tempHours[day].open ? (
                    <div className="flex items-center gap-1">
                      <input
                        type="text"
                        value={tempHours[day].openingTime}
                        onChange={(e) => setTempHours({
                          ...tempHours,
                          [day]: { ...tempHours[day], openingTime: e.target.value }
                        })}
                        className="w-20 px-2 py-1 bg-stone-50 border rounded text-[11px]"
                      />
                      <span>to</span>
                      <input
                        type="text"
                        value={tempHours[day].closingTime}
                        onChange={(e) => setTempHours({
                          ...tempHours,
                          [day]: { ...tempHours[day], closingTime: e.target.value }
                        })}
                        className="w-20 px-2 py-1 bg-stone-50 border rounded text-[11px]"
                      />
                    </div>
                  ) : (
                    <span className="text-stone-400">Closed for business</span>
                  )}
                </div>
              ))}

              <div className="pt-2">
                <button
                  onClick={handleSaveHours}
                  className="px-6 py-2.5 bg-stone-900 hover:bg-amber-900 text-white rounded-xl text-xs font-semibold transition flex items-center gap-2 cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Operating Hours</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 9: SECURITY & PASSWORD CHANGE */}
      {activeTab === 'security' && (
        <div className="max-w-md bg-white rounded-2xl p-6 sm:p-8 border border-stone-200 shadow-2xs space-y-6">
          <div className="pb-4 border-b border-stone-100">
            <h3 className="font-serif text-lg font-bold text-stone-900">Change Manager Password</h3>
            <p className="text-xs text-stone-500 mt-1">
              Update the management password to protect store operations.
            </p>
          </div>

          {passwordMsg && (
            <div className={`p-3 rounded-xl text-xs border ${
              passwordMsg.type === 'success' 
                ? 'bg-emerald-50 text-emerald-800 border-emerald-200' 
                : 'bg-red-50 text-red-800 border-red-200'
            }`}>
              {passwordMsg.text}
            </div>
          )}

          <form onSubmit={handleChangePassword} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Current Password</label>
              <input
                type="password"
                required
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs text-stone-900 focus:bg-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">New Password</label>
              <input
                type="password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs text-stone-900 focus:bg-white focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-stone-900 hover:bg-amber-900 text-white rounded-xl text-xs font-semibold transition cursor-pointer"
            >
              Update Password
            </button>
          </form>
        </div>
      )}

      {/* MODAL: ADD / EDIT PRODUCT */}
      {isProductModalOpen && editingProduct && (
        <div className="fixed inset-0 z-50 bg-stone-950/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl p-6 sm:p-8 my-auto max-h-[90vh] overflow-y-auto space-y-6">
            <div className="flex justify-between items-center pb-4 border-b border-stone-100">
              <h3 className="font-serif text-xl font-bold text-stone-900">
                {editingProduct.id ? 'Edit Clothing Product' : 'Add New Clothing Product'}
              </h3>
              <button
                onClick={() => setIsProductModalOpen(false)}
                className="text-stone-400 hover:text-stone-700 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-5 text-xs">
              {/* Product Images (Native Device Upload Picker up to 5 images, max 2MB) */}
              <div className="p-4 bg-stone-50 rounded-xl border border-stone-200">
                <ImageUploadPicker
                  label="Product Photographs (Max 5)"
                  helperText="Upload up to 5 images from Android, iPhone or PC. Max 2 MB per image."
                  maxImages={5}
                  folder="products"
                  currentImages={editingProduct.images || []}
                  onChange={(imgs) => setEditingProduct({ ...editingProduct, images: imgs })}
                />
              </div>

              {/* Title & Category */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Product Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={editingProduct.name || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                    placeholder="e.g. Royal Kashmiri Woolen Pheran with Tilla Work"
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Category</label>
                  <select
                    value={editingProduct.category || categories[0]?.name}
                    onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value })}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg cursor-pointer"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.name}>{c.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Pricing & Stock */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Price (INR ₹) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={editingProduct.price || 0}
                    onChange={(e) => {
                      const price = Number(e.target.value);
                      const mrp = editingProduct.mrp || price;
                      const discount = mrp > price ? Math.round(((mrp - price) / mrp) * 100) : 0;
                      setEditingProduct({ ...editingProduct, price, discount });
                    }}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg font-bold"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">MRP (INR ₹)</label>
                  <input
                    type="number"
                    min="1"
                    value={editingProduct.mrp || 0}
                    onChange={(e) => {
                      const mrp = Number(e.target.value);
                      const price = editingProduct.price || mrp;
                      const discount = mrp > price ? Math.round(((mrp - price) / mrp) * 100) : 0;
                      setEditingProduct({ ...editingProduct, mrp, discount });
                    }}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Discount %</label>
                  <input
                    type="number"
                    readOnly
                    value={editingProduct.discount || 0}
                    className="w-full px-3 py-2 bg-stone-100 border border-stone-300 rounded-lg text-stone-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Stock Quantity <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={editingProduct.stock ?? 10}
                    onChange={(e) => setEditingProduct({ ...editingProduct, stock: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg font-bold"
                  />
                </div>
              </div>

              {/* SKU & Description */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">SKU Code</label>
                  <input
                    type="text"
                    value={editingProduct.sku || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, sku: e.target.value })}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg font-mono"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-semibold text-stone-700 mb-1">Sizes (comma separated)</label>
                  <input
                    type="text"
                    value={editingProduct.sizes?.join(', ') || ''}
                    onChange={(e) => setEditingProduct({
                      ...editingProduct,
                      sizes: e.target.value.split(',').map(s => s.trim()).filter(Boolean)
                    })}
                    placeholder="S, M, L, XL, XXL, Free Size"
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Colors (comma separated)</label>
                <input
                  type="text"
                  value={editingProduct.colors?.join(', ') || ''}
                  onChange={(e) => setEditingProduct({
                    ...editingProduct,
                    colors: e.target.value.split(',').map(c => c.trim()).filter(Boolean)
                  })}
                  placeholder="Black, Burgundy, Walnut, Navy, Emerald"
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Product Description</label>
                <textarea
                  rows={3}
                  value={editingProduct.description || ''}
                  onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                  placeholder="Describe material, embroidery, fit, and origin..."
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg"
                />
              </div>

              {/* Flags */}
              <div className="flex flex-wrap gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer font-semibold">
                  <input
                    type="checkbox"
                    checked={editingProduct.featured || false}
                    onChange={(e) => setEditingProduct({ ...editingProduct, featured: e.target.checked })}
                    className="rounded text-amber-800"
                  />
                  <span>Featured Product</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer font-semibold">
                  <input
                    type="checkbox"
                    checked={editingProduct.newArrival || false}
                    onChange={(e) => setEditingProduct({ ...editingProduct, newArrival: e.target.checked })}
                    className="rounded text-amber-800"
                  />
                  <span>New Arrival Badge</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer font-semibold">
                  <input
                    type="checkbox"
                    checked={editingProduct.isAvailable !== false}
                    onChange={(e) => setEditingProduct({ ...editingProduct, isAvailable: e.target.checked })}
                    className="rounded text-amber-800"
                  />
                  <span>Show in Storefront</span>
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  className="px-4 py-2 border rounded-lg text-stone-700 hover:bg-stone-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-stone-900 hover:bg-amber-900 text-white rounded-lg font-semibold cursor-pointer"
                >
                  Save Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ORDER DETAILS */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-stone-950/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl p-6 sm:p-8 my-auto space-y-6">
            <div className="flex justify-between items-center pb-4 border-b border-stone-100">
              <div>
                <h3 className="font-serif text-xl font-bold text-stone-900">
                  Order Details: {selectedOrder.orderNumber}
                </h3>
                <span className="text-xs text-stone-500">
                  Placed on {new Date(selectedOrder.createdAt).toLocaleString('en-IN')}
                </span>
              </div>
              <button onClick={() => setSelectedOrder(null)} className="text-stone-400 hover:text-stone-700 cursor-pointer">
                ✕
              </button>
            </div>

            {/* Customer & Address */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-3 bg-stone-50 rounded-xl border space-y-1">
                <span className="font-bold text-stone-900 block">Customer Information</span>
                <p><strong>Name:</strong> {selectedOrder.customerName}</p>
                <p><strong>Phone:</strong> +91 {selectedOrder.mobile}</p>
                <p><strong>WhatsApp:</strong> +91 {selectedOrder.whatsapp}</p>
                <p><strong>City:</strong> {selectedOrder.city} ({selectedOrder.pinCode})</p>
                <p><strong>Address:</strong> {selectedOrder.address}</p>
                {selectedOrder.landmark && <p><strong>Landmark:</strong> {selectedOrder.landmark}</p>}
                {selectedOrder.deliveryInstructions && (
                  <p className="text-amber-800"><strong>Note:</strong> {selectedOrder.deliveryInstructions}</p>
                )}
              </div>

              {/* Status & Actions */}
              <div className="p-3 bg-stone-50 rounded-xl border space-y-3">
                <span className="font-bold text-stone-900 block">Manage Status</span>
                
                <div>
                  <label className="block text-[10px] text-stone-500 mb-0.5">Order Status:</label>
                  <select
                    value={selectedOrder.orderStatus}
                    onChange={async (e) => {
                      const newStatus = e.target.value as OrderStatus;
                      await updateOrderStatus(selectedOrder.id, newStatus, selectedOrder.paymentStatus);
                      setSelectedOrder({ ...selectedOrder, orderStatus: newStatus });
                    }}
                    className="w-full px-2 py-1.5 bg-white border rounded text-xs font-semibold"
                  >
                    <option value="New">New</option>
                    <option value="Payment Verification Required">Payment Verification Required</option>
                    <option value="Confirmed">Confirmed</option>
                    <option value="Preparing">Preparing</option>
                    <option value="Out for Delivery">Out for Delivery</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] text-stone-500 mb-0.5">Payment Status:</label>
                  <select
                    value={selectedOrder.paymentStatus}
                    onChange={async (e) => {
                      const newPaymentStatus = e.target.value as PaymentStatus;
                      await updateOrderStatus(selectedOrder.id, selectedOrder.orderStatus, newPaymentStatus);
                      setSelectedOrder({ ...selectedOrder, paymentStatus: newPaymentStatus });
                    }}
                    className="w-full px-2 py-1.5 bg-white border rounded text-xs font-semibold"
                  >
                    <option value="Payment Verification Required">Payment Verification Required</option>
                    <option value="Paid via UPI">Paid via UPI</option>
                    <option value="COD - Pay on Delivery">COD - Pay on Delivery</option>
                    <option value="Payment Received">Payment Received</option>
                    <option value="Refunded">Refunded</option>
                  </select>
                </div>

                <a
                  href={`https://wa.me/91${(selectedOrder.whatsapp || selectedOrder.mobile || '').replace(/\D/g, '')}?text=${encodeURIComponent(`Hello ${selectedOrder.customerName}, this is Pioneer Clothing House, Pulwama regarding your order ${selectedOrder.orderNumber}.`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-center font-semibold text-xs flex items-center justify-center gap-1.5"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>Chat with Customer on WhatsApp</span>
                </a>
              </div>
            </div>

            {/* Items */}
            <div className="space-y-2 text-xs border rounded-xl p-3 bg-stone-50/50">
              <span className="font-bold text-stone-900 block">Ordered Items Snapshot</span>
              {selectedOrder.items.map((item, idx) => (
                <div key={idx} className="flex justify-between py-1 border-b border-stone-100 last:border-0">
                  <div>
                    <span className="font-semibold text-stone-900">{item.productName}</span>
                    <span className="text-[10px] text-stone-500 block">
                      {item.selectedSize && `Size: ${item.selectedSize} `}
                      Qty: {item.quantity} × {formatINR(item.unitPrice)}
                    </span>
                  </div>
                  <span className="font-bold text-stone-900">{formatINR(item.productTotal)}</span>
                </div>
              ))}
              <div className="pt-2 flex justify-between font-bold text-sm text-stone-900 border-t">
                <span>Grand Total:</span>
                <span className="text-amber-900">{formatINR(selectedOrder.grandTotal)}</span>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => setSelectedOrder(null)}
                className="px-4 py-2 bg-stone-900 text-white rounded-lg text-xs font-semibold cursor-pointer"
              >
                Close Details
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={confirmModal.isOpen}
        title={confirmModal.title}
        message={confirmModal.message}
        onConfirm={confirmModal.onConfirm}
        onCancel={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))}
      />

    </div>
  );
};
