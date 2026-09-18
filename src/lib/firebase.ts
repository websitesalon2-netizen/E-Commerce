import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { 
  getFirestore, 
  Firestore, 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  deleteDoc, 
  onSnapshot,
  query,
  orderBy
} from 'firebase/firestore';
import { getAuth, Auth, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { getStorage, FirebaseStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { 
  Product, 
  Category, 
  Order, 
  SiteSettings, 
  PaymentSettings, 
  DeliverySettings, 
  ContactSettings, 
  BusinessHours, 
  ThemeSettings, 
  WebsiteContent,
  OrderStatus
} from '../types';
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

// Storage keys for local persistence fallback
const LS_PRODUCTS = 'pioneer_products';
const LS_CATEGORIES = 'pioneer_categories';
const LS_ORDERS = 'pioneer_orders';
const LS_SETTINGS = 'pioneer_settings_';

// Check if valid Firebase env credentials exist
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || '',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || '',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || '',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '',
};

const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey &&
  firebaseConfig.projectId &&
  !firebaseConfig.apiKey.includes('your-api-key')
);

let app: FirebaseApp | null = null;
let db: Firestore | null = null;
let auth: Auth | null = null;
let storage: FirebaseStorage | null = null;

if (isFirebaseConfigured) {
  try {
    app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
    db = getFirestore(app);
    auth = getAuth(app);
    storage = getStorage(app);
  } catch (err) {
    console.warn('Firebase init notice: using persistent local storage fallback', err);
  }
}

export { app, db, auth, storage, isFirebaseConfigured };

/* -------------------------------------------------------------
   LOCAL PERSISTENCE HELPER METHODS
-------------------------------------------------------------- */

function getLocal<T>(key: string, fallback: T): T {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch {
    return fallback;
  }
}

function setLocal<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    // Trigger custom event for intra-window real-time updates
    window.dispatchEvent(new CustomEvent('pioneer_storage_update', { detail: { key } }));
  } catch (err) {
    console.error('Storage write error:', err);
  }
}

/* -------------------------------------------------------------
   PRODUCT OPERATIONS
-------------------------------------------------------------- */

export async function fetchProducts(): Promise<Product[]> {
  if (db && isFirebaseConfigured) {
    try {
      const snap = await getDocs(collection(db, 'products'));
      if (!snap.empty) {
        return snap.docs.map(d => ({ ...d.data(), id: d.id } as Product));
      }
    } catch (err) {
      console.warn('Firestore fetch products failed, using local store:', err);
    }
  }
  return getLocal<Product[]>(LS_PRODUCTS, INITIAL_PRODUCTS);
}

export async function saveProduct(product: Product): Promise<void> {
  // Update local store immediately for instant UI response
  const current = getLocal<Product[]>(LS_PRODUCTS, INITIAL_PRODUCTS);
  const index = current.findIndex(p => p.id === product.id);
  let updated: Product[];
  if (index >= 0) {
    updated = [...current];
    updated[index] = product;
  } else {
    updated = [product, ...current];
  }
  setLocal(LS_PRODUCTS, updated);

  // Sync to Firestore if available
  if (db && isFirebaseConfigured) {
    try {
      await setDoc(doc(db, 'products', product.id), product);
    } catch (err) {
      console.warn('Firestore save product sync error:', err);
    }
  }
}

export async function deleteProduct(productId: string): Promise<void> {
  const current = getLocal<Product[]>(LS_PRODUCTS, INITIAL_PRODUCTS);
  const updated = current.filter(p => p.id !== productId);
  setLocal(LS_PRODUCTS, updated);

  if (db && isFirebaseConfigured) {
    try {
      await deleteDoc(doc(db, 'products', productId));
    } catch (err) {
      console.warn('Firestore delete product error:', err);
    }
  }
}

/* -------------------------------------------------------------
   CATEGORY OPERATIONS
-------------------------------------------------------------- */

