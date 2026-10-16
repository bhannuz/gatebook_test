// roles.js — shared role resolution + helpers for the mobile + 4-digit-code login
// Roles: 'platform' (admin@gatebook.app) | 'admin' (owns an apartment)
//        'member' (flat member added by the admin) | 'new' (signed in, no apartment/membership)
import { db } from './firebase.js';
import {
  doc, getDoc, getDocs, collection, query, limit,
} from 'https://www.gstatic.com/firebasejs/11.8.1/firebase-firestore.js';

export const PLATFORM_ADMIN_EMAIL = 'admin@gatebook.app';

export const isValidMobile = m => /^\d{10}$/.test(m);
export const isValidPin    = p => /^\d{4}$/.test(p);
export const randomPin     = () => String(crypto.getRandomValues(new Uint32Array(1))[0] % 10000).padStart(4, '0');

// Firebase passwords need 6+ characters, so the 4-digit code is expanded before use.
export const pinToPassword = (mobile, pin) => `gb:${mobile}:${pin}`;

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
    if (m.exists()) return { role: 'member', aptId, flatId: m.data().flatId, name: m.data().name, phone: m.data().phone };
  }
  return { role: 'new' };
}
