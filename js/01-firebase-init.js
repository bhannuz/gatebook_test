/**
 * GATEBOOK - Firebase Initialization
 * Handles Firebase setup, authentication, and connection
 */

// Import Firebase SDK
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-app.js";
import { getAuth, signOut, onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-auth.js";
import { getFirestore, collection, doc, setDoc, getDoc, getDocs, addDoc, updateDoc, deleteDoc, query, where, orderBy } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-firestore.js";

// Initialize Firebase
let firebaseApp = null;
let db = null;
let auth = null;

/**
 * Initialize Firebase application
 * @param {Object} config - Firebase configuration object
 */
function initFirebase(config) {
  try {
    firebaseApp = initializeApp(config);
    auth = getAuth(firebaseApp);
    db = getFirestore(firebaseApp);
    
    console.log('✓ Firebase initialized successfully');
    return { db, auth };
  } catch (error) {
    console.error('✗ Firebase initialization failed:', error);
    throw error;
  }
}

/**
 * Setup authentication state listener
 * @param {Function} callback - Function to call when auth state changes
 */
function setupAuthListener(callback) {
  if (!auth) {
    console.error('Auth not initialized');
    return;
  }
  
  onAuthStateChanged(auth, (user) => {
    if (user) {
      console.log('✓ User authenticated:', user.uid);
      UID = user.uid;
      callback(user);
    } else {
      console.log('✗ User not authenticated');
      window.location.href = 'index.html';
    }
  });
}

/**
 * Sign out current user
 */
async function signOutUser() {
  try {
    await signOut(auth);
    console.log('✓ User signed out');
    window.location.href = 'index.html';
  } catch (error) {
    console.error('✗ Sign out failed:', error);
  }
}

/**
 * Sign in with email and password
 * @param {string} email - User email
 * @param {string} password - User password
 */
async function signInUser(email, password) {
  try {
    const result = await signInWithEmailAndPassword(auth, email, password);
    UID = result.user.uid;
    return result.user;
  } catch (error) {
    console.error('✗ Sign in failed:', error);
    throw error;
  }
}

/**
 * Create new user account
 * @param {string} email - User email
 * @param {string} password - User password
 */
async function createUser(email, password) {
  try {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    UID = result.user.uid;
    return result.user;
  } catch (error) {
    console.error('✗ User creation failed:', error);
    throw error;
  }
}

/**
 * Get Firestore database reference
 */
function getDB() {
  if (!db) {
    throw new Error('Firestore not initialized');
  }
  return db;
}

/**
 * Get Auth reference
 */
function getAuth() {
  if (!auth) {
    throw new Error('Auth not initialized');
  }
  return auth;
}

/**
 * Get current user
 */
function getCurrentUser() {
  return auth?.currentUser;
}

// Export for modules
window.Firebase = {
  initFirebase,
  setupAuthListener,
  signOutUser,
  signInUser,
  createUser,
  getDB,
  getAuth,
  getCurrentUser,
  // Re-export Firestore functions
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy
};

// Also make Firestore functions globally available
window.collection = collection;
window.doc = doc;
window.setDoc = setDoc;
window.getDoc = getDoc;
window.getDocs = getDocs;
window.addDoc = addDoc;
window.updateDoc = updateDoc;
window.deleteDoc = deleteDoc;
window.query = query;
window.where = where;
window.orderBy = orderBy;
