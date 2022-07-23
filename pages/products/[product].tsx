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
import React, { useEffect, useState } from 'react'
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
  reviews: any
  reviewProduct?: {
    price: number
    'on-sale': boolean
    type: string
    name: string
    image: string
    reviews: any[]
  }
}
const ProductPage: React.FC<PageProps> = ({ singleProduct }) => {
  const [value, setValue] = useState<number | null>(0)
  const [title, setTitle] = useState('')
  const [review, setReview] = useState('review')
  const [writeReview, setWriteReview] = useState(false)
  const { addFav, user, onAdd } = useAuth()
  const [qty, setQty] = useState(1)
  const [reviewAdded, setReviewAdded] = useState(false)
  const [reviewProduct, setReviewProduct] = useState<PageProps>()

  useEffect(() => {
    const Review = async () => {
      const Name = singleProduct?.name
      const docRef = doc(database, 'products', `${Name}`)
      const docSnap = await getDoc(docRef)

      if (docSnap.exists()) {
        console.log('Document data:', docSnap.data())
      } else {
        // doc.data() will be undefined in this case
        console.log('No such document!')
      }

      /*  const query = `*[_type == "product" && slug.current ==  '${slug}' ][0]`; */

      const currentProduct = docSnap.data()
      setReviewProduct(currentProduct as PageProps)
      setWriteReview(false)
    }
    Review()
  }, [reviewAdded])

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
    setReviewAdded(prev => !prev)
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
          <p className="pl-3">{singleProduct?.reviews.length} reviews</p>
        </div>
        <p className="text-lg font-extrabold">{singleProduct?.price} TL</p>

        <div className="flex items-center justify-center gap-3">
          <input
            className="flex w-20 items-center justify-between rounded-full border border-black py-1.5 px-2"
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

        <div className="review-section">
          <h2 className="text-2xl font-bold">Customer Reviews</h2>
          <div className="flex items-center justify-center gap-3">
            <Rating name="read-only" value={4} readOnly />
            <p>Based on {singleProduct?.reviews.length} reviews</p>
            <button
              className="rounded-full border border-black py-1 px-2"
              onClick={() => setWriteReview((prev) => !prev)}
            >
              Write a review
            </button>
          </div>
          {/* write a review section */}
          {writeReview && (
            <>
              <h2 className="text-xl underline decoration-sky-500 decoration-4 underline-offset-8 ">
                Write a review
              </h2>
              <div className="flex max-w-[910px] flex-col gap-3">
                <div className="mt-5 flex gap-5">
                  <p>Rating</p>
                  <Rating
                    name="simple-controlled"
                    value={value}
                    onChange={(event, newValue) => {
                      setValue(newValue)
                    }}
                  />
                </div>
                <p>Review Title</p>
                <input
                  id="outlined-multiline-static"
                  className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-black focus:border-blue-500 focus:ring-blue-500"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
                <p>Body of Review</p>
                <textarea
                  id="outlined-multiline-static"
                  className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                  value={review}
                  onChange={(e) => setReview(e.target.value)}
                />
                <button
                  type="submit"
                  className="w-full rounded-full bg-[#0a6cdc] py-3 font-semibold"
                  onClick={() => {
                    addReview(singleProduct, value, review)
                  }}
                >
                  Submit
                </button>
              </div>
            </>
          )}

          {/* reviews section */}
          <h2>Reviews</h2>
          {reviewProduct?.reviews.map((review : any) =>
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
