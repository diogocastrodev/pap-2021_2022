import { Collection } from "@src/graphql/graphql";
import Link from "next/link";

interface props {
  collection: Collection;
  className?: string;
}

export default function CollectionBox(props: props) {
  return (
    <>
      <div
        className={`h-64 w-52 bg-gray-50 rounded-lg shadow-lg ${
          props.className && props.className
        }`}
      >
        <div className="h-48 w-full bg-gray-300 rounded-lg"></div>
        <div className="mx-2 my-1 flex flex-col">
          <Link href={`/user/collection/${props.collection.collection_id}`}>
            <div className="text-ellipsis overflow-hidden cursor-pointer">
              <span className="text-xl ">{props.collection.name}</span>
            </div>
          </Link>
          <span className="mt-auto">
            {props.collection.collections_product.length}
          </span>
        </div>
      </div>
    </>
  );
}
