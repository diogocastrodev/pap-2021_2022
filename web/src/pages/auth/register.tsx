import { gql } from "@apollo/client";
import Button from "@components/Form/Buttons/Button";
import Form from "@components/Form/Form/Form";
import Input from "@components/Form/Inputs/Input";
import InputGroup from "@components/Form/Inputs/InputGroup";
import Stack from "@components/Form/Stack/Stack";
import { routes } from "@functions/routes";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Label from "@components/Form/Inputs/Label";
import { gqlClient } from "@libs/graphql-request";
import Head from "next/head";
import AuthLayout from "@components/Auth/AuthLayout";

const registerMutation = gql`
  mutation register($email: String!, $password: String!) {
    register(email: $email, password: $password)
  }
`;

export default function RegisterPage() {
  const [Email, setEmail] = useState("");
  const [Password, setPassword] = useState("");
  const [ConfPassword, setConfPassword] = useState("");

  const [error, setError] = useState<string | undefined>(undefined);

  const router = useRouter();

  useEffect(() => {
    if (Password.length < 8 || Password.length > 32) {
      setError("A senha deve ter entre 8 e 32 caracteres");
    } else {
      setError(undefined);
    }
  }, [Password]);

  useEffect(() => {
    if (Password !== ConfPassword) {
      setError("As senhas não coincidem");
    } else {
      setError(undefined);
    }
  }, [ConfPassword]);

  return (
    <>
      <Head>
        <title>Registo | note.so</title>
      </Head>
      <AuthLayout>
        <div className="h-full w-full flex items-center justify-center absolute z-20">
          <div className="h-108 w-132 bg-neutral-50 shadow-xl inset-x-auto -top-20 rounded-xl">
            <Form
              onSubmit={(e) => {
                e.preventDefault();
                if (
                  Password.length >= 8 &&
                  Password.length <= 32 &&
                  Password === ConfPassword
                ) {
                  setError(undefined);
                  gqlClient
                    .request(registerMutation, {
                      email: Email,
                      password: Password,
                    })
                    .then(() => {
                      routes.redirect("/auth/login");
                    })
                    .catch((e) => {
                      const error: string = e.message.split(":")[1];
                      if (error.match("Error creating user")) {
                        setError("Erro ao criar o utilizador");
                      }
                      if (error.match("Invalid password")) {
                        setError(
                          "Senha inválida, deve ter entre 8 e 32 caracteres"
                        );
                      }
                      if (error.match("Invalid email")) {
                        setError("Email inválido");
                      }
                    });
                }
              }}
              className="h-full"
            >
              <div className="text-3xl text-black text-center mt-6 mb-4">
                Registar
              </div>
              <Stack type="col" className="px-6">
                <InputGroup>
                  <Label text="Email" />
                  <Input
                    input={{
                      type: "text",
                      placeholder: "Email",
                      onChange: (e) => setEmail(e.target.value),
                      value: Email,
                    }}
                  />
                </InputGroup>
                <InputGroup>
                  <Label text="Senha" />
                  <Input
                    input={{
                      type: "password",
                      placeholder: "Senha",
                      onChange: (e) => setPassword(e.target.value),
                      autoComplete: "on",
                    }}
                  />
                </InputGroup>
                <InputGroup>
                  <Label text="Confirmar Senha" />
                  <Input
                    input={{
                      type: "password",
                      placeholder: "Confirmar Senha",
                      onChange: (e) => setConfPassword(e.target.value),
                    }}
                  />
                </InputGroup>
                <Button type="submit" className="mt-4">
                  Registar
                </Button>
                {error && (
                  <div className="text-red-500 text-center mt-4">{error}</div>
                )}
              </Stack>
            </Form>
          </div>
        </div>
      </AuthLayout>
    </>
  );
}
