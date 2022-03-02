import { AuthContext } from "@src/context/AuthContext";
import { useContext, useState } from "react";
import Input from "../../components/Form/Inputs/Input";
import Button from "../../components/Form/Buttons/Button";
import Form from "@src/components/Form/Form/Form";
import Stack from "@src/components/Form/Stack/Stack";
import InputGroup from "../../components/Form/Inputs/InputGroup";
import Label from "@src/components/Form/Inputs/Label";

export default function loginPage() {
  const [Email, setEmail] = useState<string>("");
  const [Password, setPassword] = useState<string>("");
  const Auth = useContext(AuthContext);
  return (
    <div className="h-full w-full flex items-center justify-center absolute">
      <div className="h-108 w-96 bg-neutral-50 shadow-xl inset-x-auto -top-20 rounded-xl">
        <Form
          onSubmit={(e) => {
            e.preventDefault();
            Auth.login(Email, Password);
          }}
          className="h-full"
        >
          <div className="text-3xl text-black text-center mt-8 mb-4">Login</div>
          <Stack className="flex justify-center items-center flex-col space-y-2">
            <InputGroup>
              <Label text="Email" required={true} />
              <Input
                type="text"
                placeholder="Email"
                onChange={(e) => setEmail(e.target.value)}
                value={Email}
              />
            </InputGroup>
            <InputGroup>
              <Label text="Password" required={true} />
              <Input
                type="password"
                placeholder="Password"
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="on"
              />
            </InputGroup>
            <Button type="submit" color="blue">
              Login
            </Button>
          </Stack>
        </Form>
      </div>
    </div>
  );
}
