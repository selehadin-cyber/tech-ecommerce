import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import { BsHeart, BsPerson, BsCart3, BsSearch } from 'react-icons/bs'
import { useAuth } from '../context/AuthContext'
import logo from "./logo.png"


const Navbar = () => {
  const {user ,logIn, signUp, logOut, setShowSignIn, getFavorites} = useAuth();
 const [favorites, setFavorites] = useState([])
  useEffect(() => {
    const favCall = async () => {
      await getFavorites().then((data: any) => console.log(data)) 
      

    }
    console.log(favorites)
  }, [])
  
  return (
    <div className="absolute top-0 flex w-full flex-row justify-between items-center gap-5 bg-[#161880] p-2.5 z-50">
        <div className="logo w-[140px] p-2">
            <Image src={logo} alt="logo" />
        </div>
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
        <span className="font-dmsans text-sm text-white md:text-lg">
          Available 24/7 at
          <br />
          <a href="tel:(+84)%2090%2012345" className='font-bold text-sm md:text-lg'>(+84) 90 12345</a>
        </span>

        <div className='flex flex-col justify-center items-center'>
          <BsHeart color="#fdc525" size="17px" />
          <p className="font-dmsans text-sm text-white md:text-xl">Wish Lists {favorites.length}</p>
        </div>
        <div className='flex flex-col justify-center items-center'>
          <BsPerson color="#fdc525" size="17px" />
          <p className="font-dmsans text-sm text-white md:text-xl cursor-pointer">{user ? <span onClick={logOut}>Sign Out</span> : <span onClick={() => setShowSignIn(true)}>Sign in</span> }</p>
        </div>
        <div className='flex flex-col justify-center items-center'>
          <button className='relative'>
              <BsCart3 color="#fdc525" size="17px" />
              <span className='absolute text-[10px] text-white -right-2 -top-1.5 bg-[#0a6cdc] w-4 h-4 rounded-full text-center font-semibold'>0</span>
          </button>
          <p className="font-dmsans text-sm text-white md:text-xl">Carts</p>
        </div>
      </div>
    </div>
  )
}

export default Navbar
