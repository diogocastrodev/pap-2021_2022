import { useEffect, useState } from "react";

/* create a function to check if user have light or dark mode on pc and store it on localStorage */
export default function checkDarkMode () {
  const themes = ["light", "dark"] as const;

  const systemTheme = () => {
    if(typeof window !== "undefined") {
      if(window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
        localStorage.setItem("theme", "dark");
      } else {
        localStorage.setItem("theme", "light");
      }
    }
  }

  if(typeof window !== "undefined"){
    if(typeof localStorage.getItem("theme") === "string") {
      // @ts-expect-error
      if(themes.includes(localStorage.getItem("theme"))) {
        if(localStorage.getItem("theme") === "dark") {
          document.body.classList.add("dark");
        } else {
          document.body.classList.remove("dark")
      }
     } else {
       systemTheme();
     }
    } else {
      systemTheme();
    }
  }
}