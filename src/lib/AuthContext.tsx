"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "./firebase";

export type UserRole = "customer" | "admin" | "cook" | "delivery";

interface UserProfile {
    uid: string;
    email: string | null;
    displayName: string | null;
    role: UserRole;
    photoURL: string | null;
}

interface AuthContextType {
    user: User | null;
    profile: UserProfile | null;
    loading: boolean;
    signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    profile: null,
    loading: true,
    signOut: async () => { },
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check for redirect errors
        import("firebase/auth").then(({ getRedirectResult }) => {
            getRedirectResult(auth).catch((error) => {
                console.error("Redirect Auth Error:", error);
                // We could set a global error state here if needed
            });
        });

        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            setUser(user);
            if (user) {
                try {
                    const adminEmail = (process.env.NEXT_PUBLIC_ADMIN_EMAIL || "foodnjoy26@gmail.com").toLowerCase();
                    const isSystemAdmin = !!(user.email && user.email.toLowerCase() === adminEmail);

                    const userDocRef = doc(db, "users", user.uid);
                    const userDoc = await getDoc(userDocRef);

                    if (userDoc.exists()) {
                        const data = userDoc.data() as UserProfile;
                        // Enforce environment variable security for admin privileges
                        const resolvedRole: UserRole = isSystemAdmin ? "admin" : (data.role === "admin" ? "customer" : data.role);
                        setProfile({ ...data, role: resolvedRole });
                    } else {
                        // New user - default to customer role unless matching environment variable admin credentials
                        const newProfile: UserProfile = {
                            uid: user.uid,
                            email: user.email,
                            displayName: user.displayName,
                            role: isSystemAdmin ? "admin" : "customer",
                            photoURL: user.photoURL,
                        };
                        // Immediately set profile to unblock UI
                        setProfile(newProfile);
                        // Fire and forget the write to Firestore
                        setDoc(userDocRef, newProfile).catch(err => {
                             console.error("Profile background save failed:", err);
                        });
                    }
                } catch (err) {
                    console.error("Profile load/save failed:", err);
                    const adminEmail = (process.env.NEXT_PUBLIC_ADMIN_EMAIL || "foodnjoy26@gmail.com").toLowerCase();
                    const isSystemAdmin = !!(user.email && user.email.toLowerCase() === adminEmail);
                    setProfile({
                        uid: user.uid,
                        email: user.email,
                        displayName: user.displayName,
                        role: isSystemAdmin ? "admin" : "customer",
                        photoURL: user.photoURL,
                    });
                }
            } else {
                setProfile(null);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const signOut = async () => {
        await auth.signOut();
    };

    return (
        <AuthContext.Provider value={{ user, profile, loading, signOut }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
