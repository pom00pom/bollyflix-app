// src/context/AuthContext.js - UPGRADED WITH DEBUGGING
import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, signInAnonymously } from 'firebase/auth';
import { auth } from '../firebase';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, user => {
      if (user) {
        console.log("✅ Auth State Changed: User is present!", user);
        setCurrentUser(user);
        setLoading(false);
      } else {
        console.log("🟡 Auth State Changed: No user. Attempting Anonymous Sign-in...");
        signInAnonymously(auth)
          .then(userCredential => {
            console.log("✅ Anonymous Sign-in SUCCESSFUL!", userCredential.user);
            setCurrentUser(userCredential.user);
          })
          .catch(error => {
            console.error("❌ Anonymous Sign-in FAILED:", error);
          })
          .finally(() => setLoading(false));
      }
    });
    return unsubscribe;
  }, []);

  const value = { currentUser };
  return ( <AuthContext.Provider value={value}> {!loading && children} </AuthContext.Provider> );
};