import { useEffect, useState } from "react";
import Button from "../../Form/Buttons/Button";
import checkDarkMode from "../../../functions/checkDarkMode";
import { changeTheme, getTheme } from "../../../functions/changeTheme";

interface props {
  text?: string;
}

export default function ThemeButton(props: props) {
  /*   const [theme, setTheme] = useState<string>("");

  const handleButton = () => {
    if (typeof window !== "undefined") {
      const theme = localStorage.getItem("theme");
      if (theme === "dark") {
        localStorage.setItem("theme", "light");
        setTheme("light");
      } else if (theme === "light") {
        localStorage.setItem("theme", "dark");
        setTheme("dark");
      }
      checkDarkMode();

      setTheme(localStorage.getItem("theme") as string);
    }
  };

  useEffect(() => {
    setTheme(getTheme());
  }, []);

  return (
    <button
      className=" px-1 py-1 flex items-center justify-center hover:bg-gray-200 text-black rounded-full"
      onClick={handleButton}
    >
      <div className="w-5">
        {theme === "dark" ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
            />
          </svg>
        ) : (
          theme === "light" && (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
            </svg>
          )
        )}
      </div>
      {props.text && <span className="ml-1">{props.text}</span>}
    </button>
  ); */
}
