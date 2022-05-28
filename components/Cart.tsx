import React, { useEffect, useState } from 'react'
import { Drawer } from '@mui/material'
import getStripe from '../config/getStripe'
import { useAuth } from '../context/AuthContext'



type Cart = {
  image: string
  name: string
  price: string
  quantity: number
}

const Cart = () => {
  const { cart, setCart, totalPrice, toggleCartItemQuantity,toggleDrawer, state } = useAuth()
  const [qty, setQty] = useState(1)
  
  console.log(!cart)

  const handleCheckout = async () => {
    const stripe = await getStripe()

    const response = await fetch('/api/stripe', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(cart),
    })

    if (response.status === 500) return

    const data = await response.json()
    console.log(data.id)
    stripe.redirectToCheckout({ sessionId: data.id })
  }

  return (
    <React.Fragment key={"right"}>
          <Drawer
            anchor={"right"}
            open={state["right"]}
            onClose={toggleDrawer("right", false)}
          >
            <div className='fixed top-0 right-0 bottom-0 h-full bg-white w-96'>
      <div>
        { !cart ? (
          <div className='flex justify-between py-10'>
            <p>YOUR BAG</p>
            <p>x</p>
          </div>
        ) : null}
        {cart &&
          cart.map((product: Cart, idx: number) => (
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
              <span className="font-bold">
                quantity from product object {product.quantity}
              </span>
              <button
                onClick={() => toggleCartItemQuantity(product.name, 'add')}
              >
                inc
              </button>
              <br />
              <button
                onClick={() => toggleCartItemQuantity(product.name, 'dec')}
              >
                dec
              </button>
              <p>total : {totalPrice}</p>
      <button className="bg-gray-700 text-white" onClick={handleCheckout}>
        Proceed to checkout
      </button>
            </div>
          ))}
      </div>
      
    </div>
          </Drawer>
        </React.Fragment>
    
  )
}

export default Cart
