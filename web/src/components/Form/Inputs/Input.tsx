import React, { ReactElement } from "react";

interface input extends React.InputHTMLAttributes<HTMLInputElement> {
  ref?: React.Ref<HTMLInputElement | undefined>;
}

interface mainDiv extends React.HTMLAttributes<HTMLDivElement> {
  ref?: React.Ref<HTMLDivElement | undefined>;
}

interface props {
  icon?: ReactElement;
  mainDiv?: mainDiv;
  input?: input;
  button?: {
    icon: ReactElement;
    type: "submit" | "button" | "reset";
    className?: string;
    otherProps?: React.ButtonHTMLAttributes<HTMLButtonElement>;
  };
}

/* TODO: AS ANY REMOVE THEM :( */

export default function Input(props: props) {
  return (
    <div className="group">
      <div
        className={`flex flex-row items-center w-full py-2 px-4 rounded-xl ring-0 group-focus:ring-2 group-focus:ring-blue-40 bg-gray-200 ${props.mainDiv?.className}`}
        {...(props.mainDiv as any)}
      >
        {props.icon && (
          <div className="flex items-center flex-none justify-center w-6 h-6  text-black text-opacity-80 mr-2">
            {props.icon}
          </div>
        )}
        <input
          {...(props.input as any)}
          className={`w-full focus:outline-none bg-transparent ${props.input?.className}`}
        />
        {props.button && (
          <button
            {...props.button.otherProps}
            type={props.button.type}
            className={`w-6 h-6 flex items-center justify-center bg-transparent ${
              props.button.type === "submit" ? "text-blue-500" : "text-gray-500"
            }`}
          >
            {props.button.icon}
          </button>
        )}
      </div>
    </div>
  );
}
