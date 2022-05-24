import React, { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'

type Cart = {
  image: string
  name: string
  price: string
}

const Cart = () => {
  const { cart, setCart, totalPrice } = useAuth()
  const [qty, setQty] = useState(1)

  console.log(cart)

  return <div>
    <div>
    {cart && cart.map((product: Cart, idx: number) => (
      <div key={idx}>
        <img
        src={product?.image}
        className="rounded-sm object-cover md:rounded"
        /* layout="fill" */
        width={250}
        height={250}
            />
            <p>{product.name}</p>
            <p>{product.price}</p>
            <input className="" name="quantity" value={qty} type="number" onChange={(e) => setQty(parseInt(e.target.value))}/>
      </div>
    ))}
    </div>
    <p>total : {totalPrice}</p>
  </div>
}

export default Cart
