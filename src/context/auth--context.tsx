
'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { onAuthStateChanged, User, GoogleAuthProvider, signInWithPopup, signOut, createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { ref, set, get, update, query, orderByChild, equalTo } from "firebase/database";
import shortid from 'shortid';

const FREE_PLAN_USAGE = { analysis: 5, downloads: 1, generations: 2 };
const MONTHLY_PLAN_USAGE = { analysis: 100, downloads: 20, generations: 5 };
const YEARLY_PLAN_USAGE = { analysis: 1500, downloads: 300, generations: 50 };

export interface UserProfile {
    uid: string;
    name: string;
    email: string;
    planStatus: 'free' | 'pro';
    plan?: 'monthly' | 'yearly';
    usage: {
        analysis: number;
        downloads: number;
        generations: number;
    };
    usageResetDate?: string;
    referralCode: string;
    ppTokens: number;
    sugarTokens: number;
}

interface AuthContextType {
  user: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  login: (email: string, pass: string) => Promise<any>;
  signup: (email: string, pass: string, displayName: string, referralCode?: string) => Promise<any>;
  logout: () => Promise<any>;
  googleSignIn: (referralCode?: string) => Promise<any>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  userProfile: null,
  loading: true,
  login: async () => {},
  signup: async () => {},
  logout: async () => {},
  googleSignIn: async () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUserProfile = useCallback(async (firebaseUser: User) => {
    const userRef = ref(db, `users/${firebaseUser.uid}`);
    const snapshot = await get(userRef);
    if (snapshot.exists()) {
        const profileData = snapshot.val() as UserProfile;
        
        // Check if usage credits need to be reset
        if (profileData.planStatus === 'pro' && profileData.usageResetDate && profileData.plan) {
            const resetDate = new Date(profileData.usageResetDate);
            if (new Date() > resetDate) {
                const newResetDate = new Date();
                let newUsage;
                if (profileData.plan === 'monthly') {
                    newResetDate.setMonth(newResetDate.getMonth() + 1);
                    newUsage = { ...MONTHLY_PLAN_USAGE };
                } else { // yearly
                    newResetDate.setFullYear(newResetDate.getFullYear() + 1);
                    newUsage = { ...YEARLY_PLAN_USAGE };
                }
                profileData.usage = newUsage;
                profileData.usageResetDate = newResetDate.toISOString();
                await update(userRef, { usage: profileData.usage, usageResetDate: profileData.usageResetDate });
            }
        }
        return profileData;
    }
    return null;
  }, []);


  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setLoading(true);
      if (firebaseUser) {
        const profile = await fetchUserProfile(firebaseUser);
        setUser(firebaseUser);
        setUserProfile(profile);
      } else {
        setUser(null);
        setUserProfile(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, [fetchUserProfile]);


  const applyReferral = useCallback(async (referralCode?: string): Promise<number> => {
    if (!referralCode || !referralCode.trim()) return 0;
    
    const usersRef = ref(db, 'users');
    const q = query(usersRef, orderByChild('referralCode'), equalTo(referralCode.trim()));
    const snapshot = await get(q);

    if (snapshot.exists()) {
        const referrerData = snapshot.val();
        const referrerId = Object.keys(referrerData)[0];
        const referrerProfile = referrerData[referrerId];
        
        if (referrerId) {
          const referrerRef = ref(db, `users/${referrerId}`);
          try {
            const newPpTokens = (referrerProfile.ppTokens || 0) + 5;
            await update(referrerRef, { ppTokens: newPpTokens });
            return 5; // Return 5 tokens for the new user
          } catch (e) {
            console.error("Failed to update referrer's tokens", e);
            return 0; // Return 0 if the update fails
          }
        }
    }
    return 0; // Return 0 if code is invalid
  }, []);

  const createUserProfile = async (firebaseUser: User, displayName: string, referralCode?: string) => {
      const newPpTokens = await applyReferral(referralCode);
      
      const newUserProfile: UserProfile = {
          uid: firebaseUser.uid,
          name: displayName,
          email: firebaseUser.email || '',
          planStatus: 'free',
          usage: { ...FREE_PLAN_USAGE },
          referralCode: shortid.generate(),
          ppTokens: newPpTokens,
          sugarTokens: 0,
      };

      await set(ref(db, 'users/' + firebaseUser.uid), newUserProfile);
      return newUserProfile;
  };


  const login = async (email: string, pass: string) => {
    const userCredential = await signInWithEmailAndPassword(auth, email, pass);
    if(userCredential.user) {
        const profile = await fetchUserProfile(userCredential.user);
        setUser(userCredential.user);
        setUserProfile(profile);
    }
    return userCredential;
  };

  const signup = useCallback(async (email: string, pass: string, displayName: string, referralCode?: string) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
    const newUser = userCredential.user;
    await updateProfile(newUser, { displayName });
    
    const newUserProfile = await createUserProfile(newUser, displayName, referralCode);

    setUser(newUser);
    setUserProfile(newUserProfile);

    return userCredential;
  }, [applyReferral]);


  const googleSignIn = useCallback(async (referralCode?: string) => {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    const firebaseUser = result.user;
    
    const userRef = ref(db, 'users/' + firebaseUser.uid);
    const snapshot = await get(userRef);

    let profile: UserProfile;
    if (!snapshot.exists()) {
      profile = await createUserProfile(firebaseUser, firebaseUser.displayName || 'New User', referralCode);
    } else {
      profile = snapshot.val();
    }
    
    setUser(firebaseUser);
    setUserProfile(profile);
    return result;
  }, [applyReferral]);

  const logout = async () => {
    await signOut(auth);
    setUser(null);
    setUserProfile(null);
  };

  return (
    <AuthContext.Provider value={{ user, userProfile, loading, login, signup, logout, googleSignIn }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
