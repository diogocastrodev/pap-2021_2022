import Link from "next/link";
import Stack from "@components/Form/Stack/Stack";
import { BanIcon, CogIcon } from "@heroicons/react/outline";
import { AuthContext } from "@src/context/AuthContext";
import { forwardRef, useContext, useEffect } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import NeedLogin from "../Login/NeedLogin";

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
    href: "/user/settings/deactivate",
    icon: <BanIcon />,
  },
];

type Props = { children: React.ReactNode; href: string };

const CustomLink = forwardRef<HTMLAnchorElement, Props>((props, ref) => {
  const { href, children, ...rest } = props;
  return (
    <>
      <Link href={href}>
        <a ref={ref} {...rest}>
          {children}
        </a>
      </Link>
    </>
  );
});

export default function SettingsPageLayout({ children }: props) {
  return (
    <>
      <Head>
        <title>Definições | note.so</title>
      </Head>
      <NeedLogin>
        <div className="w-full grid grid-cols-4 gap-2">
          <div className="col-span-1">
            <div className="py-2 px-2 bg-white rounded-md">
              <div className="text-lg border-b-2 border-b-gray-100 mb-1">
                Definições
              </div>
              <Stack type="col" className="mt-1 space-y-1">
                {SettingsList.map((item, i) => (
                  <CustomLink key={i} href={item.href}>
                    <Stack type="row" className="items-center cursor-pointer">
                      <div className="w-5 mr-1">{item.icon}</div>
                      {item.text}
                    </Stack>
                  </CustomLink>
                ))}
              </Stack>
            </div>
          </div>
          <div className="col-start-2 col-end-5 bg-white rounded-md p-3">
            {children}
          </div>
        </div>
      </NeedLogin>
    </>
  );
}
