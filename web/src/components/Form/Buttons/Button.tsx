import { ReactElement } from "react";

type ButtonTypes = "button" | "reset" | "submit" | undefined;

interface props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon?: {
    position: "left" | "right";
    icon: ReactElement;
  };

  color?:
    | "blue"
    | "red"
    | "green"
    | "yellow"
    | "orange"
    | "gray"
    | "transparent";
}

export default function Button(props: props) {
  return (
    <button
      {...props}
      className={`px-3 py-1.5 flex items-center justify-center rounded-md font-semibold capitalize tracking-wider font-inter w-fit
        ${
          props.color === "blue"
            ? "bg-blue-500 text-white"
            : props.color === "red"
            ? "bg-red-500 text-white"
            : props.color === "green"
            ? "bg-green-500 text-white"
            : props.color === "yellow"
            ? "bg-yellow-500 text-white"
            : props.color === "orange"
            ? "bg-orange-500 text-white"
            : props.color === "gray"
            ? "bg-gray-500 text-white"
            : props.color === "transparent"
            ? "bg-transparent text-black "
            : "bg-blue-500 text-white"
        } 
        ${props.className || ""}`}
    >
      {props.icon && props.icon.position === "left" && (
        <div className="w-6 mr-1">{props.icon.icon}</div>
      )}
      {props.children}
      {props.icon && props.icon.position === "right" && (
        <div className="w-6 ml-1">{props.icon.icon}</div>
      )}
    </button>
  );
}
