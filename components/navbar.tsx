import { doc, getDoc } from 'firebase/firestore'
import Image from 'next/image'
import Link from 'next/link'
import React, { useEffect, useRef, useState } from 'react'
import { BsHeart, BsPerson, BsCart3, BsSearch } from 'react-icons/bs'
import { database } from '../config/firebase'
import { Context, useAuth } from '../context/AuthContext'
import { Product } from '../pages/products/[product]'
import Cart from './Cart'
import logo from './logo.png'

const Navbar = () => {
  const {
    user,
    favorites,
    logOut,
    setShowSignIn,
    totalQuantities,
    toggleDrawer,
    allProducts
  } = useAuth() as Context
  const [display, setDisplay] = useState(false)
  const [search, setSearch] = useState('')
  const wrapperRef = useRef(null)

  useEffect(() => {

    if (search.length > 0) {
      setDisplay(true)
    } else if (search.length > 0) {
      setDisplay(false)
    }
  }, [search])
  

  /* useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, []) */

  /* const handleClickOutside = (e: Event) => {
    const { current: wrap } = wrapperRef
    if (wrap && !wrap.contains(e.target)) {
      setDisplay(false)
    }
  } */

  const setInput = (text: string) => {
    setSearch(text)
    setDisplay(false)
  }

  return (
    <div className="absolute top-0 z-50 flex w-full flex-row items-center justify-between gap-5 bg-[#161880] p-4">
      <Link href={'/'}>
        <div className="logo w-[110px] cursor-pointer p-2 md:w-[140px]">
          <Image src={logo} alt="logo" />
        </div>
      </Link>
      <div className="input relative hidden md:flex md:items-center basis-[calc(44.6667%+20px)]">
        <input
          type="search"
          name="search"
          id="search"
          value={search}
          ref={wrapperRef}
          onChange={(e) => setSearch(e.target.value)}
          className="h-12 w-full rounded-full p-3 text-xs font-light outline-none md:h-12 md:text-lg"
          placeholder="Search the store"
        />
        <BsSearch size={20} className="absolute right-3" />
        <ul className='absolute flex flex-col top-[calc(100%+10px)] bg-white w-[246px]  rounded-md'>{display &&
        allProducts
          .filter(({ name }: {name: string} ) => name.toLowerCase().indexOf(search.toLowerCase()) > -1)
          .map((product: Product) => (
            <Link href={`/products/${product.name}`} key={product.name}>
            <li className='group w-full flex items-center hover:bg-blue-800 hover:text-white rounded-md' onClick={() => {setInput(product.name);setDisplay(false)}} tabIndex={0}>
            <div className="relative w-10 h-10 pl-1">
            <Image
              src={product.image}
              layout={"fill"}
              alt="product-image"
              className='group-hover:bg-pink-600 rounded-md'
            />
          </div>
              <p className='pl-2'>{product.name}</p>
            </li>
            </Link>
          ))}</ul>
      </div>
      <div className="flex flex-row gap-5 basis-[21.3%] justify-end">
        <span className="hidden font-dmsans text-sm text-white md:text-lg">
          Available 24/7 at
          <br />
          <a
            href="tel:(+84)%2090%2012345"
            className="text-sm font-bold md:text-lg"
          >
            (+84) 90 12345
          </a>
        </span>

        <Link href={'/favorites'}>
          <div className="flex cursor-pointer flex-col items-center justify-center">
            <BsHeart color="#fdc525" className='text-[17px] md:text-[28px]'/>
            <p className="font-dmsans text-sm text-white md:text-sm whitespace-nowrap">
              Wish Lists {favorites.length}
            </p>
          </div>
        </Link>
        <div className="flex flex-col items-center justify-center">
          <BsPerson color="#fdc525" className='text-[17px] md:text-[28px]'/>
          <p className="cursor-pointer font-dmsans text-sm text-white md:text-sm whitespace-nowrap">
            {user ? (
              <span onClick={logOut}>Sign Out</span>
            ) : (
              <span onClick={() => setShowSignIn((prev: boolean) => !prev)}>
                Sign in
              </span>
            )}
          </p>
        </div>
        <div
          className="flex cursor-pointer flex-col items-center justify-center"
          onClick={toggleDrawer('right', true)}
        >
          <button className="relative">
            <BsCart3 color="#fdc525" className='text-[17px] md:text-[28px]'/>
            <span className="absolute -right-2 -top-1.5 h-4 w-4 rounded-full bg-[#0a6cdc] text-center text-[10px] font-semibold text-white">
              {totalQuantities}
            </span>
          </button>
          <p className="font-dmsans text-sm text-white md:text-sm">Carts</p>
        </div>
      </div>
      <Cart />
      
    </div>
  )
}

export default Navbar
