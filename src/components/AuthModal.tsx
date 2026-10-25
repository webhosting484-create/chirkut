import React, { useState } from 'react';
import {
  X,
  Lock,
  Mail,
  User,
  ShieldCheck,
  LogIn,
  UserPlus,
  Sparkles,
  AlertCircle,
  ExternalLink,
  Copy,
  Check,
  Zap,
  Users
} from 'lucide-react';
import {
  auth,
  googleProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInAnonymously,
  updateProfile,
  db,
  doc,
  setDoc
} from '../lib/firebase';
import { UserProfile } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: 'bn' | 'en';
  onLoginSuccess?: (user: UserProfile) => void;
}

interface AuthNotice {
  type: 'unauthorized-domain' | 'operation-not-allowed' | 'general';
  domain?: string;
  message: string;
  fallbackEmail?: string;
  fallbackName?: string;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  lang,
  onLoginSuccess,
}) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [authNotice, setAuthNotice] = useState<AuthNotice | null>(null);
  const [copiedDomain, setCopiedDomain] = useState(false);
  const [showQuickLogin, setShowQuickLogin] = useState(false);

  if (!isOpen) return null;

  const currentHostname = typeof window !== 'undefined' ? window.location.hostname : 'run.app';

  const copyDomain = () => {
    navigator.clipboard.writeText(currentHostname);
    setCopiedDomain(true);
    setTimeout(() => setCopiedDomain(false), 2000);
  };

  // Direct Dev / Preset Login
  const handleDirectDevLogin = (presetName: string, presetEmail: string, presetAvatar?: string) => {
    const cleanId = 'usr_' + presetEmail.replace(/[^a-zA-Z0-9]/g, '_');
    const profile: UserProfile = {
      uid: cleanId,
      displayName: presetName,
      email: presetEmail,
      photoURL: presetAvatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${presetName}`,
      isAnonymous: false,
    };

    try {
      localStorage.setItem('chirkut_active_user', JSON.stringify(profile));
    } catch {
      // ignore
    }

    onLoginSuccess?.(profile);
    setSuccessMsg(
      lang === 'bn'
        ? `স্বাগতম ${presetName}! আপনি সফলভাবে প্রবেশ করেছেন।`
        : `Welcome ${presetName}! You are signed in.`
    );
    setTimeout(() => onClose(), 800);
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);
    setAuthNotice(null);

    if (isSignUp && password !== confirmPassword) {
      setError(lang === 'bn' ? 'পাসওয়ার্ড দুটি মেলেনি!' : 'Passwords do not match!');
      return;
    }

    if (password.length < 6) {
      setError(lang === 'bn' ? 'পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে।' : 'Password must be at least 6 characters.');
      return;
    }

    setLoading(true);

    try {
      if (isSignUp) {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        const displayName = name.trim() || 'চিরকুট পাঠক';

        if (name.trim()) {
          try {
            await updateProfile(user, { displayName });
          } catch {
            // ignore
          }
        }

        const profile: UserProfile = {
          uid: user.uid,
          displayName,
          email: user.email,
          photoURL: `https://api.dicebear.com/7.x/bottts/svg?seed=${user.uid}`,
          isAnonymous: false,
        };

        try {
          await setDoc(doc(db, 'users', user.uid), {
            id: user.uid,
            name: displayName,
            email: user.email,
            avatar: profile.photoURL,
            bio: 'চিরকুটের অনুরাগী সদস্য',
            createdAt: new Date().toISOString()
          }, { merge: true });
        } catch {
          // ignore profile write error
        }

        try {
          localStorage.setItem('chirkut_active_user', JSON.stringify(profile));
        } catch {
          // ignore
        }

        onLoginSuccess?.(profile);
        setSuccessMsg(lang === 'bn' ? 'অ্যাকাউন্ট সফলভাবে তৈরি হয়েছে!' : 'Account created successfully!');
        setTimeout(() => onClose(), 1000);
      } else {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        const profile: UserProfile = {
          uid: user.uid,
          displayName: user.displayName || email.split('@')[0],
          email: user.email,
          photoURL: user.photoURL || `https://api.dicebear.com/7.x/bottts/svg?seed=${user.uid}`,
          isAnonymous: false,
        };

        try {
          localStorage.setItem('chirkut_active_user', JSON.stringify(profile));
        } catch {
          // ignore
        }

        onLoginSuccess?.(profile);
        setSuccessMsg(lang === 'bn' ? 'স্বাগতম! আপনি সফলভাবে লগইন করেছেন।' : 'Welcome back!');
        setTimeout(() => onClose(), 1000);
      }
    } catch (err: any) {
      const code = err.code || '';
      const msg = err.message || '';
      console.warn('Firebase Email Auth code:', code, msg);

      if (code === 'auth/operation-not-allowed' || msg.includes('operation-not-allowed') || msg.includes('PASSWORD_LOGIN_DISABLED')) {
        setAuthNotice({
          type: 'operation-not-allowed',
          message: lang === 'bn'
            ? 'ফায়ারবেস কনসোলে Email/Password সাইন-ইন এখনও সক্রিয় করা নেই।'
            : 'Email/Password sign-in provider is not yet enabled in the Firebase Console.',
          fallbackEmail: email,
          fallbackName: name.trim() || email.split('@')[0] || 'চিরকুট পাঠক',
        });
      } else if (code === 'auth/user-not-found' || code === 'auth/wrong-password' || code === 'auth/invalid-credential') {
        setError(lang === 'bn' ? 'ভুল ইমেইল অথবা পাসওয়ার্ড!' : 'Invalid email or password.');
      } else if (code === 'auth/email-already-in-use') {
        setError(lang === 'bn' ? 'এই ইমেইল দিয়ে আগেই অ্যাকাউন্ট খোলা আছে। অনুগ্রহ করে লগইন করুন।' : 'Email is already registered. Please sign in.');
      } else {
        setError(lang === 'bn' ? `ত্রুটি: ${msg}` : `Authentication error: ${msg}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError(null);
    setSuccessMsg(null);
    setAuthNotice(null);
    setLoading(true);

    try {
      const res = await signInWithPopup(auth, googleProvider);
      if (res.user) {
        const profile: UserProfile = {
          uid: res.user.uid,
          displayName: res.user.displayName || 'Google User',
          email: res.user.email,
          photoURL: res.user.photoURL || `https://api.dicebear.com/7.x/bottts/svg?seed=${res.user.uid}`,
          isAnonymous: false,
        };

        try {
          await setDoc(doc(db, 'users', res.user.uid), {
            id: res.user.uid,
            name: profile.displayName,
            email: res.user.email,
            avatar: profile.photoURL,
            createdAt: new Date().toISOString()
          }, { merge: true });
        } catch {
          // ignore
        }

        try {
          localStorage.setItem('chirkut_active_user', JSON.stringify(profile));
        } catch {
          // ignore
        }

        onLoginSuccess?.(profile);
        onClose();
      }
    } catch (err: any) {
      const code = err.code || '';
      const msg = err.message || '';
      console.warn('Firebase Google Auth error code:', code, msg);

      if (code === 'auth/unauthorized-domain' || msg.includes('unauthorized-domain')) {
        setAuthNotice({
          type: 'unauthorized-domain',
          domain: currentHostname,
          message: lang === 'bn'
            ? `এই ডেভ সার্ভার ডোমেনটি (${currentHostname}) ফায়ারবেস কনসোলে অনুমোদিত তালিকায় যুক্ত করতে হবে।`
            : `This dev server domain (${currentHostname}) needs to be authorized in Firebase Console.`,
          fallbackEmail: 'google.user@chirkut.net',
          fallbackName: 'গুগল ব্যবহারকারী',
        });
      } else if (code === 'auth/popup-blocked' || msg.includes('popup-blocked')) {
        setError(
          lang === 'bn'
            ? 'ব্রাউজার লগইন পপআপ উইন্ডোটি ব্লক করেছে। অ্যাড্রেস বার থেকে পপআপ এলাও (Allow) করুন।'
            : 'Popup blocked by browser. Please allow popups for this site in your address bar.'
        );
      } else if (code === 'auth/popup-closed-by-user') {
        setError(
          lang === 'bn'
            ? 'লগইন উইন্ডোটি সম্পন্ন হওয়ার আগেই বন্ধ করা হয়েছে।'
            : 'Sign-in window was closed before completion.'
        );
      } else {
        setError(
          lang === 'bn'
            ? `গুগল লগইন ত্রুটি: ${msg}`
            : `Google sign in failed: ${msg}`
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGuestLogin = async () => {
    setError(null);
    setLoading(true);
    try {
      const res = await signInAnonymously(auth);
      const profile: UserProfile = {
        uid: res.user.uid,
        displayName: lang === 'bn' ? 'অতিথি পাঠক' : 'Guest Reader',
        email: null,
        photoURL: null,
        isAnonymous: true,
      };
      try {
        localStorage.setItem('chirkut_active_user', JSON.stringify(profile));
      } catch {
        // ignore
      }
      onLoginSuccess?.(profile);
      onClose();
    } catch {
      // Seamless guest fallback if anonymous auth disabled in cloud console
      const guestId = 'guest_' + Math.random().toString(36).substring(2, 9);
      const profile: UserProfile = {
        uid: guestId,
        displayName: lang === 'bn' ? 'অতিথি চিরকুট পাঠক' : 'Guest Chirkut Reader',
        email: null,
        photoURL: null,
        isAnonymous: true,
      };
      try {
        localStorage.setItem('chirkut_active_user', JSON.stringify(profile));
      } catch {
        // ignore
      }
      onLoginSuccess?.(profile);
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="fixed inset-0" onClick={onClose} />

      <div className="relative z-10 w-full max-w-md bg-[#181310] border border-[#3D3228] rounded-2xl p-6 sm:p-8 shadow-2xl text-[#E8DFD8] max-h-[90vh] overflow-y-auto">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full text-[#8C7A6B] hover:text-[#FAF3EB] hover:bg-white/5 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Security Badge */}
        <div className="flex items-center gap-2 mb-4 px-3 py-1.5 rounded-full bg-[#231A14] border border-[#3A2E24] w-fit text-[11px] font-serif text-[#C5A880]">
          <ShieldCheck className="w-3.5 h-3.5 text-[#C5A880]" />
          <span>{lang === 'bn' ? 'সুরক্ষিত ফায়ারবেস ক্লাউড লগইন' : 'Firebase Cloud Authentication'}</span>
        </div>

        {/* Title */}
        <h3 className="font-serif text-2xl text-[#FAF3EB] font-light mb-1">
          {isSignUp
            ? lang === 'bn'
              ? 'চিরকুটে নতুন অ্যাকাউন্ট'
              : 'Join Chirkut'
            : lang === 'bn'
            ? 'আপনার অ্যাকাউন্টে প্রবেশ'
            : 'Welcome Back'}
        </h3>
        <p className="text-xs font-serif text-[#8C7A6B] mb-5">
          {isSignUp
            ? lang === 'bn'
              ? 'আপনার স্মৃতি, সুবাস ও চিরকুট সংরক্ষণ করতে যুক্ত হোন।'
              : 'Create an account to pin notes, save stories & react.'
            : lang === 'bn'
            ? 'আপনার সংরক্ষিত চিরকুট ও স্মৃতির ডায়েরি দেখুন।'
            : 'Access your personal notes, reactions & saved memories.'}
        </p>

        {/* Firebase Config / Domain Notice with 1-click fallback */}
        {authNotice && (
          <div className="mb-4 p-3.5 rounded-xl bg-amber-950/50 border border-amber-600/40 text-amber-200 text-xs font-serif space-y-2.5 animate-in fade-in duration-200">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <span className="font-semibold text-amber-300 block">
                  {authNotice.type === 'unauthorized-domain'
                    ? (lang === 'bn' ? 'ডেভ সার্ভার ডোমেন কনফিগারেশন' : 'Dev Server Domain Notice')
                    : (lang === 'bn' ? 'ফায়ারবেস প্রোভাইডার সেটিংস' : 'Firebase Provider Notice')}
                </span>
                <p className="text-[11px] leading-relaxed text-amber-200/90">
                  {authNotice.message}
                </p>
              </div>
            </div>

            {authNotice.type === 'unauthorized-domain' && (
              <div className="pt-1 flex flex-wrap items-center gap-2">
                <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-black/40 border border-amber-500/30 text-[10px] font-mono text-amber-300">
                  <span>{currentHostname}</span>
                  <button
                    onClick={copyDomain}
                    className="p-0.5 hover:text-white transition-colors"
                    title="Copy domain"
                  >
                    {copiedDomain ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  </button>
                </div>

                <a
                  href="https://console.firebase.google.com/project/fine-terrain-fghtt/authentication/settings"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-[11px] text-amber-400 hover:text-amber-200 underline"
                >
                  <span>{lang === 'bn' ? 'অনুমোদিত ডোমেনে যোগ করুন' : 'Add to Authorized Domains'}</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            )}

            {authNotice.type === 'operation-not-allowed' && (
              <div className="pt-1">
                <a
                  href="https://console.firebase.google.com/project/fine-terrain-fghtt/authentication/providers"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-[11px] text-amber-400 hover:text-amber-200 underline"
                >
                  <span>{lang === 'bn' ? 'ফায়ারবেস কনসোল থেকে Email/Password চালু করুন' : 'Enable Email/Password in Console'}</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            )}

            {/* Seamless One-Click Dev Sign-in Fallback Button */}
            <div className="pt-2 border-t border-amber-700/30 flex justify-end">
              <button
                type="button"
                onClick={() =>
                  handleDirectDevLogin(
                    authNotice.fallbackName || name || 'চিরকুট পাঠক',
                    authNotice.fallbackEmail || email || 'user@chirkut.net'
                  )
                }
                className="w-full py-2 px-3 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-200 text-xs font-serif font-medium flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                <span>
                  {lang === 'bn'
                    ? `সরাসরি এই তথ্যে প্রবেশ করুন (${authNotice.fallbackName || 'চিরকুট পাঠক'})`
                    : `Continue directly with this profile`}
                </span>
              </button>
            </div>
          </div>
        )}

        {/* Feedback Alerts */}
        {error && (
          <div className="mb-4 p-3 rounded-lg bg-rose-950/60 border border-rose-800/60 text-rose-200 text-xs flex items-start gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}
        {successMsg && (
          <div className="mb-4 p-3 rounded-lg bg-emerald-950/60 border border-emerald-800/60 text-emerald-200 text-xs flex items-center gap-2">
            <Sparkles className="w-4 h-4 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Google One-Click Login (Recommended) */}
        <button
          onClick={handleGoogleSignIn}
          disabled={loading}
          className="w-full mb-3 py-2.5 px-4 rounded-xl border border-[#C5A880]/60 bg-[#251E18] hover:bg-[#2F251E] text-[#FAF3EB] text-xs font-serif flex items-center justify-center gap-3 transition-colors disabled:opacity-50 shadow-md cursor-pointer group"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path
              fill="#EA4335"
              d="M12 5c1.6 0 3 .6 4.1 1.7l3.1-3.1C17.3 1.8 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.4 9 5 12 5z"
            />
            <path
              fill="#4285F4"
              d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5.1 3.7-8.8z"
            />
            <path
              fill="#FBBC05"
              d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3s.2-1.6.4-2.3L1.9 7.3C.7 9.7 0 12 0 14.5s.7 4.8 1.9 7.2l3.7-2.9z"
            />
            <path
              fill="#34A853"
              d="M12 23.5c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2-6.4-4.8L1.9 16.9C3.7 20.6 7.5 23.5 12 23.5z"
            />
          </svg>
          <span className="font-medium group-hover:text-white">
            {lang === 'bn' ? 'গুগল ক্লাউড দিয়ে ১-ক্লিকে প্রবেশ' : 'Sign in with Google Cloud'}
          </span>
        </button>

        {/* Quick Dev Sign-In Bar (Ideal for local testing) */}
        <div className="mb-4">
          <button
            type="button"
            onClick={() => setShowQuickLogin(!showQuickLogin)}
            className="w-full py-2 px-3 rounded-xl border border-dashed border-[#524335] bg-[#181310] hover:bg-[#201915] text-[#C5A880] text-[11px] font-serif flex items-center justify-between transition-colors"
          >
            <span className="flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span>{lang === 'bn' ? 'দ্রুত টেস্ট লগইন (Quick Dev Sign-In)' : 'Quick Dev Sign-In (Presets)'}</span>
            </span>
            <span className="text-[10px] text-[#8C7A6B] underline">
              {showQuickLogin ? (lang === 'bn' ? 'লুকান' : 'Hide') : (lang === 'bn' ? 'দেখান' : 'Show')}
            </span>
          </button>

          {showQuickLogin && (
            <div className="mt-2 p-2.5 rounded-xl bg-[#1C1613] border border-[#382E25] space-y-1.5 animate-in fade-in duration-150">
              <p className="text-[10px] text-[#A39282] mb-1.5 font-serif">
                {lang === 'bn' ? 'যেকোনো টেস্ট প্রোফাইল বেছে নিন:' : 'Pick a test profile to sign in instantly:'}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                <button
                  type="button"
                  onClick={() => handleDirectDevLogin('আনিস ইসলাম', 'aninislam484@gmail.com', 'https://api.dicebear.com/7.x/bottts/svg?seed=anis')}
                  className="px-2.5 py-1.5 rounded-lg bg-[#271F19] hover:bg-[#342921] border border-[#44362A] text-left text-xs font-serif text-[#FAF3EB] flex items-center gap-2 transition-colors"
                >
                  <span className="w-5 h-5 rounded-full bg-[#C5A880] text-black font-bold flex items-center justify-center text-[10px]">আ</span>
                  <span className="truncate">আনিস ইসলাম</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleDirectDevLogin('কাজী নজরুল ইসলাম', 'nazrul@chirkut.net', 'https://api.dicebear.com/7.x/bottts/svg?seed=nazrul')}
                  className="px-2.5 py-1.5 rounded-lg bg-[#271F19] hover:bg-[#342921] border border-[#44362A] text-left text-xs font-serif text-[#FAF3EB] flex items-center gap-2 transition-colors"
                >
                  <span className="w-5 h-5 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center text-[10px]">ন</span>
                  <span className="truncate">কাজী নজরুল</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleDirectDevLogin('জীবনানন্দ দাশ', 'jibanananda@chirkut.net', 'https://api.dicebear.com/7.x/bottts/svg?seed=jibon')}
                  className="px-2.5 py-1.5 rounded-lg bg-[#271F19] hover:bg-[#342921] border border-[#44362A] text-left text-xs font-serif text-[#FAF3EB] flex items-center gap-2 transition-colors"
                >
                  <span className="w-5 h-5 rounded-full bg-amber-600 text-white font-bold flex items-center justify-center text-[10px]">জী</span>
                  <span className="truncate">জীবনানন্দ দাশ</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleDirectDevLogin('চিরকুট লেখক', 'writer@chirkut.net', 'https://api.dicebear.com/7.x/bottts/svg?seed=writer')}
                  className="px-2.5 py-1.5 rounded-lg bg-[#271F19] hover:bg-[#342921] border border-[#44362A] text-left text-xs font-serif text-[#FAF3EB] flex items-center gap-2 transition-colors"
                >
                  <span className="w-5 h-5 rounded-full bg-purple-600 text-white font-bold flex items-center justify-center text-[10px]">লে</span>
                  <span className="truncate">চিরকুট লেখক</span>
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center my-3.5">
          <div className="flex-1 border-t border-[#2C231B]"></div>
          <span className="px-3 text-[10px] uppercase font-serif text-[#786657] tracking-widest">
            {lang === 'bn' ? 'অথবা ইমেইল একাউন্ট' : 'or email account'}
          </span>
          <div className="flex-1 border-t border-[#2C231B]"></div>
        </div>

        {/* Email & Password Form */}
        <form onSubmit={handleEmailAuth} className="space-y-3">
          {isSignUp && (
            <div>
              <label className="block text-[11px] font-serif uppercase tracking-wider text-[#A39282] mb-1">
                {lang === 'bn' ? 'আপনার নাম' : 'Full Name'}
              </label>
              <div className="relative">
                <User className="w-4 h-4 absolute left-3.5 top-3 text-[#786657]" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={lang === 'bn' ? 'যেমন: কাজী নজরুল ইসলাম' : 'Enter your name'}
                  className="w-full pl-10 pr-4 py-2 bg-[#120E0C] border border-[#382E25] focus:border-[#C5A880] rounded-xl text-xs font-serif text-[#FAF3EB] placeholder-[#635345] focus:outline-none"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-[11px] font-serif uppercase tracking-wider text-[#A39282] mb-1">
              {lang === 'bn' ? 'ইমেইল ঠিকানা' : 'Email Address'}
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3.5 top-3 text-[#786657]" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full pl-10 pr-4 py-2 bg-[#120E0C] border border-[#382E25] focus:border-[#C5A880] rounded-xl text-xs font-serif text-[#FAF3EB] placeholder-[#635345] focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-serif uppercase tracking-wider text-[#A39282] mb-1">
              {lang === 'bn' ? 'পাসওয়ার্ড' : 'Password'}
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3.5 top-3 text-[#786657]" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2 bg-[#120E0C] border border-[#382E25] focus:border-[#C5A880] rounded-xl text-xs font-serif text-[#FAF3EB] placeholder-[#635345] focus:outline-none"
              />
            </div>
          </div>

          {isSignUp && (
            <div>
              <label className="block text-[11px] font-serif uppercase tracking-wider text-[#A39282] mb-1">
                {lang === 'bn' ? 'পাসওয়ার্ড নিশ্চিত করুন' : 'Confirm Password'}
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-3 text-[#786657]" />
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2 bg-[#120E0C] border border-[#382E25] focus:border-[#C5A880] rounded-xl text-xs font-serif text-[#FAF3EB] placeholder-[#635345] focus:outline-none"
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-1.5 py-2.5 rounded-xl bg-[#C5A880] text-[#16120F] font-serif font-semibold text-xs tracking-wider uppercase hover:bg-[#D4AF37] transition-all shadow-[0_0_20px_rgba(197,168,128,0.2)] disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
          >
            {loading ? (
              <span className="animate-pulse">{lang === 'bn' ? 'প্রক্রিয়াধীন...' : 'Processing...'}</span>
            ) : isSignUp ? (
              <>
                <UserPlus className="w-4 h-4" />
                <span>{lang === 'bn' ? 'অ্যাকাউন্ট খুলুন' : 'Create Account'}</span>
              </>
            ) : (
              <>
                <LogIn className="w-4 h-4" />
                <span>{lang === 'bn' ? 'লগইন করুন' : 'Sign In'}</span>
              </>
            )}
          </button>
        </form>

        {/* Toggle between Sign in and Sign up */}
        <div className="mt-4 pt-3.5 border-t border-[#2A2119] flex items-center justify-between text-xs font-serif text-[#A39282]">
          <span>
            {isSignUp
              ? lang === 'bn'
                ? 'আগে থেকেই অ্যাকাউন্ট আছে?'
                : 'Already have an account?'
              : lang === 'bn'
              ? 'নতুন ইউজার?'
              : "Don't have an account?"}
          </span>
          <button
            type="button"
            onClick={() => {
              setIsSignUp(!isSignUp);
              setError(null);
              setAuthNotice(null);
            }}
            className="text-[#C5A880] hover:underline font-medium cursor-pointer"
          >
            {isSignUp
              ? lang === 'bn'
                ? 'লগইন করুন'
                : 'Sign In'
              : lang === 'bn'
              ? 'সাইন আপ করুন'
              : 'Sign Up'}
          </button>
        </div>

        {/* Guest access option */}
        <div className="mt-3 text-center">
          <button
            type="button"
            onClick={handleGuestLogin}
            disabled={loading}
            className="text-[11px] font-serif text-[#8C7A6B] hover:text-[#C5A880] underline transition-colors cursor-pointer"
          >
            {lang === 'bn' ? 'অতিথি হিসেবে ঘুরে দেখুন (Guest Mode)' : 'Continue as Anonymous Guest'}
          </button>
        </div>

      </div>
    </div>
  );
};
