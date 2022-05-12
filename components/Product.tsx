import Image from 'next/image'
import React from 'react'
import { BsHeart, BsStarFill } from 'react-icons/bs'
import { Firestore, collection, addDoc } from 'firebase/firestore'
import { useAuth } from '../context/AuthContext'
import { database } from '../config/firebase'

interface Props {
  productData: any/* {
    image: string
    type: string
    price: number
    "on-sale": boolean
    name: string
  } */
}

const Product: React.FC<Props> = ({ productData }) => {
  const { user, logIn, signUp, logOut, showSignIn } = useAuth()
  const databaseRef = collection(database, 'user')
  console.log(productData)
  const addFav = () => {
    addDoc(databaseRef, {
      user: user.uid,
      favorites: [],
      cart: [],
    })
      .then(() => {
        alert('data sent')
      })
      .catch((error) => {
        console.error(error.message)
      })
  }

  return (
    <div className="flex flex-col items-center justify-center gap-3">
      <img
        src={productData?.image}
        className="rounded-sm object-cover md:rounded"
        /* layout="fill" */
        width={250}
        height={250}
      />

      <div className="flex">
        {[1, 2, 3, 4].map((star, id) => (
          <BsStarFill key={id} color="yellow" />
        ))}
      </div>
      <p>Asus zenfone p3</p>
      <p>
        <del>56TL</del> from 49TL
      </p>
      <button
        type="button"
        className="mr-2 mb-2 rounded-full bg-blue-700 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
      >
        Add to Cart
      </button>
      <button
        onClick={addFav}
        type="button"
        className="h-10 w-10 rounded-full bg-gray-300"
      >
        <BsHeart className="m-auto" />
      </button>
    </div>
  )
}

export default Product
