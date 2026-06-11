# GATEBOOK HYBRID REFACTORING - MODULE EXTRACTION GUIDE

## Current Progress
✅ COMPLETED:
- 00-config.js (Constants, colors, Firebase config)
- 01-firebase-init.js (Firebase setup & auth)
- 02-data-store.js (Global state variables)  
- 03-helpers.js (Utility functions)

## Remaining Modules to Create

### 04-firebase-crud.js (Critical - CRUD Operations)
**Size estimate:** 800-1000 lines
**Functions to extract:**
- sync(state) - Main sync function
- saveFlat(fid) - Save flat data
- deleteFlat(flatId, block)
- saveInline(cid, obj)
- _saveFlat(fid)
- _deleteFlat()
- _deleteBlock()
- _addPayment()
- _deletePayment()
- _editPayment()
- _addStayPeriod()
- _deleteStayPeriod()
- _updateStayingDates()
- _saveNewStructure()
- _setResidentStatus()
- _toggleHistory()

**Dependencies:** Firebase functions, helpers, data-store

---

### 05-render-analytics.js (Analytics Tab)
**Size estimate:** 600-800 lines
**Functions to extract:**
- rAnalytics() - Main render function
- _buildAnalyticsFilters() - Build filter dropdowns
- _buildFlatSummary() - Build flat payment summary
- anSetStatus() - Filter by status
- Table rendering logic for analytics

**Key code patterns to find:**
```javascript
function rAnalytics() {
  // Update phAct filters...
  document.getElementById('phAct').innerHTML = `...`;
  _buildAnalyticsFilters();
  // Rest of function
}
```

**Dependencies:** Firebase functions, helpers, data-store

---

### 06-render-expenses.js (Expenses Tab)
**Size estimate:** 600-800 lines
**Functions to extract:**
- rPresident() - Main render function  
- Filter building logic
- President card rendering
- Expense table rendering
- Summary cards rendering

**Dependencies:** Firebase functions, helpers, data-store

---

### 07-render-residents.js (Residents Tab)
**Size estimate:** 500-700 lines
**Functions to extract:**
- rStructure() - Main render function
- _renderStructureList() - Render block/flat list
- makeChip() - Create flat chip elements
- Summary stats rendering

**Dependencies:** Firebase functions, helpers, data-store, modal handlers

---

### 08-render-issues.js (Issues Tab)
**Size estimate:** 300-400 lines
**Functions to extract:**
- rIssues() - Main render function
- Issue table rendering
- Issue status helpers

**Dependencies:** Firebase functions, helpers, data-store

---

### 09-modal-handlers.js (Modal Functions)
**Size estimate:** 400-500 lines
**Functions to extract:**
- _oA() - Add payment modal
- _oPresExp() - Add expense modal
- _oAF() - Add flat modal
- _oRI() - Add issue modal
- _oVehM() - Vehicle modal
- _oCatM() - Category modal
- openSEEdit(id) / closeSEEdit()
- _openStructureManager()
- _closeStructureManager()
- All modal open/close wrapper functions

**Pattern to identify:**
```javascript
window._oA = () => {
  document.getElementById('...').style.display = 'block';
  // modal setup
};
```

---

### 10-modal-flat-editor.js (Flat Editor Drawer)
**Size estimate:** 800-1000 lines
**Functions to extract:**
- oFlEdit(fid) - Main flat editor function
- Resident name/type/due editing
- Vehicle management
- Payment history rendering
- Staying history rendering
- Status tab logic
- All inline editing

**Critical sections:**
- setTimeout(() => { ... }, 0) blocks for async rendering
- Payment history list rendering
- Stay periods rendering
- Multi-tab logic

---

### 11-modal-structure.js (Structure Manager)
**Size estimate:** 400-600 lines
**Functions to extract:**
- _openStructureManager()
- _closeStructureManager()
- _renderStructureList()
- _addNewFlatRow()
- _deleteBlock()
- _deleteFlat()
- _saveNewStructure()
- Block/flat adding logic

