import SettingsPageLayout from "@components/Settings/SettingsPageLayout";
import Form from "@components/Form/Form/Form";
import InputGroup from "@components/Form/Inputs/InputGroup";
import Input from "@components/Form/Inputs/Input";
import Label from "@components/Form/Inputs/Label";
import { AuthContext } from "@context/AuthContext";
import React, { useContext, useEffect, useState } from "react";
import Button from "@components/Form/Buttons/Button";
import { gql } from "graphql-request";
import { gqlClient } from "@src/libs/graphql-request";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const updateUser = gql`
  mutation updateUser($email: String!) {
    updateUser(email: $email)
  }
`;

const updatePassword = gql`
  mutation updatePassword($oldPassword: String!, $newPassword: String!) {
    updatePassword(oldPassword: $oldPassword, newPassword: $newPassword)
  }
`;

export default function SettingsPage() {
  const { AuthData } = useContext(AuthContext);

  const [email, setEmail] = useState<string>("");
  const [emailError, setEmailError] = useState<string>("");

  const [oldPassword, setOldPassword] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmNewPassword, setConfirmNewPassword] = useState<string>("");

  const [pwdError, setPwdError] = useState<string>("");

  useEffect(() => {
    if (!AuthData.loading && AuthData.user) {
      setEmail(AuthData.user!.email);
    }
  }, [AuthData.loading || !AuthData.user]);

  function clearErrors() {
    setEmailError("");
    setPwdError("");
  }

  async function handleEmail(e: React.FormEvent) {
    e.preventDefault();
    clearErrors();

    if (email === "") setEmailError("O email não deve ser vazio");

    if (email === AuthData.user!.email)
      setEmailError("O email não pode ser o mesmo");

    await gqlClient
      .request(updateUser, { email })
      .then((res) => {
        if (res.updateUser) {
          AuthData.user!.email = email;
          toast.success("Email atualizado com sucesso");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }

  async function handlePasswords(e: React.FormEvent) {
    e.preventDefault();
    clearErrors();

    if (oldPassword === "" || newPassword === "" || confirmNewPassword === "")
      setPwdError("Preencha todos os campos");

    if (newPassword !== confirmNewPassword)
      setPwdError("As senhas novas não são iguais");

    await gqlClient
      .request(updatePassword, { oldPassword, newPassword, confirmNewPassword })
      .then((res) => {
        if (res.updatePassword) {
          toast("Senha alterada com sucesso");
        }
      })
      .catch((err) => {
        console.log(err);
        setPwdError("Senha inválida");
      });
  }

  return (
    <SettingsPageLayout>
      <div>
        <div className="text-xl font-semibold">Alteração de dados</div>
        <div className="mx-1 sm:w-108">
          <Form method="POST" onSubmit={handleEmail} className="mt-4 space-y-4">
            <div className="text-xl font-medium">Alteração de Email</div>
            <div className="ml-2">
              <InputGroup className="">
                <Label text="Email"></Label>
                <Input
                  input={{
                    type: "text",
                    value: email,
                    onChange: (e) => setEmail(e.target.value),
                  }}
                />
              </InputGroup>
              <Button className="my-2">Guardar</Button>
              <div className="mt-3 text-red-500">{emailError}</div>
            </div>
          </Form>
          <Form
            method="POST"
            onSubmit={handlePasswords}
            className="mt-4 space-y-4"
          >
            <div className="text-xl font-medium">Alteração de Senha</div>
            <div className="ml-2 space-y-2">
              <InputGroup className="">
                <Label text="Senha Atual"></Label>
                <Input
                  input={{
                    type: "password",
                    onChange: (e) => setOldPassword(e.target.value),
                  }}
                />
              </InputGroup>
              <InputGroup className="">
                <Label text="Senha Nova"></Label>
                <Input
                  input={{
                    type: "password",
                    onChange: (e) => setNewPassword(e.target.value),
                  }}
                />
              </InputGroup>
              <InputGroup className="">
                <Label text="Confirmar Senha Nova"></Label>
                <Input
                  input={{
                    type: "password",
                    onChange: (e) => setConfirmNewPassword(e.target.value),
                  }}
                />
              </InputGroup>
              <Button className="my-2">Alterar senha</Button>
              <div className="mt-3 text-red-500">{pwdError}</div>
            </div>
          </Form>
        </div>
      </div>
    </SettingsPageLayout>
  );
}
