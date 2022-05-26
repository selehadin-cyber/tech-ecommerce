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
import { Props } from '../components/Product'

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
  const [cart, setCart] = useState<any[]>([])
  const [totalPrice, setTotalPrice] = useState(1)
  const [totalQuantities, setTotalQuantities] = useState(0)
  const [favorites, setFavorites] = useState([])


  let foundProduct: any;

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
    return createUserWithEmailAndPassword(auth, email, password).then(
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


  useEffect(() => {
    
    const getFavorites = async () => {
     if (user) { const docRef = doc(database, 'user', user?.uid)!
      const userSnap = await getDoc(docRef)
    
      if (userSnap.exists()) {
        console.log(userSnap.get("fav"))
        setFavorites(userSnap.get("fav"))
      } else {
        // doc.data() will be undefined in this case
        console.log('No such document!')
      }
    }else {console.log("user not found")}
  
    }
    getFavorites()
    
  }, [favorites])

  const addFav = async (productData: any) => {
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

  const onAdd = (product: Props, quantity: number) => {
    const checkProductInCart = cart.find(
      (item: Props) => item.name === product.name
    )
    console.log(checkProductInCart)
    setTotalPrice((prev) => prev + product.price * quantity)
    setTotalQuantities((prev) => prev + quantity)
    //TODO : prevent adding the same product as separate product in cart
    if (checkProductInCart) {
      const updatedCartItems = cart.map((cartProduct: any) => {
        if (cartProduct.name === product.name)
          return {
            ...cartProduct,
            quantity: cartProduct.quantity + quantity,
          };
      });
      setCart(updatedCartItems);
    } else {
      product.quantity = quantity;
      setCart([...cart, { ...product }]);
    }
  }

  const toggleCartItemQuantity = (name: string, value: string) => {
    foundProduct = cart.find((item) => item.name === name)
    if (value === 'add') {
      setCart(
        cart.map((item, i) =>
          item.name === name
            ? { ...foundProduct, quantity: foundProduct.quantity + 1 }
            : item
        )
      )
      setTotalPrice((prev) => prev + foundProduct.price)
      setTotalQuantities((prev) => prev + 1)
    } else if (value === 'dec') {
      setCart(
        cart.map((item, i) =>
          item.name === name
            ? { ...foundProduct, quantity: foundProduct.quantity - 1 }
            : item
        )
      )

      setTotalPrice((prev) => prev - foundProduct.price)
      setTotalQuantities((prev) => prev - 1)
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        logIn,
        signUp,
        logOut,
        showSignIn,
        setShowSignIn,
        favorites,
        addFav,
        cart,
        setCart,
        onAdd,
        totalPrice,
        totalQuantities,
        toggleCartItemQuantity,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
