import Link from "next/link";
import Stack from "@components/Form/Stack/Stack";
import { BanIcon, CogIcon } from "@heroicons/react/outline";

interface props {
  children: React.ReactNode | React.ReactNode[];
}

interface ISettingsList {
  text: string;
  href: string;
  icon?: React.ReactElement;
  onClick?: () => void;
}

const SettingsList: ISettingsList[] = [
  {
    text: "Conta",
    href: "/user/settings",
    icon: <CogIcon />,
  },
  {
    text: "Desativar",
    href: "/user/deactivate",
    icon: <BanIcon />,
  },
];

export default function SettingsPageLayout({ children }: props) {
  return (
    <>
      <div className="w-full grid grid-cols-4 gap-2">
        <div className="col-span-1">
          <div className="py-2 px-2 bg-white rounded-md">
            <div className="text-lg border-b-2 border-b-gray-100 mb-1">
              Definições
            </div>
            <Stack type="col" className="mt-1 space-y-1">
              {SettingsList.map((item, i) => (
                <Link key={i} href={item.href}>
                  <Stack type="row" className="items-center cursor-pointer">
                    <div className="w-5 mr-1">{item.icon}</div>
                    {item.text}
                  </Stack>
                </Link>
              ))}
            </Stack>
          </div>
        </div>
        <div className="col-start-2 col-end-5 bg-white rounded-md">
          {children}
        </div>
      </div>
    </>
  );
}
