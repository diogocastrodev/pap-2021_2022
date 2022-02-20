import {
  SearchIcon,
  CogIcon,
  UserIcon,
  LogoutIcon,
  ArchiveIcon,
} from "@heroicons/react/solid";
import TextInput from "../Form/Inputs/TextInput";
import { Menu } from "@headlessui/react";
import { getTheme } from "@src/functions/changeTheme";
import { useContext, useEffect, useState } from "react";
import { changeTheme } from "../../functions/changeTheme";
import ThemeButton from "./ThemeButton/ThemeButton";
import NotificationsButton, {
  notificationsProps,
} from "./Notifications/NotificationsButton";
import { AuthContext } from "@src/context/AuthContext";
import Link from "next/link";
import { useRouter } from "next/router";
import { useHookstate } from "@hookstate/core";
import Image from "next/image";
import UserAvatar from "../user/items/Avatar/UserAvatar";

interface props {}

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

  const dummyNotifications: notificationsProps = [
    {
      notificationId: 3,
      title: "Product Check",
      message: "Notification Test",
      isNew: true,
      date: "2022-01-04 20:01:00",
    },
    {
      notificationId: 4,
      title: "Product Check",
      message: "Notification Test",
      isNew: false,
      date: "2021-12-10 18:06:13",
    },
  ];

  const DropDownItems: DropDownProps = [
    {
      text: "Account",
      divider: true,
      items: [
        {
          text: "Profile",
          href: "/profile",
          icon: <UserIcon />,
        },
        {
          text: "My Items",
          href: "/user/items",
          icon: <SearchIcon />,
        },
        {
          text: "My Collections",
          href: "/user/collections",
          icon: <ArchiveIcon />,
        },
      ],
    },
    {
      text: "Preferences",
      items: [
        {
          text: "Settings",
          href: "/user/settings",
          icon: <CogIcon />,
        },
        {
          text: "Logout",
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

  return (
    <div className="h-12 w-screen shadow-lg sticky -top-0.5 bg-bgWhite overflow-hidden z-50">
      <div className="px-4 h-full flex">
        <div className="w-full flex flex-row items-center">
          <div className="text-black font-extrabold text-3xl">
            <Link href={"/"}>
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-cyan-500 select-none cursor-pointer">
                {"pap"}
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
          {user.AuthData.is_logged && (
            <div className="mr-4">
              <NotificationsButton notifications={dummyNotifications} />
            </div>
          )}
          {user.AuthData.is_logged ? (
            <Menu as="div" className={"relative"}>
              <Menu.Button as="div">
                <UserAvatar className="w-8 h-8 cursor-pointer" />
              </Menu.Button>
              <Menu.Items
                as="div"
                className={
                  "fixed z-[100] top-11 select-none right-6 w-56 min-h space-y-1 bg-neutral-200 py-4 px-4 rounded-lg shadow-lg focus:outline-none"
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
                          <a href={item.href}>
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
                          </a>
                        )}
                      </Menu.Item>
                    ))}
                  </div>
                ))}
              </Menu.Items>
            </Menu>
          ) : (
            <div className="flex flex-row space-x-4 text-black">
              <Link href={"/auth/login"}>Login</Link>
              <Link href={"/auth/register"}>Register</Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
