import { gql, useQuery } from "@apollo/client";
import { Profile } from "@src/graphql/graphql";
import Loader from "../Loader/Loader";
import ProductShowCase from "../Products/ProductShowcase";
import ProfileBanner from "./ProfileBanner";

interface props {
  public_id: string;
}

const userData = gql`
  query profilePage($id: ID!) {
    profile(id: $id) {
      email
      haveAvatar
      avatar
      name
      surname
      product {
        product_id
        title
        description
        location
        sellType
        titleExtraInfo
        price
        created_at
        haveImages
        product_images {
          image_url
          product_id
        }
      }
    }
  }
`;

export default function ProfilePageComp(props: props) {
  var profileData: Profile;

  const { loading, error, data } = useQuery(userData, {
    variables: {
      id: props.public_id,
    },
  });

  if (loading) return <Loader size="medium" />;
  if (error) return <div>Error</div>;
  if (!data) return <div>No Content</div>;

  /* Get TypeScript types */
  profileData = data.profile;

  console.log(profileData);

  return (
    <>
      <div className="w-full h-full">
        <div className="w-full flex flex-col items-center md:items-start md:flex-row md:ml-8 mt-8">
          <ProfileBanner
            avatar={{
              hasAvatar: profileData.haveAvatar,
              userId: props.public_id,
            }}
            sizes="w-64 h-64 md:w-48 md:h-48"
          />
          <div className="flex flex-col">
            <span className="md:ml-6 mt-3 md:mt-8 text-3xl md:text-xl">
              {profileData.name + " " + profileData.surname}
            </span>
          </div>
        </div>
        <div className="mx-8 mt-10">
          <span className="ml-2 text-2xl">
            Produtos:
            <span className="ml-4 text-lg">
              ({profileData.product?.length})
            </span>
          </span>
          {profileData.product && profileData.product?.length > 0 && (
            <div className="w-full flex flex-col items-center mt-4 flex-wrap">
              {profileData.product?.map(
                (product) =>
                  product && (
                    <ProductShowCase
                      product={product}
                      key={product?.product_id}
                    />
                  )
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
