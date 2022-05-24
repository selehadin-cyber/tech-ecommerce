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
  const [title, setTitle] = useState("")
  const [review, setReview] = useState('review')
  const { addFav, user, onAdd } = useAuth()
  const [qty, setQty] = useState(1)

  const getUserName = async () => {
    if (user) { const docRef = doc(database, 'user', user?.uid)!
      const userSnap = await getDoc(docRef)
    
      if (userSnap.exists()) {
        return userSnap.get("userName")
      } else {
        // doc.data() will be undefined in this case
        console.log('No such document!')
      }
    }else {console.log("user not found")}
  
    }
  

  const addReview = async (
    product: any,
    star: number | null,
    review: string
  ) => {
    // Atomically add a new region to the "regions" array field.
    const Name = await getUserName();
    const userUid = user.uid
    const usersRef = doc(database, 'products', product.name)
    await updateDoc(usersRef, {
      reviews: arrayUnion({
        [Name]: {
          star: star,
          title: title,
          review: review,
          name: Name
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
      <img src={singleProduct?.image} alt="product-image" />
      <h1 className="text-center text-xl font-bold">{singleProduct?.name}</h1>
      <p>{singleProduct?.price} TL</p>
      <button
        type="button"
        className="mr-2 mb-2 rounded-full bg-blue-700 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        onClick={() => onAdd(singleProduct, qty)}
      >
        Add to Cart
      </button>
      <input className="" name="quantity" value={qty} type="number" onChange={(e) => setQty(parseInt(e.target.value))}/>
      <button
        onClick={() => addFav(singleProduct)}
        type="button"
        className="h-10 w-10 rounded-full bg-gray-300"
      >
        <BsHeart className="m-auto" />
      </button>
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
      <h2>Reviews</h2>
      {singleProduct?.reviews.map((review) =>
        Object.values(review).map((review: any) => (
          <>
            <h2 className='font-bold'>{review.title}</h2>
            <p className='text-sm'>{review.name}</p>
            <Rating
              name="read-only"
              value={review.star}
              readOnly
            />
            <p>review: {review.review}</p>
          </>
        ))
      )}
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
