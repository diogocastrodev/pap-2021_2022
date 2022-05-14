import SettingsPageLayout from "@components/Settings/SettingsPageLayout";
import Form from "@components/Form/Form/Form";
import InputGroup from "@components/Form/Inputs/InputGroup";
import Input from "@components/Form/Inputs/Input";
import Label from "@components/Form/Inputs/Label";
import { AuthContext } from "@context/AuthContext";
import { useContext, useEffect, useState } from "react";

export default function SettingsPage() {
  const { AuthData } = useContext(AuthContext);

  const [email, setEmail] = useState<string>("");

  useEffect(() => {
    if (!AuthData.loading && AuthData.user) {
      setEmail(AuthData.user!.email);
    }
  }, [AuthData.loading || !AuthData.user]);

  return (
    <SettingsPageLayout>
      <div>
        <div className="text-xl font-semibold">Alteração de dados</div>
        <Form
          method="POST"
          onSubmit={() => {
            console.log("submit");
          }}
          className="mt-4 space-y-4"
        >
          <InputGroup className="">
            <Label text="Email"></Label>
            <Input
              input={{
                type: "text",
                className: "w-64",
                value: email,
                onChange: (e) => setEmail(e.target.value),
              }}
            ></Input>
          </InputGroup>
        </Form>
      </div>
    </SettingsPageLayout>
  );
}