export async function fetchCategories(): Promise<Category[]> {
  if (db && isFirebaseConfigured) {
    try {
      const snap = await getDocs(collection(db, 'categories'));
      if (!snap.empty) {
        return snap.docs.map(d => ({ ...d.data(), id: d.id } as Category));
      }
    } catch (err) {
      console.warn('Firestore fetch categories failed, using local store:', err);
    }
  }
  return getLocal<Category[]>(LS_CATEGORIES, INITIAL_CATEGORIES);
}

export async function saveCategory(category: Category): Promise<void> {
  const current = getLocal<Category[]>(LS_CATEGORIES, INITIAL_CATEGORIES);
  const index = current.findIndex(c => c.id === category.id);
  let updated: Category[];
  if (index >= 0) {
    updated = [...current];
    updated[index] = category;
  } else {
    updated = [...current, category];
  }
  setLocal(LS_CATEGORIES, updated);

  if (db && isFirebaseConfigured) {
    try {
      await setDoc(doc(db, 'categories', category.id), category);
    } catch (err) {
      console.warn('Firestore save category error:', err);
    }
  }
}

export async function deleteCategory(categoryId: string): Promise<void> {
  const current = getLocal<Category[]>(LS_CATEGORIES, INITIAL_CATEGORIES);
  const updated = current.filter(c => c.id !== categoryId);
  setLocal(LS_CATEGORIES, updated);

  if (db && isFirebaseConfigured) {
    try {
      await deleteDoc(doc(db, 'categories', categoryId));
    } catch (err) {
      console.warn('Firestore delete category error:', err);
    }
  }
}

/* -------------------------------------------------------------
   ORDER OPERATIONS
-------------------------------------------------------------- */

export async function fetchOrders(): Promise<Order[]> {
  if (db && isFirebaseConfigured) {
    try {
      const q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
      const snap = await getDocs(q);
      if (!snap.empty) {
        return snap.docs.map(d => ({ ...d.data(), id: d.id } as Order));
      }
    } catch (err) {
      console.warn('Firestore fetch orders error, using local fallback:', err);
    }
  }
  return getLocal<Order[]>(LS_ORDERS, []);
}

export async function createOrder(order: Order): Promise<void> {
  const current = getLocal<Order[]>(LS_ORDERS, []);
  setLocal(LS_ORDERS, [order, ...current]);

  if (db && isFirebaseConfigured) {
    try {
      await setDoc(doc(db, 'orders', order.id), order);
    } catch (err) {
      console.warn('Firestore create order sync error:', err);
    }
  }
}

export async function updateOrderStatus(
  orderId: string, 
  status: OrderStatus, 
  internalNotes?: string
): Promise<void> {
  const current = getLocal<Order[]>(LS_ORDERS, []);
  const updated = current.map(o => {
    if (o.id === orderId) {
      return {
        ...o,
        orderStatus: status,
        internalNotes: internalNotes !== undefined ? internalNotes : o.internalNotes,
        updatedAt: new Date().toISOString()
      };
    }
    return o;
  });
  setLocal(LS_ORDERS, updated);

  if (db && isFirebaseConfigured) {
    try {
      const orderDoc = doc(db, 'orders', orderId);
      await setDoc(orderDoc, { 
        orderStatus: status, 
        internalNotes: internalNotes ?? '', 
        updatedAt: new Date().toISOString() 
      }, { merge: true });
    } catch (err) {
      console.warn('Firestore update order error:', err);
    }
  }
}
export async function deleteOrder(orderId: string): Promise<void> {
  // Delete from local storage
  const current = getLocal<Order[]>(LS_ORDERS, []);
  const updated = current.filter(o => o.id !== orderId);
  setLocal(LS_ORDERS, updated);

  // Delete from Firestore
  if (db && isFirebaseConfigured) {
    try {
      await deleteDoc(doc(db, 'orders', orderId));
    } catch (err) {
      console.error('Firestore delete order error:', err);
      throw err;
    }
  }
}
export async function getOrderById(orderId: string): Promise<Order | null> {
  if (db && isFirebaseConfigured) {
    try {
      const snap = await getDoc(doc(db, 'orders', orderId));
      if (snap.exists()) {
        return { ...snap.data(), id: snap.id } as Order;
      }
    } catch (err) {
      console.warn('Firestore get order error:', err);
    }
  }
  const orders = getLocal<Order[]>(LS_ORDERS, []);
  return orders.find(o => o.id === orderId || o.orderNumber === orderId) || null;
}

