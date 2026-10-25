import React, { useState, useEffect } from 'react';
import { X, Settings as SettingsIcon, User, Shield, Bell, Palette, Globe, Trash2, UserMinus } from 'lucide-react';
import { UserProfile, UserSettings, PrivacySettings, AccountSettings } from '../../types';
import { getUserSettings, createDefaultSettings, updateUserSettings, updateUserProfile } from '../../services/settings';
import { blockUser, getBlockedUsers, unblockUser } from '../../services/block';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile | null;
  lang: 'bn' | 'en';
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, user, lang }) => {
  const [activeSection, setActiveSection] = useState<'account' | 'privacy' | 'notifications' | 'appearance' | 'blocked'>('account');
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [account, setAccount] = useState<AccountSettings>({
    displayName: '',
    email: '',
    bio: '',
    location: '',
    website: '',
    favoriteScent: '',
    favoriteMood: '',
  });
  const [blockedUsers, setBlockedUsers] = useState<UserProfile[]>([]);

  useEffect(() => {
    if (!isOpen || !user) return;
    loadSettings();
  }, [isOpen, user?.uid]);

  const loadSettings = async () => {
    if (!user) return;
    let userSettings = await getUserSettings(user.uid);
    if (!userSettings) {
      await createDefaultSettings(user.uid);
      userSettings = await getUserSettings(user.uid);
    }
    if (userSettings) setSettings(userSettings);
    setAccount({
      displayName: user.displayName || '',
      email: user.email || '',
      bio: user.bio || '',
      location: user.location || '',
      website: user.website || '',
      favoriteScent: user.favoriteScent || '',
      favoriteMood: user.favoriteMood || '',
    });
  };

  const handleSaveAccount = async () => {
    if (!user) return;
    await updateUserProfile(user.uid, account);
    alert(lang === 'bn' ? 'প্রোফাইল আপডেট হয়েছে!' : 'Profile updated!');
  };

  const handleSavePrivacy = async (key: keyof UserSettings, value: any) => {
    if (!user || !settings) return;
    const updated = { ...settings, [key]: value };
    setSettings(updated);
    await updateUserSettings(user.uid, { [key]: value });
  };

  const handleSaveNotifications = async (key: keyof UserSettings, value: boolean) => {
    if (!user || !settings) return;
    const updated = { ...settings, [key]: value };
    setSettings(updated);
    await updateUserSettings(user.uid, { [key]: value });
  };

  const handleSaveAppearance = async (key: keyof UserSettings, value: any) => {
    if (!user || !settings) return;
    const updated = { ...settings, [key]: value };
    setSettings(updated);
    await updateUserSettings(user.uid, { [key]: value });
  };

  if (!isOpen) return null;

  const sections = [
    { id: 'account', label: lang === 'bn' ? 'অ্যাকাউন্ট' : 'Account', icon: User },
    { id: 'privacy', label: lang === 'bn' ? 'গোপনীয়তা' : 'Privacy', icon: Shield },
    { id: 'notifications', label: lang === 'bn' ? 'নোটিফিকেশন' : 'Notifications', icon: Bell },
    { id: 'appearance', label: lang === 'bn' ? 'দেখুন' : 'Appearance', icon: Palette },
    { id: 'blocked', label: lang === 'bn' ? 'ব্লক করা' : 'Blocked', icon: UserMinus },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="fixed inset-0" onClick={onClose} />
      <div className="relative z-10 w-full max-w-3xl bg-[#1A1512] border border-[#3D322B] rounded-2xl shadow-2xl text-[#E8DFD8] max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-[#2C241E]">
          <div className="flex items-center gap-2">
            <SettingsIcon className="w-5 h-5 text-[#C5A880]" />
            <h3 className="font-serif text-2xl text-[#FAF3EB] font-light">
              {lang === 'bn' ? 'সেটিংস' : 'Settings'}
            </h3>
          </div>
          <button onClick={onClose} className="p-1.5 text-[#8C7A6B] hover:text-[#FAF3EB]">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex flex-1 overflow-hidden">
          <div className="w-48 border-r border-[#2C241E] p-4 space-y-2">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id as any)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-serif transition-all ${
                  activeSection === section.id
                    ? 'bg-[#C5A880]/15 text-[#FAF3EB] border border-[#C5A880]/30'
                    : 'text-[#8C7A6B] hover:text-[#FAF3EB] hover:bg-[#251E19]'
                }`}
              >
                <section.icon className="w-4 h-4" />
                {section.label}
              </button>
            ))}
          </div>

          <div className="flex-1 p-6 overflow-y-auto">
            {activeSection === 'account' && (
              <div className="space-y-4">
                <h4 className="font-serif text-lg text-[#FAF3EB] mb-4">
                  {lang === 'bn' ? 'অ্যাকাউন্ট তথ্য' : 'Account Information'}
                </h4>
                <div>
                  <label className="block text-xs uppercase tracking-widest text-[#A39282] font-serif mb-1">
                    {lang === 'bn' ? 'নাম' : 'Display Name'}
                  </label>
                  <input
                    type="text"
                    value={account.displayName}
                    onChange={(e) => setAccount({ ...account, displayName: e.target.value })}
                    className="w-full px-3.5 py-2 bg-[#130F0D] border border-[#382E25] focus:border-[#C5A880] rounded-xl text-xs font-serif text-[#FAF3EB] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-widest text-[#A39282] font-serif mb-1">
                    {lang === 'bn' ? 'ইমেইল' : 'Email'}
                  </label>
                  <input
                    type="email"
                    value={account.email}
                    disabled
                    className="w-full px-3.5 py-2 bg-[#0A0806] border border-[#382E25] rounded-xl text-xs font-serif text-[#8C7A6B] cursor-not-allowed"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-widest text-[#A39282] font-serif mb-1">
                    {lang === 'bn' ? 'বায়ো' : 'Bio'}
                  </label>
                  <textarea
                    rows={3}
                    value={account.bio}
                    onChange={(e) => setAccount({ ...account, bio: e.target.value })}
                    className="w-full px-3.5 py-2 bg-[#130F0D] border border-[#382E25] focus:border-[#C5A880] rounded-xl text-xs font-serif text-[#FAF3EB] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-widest text-[#A39282] font-serif mb-1">
                    {lang === 'bn' ? 'অবস্থান' : 'Location'}
                  </label>
                  <input
                    type="text"
                    value={account.location}
                    onChange={(e) => setAccount({ ...account, location: e.target.value })}
                    className="w-full px-3.5 py-2 bg-[#130F0D] border border-[#382E25] focus:border-[#C5A880] rounded-xl text-xs font-serif text-[#FAF3EB] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-widest text-[#A39282] font-serif mb-1">
                    {lang === 'bn' ? 'ওয়েবসাইট' : 'Website'}
                  </label>
                  <input
                    type="text"
                    value={account.website}
                    onChange={(e) => setAccount({ ...account, website: e.target.value })}
                    className="w-full px-3.5 py-2 bg-[#130F0D] border border-[#382E25] focus:border-[#C5A880] rounded-xl text-xs font-serif text-[#FAF3EB] focus:outline-none"
                  />
                </div>
                <button
                  onClick={handleSaveAccount}
                  className="px-6 py-2.5 rounded-xl bg-[#C5A880] text-[#14110F] font-serif font-semibold text-xs tracking-wider uppercase hover:bg-[#D4AF37] transition-all shadow-lg"
                >
                  {lang === 'bn' ? 'সংরক্ষণ করুন' : 'Save Changes'}
                </button>
              </div>
            )}

            {activeSection === 'privacy' && (
              <div className="space-y-4">
                <h4 className="font-serif text-lg text-[#FAF3EB] mb-4">
                  {lang === 'bn' ? 'গোপনীয়তা সেটিংস' : 'Privacy Settings'}
                </h4>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 rounded-xl bg-[#201915] border border-[#2D231B]">
                    <div>
                      <p className="text-sm font-serif text-[#FAF3EB]">
                        {lang === 'bn' ? 'প্রোফাইল ভিজিবিলিটি' : 'Profile Visibility'}
                      </p>
                      <p className="text-[10px] font-serif text-[#786657]">
                        {lang === 'bn' ? 'কে আপনার প্রোফাইল দেখতে পারে' : 'Who can see your profile'}
                      </p>
                    </div>
                    <select
                      value={settings?.profileVisibility || 'public'}
                      onChange={(e) => handleSavePrivacy('profileVisibility', e.target.value)}
                      className="px-3 py-1.5 bg-[#130F0D] border border-[#382E25] focus:border-[#C5A880] rounded-xl text-xs font-serif text-[#FAF3EB] focus:outline-none"
                    >
                      <option value="public">{lang === 'bn' ? 'সবার জন্য' : 'Public'}</option>
                      <option value="friends">{lang === 'bn' ? 'শুধুমাত্র বন্ধুদের জন্য' : 'Friends Only'}</option>
                      <option value="only_me">{lang === 'bn' ? 'শুধুমাত্র আমি' : 'Only Me'}</option>
                    </select>
                  </div>
                  <ToggleSetting
                    label={lang === 'bn' ? 'ইমেইল দেখান' : 'Show Email'}
                    description={lang === 'bn' ? 'আপনার ইমেইল অন্যান্য ব্যবহারকারীদের কাছে দৃশ্যমান থাকবে' : 'Make your email visible to others'}
                    checked={settings?.showEmail || false}
                    onChange={(checked) => handleSavePrivacy('showEmail', checked)}
                    lang={lang}
                  />
                  <ToggleSetting
                    label={lang === 'bn' ? 'অবস্থান দেখান' : 'Show Location'}
                    description={lang === 'bn' ? 'আপনার অবস্থান অন্যান্য ব্যবহারকারীদের কাছে দৃশ্যমান থাকবে' : 'Make your location visible to others'}
                    checked={settings?.showLocation || false}
                    onChange={(checked) => handleSavePrivacy('showLocation', checked)}
                    lang={lang}
                  />
                  <ToggleSetting
                    label={lang === 'bn' ? 'বন্ধুর তালিকা দেখান' : 'Show Friends List'}
                    description={lang === 'bn' ? 'আপনার বন্ধুর তালিকা অন্যান্য ব্যবহারকারীদের কাছে দৃশ্যমান থাকবে' : 'Make your friends list visible to others'}
                    checked={settings?.showFriendsList || false}
                    onChange={(checked) => handleSavePrivacy('showFriendsList', checked)}
                    lang={lang}
                  />
                  <ToggleSetting
                    label={lang === 'bn' ? 'বন্ধুত্বের অনুরোধ গ্রহণ করুন' : 'Allow Friend Requests'}
                    description={lang === 'bn' ? 'অন্যান্য ব্যবহারকারীরা আপনার সাথে বন্ধুত্বের অনুরোধ পাঠাতে পারবে' : 'Allow others to send you friend requests'}
                    checked={settings?.allowFriendRequests !== false}
                    onChange={(checked) => handleSavePrivacy('allowFriendRequests', checked)}
                    lang={lang}
                  />
                </div>
              </div>
            )}

            {activeSection === 'notifications' && (
              <div className="space-y-4">
                <h4 className="font-serif text-lg text-[#FAF3EB] mb-4">
                  {lang === 'bn' ? 'নোটিফিকেশন সেটিংস' : 'Notification Settings'}
                </h4>
                <div className="space-y-4">
                  <ToggleSetting
                    label={lang === 'bn' ? 'ইমেইল নোটিফিকেশন' : 'Email Notifications'}
                    description={lang === 'bn' ? 'ইমেইলে আপডেট ও নোটিফিকেশন পান' : 'Receive updates and notifications via email'}
                    checked={settings?.emailNotifications || false}
                    onChange={(checked) => handleSaveNotifications('emailNotifications', checked)}
                    lang={lang}
                  />
                  <ToggleSetting
                    label={lang === 'bn' ? 'পুশ নোটিফিকেশন' : 'Push Notifications'}
                    description={lang === 'bn' ? 'ব্রাউজার পুশ নোটিফিকেশন পান' : 'Receive browser push notifications'}
                    checked={settings?.pushNotifications || false}
                    onChange={(checked) => handleSaveNotifications('pushNotifications', checked)}
                    lang={lang}
                  />
                </div>
              </div>
            )}

            {activeSection === 'appearance' && (
              <div className="space-y-4">
                <h4 className="font-serif text-lg text-[#FAF3EB] mb-4">
                  {lang === 'bn' ? 'চেহারা ও ভাষা' : 'Appearance & Language'}
                </h4>
                <div>
                  <label className="block text-xs uppercase tracking-widest text-[#A39282] font-serif mb-2">
                    {lang === 'bn' ? 'ভাষা' : 'Language'}
                  </label>
                  <select
                    value={settings?.language || 'bn'}
                    onChange={(e) => handleSaveAppearance('language', e.target.value)}
                    className="w-full px-3.5 py-2 bg-[#130F0D] border border-[#382E25] focus:border-[#C5A880] rounded-xl text-xs font-serif text-[#FAF3EB] focus:outline-none"
                  >
                    <option value="bn">বাংলা</option>
                    <option value="en">English</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-widest text-[#A39282] font-serif mb-2">
                    {lang === 'bn' ? 'থিম' : 'Theme'}
                  </label>
                  <select
                    value={settings?.theme || 'dark'}
                    onChange={(e) => handleSaveAppearance('theme', e.target.value)}
                    className="w-full px-3.5 py-2 bg-[#130F0D] border border-[#382E25] focus:border-[#C5A880] rounded-xl text-xs font-serif text-[#FAF3EB] focus:outline-none"
                  >
                    <option value="dark">{lang === 'bn' ? 'ডার্ক' : 'Dark'}</option>
                    <option value="light">{lang === 'bn' ? 'লাইট' : 'Light'}</option>
                    <option value="auto">{lang === 'bn' ? 'অটো' : 'Auto'}</option>
                  </select>
                </div>
              </div>
            )}

            {activeSection === 'blocked' && (
              <div className="space-y-4">
                <h4 className="font-serif text-lg text-[#FAF3EB] mb-4">
                  {lang === 'bn' ? 'ব্লক করা ব্যবহারকারী' : 'Blocked Users'}
                </h4>
                <div className="space-y-3">
                  {blockedUsers.length === 0 ? (
                    <div className="text-center py-12 text-xs font-serif text-[#8C7A6B]">
                      <UserMinus className="w-8 h-8 mx-auto mb-2 text-[#C5A880]/50" />
                      <span>{lang === 'bn' ? 'কোনো ব্যবহারকারী ব্লক করা হয়নি।' : 'No blocked users.'}</span>
                    </div>
                  ) : (
                    blockedUsers.map((blockedUser) => (
                      <div key={blockedUser.uid} className="flex items-center justify-between p-3 rounded-xl bg-[#201915] border border-[#2D231B]">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-[#382B21] overflow-hidden flex items-center justify-center text-xs text-[#FAF3EB]">
                            {blockedUser.photoURL && blockedUser.photoURL.trim() ? (
                              <img src={blockedUser.photoURL} alt={blockedUser.displayName || 'User'} className="w-full h-full object-cover" />
                            ) : (
                              (blockedUser.displayName && blockedUser.displayName.length > 0 ? blockedUser.displayName[0] : '?')
                            )}
                          </div>
                          <div>
                            <p className="text-sm font-serif text-[#FAF3EB] font-medium">{blockedUser.displayName}</p>
                            <p className="text-[10px] font-serif text-[#786657]">
                              {lang === 'bn' ? 'ব্লক করা হয়েছে' : 'Blocked'}
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={async () => {
                            if (!user) return;
                            await unblockUser(user.uid, blockedUser.uid);
                            setBlockedUsers((prev) => prev.filter((u) => u.uid !== blockedUser.uid));
                          }}
                          className="px-3 py-1.5 rounded-lg border border-[#C5A880]/50 text-[#C5A880] hover:bg-[#C5A880]/15 text-xs font-serif transition-colors"
                        >
                          {lang === 'bn' ? 'আনব্লক' : 'Unblock'}
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const ToggleSetting: React.FC<{
  label: string;
  description: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  lang: 'bn' | 'en';
}> = ({ label, description, checked, onChange, lang }) => (
  <div className="flex items-center justify-between p-4 rounded-xl bg-[#201915] border border-[#2D231B]">
    <div>
      <p className="text-sm font-serif text-[#FAF3EB]">{label}</p>
      <p className="text-[10px] font-serif text-[#786657]">{description}</p>
    </div>
    <button
      onClick={() => onChange(!checked)}
      className={`relative w-11 h-6 rounded-full transition-colors ${
        checked ? 'bg-[#C5A880]' : 'bg-[#382E25]'
      }`}
    >
      <div
        className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform ${
          checked ? 'translate-x-5' : 'translate-x-0'
        }`}
      />
    </button>
  </div>
);
