import Image from 'next/image'
import React, { useState } from 'react'
import { BsHeart, BsStarFill } from 'react-icons/bs'
import {
  Firestore,
  collection,
  addDoc,
  doc,
  updateDoc,
  arrayUnion,
  arrayRemove,
} from 'firebase/firestore'
import toast, { Toaster } from 'react-hot-toast'

import { useAuth } from '../context/AuthContext'
import { database } from '../config/firebase'
import Link from 'next/link'
import { Rating } from '@mui/material'

export type Props = {
  productData: any
  image: string
  type: string
  price: number
  'on-sale': boolean
  name: string
  quantity: number
}

const Product: React.FC<Props | any> = ({ productData }) => {
  const { user, logIn, signUp, logOut, showSignIn, setFavoriteClicked } =
    useAuth()
  const { onAdd } = useAuth()
  const [disabled, setDisabled] = useState(false)

  const addFav = async () => {
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

  return (
    <div className="group relative mx-auto my-2 flex w-fit flex-col items-start justify-center gap-3">
      <Toaster position="bottom-center" />
      <Link href={`/products/${productData.name}`}>
        <div>
          <img
            src={productData?.image}
            className="rounded-sm object-cover md:rounded"
            /* layout="fill" */
            width={240}
            height={240}
          />
          {productData['on-sale'] === true ? (
            <div className="absolute top-0 left-0">
              <strong className="min-h-[30px] min-w-[57px] rounded-[3px] bg-[#ffd8d7] py-1 px-2 text-[#e10600]">
                Sale
              </strong>
            </div>
          ) : null}

          <div className="flex flex-col gap-3">
            <Rating name="read-only" value={productData.average} readOnly />
            <p className="font-dmsans">{productData.name}</p>
            <p className="font-rubik">
              {productData['on-sale'] === true ? <del>10,300TL</del> : null}{' '}
              from{' '}
              <span
                className={
                  productData['on-sale']
                    ? 'font-bold text-red-600'
                    : 'font-bold'
                }
              >
                {productData.price}TL
              </span>
            </p>
          </div>
        </div>
      </Link>
      <div className="flex w-[240px] items-start justify-between">
        <button
          type="button"
          className="mr-2 mb-2 w-[80%] rounded-full bg-blue-700 px-5 py-2.5 text-center font-dmsans text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          onClick={() => {
            setDisabled(true)
            onAdd(productData, 1)
          }}
          disabled={false}
        >
          Add to Cart
        </button>
        <button
          onClick={addFav}
          type="button"
          className="hidden h-10 w-10 rounded-full bg-gray-300 hover:bg-pink-500 group-hover:block"
        >
          <BsHeart className="m-auto" />
        </button>
      </div>
    </div>
  )
}

export default Product
