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
import toast, { Toaster } from 'react-hot-toast'

import { Props } from '../components/Product'

type Anchor = "right"
export type Context = {
        user: any
        logIn: any
        signUp: any
        logOut: any
        showSignIn: boolean
        setShowSignIn: any
        favorites: any
        addFav: any
        cart: Props[]
        setCart: any
        onAdd: any
        totalPrice: any
        totalQuantities: number
        toggleCartItemQuantity: number
        toggleDrawer: any
        state: any
        favoriteClicked: boolean
        setFavoriteClicked: any
        allProducts: any
        setAllProducts: any
}

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
  const [cart, setCart] = useState<Props[]>([])
  const [totalPrice, setTotalPrice] = useState(0)
  const [totalQuantities, setTotalQuantities] = useState(0)
  const [favorites, setFavorites] = useState([])
  const [favoriteClicked, setFavoriteClicked] = useState(false)
  const [allProducts, setAllProducts] = useState([])
  const [state, setState] = useState({
    top: false,
    left: false,
    bottom: false,
    right: false,
  });

  let foundProduct: Props

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUser({
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
        })
      } else {
        setUser(null)
        setFavorites([])
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
   const favoritesLoad = onAuthStateChanged(auth, async (user) => {
        if (user) {
          const docRef = doc(database, 'user', user?.uid)!
          const userSnap = await getDoc(docRef)
  
          if (userSnap.exists()) {
            setFavorites(userSnap.get('fav'))
          } else {
            // doc.data() will be undefined in this case
            console.log('No such document!')
          }
        } else {
          setUser(null)
          setFavorites([])
        }
      })
      return () => favoritesLoad()
  }, [favoriteClicked])

  const addFav = async (productData: Props) => {
    // Atomically add a new region to the "regions" array field.
    
    if (!user) {
      //error message when a user tries to favorite an item with out loging in
      toast('You need to sign in to favorite an item🤔', {
        style: {
          background: 'red',
          color: 'white',
          fontWeight: 'bolder',
          fontSize: '17px',
          padding: '20px',
        },
      })
    } else {
      const usersRef = doc(database, 'user', user.uid)
      await updateDoc(usersRef, {
        fav: arrayUnion(productData),
      })
      toast("Item added to favorites 👏!", {
        duration: 1000,
        style: {
          background: "green",
          color: "white",
          fontWeight: "bolder",
          fontSize: "17px",
          padding: "20px",
        },
      });
    }
    setFavoriteClicked((prev: boolean) => !prev)
  }

  const toggleDrawer =
    (anchor: Anchor, open: boolean) =>
    (event: React.KeyboardEvent | React.MouseEvent) => {
      if (
        event.type === 'keydown' &&
        ((event as React.KeyboardEvent).key === 'Tab' ||
          (event as React.KeyboardEvent).key === 'Shift')
      ) {
        return;
      }

      setState({ ...state, [anchor]: open });
    };

  const onAdd = (product: Props, quantity: number) => {
    const checkProductInCart = cart.find(
      (item: Props) => item.name === product.name
    )
    setTotalPrice((prev) => prev + product.price * quantity)
    setTotalQuantities((prev) => prev + quantity)
    //TODO : prevent adding the same product as separate product in cart
    if (checkProductInCart) {
      const updatedCartItems = cart.map((cartProduct: Props) => {
        if (cartProduct.name === product.name)
          return {
            ...cartProduct,
            quantity: cartProduct.quantity + quantity,
          }
      }) as Props[]
      setCart(updatedCartItems)
    } else {
      product.quantity = quantity
      setCart([...cart, { ...product }])
    }
  }

  const toggleCartItemQuantity = (name: string, value: string) => {
    foundProduct = cart.find((item) => item.name === name) as Props
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
        toggleDrawer,
        state,
        favoriteClicked,
        setFavoriteClicked,
        allProducts,  
        setAllProducts
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
