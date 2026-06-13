// Add this at the TOP of the <script> section to preserve filter state

let _analyticsFilterState = {
  type: 'month',
  month: null,
  year: null
};

let _expenseFilterState = {
  month: null,
  category: null
};

// Helper to save and restore filter state
function saveAnalyticsFilter(key, value) {
  _analyticsFilterState[key] = value;
}

function getAnalyticsFilter(key) {
  return _analyticsFilterState[key];
}

function saveExpenseFilter(key, value) {
  _expenseFilterState[key] = value;
}

function getExpenseFilter(key) {
  return _expenseFilterState[key];
}