/* -------------------------------------------------------------
   SETTINGS OPERATIONS
-------------------------------------------------------------- */

export async function fetchSettings<T>(key: string, fallback: T): Promise<T> {
  if (db && isFirebaseConfigured) {
    try {
      const snap = await getDoc(doc(db, 'settings', key));
      if (snap.exists()) {
        return snap.data() as T;
      }
    } catch (err) {
      console.warn(`Firestore get settings (${key}) error:`, err);
    }
  }
  return getLocal<T>(LS_SETTINGS + key, fallback);
}

export async function saveSettings<T extends object>(key: string, data: T): Promise<void> {
  setLocal(LS_SETTINGS + key, data);

  if (db && isFirebaseConfigured) {
    try {
      await setDoc(doc(db, 'settings', key), {
        ...data,
        updatedAt: new Date().toISOString()
      });
    } catch (err) {
      console.warn(`Firestore save settings (${key}) error:`, err);
    }
  }
}

/* -------------------------------------------------------------
   FILE / IMAGE UPLOAD (FIREBASE STORAGE + DEVICE FALLBACK)
-------------------------------------------------------------- */

export interface UploadProgressCallback {
  (progressPercent: number): void;
}

/**
 * Uploads an image from device.
 * When Firebase Storage is available, uploads to bucket path.
 * If Storage is not configured or in offline mode, converts to high-quality Data URL (Base64)
 * so image uploads from Android, iPhone, Windows, or Mac work seamlessly with zero failure!
 */
export async function uploadDeviceImage(
  file: File, 
  storagePath: string,
  onProgress?: UploadProgressCallback
): Promise<string> {
  // Validate file size: max 2MB
  if (file.size > 2 * 1024 * 1024) {
    throw new Error('Each image must be 2 MB or smaller.');
  }

  // Validate format
  const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  if (!validTypes.includes(file.type.toLowerCase())) {
    throw new Error('Supported image formats: JPG, JPEG, PNG, WEBP.');
  }

  // Simulate progress indicator for responsive UI feedback
  if (onProgress) {
    onProgress(25);
  }

  if (storage && isFirebaseConfigured) {
    try {
      const storageRef = ref(storage, `${storagePath}/${Date.now()}_${file.name.replace(/\s+/g, '_')}`);
      const uploadTask = uploadBytesResumable(storageRef, file);

      return new Promise((resolve, reject) => {
        uploadTask.on(
          'state_changed',
          (snapshot) => {
            const percent = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
            if (onProgress) onProgress(percent);
          },
          (err) => {
            console.warn('Firebase storage upload failed, converting to local image:', err);
            // Fallback to data URL on bucket permission error
            readAsDataURL(file).then(resolve).catch(reject);
          },
          async () => {
            const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
            if (onProgress) onProgress(100);
            resolve(downloadUrl);
          }
        );
      });
    } catch (err) {
      console.warn('Storage ref error, fallback to data URL:', err);
    }
  }

  // Fallback: Read file as Data URL (works without cloud storage credentials)
  if (onProgress) onProgress(60);
  const dataUrl = await readAsDataURL(file);
  if (onProgress) onProgress(100);
  return dataUrl;
}

function readAsDataURL(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error('Failed to read image file from device.'));
    reader.readAsDataURL(file);
  });
}
