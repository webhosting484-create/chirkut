import React, { useState, useEffect } from 'react';
import {
  ChirkutNote,
  StoryItem,
  ChirkutComment,
  UserProfile,
  ReactionType
} from './types';
import { INITIAL_CHIRKUT_NOTES } from './data/chirkutData';
import { INITIAL_STORIES } from './data/initialStories';
import { INITIAL_COMMENTS } from './data/initialComments';
import {
  auth,
  signOut,
  onAuthStateChanged,
  db,
  collection,
  doc,
  setDoc,
  addDoc,
  deleteDoc,
  getDocs,
  onSnapshot,
  query,
  orderBy,
  limit
} from './lib/firebase';

import { Header } from './components/Header';
import { StoriesBar } from './components/StoriesBar';
import { HeroSection } from './components/HeroSection';
import { ChirkutGallery } from './components/ChirkutGallery';
import { ChirkutModal } from './components/ChirkutModal';
import { WriteChirkutModal } from './components/WriteChirkutModal';
import { ScentAlchemySection } from './components/ScentAlchemySection';
import { AboutSection } from './components/AboutSection';
import { Footer } from './components/Footer';

import { AuthModal } from './components/AuthModal';
import { UserProfileModal } from './components/profile';
import { StoryViewerModal } from './components/StoryViewerModal';
import { CreateStoryModal } from './components/CreateStoryModal';
import { PostCommentsDrawer } from './components/PostCommentsDrawer';
import { MobileAppModal } from './components/MobileAppModal';
import { MobileBottomNav } from './components/MobileBottomNav';
import { DeviceSimulatorFrame } from './components/DeviceSimulatorFrame';
import { FriendsTab } from './components/profile/FriendsTab';
import { SettingsModal } from './components/profile/SettingsModal';
import { NotificationsPanel } from './components/NotificationsPanel';
import { SearchModal } from './components/SearchModal';
import { ActivityLog } from './components/ActivityLog';

