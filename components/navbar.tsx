import Image from 'next/image'
import React from 'react'
import { BsHeart, BsPerson, BsCart3, BsSearch } from 'react-icons/bs'
import logo from "./logo.png"


const Navbar = () => {
  return (
    <div className="absolute top-0 flex w-full flex-row justify-between items-center gap-5 bg-[#161880] p-2.5">
        <div className="logo w-[100px] p-2">
            <Image src={logo} alt="logo" />
        </div>
      <div className="input relative hidden md:flex">
        <input
          type="search"
          name="search"
          id="search"
          className="rounded-full h-6 text-xs outline-none w-52 p-3 font-light"
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
          <p className="font-dmsans text-sm text-white md:text-xl">Wish Lists</p>
        </div>
        <div className='flex flex-col justify-center items-center'>
          <BsPerson color="#fdc525" size="17px" />
          <p className="font-dmsans text-sm text-white md:text-xl">Sign In</p>
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
