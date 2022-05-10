import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import Banner from '../components/Banner'
import Navbar from '../components/navbar'
import Login from '../components/SignIn'

const Home: NextPage = () => {
  return (
    <div className="flex flex-col items-center justify-center py-2">
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Navbar />
      <Login /> 
      <div className='max-w-screen-2xl mx-auto mt-16 pt-0'>
        <Banner />
      </div>
    </div>
  )
}

export default Home