export default function App() {
  const [lang, setLang] = useState<'bn' | 'en'>('bn');
  const [deviceMode, setDeviceMode] = useState<'web' | 'android' | 'apple'>('web');

  // Authentication State with persistent session fallback
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    try {
      const stored = localStorage.getItem('chirkut_active_user');
      if (stored) return JSON.parse(stored);
    } catch {
      // ignore
    }
    return null;
  });

  // Modals state
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [viewingAuthorProfile, setViewingAuthorProfile] = useState<{ name: string; id?: string; avatar?: string } | null>(null);
  const [isWriteModalOpen, setIsWriteModalOpen] = useState(false);
  const [isMobileAppModalOpen, setIsMobileAppModalOpen] = useState(false);
  const [isCreateStoryOpen, setIsCreateStoryOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isFriendsModalOpen, setIsFriendsModalOpen] = useState(false);
  const [isNotificationsPanelOpen, setIsNotificationsPanelOpen] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [isActivityLogOpen, setIsActivityLogOpen] = useState(false);

  // Story Viewer state
  const [isStoryViewerOpen, setIsStoryViewerOpen] = useState(false);
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);

  // Selected Note & Comments Drawer
  const [selectedNote, setSelectedNote] = useState<ChirkutNote | null>(null);
  const [commentingNote, setCommentingNote] = useState<ChirkutNote | null>(null);

  // Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Core Data
  const [notes, setNotes] = useState<ChirkutNote[]>(() => {
    try {
      const stored = localStorage.getItem('user_chirkut_notes');
      if (stored) {
        const parsed: ChirkutNote[] = JSON.parse(stored);
        const map = new Map<string, ChirkutNote>();
        INITIAL_CHIRKUT_NOTES.forEach((n) => map.set(n.id, n));
        parsed.forEach((n) => map.set(n.id, n));
        return Array.from(map.values());
      }
    } catch {
      // fallback
    }
    return INITIAL_CHIRKUT_NOTES;
  });

  const [stories, setStories] = useState<StoryItem[]>(INITIAL_STORIES);
  const [comments, setComments] = useState<ChirkutComment[]>(INITIAL_COMMENTS);

  // Listen to Firebase Auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        const profile: UserProfile = {
          uid: user.uid,
          displayName: user.displayName || (user.isAnonymous ? 'অতিথি চিরকুট পাঠক' : 'চিরকুট সদস্য'),
          email: user.email,
          photoURL: user.photoURL,
          isAnonymous: user.isAnonymous,
        };
        setCurrentUser(profile);
        try {
          localStorage.setItem('chirkut_active_user', JSON.stringify(profile));
        } catch {
          // ignore
        }
      }
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch {
      // ignore
    }
    try {
      localStorage.removeItem('chirkut_active_user');
    } catch {
      // ignore
    }
    setCurrentUser(null);
  };

  // Listen to Firestore real-time collections (Chirkuts & Stories & Comments)
  useEffect(() => {
    try {
      // Chirkuts listener
      const chirkutsRef = collection(db, 'chirkuts');
      const unsubscribeChirkuts = onSnapshot(
        chirkutsRef,
        (snapshot) => {
          if (!snapshot.empty) {
            const fetchedNotes: ChirkutNote[] = [];
            snapshot.forEach((docSnap) => {
              fetchedNotes.push({ id: docSnap.id, ...docSnap.data() } as ChirkutNote);
            });
            // Merge with default notes, avoiding duplicates
            const fetchedIds = new Set(fetchedNotes.map((n) => n.id));
            const remainingDefault = INITIAL_CHIRKUT_NOTES.filter((n) => !fetchedIds.has(n.id));
            setNotes([...fetchedNotes, ...remainingDefault]);
          }
        },
        () => {
          // If offline or permission denied, continue with local state
        }
      );

      // Stories listener
      const storiesRef = collection(db, 'stories');
      const unsubscribeStories = onSnapshot(
        storiesRef,
        (snapshot) => {
          if (!snapshot.empty) {
            const fetchedStories: StoryItem[] = [];
            snapshot.forEach((docSnap) => {
              fetchedStories.push({ id: docSnap.id, ...docSnap.data() } as StoryItem);
            });
            const fetchedIds = new Set(fetchedStories.map((s) => s.id));
            const remainingStories = INITIAL_STORIES.filter((s) => !fetchedIds.has(s.id));
            setStories([...fetchedStories, ...remainingStories]);
          }
        },
        () => {
          // fallback
        }
      );

      // Comments listener
      const commentsRef = collection(db, 'comments');
      const unsubscribeComments = onSnapshot(
        commentsRef,
        (snapshot) => {
          if (!snapshot.empty) {
            const fetchedComments: ChirkutComment[] = [];
            snapshot.forEach((docSnap) => {
              fetchedComments.push({ id: docSnap.id, ...docSnap.data() } as ChirkutComment);
            });
            const fetchedIds = new Set(fetchedComments.map((c) => c.id));
            const remainingComments = INITIAL_COMMENTS.filter((c) => !fetchedIds.has(c.id));
            setComments([...fetchedComments, ...remainingComments]);
          }
        },
        () => {
          // fallback
        }
      );

      return () => {
        unsubscribeChirkuts();
        unsubscribeStories();
        unsubscribeComments();
      };
    } catch {
      // ignore
    }
  }, []);

  const heroNote = (notes && notes.length > 0 ? (notes.find((n) => n.id === 'chirkut-14') || notes[0]) : null) || INITIAL_CHIRKUT_NOTES[0];

  // Create Note Handler (Cloud + Local state)
  const handleCreateNote = async (newNote: ChirkutNote) => {
    // Optimistic UI update with deduplication
    setNotes((prev) => {
      const map = new Map<string, ChirkutNote>();
      map.set(newNote.id, newNote);
      prev.forEach((n) => {
        if (!map.has(n.id)) map.set(n.id, n);
      });
      const updated = Array.from(map.values());
      try {
        const userCreatedOnly = updated.filter(
          (n) => !INITIAL_CHIRKUT_NOTES.some((init) => init.id === n.id)
        );
        localStorage.setItem('user_chirkut_notes', JSON.stringify(userCreatedOnly));
      } catch {
        // ignore
      }
      return updated;
    });

    // Persist in Firebase Firestore
    try {
      await setDoc(doc(db, 'chirkuts', newNote.id), {
        ...newNote,
        createdAt: new Date().toISOString(),
      });
    } catch {
      // continue offline
    }

    setToastMessage(
      lang === 'bn'
        ? 'আপনার চিরকুটটি সফলভাবে পিন ও সুরক্ষিত হয়েছে!'
        : 'Your note has been pinned and securely saved!'
    );
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Delete Note Handler
  const handleDeleteNote = async (noteId: string) => {
    setNotes((prev) => prev.filter((n) => n.id !== noteId));
    try {
      const stored = localStorage.getItem('user_chirkut_notes');
      if (stored) {
        const parsed: ChirkutNote[] = JSON.parse(stored);
        localStorage.setItem('user_chirkut_notes', JSON.stringify(parsed.filter((n) => n.id !== noteId)));
      }
      await deleteDoc(doc(db, 'chirkuts', noteId));
    } catch {
      // ignore
    }
    setToastMessage(lang === 'bn' ? 'চিরকুট মুছে ফেলা হয়েছে।' : 'Note removed.');
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleOpenAuthorProfile = (author: { name: string; id?: string; avatar?: string }) => {
    setViewingAuthorProfile(author);
    setIsProfileModalOpen(true);
  };

  // Create Story Handler
  const handleCreateStory = async (newStory: StoryItem) => {
    const updated = [newStory, ...stories];
    setStories(updated);

    try {
      await setDoc(doc(db, 'stories', newStory.id), {
        ...newStory,
      });
    } catch {
      // ignore
    }

    setToastMessage(
      lang === 'bn' ? 'আপনার ২৪ ঘণ্টার স্টোরি যুক্ত হয়েছে!' : 'Story shared successfully!'
    );
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Reaction Handler (Multi-reaction ❤️, 😢, ✨, 🔥, 🕊️)
  const handleReact = async (noteId: string, reaction: ReactionType) => {
    setNotes((prevNotes) =>
      prevNotes.map((note) => {
        if (note.id !== noteId) return note;

        const isSame = note.userReaction === reaction;
        const newUserReaction = isSame ? null : reaction;
        const currentLikes = note.likesCount || 0;
        const newLikes = isSame ? Math.max(0, currentLikes - 1) : currentLikes + (note.userReaction ? 0 : 1);

        const updatedReactions = {
          love: note.reactions?.love || 0,
          tear: note.reactions?.tear || 0,
          sparkle: note.reactions?.sparkle || 0,
          fire: note.reactions?.fire || 0,
          calm: note.reactions?.calm || 0,
        };

        if (note.userReaction && updatedReactions[note.userReaction] > 0) {
          updatedReactions[note.userReaction]--;
        }
        if (newUserReaction) {
          updatedReactions[newUserReaction]++;
        }

        return {
          ...note,
          userReaction: newUserReaction,
          likesCount: newLikes,
          reactions: updatedReactions,
        };
      })
    );

    // Save to Firestore
    try {
      await setDoc(
        doc(db, 'chirkuts', noteId),
        {
          lastReaction: reaction,
        },
        { merge: true }
      );
    } catch {
      // ignore
    }
  };

  // Add Comment Handler
  const handleAddComment = async (chirkutId: string, text: string) => {
    const newComment: ChirkutComment = {
      id: `comment-${Date.now()}`,
      chirkutId,
      authorId: currentUser?.uid || 'guest',
      authorName: currentUser?.displayName || (lang === 'bn' ? 'অজ্ঞাত মন্তব্যকারী' : 'Anonymous Reader'),
      authorAvatar: currentUser?.photoURL || undefined,
      text,
      createdAt: lang === 'bn' ? 'এইমাত্র' : 'Just now',
    };

    setComments((prev) => [newComment, ...prev]);

    // Update note comments count
    setNotes((prev) =>
      prev.map((n) =>
        n.id === chirkutId ? { ...n, commentsCount: (n.commentsCount || 0) + 1 } : n
      )
    );

    // Save to Firestore
    try {
      await setDoc(doc(db, 'comments', newComment.id), newComment);
    } catch {
      // ignore
    }
  };

  const handleOpenStory = (story: StoryItem, index: number) => {
    setCurrentStoryIndex(index);
    setIsStoryViewerOpen(true);
    // Mark as viewed
    setStories((prev) =>
      prev.map((s, i) => (i === index ? { ...s, hasViewed: true } : s))
    );
  };

  const handleExploreClick = () => {
    const galleryEl = document.getElementById('gallery');
    if (galleryEl) {
      galleryEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Map comments count per chirkut
  const commentsCountMap = comments.reduce((acc, c) => {
    acc[c.chirkutId] = (acc[c.chirkutId] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const bookmarkedIds: string[] = (() => {
    try {
      const saved = localStorage.getItem('chirkut_bookmarks');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  })();

  const savedNotes = notes.filter((n) => bookmarkedIds.includes(n.id));
  const myNotes = currentUser ? notes.filter((n) => n.authorId === currentUser.uid) : [];

  const mainContent = (
    <div className="min-h-screen bg-[#14110F] text-[#E8DFD8] flex flex-col selection:bg-[#C5A880]/30 selection:text-[#FFF8F0]">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-16 sm:bottom-6 right-6 z-50 bg-[#251E19] border border-[#C5A880] text-[#FAF3EB] px-5 py-3 rounded-xl shadow-2xl text-xs font-serif flex items-center gap-3 animate-in slide-in-from-bottom-5">
          <span className="w-2 h-2 rounded-full bg-[#C5A880] animate-ping" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <Header
        onOpenWriteModal={() => setIsWriteModalOpen(true)}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
        onOpenProfileModal={() => {
          setViewingAuthorProfile(null);
          setIsProfileModalOpen(true);
        }}
        onOpenMobileAppModal={() => setIsMobileAppModalOpen(true)}
        onOpenFriendsModal={() => setIsFriendsModalOpen(true)}
        onOpenSettingsModal={() => setIsSettingsModalOpen(true)}
        onOpenNotificationsPanel={() => setIsNotificationsPanelOpen(true)}
        onOpenSearchModal={() => setIsSearchModalOpen(true)}
        onOpenActivityLog={() => setIsActivityLogOpen(true)}
        deviceMode={deviceMode}
        onChangeDeviceMode={(mode) => setDeviceMode(mode)}
        user={currentUser}
        lang={lang}
        onToggleLang={() => setLang((prev) => (prev === 'bn' ? 'en' : 'bn'))}
        activeSection="hero"
      />

      {/* 24h Stories Bar */}
      <StoriesBar
        stories={stories}
        user={currentUser}
        onOpenStory={handleOpenStory}
        onOpenCreateStory={() => setIsCreateStoryOpen(true)}
        lang={lang}
      />

      {/* Main Content Sections */}
      <main className="flex-1 pb-16 sm:pb-0">
        
        {/* 1. Hero Section */}
        <HeroSection
          heroNote={heroNote}
          onSelectNote={(note) => setSelectedNote(note)}
          onExploreClick={handleExploreClick}
          lang={lang}
        />

        {/* 2. Chirkut Gallery & Real-time Notes Feed */}
        <ChirkutGallery
          notes={notes}
          onSelectNote={(note) => setSelectedNote(note)}
          onOpenWriteModal={() => setIsWriteModalOpen(true)}
          onOpenComments={(note) => setCommentingNote(note)}
          onReact={handleReact}
          onOpenAuthorProfile={handleOpenAuthorProfile}
          commentsCountMap={commentsCountMap}
          lang={lang}
        />

        {/* 3. Scent Alchemy & Sensory Notes */}
        <ScentAlchemySection lang={lang} />

        {/* 4. Philosophy of Chirkut */}
        <AboutSection lang={lang} />

      </main>

      {/* Footer */}
      <Footer lang={lang} />

      {/* Mobile Bottom Navigation Bar (Visible on mobile screens) */}
      <MobileBottomNav
        onOpenWriteModal={() => setIsWriteModalOpen(true)}
        onOpenCreateStory={() => setIsCreateStoryOpen(true)}
        onOpenProfileOrAuth={() => {
          if (currentUser) {
            setViewingAuthorProfile(null);
            setIsProfileModalOpen(true);
          } else {
            setIsAuthModalOpen(true);
          }
        }}
        onOpenMobileAppModal={() => setIsMobileAppModalOpen(true)}
        onScrollToGallery={handleExploreClick}
        onScrollToHero={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        user={currentUser}
        lang={lang}
      />

      {/* Modals */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        lang={lang}
        onLoginSuccess={(user) => {
          setCurrentUser(user);
          try {
            localStorage.setItem('chirkut_active_user', JSON.stringify(user));
          } catch {
            // ignore
          }
        }}
      />

      <UserProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => {
          setIsProfileModalOpen(false);
          setViewingAuthorProfile(null);
        }}
        user={currentUser}
        authorProfile={viewingAuthorProfile}
        savedNotes={savedNotes}
        allNotes={notes}
        onSelectNote={(note) => setSelectedNote(note)}
        onCreateNote={handleCreateNote}
        onDeleteNote={handleDeleteNote}
        onOpenComments={(note) => setCommentingNote(note)}
        onReact={handleReact}
        lang={lang}
        onLogout={handleLogout}
      />

      <StoryViewerModal
        stories={stories}
        currentIndex={currentStoryIndex}
        isOpen={isStoryViewerOpen}
        onClose={() => setIsStoryViewerOpen(false)}
        onNavigate={(idx) => setCurrentStoryIndex(idx)}
        onOpenAuthorProfile={handleOpenAuthorProfile}
        lang={lang}
      />

      <CreateStoryModal
        isOpen={isCreateStoryOpen}
        onClose={() => setIsCreateStoryOpen(false)}
        user={currentUser}
        onStoryCreated={handleCreateStory}
        lang={lang}
      />

      <PostCommentsDrawer
        note={commentingNote}
        comments={comments}
        isOpen={Boolean(commentingNote)}
        onClose={() => setCommentingNote(null)}
        user={currentUser}
        onAddComment={handleAddComment}
        onOpenAuthorProfile={handleOpenAuthorProfile}
        lang={lang}
      />

      <MobileAppModal
        isOpen={isMobileAppModalOpen}
        onClose={() => setIsMobileAppModalOpen(false)}
        lang={lang}
      />

      <ChirkutModal
        note={selectedNote}
        onClose={() => setSelectedNote(null)}
        onOpenAuthorProfile={handleOpenAuthorProfile}
        lang={lang}
      />

      <WriteChirkutModal
        isOpen={isWriteModalOpen}
        onClose={() => setIsWriteModalOpen(false)}
        onSubmitNote={handleCreateNote}
        user={currentUser}
        lang={lang}
      />

      <FriendsTab
        isOpen={isFriendsModalOpen}
        onClose={() => setIsFriendsModalOpen(false)}
        user={currentUser}
        lang={lang}
      />

      <SettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        user={currentUser}
        lang={lang}
      />

      <NotificationsPanel
        isOpen={isNotificationsPanelOpen}
        onClose={() => setIsNotificationsPanelOpen(false)}
        userId={currentUser?.uid || ''}
        lang={lang}
      />

      <SearchModal
        isOpen={isSearchModalOpen}
        onClose={() => setIsSearchModalOpen(false)}
        user={currentUser}
        lang={lang}
        onViewProfile={(profile) => {
          setViewingAuthorProfile(profile);
          setIsProfileModalOpen(true);
          setIsSearchModalOpen(false);
        }}
      />

      <ActivityLog
        isOpen={isActivityLogOpen}
        onClose={() => setIsActivityLogOpen(false)}
        userId={currentUser?.uid || ''}
        lang={lang}
      />

    </div>
  );

  return (
    <DeviceSimulatorFrame
      mode={deviceMode}
      onExit={() => setDeviceMode('web')}
      lang={lang}
    >
      {mainContent}
    </DeviceSimulatorFrame>
  );
}
