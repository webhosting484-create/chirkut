import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
  serverTimestamp,
  db,
} from '../lib/firebase';
import {
  FriendRequest,
  Friendship,
  FriendSuggestion,
} from '../types';

const REQUESTS_COL = 'friendRequests';
const FRIENDS_COL = 'friendships';

export const sendFriendRequest = async (request: FriendRequest) => {
  await setDoc(doc(collection(db, REQUESTS_COL), request.id), {
    ...request,
    createdAt: serverTimestamp(),
  });
};

export const acceptFriendRequest = async (request: FriendRequest) => {
  await setDoc(doc(db, REQUESTS_COL, request.id), {
    ...request,
    status: 'accepted',
  });
  const friendshipId = `friendship-${Date.now()}`;
  await setDoc(doc(collection(db, FRIENDS_COL), friendshipId), {
    id: friendshipId,
    userId: request.fromUserId,
    userName: request.fromUserName,
    userAvatar: request.fromUserAvatar,
    friendId: request.toUserId,
    friendName: request.toUserName || '',
    friendAvatar: '',
    createdAt: new Date().toISOString(),
    status: 'active',
  });
};

export const declineFriendRequest = async (requestId: string) => {
  await deleteDoc(doc(db, REQUESTS_COL, requestId));
};

export const cancelFriendRequest = async (requestId: string) => {
  await deleteDoc(doc(db, REQUESTS_COL, requestId));
};

export const removeFriend = async (friendshipId: string) => {
  await deleteDoc(doc(db, FRIENDS_COL, friendshipId));
};

export const getFriendRequests = async (userId: string): Promise<FriendRequest[]> => {
  const q = query(
    collection(db, REQUESTS_COL),
    where('toUserId', '==', userId),
    where('status', '==', 'pending'),
    orderBy('createdAt', 'desc')
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as FriendRequest));
};

export const getFriends = async (userId: string): Promise<Friendship[]> => {
  const q1 = query(
    collection(db, FRIENDS_COL),
    where('userId', '==', userId),
    where('status', '==', 'active')
  );
  const snap1 = await getDocs(q1);
  return snap1.docs.map((d) => ({ id: d.id, ...d.data() } as Friendship));
};

export const getFriendSuggestions = async (userId: string): Promise<FriendSuggestion[]> => {
  const friends = await getFriends(userId);
  const friendIds = friends.map((f) => f.friendId);
  const allUsers = await getDocs(collection(db, 'users'));
  const suggestions: FriendSuggestion[] = [];
  for (const userDoc of allUsers.docs) {
    const data = userDoc.data() as any;
    if (data.uid === userId || friendIds.includes(data.uid)) continue;
    suggestions.push({
      id: userDoc.id,
      userId: data.uid,
      userName: data.displayName || data.email || 'Unknown',
      userAvatar: data.photoURL || '',
      mutualFriends: Math.floor(Math.random() * 5),
      reason: 'সম্পর্কিত স্বরূপ',
    });
    if (suggestions.length >= 10) break;
  }
  return suggestions;
};

export const subscribeToFriendRequests = (
  userId: string,
  callback: (requests: FriendRequest[]) => void
) => {
  const q = query(
    collection(db, REQUESTS_COL),
    where('toUserId', '==', userId),
    where('status', '==', 'pending'),
    orderBy('createdAt', 'desc')
  );
  return onSnapshot(q, (snap) => {
    const requests = snap.docs.map((d) => ({ id: d.id, ...d.data() } as FriendRequest));
    callback(requests);
  });
};

export const subscribeToFriends = (
  userId: string,
  callback: (friends: Friendship[]) => void
) => {
  const q = query(
    collection(db, FRIENDS_COL),
    where('userId', '==', userId),
    where('status', '==', 'active')
  );
  return onSnapshot(q, (snap) => {
    const friends = snap.docs.map((d) => ({ id: d.id, ...d.data() } as Friendship));
    callback(friends);
  });
};
