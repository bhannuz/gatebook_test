// js/residents-history.js
// Staying History Module - Flat occupancy tracking with move-in/out logs

let UID = null;
let flatsMap = new Map();
let stayHistoryMap = new Map();
let currentTypeFilter = 'all';
let searchQuery = '';

// Helper functions
function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/[&<>]/g, function(m) {
        if (m === '&') return '&amp;';
        if (m === '<') return '&lt;';
        if (m === '>') return '&gt;';
        return m;
    });
}

function formatDate(dateStr) {
    if (!dateStr) return '—';
    try {
        let d = new Date(dateStr);
        if (isNaN(d)) return dateStr.slice(0, 10);
        return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
    } catch (e) { return dateStr; }
}

function formatEventLabel(type) {
    if (type === 'move_in') return '🏠 Moved In';
    if (type === 'move_out') return '🚪 Moved Out';
    if (type === 'type_change') return '🔄 Type Change';
    return '📝 Update';
}

function getHistoryBadgeClass(type) {
    if (type === 'move_in') return 'movein';
    if (type === 'move_out') return 'moveout';
    return 'type';
}

function showToast(msg, type = 'success') {
    const toast = document.getElementById('toastMsg');
    if (!toast) {
        alert(msg);
        return;
    }
    toast.textContent = msg;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 2500);
}

// Firestore helpers
function getFlatsColl() { return collection(db, 'apartments', UID, 'flats'); }
function getFlatRef(id) { return doc(db, 'apartments', UID, 'flats', id); }
function getHistoryColl(flatId) { return collection(db, 'apartments', UID, 'flats', flatId, 'stayHistory'); }

// Add history event
async function addHistoryEvent(flatId, eventType, details, oldValue = '', newValue = '') {
    const eventObj = {
        eventType, details, oldValue, newValue,
        eventDate: new Date().toISOString(),
        timestamp: serverTimestamp()
    };
    await addDoc(getHistoryColl(flatId), eventObj);
    // Refresh local history
    const refreshed = await getDocs(getHistoryColl(flatId));
    const events = [];
    refreshed.forEach(h => events.push({ id: h.id, ...h.data() }));
    events.sort((a, b) => (b.eventDate || b.timestamp) - (a.eventDate || a.timestamp));
    stayHistoryMap.set(flatId, events);
}

// Update flat with history
async function updateFlatWithHistory(flatId, updatedFields, historyNote = null) {
    const oldFlat = flatsMap.get(flatId);
    if (!oldFlat) return;
    
    const changes = [];
    if (updatedFields.owner !== undefined && oldFlat.owner !== updatedFields.owner) {
        changes.push(`Owner: "${oldFlat.owner || 'none'}" → "${updatedFields.owner || 'none'}"`);
    }
    if (updatedFields.resType !== undefined && oldFlat.resType !== updatedFields.resType) {
        changes.push(`Type: ${oldFlat.resType || 'owner'} → ${updatedFields.resType}`);
    }
    if (updatedFields.moveIn !== undefined && oldFlat.moveIn !== updatedFields.moveIn) {
        changes.push(`Move-in: ${oldFlat.moveIn || '—'} → ${updatedFields.moveIn || '—'}`);
    }
    if (updatedFields.moveOut !== undefined && oldFlat.moveOut !== updatedFields.moveOut) {
        changes.push(`Move-out: ${oldFlat.moveOut || '—'} → ${updatedFields.moveOut || '—'}`);
    }
    
    await updateDoc(getFlatRef(flatId), updatedFields);
    
    if (changes.length > 0) {
        await addHistoryEvent(flatId, 'edit', changes.join('; '), '', changes.join(', '));
    }
    if (historyNote) {
        await addHistoryEvent(flatId, 'note', historyNote, '', '');
    }
    
    const updated = { ...oldFlat, ...updatedFields };
    flatsMap.set(flatId, updated);
    renderMembers();
    showToast('Changes saved & history updated');
}

// Move-in action
async function performMoveIn(flatId, residentName, type, moveInDate) {
    const flat = flatsMap.get(flatId);
    if (!flat) return;
    const updates = {
        owner: residentName,
        resType: type,
        moveIn: moveInDate,
        moveOut: null
    };
    await updateDoc(getFlatRef(flatId), updates);
    await addHistoryEvent(flatId, 'move_in', `${type.toUpperCase()} moved in`, flat.owner || 'vacant', residentName);
    flatsMap.set(flatId, { ...flat, ...updates });
    renderMembers();
    showToast(`✅ ${residentName} moved in (${type})`);
}

// Move-out action
async function performMoveOut(flatId, moveOutDate) {
    const flat = flatsMap.get(flatId);
    if (!flat) return;
    await updateDoc(getFlatRef(flatId), { moveOut: moveOutDate });
    await addHistoryEvent(flatId, 'move_out', `Vacated on ${moveOutDate}`, flat.owner || '', flat.owner || '');
    flatsMap.set(flatId, { ...flat, moveOut: moveOutDate });
    renderMembers();
    showToast(`🏠 Flat ${flatId} marked as moved out`);
}

