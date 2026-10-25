import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
  db,
  collection,
  query,
  where,
  getDocs,
} from '../lib/firebase';
import { UserSettings, PrivacySettings, AccountSettings, UserStats, UserProfile } from '../types';

const COL = 'userSettings';

export const getUserSettings = async (userId: string): Promise<UserSettings | null> => {
  const ref = doc(db, COL, userId);
  const snap = await getDoc(ref);
  if (!snap.exists()) return null;
  return { userId, ...snap.data() } as UserSettings;
};

export const createDefaultSettings = async (userId: string) => {
  const ref = doc(db, COL, userId);
  await setDoc(ref, {
    userId,
    profileVisibility: 'public',
    showEmail: true,
    showLocation: true,
    showFriendsList: true,
    allowFriendRequests: true,
    allowMessages: true,
    emailNotifications: true,
    pushNotifications: true,
    language: 'bn',
    theme: 'dark',
  } as UserSettings);
};

export const updateUserSettings = async (userId: string, settings: Partial<UserSettings>) => {
  const ref = doc(db, COL, userId);
  await updateDoc(ref, settings);
};

export const getUserStats = async (userId: string): Promise<UserStats> => {
  const notesCount = 0;
  const friendsCount = 0;
  const followersCount = 0;
  const followingCount = 0;
  const likesReceived = 0;
  const commentsReceived = 0;
  return {
    notesCount,
    friendsCount,
    followersCount,
    followingCount,
    likesReceived,
    commentsReceived,
  };
};

export const updateUserProfile = async (userId: string, data: Partial<AccountSettings>) => {
  const ref = doc(db, 'users', userId);
  await updateDoc(ref, data);
};

export const searchUsers = async (queryText: string): Promise<UserProfile[]> => {
  const usersRef = collection(db, 'users');
  const q = query(usersRef, where('displayName', '>=', queryText), where('displayName', '<=', queryText + '\uf8ff'));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ uid: d.id, ...d.data() } as UserProfile));
};

export const getAllUsers = async (): Promise<UserProfile[]> => {
  const usersRef = collection(db, 'users');
  const snap = await getDocs(usersRef);
  return snap.docs.map((d) => ({ uid: d.id, ...d.data() } as UserProfile));
};
