import { ChangeEvent, ReactElement } from "react";
import Label from "./Label/Label";

type inputTypes =
  | "text"
  | "password"
  | "email"
  | "number"
  | "tel"
  | "url"
  | "search"
  | "date"
  | "time"
  | "datetime-local"
  | "month"
  | "week"
  | "color"
  | "file"
  | "range"
  | "checkbox"
  | "radio"
  | "hidden"
  | "image";

interface props {
  mainDiv?: {
    className: string;
  };

  input: {
    /* Input Type */
    type: inputTypes;

    /* Data */
    value?: string;
    setValue: (e: ChangeEvent<HTMLInputElement>) => void;

    /* Input Properties */
    name?: string;
    id?: string;
    className?: string;
    hidden?: boolean;
    placeholder?: string;
    autoFocus?: boolean;
    required?: boolean;
    shadow?: boolean;
    autoComplete?: "on" | "off";

    space?: boolean;

    color: "default" | "transparent";

    /* Icon on Start */
    icon?: {
      inputIcon: ReactElement;
    };
  };

  /* Input Label */
  label?: {
    text: string;
    className?: string;
  };

  button?: {
    /* Type */
    buttonType?: "button" | "reset" | "submit" | undefined;
    /* What button will do */
    buttonOnClick?: () => void;
    /* Icon */
    icon: ReactElement;
    /* Custom Properties */
    className?: string;
  };
}

export default function TextInput(props: props) {
  return (
    <div
      className={`w-full px-4 pt-0 ${
        props.input.space ? "pb-2" : "pb-0"
      } group-focus:ring-2 ring-blue-400 ${
        props.mainDiv && props.mainDiv.className
      }`}
    >
      <label>
        {props.label && (
          <Label
            text={props.label.text}
            className={props.label.className}
            input={{
              required:
                typeof props.input.required !== "undefined" &&
                props.input.required,
            }}
          />
        )}
        <div className="group">
          <div
            className={`flex flex-row justify-center items-center w-full py-2 px-4 rounded-xl ${
              props.input.shadow
                ? "shadow-lg"
                : "ring-2 ring-gray-300 ring-opacity-80"
            } ${
              props.input.color === "default" ? "bg-gray-50" : "bg-transparent"
            } ring-0 group-focus:bg-black ring-blue-40`}
          >
            {props.input.icon && (
              <div className="flex items-center flex-none justify-center w-6 h-6  text-black text-opacity-80 mr-2">
                {props.input.icon.inputIcon}
              </div>
            )}
            <input
              type={props.input.type}
              name={props.input.name}
              id={props.input.id}
              value={props.input.value && props.input.value}
              onChange={props.input.setValue}
              hidden={props.input.hidden}
              placeholder={props.input.placeholder}
              autoFocus={props.input.autoFocus}
              accept={"image/png, image/jpeg , image/jpg"}
              autoComplete={props.input.autoComplete}
              className={` w-full grow focus:outline-none bg-transparent placeholder:capitalize text-black placeholder:text-black placeholder:text-opacity-70pr-2 ${
                props.input.className && props.input.className
              }`}
              required={props.input.required}
            />
            {props.button && (
              <div className="ml-auto px-2 flex items-center flex-none">
                <button
                  type={props.button.buttonType}
                  onClick={props.button.buttonOnClick}
                  className={props.button.className}
                >
                  {props.button.icon && (
                    <div
                      className={`flex items-center justify-center w-6 h-6  text-black text-opacity-80 ${
                        props.input.className && props.input.className
                      }`}
                    >
                      {props.button.icon}
                    </div>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      </label>
    </div>
  );
}
