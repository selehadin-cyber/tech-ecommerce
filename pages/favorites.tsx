import { arrayRemove, arrayUnion, doc, updateDoc } from 'firebase/firestore'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { BsFillTrashFill } from "react-icons/bs"
import Navbar from '../components/navbar'
import { Props } from '../components/Product'
import Login from '../components/SignIn'
import { database } from '../config/firebase'
import { Context, useAuth } from '../context/AuthContext'

const Favorites = () => {
  const { user, favorites, setFavoriteClicked, showSignIn } = useAuth() as Context
  const removeFav = async (item: Props) => {
    // Atomically add a new region to the "regions" array field.
    const usersRef = doc(database, 'user', user.uid)
    /* await updateDoc(usersRef, {
      fav: arrayUnion(productData),
    })
 */
    // Atomically remove a region from the "regions" array field.
    await updateDoc(usersRef, {
      fav: arrayRemove(item),
    })
    setFavoriteClicked((prev: boolean) => !prev)
  }
  return (
    <>
      <Navbar />
      {showSignIn ? <Login />: null}
      <div className="flex px-9 pt-32">
        <Link href={'/'}>
          <p className="cursor-pointer">Home</p>
        </Link>
        <span className="px-1.5">/</span>
        <p> Favorites</p>
      </div>
      <h2 className="px-9 py-3 text-lg font-bold">FAVORITES</h2>
      <div className="mb-32 min-w-[424px] overflow-y-hidden overflow-x-hidden">
        <div className="grid grid-cols-4 border border-b-slate-400 border-t-transparent bg-[#fafafa] py-3 px-9 font-bold text-[#505050]">
          <h4>IMAGE</h4>
          <h4>PRODUCT NAME</h4>
          <h4>PRICE</h4>
          <h4>REMOVE</h4>
        </div>
        {favorites.map((item: Props, key: number) => (
          <div key={key} className="grid grid-cols-4 items-center py-3 px-9 font-bold border-b-2">
            <Link href={`/products/${item.name}`}>
              <div className="relative h-16 w-16 cursor-pointer">
                <Image src={item.image} layout={'fill'} alt="product-image" />
              </div>
            </Link>
            <Link href={`/products/${item.name}`}>
              <h4 className="font-normal cursor-pointer">{item.name}</h4>
            </Link>
            <h4>{item.price} TL</h4>
            <h4 className="cursor-pointer" onClick={() => removeFav(item)}>
            <BsFillTrashFill />
            </h4>
          </div>
        ))}
      </div>
    </>
  )
}

export default Favorites
