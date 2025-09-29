import { auth, firestore } from "@/config/firebase";
import { AuthContextType, UserType } from "@/types";
import { createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword } from "@firebase/auth";
import { doc, getDoc, setDoc } from "@firebase/firestore";
import { useRouter } from "expo-router";
import { createContext, useContext, useEffect, useState } from "react";

// create auth context
const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<UserType>(null)
    const router = useRouter();

    useEffect(() => {
        const unsub = onAuthStateChanged(auth, (firebaseUser) => {
            if (firebaseUser) {
                setUser({
                    uid: firebaseUser.uid,
                    email: firebaseUser.email,
                    name: firebaseUser.displayName,
                })
                updateUserData(firebaseUser.uid);
                router.replace("/(tabs)/home")
            } else {
                setUser(null)
                router.replace("/(auth)/welcome")
            }
        })

        return () => unsub();
    }, [])

    // function to login user
    const login = async (email: string, password: string) => {
        try {
            await signInWithEmailAndPassword(auth, email.trim(), password)
            return { success: true }
        } catch (error: any) {
            let msg = error.message;
            if (msg.includes("auth/invalid-credential")) {
                msg = "Wrong email or password"
            } if (msg.includes("auth/invalid-email")) {
                msg = "Invalid email"
            }
            return { success: false, msg }
        }
    }

    // function to register user
    const register = async (name: string, email: string, password: string) => {
        try {
            let response = await createUserWithEmailAndPassword(auth, email, password);
            await setDoc(doc(firestore, "users", response.user.uid), {
                name,
                email,
                uid: response.user.uid,
            })
            return { success: true }
        } catch (error: any) {
            let msg = error.message;
            if (msg.includes("auth/email-already-in-use")) {
                msg = "Email already in use"
            } if (msg.includes("auth/invalid-email")) {
                msg = "Invalid email"
            } if (msg.includes("auth/weak-password")) {
                msg = "Password should be at least 6 characters"
            }
            return { success: false, msg }
        }
    }

    // function to update user data
    const updateUserData = async (uid: string) => {
        try {
            const docRef = doc(firestore, "users", uid)
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                const data = docSnap.data();
                const userData: UserType = {
                    uid: data.uid,
                    name: data.name || null,
                    email: data.email || null,
                    image: data.image || null
                }
                setUser({ ...userData })
            }
        } catch (error: any) {
            console.log("error", error)
        }
    }

    // context value
    const conTextValue: AuthContextType = {
        user,
        setUser,
        login,
        register,
        updateUserData
    }

    // provide auth context to children components
    return (
        <AuthContext.Provider value={conTextValue}>
            {children}
        </AuthContext.Provider>
    )
}

// custom hook to use auth context
export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}