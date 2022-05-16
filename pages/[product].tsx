import { collection, doc, getDoc, getDocs, query, where } from 'firebase/firestore'
import { GetStaticProps } from 'next'
import { ParsedUrlQuery } from 'querystring';
import React from 'react'
import { database } from '../config/firebase'

interface IParams extends ParsedUrlQuery {
    product: string;
  }

const ProductPage = () => {
  return <div>ProductPage</div>
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
    const { product } = context.params as IParams;
   
    const docRef = doc(database, "products", `${product}`);
const docSnap = await getDoc(docRef);

if (docSnap.exists()) {
  console.log("Document data:", docSnap.data());
} else {
  // doc.data() will be undefined in this case
  console.log("No such document!");
}    
          
    
         
   
   /*  const query = `*[_type == "product" && slug.current ==  '${slug}' ][0]`; */
    
    const product = docSnap.data();
   
  
    return {
      props: {  product },
    };
  };

export default ProductPage
