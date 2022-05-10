import Image from 'next/image'
import React from 'react'
import 'react-responsive-carousel/lib/styles/carousel.min.css'
import { Carousel } from 'react-responsive-carousel'
import banner from '../assets/banner1.jpg'
import Link from 'next/link'

const Banner = () => {
  return (
    <div className="relative mt-0 pt-0">
      <Carousel
        autoPlay={false}
        infiniteLoop
        showStatus={false}
        showIndicators={true}
        showThumbs={false}
        interval={3000}
      >
        <div className="relative">
          <Image loading="lazy" src={banner} alt="" />
          <div  className='sm:text-xl font-extrabold absolute z-50 top-8 left-6 text-white flex flex-col gap-3'>
            <div>
                <h2><strong className='text-[#10ffda]'>Huge Saving</strong> on </h2>
                
                <h2>UHD Televisions</h2>
            </div>
            <p className='font-light pb-4'>Sale up to 70% off on selected items*</p>
            <a href={"/"} className="font-semibold bg-transparent hover:bg-white hover:text-black py-2 px-2 border border-white hover:border-transparent rounded-full" >
            Shop Now
            </a>
          </div>
        </div>

        <div>
          <Image loading="lazy" src={banner} alt="" />
        </div>

        <div>
          <Image loading="lazy" src={banner} alt="" />
        </div>
      </Carousel>
    </div>
  )
}

export default Banner
