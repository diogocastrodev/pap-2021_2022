import { KeyboardEvent, useEffect, useState } from "react";
import PreMadeDialog from "@components/Dialog/PreMadeDialog";
import AntiFocusTrap from "@components/AntiFocusTrap/AntiFocusTrap";
import hotkeys from "hotkeys-js";
import Input from "@components/Form/Inputs/Input";
import { SearchIcon } from "@heroicons/react/outline";
import { RadioGroup } from "@headlessui/react";
import $ from "jquery";
import Link from "next/link";

type GroupItemsType = {
  text: string;
  value: string;
  href?: string;
  icon?: React.ReactElement;
  onClick?: () => void;
};

const GroupItems: GroupItemsType[] = [
  {
    text: "Search file",
    value: "searchFile",
  },
  {
    text: "Search folder",
    value: "searchFolder",
  },
  {
    text: "Create File",
    value: "createFile",
  },
  {
    text: "Create Folder",
    value: "createFolder",
  },
  {
    text: "Abrir o Calendário",
    value: "openCalendar",
    href: "/dashboard/calendar",
  },
  {
    text: "Abrir a lista de Apontamentos",
    value: "openApontamentos",
    href: "/dashboard/appointments",
  },
];

export default function SearchDialog() {
  const [IsOpen, setIsOpen] = useState<boolean>(false);

  useEffect(() => {
    hotkeys("ctrl+k, command+k", (event, _handler) => {
      event.preventDefault();
      setIsOpen(true);
    });
  }, []);

  const [Search, setSearch] = useState<string>("");
  const [SearchSelected, setSearchSelected] = useState<number>(0);

  const [SearchType, setSearchType] = useState<string>(GroupItems[0].value);

  /* Create movement with up / down and enter keys */
  const handleKeyDown = (event: globalThis.KeyboardEvent) => {
    switch (event.key) {
      /* Down Arrow - bottom to top */
      case "ArrowDown":
        if (SearchSelected < GroupItems.length - 1) {
          setSearchSelected(SearchSelected + 1);
        } else if (SearchSelected === GroupItems.length - 1) {
          setSearchSelected(0);
        }
        break;

      /* Up Arrow - top to bottom */
      case "ArrowUp":
        if (SearchSelected > 0) {
          setSearchSelected(SearchSelected - 1);
        } else if (SearchSelected === 0) {
          setSearchSelected(GroupItems.length - 1);
        }
        break;

      /* Enter */
      case "Enter":
        if (GroupItems[SearchSelected].href) {
          $(`.${GroupItems[SearchSelected].value}`).click();
        }
        break;

      default:
        break;
    }
  };

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [document.onkeydown]);

  return (
    <>
      <PreMadeDialog isOpen={IsOpen} onClose={() => setIsOpen(false)}>
        {/* Wrapper */}
        <div className="mb-1">
          <Input
            input={{
              type: "text",
              placeholder: "O que procura?",
              value: Search,
              onChange: (e) => setSearch(e.target.value),
            }}
            mainDiv={{
              color: "transparent",
            }}
            icon={<SearchIcon />}
          />
        </div>
        <SearchDialogDivider />
        <div className="flex flex-col space-y-1 overflow-y-auto">
          {GroupItems.filter((it) => {
            return (
              it.text.toLowerCase().includes(Search.toLowerCase()) ||
              Search.toLowerCase() === ""
            );
          }).map((item, i) => (
            <Link href={item.href ? item.href : `#`}>
              <div
                className={`focus:outline-none px-4 py-2 flex flex-row items-center rounded-md cursor-pointer ${
                  SearchSelected === i && `bg-blue-200`
                }
                    `}
                id={item.value}
                onClick={item.onClick}
              >
                {item.icon && (
                  <div className="flex items-center flex-none justify-center w-6 h-6  text-black text-opacity-80 mr-2">
                    {item.icon}
                  </div>
                )}
                <div className="font-normal hover:font-medium focus:font-bold">
                  {item.text}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </PreMadeDialog>
    </>
  );
}

function SearchDialogDivider() {
  return <div className="border-b-2 border-neutral-200 pb-2 mb-2"></div>;
}
