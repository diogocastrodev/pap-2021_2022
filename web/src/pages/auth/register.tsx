import { gql, useMutation } from "@apollo/client";
import Button from "@src/components/Form/Buttons/Button";
import Form from "@src/components/Form/Form/Form";
import Input from "@src/components/Form/Inputs/Input";
import InputGroup from "@src/components/Form/Inputs/InputGroup";
import Stack from "@src/components/Form/Stack/Stack";
import { routes } from "@src/functions/routes";
import { useRouter } from "next/router";
import { useState } from "react";
import Label from "../../components/Form/Inputs/Label";

const registerMutation = gql`
  mutation register($data: RegisterInput!) {
    register(data: $data)
  }
`;

export default function RegisterPage() {
  const [Email, setEmail] = useState("");
  const [Password, setPassword] = useState("");
  const [ConfPassword, setConfPassword] = useState("");
  const [PhoneNumber, setPhoneNumber] = useState("");

  const [registerFunction] = useMutation(registerMutation);

  const router = useRouter();

  return (
    <>
      <div className="h-full w-full flex items-center justify-center absolute">
        <div className="h-108 w-132 bg-neutral-50 shadow-xl inset-x-auto -top-20 rounded-xl">
          <Form
            onSubmit={(e) => {
              e.preventDefault();
              /* TODO: Register */
              if (Password === ConfPassword) {
                registerFunction({
                  variables: {
                    data: {
                      email: Email,
                      password: Password,
                    },
                  },
                })
                  .then(() => {
                    routes.redirect("/auth/login");
                  })
                  .catch((e) => {
                    console.log(e);
                  });
              }
            }}
            className="h-full"
          >
            <div className="text-3xl text-black text-center mt-6 mb-4">
              Register
            </div>
            <Stack type="col">
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
                <Label text="Password" />
                <Input
                  input={{
                    type: "password",
                    placeholder: "Password",
                    onChange: (e) => setPassword(e.target.value),
                    autoComplete: "on",
                  }}
                />
              </InputGroup>
              <InputGroup>
                <Label text="Confirmar Password" />
                <Input
                  input={{
                    type: "password",
                    placeholder: "Confirmar Password",
                    onChange: (e) => setConfPassword(e.target.value),
                  }}
                />
              </InputGroup>
              <Button type="submit" className="mt-4">
                Register
              </Button>
            </Stack>
          </Form>
        </div>
      </div>
    </>
  );
}
