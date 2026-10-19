// roles.js — shared role resolution + helpers for the mobile + 6-character-code login
// Roles: 'platform' (admin@gatebook.app) | 'admin' (owns an apartment)
//        'member' (flat member added by the admin) | 'new' (signed in, no apartment/membership)
import { db } from './firebase.js';
import {
  doc, getDoc, getDocs, collection, query, limit,
} from 'https://www.gstatic.com/firebasejs/11.8.1/firebase-firestore.js';

export const PLATFORM_ADMIN_EMAIL = 'admin@gatebook.app';

export const isValidMobile = m => /^\d{10}$/.test(m);

// Access code: 6 characters, letters and digits (case-insensitive). The app generates 4 digits + 2 letters, e.g. 6024KM.
export const normalizePin = p => String(p || '').trim().toUpperCase();
export const isValidPin   = p => /^[A-Z0-9]{6}$/.test(normalizePin(p));
const LETTERS = 'ABCDEFGHJKMNPQRSTUVWXYZ';          // no I / O (look like 1 / 0)
export function randomPin() {
  const r = crypto.getRandomValues(new Uint32Array(3));
  return String(r[0] % 10000).padStart(4, '0') + LETTERS[r[1] % LETTERS.length] + LETTERS[r[2] % LETTERS.length];
}

// Firebase passwords need 6+ characters; the code is combined with the mobile number before use.
export const pinToPassword = (mobile, pin) => `gb:${mobile}:${normalizePin(pin)}`;

export async function resolveRole(user) {
  if (user.email === PLATFORM_ADMIN_EMAIL) return { role: 'platform' };

  // 1. Apartment owner (apartment doc id === their uid)
  const own = await getDoc(doc(db, 'apartments', user.uid));
  if (own.exists()) return { role: 'admin', aptId: user.uid };
  const legacy = await getDocs(query(collection(db, 'apartments', user.uid, 'flats'), limit(1)));
  if (!legacy.empty) return { role: 'admin', aptId: user.uid };   // older apartments without an apartment doc

  // 2. Flat member. users/{uid} is only a pointer; the proof is members/{uid},
  //    which only the apartment admin can create.
  const u = await getDoc(doc(db, 'users', user.uid));
  if (u.exists() && u.data().aptId) {
    const aptId = u.data().aptId;
    const m = await getDoc(doc(db, 'apartments', aptId, 'members', user.uid));
    if (m.exists()) return { role: 'member', aptId, flatId: m.data().flatId, name: m.data().name, phone: m.data().phone, relation: m.data().relation || '' };
  }
  return { role: 'new' };
}
