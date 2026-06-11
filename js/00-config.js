/**
 * GATEBOOK - Configuration File
 * Contains: Firebase config, constants, colors, icons
 */

// Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyDLzKwFBK98K5t3YzqCsRo5XfO_0m3rD8s",
  authDomain: "gatebook-4d5c0.firebaseapp.com",
  projectId: "gatebook-4d5c0",
  storageBucket: "gatebook-4d5c0.appspot.com",
  messagingSenderId: "1036395738996",
  appId: "1:1036395738996:web:e3b2a3e6c8d9f0a1b2c3d4"
};

// ============================================
// CONSTANTS
// ============================================

const CAT_ICONS = {
  'Maintenance': 'ti-tool',
  'Water': 'ti-droplet',
  'Electricity': 'ti-bolt',
  'Security': 'ti-shield',
  'Cleaning': 'ti-vacuum-cleaner',
  'Lift': 'ti-elevator',
  'Gardening': 'ti-plant',
  'Painting': 'ti-paint',
  'Internet': 'ti-wifi',
  'Parking': 'ti-parking',
  'Other': 'ti-clipboard'
};

const CAT_COLORS = [
  '#6366f1', '#10b981', '#f59e0b', '#ef4444', '#0ea5e9',
  '#8b5cf6', '#ec4899', '#14b8a6', '#f97316', '#84cc16'
];

const FLAT_TYPE_ICONS = {
  'Owner': '🏠',
  'Tenant': '🔑',
  'Vacant': '🚪'
};

const STATUS_COLORS = {
  'paid': '#22c55e',
  'partial': '#f59e0b',
  'pending': '#ef4444',
  'vacant': '#d1d5db'
};

const VEHICLE_ICONS = {
  '2W': '🏍️',
  '4W': '🚗'
};

// ============================================
// STYLE VARIABLES (CSS-in-JS)
// ============================================

const CSS_VARS = {
  '--border': '#e5e7eb',
  '--border2': '#f3f4f6',
  '--text': '#1f2937',
  '--text2': '#6b7280',
  '--muted': '#9ca3af',
  '--surface': '#ffffff',
  '--surface2': '#f9fafb',
  '--indigo': '#6366f1',
  '--indigo-dark': '#4f46e5',
  '--green': '#10b981',
  '--red': '#ef4444',
  '--yellow': '#f59e0b'
};

// ============================================
// TOAST CONFIGURATION
// ============================================

const TOAST_CONFIG = {
  duration: 3000,
  position: 'top-right'
};

// ============================================
// FIREBASE PATHS (Important!)
// ============================================

const FIREBASE_PATHS = {
  apartments: (uid) => `apartments/${uid}`,
  flats: (uid) => `apartments/${uid}/flats`,
  expenses: (uid) => `apartments/${uid}/expenses`,
  issues: (uid) => `apartments/${uid}/issues`,
  vehicles: (uid) => `apartments/${uid}/vehicles`,
  socExpenses: (uid) => `apartments/${uid}/soc_expenses`,
  presidentHistory: (uid) => `apartments/${uid}/presidentHistory`
};

// ============================================
// FEATURE FLAGS
// ============================================

const FEATURES = {
  enableExpenseTracking: true,
  enableIssueTracking: true,
  enableVehicleRegistry: true,
  enablePresidentElection: true,
  enablePaymentHistory: true
};

// Export for module loading
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { firebaseConfig, CAT_ICONS, CAT_COLORS, FIREBASE_PATHS };
}
