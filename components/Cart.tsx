import React, { useEffect, useState } from 'react'
import getStripe from '../config/getStripe'
import { useAuth } from '../context/AuthContext'

type Cart = {
  image: string
  name: string
  price: string
  quantity: number
}

const Cart = () => {
  const { cart, setCart, totalPrice, toggleCartItemQuantity } = useAuth()
  const [qty, setQty] = useState(1)

  console.log(cart)

  const handleCheckout = async () => {
    const stripe = await getStripe();

    const response = await fetch('/api/stripe', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(cart)
    });

    if(response.status === 500) return;
    
    const data = await response.json();
    console.log(data.id)
    stripe.redirectToCheckout({ sessionId: data.id });
  }

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
            <span className="font-bold">quantity from product object {product.quantity}</span>
            <button onClick={() => toggleCartItemQuantity(product.name, "add")}>inc</button><br/>
            <button onClick={() => toggleCartItemQuantity(product.name, "dec")}>dec</button>
      </div>
    ))}
    </div>
    <p>total : {totalPrice}</p>
    <button className='bg-gray-700 text-white' onClick={handleCheckout}>Proceed to checkout</button>
  </div>
}

export default Cart
