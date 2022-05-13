import Head from "next/head";
import { useRouter } from "next/router";
import Navbar from "../NavBar/NavBar";
interface props {
  children: React.ReactNode;
}

export default function Layout(props: props) {
  const router = useRouter();

  const routerPath = router.pathname;

  const isHome = routerPath === "/";
  return (
    <>
      <Head>
        <title>note.so</title>
      </Head>
      <div className="min-h-screen min-w-screen bg-bgWhite font-inter text-black relative overflow-x-hidden flex flex-col">
        <div className="relative z-50">
          <Navbar initialPage={isHome} />
        </div>
        <div className="px-2 py-2 flex-1 flex">{props.children}</div>
      </div>
    </>
  );
}
