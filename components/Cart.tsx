import React, { useEffect } from 'react'
import { useAuth } from '../context/AuthContext'

const Cart = () => {
  const { cart, setCart } = useAuth()

  console.log(cart)

  return <div>{JSON.stringify(cart)}</div>
}

export default Cart
