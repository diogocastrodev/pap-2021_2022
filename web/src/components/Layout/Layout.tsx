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
      <div className="px-2 py-2 flex-1 flex">{props.children}</div>
    </div>
  );
}
