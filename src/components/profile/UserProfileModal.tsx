import React, { useState, useEffect } from 'react';
import { auth, signOut, db, doc, setDoc } from '../../lib/firebase';
import { UserProfile, ChirkutNote, ReactionType } from '../../types';
import { DEFAULT_AUTHOR_PROFILES } from '../../data/authorProfiles';
import { ProfileHeader } from './ProfileHeader';
import { ProfileTabType } from './ProfileNavTabs';
import { ProfileAboutSidebar } from './ProfileAboutSidebar';
import { ProfileTimelineComposer } from './ProfileTimelineComposer';
import { ProfileTimelineFeed } from './ProfileTimelineFeed';
import { ProfilePhotosTab } from './ProfilePhotosTab';
import { ProfileSavedTab } from './ProfileSavedTab';
import { ProfileReactionsTab } from './ProfileReactionsTab';
import { ProfileAboutTab } from './ProfileAboutTab';
import { ProfileFriendsTab } from './ProfileFriendsTab';
import { ProfileEditModal } from './ProfileEditModal';

export interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile | null;
  authorProfile?: {
    name: string;
    id?: string;
    avatar?: string;
  } | null;
  savedNotes: ChirkutNote[];
  allNotes: ChirkutNote[];
  onSelectNote: (note: ChirkutNote) => void;
  onCreateNote?: (note: ChirkutNote) => void;
  onDeleteNote?: (noteId: string) => void;
  onOpenComments?: (note: ChirkutNote) => void;
  onReact?: (noteId: string, reaction: ReactionType) => void;
  lang: 'bn' | 'en';
  onLogout?: () => void;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
  isOpen,
  onClose,
  user,
  authorProfile,
  savedNotes,
  allNotes,
  onSelectNote,
  onCreateNote,
  onDeleteNote,
  onOpenComments,
  onReact,
  lang,
  onLogout,
}) => {
  // Determine if viewing own profile or public author profile
  const isViewingSelf =
    !authorProfile ||
    (user && (authorProfile.id === user.uid || authorProfile.name === user.displayName));

  const [activeTab, setActiveTab] = useState<ProfileTabType>('timeline');
  const [isFullscreen, setIsFullscreen] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const scrollContainerRef = React.useRef<HTMLDivElement>(null);

  // Profile data states
  const [displayName, setDisplayName] = useState('');
  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('');
  const [location, setLocation] = useState('');
  const [joinedDate, setJoinedDate] = useState('');
  const [website, setWebsite] = useState('');
  const [favoriteScent, setFavoriteScent] = useState('');
  const [favoriteMood, setFavoriteMood] = useState('');
  const [coverPhoto, setCoverPhoto] = useState(
    'https://images.unsplash.com/photo-1518495973542-4542c06a5843?auto=format&fit=crop&w=1400&q=80'
  );
  const [photoURL, setPhotoURL] = useState('');
  const [facebookLink, setFacebookLink] = useState('');
  const [instagramLink, setInstagramLink] = useState('');
  const [twitterLink, setTwitterLink] = useState('');

  // Modals & Panels inside profile
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isChangingCover, setIsChangingCover] = useState(false);
  const [isChangingAvatar, setIsChangingAvatar] = useState(false);
  const [customCoverUrl, setCustomCoverUrl] = useState('');
  const [customAvatarUrl, setCustomAvatarUrl] = useState('');
  const [savingProfile, setSavingProfile] = useState(false);

  // Direct Timeline Create Post state
  const [postQuote, setPostQuote] = useState('');
  const [postCategory, setPostCategory] = useState<'scent' | 'memory' | 'rain' | 'love' | 'solitude'>('memory');
  const [postPaperColor, setPostPaperColor] = useState<'parchment' | 'rose' | 'amber' | 'sage' | 'slate'>('parchment');
  const [postImageUrl, setPostImageUrl] = useState('');
  const [postScentTag, setPostScentTag] = useState('');
  const [postLocation, setPostLocation] = useState('');
  const [isCreatingPost, setIsCreatingPost] = useState(false);
  const [showImageInput, setShowImageInput] = useState(false);

  // Initialize data on open / switch author
  useEffect(() => {
    if (!isOpen) return;

    if (isViewingSelf && user) {
      // Load from user or local cache
      const cached = localStorage.getItem(`user_profile_${user.uid}`);
      const parsed = cached ? JSON.parse(cached) : {};

      setDisplayName(user.displayName || parsed.displayName || (lang === 'bn' ? 'চিরকুট সদস্য' : 'Chirkut Member'));
      setUsername(parsed.username || user.email?.split('@')[0] || 'chirkut.writer');
      setBio(
        user.bio ||
          parsed.bio ||
          (lang === 'bn'
            ? 'কাগজ, কালি ও স্মৃতির সুবাসে নিজের না-বলা কথা চিরকুটে লিখে রাখি।'
            : 'Writing unwritten words in the fragrance of parchment and ink.')
      );
      setLocation(parsed.location || 'ঢাকা, বাংলাদেশ');
      setJoinedDate(parsed.joinedDate || (lang === 'bn' ? 'সেপ্টেম্বর ২০২৪' : 'September 2024'));
      setWebsite(parsed.website || '');
      setFavoriteScent(parsed.favoriteScent || (lang === 'bn' ? 'প্রথম বৃষ্টির ভেজা মাটি ও বকুল ফুল' : 'Petrichor & Night Jasmine'));
      setFavoriteMood(parsed.favoriteMood || (lang === 'bn' ? 'স্মৃতিকাতর নির্জনতা' : 'Nostalgic Solitude'));
      setCoverPhoto(
        parsed.coverPhoto ||
          user.coverPhoto ||
          'https://images.unsplash.com/photo-1518495973542-4542c06a5843?auto=format&fit=crop&w=1400&q=80'
      );
      setPhotoURL(user.photoURL || parsed.photoURL || '');
      setFacebookLink(parsed.socialLinks?.facebook || '');
      setInstagramLink(parsed.socialLinks?.instagram || '');
      setTwitterLink(parsed.socialLinks?.twitter || '');
    } else if (authorProfile) {
      // Public author profile
      const name = authorProfile.name;
      const matched = DEFAULT_AUTHOR_PROFILES[name];

      setDisplayName(name);
      setUsername(matched?.username || name.toLowerCase().replace(/\s+/g, '.'));
      setBio(matched?.bio || (lang === 'bn' ? `চিরকুটের সম্মানিত সংকলক ও লেখক।` : `Author & contributor at Chirkut Archives.`));
      setLocation(matched?.location || (lang === 'bn' ? 'বাংলাদেশ' : 'Bangladesh'));
      setJoinedDate(matched?.joinedDate || (lang === 'bn' ? '২০২৩ থেকে যুক্ত' : 'Joined 2023'));
      setWebsite(matched?.website || '');
      setFavoriteScent(matched?.favoriteScent || (lang === 'bn' ? 'হাসনাহেনা ও চন্দন কাঠ' : 'Jasmine & Sandalwood'));
      setFavoriteMood(matched?.favoriteMood || (lang === 'bn' ? 'সাহিত্য ও মনন' : 'Literature & Solitude'));
      setCoverPhoto(
        matched?.coverPhoto ||
          'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&w=1400&q=80'
      );
      setPhotoURL(authorProfile.avatar || matched?.photoURL || '');
      setFacebookLink(matched?.socialLinks?.facebook || '');
      setInstagramLink(matched?.socialLinks?.instagram || '');
      setTwitterLink(matched?.socialLinks?.twitter || '');
    }
  }, [isOpen, isViewingSelf, user, authorProfile, lang]);

  if (!isOpen) return null;

  // Filter notes belonging to this profile with deduplication
  const rawAuthorNotes = isViewingSelf
    ? user
      ? allNotes.filter((n) => n.authorId === user.uid || (user.displayName && n.author === user.displayName))
      : []
    : authorProfile?.name
    ? allNotes.filter((n) => n.author === authorProfile.name || n.authorId === authorProfile.id)
    : [];
  const authorNotes: ChirkutNote[] = Array.from(new Map<string, ChirkutNote>(rawAuthorNotes.map((n) => [n.id, n])).values());

  // Filter all media (photos/videos) from notes
  const rawUserMediaNotes = authorNotes.filter((n) => (n.bgImageUrl && n.bgImageUrl.trim()) || (n.videoUrl && n.videoUrl.trim()));
  const userMediaNotes: ChirkutNote[] = Array.from(new Map<string, ChirkutNote>(rawUserMediaNotes.map((n) => [n.id, n])).values());

  // Filter reacted notes
  const rawReactedNotes = allNotes.filter((n) => n.userReaction);
  const reactedNotes: ChirkutNote[] = Array.from(new Map<string, ChirkutNote>(rawReactedNotes.map((n) => [n.id, n])).values());

  // Deduplicate saved notes
  const uniqueSavedNotes: ChirkutNote[] = Array.from(new Map<string, ChirkutNote>(savedNotes.map((n) => [n.id, n])).values());

  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch {
      // ignore
    }
    localStorage.removeItem('chirkut_active_user');
    onLogout?.();
    onClose();
  };

  const handleSaveProfile = async () => {
    if (!user) return;
    setSavingProfile(true);
    const updatedData = {
      displayName: displayName.trim(),
      username: username.trim(),
      bio: bio.trim(),
      location: location.trim(),
      joinedDate: joinedDate.trim(),
      website: website.trim(),
      favoriteScent: favoriteScent.trim(),
      favoriteMood: favoriteMood.trim(),
      coverPhoto,
      photoURL,
      socialLinks: {
        facebook: facebookLink.trim(),
        instagram: instagramLink.trim(),
        twitter: twitterLink.trim(),
      },
    };

    try {
      localStorage.setItem(`user_profile_${user.uid}`, JSON.stringify(updatedData));
      await setDoc(doc(db, 'users', user.uid), updatedData, { merge: true });
    } catch {
      // ignore fallback
    } finally {
      setSavingProfile(false);
      setIsEditingProfile(false);
    }
  };

  const handleCreateTimelineNote = () => {
    if (!postQuote.trim() || !postScentTag.trim()) return;
    if (!onCreateNote) return;

    setIsCreatingPost(true);
    const newNote: ChirkutNote = {
      id: `chirkut-${Date.now()}`,
      quote: postQuote.trim(),
      quoteBn: lang === 'bn' ? postQuote.trim() : undefined,
      author: displayName || user?.displayName || (lang === 'bn' ? 'চিরকুট লেখক' : 'Chirkut Author'),
      authorId: user?.uid,
      authorAvatar: photoURL || user?.photoURL || undefined,
      location: postLocation.trim() || location || (lang === 'bn' ? 'ব্যক্তিগত সংগ্রহ' : 'Personal Journal'),
      date: lang === 'bn' ? 'আজকের চিরকুট' : 'Today',
      category: postCategory,
      paperColor: postPaperColor,
      bgImageUrl: postImageUrl.trim() || undefined,
      mediaType: postImageUrl.trim() ? 'image' : 'text',
      scentProfile: postScentTag.trim()
        ? { top: postScentTag.trim(), heart: favoriteScent || 'গোলাপ জল', base: 'উষ্ণ পার্চমেন্ট' }
        : undefined,
      fullStory: postQuote.trim(),
      fullStoryBn: lang === 'bn' ? postQuote.trim() : undefined,
      likesCount: 0,
      commentsCount: 0,
      sharesCount: 0,
      createdAt: new Date().toISOString(),
    };

    onCreateNote(newNote);
    setPostQuote('');
    setPostImageUrl('');
    setPostScentTag('');
    setPostLocation('');
    setShowImageInput(false);
    setIsCreatingPost(false);
  };

  const handleShareProfile = () => {
    if (navigator.share) {
      navigator
        .share({
          title: `${displayName} | চিরকুট প্রোফাইল`,
          text: `চিরকুটে ${displayName}-এর লেখা ও সুবাসের টাইমলাইন দেখুন।`,
          url: window.location.href,
        })
        .catch(() => {});
    } else {
      navigator.clipboard?.writeText(window.location.href);
      alert(lang === 'bn' ? 'প্রোফাইল লিংক কপি করা হয়েছে!' : 'Profile link copied to clipboard!');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md animate-in fade-in duration-200">
      <div className="fixed inset-0" onClick={onClose} />

      {/* Main Profile Container */}
      <div
        ref={scrollContainerRef}
        onScroll={(e) => {
          setIsScrolled(e.currentTarget.scrollTop > 220);
        }}
        className={`relative z-10 w-full bg-[#14100E] border border-[#2C231B] shadow-2xl text-[#FAF3EB] flex flex-col transition-all duration-300 ${
          isFullscreen
            ? 'h-full max-h-screen rounded-none overflow-y-auto'
            : 'max-w-5xl max-h-[92vh] rounded-2xl overflow-y-auto m-2 sm:m-4'
        }`}
      >
        {/* Profile Header (Cover, Avatar, Meta, Actions) */}
        <ProfileHeader
          isViewingSelf={isViewingSelf}
          isFullscreen={isFullscreen}
          onToggleFullscreen={() => setIsFullscreen(!isFullscreen)}
          onShareProfile={handleShareProfile}
          onClose={onClose}
          displayName={displayName}
          username={username}
          bio={bio}
          location={location}
          instagramLink={instagramLink}
          notesCount={authorNotes.length}
          savedCount={uniqueSavedNotes.length}
          reactionsCount={reactedNotes.length}
          mediaCount={userMediaNotes.length}
          activeTab={activeTab}
          onSelectTab={setActiveTab}
          coverPhoto={coverPhoto}
          photoURL={photoURL}
          user={user}
          isChangingCover={isChangingCover}
          setIsChangingCover={setIsChangingCover}
          isChangingAvatar={isChangingAvatar}
          setIsChangingAvatar={setIsChangingAvatar}
          setCoverPhoto={setCoverPhoto}
          setPhotoURL={setPhotoURL}
          customCoverUrl={customCoverUrl}
          setCustomCoverUrl={setCustomCoverUrl}
          customAvatarUrl={customAvatarUrl}
          setCustomAvatarUrl={setCustomAvatarUrl}
          onEditProfile={() => setIsEditingProfile(true)}
          onSignOut={handleSignOut}
          isFollowing={isFollowing}
          setIsFollowing={setIsFollowing}
          onSelectTimeline={() => setActiveTab('timeline')}
          lang={lang}
        />

        {/* Main Grid: Sidebar + Active Tab Content */}
        <div className="max-w-6xl w-full mx-auto px-4 sm:px-8">
          <div className="py-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Sidebar */}
            <ProfileAboutSidebar
              location={location}
              joinedDate={joinedDate}
              favoriteScent={favoriteScent}
              favoriteMood={favoriteMood}
              website={website}
              facebookLink={facebookLink}
              instagramLink={instagramLink}
              twitterLink={twitterLink}
              isViewingSelf={isViewingSelf}
              onEditProfile={() => setIsEditingProfile(true)}
              userMediaNotes={userMediaNotes}
              onSelectNote={onSelectNote}
              onViewAllPhotos={() => setActiveTab('photos')}
              lang={lang}
            />

            {/* Right Tab Content */}
            <div className="lg:col-span-8 space-y-6">
              {/* TAB 1: TIMELINE */}
              {activeTab === 'timeline' && (
                <div className="space-y-5">
                  {isViewingSelf && (
                    <ProfileTimelineComposer
                      displayName={displayName}
                      photoURL={photoURL}
                      postQuote={postQuote}
                      setPostQuote={setPostQuote}
                      showImageInput={showImageInput}
                      setShowImageInput={setShowImageInput}
                      postImageUrl={postImageUrl}
                      setPostImageUrl={setPostImageUrl}
                      postScentTag={postScentTag}
                      setPostScentTag={setPostScentTag}
                      postLocation={postLocation}
                      setPostLocation={setPostLocation}
                      postPaperColor={postPaperColor}
                      setPostPaperColor={setPostPaperColor}
                      postCategory={postCategory}
                      setPostCategory={setPostCategory}
                      onCreateNote={handleCreateTimelineNote}
                      isCreatingPost={isCreatingPost}
                      lang={lang}
                    />
                  )}

                  <ProfileTimelineFeed
                    authorNotes={authorNotes}
                    isViewingSelf={isViewingSelf}
                    displayName={displayName}
                    photoURL={photoURL}
                    onSelectNote={onSelectNote}
                    onDeleteNote={onDeleteNote}
                    onOpenComments={onOpenComments}
                    onReact={onReact}
                    lang={lang}
                  />
                </div>
              )}

              {/* TAB 2: FRIENDS */}
              {activeTab === 'friends' && (
                <ProfileFriendsTab lang={lang} />
              )}

              {/* TAB 3: PHOTOS */}
              {activeTab === 'photos' && (
                <ProfilePhotosTab
                  userMediaNotes={userMediaNotes}
                  onSelectNote={onSelectNote}
                  lang={lang}
                />
              )}

              {/* TAB 4: SAVED */}
              {activeTab === 'saved' && (
                <ProfileSavedTab
                  savedNotes={uniqueSavedNotes}
                  onSelectNote={onSelectNote}
                  lang={lang}
                />
              )}

              {/* TAB 5: REACTIONS */}
              {activeTab === 'reactions' && (
                <ProfileReactionsTab
                  reactedNotes={reactedNotes}
                  onSelectNote={onSelectNote}
                  lang={lang}
                />
              )}

              {/* TAB 6: ABOUT */}
              {activeTab === 'about' && (
                <ProfileAboutTab
                  displayName={displayName}
                  bio={bio}
                  favoriteScent={favoriteScent}
                  favoriteMood={favoriteMood}
                  location={location}
                  joinedDate={joinedDate}
                  lang={lang}
                />
              )}
            </div>
          </div>
        </div>

        {/* Edit Profile Modal */}
        <ProfileEditModal
          isOpen={isEditingProfile}
          onClose={() => setIsEditingProfile(false)}
          displayName={displayName}
          setDisplayName={setDisplayName}
          username={username}
          setUsername={setUsername}
          bio={bio}
          setBio={setBio}
          location={location}
          setLocation={setLocation}
          joinedDate={joinedDate}
          setJoinedDate={setJoinedDate}
          favoriteScent={favoriteScent}
          setFavoriteScent={setFavoriteScent}
          favoriteMood={favoriteMood}
          setFavoriteMood={setFavoriteMood}
          website={website}
          setWebsite={setWebsite}
          facebookLink={facebookLink}
          setFacebookLink={setFacebookLink}
          instagramLink={instagramLink}
          setInstagramLink={setInstagramLink}
          twitterLink={twitterLink}
          setTwitterLink={setTwitterLink}
          onSaveProfile={handleSaveProfile}
          savingProfile={savingProfile}
          lang={lang}
        />
      </div>
    </div>
  );
};
