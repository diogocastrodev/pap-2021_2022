import { AuthContext } from "@src/context/AuthContext";
import { useContext, useState } from "react";
import TextInput from "../../components/Form/Inputs/TextInput";
import Button from "../../components/Form/Buttons/Button";

export default function loginPage() {
  const [Email, setEmail] = useState<string>("");
  const [Password, setPassword] = useState<string>("");
  const Auth = useContext(AuthContext);
  return (
    <div className="h-full w-full flex items-center justify-center absolute">
      <div className="h-108 w-96 bg-neutral-50 shadow-xl inset-x-auto -top-20 rounded-xl">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            Auth.login(Email, Password);
          }}
          className="h-full"
        >
          <div className="text-3xl text-black text-center mt-8 mb-4">Login</div>
          <div className="flex justify-center items-center flex-col">
            <TextInput
              input={{
                type: "text",
                color: "default",
                setValue: (e) => setEmail(e.target.value),
                shadow: true,
              }}
              label={{
                text: "Email",
              }}
            />
            <TextInput
              input={{
                type: "password",
                color: "default",
                setValue: (e) => setPassword(e.target.value),
                shadow: true,
                autoComplete: "on",
              }}
              label={{
                text: "Password",
              }}
            />
            <Button
              mainDiv={{
                className: "mt-6",
              }}
              button={{
                buttonType: "submit",
                label: "Login",
                color: "blue",
              }}
            />
          </div>
        </form>
      </div>
    </div>
  );
}