---

### 12-modal-president.js (President Election)
**Size estimate:** 300-400 lines
**Functions to extract:**
- _oPresM() - Open president election modal
- _cPresM() - Close president modal
- cPresM() - President modal logic
- _savePresAsGuest()
- President election form handling

---

### 13-modal-expenses.js (Expense Entry)
**Size estimate:** 400-600 lines
**Functions to extract:**
- _oPresExp() - Open expense entry modal
- _closePresExp()
- _oFl() - Flat selection
- Expense form handling
- Payment entry logic
- Category management

---

### 14-event-listeners.js (Event Setup)
**Size estimate:** 200-300 lines
**Functions to extract:**
- DOMContentLoaded listener
- Tab click handlers
- Global event listeners
- Window event bindings

**Pattern:**
```javascript
window.addEventListener('DOMContentLoaded', async () => {
  // initialization
});

// Tab click handlers
document.querySelectorAll('[data-v]').forEach(btn => {
  btn.addEventListener('click', () => {
    // tab switching
  });
});
```

---

### 15-init.js (Initialization)
**Size estimate:** 200-300 lines
**Functions to extract:**
- initApp() - Main initialization
- loadApartmentData() - Load data from Firebase
- setupUI() - Setup initial UI
- setupFilters() - Setup filter dropdowns
- Any initialization logic

---

## Extraction Strategy

### Manual Approach (Recommended)
1. Open app.html in editor
2. Search for each function by name
3. Copy function with all dependencies
4. Paste into corresponding module
5. Add exports at end of each module
6. Update import statements

### Automated Approach
Run the extraction script (04-extract-remaining.py) which will:
1. Parse app.html
2. Find function boundaries
3. Extract by pattern matching
4. Place in correct module files
5. Add necessary exports

## Cross-Check Checklist

After creating each module:

- [ ] All function definitions are present
- [ ] No syntax errors
- [ ] Dependencies are listed in comments
- [ ] window.exports added at bottom
- [ ] No duplicate functions across modules
- [ ] Import statements are correct
- [ ] Global variables properly referenced

## Load Order (CRITICAL)

app.html must load scripts in this exact order:

```html
<script src="js/00-config.js"></script>
<script src="js/01-firebase-init.js"></script>
<script src="js/02-data-store.js"></script>
<script src="js/03-helpers.js"></script>
<script src="js/04-firebase-crud.js"></script>
<script src="js/05-render-analytics.js"></script>
<script src="js/06-render-expenses.js"></script>
<script src="js/07-render-residents.js"></script>
<script src="js/08-render-issues.js"></script>
<script src="js/09-modal-handlers.js"></script>
<script src="js/10-modal-flat-editor.js"></script>
<script src="js/11-modal-structure.js"></script>
<script src="js/12-modal-president.js"></script>
<script src="js/13-modal-expenses.js"></script>
<script src="js/14-event-listeners.js"></script>
<script src="js/15-init.js"></script>
```

This order ensures:
1. Config loaded first
2. Firebase initialized
3. State available
4. Helpers defined
5. All other modules load with dependencies available

## Testing Strategy

After each module creation:
1. Open browser console
2. Check for errors
3. Verify function exists: `typeof functionName` 
4. Run quick function test
5. Check that data loads correctly

Example:
```javascript
// Console test
typeof rAnalytics === 'function'  // Should be true
typeof st === 'function'          // Should be true
flats instanceof Map              // Should be true
```

## Next Steps

1. Create script: 04-extract-remaining.py (automated extraction)
2. Run script to generate remaining modules
3. Manual review and testing
4. Update app.html with new script includes
5. Final cross-check
6. Deploy

---

**STATUS:** Foundation complete (4/15 modules)
**REMAINING:** 11 modules (~6000+ lines to organize)
**ESTIMATED TIME:** 2-3 hours with automation

