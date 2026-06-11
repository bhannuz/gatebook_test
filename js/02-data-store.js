/**
 * GATEBOOK - Data Store
 * Global state variables for the entire application
 * NOTE: Keep all references to these consistent across modules
 */

// ============================================
// FIREBASE & AUTH
// ============================================

let db = null;
let auth = null;
let UID = '';  // Current user's UID

// ============================================
// MAIN DATA COLLECTIONS (Maps for O(1) access)
// ============================================

// Flats: Map<flatId, { flatId, block, owner, type, monthlyDue, vehicles2W, vehicles4W, status, ... }>
let flats = new Map();

// Expenses: Map<flatId, [ { expId, month, amt, paid, due, status, ... } ]>
let exps = new Map();

// Society Expenses: [ { expId, date, month, category, amount, description, ... } ]
let socExps = [];

// Issues: [ { issueId, flatId, title, description, status, createdAt, ... } ]
let issues = [];

// Vehicles: Map<vehicleId, { flatId, block, type, number, color, ... }>
let vehicles = new Map();

// ============================================
// METADATA & SETTINGS
// ============================================

// President info: { name, flatId, termStart, termEnd, phone, ... }
let president = null;

// Custom categories per flat and society
let customCats = {
  flat: [],    // Categories for flat payments
  soc: []      // Categories for society expenses
};

// ============================================
// UI STATE
// ============================================

// Current active tab: 'analytics' | 'president' | 'structure' | 'issues'
let AV = 'analytics';

// Filters state
let FS = 'all';       // Flat status filter
let SQ = '';          // Search query
let RTF = 'all';      // Resident type filter
let FLF = 'all';      // Flat filter
let MF = 'all';       // Month filter
let AM = new Date().toISOString().slice(0, 7);  // Current active month (YYYY-MM)
let IF = 'all';       // Issue filter
let STRVIEW = 'floor'; // Structure view: 'floor' | 'block' | 'all'

// ============================================
// FILTER & ANALYTICS STATE
// ============================================

let _anBlock = 'all';           // Analytics block filter
let _anSelMonth = AM;           // Analytics selected month
let _anSelYear = new Date().getFullYear().toString();  // Analytics selected year
let _anFilterType = 'month';    // Analytics filter type: 'month' | 'year'

// ============================================
// UI REFERENCES (Optional caching)
// ============================================

let tabButtons = null;
let analyticsView = null;
let presView = null;
let structureView = null;
let iView = null;

// ============================================
// SYNC STATE
// ============================================

let syncState = 'live';  // 'live' | 'syncing' | 'error'
let lastSyncTime = null;

// ============================================
// HELPER EXPORT FUNCTIONS (defined in other modules)
// ============================================

// These are stubs - actual implementations in 03-helpers.js
let st = null;
let inr = null;
let bks = null;
let fex = null;
let paidAM = null;

// ============================================
// UTILITY STATE
// ============================================

let presHistoryData = [];  // President history records
let editingFlatId = null;  // Currently editing flat
let editingIssueId = null; // Currently editing issue

// ============================================
// EXPORT FOR MODULE SYSTEM
// ============================================

window.STATE = {
  db, auth, UID,
  flats, exps, socExps, issues, vehicles,
  president, customCats,
  AV, FS, SQ, RTF, FLF, MF, AM, IF, STRVIEW,
  _anBlock, _anSelMonth, _anSelYear, _anFilterType,
  syncState, lastSyncTime
};

// Allow updates to global state
window.setGlobalState = (key, value) => {
  window[key] = value;
  window.STATE[key] = value;
};

// Export for testing
if (typeof module !== 'undefined' && module.exports) {
  module.exports = window.STATE;
}
