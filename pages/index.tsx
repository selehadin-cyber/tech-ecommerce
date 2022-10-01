import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import Banner from '../components/Banner'
import Cart from '../components/Cart'
import Deals from '../components/Deals'
import Navbar from '../components/navbar'
import ProductsGrid from '../components/ProductsGrid'
import ProductType from '../components/ProductType'
import Login from '../components/SignIn'
import { useAuth } from '../context/AuthContext'

const Home: NextPage = () => {
  const {user ,logIn, signUp, logOut, showSignIn} = useAuth();
  return (
    <div className="flex flex-col items-center justify-center py-2 mb-32">
      <Head>
        <title>Ihsan store</title>
        <meta name="viewport" content="width=device-width, initial-scale=1, minimum-scale=1"/>
        <meta property="og:type" content="website" />
        <meta property="og:title" content="IhsanStore ,Exellence through technology" />
        <meta
          name="description"
          property="og:description"
          content="ihsan store is where you can find the best electronics"
        />
        <meta property="og:type" content="video.movie" />
        <meta
          property="og:url"
          content="https://ihsanstore.com/"
        />
        <meta
          name="image"
          property="og:image"
          content="https://raw.githubusercontent.com/selehadin-cyber/tech-ecommerce/main/assets/screenshot.png"
        />
      </Head>

      <Navbar />
      {showSignIn ? <Login />: null} 
      <div className='max-w-screen-2xl mx-auto mt-16 pt-0'>
        <Banner />
        <div className="max-width m-5">
          <Deals />
          <ProductsGrid />
          <ProductType type={"pc"} />
          <ProductType type={"phone"} />
        </div>
      </div>
    </div>
  )
}

export default Home
