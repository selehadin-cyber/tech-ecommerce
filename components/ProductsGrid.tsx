import React, { useEffect, useState } from 'react'
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  where,
} from 'firebase/firestore'
import { database } from '../config/firebase'
import { useAuth } from '../context/AuthContext'
import Product from './Product'

const ProductsGrid: React.FC = () => {
  const { user, logIn, signUp, logOut, setShowSignIn } = useAuth()
  const userRef = collection(database, 'products')
  const [products, setProducts] = useState({})

  useEffect(() => {
    const base = async () => {
      /* await setDoc(doc(userRef, "asus"), {
        name: 'San Francisco',
        state: 'CA',
        country: 'USA',
        capital: false,
        population: 860000,
        regions: ['west_coast', 'norcal'],
      })
       */
      const docRef = doc(database, 'products', 'headphone')
      const docSnap = await getDoc(docRef)
      if (docSnap.exists()) {
        console.log('Document data:', docSnap.data())
      } else {
        // doc.data() will be undefined in this case
        console.log('No such document!')
      }

      const q = query(
        collection(database, 'products'),
        where('on-sale', '==', true)
      )

      const querySnapshot = await getDocs(q)
      querySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        setProducts(doc.data())
        console.log(products)
      })
    }
    base()
  }, [])

  return (
    <div>
      <Product productData={products}/>
      {JSON.stringify(products)}
    </div>
  )
}

export default ProductsGrid
