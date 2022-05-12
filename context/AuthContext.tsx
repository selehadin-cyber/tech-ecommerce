import React, { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, UserCredential } from "firebase/auth"
import { auth, database } from "../config/firebase";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { useCollection } from 'react-firebase-hooks/firestore';

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
        return createUserWithEmailAndPassword(auth, email, password).then(cred => {
            {
                const groceriesColRef = collection(database, 'users')
                return addDoc(groceriesColRef, {
                        user: cred.user.uid,
                        created: serverTimestamp(),
                        
                    });
            };

           
        })
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