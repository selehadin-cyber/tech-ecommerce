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
import Product, { Props } from './Product'

const ProductsGrid: React.FC = () => {
  const { user, logIn, signUp, logOut, setShowSignIn } = useAuth()
  const userRef = collection(database, 'products')
  const [products, setProducts] = useState<Props[]>([])

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
      

      const q = query(
        collection(database, 'products')
      )

      const querySnapshot = await getDocs(q)
      const productsArray: any[] = []
      querySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        productsArray.push(doc.data())
      })
      setProducts(productsArray)
    }
    base()
  }, [])

  return (
    <div className='grid grid-cols-auto-fit-275'>
      {products && products.filter(product => product["on-sale"] === true).map((product: Props) => (<Product key={product.name} productData={product}/>))}
      
    </div>
  )
}

export default ProductsGrid
