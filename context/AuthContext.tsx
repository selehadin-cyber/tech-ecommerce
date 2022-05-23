import React, { createContext, useContext, useEffect, useState } from 'react'
import {
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  UserCredential,
} from 'firebase/auth'
import { auth, database } from '../config/firebase'
import {
  addDoc,
  arrayUnion,
  collection,
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
  updateDoc,
} from 'firebase/firestore'
import { useCollection } from 'react-firebase-hooks/firestore'

const AuthContext = createContext<any>({})

export const useAuth = () => useContext(AuthContext)

export const AuthContextProvider = ({
  children,
}: {
  children: React.ReactNode
}) => {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [showSignIn, setShowSignIn] = useState(false)
  const [Cart, setCart] = useState<any[]>([])
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser({
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
        })
      } else {
        setUser(null)
      }
      setLoading(false)
    })
    return () => unsubscribe()
  }, [])

  const signUp = (email: string, password: string, displayName: string) => {
    return createUserWithEmailAndPassword(auth, email, password, ).then(
      (cred) => {
        {
          setDoc(doc(database, 'user', cred.user.uid), {
            userName: displayName,
            fav: [],
          })
        }
      }
    )
  }

  const logIn = (email: string, password: string) => {
    return signInWithEmailAndPassword(auth, email, password)
  }

  const logOut = async () => {
    setUser(null)
    await signOut(auth)
  }

  const getFavorites = async () => {
    const docRef = doc(database, 'user', user.uid)
    const userSnap = await getDoc(docRef)

    if (userSnap.exists()) {
      console.log('Document data:', userSnap.get("fav"))
    } else {
      // doc.data() will be undefined in this case
      console.log('No such document!')
    }
  }

  const addFav = async ( productData: any) => {
    // Atomically add a new region to the "regions" array field.
    const usersRef = doc(database, 'user', user.uid)
    await updateDoc(usersRef, {
      fav: arrayUnion(productData),
    })

    // Atomically remove a region from the "regions" array field.
    /* await updateDoc(usersRef, {
      regions: arrayRemove('east_coast'),
    }) */
  }

  return (
    <AuthContext.Provider
      value={{ user, logIn, signUp, logOut, showSignIn, setShowSignIn, getFavorites, addFav, Cart, setCart }}
    >
      {children}
    </AuthContext.Provider>
  )
}
