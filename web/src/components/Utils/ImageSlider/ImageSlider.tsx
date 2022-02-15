import React, { useState } from "react";
import { Maybe, ProductImage } from "@src/graphql/graphql";
import { config } from "@src/global/variables";
import Button from "@src/components/Form/Buttons/Button";
import {
  ArrowSmLeftIcon,
  ArrowSmRightIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@heroicons/react/solid";

interface props {
  product_id: string;
  haveImages: boolean;
  images: ProductImage[];
}

const ImageSlider = (props: props) => {
  // takes in images as props
  const [index, setIndex] = useState<number>(0); // create state to keep track of images index, set the default index to 0

  const slideRight = () => {
    setIndex((index + 1) % props.images.length); // increases index by 1
  };

  const slideLeft = () => {
    const nextIndex = index - 1;
    if (nextIndex < 0) {
      setIndex(props.images.length - 1); // returns last index of images array if index is less than 0
    } else {
      setIndex(nextIndex);
    }
  };

  return (
    <>
      <div className="flex-col">
        {props.haveImages ? (
          <img
            src={`${config.CDN.protocol}://${config.CDN.URL}/img/images/${props.product_id}/${props.images[index].image_url}`}
            alt={index.toString()}
            className="w-full h-full object-cover bg-transparent shadow-lg"
          />
        ) : (
          <div className="w-full h-full bg-slate-500"></div>
        )}
        <div className="flex justify-center items-center mt-3">
          <Button
            button={{
              buttonType: "button",
              buttonOnClick: slideLeft,
              color: "blue",
              label: "",
              icon: {
                position: "right",
                icon: <ChevronLeftIcon className="w-6" />,
              },
            }}
          />
          <div className="text-xl mx-6">{`${index + 1} / ${
            props.images.length
          }`}</div>
          <Button
            button={{
              buttonType: "button",
              buttonOnClick: slideRight,
              color: "blue",
              label: "",
              icon: {
                position: "right",
                icon: <ChevronRightIcon className="w-6" />,
              },
            }}
          />
        </div>
      </div>
    </>
  );
};

export default ImageSlider;
