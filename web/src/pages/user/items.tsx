import { gql, useQuery } from "@apollo/client";
import CounterBlips from "@src/components/user/items/blips/Blips";
import ItemsByStatus from "@src/components/user/items/itemsByStatus";
import { Product, ProductStatus } from "@src/graphql/graphql";
import Loader from "../../components/Loader/Loader";

const myProductsQuery = gql`
  query userProducts {
    userProducts {
      product_id
      product_status
    }
  }
`;

type myProductsQueryProps = {
  userProducts: Product[];
};

type ProductStatusAvailableProps = {
  active: {
    name: string;
    color: "green";
    amount: number;
    plural: string;
  };
  expired: {
    name: string;
    color: "orange";
    amount: number;
    plural: string;
  };
  inactive: {
    name: string;
    color: "red";
    amount: number;
    plural: string;
  };
};

export default function MyItemsPage() {
  const { loading, error, data } =
    useQuery<myProductsQueryProps>(myProductsQuery);
  if (loading) return <Loader size="medium" />;
  if (error) return <p>Error</p>;

  const counter = {
    active: () => {
      let count = 0;
      data?.userProducts.forEach((product) => {
        if (product.product_status === ProductStatus.Active) count++;
      });
      return count;
    },
    inactive: () => {
      let count = 0;
      data?.userProducts.forEach((product) => {
        if (product.product_status === ProductStatus.Inactive) count++;
      });
      return count;
    },
    expired: () => {
      let count = 0;
      data?.userProducts.forEach((product) => {
        if (product.product_status === ProductStatus.Expired) count++;
      });
      return count;
    },
  };

  const ProductStatusAvailable: ProductStatusAvailableProps = {
    active: {
      name: "Ativo",
      color: "green",
      amount: counter.active(),
      plural: "Ativos",
    },
    expired: {
      name: "Expirado",
      color: "orange",
      amount: counter.expired(),
      plural: "Expirados",
    },
    inactive: {
      name: "Inativo",
      color: "red",
      amount: counter.inactive(),
      plural: "Inativos",
    },
  };

  return (
    <div className="text-black flex justify-center">
      <div className="container pt-8 px-2 flex flex-col">
        <div className="text-2xl">
          {"Tens atualmente: "}
          <span className="text-xl underline underline-offset-1 decoration-2">
            {data?.userProducts.length + " produto"}
            {data?.userProducts && data?.userProducts.length > 1 && "s"}
          </span>
        </div>
        <div className="ml-8 mt-1">
          <CounterBlips
            name={ProductStatusAvailable.active.name}
            amount={ProductStatusAvailable.active.amount}
            plural={ProductStatusAvailable.active.plural}
            space={true}
            blip={{
              color: ProductStatusAvailable.active.color,
            }}
          />
          <CounterBlips
            name={ProductStatusAvailable.expired.name}
            amount={ProductStatusAvailable.expired.amount}
            plural={ProductStatusAvailable.expired.plural}
            space={true}
            blip={{
              color: ProductStatusAvailable.expired.color,
            }}
          />
          <CounterBlips
            name={ProductStatusAvailable.inactive.name}
            amount={ProductStatusAvailable.inactive.amount}
            plural={ProductStatusAvailable.inactive.plural}
            space={true}
            blip={{
              color: ProductStatusAvailable.inactive.color,
            }}
          />
        </div>
        <ItemsByStatus
          amount={ProductStatusAvailable.active.amount}
          name={ProductStatusAvailable.active.name}
          plural={ProductStatusAvailable.active.plural}
          blip={{
            color: ProductStatusAvailable.active.color,
          }}
        />
      </div>
    </div>
  );
}
