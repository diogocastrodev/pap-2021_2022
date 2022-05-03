import checkDarkMode from "@src/functions/checkDarkMode";

export function changeTheme() {
  if(typeof window !== "undefined") {
  const theme = localStorage.getItem("theme");
  if (theme === "dark") {
    localStorage.setItem("theme", "light");
  } else if (theme === "light") {
    localStorage.setItem("theme", "dark");
  }
  checkDarkMode();
}
}

export function getTheme(): string {
  let theme: string = "";

  if (typeof window !== "undefined") {

    theme = localStorage.getItem("theme") as string;
    if (theme === "dark") {
      theme = "dark";
    } else if (theme === "light") {
      theme = "light";
    } else {
      checkDarkMode();
      theme = localStorage.getItem("theme") as string;
    }
  }
  return theme;

}
