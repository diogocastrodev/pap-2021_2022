import SettingsPageLayout from "@components/Settings/SettingsPageLayout";
import Form from "@components/Form/Form/Form";
import { gql } from "graphql-request";
import { gqlClient } from "@libs/graphql-request";
import { FormEvent, useContext, useState } from "react";
import { AuthContext } from "@context/AuthContext";
import Input from "@components/Form/Inputs/Input";
import InputGroup from "@components/Form/Inputs/InputGroup";
import Label from "@components/Form/Inputs/Label";
import Button from "@components/Form/Buttons/Button";
import { toast } from "react-toastify";

const deactivateAccount = gql`
  mutation deactivateUser($password: String!) {
    deactivateUser(password: $password)
  }
`;

export default function DeactivateSettings() {
  const { logout } = useContext(AuthContext);

  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    setError("");

    if (password === "") setError("A senha não pode ser vazia");

    await gqlClient
      .request(deactivateAccount, {
        password,
      })
      .then((res) => {
        if (res.deactivateUser) {
          toast.success("Conta desativada com sucesso");
          logout();
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }
  return (
    <>
      <SettingsPageLayout>
        <div>
          <div className="text-xl font-semibold">Desativar conta</div>
          <div className="px-2 mt-2">
            No momento que clicar no botão para desativar a conta, este email
            irá ficar inválido tanto para acessar o site quanto para criar uma
            nova conta.
          </div>
          <Form
            onSubmit={handleSubmit}
            method="POST"
            className=" sm:w-108 mt-4"
          >
            <InputGroup>
              <Label text="Password" />
              <Input
                input={{
                  type: "password",
                  onChange: (e) => setPassword(e.target.value),
                }}
              />
            </InputGroup>
            <Button type="submit" className="bg-red-400 mt-4">
              Desativar a conta
            </Button>
            <div className="mt-3 text-red-500">{error}</div>
          </Form>
        </div>
      </SettingsPageLayout>
    </>
  );
}
