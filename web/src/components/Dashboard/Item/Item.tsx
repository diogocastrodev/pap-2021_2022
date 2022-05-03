interface props {
  children: React.ReactChild | React.ReactChild[];
  className?: string;
  extra?: React.HTMLProps<HTMLDivElement>;
}

export default function Item(props: props) {
  return (
    <>
      <div
        className={`w-full h-full bg-white rounded-lg shadow-lg ${props.className?.concat(
          props.extra?.className ?? ""
        )}`}
        {...props.extra}
      >
        {props.children}
      </div>
    </>
  );
}
