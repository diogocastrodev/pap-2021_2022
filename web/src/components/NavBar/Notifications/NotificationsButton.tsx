import { Menu } from "@headlessui/react";
import { BellIcon } from "@heroicons/react/solid";
import moment from "moment";
import "moment/locale/pt";

export type notificationsProps = {
  notificationId: number;
  title: string;
  message: string;
  isNew: boolean;
  date: string;
}[];

interface props {
  notifications: notificationsProps;
}

export default function NotificationsButton(props: props) {
  return (
    <Menu as="div" className={`relative`}>
      <Menu.Button>
        <div className="focus:outline-none px-1 py-1 flex items-center justify-center hover:bg-gray-200 text-black rounded-full">
          <BellIcon className="w-5" />
        </div>
      </Menu.Button>
      <Menu.Items as="div">
        <div
          className={`absolute select-none top-10 -right-8 w-80 max-h-64 space-y-1 bg-neutral-200 py-4 px-4 rounded-lg overflow-y-auto overflow-x-hidden shadow-lg z-[100]`}
        >
          {props.notifications.map((item, key: number) => (
            <Menu.Item
              as="div"
              className={`w-full h-full bg-transparent overflow-ellipsis `}
              key={key}
            >
              {({ active }) => (
                <div
                  className={`${
                    active
                      ? "bg-neutral-300 text-black text-opacity-80"
                      : "bg-transparent text-black"
                  } w-full cursor-pointer pl-2 rounded-lg py-0.5 text-clip overflow-hidden text-lg break-words  ${
                    !item.isNew && "opacity-50"
                  }`}
                >
                  <div
                    className={`flex flex-row ${
                      item.isNew ? "text-xl" : "text-base"
                    }`}
                  >
                    {item.title}
                    {item.isNew && (
                      <span className="flex h-2 w-2 relative ml-auto mr-1.5 mt-1">
                        <span className="animate-ping h-full w-full rounded-full bg-sky-400 opacity-75"></span>
                        <span className="absolute rounded-full h-2 w-2 bg-sky-500"></span>
                      </span>
                    )}
                  </div>
                  <div
                    className={`${
                      item.isNew ? "text-base" : "text-sm"
                    } text-gray-700`}
                  >
                    {item.message}
                  </div>

                  <div
                    className={`flex ${
                      item.isNew ? "text-xs" : "text-xs"
                    } text-gray-600`}
                  >
                    <div className="ml-auto mt-1 mr-2">
                      {moment(item.date, "YYYY-MM-DD HH:mm:ss").fromNow()}
                    </div>
                  </div>
                </div>
              )}
            </Menu.Item>
          ))}
        </div>
      </Menu.Items>
    </Menu>
  );
}
