import Image from 'next/image'
import React from 'react'
import { BsHeart, BsStarFill } from 'react-icons/bs'
import { Firestore, collection, addDoc } from 'firebase/firestore'
import { useAuth } from '../context/AuthContext'
import { database } from '../config/firebase'



const Product = () => {
  const {user ,logIn, signUp, logOut, showSignIn} = useAuth();
  const databaseRef = collection(database, "user")


  const addFav = () => {
    addDoc(databaseRef, {
      user: user.uid,
      favorite: ["fgs"],
      reviews: [{"gfg": "dff"}]
    }).then(()=> {alert("data sent")}).catch((error) => {console.error(error.message)})
  }

  return (
    <div className='flex flex-col gap-3 justify-center items-center'>
      <img
        src={`https://firebasestorage.googleapis.com/v0/b/ihsan-store.appspot.com/o/earphones_a_1.webp?alt=media&token=a2880390-51cb-484a-a33d-8f831fac68c5`}
        className="rounded-sm object-cover md:rounded"
        /* layout="fill" */
        width={250}
        height={250}
      />

      <div className="flex">
        {[1,2,3,4].map((star) => (
          <BsStarFill color='yellow'/>
        ))}
      </div>
      <p>Asus zenfone p3</p>
      <p><del>56TL</del> from 49TL</p>
      <button type="button" className="text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-full text-sm px-5 py-2.5 text-center mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Add to Cart</button>
      <button onClick={addFav} type='button' className='w-10 h-10 rounded-full bg-gray-300'><BsHeart className='m-auto'/></button>
    </div>
  )
}

export default Product