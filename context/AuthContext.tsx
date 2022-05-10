import React, { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth"
import { auth } from "../config/firebase";

const AuthContext = createContext<any>({})

export const useAuth = () => useContext(AuthContext)

export const AuthContextProvider = ({children}: {children: React.ReactNode}) => {
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [showSignIn, setShowSignIn] = useState(false);
    
    useEffect(() => {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
          
          if (user) {
              setUser({
                  uid: user.uid,
                  email: user.email,
                  displayName: user.displayName
              })
          } else {setUser(null)}
          setLoading(false)
      })
      return () => unsubscribe()
    }, [])
    

    const signUp = (email: string, password: string) => {
        return createUserWithEmailAndPassword(auth, email, password)
    }
    
    const logIn = (email: string, password: string) => {
        return signInWithEmailAndPassword(auth, email, password)
    }
    
    const logOut = async () => {
        setUser(null)
        await signOut(auth)
    }

    return (
        <AuthContext.Provider value={{user, logIn, signUp, logOut, showSignIn, setShowSignIn}}>
            {children}
        </AuthContext.Provider>
    )
}