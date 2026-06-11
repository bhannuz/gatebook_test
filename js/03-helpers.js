/**
 * GATEBOOK - Helper Functions
 * Utility functions used across all modules
 * Dependencies: CAT_COLORS from config, flats/exps from data-store
 */

/**
 * Get payment status of a flat for a month
 * @param {Object} flat - Flat object with due, paid properties
 * @returns {string} - 'paid' | 'partial' | 'pending' | 'vacant'
 */
const st = (f) => {
  if (!f) return 'vacant';
  if (f.type === 'vacant') return 'vacant';
  if (!f.paid && !f.due) return 'vacant';
  if (f.paid >= f.due) return 'paid';
  if (f.paid > 0) return 'partial';
  return 'pending';
};

/**
 * Format number as Indian Rupees (₹)
 * @param {number} n - Number to format
 * @returns {string} - Formatted string like "₹1,23,456"
 */
const inr = (n) => {
  return '₹' + Number(n || 0).toLocaleString('en-IN');
};

/**
 * Get unique blocks from flats
 * @returns {Array<string>} - Sorted array of block names
 */
const bks = () => {
  if (!flats || flats.size === 0) return [];
  return [...new Set([...flats.values()].map(f => f.block))].sort();
};

/**
 * Get all expenses for a flat
 * @param {string} flatId - Flat ID
 * @returns {Array} - Array of expense records
 */
const fex = (flatId) => {
  if (!exps) return [];
  return exps.get(flatId) || [];
};

/**
 * Get paid amount for a flat in a specific month
 * @param {string} flatId - Flat ID
 * @param {string} month - Month in YYYY-MM format (optional, defaults to current)
 * @returns {number} - Amount paid
 */
const paidAM = (flatId, month) => {
  const targetMonth = month || AM;
  const flatExps = fex(flatId);
  return flatExps
    .filter(e => e.month === targetMonth)
    .reduce((sum, e) => sum + (e.paid || 0), 0);
};

/**
 * Get color for status
 * @param {string} status - Status value
 * @returns {string} - Hex color code
 */
const stClr = (status) => {
  const colors = {
    'paid': '#22c55e',
    'partial': '#f59e0b',
    'pending': '#ef4444',
    'vacant': '#d1d5db'
  };
  return colors[status] || '#9ca3af';
};

/**
 * Get all unique categories from expenses
 * @returns {Array<string>} - Sorted array of category names
 */
const allCats = () => {
  if (!socExps || socExps.length === 0) return [];
  return [...new Set(socExps.map(e => e.cat).filter(Boolean))].sort();
};

/**
 * Format date to readable format
 * @param {string|Date} date - ISO date string or Date object
 * @param {string} format - Format type: 'short' | 'long' | 'time'
 * @returns {string} - Formatted date
 */
const fmtDate = (date, format = 'short') => {
  if (!date) return 'N/A';
  const d = new Date(date);
  
  const options = {
    'short': { year: 'numeric', month: 'short', day: 'numeric' },
    'long': { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' },
    'time': { hour: '2-digit', minute: '2-digit', second: '2-digit' }
  };
  
  return d.toLocaleDateString('en-IN', options[format]);
};

/**
 * Show toast notification
 * @param {string} message - Message to display
 * @param {string} type - Type: 'success' | 'error' | 'info'
 * @param {number} duration - Duration in ms
 */
const toast = (message, type = 'info', duration = 3000) => {
  // Create toast element
  const toast = document.createElement('div');
  toast.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 12px 16px;
    background: ${type === 'success' ? '#22c55e' : type === 'error' ? '#ef4444' : '#6366f1'};
    color: white;
    border-radius: 8px;
    font-size: 12px;
    font-weight: 700;
    z-index: 9999;
    max-width: 300px;
    word-wrap: break-word;
    animation: slideIn 0.3s ease;
  `;
  toast.textContent = message;
  
  document.body.appendChild(toast);
  
  // Auto remove
  setTimeout(() => {
    toast.style.animation = 'slideOut 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, duration);
};

/**
 * Check if object is empty
 * @param {Object} obj - Object to check
 * @returns {boolean}
 */
const isEmpty = (obj) => {
  if (!obj) return true;
  if (obj instanceof Map) return obj.size === 0;
  if (Array.isArray(obj)) return obj.length === 0;
  return Object.keys(obj).length === 0;
};

/**
 * Deep copy object
 * @param {any} obj - Object to copy
 * @returns {any} - Copied object
 */
const deepCopy = (obj) => {
  return JSON.parse(JSON.stringify(obj));
};

/**
 * Get initials from name
 * @param {string} name - Full name
 * @returns {string} - Two-letter initials
 */
const getInitials = (name) => {
  if (!name) return '?';
  return name
    .split(' ')
    .map(part => part[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

/**
 * Generate unique ID
 * @returns {string} - Unique ID
 */
const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

/**
 * Sleep/delay function
 * @param {number} ms - Milliseconds to wait
 */
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Export helpers globally
window.Helpers = {
  st, inr, bks, fex, paidAM, stClr, allCats,
  fmtDate, toast, isEmpty, deepCopy, getInitials, generateId, sleep
};

// Also make them globally available as shortcuts
window.st = st;
window.inr = inr;
window.bks = bks;
window.fex = fex;
window.paidAM = paidAM;
window.stClr = stClr;
window.allCats = allCats;
window.fmtDate = fmtDate;
window.toast = toast;
window.isEmpty = isEmpty;
window.deepCopy = deepCopy;
window.getInitials = getInitials;
window.generateId = generateId;
window.sleep = sleep;
