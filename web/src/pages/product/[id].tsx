import { gql, useQuery } from "@apollo/client";
import Loader from "@src/components/Loader/Loader";
import ProductPage from "@src/components/ProductPage/ProductPage";
import { Product } from "@src/graphql/graphql";
import { useRouter } from "next/router";
import { useState } from "react";
import BigSection from "../../components/Sections/BigSection";
import ImageSlider from "../../components/Utils/ImageSlider/ImageSlider";

const productQuery = gql`
  query ($id: ID!) {
    productByID(product_id: $id) {
      product_id
      title
      titleExtraInfo
      description
      location
      sellType
      price
      created_at
      haveImages
      user {
        public_user_id
        email
        haveAvatar
        name
        surname
      }
      product_images {
        image_url
      }
    }
  }
`;

interface props {}

interface queryType {
  productByID: Product;
}

export default function ProductPageById(props: props) {
  const router = useRouter();

  /* ------------------------------ GraphQL Query ----------------------------- */
  const { loading, error, data } = useQuery<queryType>(productQuery, {
    variables: { id: router.query.id },
  });
  if (loading)
    return (
      <div>
        <Loader size="large" />
      </div>
    );
  if (error) return <p>{"Error :("}</p>;
  if (!data) return <p>{"No Data :("}</p>;

  console.log(data);
  /* ---------------------------------- Page ---------------------------------- */
  return (
    <>
      <ProductPage product={data.productByID} />
    </>
  );
}
