import { initializeApp } from 'firebase/app';
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut
} from 'firebase/auth';
import {
  addDoc,
  collection,
  doc,
  getDocs,
  getFirestore,
  limit,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where
} from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getDownloadURL, getStorage, ref } from 'firebase/storage';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || '',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || '',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || '',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || ''
};

const isFirebaseConfigured =
  Boolean(firebaseConfig.apiKey) &&
  Boolean(firebaseConfig.authDomain) &&
  Boolean(firebaseConfig.projectId) &&
  Boolean(firebaseConfig.appId);

let app;
let auth;
let db;
let storage;
let analytics;
const analyticsEnabled = import.meta.env.VITE_ENABLE_ANALYTICS === 'true';

if (isFirebaseConfigured) {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
  storage = getStorage(app);
  if (typeof window !== 'undefined' && analyticsEnabled && Boolean(firebaseConfig.measurementId)) {
    import('firebase/analytics')
      .then(({ getAnalytics, isSupported }) =>
        isSupported().then((supported) => {
          if (supported) {
            analytics = getAnalytics(app);
          }
        })
      )
      .catch(() => {});
  }
}

const ensureConfig = () => {
  if (!isFirebaseConfigured) {
    throw new Error('Firebase is not configured. Set VITE_FIREBASE_* values in your env.');
  }
};

const normalizeUsername = (value) => String(value || '').trim().toLowerCase();
const isValidUsername = (value) => /^[a-z0-9_]{3,24}$/.test(value);

export const firebaseAuth = {
  subscribe: (callback) => {
    if (!isFirebaseConfigured || !auth) {
      callback(null);
      return () => {};
    }
    return onAuthStateChanged(auth, callback);
  },

  signUp: async ({ name, username, email, password }) => {
    ensureConfig();
    const usernameLower = normalizeUsername(username);
    if (!isValidUsername(usernameLower)) {
      throw new Error('Username must be 3-24 characters: letters, numbers, or underscore.');
    }

    const existingUsername = await getDocs(
      query(collection(db, 'users'), where('usernameLower', '==', usernameLower), limit(1))
    );
    if (!existingUsername.empty) {
      throw new Error('Username is already taken.');
    }

    const credential = await createUserWithEmailAndPassword(auth, email.trim(), password);
    const user = credential.user;

    await setDoc(doc(db, 'users', user.uid), {
      uid: user.uid,
      name: name.trim(),
      username: String(username || '').trim(),
      usernameLower,
      email: user.email,
      createdAt: serverTimestamp()
    });

    return {
      id: user.uid,
      name: name.trim(),
      username: String(username || '').trim(),
      email: user.email
    };
  },

  signIn: async ({ identifier, password }) => {
    ensureConfig();
    const rawIdentifier = String(identifier || '').trim();
    if (!rawIdentifier) {
      throw new Error('Email or username is required.');
    }

    let email = rawIdentifier;
    if (!rawIdentifier.includes('@')) {
      const usernameLower = normalizeUsername(rawIdentifier);
      const usernameDoc = await getDocs(
        query(collection(db, 'users'), where('usernameLower', '==', usernameLower), limit(1))
      );

      if (usernameDoc.empty) {
        throw new Error('Invalid username/email or password.');
      }
      email = String(usernameDoc.docs[0].data().email || '');
    }

    const credential = await signInWithEmailAndPassword(auth, email.trim(), password);
    const user = credential.user;
    let profile = null;
    try {
      const profileSnap = await getDocs(
        query(collection(db, 'users'), where('uid', '==', user.uid), limit(1))
      );
      if (!profileSnap.empty) {
        profile = profileSnap.docs[0].data();
      }
    } catch (error) {
      if (import.meta.env.DEV) {
        console.warn('Unable to fetch user profile.', error);
      }
    }

    return {
      id: user.uid,
      name: profile?.name || user.displayName || user.email?.split('@')[0] || 'User',
      username: profile?.username || '',
      email: user.email
    };
  },

  signOut: async () => {
    ensureConfig();
    await signOut(auth);
  }
};

export const firebaseStore = {
  getProducts: async () => {
    ensureConfig();
    const productsRef = collection(db, 'products');
    const snapshot = await getDocs(productsRef);

    const products = await Promise.all(
      snapshot.docs.map(async (item) => {
        const data = item.data();
        let imageUrl = data.imageUrl || '';

        if (!imageUrl && data.imagePath && storage) {
          try {
            imageUrl = await getDownloadURL(ref(storage, data.imagePath));
          } catch {
            imageUrl = '';
          }
        }

        return {
          id: item.id,
          name: data.name || 'Untitled Product',
          description: data.description || '',
          stock: data.stock || 'In stock',
          price: Number(data.price || 0),
          image: data.image || '',
          imageUrl,
          createdAtMs: data?.createdAt?.seconds ? data.createdAt.seconds * 1000 : 0
        };
      })
    );

    return products.sort((a, b) => {
      const aTime = Number(a.createdAtMs || 0);
      const bTime = Number(b.createdAtMs || 0);
      return bTime - aTime;
    });
  },

  createOrder: async ({
    user,
    items,
    total,
    address,
    paymentMethod,
    paymentStatus = 'paid',
    paymentReference = '',
    paymentDetails = ''
  }) => {
    ensureConfig();
    const payload = {
      userId: user.id,
      userEmail: user.email,
      userName: user.name,
      items,
      total,
      address,
      paymentMethod,
      paymentStatus,
      paymentReference,
      paymentDetails,
      createdAt: serverTimestamp()
    };
    const orderRef = await addDoc(collection(db, 'orders'), payload);
    return { id: orderRef.id };
  },

  saveShippingDetails: async (orderId, shipping) => {
    ensureConfig();
    if (!orderId) {
      throw new Error('Order id is required for shipping.');
    }

    await updateDoc(doc(db, 'orders', orderId), {
      shipping,
      shippingStatus: 'pending-fulfillment',
      shippingUpdatedAt: serverTimestamp()
    });
  },

  createConsult: async (payload) => {
    ensureConfig();
    await addDoc(collection(db, 'consultRequests'), {
      ...payload,
      createdAt: serverTimestamp()
    });
  }
};

export { analytics, isFirebaseConfigured };
