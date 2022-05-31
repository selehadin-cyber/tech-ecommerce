import { doc, getDoc } from 'firebase/firestore'
import Image from 'next/image'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { BsHeart, BsPerson, BsCart3, BsSearch } from 'react-icons/bs'
import { database } from '../config/firebase'
import { useAuth } from '../context/AuthContext'
import Cart from './Cart'
import logo from "./logo.png"


const Navbar = () => {
  const {user , favorites, logOut, setShowSignIn, totalQuantities, toggleDrawer} = useAuth();
  
  console.log(favorites)
  
  return (
    <div className="absolute top-0 flex w-full flex-row justify-between items-center gap-5 bg-[#161880] p-2.5 z-50">
        <Link href={"/"}>
          <div className="logo w-[140px] p-2 cursor-pointer">
              <Image src={logo} alt="logo" />
          </div>
        </Link>
      <div className="input relative hidden md:flex">
        <input
          type="search"
          name="search"
          id="search"
          className="rounded-full h-6 md:h-10 md:text-lg text-xs outline-none w-52 p-3 font-light"
          placeholder='search the store'
        />
        <BsSearch className='absolute right-2 top-[20%]'/>
      </div>
      <div className="flex flex-row gap-5">
        <span className="hidden font-dmsans text-sm text-white md:text-lg">
          Available 24/7 at
          <br />
          <a href="tel:(+84)%2090%2012345" className='font-bold text-sm md:text-lg'>(+84) 90 12345</a>
        </span>

        <Link href={"/favorites"}>
          <div className='flex flex-col justify-center items-center cursor-pointer'>
            <BsHeart color="#fdc525" size="17px" />
            <p className="font-dmsans text-sm text-white md:text-xl">Wish Lists {favorites.length}</p>
          </div>
        </Link>
        <div className='flex flex-col justify-center items-center'>
          <BsPerson color="#fdc525" size="17px" />
          <p className="font-dmsans text-sm text-white md:text-xl cursor-pointer">{user ? <span onClick={logOut}>Sign Out</span> : <span onClick={() => setShowSignIn(true)}>Sign in</span> }</p>
        </div>
        <div className='flex flex-col justify-center items-center cursor-pointer' onClick={toggleDrawer("right", true)}>
          <button className='relative'>
              <BsCart3 color="#fdc525" size="17px" />
              <span className='absolute text-[10px] text-white -right-2 -top-1.5 bg-[#0a6cdc] w-4 h-4 rounded-full text-center font-semibold'>{totalQuantities}</span>
          </button>
          <p className="font-dmsans text-sm text-white md:text-xl">Carts</p>
        </div>
      </div>
      <Cart />
    </div>
  )
}

export default Navbar
