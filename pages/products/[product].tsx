import {
  arrayUnion,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  updateDoc,
  where,
} from 'firebase/firestore'
import Rating from '@mui/material/Rating'
import { GetStaticProps } from 'next'
import { ParsedUrlQuery } from 'querystring'
import React, { useState } from 'react'
import { BsHeart } from 'react-icons/bs'
import { database } from '../../config/firebase'
import { useAuth } from '../../context/AuthContext'
import { TextField } from '@mui/material'
import Image from 'next/image'
import Navbar from '../../components/navbar'

interface IParams extends ParsedUrlQuery {
  product: string
}
export interface PageProps {
  singleProduct?: {
    price: number
    'on-sale': boolean
    type: string
    name: string
    image: string
    reviews: any[]
  }
}
const ProductPage: React.FC<PageProps> = ({ singleProduct }) => {
  const [value, setValue] = useState<number | null>(2)
  const [title, setTitle] = useState('')
  const [review, setReview] = useState('review')
  const [writeReview, setWriteReview] = useState(false)
  const { addFav, user, onAdd } = useAuth()
  const [qty, setQty] = useState(1)

  const getUserName = async () => {
    if (user) {
      const docRef = doc(database, 'user', user?.uid)!
      const userSnap = await getDoc(docRef)

      if (userSnap.exists()) {
        return userSnap.get('userName')
      } else {
        // doc.data() will be undefined in this case
        console.log('No such document!')
      }
    } else {
      console.log('user not found')
    }
  }

  const addReview = async (
    product: any,
    star: number | null,
    review: string
  ) => {
    // Atomically add a new region to the "regions" array field.
    const Name = await getUserName()
    const userUid = user.uid
    const usersRef = doc(database, 'products', product.name)
    console.log(Name)
    await updateDoc(usersRef, {
      reviews: arrayUnion({
        [Name]: {
          star: star,
          title: title,
          review: review,
          name: Name,
        },
      }),
    })

    // Atomically remove a region from the "regions" array field.
    /* await updateDoc(usersRef, {
      regions: arrayRemove('east_coast'),
    }) */
  }

  return (
    <>
      <Navbar />
      <div className="container px-5 pt-20">
        <div className="image-parent relative h-[250px] w-[100%]">
          <Image
            src={singleProduct?.image as string}
            objectFit="contain"
            layout="fill"
            className="w-full"
          />
        </div>
        <h1 className="text-center text-xl font-bold">{singleProduct?.name}</h1>
        <div className="flex font-thin">
          <Rating name="read-only" value={4} readOnly />
          <p className='pl-3'>{singleProduct?.reviews.length} reviews</p>
        </div>
        <p className='font-extrabold text-lg'>{singleProduct?.price} TL</p>
        
        <div className="flex gap-3 items-center justify-center">
          <input
            className="flex justify-between w-20 border border-black rounded-full items-center py-1.5 px-2"
            name="quantity"
            value={qty}
            type="number"
            onChange={(e) => setQty(parseInt(e.target.value))}
          />
          <button
            type="button"
            className="mr-2 rounded-full bg-blue-700 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            onClick={() => onAdd(singleProduct, qty)}
          >
            Add to Cart
          </button>
          <button
            onClick={() => addFav(singleProduct)}
            type="button"
            className="h-10 w-10 rounded-full bg-gray-300 hover:bg-pink-300"
          >
            <BsHeart className="m-auto" />
          </button>
        </div>

        <div className='review-section'>
          <h2 className='font-bold text-2xl'>Customer Reviews</h2>
          <div className="flex gap-3">
            <Rating name="read-only" value={4} readOnly />
            <p>Based on {singleProduct?.reviews.length} reviews</p>
            <button onClick={() => setWriteReview(prev => !prev)}>Write a review</button>
          </div>
          {/* write a review section */}
          {writeReview && (
            <>
              <Rating
              name="simple-controlled"
              value={value}
              onChange={(event, newValue) => {
                setValue(newValue)
              }}
                        />
                        <TextField
              id="outlined-multiline-static"
              label="Title"
              multiline
              rows={4}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
                        />
                        <TextField
              id="outlined-multiline-static"
              label="Comment"
              multiline
              rows={4}
              value={review}
              onChange={(e) => setReview(e.target.value)}
                        />
                        <button
              type="submit"
              className="w-full rounded bg-[#0a6cdc] py-3 font-semibold"
              onClick={() => {
                addReview(singleProduct, value, review)
              }}
                        >
              Submit
                        </button>
            </>
          )}
          

          {/* reviews section */}
          <h2>Reviews</h2>
          {singleProduct?.reviews.map((review) =>
            Object.values(review).map((review: any) => (
              <>
                <h2 className="font-bold">{review.title}</h2>
                <p className="text-sm">{review.name}</p>
                <Rating name="read-only" value={review.star} readOnly />
                <p>review: {review.review}</p>
              </>
            ))
          )}
                </div>
        </div>
    </>
  )
}
export const getStaticPaths = async () => {
  const q = query(collection(database, 'products'))

  const querySnapshot = await getDocs(q)
  const productsArray: any[] = []
  querySnapshot.forEach((doc) => {
    // doc.data() is never undefined for query doc snapshots
    productsArray.push(doc.data().name)
    console.log(productsArray)
  })
  const paths = productsArray.map((product: any) => ({
    params: {
      product: product,
    },
  }))
  return {
    paths,
    fallback: 'blocking',
  }
}

export const getStaticProps: GetStaticProps = async (context) => {
  const { product } = context.params as IParams

  const docRef = doc(database, 'products', `${product}`)
  const docSnap = await getDoc(docRef)

  if (docSnap.exists()) {
    console.log('Document data:', docSnap.data())
  } else {
    // doc.data() will be undefined in this case
    console.log('No such document!')
  }

  /*  const query = `*[_type == "product" && slug.current ==  '${slug}' ][0]`; */

  const singleProduct = docSnap.data()

  return {
    props: { singleProduct },
  }
}

export default ProductPage
