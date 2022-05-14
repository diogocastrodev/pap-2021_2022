import { CogIcon, LogoutIcon, MenuIcon } from "@heroicons/react/outline";
import { Menu } from "@headlessui/react";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "@src/context/AuthContext";
import Link from "next/link";
import { useRouter } from "next/router";

interface props {
  initialPage?: boolean;
}

type DropDownProps = {
  text: string;
  divider?: boolean;
  items: {
    text: string;
    href?: string;
    icon?: React.ReactElement;
    onClick?: () => void;
  }[];
}[];

export default function Navbar(props: props) {
  const user = useContext(AuthContext);

  const DropDownItems: DropDownProps = [
    {
      text: "Preferences",
      items: [
        {
          text: "Definições",
          href: "/user/settings",
          icon: <CogIcon />,
        },
        {
          text: "Sair",
          href: "#",
          icon: <LogoutIcon />,
          onClick: () => {
            user.logout();
          },
        },
      ],
    },
  ];

  const router = useRouter();

  const [screenY, setScreenY] = useState(0);

  useEffect(() => {
    if (window) {
      setScreenY(window.screenY);
    }
  }, [typeof window !== "undefined" && window.screenY]);

  return (
    <div
      className={`${
        props.initialPage && screenY === 0 ? `` : `shadow-lg bg-gray-50`
      } h-12 w-screen  sticky -top-0.5  overflow-hidden z-50`}
    >
      <div className="px-4 h-full flex">
        <div className="w-full flex flex-row items-center">
          <div className="text-black font-extrabold text-3xl">
            <Link href={"/"}>
              <span className="transition-all duration-500 bg-clip-text text-transparent bg-gradient-to-r from-violet-500 via-blue-400 to-violet-400 bg-size-200 bg-pos-0 hover:bg-pos-100 select-none cursor-pointer">
                {"note.so"}
              </span>
            </Link>
          </div>
          <div className="pl-6">
            <Link href={"/"}>
              <a className="text-black">Home</a>
            </Link>
          </div>
          {user.AuthData.is_logged && (
            <div className="pl-6">
              <Link href={`/dashboard`}>
                <a className="text-black">Dashboard</a>
              </Link>
            </div>
          )}
        </div>
        <div className="justify-self-end justify-end w-full h-full flex flex-row items-center pr-4">
          {!user.AuthData.loading &&
            (user.AuthData.is_logged ? (
              <Menu as="div" className={"relative"}>
                <Menu.Button as="div">
                  <MenuIcon className="h-5 w-5 cursor-pointer" />
                </Menu.Button>
                <Menu.Items
                  as="div"
                  className={
                    "fixed z-[100] top-11 select-none right-6 w-56 min-h space-y-1 bg-gray-100 py-4 px-4 rounded-lg shadow-lg focus:outline-none"
                  }
                >
                  {DropDownItems.map((item, key: number) => (
                    <div
                      className={`w-full h-full bg-transparent ${
                        item.divider
                          ? "border-b-2 border-neutral-200 pb-2 mb-2"
                          : ""
                      } `}
                      key={key}
                    >
                      <span className="text-center text-black text-opacity-60">
                        {item.text}
                      </span>
                      {item.items.map((item, key: number) => (
                        <Menu.Item
                          as="div"
                          key={key}
                          className={`mt-1`}
                          onClick={item.onClick}
                        >
                          {({ active }) => (
                            <Link href={item.href || "#"}>
                              <div
                                className={`${
                                  active
                                    ? "bg-neutral-300 text-black  text-opacity-80"
                                    : "bg-transparent text-black"
                                } w-full cursor-pointer pl-2 rounded-lg py-0.5 `}
                              >
                                {item.icon ? (
                                  <div className="flex items-center">
                                    <span className="w-5">{item.icon}</span>
                                    <span className="ml-1 text-md">
                                      {item.text}
                                    </span>
                                  </div>
                                ) : (
                                  <div className="pl-6">{item.text}</div>
                                )}
                              </div>
                            </Link>
                          )}
                        </Menu.Item>
                      ))}
                    </div>
                  ))}
                </Menu.Items>
              </Menu>
            ) : (
              <div className="flex flex-row items-center space-x-4 text-black">
                <Link href={"/auth/login"}>
                  <div className="transition-all duration-500 hover:bg-blue-400 hover:text-white rounded-md px-2 py-1 cursor-pointer">
                    Entrar
                  </div>
                </Link>
                <Link href={"/auth/register"}>
                  <div className="transition-all duration-500  bg-gradient-to-br from-violet-400 via-blue-400 to-violet-500 bg-size-200 bg-pos-0 hover:bg-pos-100  px-2 py-1 rounded-md text-white cursor-pointer">
                    Registar
                  </div>
                </Link>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
