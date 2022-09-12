import Image from 'next/image'
import React from 'react'
import 'react-responsive-carousel/lib/styles/carousel.min.css'
import { Carousel } from 'react-responsive-carousel'
import banner from '../assets/banner1.jpg'
import banner2 from '../assets/banner2.jpg'
import banner3 from '../assets/banner3.png'
import Link from 'next/link'

const Banner = () => {
  return (
    <div className="relative -mt-1 pt-0">
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
          <div  className='sm:text-xl font-extrabold absolute z-50 xs:top-0 md:top-[15%] xs:left-[15px] md:left-[50px] text-white flex flex-col gap-3'>
            <div className='font-rubik md:text-5xl sm:text-2xl text-left my-2 py-2'>
                <h2 className='md:pb-3 sm:pb-1'><strong className='text-[#10ffda]'>Huge Saving</strong> on </h2>
                
                <h2>UHD Televisions</h2>
            </div>
            <p className='font-light xs:pb-0 sm:pb-1 md:pb-12 font-dmsans text-[18px] text-left'>Sale up to 70% off on selected items*</p>
            <a href={"/"} className="font-dmsans hidden xl:block font-semibold bg-transparent hover:bg-white hover:text-black px-2 py-2 w-1/2 border border-white hover:border-transparent rounded-full" >
            Shop Now
            </a>
          </div>
        </div>

        <div>
          <Image loading="lazy" src={banner2} alt="" />
        </div>

        <div>
          <Image loading="lazy" src={banner3} alt="" />
        </div>
      </Carousel>
    </div>
  )
}

export default Banner
