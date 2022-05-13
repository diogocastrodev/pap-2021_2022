import Logo from "@public/logoNoBorder.svg";

interface props {
  children: React.ReactNode | React.ReactNode[];
}

export default function AuthLayout({ children }: props) {
  return (
    <>
      <div className={``} id="auth-layout"></div>
      {/*   {Array.from({ length: 20 }).map((_, i) => (
        <div className="overflow-hidden translate opacity-20">
          {Array.from({ length: 20 }).map((_, ii) => (
            <div
              key={i}
              style={{
                paddingRight: "24px",
                position: "fixed",
                animationDelay: `${i * 0.1}s`,
                left: `${256 * ii - 1}px`,
                top: `${256 * i - 1}px`,
                width: `${256}px`,
                transform: "rotate(12deg)",
                gridRow: `${i}`,
                gridColumn: `${ii}`,
              }}
            >
              <img src={Logo.src} className={`w-[190px]`} />
            </div>
          ))}
        </div>
      ))} */}
      {/* <div className="fixed -bottom-8 -right-8 overflow-hidden opacity-30 translate rotate-12">
        <img src={Logo.src} />
      </div>
      <div className="fixed -bottom-8 -left-8 overflow-hidden opacity-30 translate rotate-12">
        <img src={Logo.src} />
      </div>
      <div className="fixed -top-8 -right-8 overflow-hidden opacity-30 translate rotate-12">
        <img src={Logo.src} />
      </div>
      <div className="fixed -top-8 -left-8 overflow-hidden opacity-30 translate rotate-12">
        <img src={Logo.src} />
      </div> */}
      <div className="z-20">{children}</div>
    </>
  );
}
