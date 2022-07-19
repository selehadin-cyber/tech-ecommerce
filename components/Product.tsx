import Image from 'next/image'
import React, { useState } from 'react'
import { BsHeart, BsStarFill } from 'react-icons/bs'
import { Firestore, collection, addDoc, doc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore'
import { useAuth } from '../context/AuthContext'
import { database } from '../config/firebase'
import Link from 'next/link'

export type Props = {
  productData: any 
    image: string
    type: string
    price: number
    "on-sale": boolean
    name: string
    quantity: number
  
}

const Product: React.FC<Props | any> = ({ productData }) => {
  const { user, logIn, signUp, logOut, showSignIn, setFavoriteClicked } = useAuth()
  const {onAdd} = useAuth();
  const [disabled, setDisabled] = useState(false)

  console.log(productData)
  const addFav = async () => {
    // Atomically add a new region to the "regions" array field.
    const usersRef = doc(database, 'user', user.uid)
    await updateDoc(usersRef, {
      fav: arrayUnion(productData),
    })

    // Atomically remove a region from the "regions" array field.
    /* await updateDoc(usersRef, {
      regions: arrayRemove('east_coast'),
    }) */
    setFavoriteClicked((prev: boolean) => !prev)
  }
  

  return (
    <div className="group flex flex-col items-start justify-center gap-3">
      <Link href={`/products/${productData.name}`}>
        <div>
          <img
            src={productData?.image}
            className="rounded-sm object-cover md:rounded"
            /* layout="fill" */
            width={240}
            height={240}
          />
          <div className="flex">
            {[1, 2, 3, 4].map((star, id) => (
              <BsStarFill key={id} color="yellow" />
            ))}
          </div>
          <p>{productData.name}</p>
          <p>
            <del>56TL</del> from {productData.price}
          </p>
        </div>
      </Link>
          <div className="flex items-start w-full">
            <button
              type="button"
              className="mr-2 mb-2 rounded-full w-[60%] bg-blue-700 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              onClick={() => {setDisabled(true);onAdd(productData, 1)}}
              disabled={disabled}
            >
              Add to Cart
            </button>
            <button
              onClick={addFav}
              type="button"
              className="hidden group-hover:block hover:bg-pink-500 h-10 w-10 rounded-full bg-gray-300"
            >
              <BsHeart className="m-auto" />
            </button>
          </div>
    </div>
  )
}

export default Product
