import { initializeApp, getApps, getApp } from "firebase/app";
import { 
  getFirestore, 
  collection, 
  getDocs, 
  doc, 
  setDoc, 
  deleteDoc, 
  updateDoc 
} from "firebase/firestore";

// Your live web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBhA79wtQL8gj4SRMXlTkLAv8FR4sw0K9g",
  authDomain: "e-commerce-26f17.firebaseapp.com",
  projectId: "e-commerce-26f17",
  storageBucket: "e-commerce-26f17.firebasestorage.app",
  messagingSenderId: "368086828482",
  appId: "1:368086828482:web:a169961e0c5ddaf3d9425b",
  measurementId: "G-N5VXEQXSPF"
};

// Complete fallback settings structure matching all UI requirements
const defaultSettings = {
  storeName: "Zenith Apparel & Footwear — Shalina",
  phone: "+91-9622229622",
  whatsapp: "+91-9622229622",
  address: "Srinagar, J&K",
  currency: "INR",
  openingTime: "09:00 AM",
  closingTime: "09:00 PM",
  businessHours: "9:00 AM - 9:00 PM",
  timing: {
    openingTime: "09:00 AM",
    closingTime: "09:00 PM"
  }
};

// Check if credentials are properly configured
export const isFirebaseConfigured = () => {
  return Boolean(firebaseConfig.apiKey);
};

// Initialize Firebase & Firestore Database
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
export const db = getFirestore(app);

// Helper to fetch entire collections safely from Firestore
const fetchCollection = async (collectionName: string) => {
  try {
    const querySnapshot = await getDocs(collection(db, collectionName));
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error(`Error fetching ${collectionName}:`, error);
    return [];
  }
};

// --- PRODUCTS ---
export const fetchProducts = () => fetchCollection("products");
export const saveProduct = async (product: any) => {
  const ref = doc(db, "products", String(product.id));
  await setDoc(ref, product, { merge: true });
};
export const deleteProduct = async (id: string | number) => {
  await deleteDoc(doc(db, "products", String(id)));
};

// --- CATEGORIES ---
export const fetchCategories = () => fetchCollection("categories");
export const saveCategory = async (category: any) => {
  const ref = doc(db, "categories", String(category.id));
  await setDoc(ref, category, { merge: true });
};
export const deleteCategory = async (id: string | number) => {
  await deleteDoc(doc(db, "categories", String(id)));
};

// --- ORDERS ---
export const fetchOrders = () => fetchCollection("orders");
export const createOrder = async (order: any) => {
  const ref = doc(db, "orders", String(order.id));
  await setDoc(ref, order, { merge: true });
};
export const deleteOrder = async (id: string | number) => {
  await deleteDoc(doc(db, "orders", String(id)));
};
export const updateOrderStatus = async (id: string | number, status: string) => {
  const ref = doc(db, "orders", String(id));
  await updateDoc(ref, { status });
};

// --- SETTINGS ---
export const fetchSettings = async () => {
  try {
    const snapshot = await getDocs(collection(db, "settings"));
    if (!snapshot.empty) {
      const liveData = snapshot.docs[0].data();
      return { 
        ...defaultSettings, 
        ...liveData,
        timing: { ...defaultSettings.timing, ...(liveData.timing || {}) } 
      };
    }
  } catch (e) {
    console.error("Error fetching settings from Firestore:", e);
  }
  return defaultSettings;
};

export const saveSettings = async (settings: any) => {
  const ref = doc(db, "settings", "global");
  await setDoc(ref, settings, { merge: true });
};

// --- IMAGE UPLOAD HELPER ---
export const uploadDeviceImage = async (file: File): Promise<string> => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      resolve(reader.result as string);
    };
    reader.readAsDataURL(file);
  });
};
