import { SectionType } from "./SectionTypes";
import Image from "next/image";
import { ProductSellType } from "@src/graphql/graphql";

interface props {
  sectionProps: SectionType;
}

export default function BigSection(props: props) {
  const formatMoney = Intl.NumberFormat("en-US");
  return (
    <div className="w-full h-72 bg-gray-50 rounded-lg shadow-md">
      <div className={`w-full h-full flex`}>
        <div className="w-120 flex-shrink-0 min-h-full relative">
          <Image
            src={props.sectionProps.image}
            alt={props.sectionProps.title}
            layout="fill"
            className=" rounded-lg rounded-r-2xl bg-transparent object-left object-cover max-w-full max-h-full"
          />
        </div>
        <div className="flex-grow min-h-full pt-4 pl-6 pb-2 pr-6 w-full text-lg col-start-2 col-end-5">
          <div className="flex flex-row items-center">
            {/* Header */}
            <a
              className="text-2xl font-semibold"
              href={`/product/${props.sectionProps.id}`}
            >
              {props.sectionProps.title}
              <span className="pl-4 text-lg text-gray-500 text-opacity-90 font-normal">
                {props.sectionProps.titleExtraInfo &&
                  props.sectionProps.titleExtraInfo}
              </span>
            </a>
            <div className="ml-auto">
              {props.sectionProps.sellType === ProductSellType.Sell
                ? formatMoney.format(props.sectionProps.price) + "€"
                : "TRADE"}
            </div>
          </div>
          <div className="pt-6 text-gray-500 text-opacity-90 w-full h-40 overflow-ellipsis">
            {/* Description */}
            <p className="line-clamp-5">{props.sectionProps.description}</p>
          </div>
          <div className="pt-8">
            <div className="flex flex-row items-center">
              <div>{props.sectionProps.location}</div>
              <div className="ml-auto">{props.sectionProps.post_date}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
