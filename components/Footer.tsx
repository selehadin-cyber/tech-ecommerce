import React from 'react'
import { AiFillInstagram, AiOutlineTwitter } from 'react-icons/ai'


const Footer = () => {
  return (
    <div className='flex flex-col items-center justify-center bg-gray-400 text-center mt-5 py-8 px-3 font-bold gap-3'>
      <p>2022 Ihsan Store All rights reserved</p>
      <p className='flex gap-3 text-3xl'>
      <AiFillInstagram />
      <AiOutlineTwitter />
      </p>
    </div>
  )
}

export default Footer