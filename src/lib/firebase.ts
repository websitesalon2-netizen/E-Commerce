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

const firebaseConfig = {
  apiKey: "AIzaSyBhA79wtQL8gj4SRMXlTkLAv8FR4sw0K9g",
  authDomain: "e-commerce-26f17.firebaseapp.com",
  projectId: "e-commerce-26f17",
  storageBucket: "e-commerce-26f17.firebasestorage.app",
  messagingSenderId: "368086828482",
  appId: "1:368086828482:web:a169961e0c5ddaf3d9425b",
  measurementId: "G-N5VXEQXSPF"
};

export const defaultSettings = {
  storeName: "Zenith Apparel & Footwear — Shalina",
  phone: "+91-9622229622",
  whatsapp: "+91-9622229622",
  address: "Srinagar, J&K",
  currency: "INR",
  openingTime: "09:00 AM",
  closingTime: "10:00 PM",
  businessHours: "9:00 AM - 10:00 PM",
  hours: {
    openingTime: "09:00 AM",
    closingTime: "10:00 PM"
  },
  timing: {
    openingTime: "09:00 AM",
    closingTime: "10:00 PM"
  }
};

export const isFirebaseConfigured = () => Boolean(firebaseConfig.apiKey);

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
export const db = getFirestore(app);

// Helper to sanitize payload and remove undefined values before saving to Firestore
const cleanPayload = (data: any) => {
  if (!data || typeof data !== "object") return {};
  return JSON.parse(JSON.stringify(data));
};

const fetchCollection = async (collectionName: string) => {
  try {
    const querySnapshot = await getDocs(collection(db, collectionName));
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error(`Error fetching ${collectionName}:`, error);
    return [];
  }
};

export const fetchProducts = () => fetchCollection("products");
export const saveProduct = async (product: any) => {
  const ref = doc(db, "products", String(product.id));
  await setDoc(ref, cleanPayload(product), { merge: true });
};
export const deleteProduct = async (id: string | number) => {
  await deleteDoc(doc(db, "products", String(id)));
};

export const fetchCategories = () => fetchCollection("categories");
export const saveCategory = async (category: any) => {
  const ref = doc(db, "categories", String(category.id));
  await setDoc(ref, cleanPayload(category), { merge: true });
};
export const deleteCategory = async (id: string | number) => {
  await deleteDoc(doc(db, "categories", String(id)));
};

export const fetchOrders = () => fetchCollection("orders");
export const createOrder = async (order: any) => {
  const ref = doc(db, "orders", String(order.id));
  await setDoc(ref, cleanPayload(order), { merge: true });
};
export const deleteOrder = async (id: string | number) => {
  await deleteDoc(doc(db, "orders", String(id)));
};
export const updateOrderStatus = async (id: string | number, status: string) => {
  const ref = doc(db, "orders", String(id));
  await updateDoc(ref, { status });
};

export const fetchSettings = async () => {
  try {
    const snapshot = await getDocs(collection(db, "settings"));
    if (!snapshot.empty) {
      const data = snapshot.docs[0].data();
      return {
        ...defaultSettings,
        ...data,
        hours: { ...defaultSettings.hours, ...(data.hours || {}) },
        timing: { ...defaultSettings.timing, ...(data.timing || {}) }
      };
    }
  } catch (e) {
    console.error("Error fetching settings:", e);
  }
  return defaultSettings;
};

// Generic save document function using setDoc with merge to avoid 'document missing' rejections
export const saveSettingsDoc = async (documentId: string, settings: any) => {
  const ref = doc(db, "settings", documentId);
  await setDoc(ref, cleanPayload(settings), { merge: true });
};

export const saveSettings = async (settings: any) => {
  await saveSettingsDoc("global", settings);
};

export const uploadDeviceImage = async (file: File): Promise<string> => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      resolve(reader.result as string);
    };
    reader.readAsDataURL(file);
  });
};
