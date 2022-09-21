import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { useAuth } from '../context/AuthContext'


interface Inputs {
  email: string
  password: string
}

function Login() {
  const [login, setLogin] = useState(false);

  const {user ,logIn, signUp, logOut, setShowSignIn} = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>()
  const onSubmit: SubmitHandler<Inputs> = async ({email, password}) => {
    if (login) {
      await logIn(email , password)
      setShowSignIn(false)
    } else {await signUp(email, password)
    }
  }

  return (
    <div className="absolute z-40 right-0 top-4 focus:flex flex-col md:items-center md:justify-center md:bg-transparent">
    
      <form
        onSubmit={handleSubmit(onSubmit)}
        action=""
        className="relative space-y-8 rounded bg-white px-6 md:mt-16 md:max-w-md md:px-14"
      >
        <h1 className="text-2xl font-semibold">Customer Login</h1>
        <p>if you are already registered, please login.</p>
        <div className="space-y-4">
          <label htmlFor="" className="inline-block w-full">
              <p>E-mail</p>
            <input
              type="email"
              id=""
              placeholder="Email"
              className="rounded-full h-6 md:h-10 md:text-lg text-xs outline-none border-2 w-52 p-3 font-light"
              {...register('email', { required: true })}
            />
            {errors.email && (
              <p className="p-1 text-[13px] font-light  text-orange-500">
                Please enter a valid email.
              </p>
            )}
          </label>
          <label htmlFor="" className="inline-block w-full">
              <p>Password</p>
            <input
              type="password"
              placeholder="Password"
              className="rounded-full h-6 md:h-10 md:text-lg text-xs outline-none border-2 w-52 p-3 font-light"
              {...register('password', { required: true })}
            />
            {errors.password && (
              <p className="p-1 text-[13px] font-light  text-orange-500">
                Your password must contain between 4 and 60 characters.
              </p>
            )}
          </label>
        </div>
        <button
          type="submit"
          className="w-full rounded bg-[#0a6cdc] py-3 font-semibold"
          onClick={() => {setLogin(true)}}
        >
          Sign In
        </button>
        <div className="text-[gray]">
          New to Ihsan Store?{' '}
          <Link href={"/SignUp"}><button className="hover:underline">Sign Up Now</button></Link>
        </div>
      </form>
    </div>
  )
}

export default Login