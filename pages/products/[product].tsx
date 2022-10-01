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
import { Context, useAuth } from '../../context/AuthContext'
import { TextField } from '@mui/material'
import Image from 'next/image'
import ReactImageZoom from 'react-image-zoom';
import Navbar from '../../components/navbar'
import Link from 'next/link'
import { Props } from '../../components/Product'
import Login from '../../components/SignIn'
import { Toaster } from 'react-hot-toast'

interface IParams extends ParsedUrlQuery {
  product: string
}

export type Review = {
  any: string
}

export type Product = {
  price: number
  'on-sale': boolean
  type: string
  name: string
  image: string
  reviews: Review[]
  imageArray: string[]
  desc: string
  average: number
}

export interface PageProps {
  singleProduct?: {
    price: number
    'on-sale': boolean
    type: string
    name: string
    image: string
    reviews: any[]
    imageArray: string[]
    desc: string
    average: number
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
  const { addFav, user, onAdd, showSignIn } = useAuth() as Context
  const [qty, setQty] = useState(1)
  const [reviewAdded, setReviewAdded] = useState(false)
  const [reviewProduct, setReviewProduct] = useState<PageProps>()
  const [imageIndex, setImageIndex] = useState(0)

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
    setReviewAdded((prev) => !prev)
    // Atomically remove a region from the "regions" array field.
    /* await updateDoc(usersRef, {
      regions: arrayRemove('east_coast'),
    }) */
  }

  const props = {width: 250 , height: 250, zoomWidth: 500, zoomPosition: "original"};

  return (
    <>
      <Navbar />
      {showSignIn ? <Login />: null}
      <Toaster position="bottom-center" />
      <div className="ultra-container px-5 w-full pt-20">
        <div className="flex py-7 text-[#808080]">
          <Link href={'/'}>
            <p className="cursor-pointer">Home</p>
          </Link>
          <span className="px-1.5">/</span>
          <p> Products</p>
          <span className="px-1.5">/</span>
          <p>{singleProduct?.name}</p>
        </div>
        <div className="super-container flex flex-wrap mb-8">
          <div className="left-container flex md:max-w-[calc(50%-10px)] w-full px-3 flex-col">
            <div className="image-parent relative h-[250px] w-[100%] flex justify-center overflow-hidden">
              <ReactImageZoom {...{...props, img: singleProduct?.imageArray[imageIndex] as string}} />
            </div>
            <div className="small-images-container my-5 flex justify-center px-32">
              {singleProduct?.imageArray.map((item, i) => (
                <img
                  src={item}
                  key={i}
                  alt="carousel-image"
                  className={
                    i === imageIndex
                      ? 'selected-image m-1 w-16 border border-blue-800'
                      : 'm-1 w-16'
                  }
                  onClick={() => setImageIndex(i)}
                />
              ))}
            </div>
          </div>
          <div className="right-container md:max-w-[calc(50%+10px)] px-3">
            <h1 className="mb-5 text-left font-rubik text-[24px] font-bold">
              {singleProduct?.name}
            </h1>
            <div className="flex font-thin mb-5 -z-10">
              <Rating name="read-only" value={singleProduct?.average} readOnly />
              <p className="pl-3 text-[#808080]">{singleProduct?.reviews.length} reviews</p>
            </div>

            <div className="product-info mb-5">
              <div className="vendor-product">
                <label className="text-[#808080]">Vendor: </label>
                <span>
                  <a
                    href="/"
                    title="Ihsan - Technologies"
                  >
                     Ihsan - Technologies
                  </a>
                </span>
              </div>
              <div className="sku-product">
                <label className="text-[#808080]">SKU: </label>
                <span>KJSU-58636</span>
              </div>
              <div className="product-inventory">
                <label className="text-[#808080]">Availability: </label>
                <span>10 In stock</span>
              </div>
              <div className="product-type">
                <label className="text-[#808080]">Product Type: </label>
                <span>Technology</span>
              </div>
            </div>

            <p className="text-lg font-extrabold font-rubik">{singleProduct?.price} TL</p>
            <p className='mb-5 font-dmsans text-[#505050]'>{singleProduct?.desc}</p>
            <div className="flex items-center justify-center gap-3">
              <input
                className="flex w-20 items-center justify-between rounded-full border border-black py-1.5 px-3 h-14"
                name="quantity"
                value={qty}
                type="number"
                min={1}
                max={99}
                onChange={(e) => setQty(parseInt(e.target.value))}
              />
              <button
                type="button"
                className="mr-2 w-full shadow-xl rounded-full bg-blue-700 px-5 py-5 text-center text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                onClick={() => onAdd(singleProduct, qty)}
              >
                Add to Cart
              </button>
              <button
                onClick={() => addFav(singleProduct)}
                type="button"
                className="h-14 min-w-[56px] rounded-full bg-gray-300 hover:bg-pink-300"
              >
                <BsHeart className="m-auto" size={23}/>
              </button>
            </div>
          </div>
        </div>

        <div className="review-section mb-32">
          <h2 className="text-2xl font-bold">Customer Reviews</h2>
          <div className="flex items-center justify-start gap-3">
            <Rating name="read-only" value={4} readOnly />
            <p>Based on {singleProduct?.reviews.length} reviews</p>
            <button
              className="rounded-full border border-black py-1 px-3 h-11"
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
                    value={singleProduct?.average}
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
          {reviewProduct?.reviews.map((review: any) =>
            Object.values(review).map((review: any, id) => (
              <div key={id}>
                <h2 className="font-bold">{review.title}</h2>
                <p className="text-sm">{review.name}</p>
                <Rating name="read-only" value={review.star} readOnly />
                <p>review: {review.review}</p>
              </div>
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
  })
  const paths = productsArray.map((product: Props) => ({
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
