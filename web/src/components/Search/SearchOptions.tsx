import { Listbox } from "@headlessui/react";
import { useHookstate } from "@hookstate/core";
import { searchGlobalState } from "@src/context/SearchContext";
import { FormEvent, useEffect, useState } from "react";
import TextInput from "../Form/Inputs/TextInput";
import Label from "../Form/Inputs/Label/Label";
import { Product, ProductSellType } from "@src/graphql/graphql";
import { gql, useLazyQuery, useQuery } from "@apollo/client";
import Button from "../Form/Buttons/Button";
import InfiniteScroll from "react-infinite-scroll-component";
import BigSection from "../Sections/BigSection";
import Loader from "../Loader/Loader";
import ProductShowCase from "../Products/ProductShowcase";

const categories = [
  {
    id: "1",
    name: "Imobiliarios",
    disabled: false,
  },
  {
    id: "2",
    name: "Veiculos",
    disabled: false,
  },
  {
    id: "3",
    name: "Outros",
    disabled: false,
  },
  {
    id: "4",
    name: "Empregos",
    disabled: false,
  },
];

const ProductSellTypeArray = [
  {
    name: "Don't matter",
  },
  {
    name: "SELL",
  },
  {
    name: "TRADE",
  },
];

const getProductsByPage = gql`
  query productByPage($data: productByPageInput!) {
    productByPage(data: $data) {
      product_id
      title
      titleExtraInfo
      description
      location
      sellType
      price
      created_at
      haveImages
      product_images {
        image_url
      }
    }
  }
`;

type getProductsByPageProps = {
  productByPage: Product[];
};

/* const ProductSellTypeArray = Object.values(ProductSellType);
 */
export default function SearchOptions() {
  const [HasMore, setHasMore] = useState<boolean>(true);
  const [Products, setProducts] = useState<Product[]>([]);

  const [Page, setPage] = useState<number>(1);

  const [Category, setCategory] = useState(categories[0].name);
  const searchState = useHookstate(searchGlobalState);

  const [MinPrice, setMinPrice] = useState(0);
  const [MaxPrice, setMaxPrice] = useState(0);

  const [Maker, setMaker] = useState("");

  const [Location, setLocation] = useState("");

  const [SellType, setSellType] = useState(ProductSellTypeArray[0].name);

  const [queryPage, { loading }] =
    useLazyQuery<getProductsByPageProps>(getProductsByPage);

  useEffect(() => {
    appendNewPage();
  }, []);

  const fetchNewPage = async (): Promise<Product[] | undefined> => {
    const { data } = await queryPage({
      variables: {
        data: {
          page: Page,
          search: searchState.get().search,
          sellType: SellType,
          Location: Location,
          lastProductID:
            Products.length > 0 ? Products[Products.length - 1].product_id : "",
        },
      },
    });

    return data?.productByPage;
  };

  const appendNewPage = async () => {
    const newProducts = await fetchNewPage();

    if (newProducts) {
      setProducts([...Products, ...newProducts]);

      if (newProducts.length === 0 || newProducts.length < 5) {
        setHasMore(false);
      }
      setPage(Page + 1);
    }
  };

  console.log(Products);
  console.log(HasMore);

  return (
    <>
      <div className="bg-gray-300 shadow-xl m-4 mx-6 py-2 px-4 rounded-xl">
        <form>
          <div className="flex flex-row">
            <Listbox
              value={Category}
              onChange={setCategory}
              as="div"
              className={"relative"}
            >
              <div className="h-full flex flex-col">
                <Label text="Categoria" />
                <Listbox.Button className={"w-32 bg-gray-600 py-2 rounded-xl"}>
                  {Category}
                </Listbox.Button>
              </div>
              <Listbox.Options className="relative">
                <div className="absolute bg-gray-600 px-3 py-2 rounded-lg space-y-1 w-32">
                  {categories.map((category) => (
                    <Listbox.Option
                      key={category.id}
                      value={category.name}
                      disabled={category.disabled}
                    >
                      {({ active }) => {
                        return (
                          <div
                            className={`${
                              active ? "bg-blue-600" : "bg-transparent"
                            } px-2 py-0.5 rounded-lg cursor-pointer`}
                          >
                            {category.name}
                          </div>
                        );
                      }}
                    </Listbox.Option>
                  ))}
                </div>
              </Listbox.Options>
            </Listbox>
            <TextInput
              input={{
                color: "default",
                setValue: (e) => searchState.set({ search: e.target.value }),
                value: searchState.get().search,
                type: "text",
              }}
              label={{
                text: "O que procura?",
              }}
            />
          </div>
          <div className="flex flex-row justify-between mt-4">
            <div>
              <TextInput
                input={{
                  color: "default",
                  setValue: (e) => setLocation(e.target.value),
                  type: "text",
                }}
                label={{
                  text: "Marca",
                }}
              />
            </div>
            <div>
              <TextInput
                input={{
                  color: "default",
                  setValue: (e) => setLocation(e.target.value),
                  type: "text",
                }}
                label={{
                  text: "Localização",
                }}
              />
            </div>
            <div>
              <Label text="Sell Type" />
              <Listbox value={SellType} onChange={setSellType}>
                <Listbox.Button className={"w-36 bg-gray-600 py-2 rounded-xl"}>
                  {SellType}
                </Listbox.Button>
                <Listbox.Options className="relative">
                  <div className="absolute bg-gray-600 px-3 py-2 rounded-lg space-y-1 w-36">
                    {ProductSellTypeArray.map((type, i) => (
                      <Listbox.Option
                        key={i}
                        value={type.name}
                        /*                   disabled={person.unavailable}
                         */
                      >
                        {({ active }) => {
                          return (
                            <div
                              className={`${
                                active ? "bg-blue-600" : "bg-transparent"
                              } px-2 py-0.5 rounded-lg cursor-pointer`}
                            >
                              {type.name}
                            </div>
                          );
                        }}
                      </Listbox.Option>
                    ))}
                  </div>
                </Listbox.Options>
              </Listbox>
            </div>
            {SellType === "SELL" && (
              <div>
                <Label text="Price Range" />
                <input
                  type="range"
                  name=""
                  id=""
                  min="0"
                  max="100"
                  className="py-2"
                />
              </div>
            )}
          </div>
          {/* <Button
          button={{
            color: "blue",
            buttonType: "submit",
            label: "Search",
            disabled: loading,
          }}
        /> */}
        </form>
      </div>
      <div className="overflow-hidden">
        <InfiniteScroll
          dataLength={Products.length}
          hasMore={HasMore}
          loader={<Loader size="medium" />}
          next={appendNewPage}
          className="overflow-hidden flex flex-col items-center"
        >
          {Products.map((product, i) => (
            <ProductShowCase product={product} key={i} />
          ))}
        </InfiniteScroll>
      </div>
    </>
  );
}
