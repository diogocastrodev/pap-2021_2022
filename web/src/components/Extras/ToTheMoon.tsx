import { ArrowUpIcon } from "@heroicons/react/outline";
import Button from "@components/Form/Buttons/Button";
import { useEffect, useState } from "react";

export default function ToTheMoon() {
  function handleClick() {
    if (typeof window !== "undefined") {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  }
  return (
    <>
      <Button
        className="bg-blue-500 hover:bg-blue-600 fixed bottom-8 right-8 h-10 w-10 flex justify-center items-center z-[99]"
        onClick={handleClick}
      >
        <ArrowUpIcon className="w-8" />
      </Button>
    </>
  );
}
