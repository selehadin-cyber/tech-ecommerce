import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import Navbar from '../components/navbar'
import { Props } from '../components/Product'
import { useAuth } from '../context/AuthContext'

const Favorites = () => {
  const { user, favorites } = useAuth()
  return (
    <>
      <Navbar />
      <div className="flex pt-32">
        <Link href={'/'}>
          <p className="cursor-pointer">Home</p>
        </Link>
        <span className="px-1.5">/</span>
        <p> Favorites</p>
      </div>
      <div className="grid grid-cols-4 py-3 font-bold">
        <h4>IMAGE</h4>
        <h4>PRODUCT NAME</h4>
        <h4>PRICE</h4>
        <h4>REMOVE</h4>
      </div>
      {favorites.map((item: Props) => (
        <div key={item.name} className="grid grid-cols-4 py-3 font-bold">
          <Image
            src={item.image}
            width={150}
            height={150}
            alt="product-image"
          />
          <h4>{item.name}</h4>
          <h4>{item.price}</h4>
          <h4>REMOVE</h4>
        </div>
      ))}
    </>
  )
}

export default Favorites
