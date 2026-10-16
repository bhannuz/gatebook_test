// roles.js — shared role resolution + join-code helpers
// Roles:  'platform' (admin@gatebook.app) | 'admin' (owns an apartment)
//         'member' (approved flat member) | 'pending' (waiting for approval)
//         'new'    (signed in, but no apartment and no join request)
import { db } from './firebase.js';
import {
  doc, getDoc, getDocs, setDoc, collection, query, limit,
} from 'https://www.gstatic.com/firebasejs/11.8.1/firebase-firestore.js';

export const PLATFORM_ADMIN_EMAIL = 'admin@gatebook.app';

export async function resolveRole(user) {
  if (user.email === PLATFORM_ADMIN_EMAIL) return { role: 'platform' };

  // 1. Apartment owner (apartment doc id === their uid).
  const own = await getDoc(doc(db, 'apartments', user.uid));
  if (own.exists()) return { role: 'admin', aptId: user.uid };
  // Legacy apartments that have flats but no apartment doc
  const legacy = await getDocs(query(collection(db, 'apartments', user.uid, 'flats'), limit(1)));
  if (!legacy.empty) return { role: 'admin', aptId: user.uid };

  // 2. Flat member. users/{uid} is only a HINT; the real proof is the
  //    members/{uid} doc, which only the apartment admin can create.
  const u = await getDoc(doc(db, 'users', user.uid));
  if (u.exists() && u.data().aptId) {
    const aptId = u.data().aptId;
    const m = await getDoc(doc(db, 'apartments', aptId, 'members', user.uid));
    if (m.exists()) return { role: 'member', aptId, flatId: m.data().flatId, name: m.data().name };
    const jr = await getDoc(doc(db, 'apartments', aptId, 'joinRequests', user.uid));
    if (jr.exists()) return { role: 'pending', aptId, flatId: jr.data().flatId };
    return { role: 'new', rejected: true };   // declined or removed by admin
  }
  return { role: 'new' };
}

const ALPHABET = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';   // no 0/O/1/I
export function makeJoinCode() {
  const r = crypto.getRandomValues(new Uint32Array(6));
  return 'GB-' + [...r].map(n => ALPHABET[n % ALPHABET.length]).join('');
}

// Creates joinCodes/{code} -> {aptId} and stores the code on the apartment doc.
export async function createJoinCode(aptId, aptName) {
  let lastErr;
  for (let i = 0; i < 5; i++) {
    const code = makeJoinCode();
    try {
      await setDoc(doc(db, 'joinCodes', code), { aptId, aptName: aptName || '', createdAt: new Date().toISOString() });
      await setDoc(doc(db, 'apartments', aptId), { joinCode: code }, { merge: true });
      return code;
    } catch (e) { lastErr = e; }      // code already taken -> try another
  }
  throw lastErr;
}
