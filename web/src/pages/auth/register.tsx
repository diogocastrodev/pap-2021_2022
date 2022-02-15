import { gql, useMutation } from "@apollo/client";
import Button from "@src/components/Form/Buttons/Button";
import TextInput from "@src/components/Form/Inputs/TextInput";
import { useRouter } from "next/router";
import { useState } from "react";

const registerMutation = gql`
  mutation register($data: RegisterInput!) {
    register(data: $data)
  }
`;

export default function RegisterPage() {
  const [Email, setEmail] = useState("");
  const [Username, setUsername] = useState("");
  const [Password, setPassword] = useState("");
  const [ConfPassword, setConfPassword] = useState("");
  const [PhoneNumber, setPhoneNumber] = useState("");

  const [registerFunction] = useMutation(registerMutation);

  const router = useRouter();

  return (
    <div className="h-full w-full flex items-center justify-center absolute">
      <div className="h-108 w-132 bg-neutral-50 shadow-xl inset-x-auto -top-20 rounded-xl">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            /* TODO: Register */
            if (Password === ConfPassword) {
              registerFunction({
                variables: {
                  data: {
                    email: Email,
                    username: Username,
                    password: Password,
                    /* TODO: phoneNumber */
                    /* phoneNumber: PhoneNumber, */
                  },
                },
              })
                .then(() => {
                  /* TODO: Router Push -> Login */
                  router.push({
                    href: "/login?success=true",
                  });
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
          <div className="flex justify-center items-center flex-wrap">
            <div className="flex flex-row">
              {/* Email */}
              <TextInput
                input={{
                  type: "text",
                  color: "default",
                  setValue: (e) => setEmail(e.target.value),
                  shadow: true,
                  required: true,
                  placeholder: "Email",
                  space: true,
                }}
                label={{
                  text: "Email",
                }}
              />
              {/* Username */}
              <TextInput
                input={{
                  type: "text",
                  color: "default",
                  setValue: (e) => setUsername(e.target.value),
                  shadow: true,
                  required: true,
                  placeholder: "Username",
                  space: true,
                }}
                label={{
                  text: "Username",
                }}
              />
            </div>
            <div className="flex flex-row">
              {/* Password */}
              <TextInput
                input={{
                  type: "password",
                  color: "default",
                  setValue: (e) => setPassword(e.target.value),
                  shadow: true,
                  autoComplete: "on",
                  required: true,
                  placeholder: "Password",
                  space: true,
                }}
                label={{
                  text: "Password",
                }}
              />
              {/* Conf Password */}
              <TextInput
                input={{
                  type: "password",
                  color: "default",
                  setValue: (e) => setConfPassword(e.target.value),
                  shadow: true,
                  autoComplete: "on",
                  required: true,
                  placeholder: "Confirmar Password",
                  space: true,
                }}
                label={{
                  text: "Confirmar Password",
                }}
              />
            </div>
            {/* Phone Number */}
            <TextInput
              input={{
                type: "text",
                color: "default",
                setValue: (e) => setPhoneNumber(e.target.value),
                shadow: true,
                autoComplete: "on",
                required: false,
                placeholder: "Phone Number",
                space: true,
                icon: {
                  inputIcon: <div className="pr-1">+351</div>,
                },
              }}
              label={{
                text: "Phone Number",
              }}
            />
            <Button
              mainDiv={{
                className: "mt-6",
              }}
              button={{
                buttonType: "submit",
                label: "Register",
                color: "blue",
              }}
            />
          </div>
        </form>
      </div>
    </div>
  );
}
