import Head from "next/head";
import Link from "next/link";

export default function NotFoundPage() {
  return (
    <>
      <Head>
        <title>404 | note.so</title>
      </Head>
      <div className="w-screen -mt-40 h-screen flex flex-col items-center justify-center text-black">
        <div className="text-4xl font-bold">404</div>
        <div className="text-lg mt-6 flex flex-col text-center">
          Não foi possivel encontrar esta página... <br />
          <span className="cursor-pointer text-blue-500 hover:text-blue-600">
            <Link href={`/`}>Deseja voltar para o início?</Link>
          </span>
        </div>
      </div>
    </>
  );
}
