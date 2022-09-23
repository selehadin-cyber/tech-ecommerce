import React from 'react'
import { AiFillInstagram, AiOutlineTwitter } from 'react-icons/ai'


const Footer = () => {
  return (
    <footer className='flex flex-col items-center justify-center bg-gray-400 text-center mt-5 py-8 px-3 w-full font-bold gap-3'>
      <p>2022 Ihsan Store All rights reserved</p>
      <p className='flex gap-3 text-3xl'>
      <AiFillInstagram />
      <AiOutlineTwitter />
      </p>
    </footer>
  )
}

export default Footer