// Delete flat completely
async function deleteFlatCompletely(flatId) {
    if (!confirm(`⚠️ Permanently delete flat ${flatId} and its entire stay history? This cannot be undone.`)) return;
    try {
        const histSnap = await getDocs(getHistoryColl(flatId));
        const deletePromises = histSnap.docs.map(d => deleteDoc(d.ref));
        await Promise.all(deletePromises);
        await deleteDoc(getFlatRef(flatId));
        flatsMap.delete(flatId);
        stayHistoryMap.delete(flatId);
        renderMembers();
        showToast(`Flat ${flatId} removed.`);
    } catch (e) {
        console.error(e);
        showToast('Delete failed', 'error');
    }
}

// Render members with history
function renderMembers() {
    let filtered = Array.from(flatsMap.values());
    
    if (currentTypeFilter !== 'all') {
        if (currentTypeFilter === 'vacant') {
            filtered = filtered.filter(f => !f.owner || f.owner.trim() === '' || (f.moveOut && new Date(f.moveOut) <= new Date()));
        } else {
            filtered = filtered.filter(f => f.resType === currentTypeFilter && f.owner && f.owner.trim() !== '');
        }
    }
    
    if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        filtered = filtered.filter(f => f.flatId.toLowerCase().includes(q) || (f.owner || '').toLowerCase().includes(q));
    }
    
    filtered.sort((a, b) => a.flatId.localeCompare(b.flatId));
    
    const container = document.getElementById('membersContainer');
    if (!filtered.length) {
        container.innerHTML = `<div style="background:#fff;border-radius:var(--r-lg);padding:3rem;text-align:center;color:var(--muted)"><i class="ti ti-users-off" style="font-size:40px;"></i><p>No residents match</p></div>`;
        return;
    }
    
    container.innerHTML = filtered.map(flat => {
        const isCurrentlyOccupied = flat.owner && flat.owner.trim() !== '' && (!flat.moveOut || new Date(flat.moveOut) > new Date());
        const displayStatus = isCurrentlyOccupied ? (flat.resType === 'tenant' ? 'Tenant' : 'Owner') : 'Vacant';
        const statusClass = isCurrentlyOccupied ? (flat.resType === 'tenant' ? 'tenant' : 'owner') : 'vacant';
        const history = stayHistoryMap.get(flat.flatId) || [];
        const moveInDate = flat.moveIn || '';
        const moveOutDate = flat.moveOut || '';
        
        return `
            <div class="member-card" data-flat="${flat.flatId}">
                <div class="member-header" onclick="window.residentsHistory.toggleDetail('${flat.flatId}')">
                    <div>
                        <span class="flat-badge">${flat.flatId}</span>
                        <span class="owner-type ${statusClass}" style="margin-left:10px;">${displayStatus}</span>
                    </div>
                    <div class="status-indicator">
                        <i class="ti ti-calendar-event"></i> 
                        ${isCurrentlyOccupied ? `Since ${moveInDate || 'unknown'}` : (flat.moveOut ? `Vacated ${moveOutDate}` : 'Vacant')}
                    </div>
                </div>
                <div id="detail-${flat.flatId}" class="member-detail" style="display:none;">
                    <div class="detail-row">
                        <div class="field">
                            <label>👤 Resident Name</label>
                            <input type="text" id="name_${flat.flatId}" value="${escapeHtml(flat.owner || '')}" placeholder="Full name">
                        </div>
                        <div class="field">
                            <label>🏷️ Type</label>
                            <select id="type_${flat.flatId}">
                                <option value="owner" ${flat.resType === 'owner' ? 'selected' : ''}>🏠 Owner</option>
                                <option value="tenant" ${flat.resType === 'tenant' ? 'selected' : ''}>🔑 Tenant</option>
                            </select>
                        </div>
                        <div class="field">
                            <label>📅 Move-In Date</label>
                            <input type="date" id="movein_${flat.flatId}" value="${moveInDate || ''}">
                        </div>
                        <div class="field">
                            <label>📅 Move-Out Date (if vacated)</label>
                            <input type="date" id="moveout_${flat.flatId}" value="${moveOutDate || ''}">
                        </div>
                    </div>
                    
                    <div style="display:flex; gap:12px; margin-bottom:16px; flex-wrap:wrap;">
                        <button class="save-btn" onclick="window.residentsHistory.saveFlatChanges('${flat.flatId}')"><i class="ti ti-device-floppy"></i> Save Changes</button>
                        <button class="save-btn" style="background:var(--amber);" onclick="window.residentsHistory.quickMoveIn('${flat.flatId}')"><i class="ti ti-home-plus"></i> Mark Move-in</button>
                        <button class="save-btn" style="background:var(--red);" onclick="window.residentsHistory.quickMoveOut('${flat.flatId}')"><i class="ti ti-door-exit"></i> Mark Move-out</button>
                        <button class="save-btn" style="background:var(--muted);" onclick="window.residentsHistory.deleteFlat('${flat.flatId}')"><i class="ti ti-trash"></i> Delete Flat</button>
                    </div>
                    
                    <div class="history-section">
                        <div class="history-title"><i class="ti ti-clock-history"></i> Staying History</div>
                        <div class="history-log">
                            ${history.length ? history.map(ev => `
                                <div class="history-item">
                                    <div><strong>${formatEventLabel(ev.eventType)}</strong> ${ev.details || ''}</div>
                                    <div class="history-date">${formatDate(ev.eventDate)}</div>
                                    <div><span class="history-badge ${getHistoryBadgeClass(ev.eventType)}">${ev.eventType.replace('_', ' ')}</span></div>
                                </div>
                            `).join('') : '<div class="empty-history"><i class="ti ti-history-off"></i> No stay records yet.</div>'}
                        </div>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

// Load all data
async function loadAllData() {
    if (!UID) return;
    const flatsSnap = await getDocs(getFlatsColl());
    flatsMap.clear();
    flatsSnap.forEach(docSnap => {
        flatsMap.set(docSnap.id, { flatId: docSnap.id, ...docSnap.data() });
    });
    
    for (let flatId of flatsMap.keys()) {
        const histSnap = await getDocs(getHistoryColl(flatId));
        const events = [];
        histSnap.forEach(h => events.push({ id: h.id, ...h.data() }));
        events.sort((a, b) => (b.eventDate || b.timestamp) - (a.eventDate || a.timestamp));
        stayHistoryMap.set(flatId, events);
    }
    renderMembers();
}

// Initialize module
async function initResidentsHistory(uid, firestoreHelpers) {
    UID = uid;
    // Import Firestore functions from parent scope
    const { collection, doc, getDocs, getDoc, setDoc, updateDoc, addDoc, deleteDoc, onSnapshot, serverTimestamp } = firestoreHelpers;
    window.__firestore = firestoreHelpers;
    
    await loadAllData();
    
    // Set up event listeners
    document.querySelectorAll('.filter-chip').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.filter-chip').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentTypeFilter = btn.dataset.type;
            renderMembers();
        });
    });
    
    const searchInput = document.getElementById('memberSearch');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            searchQuery = e.target.value;
            renderMembers();
        });
    }
}

// Export public methods
window.residentsHistory = {
    init: initResidentsHistory,
    toggleDetail: (flatId) => {
        const el = document.getElementById(`detail-${flatId}`);
        if (el) el.style.display = el.style.display === 'none' ? 'block' : 'none';
    },
    saveFlatChanges: async (flatId) => {
        const newName = document.getElementById(`name_${flatId}`)?.value.trim() || '';
        const newType = document.getElementById(`type_${flatId}`)?.value;
        const newMoveIn = document.getElementById(`movein_${flatId}`)?.value || '';
        const newMoveOut = document.getElementById(`moveout_${flatId}`)?.value || '';
        const flat = flatsMap.get(flatId);
        if (!flat) return;
        const updates = {};
        if (flat.owner !== newName) updates.owner = newName;
        if ((flat.resType || 'owner') !== newType) updates.resType = newType;
        if ((flat.moveIn || '') !== newMoveIn) updates.moveIn = newMoveIn;
        if ((flat.moveOut || '') !== newMoveOut) updates.moveOut = newMoveOut;
        if (Object.keys(updates).length === 0) {
            showToast('No changes detected');
            return;
        }
        await updateFlatWithHistory(flatId, updates);
    },
    quickMoveIn: async (flatId) => {
        const flat = flatsMap.get(flatId);
        const currentName = flat?.owner || '';
        const newName = prompt("Enter resident full name:", currentName);
        if (!newName || newName.trim() === '') return;
        const typeChoice = confirm("Is this a TENANT? Click OK for Tenant, Cancel for Owner.");
        const residentType = typeChoice ? 'tenant' : 'owner';
        const today = new Date().toISOString().split('T')[0];
        await performMoveIn(flatId, newName.trim(), residentType, today);
    },
    quickMoveOut: async (flatId) => {
        const flat = flatsMap.get(flatId);
        if (!flat?.owner || flat.owner.trim() === '') {
            showToast("Flat is already vacant, cannot move out.", 'error');
            return;
        }
        if (!confirm(`Mark ${flat.owner} as moved out?`)) return;
        const today = new Date().toISOString().split('T')[0];
        await performMoveOut(flatId, today);
    },
    deleteFlat: deleteFlatCompletely,
    refresh: loadAllData
};