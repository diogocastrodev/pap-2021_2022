import { AuthContext } from "@context/AuthContext";
import { useContext, useState } from "react";
import Input from "@components/Form/Inputs/Input";
import Button from "@components/Form/Buttons/Button";
import Form from "@components/Form/Form/Form";
import Stack from "@components/Form/Stack/Stack";
import InputGroup from "@components/Form/Inputs/InputGroup";
import Label from "@components/Form/Inputs/Label";
import Head from "next/head";
import AuthLayout from "@components/Auth/AuthLayout";

export default function loginPage() {
  const [Email, setEmail] = useState<string>("");
  const [Password, setPassword] = useState<string>("");
  const [error, setError] = useState<string | undefined>(undefined);
  const Auth = useContext(AuthContext);
  return (
    <>
      <Head>
        <title>Entrar | note.so</title>
      </Head>
      <AuthLayout>
        <div className="h-full w-full flex items-center justify-center absolute z-20">
          <div className="h-108 w-96 bg-neutral-50 shadow-xl inset-x-auto -top-20 rounded-xl">
            <Form
              onSubmit={async (e) => {
                e.preventDefault();
                try {
                  await Auth.login(Email, Password);
                } catch (err) {
                  setError("Login inválido");
                }
              }}
              className="h-full"
            >
              <div className="text-3xl text-black text-center mt-8 mb-4">
                Entrar
              </div>
              <Stack className="flex justify-center items-center flex-col space-y-2">
                <InputGroup>
                  <Label text="Email" required={true} />
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
                  <Label text="Password" required={true} />
                  <Input
                    input={{
                      type: "password",
                      placeholder: "Password",
                      onChange: (e) => setPassword(e.target.value),
                      autoComplete: "on",
                    }}
                  />
                </InputGroup>
                <Button type="submit" color="blue">
                  Login
                </Button>
                {error && <div className="text-red-500">{error}</div>}
              </Stack>
            </Form>
          </div>
        </div>
      </AuthLayout>
    </>
  );
}
