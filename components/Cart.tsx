import React, { useEffect, useState } from 'react'
import { AiFillCloseSquare } from 'react-icons/ai'
import { Drawer } from '@mui/material'
import getStripe from '../config/getStripe'
import { useAuth } from '../context/AuthContext'
import Image from 'next/image'
import Link from 'next/link'

type Cart = {
  image: string
  name: string
  price: string
  quantity: number
}

const Cart = () => {
  const {
    cart,
    setCart,
    totalPrice,
    toggleCartItemQuantity,
    toggleDrawer,
    state,
  } = useAuth()
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
    <React.Fragment key={'right'}>
      <Drawer
        anchor={'right'}
        open={state['right']}
        onClose={toggleDrawer('right', false)}
      >
        <div className="fixed top-0 right-0 bottom-0 h-full w-96 bg-white">
          <div>
                <div className="flex justify-between py-10 px-5 font-bold">
                  <p>YOUR BAG</p>
                  <p onClick={toggleDrawer('right', false)}>
                    <AiFillCloseSquare size="25px" />
                  </p>
                </div>
            {!cart.length ? (
              <>
                <div className="flex flex-col gap-4">
                  <p className="mx-auto font-dmsans">
                    Your cart is currently empty
                  </p>
                  <button className="mx-7 rounded-full border border-black p-4 font-dmsans">
                    Continue Shopping
                  </button>
                </div>
              </>
            ) : null}
            {cart &&
              cart.map((product: Cart, idx: number) => (
                <>
                <div key={idx} className="flex">
                  <Link href={`/products/${product.name}`} className="pr-4">
                    <Image
                      loading="lazy"
                      src={product?.image}
                      className="rounded-sm object-cover md:rounded"
                      width={100}
                      height={100}
                    />
                  </Link>
                  <div>
                    <p className='font-bold'>{product.name}</p>
                    <p>{product.price} TL</p>
                    <span className="font-bold">
                      {product.quantity}
                    </span>
                    <button
                      onClick={() => toggleCartItemQuantity(product.name, 'add')}
                    >
                      inc
                    </button>
                    <button
                      onClick={() => toggleCartItemQuantity(product.name, 'dec')}
                    >
                      dec
                    </button>
                  </div>
                  </div>
                  <div className="flex flex-col items-center">
                    <p>total : {totalPrice}</p>
                    <button
                      className="bg-gray-700 text-white"
                      onClick={handleCheckout}
                    >
                      Proceed to checkout
                    </button>
                  </div>
                </>
              ))}
          </div>
        </div>
      </Drawer>
    </React.Fragment>
  )
}

export default Cart
