interface props {
  size: "small" | "medium" | "large";
  className?: string;
}

export default function Loader(props: props) {
  return (
    <div
      className={`border-x-transparent border-y-blue-500 ${
        props.size === "small"
          ? "border-[3px] h-6 w-6"
          : props.size === "medium"
          ? "border-[5px] h-12 w-12"
          : "border-[7px] h-24 w-24"
      } rounded-[50%] animate-spin ${props.className && props.className}`}
      /*  */
    ></div>
  );
}
