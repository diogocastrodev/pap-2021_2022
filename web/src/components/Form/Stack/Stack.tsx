interface props extends React.HTMLProps<HTMLDivElement> {
  children?: React.ReactNode | React.ReactNode[] | undefined;
  type?: "col" | "row";
}

export default function Stack(props: props) {
  return (
    <>
      <div
        {...props}
        className={`flex ${props.type === "col" ? "flex-col" : "flex-row"} ${
          props.className || ""
        }`}
      >
        {props.children}
      </div>
    </>
  );
}
