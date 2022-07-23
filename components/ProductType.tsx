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

interface ProductType {
  type: string
}

const ProductType: React.FC<ProductType> = ({ type }) => {
  const { user, logIn, signUp, logOut, setShowSignIn } = useAuth()
  const userRef = collection(database, 'products')
  const [products, setProducts] = useState<any[]>([])

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

      const q = query(collection(database, 'products'))

      const querySnapshot = await getDocs(q)
      const productsArray: any[] = []
      querySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        productsArray.push(doc.data())
        console.log(products)
      })
      setProducts(productsArray)
    }
    base()
  }, [])

  return (
    <>
      <h2 className='mt-7 p-7 text-blue-800 font-bold text-lg font-rubik md:font-extrabold md:text-3xl tracking-tight leading-10'>Top {type === 'pc' ? 'Computers' : 'Mobile Phones'}</h2>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {products &&
          products
            .filter((product) => product.type === type)
            .map((product) => (
              <Product key={product.name} productData={product} />
            ))}
      </div>
    </>
  )
}

export default ProductType
