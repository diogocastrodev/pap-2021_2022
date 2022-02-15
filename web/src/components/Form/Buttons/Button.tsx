import { ReactElement } from "react";

type ButtonTypes = "button" | "reset" | "submit" | undefined;

interface props {
  mainDiv?: {
    className: string;
  };
  button: {
    /* Type */
    buttonType: ButtonTypes;
    /* Data */
    label: string;
    /* What button will do */
    buttonOnClick?: () => void;
    /* Icon */
    icon?: {
      position: "left" | "right";
      icon: ReactElement;
    };
    /* Custom Properties */
    className?: string;
    disabled?: boolean;
    /*
     * Default: Blue
     */
    color:
      | "blue"
      | "red"
      | "green"
      | "yellow"
      | "orange"
      | "gray"
      | "transparent";
    rounded?: boolean;
  };
}

export default function Button(props: props) {
  return (
    <div
      className={`
      ${props.mainDiv ? props.mainDiv.className : ""}`}
    >
      <button
        type={props.button.buttonType}
        onClick={props.button.buttonOnClick}
        disabled={props.button.disabled}
        aria-label="YEEET"
        className={`px-4 py-1.5 flex items-center justify-center ${
          props.button.rounded ? "rounded-full" : "rounded-md"
        } font-semibold capitalize tracking-wider font-inter
        ${
          props.button.color === "blue"
            ? "bg-blue-500 text-white"
            : props.button.color === "red"
            ? "bg-red-500 text-white"
            : props.button.color === "green"
            ? "bg-green-500 text-white"
            : props.button.color === "yellow"
            ? "bg-yellow-500 text-white"
            : props.button.color === "orange"
            ? "bg-orange-500 text-white"
            : props.button.color === "gray"
            ? "bg-gray-500 text-white"
            : props.button.color === "transparent" &&
              "bg-transparent text-black "
        } 
        ${props.button.className}`}
      >
        {props.button.icon &&
          props.button.icon.position === "left" &&
          props.button.icon.icon}
        {props.button.label}
        {props.button.icon &&
          props.button.icon.position === "right" &&
          props.button.icon.icon}
      </button>
    </div>
  );
}
