import {
  collection,
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
  serverTimestamp,
  increment,
  db,
} from '../lib/firebase';
import { NotificationItem } from '../types';

const COL = 'notifications';

export const createNotification = async (notification: NotificationItem) => {
  await setDoc(doc(collection(db, COL), notification.id), {
    ...notification,
    createdAt: serverTimestamp(),
  });
};

export const markNotificationAsRead = async (notificationId: string) => {
  await updateDoc(doc(db, COL, notificationId), {
    isRead: true,
  });
};

export const markAllNotificationsAsRead = async (userId: string) => {
  const q = query(collection(db, COL), where('userId', '==', userId), where('isRead', '==', false));
  const snap = await getDocs(q);
  const updates = snap.docs.map((d) => updateDoc(doc(db, COL, d.id), { isRead: true }));
  await Promise.all(updates);
};

export const deleteNotification = async (notificationId: string) => {
  await deleteDoc(doc(db, COL, notificationId));
};

export const getNotifications = async (userId: string): Promise<NotificationItem[]> => {
  const q = query(
    collection(db, COL),
    where('userId', '==', userId),
    orderBy('createdAt', 'desc'),
    limit(50)
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as NotificationItem));
};

export const getUnreadCount = async (userId: string): Promise<number> => {
  const q = query(
    collection(db, COL),
    where('userId', '==', userId),
    where('isRead', '==', false)
  );
  const snap = await getDocs(q);
  return snap.size;
};

export const subscribeToNotifications = (
  userId: string,
  callback: (notifications: NotificationItem[]) => void
) => {
  const q = query(
    collection(db, COL),
    where('userId', '==', userId),
    orderBy('createdAt', 'desc'),
    limit(50)
  );
  return onSnapshot(q, (snap) => {
    const notifications = snap.docs.map((d) => ({ id: d.id, ...d.data() } as NotificationItem));
    callback(notifications);
  });
};
