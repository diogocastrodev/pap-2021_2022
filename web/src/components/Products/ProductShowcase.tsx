import { config } from "@src/global/variables";
import { Product, ProductSellType } from "@src/graphql/graphql";
import moment from "moment";
import Link from "next/link";

interface props {
  product: Product;
}

export default function ProductShowCase(props: props) {
  return (
    <>
      <div className="bg-gray-100 w-80 sm:w-144 h-[25rem] lg:h-60 lg:w-full mb-4 md:mb-8 rounded-md flex flex-col lg:flex-row shadow-lg">
        <div className="h-44 sm:h-60 w-full lg:w-108 bg-gray-300 rounded-lg flex-none">
          {props.product.haveImages ? (
            <img
              src={`${config.CDN.protocol}://${config.CDN.URL}/img/images/${props.product.product_id}/${props.product.product_images[0]?.image_url}`}
              className="h-full w-full object-cover rounded-lg rounded-r-none"
            />
          ) : (
            <div className="h-full w-full rounded-lg rounded-r-none bg-gray-400"></div>
          )}
        </div>
        <div className="p-2 flex-grow-0 flex flex-col lg:m-0 lg:p-3 h-full w-full">
          <div className="flex flex-row items-end mb-1">
            <div className="flex flex-col h-8 sm:flex-row max-w-fit text-ellipsis overflow-hidden mr-1">
              <a
                href={`/product/${props.product.product_id}`}
                className="capitalize"
              >
                <>
                  <span className="text-2xl">{props.product.title}</span>
                </>
              </a>
              <span className="sm:ml-2 text-lg opacity-70 ml-1 mt-1">
                {props.product.titleExtraInfo}
              </span>
            </div>
            <span className="ml-auto text-xl sm:text-2xl mr-2 capitalize min-w-fit">
              {props.product.sellType === ProductSellType.Trade
                ? "Trade"
                : `${props.product.price} €`}
            </span>
          </div>
          <p className="line-clamp-4 sm:line-clamp-3 lg:line-clamp-6 opacity-75 pl-3">
            {props.product.description}
          </p>
          <div className="flex flex-row mt-auto">
            <div className="text-xl mt-auto capitalize opacity-90">
              {props.product.location}
            </div>
            <div className="ml-auto mt-auto mr-2 opacity-90">
              {moment(
                props.product.created_at,
                "YYYY-MM-DD HH:mm:ss"
              ).fromNow()}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
