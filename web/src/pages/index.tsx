import IndexNotes from "@public/index_notes.svg";
import Stack from "@src/components/Form/Stack/Stack";
import Button from "@components/Form/Buttons/Button";
import { useRouter } from "next/router";
import { useContext } from "react";
import { AuthContext } from "@src/context/AuthContext";

export default function indexPage() {
  const router = useRouter();
  const user = useContext(AuthContext);
  return (
    <div className="w-full flex justify-center mt-48">
      <div className="w-full grid grid-cols-2 grid-rows-1">
        <div className="flex flex-col min-w-fit w-full lg:mt-16 text-3xl pl-10 md:pl-48 z-10">
          <div>
            <span>
              <span className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-violet-500 to-blue-400 pr-2">
                note.so
              </span>
              aplicação de notas para ajudar você a organizar suas anotações
            </span>
          </div>
          <Stack type="row" className="mt-4 space-x-4">
            {!user.AuthData.loading &&
              (!user.AuthData.is_logged ? (
                <>
                  <Button
                    type="button"
                    className="transition-all duration-500  bg-gradient-to-br from-violet-400 via-blue-400 to-violet-500 bg-size-200 bg-pos-0 hover:bg-pos-100 text-xl"
                    onClick={() => {
                      router.push("/auth/register");
                    }}
                  >
                    Criar Conta
                  </Button>
                  <Button
                    type="button"
                    className="transition-all duration-500 bg-blue-400 hover:bg-blue-500 text-xl"
                    onClick={() => {
                      router.push("/auth/login");
                    }}
                  >
                    Entrar
                  </Button>
                </>
              ) : (
                <Button
                  type="button"
                  className="transition-all duration-500  bg-gradient-to-br from-violet-400 via-blue-400 to-violet-500 bg-size-200 bg-pos-0 hover:bg-pos-100 text-xl"
                  onClick={() => {
                    router.push("/dashboard");
                  }}
                >
                  Avançar para a Dashboard
                </Button>
              ))}
          </Stack>
        </div>
        <div className="ml-8">
          <img
            src={IndexNotes.src}
            alt=""
            height={IndexNotes.height + 200}
            width={IndexNotes.width + 200}
            className="w-36 md:ml-8 sm:w-48 md:w-52 lg:w-80 xl:w-96"
          />
        </div>
      </div>
    </div>
  );
}
