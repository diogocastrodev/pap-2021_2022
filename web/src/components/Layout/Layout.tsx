import Navbar from "../NavBar/NavBar";
interface props {
  children: React.ReactNode;
}

export default function Layout(props: props) {
  return (
    <div className="min-h-screen min-w-screen bg-bgWhite font-inter text-black relative overflow-x-hidden flex flex-col">
      <div className="relative z-50">
        <Navbar />
      </div>
      <div className="mx-2 mt-2">{props.children}</div>
    </div>
  );
}
