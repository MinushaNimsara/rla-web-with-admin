import {
  collection,
  doc,
  addDoc,
  getDocs,
  getDoc,
  updateDoc,
  setDoc,
  deleteDoc,
  query,
  orderBy,
  limit,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from './firebase';

// Collection names (use these in Firebase Console)
export const COLLECTIONS = {
  PRODUCTS: 'products',
  HERO_CAROUSEL: 'heroCarousel',
  BRANDS_TAPE: 'brandsTape',
  CSR: 'csr',
  NEWSLINE: 'newsline',
  FACTORY: 'factory',
  GALLERY: 'gallery',
  HOME_SETTINGS: 'homeSettings', // factory video URL, etc.
};

// ========== PRODUCTS ==========
export async function getProducts(max = 50) {
  const q = query(
    collection(db, COLLECTIONS.PRODUCTS),
    orderBy('createdAt', 'desc'),
    limit(max)
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function addProduct(data) {
  const ref = await addDoc(collection(db, COLLECTIONS.PRODUCTS), {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return ref.id;
}

export async function updateProduct(id, data) {
  await updateDoc(doc(db, COLLECTIONS.PRODUCTS, id), {
    ...data,
    updatedAt: serverTimestamp(),
  });
}

export async function deleteProduct(id) {
  await deleteDoc(doc(db, COLLECTIONS.PRODUCTS, id));
}

// ========== HERO CAROUSEL ==========
export async function getHeroSlides() {
  const snap = await getDocs(
    query(collection(db, COLLECTIONS.HERO_CAROUSEL), orderBy('order', 'asc'))
  );
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function addHeroSlide(data) {
  const ref = await addDoc(collection(db, COLLECTIONS.HERO_CAROUSEL), {
    ...data,
    order: data.order ?? 0,
    createdAt: serverTimestamp(),
  });
  return ref.id;
}

export async function updateHeroSlide(id, data) {
  await updateDoc(doc(db, COLLECTIONS.HERO_CAROUSEL, id), data);
}

export async function deleteHeroSlide(id) {
  await deleteDoc(doc(db, COLLECTIONS.HERO_CAROUSEL, id));
}

// ========== BRANDS TAPE ==========
export async function getBrands() {
  const snap = await getDocs(
    query(collection(db, COLLECTIONS.BRANDS_TAPE), orderBy('order', 'asc'))
  );
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function addBrand(data) {
  const ref = await addDoc(collection(db, COLLECTIONS.BRANDS_TAPE), {
    ...data,
    order: data.order ?? 0,
    createdAt: serverTimestamp(),
  });
  return ref.id;
}

export async function updateBrand(id, data) {
  await updateDoc(doc(db, COLLECTIONS.BRANDS_TAPE, id), data);
}

export async function deleteBrand(id) {
  await deleteDoc(doc(db, COLLECTIONS.BRANDS_TAPE, id));
}

// ========== CSR ==========
export async function getCSRCards(max = 50) {
  const q = query(
    collection(db, COLLECTIONS.CSR),
    orderBy('createdAt', 'desc'),
    limit(max)
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function addCSRCard(data) {
  const ref = await addDoc(collection(db, COLLECTIONS.CSR), {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return ref.id;
}

export async function updateCSRCard(id, data) {
  await updateDoc(doc(db, COLLECTIONS.CSR, id), {
    ...data,
    updatedAt: serverTimestamp(),
  });
}

export async function deleteCSRCard(id) {
  await deleteDoc(doc(db, COLLECTIONS.CSR, id));
}

// ========== NEWSLINE ==========
export async function getNewslineItems(max = 50) {
  const q = query(
    collection(db, COLLECTIONS.NEWSLINE),
    orderBy('createdAt', 'desc'),
    limit(max)
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function addNewslineItem(data) {
  const ref = await addDoc(collection(db, COLLECTIONS.NEWSLINE), {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return ref.id;
}

export async function updateNewslineItem(id, data) {
  await updateDoc(doc(db, COLLECTIONS.NEWSLINE, id), {
    ...data,
    updatedAt: serverTimestamp(),
  });
}

export async function deleteNewslineItem(id) {
  await deleteDoc(doc(db, COLLECTIONS.NEWSLINE, id));
}

// ========== FACTORY ==========
export async function getFactoryItems(max = 50) {
  const q = query(
    collection(db, COLLECTIONS.FACTORY),
    orderBy('order', 'asc'),
    limit(max)
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function addFactoryItem(data) {
  const ref = await addDoc(collection(db, COLLECTIONS.FACTORY), {
    ...data,
    order: data.order ?? 0,
    createdAt: serverTimestamp(),
  });
  return ref.id;
}

export async function updateFactoryItem(id, data) {
  await updateDoc(doc(db, COLLECTIONS.FACTORY, id), data);
}

export async function deleteFactoryItem(id) {
  await deleteDoc(doc(db, COLLECTIONS.FACTORY, id));
}

// ========== GALLERY ==========
export async function getGalleryImages(max = 50) {
  const q = query(
    collection(db, COLLECTIONS.GALLERY),
    orderBy('order', 'asc'),
    limit(max)
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function addGalleryImage(data) {
  const ref = await addDoc(collection(db, COLLECTIONS.GALLERY), {
    ...data,
    order: data.order ?? 0,
    createdAt: serverTimestamp(),
  });
  return ref.id;
}

export async function deleteGalleryImage(id) {
  await deleteDoc(doc(db, COLLECTIONS.GALLERY, id));
}

// ========== HOME SETTINGS (e.g. factory video URL) ==========
export async function getHomeSettings() {
  const ref = doc(db, COLLECTIONS.HOME_SETTINGS, 'main');
  const snap = await getDoc(ref);
  return snap.exists() ? snap.data() : {};
}

export async function setHomeSettings(data) {
  const ref = doc(db, COLLECTIONS.HOME_SETTINGS, 'main');
  await setDoc(ref, { ...data, updatedAt: serverTimestamp() }, { merge: true });
}
