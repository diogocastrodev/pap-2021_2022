import SettingsPageLayout from "@src/components/Settings/SettingsPageLayout";
import Logo from "@public/logo.svg";

export default function SettingsPage() {
  return (
    <SettingsPageLayout>
      <div className="fill-green-500">
        <img
          src={Logo.src}
          alt=""
          height={Logo.height + 200}
          width={Logo.width + 200}
          className="w-36 md:ml-8 sm:w-48 md:w-52 lg:w-80 xl:w-96 fill-green-400"
        />
      </div>
    </SettingsPageLayout>
  );
}
