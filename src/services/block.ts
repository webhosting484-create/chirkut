import {
  doc,
  setDoc,
  deleteDoc,
  getDocs,
  query,
  where,
  getDoc,
  db,
  collection,
} from '../lib/firebase';
import { UserProfile } from '../types';

const BLOCKED_COL = 'blockedUsers';

export const blockUser = async (blockerId: string, blockedUser: UserProfile) => {
  const id = `${blockerId}_${blockedUser.uid}`;
  await setDoc(doc(db, BLOCKED_COL, id), {
    id,
    blockerId,
    blockedUserId: blockedUser.uid,
    blockedUserName: blockedUser.displayName || 'Unknown',
    blockedUserAvatar: blockedUser.photoURL || '',
    createdAt: new Date().toISOString(),
  });
};

export const unblockUser = async (blockerId: string, blockedUserId: string) => {
  const id = `${blockerId}_${blockedUserId}`;
  await deleteDoc(doc(db, BLOCKED_COL, id));
};

export const getBlockedUsers = async (userId: string): Promise<UserProfile[]> => {
  const q = query(collection(db, BLOCKED_COL), where('blockerId', '==', userId));
  const snap = await getDocs(q);
  return snap.docs.map((d) => {
    const data = d.data() as any;
    return {
      uid: data.blockedUserId,
      displayName: data.blockedUserName,
      photoURL: data.blockedUserAvatar,
    } as UserProfile;
  });
};

export const isUserBlocked = async (blockerId: string, blockedUserId: string): Promise<boolean> => {
  const id = `${blockerId}_${blockedUserId}`;
  const snap = await getDoc(doc(db, BLOCKED_COL, id));
  return snap.exists();
};
