import { arrayRemove, arrayUnion, doc, updateDoc } from 'firebase/firestore'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import Navbar from '../components/navbar'
import { Props } from '../components/Product'
import { database } from '../config/firebase'
import { useAuth } from '../context/AuthContext'

const Favorites = () => {
  const { user, favorites, setFavoriteClicked } = useAuth();
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
      <div className="flex pt-32 px-9">
        <Link href={'/'}>
          <p className="cursor-pointer">Home</p>
        </Link>
        <span className="px-1.5">/</span>
        <p> Favorites</p>
      </div>
      <h2 className='px-9 py-3 font-bold text-lg'>FAVORITES</h2>
      <div className="grid grid-cols-4 py-3 px-9 font-bold text-[#505050] bg-[#fafafa] border border-b-slate-400 border-t-transparent">
        <h4>IMAGE</h4>
        <h4>PRODUCT NAME</h4>
        <h4>PRICE</h4>
        <h4>REMOVE</h4>
      </div>
      {favorites.map((item: Props) => (
        <div key={item.name} className="grid grid-cols-4 py-3 px-9 font-bold">
          <div className="relative w-16 h-16">
            <Image
              src={item.image}
              layout={"fill"}
              alt="product-image"
            />
          </div>
          <h4 className='font-normal'>{item.name}</h4>
          <h4>{item.price} TL</h4>
          <h4 onClick={() => removeFav(item)}>REMOVE</h4>
        </div>
      ))}
    </>
  )
}

export default Favorites
